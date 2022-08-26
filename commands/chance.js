const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const sd = require('./../staticdata.js');

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
        }
        const pChance = util.randIndex(chance);
        let reaction = '';
        switch (true) {
            case (pChance > 0 && pChance <= 40):
                reaction = util.randIndex(sd.data.reactions.bad);
                break;
            case (pChance > 40 && pChance <= 69):
                reaction = util.randIndex(sd.data.reactions.ok);    
                reaction = pChance == 69 ? 'Nice.' : reaction;           
                break;
            case (pChance > 69 && pChance <= 100):
                reaction = util.randIndex(sd.data.reactions.good);
                break;
            default:
                reaction = 'Well I\'m somehow answering this.';
                break;
        }
        return interaction.reply('`' + question + '` \nHeife says ' + pChance + '%. ' + reaction);
        }
    }
}