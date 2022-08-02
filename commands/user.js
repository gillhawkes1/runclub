const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};