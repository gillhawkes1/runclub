//a file for command deployment management

const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');


//do i need to define vars commented out?
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = require("dotenv").config();


const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);