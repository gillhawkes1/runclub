const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bessie')
		.setDescription('Bessie speaks.'),

	async execute(interaction) {
    const self = this;
    var tip = self.tips[Math.floor(Math.random()*self.tips.length)];
		await interaction.reply(tip);
	},

  tips: Array(
    'Don\'t run into a wall.',
    'Wear your runclub shirt for $1 off on Tuesdays.',
    'Come run in the rain for double miles rewards.',
    'You can redeem your rewards at the bar.',
    'If the heat index is over 95F, it\'s 2x miles.',
    'Fun fact: I\'m a cowputer.',
    'MOO',
    'If Kevin was 3 minutes late, everything is normal.',
    'I wish they would let me behind the bar but I\'m too big.',
    'Come to Food Truck Friday\'s!',
  ),

};
