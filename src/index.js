const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');
const Sequelize = require("sequelize")

// Checks if the log file exists, if not, creates it if yes erases it
if (!fs.existsSync("Log.txt")) {
	fs.writeFile("Log.txt", "", { flag: 'a+' }, err => {});
}
else{
	fs.writeFile("Log.txt", "", { flag: 'w' }, err => {});
}

// Create a new discord Client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// Create a new collection of commands
client.commands = new Collection();

// Gathering command files
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	let content = "Loaded command: " + command.data.name + "\n";
	fs.writeFile("Log.txt", content, { flag: 'a+' }, err => {});

}

// Gathering event files
const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

// Setting up the listeners
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to discord
client.login(token);