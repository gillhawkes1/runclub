const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');


//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('redeemreward')
		.setDescription('Use this to redeem a reward for a runner'),
	async execute(interaction) {
    let rewards = [];
    let rewardOptionsForMessage = [];
    try {
      if (Object.keys(sd.users).includes(interaction.user.id)) {
        const lifetimeSheet = await util.getSheet(env.BOOK_RUN_TOTALS,"lifetime");
        const lifetimeRows = await lifetimeSheet.getRows();
        for (let i = 0; i < lifetimeRows.length; i++) {
          const row = lifetimeRows[i];
          if (row.user_id === interaction.user.id) {
            if(row.milestones) {
              rewards = JSON.parse(row.milestones)
            } else {
              rewards = [];
            }
            for (const reward of rewards) {
              if (reward.earned && !reward.spent) {
                const option = new StringSelectMenuOptionBuilder()
                  .setLabel(`${reward.text}`)
                  .setDescription(`The reward for ${reward.miles} miles!`)
                  .setValue(`${reward.miles}`);
                rewardOptionsForMessage.push(option);
              }
            }
          }
        }
      } else { 
        await interaction.reply({ content: 'You are not in the system yet, please use **/addme** and follow the command instructions to submit your name before redeeming any rewards!'});
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({ content: 'There was an error retrieving your rewards!' });
    }

    //if has rewards, send them in select options
    if(rewardOptionsForMessage.length) {
      const select = new StringSelectMenuBuilder()
      .setCustomId('redeemrewardsid')
      .setPlaceholder('Choose your reward to redeem!')
      .addOptions(rewardOptionsForMessage);

      const row = new ActionRowBuilder()
        .addComponents(select);

      const response = await interaction.reply({
        components: [row],
        ephemeral: false
      });

      try {
        const collectorFilter = i => i.user.id === interaction.user.id;
        const thisResponse = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        const chosenRewardMileage = parseInt(thisResponse.values[0]);
        let rewardText = "";
        const lifetimeSheet = await util.getSheet(env.BOOK_RUN_TOTALS,"lifetime");
        const lifetimeRows = await lifetimeSheet.getRows();
        for (let i = 0; i < lifetimeRows.length; i++) {
          const row = lifetimeRows[i];
          if (row.user_id === interaction.user.id) {
            const myRewards = JSON.parse(row.milestones);
            //TODO: save new obj properly to google sheet when reward is spent
            for (const reward of myRewards) {
              if (reward.miles === chosenRewardMileage) {
                reward.spent = true;
                rewardText = reward.text;
              }
            }
            row.milestones = JSON.stringify(myRewards);
            await row.save();
          }
        }

        await thisResponse.update({ content: `${interaction.member.nickname} has redeemed a reward: ${thisResponse.values[0]}mi for the ${rewardText}!`, components: [] });
      } catch (e) {
        console.log("e",e);
        await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling.', components: [] });
      }
    } else {
      await interaction.reply({ content: 'You do not have any rewards yet. Keep running so Heife can give you free stuff! Use **/rewards** to see what you can earn!'});
    }
  }
}

