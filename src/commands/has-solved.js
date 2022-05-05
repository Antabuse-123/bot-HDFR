const {SlashCommandBuilder} = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('has-solved')
        .setDescription('Check who has solved a specific challenge')
        .addStringOption(option => option.setName("challenge").setDescription("The challenge name"))
        .addIntegerOption(option => option.setName("id").setDescription("The challenge id")),
    async execute(interaction) {
        
    }

}