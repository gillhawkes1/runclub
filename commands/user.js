const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Get user information.'),
	async execute(interaction) {
		let name = this.returnName(interaction);
		await interaction.reply(name);
	},
	returnName(str){
		console.log('this is a test. it should print something below this. below that should be server info');
		return 'Hello, ' + str.member.nickname + '! ';
	}
};