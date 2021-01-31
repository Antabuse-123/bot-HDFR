const {MessageEmbed} = require('discord.js');
const request = require('request')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
module.exports = {
    name : 'ping',
    description : 'Affiche le ping du bot',
    aliases : ['pong'],
    cooldown : 5,
    guildOnly : false,
    usage : '',
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

                    let embed = new MessageEmbed()
                        .setTitle(`Erreur :x:`)
                        .setColor("RED")
                        .addField(`Je suis désolé mais je ne peux pas avoir d'informations sur : ${body.query}`, `Erreur: ${body.message}`)
                        .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}))
                    message.channel.send(embed);

                } else if (body.status = "success") {
                    function httpGet(theUrl)
                    {
                        var xmlHttp = new XMLHttpRequest();
                        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
                        xmlHttp.send( null );
                        return xmlHttp.responseText;
                    }
                    let url = `http://${body.query}`
                    let p = new Date;
                    httpGet(url)
                    let P1 = new Date;
                    let embed = new MessageEmbed()
                        .setTitle(`Informations for ${args[0]} (${body.query})`)
                        .setColor("#36393f")
                        .addField(":bust_in_silhouette: Propriaitaire", `**Organisation:** ${body.org} \n**Internet Service Provider:** ${body.isp} (${body.as})`)
                        .addField(":earth_africa: Localistaiton", `**Pays:** ${body.country} \n**Ville:** ${body.city}`)
                        .addField(":zap: Autre", `**mobile:** ${body.mobile} \n**Proxy:** ${body.proxy}\n**Hote:** ${body.hosting}`)
                        .addField(':hourglass: **Ping**: ', P1 -p +"ms")
                        .setFooter("Demandé par "+message.author.tag, message.author.avatarURL({dynamic:true}))
                    message.channel.send(embed);
                }
            });
        }
    }
}