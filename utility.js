const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');

module.exports = {
    async getSheet(bookid,sheetname=false){
        const doc = new GoogleSpreadsheet(bookid);
		await doc.useServiceAccountAuth({
			client_email: creds.client_email,
			private_key: creds.private_key
		});
		await doc.loadInfo().catch((error) => {
			console.log(error);
			console.log('error occurred in catch');
			return false;
		})
		const sheet = doc.sheetsByTitle[sheetname];
		return sheet;
    },

    addRowToSheet(book,sheet,data){

    },

    isRole(interaction,roleType){
        return interaction.member.roles.cache.some(role => role.name === `${roleType}`);
    }
    
}