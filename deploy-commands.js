//a file for command deployment management

const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');


//dotenv import
//const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = require("dotenv").config();
/* import 'dotenv/config'
dotenv.config()
import express from 'express' */
//import env vars
require("dotenv").config();
const dotenv = require('dotenv')
//const variableExpansion = require('dotenv-expand')
const myEnv = dotenv.config();
//variableExpansion(myEnv)


const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(myEnv.parsed.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(myEnv.parsed.CLIENT_ID, myEnv.parsed.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);