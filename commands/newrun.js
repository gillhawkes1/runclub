const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newrun')
		.setDescription('Record a new run!')
		.addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name')
            .setRequired(true))
 		.addNumberOption(option => 
            option.setName('distance')
            .setDescription('Run distance')
            .setRequired(true))
		.addStringOption(option => 
            option.setName('time')
            .setDescription('Total run time. Format-> mm:ss (ex. 20:35)')
            .setRequired(true))
		.addStringOption(option => 
			option.setName('comment')
			.setDescription('A brief comment about your run')
			.setRequired(false)),

	async execute(interaction) {

		const name = interaction.options.getString('name').toLowerCase();
		const distance = interaction.options.getNumber('distance');
		const time = interaction.options.getString('time');
		const comment = interaction.options.getString('comment');
		const sheet = await util.getSheet(envvars.BOOK_NEW_RUN,name);

		//if their sheet exists 
		if(sheet != undefined){
			const rows = await sheet.getRows();

			//if sheet has rows
			if(rows.length > 0){
				const lastRun = rows.length-1;

				//if they already recorded a run for the day
				if(rows[lastRun].date == util.getToday()){
					return interaction.reply('Heife sees all, and he sees you trying to record more than one run for today. Sneaky, yes; but not smart.');				
				}

			//verification that they have not recorded a run for the day yet
			}else{
				const fname = name.split(' ')[0];
				const lname = name.split(' ')[1];
				const today = util.getToday();
				
				const newRunRow = {
					date: today,
					fname: fname,
					lname: lname,
					distance: distance,
					time: time,
					comment: comment,
					multiplier: 1
				}
	
				await util.addRowToSheet(envvars.BOOK_NEW_RUN,name,newRunRow);
				return interaction.reply(util.randIndex(sd.newRunResponse.salute + ' ' + sd.newRunResponse.remark));
			}

		//else if they are not in the system yet (they don't have a sheet to record their runs)
		}else{
			return interaction.reply('You are not in the system yet. Please use **/addme** to add yourself into the system, then record your run with **/newrun**.');
		}
	},
};