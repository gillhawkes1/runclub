const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getmultiplier')
		.setDescription('Get the multiplier for runs.'),
	async execute(interaction) {
        try {
            if(util.isRole(interaction, 'Admin') == false){
                return interaction.reply('You are not an admin.');
            }
            return interaction.reply({content: 'Multiplier is currently set to ' + sd.runData.multiplier, ephemeral: true});
        } catch (error) {
            console.log(error);
            return interaction.reply('Something went wrong using this command!');
        }
    }
}