const fs = require('fs');

module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        // Management of the slash commands
        if (!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command){
            interaction.reply({ content: "Command not found", ephemeral: true });
            return;
        }
        if(!interaction.guild){
            let content = `Command ${interaction.commandName} was used in DM by ${interaction.user.tag}\n`;
            fs.writeFile("Log.txt", content, { flag: 'a+' }, err => {});
            await interaction.reply("I can't execute command in DMs for now");
            return;
        }
        else{
            let content = `Command ${interaction.commandName} was used in ${interaction.guild.name} by ${interaction.user.tag}\n`;
            fs.writeFile("Log.txt", content, { flag: 'a+' }, err => {});
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            fs.writeFile("Log.txt","Error: " + error + "\n", { flag: 'a+' }, err => {});
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
};