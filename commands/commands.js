const { SlashCommandBuilder, CommandInteractionOptionResolver } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Get bot commands and their descriptions.'),
	async execute(interaction) {
		try {
			const self = this;
			await interaction.reply(self.getCommands());
		} catch (error) {
			console.log(error);
			return interaction.reply('Something went wrong using this command!');
		}
	},
	getCommands(){
		var commandsList = '';
		const commands = [];
		const commandsPath = __dirname;
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		//build commands list
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			commands.push(command.data.toJSON());

			//command name & description. if there are options, print those indented in a new line under the command
			commandsList += '**/' + command.data.name + '** -> ' + command.data.description;
			if(command.data.options.length > 0){
				commandsList += ' **' + command.data.options.length + '** Option(s): \n';
				var ct = 0;
				for (const opt of command.data.options){
					const req = opt.required ? ' (required)' : '';
					commandsList += '        **' + opt.name + req + '** -> ' + opt.description;
					if(command.data.options.indexOf(opt) != command.data.options.length-1){
						commandsList += '\n';
					}
				}
			}
			commandsList += '\n';
		}

		return commandsList;
	}

};
