//begin app

//dotenv import
require("dotenv").config();
const dotenv = require('dotenv')
const myEnv = dotenv.config()
const envvars = myEnv.parsed;

const { Client, GatewayIntentBits } = require('discord.js');

//create client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//when client is ready, run this code
client.once('ready', () => {
  console.log('Ready!');
  console.log(`Logged in as ${client.user.tag}!`);

  //require('bessie.js');
});

//login with the token
client.login(envvars.DISCORD_TOKEN);

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
    default:
      await interaction.reply('That command doesn\'t exist.');
  }

});

client.login(envvars.DISCORD_TOKEN);















/* client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});
 */


//------------------------------------------------------------------------------------------------------------------------------------
/* 

console.log('this is a test');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken('XAMwGCLqNjCC-7p_KNy2ce__uHG-yaXPi5-S1QE9wzt_pqMJBt8T3EOy4DrS6hQ1ZIhr');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('try/catch in discordtest.js: ',error);
    
  }
})();

 */