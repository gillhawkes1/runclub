const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//dotenv import
require("dotenv").config();
const dotenv = require('dotenv')
const myEnv = dotenv.config()
const envvars = myEnv.parsed;


//when client is ready, run this code
client.once('ready', () => {
  console.log('Ready!');
  console.log(`Logged in as ${client.user.tag}!`);

  //require('bessie.js');
});

//COMMAND RESPONSES
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  switch(commandName){
    case 'ping':
      await interaction.reply('Pong!');
      break;
    case 'server':
      await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
      break;
    case 'user':
      await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
      break;
    case 'test':
      await interaction.reply('mmmmmMMMMMMMMOOOOOOOOOOOOOOOO');
      break;
    default:
      return;
  }

});

client.login(envvars.DISCORD_TOKEN);

