const { SlashCommandBuilder } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./../client_secret.json');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

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
		this.accessSheet(envvars.BOOK_NEW_RUN,name).then((sheet)=>{
			//make sure sheet exists, then make record. if not, create sheet and make record
			if(sheet != undefined){
				console.log('it is in fact a sheet. sheet = object');
			}else{
				console.log('nah dawg. sheet = undefined');
			}
		});

		if (name && distance && time) return interaction.reply(`Your run will be recorded as: \`${name}\` + \`${distance}\` + \`${time}\``);
		return interaction.reply('No option was provided!');
	},

	//try to get a sheet 
	async accessSheet(bookid,sheetname=false){
		const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key
		});
		await doc.loadInfo().catch((error) => {
			console.log(error);
			console.log('error occurred in catch');
			return false;
		})
		const sheet = doc.sheetsByTitle[sheetname];
		return sheet;
	},

	recordRun(docid,data){
	},
};