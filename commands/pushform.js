const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const { capsFirst } = require('./../utility.js');
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
        if(interaction.user.id != 332685115606171649){
            return interaction.reply('Testing this command currently.');
        }
        await interaction.deferReply({ephemeral: true});
        const sheet = await util.getSheet(env.BOOK_GOOGLE_FORM_DUMP,'Form Responses 1');
        const rows = await sheet.getRows();
        if(rows.length > 0){
            let returnData = {records: 0, newSheets: 0, sheetExists: 0, badTimeNames: []};
            for(let i = 0; i < rows.length; i++){
                //if a record has not been transferred yet
                if(rows[i].transfer_status == 0){
                    let pushdata = {};
                    pushdata.date = rows[i].timestamp.split(' ')[0];
                    pushdata.fname = rows[i].fname.toLowerCase().trim();
                    pushdata.lname = rows[i].lname.toLowerCase().trim();
                    const name = pushdata.fname + ' ' + pushdata.lname;
                    pushdata.distance = rows[i].distance.trim();
                    if(rows[i].time.match(/\d+:[0-5]\d/) == null){
                        returnData.badTimeNames.push(name + (' (' + rows[i].time + ')'));
                        pushdata.time = util.validateTime(rows[i].time.trim());
                    }else{
                        pushdata.time = rows[i].time;
                    }
                    pushdata.comment = rows[i].comment.trim();
                    pushdata.multiplier = rows[i].multiplier.split('')[1];
                    console.log(pushdata);
                    console.log(typeof pushdata.time)
                    //check for sheet
                    const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);
                    if(sheet != undefined){
                        //await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                        returnData.sheetExists++;
                    }else{ //create new sheet and then add their data
                        const headers = ['date','fname','lname','distance','time','comment','multiplier'];
                        //await util.addSheet(env.BOOK_NEW_RUN,name,headers);
                        //await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                        returnData.newSheets++;
                    }
                    //rows[i].transfer_status = 1;
                    //await rows[i].save();
                    returnData.records++;
                }
            }
            if(returnData.badTimeNames.length){
                let reply = `${returnData.records} records were pushed.\n${returnData.newSheets} new run sheet(s) were created.\n`;
                for(let i = 0; i <= returnData.badTimeNames.length - 1; i++){
                    if(i == returnData.badTimeNames.length - 1){
                        reply += 'and ' + capsFirst(returnData.badTimeNames[i]) + ' ';
                    }else{
                        reply += util.capsFirst(returnData.badTimeNames[i]) + ', ';
                    }
                }
                reply += 'all submitted badly formatted times.\nEncourage them to use the correct format :cow:';
                return interaction.editReply({content: reply});
            }
            return interaction.editReply(`${returnData.records} records were pushed.\n${returnData.newSheets} new run sheet(s) were created.`);
        }else{
            return interaction.editReply('There was no data to push.');
        }
    }
}