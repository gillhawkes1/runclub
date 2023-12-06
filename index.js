const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { sd } = require('./staticdata.js');
const util = require('./utility.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

//create and map commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

//when client is ready, run this code
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	util.startUp(client).then(() => {
		console.log('Ready!');
	});
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
		if(interaction.user.id != '332685115606171649'){
			return interaction.reply('Gill is fixing a bug! Try again some other time.');
		}
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(env.DISCORD_TOKEN);