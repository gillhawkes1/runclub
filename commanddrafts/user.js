const { SlashCommandBuilder, GuildMember } = require('discord.js');
const { sd } = require('./../staticdata.js');
const util = require('./../utility.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Get user information.'),
	async execute(interaction) {
		const acrcNickname = interaction.member.nickname;
		let fname = "Gill";
		let lname = "Hawkes";
		console.log(fname + ' ' + lname.split('')[0]);
		if(acrcNickname.includes(fname) == false){
			interaction.member.setNickname(fname + ' ' + lname.split('')[0]);
			console.log('name was changed to ' + fname + ' ' + lname.split('')[0]);

		}else{
			console.log('name is ' + interaction.member.nickname);
		}
		//interaction.member.setNickname('Katie H').then(console.log('finished'))
		await interaction.reply({content: util.randIndex(sd.greeting), ephemeral: true});
	},
};