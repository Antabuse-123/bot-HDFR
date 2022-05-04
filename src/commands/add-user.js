const { MessageEmbed, CommandInteractionOptionResolver, User } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { rootMeApiKey } = require('../../config.json');
const { Client } = require("root-me-api-wrapper");
const { Users_db } = require("../db-tables");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('adduser')
		.setDescription('Add a user to the DB')
		.addIntegerOption(option => option.setName('id').setDescription('Your Root me ID').setRequired(false))
        .addStringOption(option => option.setName('name').setDescription('Your Root-me name').setRequired(false)),
	async execute(interaction) {
        if(!interaction.options.getInteger('id') && !interaction.options.getString('name')) {
            return await interaction.reply("You need to provide either your Root me ID or your Root me name!");
        }
        const client = new Client(rootMeApiKey);
        async function add_user(user_id){
            let date = Date.now();
            client.getUser(user_id).then(async user => {
                if(user.getId() === -1){
                    await interaction.editReply("Error while gathering the information, make sure this id is correct");
                    return;
                }
                try{
                    await Users_db.create({
                        id: user.getId(),
                        name: user.getName(),
                        rank: user.getRank(),
                        title: user.getTitle(),
                        solve: user.getSolve(),
                        score: user.getScore(),
                        challenges: user.getChallenges(),
                    })
                }
                catch(e){
                    await interaction.editReply("Error while inserting in the DB");
                    console.error(e);
                    return;
                }
                let embed = new MessageEmbed();
                embed.setTitle("User added!");
                embed.setDescription(`User ${user.getName()} (${user.getId()}) added to the database!`);
                let total_time = (Date.now() - date) / 60000;
                embed.addField("total time :", ""+total_time+" s");
                await interaction.editReply({embeds : [embed]});
            },
            err => {
                interaction.editReply("A wild error occurs")
                console.error(err);
                return;
            });
        }
        if(interaction.options.getInteger('id')) {
            const id = interaction.options.getInteger('id');
            if(await Users_db.findOne({where: {id: id}})){
                return await interaction.reply("User already in the database");
            }
            await interaction.reply("Gathering the info about the user")
            add_user(id);
            return;
        }
        else{
            const name = interaction.options.getString('name');
            let userArray = await client.getUserByName(name);
            if(userArray.length === 1){
                let id = userArray[0][0];
                if(await Users_db.findOne({where: {id: id}})){
                    return await interaction.reply("User already in the database")
                }
                await interaction.reply("Gathering the info about the user"); 
                add_user(id);
                return;
            }
            let embed = new MessageEmbed();
            embed.setTitle("Result of the search");
            for(let i =  0; i < userArray.length; i++){
                embed.addField("user :",`${userArray[i][1]} id : ${userArray[i][0]}`)
            }
            return await interaction.reply({embeds : [embed]});
        }

    }
};