const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

//client properties
//client.commands = new Collection();

//when client is ready, run this code
client.once('ready', () => {
  console.log('Ready!');
  console.log(`Logged in as ${client.user.tag}!`);
  //const myCommands = require('./commands');
});

client.login(envvars.DISCORD_TOKEN);

