const { SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');
const Handlebars = require('handlebars');



//protected vars import
const varfile = require('dotenv');
const { capsFirst } = require('./../utility.js');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Get the current leaderboard standings')
        .addStringOption(option => 
            option.setName('timeline')
            .setDescription('What leaderboard year you would like to see?')
            .setRequired(true)
            .addChoices(
				{name: 'All', value: 'lifetime'},
				{name: '2021-2022', value: 'y2'},
				{name: '2022-2023', value: 'y3'},
			))
        .addStringOption(option =>
            option.setName('type')
            .setDescription('What leaderboard type you would like to see?')
            .setRequired(true)
            .addChoices(
                {name: 'Everyone', value: 'all'},
            )),
            //{name: 'My relative position in the leaderboard', value: 'me'},
	async execute(interaction) {
        try {
            const leaderBoardYear = interaction.options.getString('timeline');
            const leaderBoardType = interaction.options.getString('type');
            const hbsTemplateName = leaderBoardType === 'all' ? 'leaderboardAll' : 'leaderboardMe';
            await interaction.deferReply();

            const leaderboardSheet = await util.getSheet(env.BOOK_RUN_TOTALS,'lifetime');
            const leaderboardData = {
                timeInterval: util.capsFirst(sd.years[leaderBoardYear]),
                cssSheet: `../css/${hbsTemplateName}.css`,
                headers:['#','Runner','Miles'],
                data: { runners: [] },
                dateTime: util.getToday()
            }
            if (leaderboardSheet) {
                const leaderboardRows = await leaderboardSheet.getRows();
                if (leaderboardRows.length) {
                    // sort data into object here then pass to handlebars
                    leaderboardRows.forEach((element) => {
                        // if have miles that year
                        if(element[leaderBoardYear] > 0) {
                            let runnerInfo = {};
                            runnerInfo.fname = util.capsFirst(element.fname);
                            runnerInfo.lname = util.capsFirst(element.lname);
                            runnerInfo.miles = element[leaderBoardYear];
                            leaderboardData.data.runners.push(runnerInfo);
                        }
                    });
                }
            }
            leaderboardData.data.runners.sort(util.sortRuns);
            leaderboardData.data.runners.map((el, i) => {
                el.rank = `${i + 1}.`;
            });
            // leaderboardData.data = false;

            // read file, and create html content from Handlebars template. inject data into template
            const templateFile = util.getHbsTemplate(hbsTemplateName);
            const fileContent = await util.readFile(templateFile);
            const template = Handlebars.compile(fileContent);
            const htmlContent = template(leaderboardData);

            await util.createPageScreenshot(htmlContent, { path: 'leaderboardAll.png', fullPage: true });
            return interaction.editReply({files: [`${env.ROOT_PATH}/leaderboardAll.png`]});
        } catch (error) {
            console.log(error);
            return interaction.reply('Something went wrong using this command!');
        }
    }
}
