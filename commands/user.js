const { SlashCommandBuilder } = require('discord.js');
const { sd } = require('./../staticdata.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Get user information.'),
	async execute(interaction) {
		let name = this.returnName(interaction);
		await interaction.reply(name + ' ' + sd.greeting);
	},
	returnName(str){
		return 'Hello, ' + str.member.nickname + '! :cow:';
	}
};