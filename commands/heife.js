const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('heife')
		.setDescription('Heife speaks.'),

	async execute(interaction) {
		try {
			await interaction.reply(util.randIndex(sd.heifeTips));
		} catch (error) {
			console.log(error);
			return interaction.reply('Something went wrong using this command!');
		}
	},

};
