const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('2miroute')
		.setDescription('Get a google map of the 2mi route.'),
	async execute(interaction) {
		await interaction.reply('https://www.google.com/maps/d/embed?mid=13XJ-0K14j6QeKnK8MeIuF1YK3k9rp-g&hl=en&ehbc=2E312F');
	},
};