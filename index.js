const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { sd } = require('./staticdata.js');
const util = require('./utility.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

//deploy commands if needed
try {
	util.checkForCommandDeployment();
} catch (error) {
	console.log('There was an error deploying commands.');
	console.log(error);
}

//when client is ready, run this code
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	console.log('Ready!');
});

//command execution
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	//only allow certain channels to use /commands
	if(sd.channels.heife_channels.includes(interaction.channelId) == false){
		return interaction.reply({content: `Please only use commands in the <#1008443594715173024> channel :cow:`, ephemeral: true});
	}

	//get commands and read
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(env.DISCORD_TOKEN);