const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const {MessageEmbed} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('topctftimelocal')
		.setDescription('Shows the Top 10 teams in CTFTime from a given country')
		.addStringOption(option => option.setName('locale').setDescription('the country you want to see the top 10 teams (ex: fr, us, ...)')),
	async execute(interaction) {
		let x = 0
		//"https://ctftime.org/stats/FR"
		let locale = interaction.options.getString('locale');
		locale = locale.toUpperCase();

		fetch('https://ctftime.org/stats/'+locale)
		.then(
			response => response.text(),
			async err => {
				console.error(err);
				await interaction.reply("Error while fetching the CTF make sure that the locale is correct");
				return;
			}
			)
			.then(
				text => 
				{
					let txtparse = text.split('\n');
					let top10 = [];
					let i = 0;
					for (const string of txtparse) {
						if(string.includes('<tr><td class="place">') && i < 10){
							let str = "";
							str += string;
							top10.push(str.trim())
							i++;
						}
					}
					return top10;
				},
				async err =>
				{
					console.error(err);
					await interaction.reply("Error");
				}
			).then(
				top10 => 
				{
					let ids = [];
					for(let j = 0; j< top10.length; j++){

						for(let k = 0; k<top10[j].length;k++){
							if(top10[j][k]<= '9' && top10[j][k]>='0' && top10[j][k-1] == '/'){
								let id = "" + top10[j][k]
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
					await interaction.reply("Error")
				}
			).then(
				async ids => {
					let msgtop10 = new MessageEmbed();
					msgtop10.setTitle("Top 10 CTF Time Teams from "+locale);
					msgtop10.setThumbnail("https://avatars.githubusercontent.com/u/2167643?s=200&v=4")
                    msgtop10.setURL("https://ctftime.org/")
					await interaction.reply({ embeds: [msgtop10]});
					master();
					function master(){
						const inter = setInterval(messageSender,1500)
						async function messageSender(){
							if(x < 10){
                                let [id,place] = ids[x];
								fetch(`https://ctftime.org/api/v1/teams/${id}/`).then((resp) => resp.text()).then(
									async json => {
                                        try{
                                            json = JSON.parse(json);
                                        }
                                        catch(err){
                                            console.log(err)
                                            console.log("rate limited")
											return
                                        }
										
										msgtop10.addField(json.name, "Place : " + place)
										await interaction.editReply({ embeds: [msgtop10]});
			
									},
									async err => {
										console.log(err);
										await interaction.reply("Error");
										return "";
									}
									);
							}
							else{
								clearInterval(inter)
							}
							x++;
						}
					}
					return;
				},
				async err => 
				{
					console.error(err);
					interaction.reply("Error")
				}

			)
	
	},
};