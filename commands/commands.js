const { SlashCommandBuilder, CommandInteractionOptionResolver } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Get bot commands and their descriptions.'),
	async execute(interaction) {
		const self = this;
		await interaction.reply(self.getCommands());
	},
	getCommands(){
		var commandsList = '';
		const commands = [];
		const commandsPath = path.join('C:/Users/Gill/workspace/runclub/', 'commands');
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
					if(command.data.options.indexOf(opt) == command.data.options.length){
						commandsList += '\n';
					}
				}
			}
			commandsList += '\n';
		}

		return commandsList;
	}

};
