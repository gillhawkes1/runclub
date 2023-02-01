const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const { formatName, capsFirst, getUserById } = require('./../utility.js');
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
        try {
            let reply = '';
            let name = interaction.options.getString('name').toLowerCase();
            name = formatName(name);
            let fname = name[0];
            let lname = name[1];
            const fullName = `${fname} ${lname}`;
    
            // return and ask for last name if only one name provided
            if(lname === ''){
                return interaction.reply('Please enter both first and last name when using **/addme**.');
            }
            // check local for user in sd.users obj
            const nameInUsers = util.getUserById(interaction.user.id);
            if(nameInUsers !== null ){
                return interaction.reply(`You are already in the system as **${util.capsFirst(nameInUsers)}**. Please inform an admin if this is a mistake.`)
            }
    
            //defer reply; name is not in local users data and we have to make google sheets api calls
            await interaction.deferReply();
            const sheet = await util.getSheet(env.BOOK_USER_ID,'users');
            if(sheet != undefined){
                const udata = { userid: interaction.user.id, fname: fname, lname: lname };
    
                //add user to user sheet, re-set local users obj
                await util.addRowToSheet(env.BOOK_USER_ID,'users',udata);
                console.log('new user added: ',udata);
                await util.setUsers();
    
                //check for run sheet from a google form transfer
                const runSheet = await util.getSheet(env.BOOK_NEW_RUN,fullName);
                if(runSheet == undefined){
                    const headers = ['date','fname','lname','distance','time','comment','multiplier'];
                    await util.addSheet(env.BOOK_NEW_RUN,fullName,headers);
                    console.log('run sheet added: ',udata);
                    await util.setRunSheets();
                }
    
                reply += util.randIndex(sd.greeting) + ' ' + util.capsFirst(fname) + '! Record a run with **/newrun**! :cow:';
    
                //check their server name and update it if it does not already contain their name\
                let currentNickname = '';
                if(interaction.server.nickname) {
                    currentNickname = interaction.member.nickname.toLowerCase();
                }
                if(util.isRole(interaction, 'Admin') == false && currentNickname.includes(fname) == false){
                    const newNickname = (`${fname} ${lname[0]}`);
                    console.log(`user: ${interaction.user.id} received a new nickname:`,util.capsFirst(newNickname));
                    interaction.member.setNickname(util.capsFirst(newNickname),'current nickname did not contain real name');
                    reply += '\nI went ahead and changed your server nickname to ' + util.capsFirst(newNickname) + ' so people know who you are! :cowboy:';
                }
                return interaction.editReply(reply);
            }else{
                return interaction.editReply('This user sheet doesn\'t exist!');
            }
        } catch (error) {
            console.log(error);
            return interaction.reply('Something went wrong using this command!');
        }
	},
};