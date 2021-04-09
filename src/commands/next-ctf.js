const { prefix } = require('../config.json');
const {MessageEmbed} = require('discord.js');
const request = require('request')
module.exports = {
	name: 'next-ctf',
	description: 'shows the date of the next CTF',
	aliases: ['ctf'],
	usage: 'next-ctf | '+prefix+' ctf',
	cooldown: 5,
    guildOnly : false,
	execute(message) {
        //604800000
		request(`https://ctftime.org/api/v1/events/?limit=1&start=${message.createdTimestamp}&finish=${message.createdTimestamp+604800000}`, function(error, response, body) {
            body = JSON.parse(body)
            console.log("CTF :"+ message.author.tag)
            
            if(body == []){
                let embed = new MessageEmbed()
                        .setTitle(`Erreur :x:`)
                        .setColor("RED")
                        .addField(`il n'y à pas de CTF prévus`)
                        .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}))
                message.channel.send(embed);
            }
            else{
                    let start = body[0].start.split('T')
                    let end = body[0].finish.split('T')
                    let embed = new MessageEmbed()
                        .setTitle(`Upcoming ctf : ${body[0].title}`)
                        .setColor("#36393f")
                        .setDescription(`${body[0].description}`)
                        .addField(":information_source: Infos",
                        `**Début :** ${start[0]}, Heure : ${start[1]} \n
                        **Fin :** ${end[0]}, Heure ${end[1]} \n
                        **Site :** ${body[0].url} \n
                        **CTF Time URL :** ${body[0].ctftime_url} \n
                        **Format :** ${body[0].format} \n 
                        **Durée :** ${body[0].duration.hours} Heures & ${body[0].duration.days} Jours \n 
                        **Nombre de participants :** ${body[0].participants} \n
                        **Poids** ${body[0].weight}`)
                        .setThumbnail(body[0].logo)
                    message.channel.send(embed)
            }
        })
	},
};