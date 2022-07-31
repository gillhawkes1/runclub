//begin app

//import env vars
require("dotenv").config();

const { Client, GatewayIntentBits } = require('discord.js');

//create client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//when client is ready, run this code
client.once('ready', () => {
  console.log('ready!~!~@! sheesh');
  console.log(`Logged in as ${client.user.tag}!`);
});

//login with the token
client.login(DISCORD_TOKEN);

console.log('we have logged in');

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