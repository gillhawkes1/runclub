const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//dotenv import
require("dotenv").config();
const dotenv = require('dotenv')
const myEnv = dotenv.config()
const envvars = myEnv.parsed;


//------------------------------------------------------------------------------------------------------------------------------------


client.once('ready', () => {
  console.log('inside of client.once(ready) function')
});

console.log('bessie.js was called! outside of client.once(ready) function');


//COMMAND RESPONSES
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'server') {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  }

  if (interaction.commandName === 'user') {
    await interaction.reply('user response yo');
  }

});

client.login(envvars.DISCORD_TOKEN);