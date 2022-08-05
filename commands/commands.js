const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Get bot command descriptions.'),
	async execute(interaction) {
		await interaction.reply('this has not been created yet. go ahead and ping gill and get his ass on it');
	},
};
