const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pushform')
		.setDescription('admin only. push google form data to run sheets.'),
	async execute(interaction) {
        if(util.isRole(interaction,'Admin') == false){
            return interaction.reply('You are not an admin.');
        }
        await interaction.deferReply();
        const sheet = await util.getSheet(env.BOOK_GOOGLE_FORM_DUMP,'Form Responses 1');
        const rows = await sheet.getRows();
        if(rows.length > 0){
            let returnData = {records: 0, newSheets: 0, sheetExists: 0};
            for(let i = 0; i < rows.length; i++){
                if(i >= 39 && rows[i].transfer_status == 0){
                    let pushdata = {};
                    pushdata.date = rows[i].timestamp.split(' ')[0];
                    pushdata.fname = rows[i].fname.toLowerCase();
                    pushdata.lname = rows[i].lname.toLowerCase();
                    pushdata.distance = rows[i].distance;
                    pushdata.time = rows[i].time;
                    pushdata.comment = rows[i].comment;
                    pushdata.multiplier = rows[i].multiplier.split('')[1];
                    console.log(pushdata);
                    //check for sheet
                    const name = pushdata.fname + ' ' + pushdata.lname;
                    const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);
                    if(sheet != undefined){
                        await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                        returnData.sheetExists++;
                    }else{ //create new sheet and then add their data
                        const headers = ['date','fname','lname','distance','time','comment','multiplier'];
                        await util.addSheet(env.BOOK_NEW_RUN,name,headers);
                        await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                        returnData.newSheets++;
                    }
                    rows[i].transfer_status = 1;
                    await rows[i].save();
                    returnData.records++;
                }
            }
            return interaction.editReply(`${returnData.records} records were pushed.\n${returnData.newSheets} new run sheet(s) were created.`);
        }else{
            return interaction.editReply('There was no data to push.');
        }
    }
}