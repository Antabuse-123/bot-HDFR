const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require("node-fetch");
const {MessageEmbed} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topctftimelocale')
		.setDescription("Show the Top 10 teams in CTFTime from a given country")
		.addStringOption(option => option.setName('locale').setDescription('the country you want to see the top 10 teams (ex: fr, us, ...)')),
	async execute(interaction) {
		let x = 0;
		// Get the locale parameter
		let locale = interaction.options.getString('locale');
		// Checks if the user provided a locale
		if(!locale){
			return await interaction.reply("Please specify a locale");
		}
		// Defer the reply to permit more time to execute the command
		await interaction.deferReply();
		// Prepare the url
		locale = locale.toUpperCase();
		// Scrap the data from the CTFTime website
		fetch('https://ctftime.org/stats/'+locale)
		.then(
			// Parse the data to text
			response => response.text(),
			async err => {
				console.error(err);
				await interaction.editReply("Error while fetching the CTF make sure that the locale is correct");
				return;
			}
			)
			.then(
				text =>
				{
					// Get the top 10 teams
					let txtparse = text.split("\n");
					let top10 = [];
					let i = 0;
					for (const string of txtparse) {
						if(string.includes('<tr><td class="place">') && i < 10){
							let str = "";
							str += string;
							top10.push(str.trim());
							i++;
						}
					}
					return top10;
				},
				async err =>
				{
					console.error(err);
					await interaction.editReply("Error");
				}
			).then(
				(top10) => 
				{
					// Get the TOP 10 teams ids
					let ids = [];
					for(let j = 0; j< top10.length; j++){

						for(let k = 0; k<top10[j].length;k++){
							if(top10[j][k]<= '9' && top10[j][k]>='0' && top10[j][k-1] == '/'){
								let id = "" + top10[j][k];
								while(top10[j][k+1] != '"'){
									k++;
									id+=top10[j][k];
								}
								ids.push([id,j+1]);
							}
						}
					}
					return ids;
				},
				async err => 
				{
					console.error(err);
					await interaction.editReply("Error")
				}
			).then(
				async ids => {
					// construct the embed
					let msgtop10 = new MessageEmbed();
					msgtop10.setTitle("Top 10 CTF Time Teams from "+locale);
					msgtop10.setThumbnail("https://avatars.githubusercontent.com/u/2167643?s=200&v=4");
                    msgtop10.setURL("https://ctftime.org/");
					interaction.editReply({ embeds: [msgtop10]});
					function master(){
						// Set an interval to avoid the rate limit
						const inter = setInterval(messageSender,1500);
						async function messageSender(){
							if(x < 10){
                                let [id,place] = ids[x];
								// get the team name via the CTF time API
								fetch(`https://ctftime.org/api/v1/teams/${id}/`).then((resp) => resp.text()).then(
									async json => {
                                        try{
                                            json = JSON.parse(json);
                                        }
                                        catch(err){
                                            console.error(err);
											return;
                                        }
										
										msgtop10.addField(json.name, "Place : " + place);
										try{
											await interaction.editReply({ embeds: [msgtop10]});
										}
										catch(err){
											await interaction.editReply({ embeds: [msgtop10]});
											console.error(err);
										}
										
			
									},
									async err => {
										console.error(err);
										await interaction.editReply("Error");
										return "";
									}
									);
							}
							else{
								clearInterval(inter);
							}
							x++;
						}
					}
					master();
					return;
				},
				async err => 
				{
					console.error(err);
					interaction.editReply("Error");
				}

			)
	
	},
};