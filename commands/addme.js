const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const sd = require('./../staticdata.js');


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
        if(name.split(' ').length < 2){
            return interaction.reply('Please enter both first and last name when using **/addme**.');
        }
        const sheet = await util.getSheet(envvars.BOOK_NEW_RUN,name);
        const fname = name.split(' ')[0];

        //verify sheet does not exist, then add sheet
        if(sheet == undefined){
            const headers = ['date','fname','lname','distance','time','comment','multiplier'];

            //add sheet to new run book
            await util.addSheet(envvars.BOOK_NEW_RUN,name,headers);

            console.log('added new sheet for : '+ name);
			return interaction.reply(util.randIndex(sd.data.greeting) + ', ' + util.capitalizeFirstLetter(fname) + '! Record a run with **/newrun**!');
    
        //else they are already in the system trying to add themselves again
        }else{
			return interaction.reply(fname + ', you are already in the system!');
        }
	},
};