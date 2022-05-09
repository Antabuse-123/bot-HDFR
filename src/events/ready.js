const Sequelize = require("sequelize")
const { Client } = require("root-me-api-wrapper");
const { rootMeApiKey,announceChannelId } = require("../../config.json");
const { MessageEmbed, Message } = require("discord.js");
const { Users_db } = require('../db-tables')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		// Setting the bot status
		client.user.setActivity("Watching for new CTFs");
		// Loading the DB
		Users_db.sync();
		// Function to refresh the DB
		async function worker(){
			console.log("Started Worker at " + new Date().toLocaleString());
			// Creating the client to interact with the Root-me API
			let rmclient = new Client(rootMeApiKey);
			// Getting the list of ids in the DB
			let tmp = await Users_db.findAll({attributes : ["id"]});
			let ids = tmp.map(user=> user.id);
			for(let id of ids){
				// Avoid the rate limit of the Root-me API
				await new Promise(f => setTimeout(f, 500));
				// Getting the user from the Root-me API
				let nuser = await rmclient.getUser(id);
				// If the is an error the id of the user will be -1
				if(nuser.getId() === -1){
					console.error("Error while getting the user with id " + id);
					continue;
				}
				// Getting specific information from the user
				let user = await Users_db.findOne({where: {id: id}});
				// Itterating over the user's solved challenges
				for(let solved of nuser.getSolve()){
					// If the user has solved a new challenge
					if(!user.solve.includes(solved)){
						// Get the challenge properties from the Root-me API
						let chall = await rmclient.getChallenge(solved);
						// Create a new embed
						let embed = new MessageEmbed();
						embed.setTitle("New challenge solved!");
						embed.setDescription(`${nuser.getName()} solved :${chall.getTitle()}`);
						embed.addField("New Score", `${user.score + chall.getPoints()}`);
						embed.setColor("#00ff00");
						// Update the DB
						let affectedrow = await Users_db.update({
							score: nuser.getScore(),
							solve: nuser.getSolve(),
							rank: nuser.getRank(),
							title: nuser.getTitle(),
						}, {where: {id: id}});

						let users = await Users_db.findAll({attributes : ["name", "score"]});
						let scoreboard = [];
						users.map(user=> scoreboard.push([user.name,user.score]));
						//sort the array
						scoreboard.sort((a,b)=> b[1] - a[1]);
						let next = scoreboard.findIndex(e => e[0] === nuser.getName());
						if(next !== 0){
							next--;
							embed.setFooter({text : `${scoreboard[next][1] - scoreboard[next +1][1]} to overtake : ${scoreboard[next][0]}`});
						}
						else{
							embed.setFooter({text: `congratulations! you are the first!`});
						}
						// Checks if the update was successful
						if (!(affectedrow > 0)) {
							console.error(`Failed to update user ${id} (name ${nuser.getName()})`);
						}
						else{
							// Send the embed to the announce channel
							let channel = client.channels.cache.get(announceChannelId);
							if(channel){
								await channel.send({embeds : [embed]});
							}
							else{
								console.error("Failed to send the embed to the announce channel");
							}
						}
						
					}
				}
			}
			console.log("Ended worker at " + new Date().toLocaleString());
		}
		// Start the worker
		setInterval(worker, 1000 * 60 *20);
		
	},
};