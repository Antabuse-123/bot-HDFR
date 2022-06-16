const { MessageEmbed, CommandInteractionOptionResolver, User } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { rootMeApiKey } = require('../../config.json');
const { Client } = require("root-me-api-wrapper");
const { Users_db } = require("../db-tables");
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-user')
        .setDescription('Add a user to the DB')
        .addIntegerOption(option => option.setName('id').setDescription('Your Root me ID').setRequired(false))
        .addStringOption(option => option.setName('name').setDescription('Your Root-me name').setRequired(false)),
    async execute(interaction) {
        // Checks if any parameter has been given
        if(!interaction.options.getInteger('id') && !interaction.options.getString('name')) {
            return await interaction.reply("You need to provide either your Root me ID or your Root me name!");
        }
        // Create a new Root-me Client
        const client = new Client(rootMeApiKey);
        let date = Date.now();
        /** 
        * Add a user to the database
        * @param {Number} id - The Root me ID of the user
        * @returns {Void}
        */
        async function add_user(user_id){
            // Get the user from the Root-me API
            client.getUser(user_id).then(async user => {
                // Check if there was no error while getting the user
                if(user.getId() === -1){
                    await interaction.editReply("Error while gathering the information, make sure this id is correct");
                    return;
                }
                // Add the user to the database
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
                    let content = "Error: error while adding the user in the DB\n";
                    fs.writeFile("Log.txt",content,{ flag: 'a+' }, err => {});
                    await interaction.editReply(content)
                    return;
                }
                // Sends an embed message if the user was added successfully
                let embed = new MessageEmbed();
                embed.setTitle("User added!");
                embed.setDescription(`User ${user.getName()} (${user.getId()}) added to the database!`);
                let total_time = (Date.now() - date) / 60000;
                embed.addField("total time :", ""+total_time+" s");
                await interaction.editReply({embeds : [embed]});
                return;
            },
            async err => {
                let content = "Internal error might be caused because the root me API is down\n";
                await interaction.editReply(content);
                fs.writeFile("Log.txt",content,{ flag: 'a+' }, err => {});
                return;
            });
        }
        // Defer the reply to avoid the reset of the interaction and permit more time to execute the command
        await interaction.deferReply();
        // If the user has provided an ID
        if(interaction.options.getInteger('id')) {
            // Get the ID
            const id = interaction.options.getInteger('id');
            // Checks of the user is already in the database
            if(await Users_db.findOne({where: {id: id}})){
                return await interaction.editReply("User already in the database");
            }
            await interaction.editReply("Gathering the info about the user")
            // Add the user to the database
            add_user(id);
            return;
        }
        else{
            // If the user has provided a name
            const name = interaction.options.getString('name');
            // Get all the root me users with the corresponding name
            let userArray = await client.getUserByName(name);
            // If there is only one user
            if(userArray.length === 1){
                // Get the id and add the user to the database
                const id = userArray[0][0];
                if(await Users_db.findOne({where: {id: id}})){
                    return await interaction.editReply("User already in the database")
                }
                await interaction.editReply("Gathering the info about the user"); 
                add_user(id);
                return;
            }
            // If there is more than one user
            // Send an embed message with the list of users and their corresponding id
            let embed = new MessageEmbed();
            embed.setTitle("Result of the search");
            for(let i =  0; i < userArray.length; i++){
                embed.addField("user :",`${userArray[i][1]} id : ${userArray[i][0]}`)
            }
            return await interaction.editReply({embeds : [embed]});
        }

    }
};