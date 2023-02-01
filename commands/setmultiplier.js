const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setmultiplier')
		.setDescription('Set the multiplier for runs.')
        .addNumberOption(option => 
            option.setName('multiplier')
            .setDescription('multiplier amount')
            .setRequired(true)),
	async execute(interaction) {
        try {
            if(util.isRole(interaction, 'Admin') == false){
                return interaction.reply('You are not an admin. lol nice try');
            }
            const m = interaction.options.getNumber('multiplier');
            let res = util.setMultiplier(m);
            console.log(res);
            return interaction.reply({content: 'Multiplier is now set to ' + m, ephemeral: true});
        } catch (error) {
            console.log(error);
            return interaction.reply('Something went wrong using this command!');
        }
    }
}