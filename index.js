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

