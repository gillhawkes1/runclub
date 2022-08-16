const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rewards')
		.setDescription('Check out our rewards for running!'),
	async execute(interaction) {
		await interaction.reply('Rewards: \n15 miles = Sticker \n25 miles = Glassware \n50 miles = 4-Pack \n75 miles = T-Shirt \n100 miles = $20 ACBC Gift Card \n200, 300, ... Every 100 miles after is rewarded with another gift card.');
	},
};