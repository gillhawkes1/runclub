
const { Client, GatewayIntentBits } = require('discord.js');
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
//OTk5NTExNTk2MjM1NzcxOTc1.Gixt5l.vcXP5exGk-j08Lz0dZdLA9IdFVa4xB97njAvSI
client.login('token');