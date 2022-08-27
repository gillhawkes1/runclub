const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('totalmiles')
		.setDescription('Pass a name to get their totals.')
		.addStringOption(option => 
            option.setName('name')
            .setDescription('first and last name of the runner')
            .setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		let name = interaction.options.getString('name');
		const fname = name.split(' ')[0];
		if(name){
			name = name.toLowerCase();
		}
		
		if(name.split(' ').length > 1){
			const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);
			if(sheet != undefined){
				const rows = await sheet.getRows();
				if(rows.length > 0){
					let totals = { distance: 0, name: name, weeks: rows.length };
					for(let i = 0; i < rows.length; i++){
						totals.distance += parseFloat(rows[i].distance);
					}
					let miles = Math.round((totals.distance + Number.EPSILON) * 100) / 100;
					const plural = rows.length == 1 ? 'week' : 'weeks';
					await interaction.editReply(`${util.capsFirst(fname)} has ran ${miles} miles over ${totals.weeks} ${plural}.`);	
				}else{
					await interaction.editReply('You don\'t have any records yet. Get out there and run!');
				}
			}else{
				await interaction.editReply('You don\'t have any records yet. Register yourself with **/addme**.');
			}
		}else{
			await interaction.editReply('Please enter first and last name.');
		}
	},
};