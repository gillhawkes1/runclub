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
		
		if(name){
			const sheet = await util.getSheet(envvars.BOOK_NEW_RUN,name);
			if(sheet != undefined){
				const rows = await sheet.getRows();
				let totals = { distance: 0, name: name, weeks: rows.length-1 };
				for(let i = 0; i < rows.length; i++){
					console.log(rows[i].distance);
					totals.distance += parseFloat(rows[i].distance);
				}
				await interaction.reply(`You have ran ${ Math.round((totals.distance + Number.EPSILON) * 100) / 100 } miles over ${ totals.weeks } weeks.`);
			}else{
				await interaction.reply('You don\'t have any records yet.');
			}
		}/* else{
			const sheet = await util.getSheet(envvars.BOOK_RUN_TOTALS,'2021-2022');
			const rows = await sheet.getRows();
			let response = '';
			for(let i = 0; i < 11; i++){
				let fname = util.capitalizeFirstLetter(rows[i].fname);
				let lname = util.capitalizeFirstLetter(rows[i].lname);
				let distance = rows[i].mileage;
				let weeks = rows[i].weeks;
				response += fname + ' ' + lname + '\n';
				response += distance + 'mi \n';
				response += weeks + ' weeks \n';
				response += '---------------------- \n';
			}
			console.log(response.length)
			await interaction.reply({ content: response, ephemeral: true});
		} */
	},
};