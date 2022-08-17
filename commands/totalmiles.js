const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('totalmiles')
		.setDescription('Pass a name to get their totals, pass nothing to get all totals')
		.addStringOption(option => 
            option.setName('name')
            .setDescription('first and last name of the runner')
            .setRequired(true)),
	async execute(interaction) {
		let name = interaction.options.getString('name');
		if(name){
			name = name.toLowerCase();
		}
		
		if(name.split(' ').length > 1){
			const sheet = await util.getSheet(envvars.BOOK_NEW_RUN,name);
			if(sheet != undefined){
				const rows = await sheet.getRows();
				if(rows.length > 0){
					let totals = { distance: 0, name: name, weeks: rows.length-1 };
					for(let i = 0; i < rows.length; i++){
						console.log(rows[i].distance);
						totals.distance += parseFloat(rows[i].distance);
					}
					let miles = Math.round((totals.distance + Number.EPSILON) * 100) / 100;
					miles = miles == -1 ? 0 : miles;
					await interaction.reply(`You have ran ${ miles } miles over ${ totals.weeks } weeks.`);	
				}else{
					await interaction.reply('You don\'t have any records yet.');
				}
			}else{
				await interaction.reply('You don\'t have any records yet. Register yourself with **/addme**.');
			}
		}else{
			await interaction.reply('Please enter first and last name.');
		}
	},
};