const { GoogleSpreadsheet } = require('google-spreadsheet');
const { GuildMemberRoleManager } = require('discord.js');
const creds = require('./client_secret.json');
const { sd } = require('./staticdata.js');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	async startUp(){
		try {
			console.log('Initializing startUp()...');
			await this.setUsers();
			await this.setRunSheets();
		} catch (error) {
			console.log('error in startUp()');
			console.log(error);
		}
	},

	async setUsers() {
		const users = await this.getSheet(env.BOOK_USER_ID,'users');
		const userRows = await users.getRows();
		let usersObj = {};
		for(let i = 0; i < userRows.length; i++){
			const userid = userRows[i].userid;
			let name = userRows[i].fname + ' ' + userRows[i].lname;
			usersObj[userid] = name;
		}
		sd.users = usersObj;
		console.log('Local users have been set.')
	},

	async setRunSheets() {
		const runSheets = await this.getBook(env.BOOK_NEW_RUN);
		//let runSheetsArr = runSheets.map(sheet => sheet.title);
		let runSheetsArr = [];
		for(let i = 0; i < runSheets.sheetCount; i++) {
			runSheetsArr.push(runSheets.sheetsByIndex[i].title);
		}
		sd.runData.runSheetTitles = runSheetsArr;
		console.log('Local run sheet titles have been set.');
	},

	getUserById(userid){
		return sd.users[userid] || null;
	},

	getLifetimeMilesRow(rows, name) {
		const searchName = this.formatName(name);
		for(let i = 0; i < rows.length; i++){
			if(rows[i].fname === searchName[0] && rows[i].lname === searchName[1]) {
				return rows[i];
			}
		}
		return false;
	},

	formatName(name){
		name = name.trim();
		const fname = name.split(' ')[0];
		let lname = name.split(' ');
		lname[0] = '';
		lname = lname.join(' ').trim();
		return [fname,lname];
	},

	validateName(name,interaction) {
		let resName = name;
		const user_id = interaction.user.id;
		// if they did not submit a name, return their matched userid to their name in the users table, or null if not found. 
		if(resName === null) {
			return this.getUserById(user_id);
		} else {
			resName = name.toLowerCase().trim();
			// if they input a name, validate it if they are already have a run sheet or return null if no run sheet in that name
			if (resName === sd.runData.runSheetTitles.find((sheetName) => sheetName === resName)){
				return resName;
			} else {
				// check to see even though they provided a name, they are not in the users table. return false if nothing is found
				return this.getUserById(user_id) !== null ? this.getUserById(user_id) : false;
			}
		}
	},

	// TODO: refactor to grantRole(user,role); and create a function that is revokeRole(user,role); much more coherent that way. do logic in command that needs it
	// set role ids in static data and pull from there
	async grantMileageTierRole(interaction,newMileageTier,previousMileageTier) {
		const memberRole = new GuildMemberRoleManager(interaction.member);
        await interaction.guild.roles.fetch().then((res) => {
			let newRole;
            for(const [role,value] of res){
				if (value.name === newMileageTier) {
                    memberRole.add(role,'Added role because a new mileage tier was hit!');
					newRole = value.name
				}
                if (value.name === previousMileageTier){
                    memberRole.remove(role,'Removed role because a new mileage tier was hit.');
                }
            }
			return newRole || false;
        });
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
	}
}