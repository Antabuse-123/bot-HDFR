const {MessageEmbed} = require('discord.js');
const request = require('request')
const fetch = require('node-fetch')
module.exports = {
    name : 'ping',
    description : 'Affiche le ping du bot',
    aliases : ['pong'],
    cooldown : 5,
    guildOnly : false,
    usage : 'ping <args ?>',
    async execute(message, args){
        if (!args[0]) {
            const beforeEmbed = new MessageEmbed()
                .setTitle('ping')
            const m = await message.channel.send(beforeEmbed)
            const pingEmbed = new MessageEmbed()
                .setColor("#36393f")
                .setTitle('**Ping**')
                .setDescription(`Pong! Le ping du bot est de ${m.createdTimestamp - message.createdTimestamp}ms. Ping de l'API ${Math.round(message.client.ws.ping)}ms`)
                .setTimestamp()
                .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}))
            m.edit(pingEmbed)
        } else {

            request(`http://ip-api.com/json/${args[0]}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`, function(error, response, body) {
                body = JSON.parse(body)
                if (body.status == "fail") {
                    console.log("Ping :"+error +"\nRequest was:"+args[0]+"\nUser : "+message.author.tag)
                    let embed = new MessageEmbed()
                        .setTitle(`Erreur :x:`)
                        .setColor("RED")
                        .addField(`Je suis désolé mais je ne peux pas avoir d'informations sur : ${body.query}`, `Erreur: ${body.message}`)
                        .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}))
                    message.channel.send(embed);

                } else if (body.status = "success") {
                    let embed = new MessageEmbed()
                        .setTitle(`Informations for ${args[0]} (${body.query})`)
                        .setColor("#36393f")
                        .addField(":bust_in_silhouette: Propriétaire", `**Organisation:** ${body.org} \n**Internet Service Provider:** ${body.isp} (${body.as})`)
                        .addField(":earth_africa: Localisation", `**Pays:** ${body.country} \n**Ville:** ${body.city}`)
                        .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}));
                        
                        async function ping(query) {
                            a = Date.now();
                            try {
                                await fetch("http://www."+query).then((response) => response.text()).then((text) => console.log("Ping :\n" + text));
                            } catch (e) {
                                console.error(e);
                                console.log("Ping :\nHost unreachable\nrequested by :" + message.author.tag + "\non :" + args[0]);
                                return;
                            }
                            b = Date.now();
                            return b-a;
                        }
                        ping(args[0])
                        .then((i) => embed.addField("Ping", i +"ms"))
                        message.channel.send(embed)
                }
            });
        }
    }
}