const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users_db, UserClass } = require("../db-tables");
const { rootMeApiKey } = require('../../config.json');
const { Client } = require("root-me-api-wrapper");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Shows the info about a specific user')
		.addIntegerOption(option => option.setName('id').setDescription('The id of the root me user'))
		.addStringOption(option => option.setName("name").setDescription("The name of the root me user")),
	async execute(interaction) {
		async function send_info (user){
			let embed = new MessageEmbed()
			embed.setTitle(`Infos for the user : ${user.name}`)
			embed.addField("Rank", `${user.rank}`, true)
			embed.addField("Title", `${user.title}`, true)
			embed.addField("Score", `${user.score}`, true)
			embed.addField("Number of solved challenges", `${user.solve.split(',').length - 1}`,true)
			embed.addField("Number of created challenges", `${user.challenges.split(',').length - 1}`,true)
			return await interaction.editReply({embeds : [embed]})
		}
		const client = new Client(rootMeApiKey);
		if(interaction.options.getInteger('id') != null){
			await interaction.reply("Gathering the info about the user")
			let id = interaction.options.getInteger('id');
			let user = await Users_db.findOne({where: {id: id}});
			if(user == null){
				await interaction.editReply("User not found in the DB");
				let usr = await client.getUser(id)
				if(usr.getId() === -1){
					await interaction.editReply("Error while gathering the information, make sure this id is correct");
					return;
				}
				let userObj = new UserClass(
					usr.getId(),
					usr.getName(),
					usr.getRank(),
					usr.getTitle(),
					usr.getSolve().toString(),
					usr.getScore(),
					usr.getChallenges().toString()
				)
				send_info(userObj);
			}
			send_info(user);
			
		}
		else if(interaction.options.getString('name') != null){
			await interaction.reply("Gathering the info about the user")
			let name = interaction.options.getString('name');
			let user = await Users_db.findOne({where: {name: name}});
			if(user == null){
				return interaction.reply("User not found");
			}
			send_info(user);
		}
		else{
			return interaction.reply("Please specify a user id or a user name");
		}
		
    }
};