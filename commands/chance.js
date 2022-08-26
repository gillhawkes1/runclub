const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const sd = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const envvars = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chance')
		.setDescription('Heife tells you the % chance.')
        .addStringOption(option => 
            option.setName('question')
            .setDescription('Ask away.')
            .setRequired(true)),
	async execute(interaction) {
        const question = interaction.options.getString('question');
        if(question.split('').includes('?') == false){
            return interaction.reply('Use a question moork please :cow:');
        }else{
        let chance = [];
        for(let i = 0; i < 101; i++){
            chance.push(i);
            i++;
        }
        const pChance = util.randIndex(chance);
        console.log(pChance);
        let reaction = '';
        switch (true) {
            case (pChance > 0 && pChance <= 33):
                console.log('bad');
                reaction = util.randIndex(sd.data.reactions.bad);
                break;
            case (pChance > 33 && pChance <= 67):
                console.log('ok');
                reaction = util.randIndex(sd.data.reactions.ok);               
                break;
            case (pChance > 67 && pChance <= 100):
                console.log('good');
                reaction = util.randIndex(sd.data.reactions.good);
                reaction = pChance == 69 ? 'Nice.' : reaction;
                break;
            default:
                break;
        }
        //const reactLevel = util.randIndex(sd.data.reactions.reactLevel);
        return interaction.reply('`' + question + '` \nHeife says ' + pChance + '%. ' + reaction);
        }
    }
}