const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('totalmiles')
		.setDescription('Pass a name to get their totals.')
		.addStringOption(option =>
			option.setName('type')
			.setDescription('What type of data?')
			.setRequired(true)
			.addChoices(
				{name: 'Lifetime', value: 'lifetime'},
				{name: '2021-2022', value: 'y2'},
				{name: '2022-2023', value: 'y3'},
			))
		.addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name of the runner')
            .setRequired(false)),
	async execute(interaction) {
		// change users sheet to make fname col first name only, and lname col all other names after fname. this will likely be in /newrun, /addme, /totalmiles, util.setusers, util.getusers. check everywhere else with a search find

		// editable 2mi map : https://www.google.com/maps/d/u/0/edit?mid=1mp2oGLhO5KcrFIsgZc2xfsmHEkLrKUw&ll=35.31207933290163%2C-80.75084979236159&z=18
		// preivew map : https://www.google.com/maps/d/u/0/viewer?mid=1mp2oGLhO5KcrFIsgZc2xfsmHEkLrKUw&ll=35.31230001682948%2C-80.75106000000001&z=18

		try {
			await interaction.deferReply();
			const totalMilesType = interaction.options.getString('type');
			const user = interaction.user.id;
			
			// if name is null on command submission, check for name in users obj
			let name = interaction.options.getString('name');
			name = name === null ? util.getUserById(user) : interaction.options.getString('name').toLowerCase().trim();
	
			// return with response if they don't proved a name and are not yet in the system
			if(name === null) {
				return interaction.editReply('You are not in the system, so you must provide your name to get your miles. If you use the **/addme** command, you will be put into the system and no longer have to provide your name when running the **/newrun** & **/totalmiles** commands.');
			}else { // else we have good data, and get the miles
				const sheet = await util.getSheet(env.BOOK_RUN_TOTALS,'lifetime');
				if(sheet != undefined) {
					const rows = await sheet.getRows();
					if(rows.length > 0) {
						const row = util.getLifetimeMilesRow(rows,name);
	
						// reply if no name found at all
						if(row === false){
							return interaction.editReply('**' + util.capsFirst(name) + '** does not have any records. Please make sure you spelled the name correctly.');
						}
	
						//return data, or they don't have a row with their name
						if(row && row[totalMilesType] !== '') {
							let res = '';
							// add name if they pass it
							if(util.getUserById(user) !== null && name === util.getUserById(user)) {
								res = 'Your ' + sd.years[totalMilesType] + ' miles: **' + row[totalMilesType] +'**';
							} else {
								res = util.capsFirst(name) + '\'s ' + sd.years[totalMilesType] + ' miles: **' + row[totalMilesType] + '**';
							}
							return interaction.editReply(res);
						}else { // else nothing has been recorded for that request
							// if they passed a name or not
							if(interaction.options.getString('name') === null){
								return interaction.editReply('You do not have any miles recorded for the request: **' + sd.years[totalMilesType] + '** :cow:');
							} else {
								return interaction.editReply(util.capsFirst(name) + ' does not have any miles recorded in the system for request: **' + sd.years[totalMilesType] + '** :cow:');
							}
						}
					}
				}
			}
			return interaction.editReply('Something went wrong when ' + interaction.member.nickname + ' tried to run the /totalmiles command. <@332685115606171649>');
		} catch (error) {
			console.log(error);
			return interaction.reply('Something went wrong using this command!');
		}
	},
};