const { SlashCommandBuilder } = require('@discordjs/builders');
const { rootMeApiKey } = require('../../config.json');
const { Client } = require("root-me-api-wrapper");
const { Users_db } = require('../db-tables');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge-info')
        .setDescription('Get the information about a challenge')
        .addIntegerOption(option => option.setName('id').setDescription('The challenge ID'))
        .addStringOption(option => option.setName('name').setDescription('The challenge name')),
    async execute(interaction) {
        // Checks if any parameter has been given
        if(!interaction.options.getInteger('id') && !interaction.options.getString('name')) {
            return await interaction.reply("You need to provide either the challenge ID or the challenge name!");
        }
        // Create a new Root-me Client
        const client = new Client(rootMeApiKey);
        // Defer the reply to get the time to compute
        await interaction.deferReply();
        /**
         *  Fetch the info about a challenge
         * @param {Number} id - The challenge ID
         * @returns {Void}
         */
        async function fetch_challenge(challenge_id){
            // Get the challenge from the Root-me API
            client.getChallenge(challenge_id).then(async challenge => {
                // Check if there was no error while getting the challenge
                if(challenge.getId() === -1){
                    await interaction.editReply("Error while gathering the information, make sure this id is correct");
                    return;
                }
                // Sends an embed message if the challenge was found
                let embed = new MessageEmbed();
                embed.setTitle("Challenge Info");
                embed.setDescription(`Challenge ${challenge.getTitle()} (${challenge.getId()})`);
                embed.addField("Points", "" + challenge.getPoints());
                embed.addField("Difficulty", "" + challenge.getDifficulty());
                embed.addField("Category", "" + challenge.getCategory());
                embed.addField("Author(s)", "" + challenge.getAuthors().join(", "));
                // Get the number of user in the DB that solved the challenge
                let solvers = await Users_db.findAll({attributes : ['solve']});
                let solvers_list = [];
                solvers.map(solver => solvers_list.push(solver.solve));
                let counter = 0;
                for(let i = 0; i < solvers_list.length; i++){
                    if(solvers_list[i].includes(challenge.getId())){
                        counter++;
                    }
                }
                embed.setFooter({text : `Number of solver in the server : ${counter}`});
                await interaction.editReply({embeds : [embed]});
            })
            .catch(err => {
                fs.writeFile("Log.txt","Error: " + err + "\n", { flag: 'a+' }, err => {});
                return;
            });
            return;
        }
                
        if(interaction.options.getInteger('id')){
            let id = interaction.options.getInteger('id');
            fetch_challenge(id);
        }
        else{
            let name = interaction.options.getString('name');
            // Get the challenge from the Root-me API
            let challenges = await client.getChallengeByName(name);
            if(challenges.length === 0){
                return await interaction.editReply("Error while fetching the challege make sure that the name is correct !");
            }
            if(challenges.length === 1){
                fetch_challenge(challenges[0].getId());
                return;
            }
            let embed = new MessageEmbed()
                        .setTitle("Result of the search")
            for(let i = 0; i < challenges.length; i++){
                embed.addField(`${challenges[i].getTitle()}`, `id : ${challenges[i].getId()}`)
            }
            return await interaction.editReply({embeds : [embed]})
        }
    }   
}