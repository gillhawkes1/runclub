const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
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
const commands = [];

//-----------BUILD COMMANDS FOR UPLOAD TO DISCORD------------//
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

	//map commands
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
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(env.DISCORD_TOKEN);