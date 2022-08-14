const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('totalmiles')
		.setDescription('Not finished yet!')        
		.addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name.')
            .setRequired(true)),
	async execute(interaction) {

        //interaction.client is the accessor to the client instance inside command files
		await interaction.reply('not ready yet');
	},
};