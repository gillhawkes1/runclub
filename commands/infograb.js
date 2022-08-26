const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('infograb')
		.setDescription('Send Heife your info.')
        .addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name.')
            .setRequired(true)),
	async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase();
        console.log(interaction.user.id,name)
		await interaction.reply('Thanks! :cow:');
	},

};