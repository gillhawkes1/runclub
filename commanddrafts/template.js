const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('commandname')
		.setDescription('a command description')
        .addStringOption(option => 
            option.setName('param')
            .setDescription('param description')
            .setRequired(true)),
	async execute(interaction) {
        const param = interaction.options.getString('param');            
        return interaction.reply('reply');
    }
}




// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// if(interaction.user.id != '332685115606171649'){
//     return interaction.reply('Gill is fixing a bug! Try again some other time.');
// }
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


