const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');
const { users } = require('./../users.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

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
		await interaction.deferReply();
		const name = interaction.options.getString('name').toLowerCase().trim();
		let fname = name.split(' ')[0];
		let lname = '';
		if (name.split(' ').length > 1) {
			lname = name.split(' ')[1];
		} else {
			return interaction.editReply('Please try **/newrun** again with your first and last name. If you previously submitted a run in the google form, you will use the same first and last name that you did there.');
		}

		const distance = interaction.options.getNumber('distance');
		const time = interaction.options.getString('time');
		let comment = interaction.options.getString('comment');
		comment = comment == null ? '' : comment;
		const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);

		//if their sheet exists 
		if(sheet != undefined){
			const rows = await sheet.getRows();

			//if sheet has rows
			if(rows.length > 0){
				const lastRun = rows.length-1;
				//if they already recorded a run for the day
				if(rows[lastRun].date == util.getToday()){
					console.log(name + ' tried to add a second run for the day.');
					return interaction.editReply('Heife sees all, and he sees you trying to record more than one run for today. Sneaky, yes. But foolish.');
				}
			}

			const today = util.getToday();
			
			const newRunRow = {
				date: today,
				fname: fname,
				lname: lname,
				distance: distance,
				time: time + '.000',
				comment: comment,
				multiplier: sd.runData.multiplier
			}

			await util.addRowToSheet(env.BOOK_NEW_RUN,name,newRunRow);
			console.log('new run recorded: ',newRunRow);
			let reply = util.randIndex(sd.newRunResponse.salute) + ' ' + util.randIndex(sd.newRunResponse.remark);

			//check their server name and update it if it does not already contain their name
/*             const currentNickname = interaction.member.nickname.toLowerCase();
            if(util.isRole(interaction, 'Admin') == false && currentNickname.includes(fname) == false){
                const newNickname = (fname + ' ' + lname.split('')[0]);
                interaction.member.setNickname(util.capsFirst(newNickname));
                reply += '\nI went ahead and changed your name to ' + util.capsFirst(newNickname) + ' so people know who you are! :cowboy:';
            } */
			return interaction.editReply(reply);	

		//else if they are not in the system yet (they don't have a sheet to record their runs)
		}else{
			console.log(name + ' was not in the system when they tried /newrun');
			return interaction.editReply('You are not in the system yet (make sure your name was spelled correctly, as this can cause a problem: **' + util.capsFirst(name) + '**). Please use **/addme** to add yourself into the system, then record your run with **/newrun**. If you believe you are already in the system and this is an error, contact <@332685115606171649>.');
		}
	},
};