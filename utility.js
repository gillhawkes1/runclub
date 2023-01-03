const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');
const { sd } = require('./staticdata.js');
const { Routes, Collection, Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require('node:fs');
const path = require('node:path');

// //create and map commands
// const commands = [];
// client.commands = new Collection();
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	commands.push(command.data.toJSON());
// 	client.commands.set(command.data.name, command);
// }

// // check need for command deployment
// // const serverCommands = util.getServerCommands().then(() => {
// // 	const doIDeploy = util.compareCommands(commands, serverCommands);
// // 	if(doIDeploy !== false) {
// // 		console.log('doIDeploy', doIDeploy);
// // 		util.deployCommands(commands);
// // 	}
// // });


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

	getLocalCommands(){
		//create and map commands
		const commands = [];
		client.commands = new Collection();
		const commandsPath = path.join(__dirname, 'commands');
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			commands.push(command.data.toJSON());
			client.commands.set(command.data.name, command);
		}
		return commands;
	},

	deployCommands(commands){
		const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
		rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error);
	},

	mapCommandOptions(commands) {
		let sortedOptions = [];
		for (let command of commands) {
		  // command.options for server commands, OR statement for file commands since they don't have empty arrays, the options prop doesn't exist if they don't have options
			if (command.options || (command.hasOwnProperty('options') && command.options.length)) {
				let option = {};
				option.name = command.name;
				option.options = command.options;
				sortedOptions.push(option);
			}
		}
		return sortedOptions;
	},

	compareCommands(fileCommands, serverCommands) {

		//return this object if there are changes. if not, return false
		const res = { newCommands: [], removedCommands: [], editedCommands: [], editedDescriptions:[] };

		//.then compare received commands from server with commands in files
		const fileCommandNames = fileCommands.map(command => command.name);
		const serverCommandNames = serverCommands.map(command => command.name);
		const fileCommandDescriptions = serverCommands.map(command => command.description);
		const serverCommandDescriptions = serverCommands.map(command => command.description);
		const fileCommandOptions = this.mapCommandOptions(fileCommands);
		const serverCommandOptions = this.mapCommandOptions(serverCommands);

		//get added commands
		for (const fileCommand of fileCommandNames) {
		  	//if command is new, push to "new" object prop array
			if(serverCommandNames.includes(fileCommand) === false) {
				res.newCommands.push(fileCommand);
			}
		}
		//get removed commands
		for (const serverCommand of serverCommandNames) {
			if(fileCommandNames.includes(serverCommand) === false) {
				res.removedCommands.push(serverCommand);
			}
		}

		//edited descriptions
		for (const description of fileCommandDescriptions) {
			if(serverCommandDescriptions.includes(description) === false) {
				res.editedDescriptions.push(description);
			}
		}
		
		//compare options
		for (const fileCommandOption of fileCommandOptions) {
			for (const serverCommandOption of serverCommandOptions) {
				//if same command
				if(serverCommandOption.name === fileCommandOption.name){
					if (JSON.stringify(serverCommandOption.options) !== JSON.stringify(fileCommandOption.options)) {
						console.log('JSON.stringify(fileCommandOption.options)', JSON.stringify(fileCommandOption.options));
						console.log('JSON.stringify(serverCommandOption.options)', JSON.stringify(serverCommandOption.options));
						res.editedCommands.push(fileCommandOption.name);
					}
				}
			}
		}
		
		//return changes or don't deploy
		if (res.newCommands.length || res.removedCommands.length || res.editedCommands.length) {
			return res;
		} else {
			return false;
		}
	},
	
	checkForCommandDeployment() {
		const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
		rest.get(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {})
		.then((res) => {
			const localCommandFiles = this.getLocalCommands();
			const doIDeploy = this.compareCommands(localCommandFiles, res);
			if(doIDeploy !== false){
				console.log('\n---------- ** COMMAND CHANGES ** ----------');
				console.log(doIDeploy);
				console.log('---------- ** COMMAND CHANGES ** ----------\n');
				this.deployCommands(localCommandFiles);
			}
		}).catch(console.error);
	}
}