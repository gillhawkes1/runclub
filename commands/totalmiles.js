const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('totalmiles')
		.setDescription('Not finished yet!'),
	async execute(interaction) {
		await interaction.reply('not ready yet');
	},
};