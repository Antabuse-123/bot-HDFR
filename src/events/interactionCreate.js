module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        if (!interaction.isCommand()) return;
    	const command = interaction.client.commands.get(interaction.commandName);
    	if (!command){
            interaction.reply({ content: "Command not found", ephemeral: true });
            return;
        }
        if(!interaction.guild){
            console.log(`Command ${interaction.commandName} was used in DM by ${interaction.user.tag}`);
            await interaction.reply("I can't execute command in DMs for now");
            return;
        }
        else{
            console.log(`Command ${interaction.commandName} was used in ${interaction.guild.name} by ${interaction.user.tag}`);
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
};