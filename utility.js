const { GoogleSpreadsheet } = require('google-spreadsheet');
const { GuildMemberRoleManager } = require('discord.js');
const creds = require('./client_secret.json');
const { sd } = require('./staticdata.js');
const fs = require('node:fs');
const path = require('node:path');
const nodeUtil = require('node:util');
const nodeReadFile = nodeUtil.promisify(fs.readFile);
const puppeteer = require('puppeteer');

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	async startUp(client){
		try {
			console.log('Initializing startUp()...');
			await this.setUsers();
			await this.setRunSheets();
			await this.setGuildRoles(client);
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

	async setGuildRoles(client) {
		const armoredCalves = client.guilds.cache.find((channel) => {
			return channel.id === env.GUILD_ID;
		});
		const guildRoles = armoredCalves.roles.cache.map((role) => {
			return role;
		});
		
		const mileageRoles = [];
		armoredCalves.roles.cache.forEach((role) => {
			const thisRole = {};
			const roleDistance = role.name.split(' ')[0];
			if(parseInt(roleDistance)) {
				const intDistance = parseInt(roleDistance);
				thisRole[intDistance] = role.name;
				mileageRoles.push(thisRole);
			}
		});
		sd.mileageRoles = mileageRoles;
		sd.guildRoles = guildRoles;
		console.log('Local roles have been set.');
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

	grantMileageTierRole(interaction,lifetimeMiles) {
        try {
            // if lifetime total is eligible for role
            let newMileageTier = false;
            if(lifetimeMiles >= parseInt(Object.keys(sd.mileageRoles[0])) && lifetimeMiles <= parseInt(Object.keys(sd.mileageRoles[sd.mileageRoles.length-1]))) {
                const memberRole = new GuildMemberRoleManager(interaction.member);

                //get all roles of member
                const myRoles = memberRole.cache.map((role) => {
                    return role;
                });

                for(let i = 0; i < sd.mileageRoles.length; i++) {
                    let previousRoleMiles = false, previousRoleName = false, nextRoleMiles = false, nextRoleName = false;
                    const thisRoleMiles = parseInt(Object.keys(sd.mileageRoles[i])[0]);
                    const thisRoleName = Object.values(sd.mileageRoles[i])[0];
                    if(i > 0) {
                        previousRoleMiles = parseInt(Object.keys(sd.mileageRoles[i-1])[0]);
                        previousRoleName = Object.values(sd.mileageRoles[i-1])[0];
                    }
                    if(i !== sd.mileageRoles.length - 1) {
                        nextRoleMiles = parseInt(Object.keys(sd.mileageRoles[i+1])[0]);
                        nextRoleName = Object.values(sd.mileageRoles[i+1])[0];
                    }

                    // if first index tier only
                    if (i === 0 && !previousRoleMiles && lifetimeMiles >= parseInt(Object.keys(sd.mileageRoles[i])[i]) && lifetimeMiles < parseInt(Object.keys(sd.mileageRoles[i+1])[i])) {
                        const roleToGrant = sd.guildRoles.find((role) => {
                            return role.name === thisRoleName;
                        });
                        //check if it exists. if not, grant first tier role
                        if(!myRoles.find((role) => role === roleToGrant)) {
                            memberRole.add(roleToGrant, 'Adding role for hitting new mileage tier');
                            newMileageTier = `You are now part of the ${roleToGrant.name}!`;
                            break;
                        }
                    }

                    // if not first or last index tier
                    if (previousRoleMiles && nextRoleMiles) {
                        if(lifetimeMiles >= thisRoleMiles && lifetimeMiles < nextRoleMiles) {
                            const roleToGrant = sd.guildRoles.find((role) => {
                                return role.name === thisRoleName;
                            });

                            // check for previous tier to remove if present
                            const previousRole = myRoles.find((role) => role.name === previousRoleName);
                            if(previousRole) {
                                memberRole.remove(previousRole,'Removing role for hitting new mileage tier');
                            }

                            //check for current tier before adding it
                            if(!myRoles.find((role) => role === roleToGrant)) {
                                memberRole.add(roleToGrant, 'Adding role for hitting new mileage tier');
                                newMileageTier = `You are now part of the ${roleToGrant.name}!`;
                                break;
                            }
                        }
                    }

                    //if last index tier only
                    if(!nextRoleMiles && lifetimeMiles >= parseInt(Object.keys(sd.mileageRoles[i])[0])) {
                        const roleToGrant = sd.guildRoles.find((role) => {
                            return role.name === thisRoleName;
                        });

                        // check for previous tier to remove if present
                        const previousRole = myRoles.find((role) => role.name === previousRoleName);
                        if(previousRole) {
                            memberRole.remove(previousRole,'Removing role for hitting new mileage tier');
                        }

                        //check for current tier before adding it
                        if(!myRoles.find((role) => role === roleToGrant)) {
                            memberRole.add(roleToGrant, 'Adding role for hitting new mileage tier');
                            newMileageTier = `You are now part of the ${roleToGrant.name}!`;
                            break;
                        }
                    }

                }
            }
            return newMileageTier;

        } catch (error) {
            console.log(error);
        }
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

	getFile(filePath,filename) {
		return path.resolve(filePath,filename)
	},

	getHbsTemplate(filename) {
		return this.getFile(`${env.ROOT_PATH}/templates`,`${filename}.hbs`);
	},

	async readFile(filePath) {
		let file = await nodeReadFile(filePath,'utf8');
		return file;
	},

	async createPageScreenshot(htmlContent, screenshotOptions = {}) {
		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.setContent(htmlContent);
			await page.screenshot(screenshotOptions);
		} catch (error) {
			console.log(error);
		}

	},

	sortRuns(a, b){
		if(parseFloat(a.miles) > parseFloat(b.miles)) {
			return -1;
		}
		if(parseFloat(a.miles) < parseFloat(b.miles)) {
			return 1;
		}
		return 0;
	}

}
