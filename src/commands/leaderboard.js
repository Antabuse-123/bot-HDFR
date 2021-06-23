const { prefix } = require('../config.json');
const {MessageEmbed} = require('discord.js');
const request = require('request');
const fetch = require('node-fetch');
module.exports = {
	name: 'leaderbard',
	description: 'Shows the leadear board of ctf Time',
	aliases: ['ld'],
	usage: ' ld',
	cooldown: 100,
    guildOnly : false,
	async execute(message) {
		let x = 0
		//"https://ctftime.org/stats/FR"
		
		fetch('https://ctftime.org/stats/FR').then((response) => response.text()).then(
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
				err =>
				{
					console.error(err);
					message.channel.send("Erreur");
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
								ids.push(id);
							}
						}
					}
					return ids;
				},
				err => 
				{
					console.error(err);
					message.channel.send("Erreur")
				}
			).then(
				async ids => {
					let msgtop10 = new MessageEmbed();
					msgtop10.setTitle("Top 10 CTF Time FR")
					msgtop10.setThumbnail("https://avatars.githubusercontent.com/u/2167643?s=200&v=4")
					let g = await message.channel.send(msgtop10);
					master();
					function master(){
						const inter = setInterval(tutu,1000)
						async function tutu(){
							if(x < 10){
								fetch(`https://ctftime.org/api/v1/teams/${ids[x]}/`).then((resp) => resp.text()).then(
									async json => {
										if(json.includes("<html")){
											console.log("rate limited")
											return
										}
										json = JSON.parse(json);
										msgtop10.addField(json.name, "place : " + (ids.indexOf(ids[x-1]) +1))
										g = await g.edit(msgtop10)
			
									},
									err => {
										console.log(err);
										message.channel.send("Erreur");
										return "";
									}
									);
							}
							else{
								message.channel.send("la commande est finie")
								clearInterval(inter)
							}
							x++;
						}
					}
					

					return;
				},
				err => 
				{
					console.error(err);
					message.channel.send("Erreur")
				}

			)
	
		

	},
};