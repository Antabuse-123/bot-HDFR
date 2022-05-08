const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { rootMeApiKey } = require('../../config.json');
const { Users_db } = require("../db-tables");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('scoreboard')
		.setDescription('The scoreboard of the bests Root me users in the DB'),
	async execute(interaction) {
		await interaction.deferReply();
        let users = await Users_db.findAll({attributes : ["name", "score"]});
		let scoreboard = [];
		users.map(user=> scoreboard.push([user.name,user.score]));
		//sort the array
		scoreboard.sort((a,b)=> b[1] - a[1]);
		let embed = new MessageEmbed()
		.setTitle("Scoreboard")
		let description = "";
		for (let index = 0; index < scoreboard.length; index++) {
			const element = scoreboard[index];
			description += `**${index+1}** : ${element[0]} --> ${element[1]} points\n`;
		}
		embed.setDescription(description);
		return interaction.editReply({embeds: [embed]})
	}
};