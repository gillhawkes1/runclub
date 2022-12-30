const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');
const { sd } = require('./staticdata.js');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	async startUp(){
		console.log('initiating startUp()...');
		await this.getAllSheets();
		console.log('sd.books');
		console.log(sd.books);
	},

	async getAllSheets(){
		let reqct = 0;
		for(const book of sd.bookNames){
			const doc = new GoogleSpreadsheet(env[book]);
			await doc.useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
			reqct++;
			await doc.loadInfo();
			reqct++;

			let info = {};
			info.sheets = [];
			info.title = doc.title;
			if(book == 'BOOK_USER_ID'){
				const sheet = doc.sheetsByTitle['y3'];
				console.log(doc.sheetsByTitle['y3']);
				const rows = await sheet.getRows();
				if(rows.length > 0){
					//console.log('test data: ', test);

					//set headers and attributes
					sd.books[book] = {};
					sd.books[book].title = doc.sheetsByTitle['y3'].title;	
					const headers = doc.sheetsByTitle['y3'].headerValues;
					sd.books[book].headerValues = [];
					sd.books[book].headerValues = headers;
					

					//set rows 
					for(let j = 0; j < rows.length -1; j++){
						//console.log(rows[j]);
						//sd.books[book].
						//console.log(sheet.headerValues[headers[j]])
					}
				}
			}
		}			
		console.log(sd.books);
		/**			
			//if sheets within book
			if(doc.sheetsByIndex.length > 0){
				for(let i = 0; i < doc.sheetsByIndex.length; i++){
					const sheet = doc.sheetsByIndex[i];
					const rows = await sheet.getRows();
					reqct++;
					//console.log(reqct);
					//console.log(i);
					console.log(doc.title, sheet.title);
					console.log(rows);
					
					sd.books[i] = sheet.title;
					sd.books[i].rows = rows;

					info.sheets[i] = sheet.title;
					//info.sheets[i].rows = rows;
					setTimeout(() => {},2000);
				}
			}
 */

	},

	async getBook(bookid){
		const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
		await doc.loadInfo();
		return doc;
	},

	async getSheet(bookid,sheetname=false){
		const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
		await doc.loadInfo();
		return doc.sheetsByTitle[sheetname];
	},

	async addSheet(bookid,newSheetName,headers){
		const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
		await doc.addSheet({ title: newSheetName, headerValues: headers });
	},
    
    async addRowToSheet(bookid,sheetname,data){
		const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
		await doc.loadInfo();
		const sheet = doc.sheetsByTitle[sheetname];
		await sheet.addRow(data);
    },

    isRole(interaction,roleType){
        return interaction.member.roles.cache.some(role => role.name === `${roleType}`);
    },

	randIndex(array){
		return array[Math.floor(Math.random()*array.length)];
	},

	getToday(){
		let today = new Date();
		const dd = String(today.getDate()).padStart(2, '0');
		const mm = String(today.getMonth() + 1).padStart(2, '0'); //jan is 0
		const yyyy = today.getFullYear();
		today = mm + '/' + dd + '/' + yyyy;
		today = today.split('')[0] == '0' ? today.slice(1) : today;
		return today;
	},

	capsFirst(string){
		if (string.indexOf(' ') >= 0) {
			let nextCap = true;
			let output = '';
			for (let letter of string.split('')) {
				letter = nextCap ? letter.toUpperCase() : letter;
				output += letter;
				nextCap = letter == ' ' ? true : false;
			}
			return output;
		} else {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	},

	validateTime(time){
		try {
			if(time.length <= 2){
				return time + ':00';
			}
			if(time.includes('.')){
				time.replace('.',':');
			}
			if(parseInt(time.split('')[0])){
				let mins = time.split('')[0];
				if(parseInt(time.split('')[1])){
					mins += time.split('')[1];
				}
				let secs = ':';
				secs += time.slice(2).split('').filter((e) => {return parseInt(e)}).join('') || '00';
				return mins + secs;
			}
			if(time.length == 3){
				time += '0';
				return time;
			}
			console.log('error: bad time returned!');
			return 'BAD_TIME'
		} catch (error) {
			console.log(error);
			return 'BAD_TIME';
		}
	},

	setMultiplier(multiplier){
		const prev = sd.runData.multiplier;
		sd.runData.multiplier = multiplier;
		return prev, sd.runData.multiplier;
	},

	deploy(commands){
		const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
		rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	},
}