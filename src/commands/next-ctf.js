const { prefix } = require('../config.json');
const {MessageEmbed} = require('discord.js');
const request = require('request')
module.exports = {
	name: 'next-ctf',
	description: 'shows the date of the next CTF',
	aliases: ['ctf'],
	usage: ' next-ctf <nombre optionel>| '+prefix+' ctf <nombre optionel>',
	cooldown: 100,
    guildOnly : false,
	execute(message, args) {
        //604800000 = one week
        if(args[0] >5){
            return message.channel.send("ça fais beaucoup la non?")
        }
        if(args[0] <0){
            return message.channel.send("Je suis désolé mais je ne prends pas les nombres négatifs merci")
        }
            request(`https://ctftime.org/api/v1/events/?limit=${args[0]}&start=${message.createdTimestamp}&finish=${message.createdTimestamp+604800000}`, function(error, response, body) {
            try{
                body = JSON.parse(body)
            }
            catch (e)
            {
                message.channel.send("Une erreure sauvage apparait... il se peut que le site hors ligne *l'erreure à été enregistrée*")
                console.log(e)
                console.log(`${message.author.tag} à fais crash la commande ctf\nargs = ${args}`)
                return;
            }
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
                let max =1
                if(args.length != 0){
                    max =args[0]
                }
                if(body.length < max){
                    max = body.length
                }
                let embed = new MessageEmbed()
                    .setTitle("Upcomming CTFs")
                    .setColor("#36393f")
                for (let i = 0; i < max; i++) {
                    let start = body[i].start.split('T')
                    let end = body[i].finish.split('T')
                    if (body[i].title == '_EVENT CHANGED_' && i <body.length -1) {
                        
                            embed.addField(body[i+1].title + "**event changed**",`${body[i+1].description}`)
                            embed.addField(
                                ":information_source: Infos",
                                `**Début :** ${start[0]}, Heure : ${start[1]} \n
                                **Fin :** ${end[0]}, Heure ${end[1]} \n
                                **Site :** ${body[i].url} \n
                                **CTF Time URL :** ${body[i].ctftime_url} \n
                                **Format :** ${body[i].format} \n 
                                **Durée :** ${body[i].duration.hours} Heures & ${body[i].duration.days} Jours \n 
                                **Nombre de participants :** ${body[i].participants} \n
                                **Poids** ${body[i].weight}`
                            )
                        embed.image(body[i].logo)
                        i++;
                    }
                    else{
                        embed.addField(`**${body[i].title}**`,`${body[i].description}`)
                        embed.addField(":information_source: Infos",
                            `**Début :** ${start[0]}, Heure : ${start[1]} \n
                            **Fin :** ${end[0]}, Heure ${end[1]} \n
                            **Site :** ${body[i].url} \n
                            **CTF Time URL :** ${body[i].ctftime_url} \n
                            **Format :** ${body[i].format} \n 
                            **Durée :** ${body[i].duration.hours} Heures & ${body[i].duration.days} Jours \n 
                            **Nombre de participants :** ${body[i].participants} \n
                            **Poids** ${body[i].weight}`)
                        embed.image(body[i].logo)
                    }  
                    
                }
                message.channel.send(embed)
            }
        })
	},
};