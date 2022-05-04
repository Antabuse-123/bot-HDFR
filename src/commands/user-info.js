const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users_db } = require("../db-tables");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Shows the info about a specific user')
		.addIntegerOption(option => option.setName('id').setDescription('The id of the root me user'))
		.addStringOption(option => option.setName("name").setDescription("The name of the root me user")),
	async execute(interaction) {
		if(interaction.options.getInteger('id') != null){
			let id = interaction.options.getInteger('id');
			let user = await Users_db.findOne({where: {id: id}});
			if(user == null){
				return interaction.reply("User not found");
			}
			console.log(typeof(user.solve));
			let embed = new MessageEmbed()
			embed.setTitle(`Infos for the user : ${user.name}`)
			embed.addField("Rank", `${user.rank}`, true)
			embed.addField("Title", `${user.title}`, true)
			embed.addField("Score", `${user.score}`, true)
			embed.addField("Number of solved challenges", `${user.solve.split(',').length}`,true)
			embed.addField("Number of created challenges", `${user.challenges.split(',').length}`,true)
			return interaction.reply({embeds : [embed]})
		}
		else if(interaction.options.getString('name') != null){
			let name = interaction.options.getString('name');
			let user = await Users_db.findOne({where: {name: name}});
			if(user == null){
				return interaction.reply("User not found");
			}
			let embed = new MessageEmbed()
			embed.setTitle(`Infos for the user : ${user.name}`)
			embed.addField("Rank", `${user.rank}`, true)
			embed.addField("Title", `${user.title}`, true)
			embed.addField("Score", `${user.score}`, true)
			embed.addField("Number of solved challenges", `${user.solve.split(',').length}`,true)
			embed.addField("Number of created challenges", `${user.challenges.split(',').length}`,true)
			return interaction.reply({embeds : [embed]})
		}
		else{
			return interaction.reply("Please specify a user id or a user name");
		}
		
    }
};