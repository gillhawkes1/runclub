const { SlashCommandBuilder, CommandInteractionOptionResolver } = require('discord.js');
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
			.setRequired(false))
		.addStringOption(option => 
			option.setName('name')
			.setDescription('First and last name')
			.setRequired(false)),

	async execute(interaction) {

		// update /newrun to check for hitting a milestone tier each time a new run is recorded. update milestones_available if former is true
		// update /newrun to re-index the rows according to (ask cliff/vanessa if this even matters) who has the most lifetime miles, or the current leaderboard in the current year

		// TODO: if day is not tuesday, tell them to use /previousrun command here 
		// if(new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase() !== 'tuesday'){
		// 	return interaction.reply('Your run was not submitted since it is not Tuesday. Please use **/previousrun** to submit a run record when you are submitting a run that is not on a Tuesday. The **date** option will allow you to choose the day you ran on! :cow:');
		// }

		try {
			let name = interaction.options.getString('name');
			name = util.validateName(name,interaction);
			// if name comes back as null, they are not on the users table, so they must provide a name to check for their run sheet. tell them to use /addme so they don't need to provide a name on submissions
			if (name === null) {
				return interaction.reply(`Hello! You are not in the system yet. If you use the **/addme** command (submit your first and last name), you can use /newrun without including a name. Otherwise, you will need to provide your first and last name to submit a run each time you use /newrun. Using **/addme** one time so you never have to include your name when you submit a run is the best option. Trust me, I\'m a cowputer! :cow:`);
			}
	
			// if name comes back as false from validation, it is not on a run sheet or in users table
			if (name === false) {
				return interaction.reply('Your submitted name was not found in our users or run sheets database. Please try /newrun again with your first and last name if you know you already have a run sheet. If you previously submitted a run in the google form, you will use the same first and last name that you did there **(so check your spelling!)**. If you continue to get errors with the correct name, contact <@332685115606171649>. **To avoid all of these errors in the future, use */addme* so you won\'t have to use a name each time you submit a run!** <- Heife recommends this as a solution :cow:');
			}
	
			// if they do not have a message returned at this stage, they pass name requirements have have an existing sheet. continue with script
			let fname = util.formatName(name)[0];
			let lname = util.formatName(name)[1];
			if (lname === '') {
				return interaction.reply('Please try **/newrun** again with your first and last name. If you previously submitted a run in the google form, you will use the same first and last name that you did there **(so check your spelling!)**. If you continue to get errors with the correct name, contact <@332685115606171649>.');
			}
			await interaction.deferReply();
	
			const distance = interaction.options.getNumber('distance');
			const time = interaction.options.getString('time'); 
			let comment = interaction.options.getString('comment');
			comment = comment === null ? '' : comment;
	
			const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);
			if (sheet) {
				const rows = await sheet.getRows();
				//if sheet has rows, check for recent submitted run and make sure they don't have two in the same day.
				if(rows.length > 0){
					const lastRun = rows.length-1;
					//if they already recorded a run for the day
					if(rows[lastRun].date == util.getToday()){
						console.log(name + ' tried to add a second run for the day.');
						return interaction.editReply('Heife sees all, and he sees you trying to record more than one run for today. Sneaky, yes. But foolish. If you forgot to submit your run last week and you are doing both today\'s and last weeks, use the google form for the other run. Gill is creating a **/previousrun** command to submit runs you forgot about so you can never miss a submission!');
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
				// if comment, add it to their return message for everyone to see!
				let reply = comment !== '' ? `${util.capsFirst(fname)}: "${comment}"\n` : comment;
				reply += `${util.randIndex(sd.newRunResponse.salute)} ${util.randIndex(sd.newRunResponse.remark)}`;
				await util.addRowToSheet(env.BOOK_NEW_RUN,name,newRunRow);
				console.log('new run recorded: ', newRunRow);
	
				//update yearly and lifetime miles after their submission to their personal sheet
				const lifetimeSheet = await util.getSheet(env.BOOK_RUN_TOTALS,'lifetime');
				if(lifetimeSheet) {
					const lifetimeRows = await lifetimeSheet.getRows();
					let foundRecord = false;

					for(let i = 0; i < lifetimeRows.length; i++){
						if(lifetimeRows[i].fname === fname && lifetimeRows[i].lname === lname) {
							console.log('record found');
							foundRecord = true;

							// if their user id is not in the row yet (not used /addme but have submitted runs before using first name and last name)
							if(!lifetimeRows[i].user_id || lifetimeRows[i].user_id === '') {
								lifetimeRows[i].user_id = interaction.user.id;
							}
							const previousLifetime = parseFloat(lifetimeRows[i].lifetime);
							const newLifetime = parseFloat(lifetimeRows[i].lifetime) + parseFloat(distance * sd.runData.multiplier);
							lifetimeRows[i].lifetime = newLifetime;
							lifetimeRows[i][sd.currentYear] = parseFloat(lifetimeRows[i][sd.currentYear]) + parseFloat(distance * sd.runData.multiplier);
							const newRole = util.grantMileageTierRole(interaction, parseFloat(newLifetime));
							reply += newRole ? ` Congrats! ${newRole} ` : '';

							//check rewards to grant
							const rewards = util.grantRewards(previousLifetime, newLifetime, JSON.parse(lifetimeRows[i].milestones));
							lifetimeRows[i].milestones = JSON.stringify(rewards);

							await lifetimeRows[i].save();
							break;
						}
					}
	
					// add them to the lifetime miles sheet if they do not have a record in there yet
					// this will only be true if they have not submitted a run sheet before or been recorded.
					if (!foundRecord) {
						console.log(`creating a lifetime record for ${name}, as no record was found`);
						// create new lifetime row with their first submission to the db
						let newLifetimeRow = {
							user_id: interaction.user.id,
							fname: fname,
							lname: lname,
							lifetime: parseFloat(distance * sd.runData.multiplier),
						}
						newLifetimeRow[sd.currentYear] = parseFloat(distance * sd.runData.multiplier);
						await util.addRowToSheet(env.BOOK_RUN_TOTALS,'lifetime',newLifetimeRow);
						console.log('newLifetimeRow', newLifetimeRow);
					}
				}
				return interaction.editReply(reply);
			} else {
				return interaction.reply(`Something went wrong when trying to get a sheet for ${name}. <@332685115606171649>, help! `)
			}
		} catch (error) {
			console.log(error);
			return interaction.reply('Something went wrong using this command!');
		}
	},
};