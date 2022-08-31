const { SlashCommandBuilder } = require('discord.js');
const { sd } = require('./../staticdata.js');
const util = require('./../utility.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Get user information.'),
	async execute(interaction) {
		
		await interaction.reply({content: util.randIndex(sd.greeting), ephemeral: true});
	},
};