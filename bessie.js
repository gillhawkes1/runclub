console.log('bessie.js was called!');
/* 
const { Client, GatewayIntentBits } = require('discord.js');

//import env vars
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.login(DISCORD_TOKEN); */