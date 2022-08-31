const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');
const { sd } = require('./staticdata.js');

module.exports = {
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
		} catch (error) {
			console.log(error);
			return 'BAD_TIME';
		}
	},

	setMultiplier(multiplier){
		const prev = sd.runData.multiplier;
		sd.runData.multiplier = multiplier;
		return prev, sd.runData.multiplier;
	}
}