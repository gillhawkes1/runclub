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
            let rewardsMsg = `Lifetime miles: ${row.lifetime}\n`;

            for (const reward of myMilestones) {
              if (reward.earned && !reward.spent) {
                rewardsMsg += `:o: **${reward.miles}mi**: ${reward.text}\n`;
              } else if (reward.earned && reward.spent) {
                rewardsMsg += `:white_check_mark: **${reward.miles}mi**: ~~${reward.text}~~\n`;
              }
            }

            // add next reward, return rewards or message with no rewards earned
            if (rewardsMsg !== `Lifetime miles: ${row.lifetime}\n`) {
              let milestones = myMilestones.map((reward) => { return reward.miles });
              // new obj to message if they have hit all of the rewards in the default obj
              const newRewardsObj = {
                miles: milestones[milestones.length - 1] + 100,
                text: "$20 ACBC gift card",
              }

              milestones.push(parseFloat(row.lifetime));
              milestones.sort(function(a, b) {return a - b});
              const nextRewardIndex = milestones.indexOf(parseFloat(row.lifetime)) + 1;
              const nextRewardObj = myMilestones.find((milestone) => { return milestone.miles === milestones[nextRewardIndex]}) || newRewardsObj;
              // TODO: Fix this to send the next correct tier of rewards if they are at the end of the default array (1000miles)
              rewardsMsg += `:lock: Next Reward - **${nextRewardObj.miles}mi**: ${nextRewardObj.text}\n`;

              return interaction.reply(rewardsMsg);
            } else {
              return interaction.reply(
                "You have not received any rewards yet, check out what you can earn by using the **/rewards** command. Keep on running and Heife will reward you with free stuff! :man_running: :woman_running: :person_running:"
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
