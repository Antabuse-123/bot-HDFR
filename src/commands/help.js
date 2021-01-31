const { prefix } = require('../config.json');
const {MessageEmbed} = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Donne la liste de toutes les commandes.',
	aliases: ['commandes','aide','h'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const { commands } = message.client;

		if (!args.length) {
            const HelpEmbed = new MessageEmbed()
                .setTitle("**Help**")
                .setDescription("Voilà la liste de toutes les commandes :");
                let s = "";
                for(const e of commands.map(command => command.name).join(', ')){
                    s +=`${e}`;
                }
                HelpEmbed.addField("**Commandes**", s)
			return message.author.send(HelpEmbed)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('Je vous ai envoyé toutes mes commandes en messages privé!');
				})
				.catch(error => {
					console.error(`Je n'ai pas pus envoyer le message d'aide à ${message.author.tag}.\n`, error);
					message.reply('Il semblerait que je ne peut pas vous envoyer de message privés!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('ce n\'est pas une commande valide!');
		}
        const SpecificEmbedElp = new MessageEmbed();
        if (command.aliases) SpecificEmbedElp.setTitle("**Commande: **" +command.name)
        if (command.description) SpecificEmbedElp.setDescription("**Description:**" +command.description)
        if (command.usage) SpecificEmbedElp.addField("**Utilisation:**", `${prefix}${command.name} ${command.usage}`)
        if (command.cooldown) SpecificEmbedElp.addField(`**Cooldown:**`,` ${command.cooldown || 3} second(s)`)
		message.channel.send(SpecificEmbedElp);
	},
};