const { SlashCommandBuilder } = require("discord.js");
const util = require("./../utility.js");
const { sd } = require("./../staticdata.js");

//protected vars import
const varfile = require("dotenv");
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("myrewards")
    .setDescription("Get my rewards to see what I can spend!"),
  async execute(interaction) {
    try {
      if (Object.keys(sd.users).includes(interaction.user.id)) {
        const lifetimeSheet = await util.getSheet(env.BOOK_RUN_TOTALS,"lifetime");
        const lifetimeRows = await lifetimeSheet.getRows();
        for (let i = 0; i < lifetimeRows.length; i++) {
          const row = lifetimeRows[i];
          if (row.user_id === interaction.user.id) {
            let myMilestones = JSON.parse(row.milestones);
            let rewardsMsg = "";

            for (const reward of myMilestones) {
              if (reward.earned && !reward.spent) {
                rewardsMsg += `:white_check_mark: **${reward.miles}mi**: ${reward.text}\n`;
              } else if (reward.earned && reward.spent) {
                rewardsMsg += `:x: **${reward.miles}mi**: ~~${reward.text}~~\n`;
              }
            }

            // return rewards or message with no rewards earned
            if (rewardsMsg !== "") {
              return interaction.reply(rewardsMsg);
            } else {
              return interaction.reply(
                "You have not received any rewards yet. Keep on running and Heife will reward you with free stuff! :man_running: :woman_running: :person_running:"
              );
            }
          }
        }
      } else {
        return interaction.reply(
          "You are not currently a registered user in the system. Please use **/addme** (use the firstname lastname format you have submitted miles with when using **/newrun** or submitting via the google form **ex: Abraham Lincoln**). This will connect your past runs with your name in the system AND allow you to see your rewards. Additionally, you will no longer need to use the first name or last name parameters when submitting a new run using **/newrun**!"
        );
      }
    } catch (error) {
      console.log(error);
      return interaction.reply("Something went wrong using this command!");
    }
  },
};

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// if(interaction.user.id != '332685115606171649'){
//     return interaction.reply('Gill is fixing a bug! Try again some other time.');
// }
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
