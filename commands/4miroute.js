const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('4miroute')
		.setDescription('Get a google map of the 4.2mi & 3.5mi routes.'),
	async execute(interaction) {
		await interaction.reply('https://www.google.com/maps/d/embed?mid=1nTQz5csY8RVNCiGWqr3CyTeVoYcKFe4&hl=en&ehbc=2E312F');
	},
};
