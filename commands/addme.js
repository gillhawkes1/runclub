const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addme')
		.setDescription('Add yourself to the system! Must be done by all runners each year.')
        .addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name.')
            .setRequired(true)),
	async execute(interaction) {
        const name = interaction.options.getString('name').toLowerCase();
        const fname = name.split(' ')[0];
        const lname = name.split(' ')[1];

        if(name.split(' ').length < 2){
            return interaction.reply('Please enter both first and last name when using **/addme**.');
        }
        //get user sheet for the current year
        const sheet = await util.getSheet(envvars.BOOK_USER_ID,envvars.CURRENT_YEAR);

        if(sheet != undefined){
            const rows = await sheet.getRows();
            for(let row of rows){
                //return on user already in system
                if(row.userid == interaction.user.id){
                    return interaction.reply(util.capitalizeFirstLetter(fname) + ', you are already in the system!');
                }
            }//if no return, add user below

            const udata = {userid: interaction.user.id, fname: fname, lname: lname}
            const headers = ['date','fname','lname','distance','time','comment','multiplier'];

            //add user to user sheet, then add sheet to new run book
            await util.addRowToSheet(envvars.BOOK_USER_ID,envvars.CURRENT_YEAR,udata);
            await util.addSheet(envvars.BOOK_NEW_RUN,name,headers);            
			return interaction.reply(util.randIndex(sd.greeting) + ' ' + util.capitalizeFirstLetter(fname) + '! Record a run with **/newrun**!');
        }else{
            return interaction.reply('This sheet doesn\'t exist!');
        }
	},
};