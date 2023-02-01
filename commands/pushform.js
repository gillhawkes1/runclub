const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');

//protected vars import
const varfile = require('dotenv');
const { sd } = require('../staticdata.js');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pushform')
		.setDescription('admin only. push google form data to run sheets.'),
	async execute(interaction) {


		// update /pushform to update the rewards they get if they hit a tier on transfer of run data
        // TODO: check for name on lifetime sheet add them if they are only google sheet submitters and don't use /newrun (/newrun adds them to lifetime sheet automatically)
		// update /pushform to update the current yearly (y3 is now) and lifetime miles amounts in the sheet


        try {
            if(util.isRole(interaction,'Admin') == false){
                return interaction.reply('You are not an admin. lol nice try :brain:');
            }
            await interaction.deferReply();
            const sheet = await util.getSheet(env.BOOK_GOOGLE_FORM_DUMP,'Form Responses 1');
            const rows = await sheet.getRows();
            if(rows.length > 0){
                let reply = '';
                let returnData = {records: 0, newSheets: 0, sheetExists: 0, badTimeNames: [], requests: 2};
                for(let i = 0; i < rows.length; i++){
                    //check for record timestamp and if a record has not been transferred yet
                    if(rows[i].timestamp != undefined && rows[i].transfer_status != 1){
                        //control requests per minute and break out of loop
                        if(returnData.requests > 40){
                            reply += 'I had to stop running the /pushform command early because there were too many records to push. Just use **/pushform** again to continue.\n';
                            break;
                        }
                        let pushdata = {};
                        pushdata.date = rows[i].timestamp.split(' ')[0];
                        pushdata.date = pushdata.date.split('')[0] == '0' ? pushdata.date.slice(1) : pushdata.date;
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
                        //append miliseconds onto end of time for google sheets
                        pushdata.time += '.000';
                        pushdata.comment = rows[i].comment != undefined ? rows[i].comment.trim() : '';
                        pushdata.multiplier = rows[i].multiplier.split('')[1];
                        //check for run sheet
                        const sheet = await util.getSheet(env.BOOK_NEW_RUN,name);
                        returnData.requests++;
                        if(sheet != undefined){
                            console.log('sheet found, added row:', pushdata);
                            await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                            returnData.requests++;
                            returnData.sheetExists++;
                        }else{ //create new sheet and then add their data
                            const headers = ['date','fname','lname','distance','time','comment','multiplier'];
                            console.log('NEW SHEET, added row:', pushdata);
                            await util.addSheet(env.BOOK_NEW_RUN,name,headers);
                            returnData.requests++;
                            await util.addRowToSheet(env.BOOK_NEW_RUN,name,pushdata);
                            returnData.requests++;
                            returnData.newSheets++;
                        }
                        rows[i].transfer_status = 1;
                        await rows[i].save();
                        returnData.requests++;
                        returnData.records++;
    
                        // get lifetime sheet and update yearly and lifetime miles. add them to sheet if they don't have a row yet
                        const lifetimeSheet = await util.getSheet(env.BOOK_RUN_TOTALS,'lifetime');
                        returnData.requests++;
                        const lifetimeRows = await lifetimeSheet.getRows();
                        returnData.requests++;
                        const foundRow = util.getLifetimeMilesRow(lifetimeRows,name);
                        if(foundRow) {
                            foundRow.lifetime = parseFloat(foundRow.lifetime) + parseFloat(pushdata.distance * pushdata.multiplier);
                            foundRow[sd.currentYear] = parseFloat(foundRow[sd.currentYear]) + parseFloat(pushdata.distance * pushdata.multiplier);
                            await foundRow.save();
                            returnData.requests++;
                        } else {
                            let newLifetimeRow = {
                                user_id: '',
                                fname: pushdata.fname,
                                lname: pushdata.lname,
                                lifetime: parseFloat(pushdata.distance * pushdata.multiplier),
                            }
                            newLifetimeRow[sd.currentYear] = parseFloat(pushdata.distance * pushdata.multiplier);
                            await util.addRowToSheet(env.BOOK_RUN_TOTALS,'lifetime',newLifetimeRow);
                            returnData.requests++;
                            console.log('did not find lifetime row, newlifeimte row: ',newLifetimeRow);
                        }
                    } // end records that need transferring
                }//end for loop
    
                let plural = returnData.records > 1 ? 'were' : 'was';
    
                //if bad times were submitted to form
                if(returnData.badTimeNames.length){
                    reply += `${returnData.records} records ${plural} pushed.\n${returnData.newSheets} new run sheet(s) created.\n`;
                    for(let i = 0; i <= returnData.badTimeNames.length - 1; i++){
                        //if last person with bad data
                        if(i == returnData.badTimeNames.length - 1){
                            //if only 1 person had bad data
                            if(i == 0){
                                reply += util.capsFirst(returnData.badTimeNames[i]) + ' submitted a bad time.'
                                return interaction.editReply({content: reply});
                            }
                            reply += 'and ' + util.capsFirst(returnData.badTimeNames[i]) + ' ';
                        }else{
                            reply += util.capsFirst(returnData.badTimeNames[i]) + ', ';
                        }
                    }
                    reply += 'all submitted badly formatted times.\nEncourage them to use the correct format :cow:';
                    return interaction.editReply({content: reply});
                }
                if(returnData.records > 0){
                    return interaction.editReply(`${returnData.records} records ${plural} pushed.\n${returnData.newSheets} new run sheet(s) created.`);
                } else {
                    return interaction.editReply('There was no data to push.');
                }
            }else{
    
            }
        } catch (error) {
            console.log(error);
            return interaction.reply('Something went wrong using this command!');
        }
    }
}