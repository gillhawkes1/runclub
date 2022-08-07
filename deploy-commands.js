//a file for command deployment management
const fs = require('node:fs');
const path = require('node:path');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;


//-----------BUILD COMMANDS FOR UPLOAD TO DISCORD------------//

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(envvars.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(envvars.CLIENT_ID, envvars.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

//module.exports.commands = commands;