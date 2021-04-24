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
	execute(message) {
		
		async function get_ids () {
			//"https://ctftime.org/stats/FR"
			let str = "";
			try{
				await fetch('https://ctftime.org/stats/FR').then((response) => response.text()).then((text) => str = text);
			}
			catch (e)
			{
				console.error(e)
			}
			console.log(str)
			let ids = []
				let top10 = [];
				let i = 0;
            	for (const string of str) {
            	    if(string.includes('<tr><td class="place">') && i < 10){
            	        top10.push(string.trim())
						i++;
            	    }
            	}
				for(let j = 0; j< top10.length; j++){

					for(let k = 0; k<top10[j].length;k++){
						if(top10[j][k]<= '9' && top10[j][k]>=0 && top10[j][k-1] == '/'){
							let id = "" + top10[j][k]
							while(top10[j][k+1] != '"'){
								k++;
								id+=top10[j][k];
							}
							ids.push(id);
						}
					}
				}
				return ids
		};
		
		let ids = get_ids();
		let msgtop10 = new MessageEmbed();

		msgtop10.setTitle("Top 10 CTF Time")

		msgtop10.setThumbnail("https://avatars.githubusercontent.com/u/2167643?s=200&v=4")

		msgtop10.setTimestamp()
		for(let z = 0; z < ids.length; z++){
			request(`https://ctftime.org/api/v1/teams/${ids[z]}/`, function(error2,response2,body){
				body = JSON.parse(body)
				
			})
		}
	},
};