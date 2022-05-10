const { SlashCommandBuilder } = require("@discordjs/builders");
const { Users_db } = require("../db-tables");
const { Client } = require("root-me-api-wrapper");
const { rootMeApiKey } = require("../../config.json");
const { MessageEmbed } = require("discord.js");


module.exports = {
    data : new SlashCommandBuilder()
        .setName('has-solved')
        .setDescription('Show who in the DB has solve a particular challenge')
        .addIntegerOption(option => option.setName('id').setDescription('The challenge ID'))
        .addStringOption(option => option.setName('name').setDescription('The challenge name')),
    async execute(interaction) {
    // Checks if any parameter has been given
        if(!interaction.options.getInteger('id') && !interaction.options.getString('name')) {
            return await interaction.reply("You need to provide either the challenge ID or the challenge name!");
        }
        const client = new Client(rootMeApiKey);
        // Defer the reply to get the time to compute
        await interaction.deferReply();
        /**
         * Fetch who as solved a particular challenge
         * @param {Number} id - The challenge ID
         * @returns {Void}
         */
        async function getChallenge(id){
            let challenge = await client.getChallenge(id);
            // get all the users from the DB
            let users = await Users_db.findAll({attributes : ['name','solve']});
            let users_list = [];
            // Getting a nice array of user and their solved challenges
            users.map(user => users_list.push([user.name, user.solve.split(',')]));            
            // Construct the embed message
            let embed = new MessageEmbed();
            embed.setTitle("The challenge " + challenge.getTitle() + " has been solved by");
            let description = "";
            for(let i = 0; i < users_list.length; i++){
                if(users_list[i][1].includes(`${challenge.getId()}`)){
                    description += users_list[i][0] + "\n";
                }
            }
            embed.setDescription(description);
            await interaction.editReply({embeds : [embed]});
        }

        if(interaction.options.getInteger('id')){
            let id = interaction.options.getInteger('id');
            getChallenge(id);
        }
        else{
            let name = interaction.options.getString('name');
            // Get the challenge from the Root-me API
            let challenges = await client.getChallengeByName(name);
            if(challenges.length === 0){
                return await interaction.editReply("Error while fetching the challege make sure that the name is correct !");
            }
            if(challenges.length === 1){
                getChallenge(challenges[0].getId());
                return;
            }
            let embed = new MessageEmbed()
                        .setTitle("Challenge not found but maybe one of these challenges is the one you are looking for ?")
            for(let i = 0; i < challenges.length; i++){
                embed.addField(`${challenges[i].getTitle()}`, `id : ${challenges[i].getId()}`)
            }
            return await interaction.editReply({embeds : [embed]})
        }
    }
}