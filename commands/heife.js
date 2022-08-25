const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const sd = require('./../staticdata.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('heife')
		.setDescription('Heife speaks.'),

	async execute(interaction) {
		await interaction.reply(util.randIndex(sd.data.heifeTips));
	},

};
