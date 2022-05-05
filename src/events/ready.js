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
		client.user.setActivity("Watching for new CTFs");
		Users_db.sync()
		// runs a code in a thread
		setInterval(worker, 1000 * 60 * 60);
		async function worker(){
			console.log("Started Worker at " + new Date().toLocaleString());
			let rmclient = new Client(rootMeApiKey);
			
			let tmp = await Users_db.findAll({attributes : ["id"]});
			let ids = tmp.map(user=> user.id);
			for(let id of ids){
				await new Promise(f => setTimeout(f, 500));
				let nuser = await rmclient.getUser(id);
				if(nuser.getId() === -1){
					continue;
				}
				let user = await Users_db.findOne({where: {id: id}});
				for(let solved of nuser.getSolve()){
					if(!user.solve.includes(solved)){
						let chall = await rmclient.getChallenge(solved);
						let embed = new MessageEmbed();
						embed.setTitle("New challenge solved!");
						embed.setDescription(`${nuser.getName()} solved : ${chall.getTitle()}`);
						embed.addField("New Score", `${nuser.getScore()}`);
						embed.setColor("#00ff00");
						let affectedrow = await Users_db.update({
							score: nuser.getScore(),
							solved: nuser.getSolve().toString(),
							rank: nuser.getRank(),
							title: nuser.getTitle(),
						}, {where: {id: id}});
						if (!(affectedrow > 0)) {
							console.error(`Failed to update user ${id} (name ${nuser.getName()})`);
						}
						else{
							let channel = client.channels.cache.get(announceChannelId);
							if(channel){
								await channel.send({embeds : [embed]});
							}
						}
						
					}
				}
			}
			console.log("Ended worked at " + new Date().toLocaleString());
		}
		
	},
};