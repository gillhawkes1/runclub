//a file for command deployment management

const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');


//dotenv import
require("dotenv").config();
const dotenv = require('dotenv')
const myEnv = dotenv.config()
const envvars = myEnv.parsed;


const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('test').setDescription('Test bessie\'s power'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(envvars.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(envvars.CLIENT_ID, envvars.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);