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
		
    }
};