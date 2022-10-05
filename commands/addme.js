const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addme')
		.setDescription('Add yourself to the system! Must be done by all runners each year.')
        .addStringOption(option => 
            option.setName('name')
            .setDescription('First and last name(s).')
            .setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        let reply = '';
        const name = interaction.options.getString('name').toLowerCase();
        let fname = name.split(' ')[0];
        let lname = name.split(' ')[1];

        if(name.split(' ').length < 2){
            return interaction.editReply('Please enter both first and last name when using **/addme**.');
        }
        //get user sheet for the current year
        const sheet = await util.getSheet(env.BOOK_USER_ID,env.CURRENT_YEAR);

        //sheet should NEVER be undefined unless starting a new year
        if(sheet != undefined){
            const rows = await sheet.getRows();
            for(let row of rows){
                //return on user already in system
                if(row.userid == interaction.user.id){
                    console.log(name + ' tried to add themselves again.');
                    return interaction.editReply(util.capsFirst(fname) + ', you are already in the system!');
                }
            }//if no return, add user below

            //add more than one last name to db
            const udata = {userid: interaction.user.id, fname: fname, lname: lname}
            if(name.split(' ').length > 2){
                for(let i = 2; i < name.split(' ').length; i++){
                    const prop = 'lname'+i;
                    udata[prop] = name.split(' ')[i];
                }
            }
            const headers = ['date','fname','lname','distance','time','comment','multiplier'];

            //add user to user sheet
            await util.addRowToSheet(env.BOOK_USER_ID,env.CURRENT_YEAR,udata);
            console.log('new user added: ',udata);

            //check for run sheet from a google form transfer
            const runSheet = await util.getSheet(env.BOOK_NEW_RUN,name);
            if(runSheet == undefined){
                await util.addSheet(env.BOOK_NEW_RUN,name,headers);
                console.log('new sheet added: ',udata);
            }
            reply += util.randIndex(sd.greeting) + ' ' + util.capsFirst(fname) + '! Record a run with **/newrun**! :cow:';

            //check their server name and update it if it does not already contain their name
/*             const currentNickname = interaction.member.nickname.toLowerCase();
            if(util.isRole(interaction, 'Admin') == false && currentNickname.includes(fname) == false){
                const newNickname = (fname + ' ' + lname.split('')[0]);
                interaction.member.setNickname(util.capsFirst(newNickname));
                reply += '\nI went ahead and changed your name to ' + util.capsFirst(newNickname) + ' so people know who you are! :cowboy:';
            } */
            
			return interaction.editReply(reply);
        }else{
            return interaction.editReply('This user sheet doesn\'t exist!');
        }
	},
};