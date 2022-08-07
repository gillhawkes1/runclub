const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('options-info')
		.setDescription('Information about the options provided.')
		.addStringOption(option => option.setName('input').setDescription('The input to echo back').setRequired(true))
		.addStringOption(option => option.setName('option2').setDescription('The second option to echo back').setRequired(true)),
	async execute(interaction) {
		const value1 = interaction.options.getString('input');
		const value2 = interaction.options.getString('option2');
		if (value1) return interaction.reply(`The options value is: \`${value1}\` + \`${value2}\``);
		return interaction.reply('No option was provided!');
	},
};