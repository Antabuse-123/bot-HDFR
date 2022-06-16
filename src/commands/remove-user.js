const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users_db } = require("../db-tables");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteuser')
        .setDescription('delete a user from the DB')
        .addIntegerOption(option => option.setName('id').setDescription('The Root me ID of the user to delete'))
        .addStringOption(option => option.setName("name").setDescription("Your Root-me name of the user to delete")),
    async execute(interaction) {
        if(!interaction.options.getInteger("id") && !interaction.options.getString("name")){
            return await interaction.reply("You should give your Root-me id or or your Root-mr name");
        }

        if(interaction.options.getInteger("id")){
            const id = interaction.options.getInteger("id");
            const deleted = await Users_db.destroy({where: {id: id}});
            if(deleted){
                return await interaction.reply("User was sucessfully rmoved from the database");
            }
            else{
                return await interaction.reply("I coulndn't delete the user");
            }
        }
        else{
            const name = interaction.options.getString("name");
            const users = await Users_db.findAll({where: {name: name}});
            let userArr = [];
            users.map(user => userArr.push([user.id, user.name]));
            if(userArr.length > 1){
                let embed = new MessageEmbed()
                .setTitle("Multiple users found")
                for (let index = 0; index < userArr.length; index++) {
                    const element = userArr[index];
                    embed.addField(`${element[0]}`, `${element[1]}`)
                }
                return await interaction.reply({embeds: [embed]});
            }
            else if(userArr.length == 0){
                return await interaction.reply("There is no user with this name");
            }
            else{
                const deleted = await Users_db.destroy({where: {id: userArr[0][0]}});
                if(deleted){
                    return await interaction.reply("User was sucessfully rmoved from the database");
                }
                else{
                    return await interaction.reply("I coulndn't delete the user");
                }
            }
        }
    }
};