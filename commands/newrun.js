const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newrun')
		.setDescription('Information about the options provided.')
		.addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name')
            .setRequired(true))
 		.addStringOption(option => 
            option.setName('distance')
            .setDescription('Run distance')
            .setRequired(true))
		.addStringOption(option => 
            option.setName('time')
            .setDescription('Total run time')
            .setRequired(true)),
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const distance = interaction.options.getString('distance');
		const time = interaction.options.getString('time');
		if (name && distance && time) return interaction.reply(`Your run will be recorded as: \`${name}\` + \`${distance}\` + \`${time}\``);
		return interaction.reply('No option was provided!');
	},
};