const util = require('./../utility.js');
const { sd } = require('./../staticdata.js');
const { SlashCommandBuilder, GuildMemberRoleManager, RoleManager, Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//protected vars import
const varfile = require('dotenv');
const configfile = varfile.config();
const env = configfile.parsed;


//@admin ping that doesn't work but is formatted to recognize the role: <@&996429757828833350>
// test role: 1062842849449754764


module.exports = {
	data: new SlashCommandBuilder()
		.setName('announcement')
		.setDescription('Make an announcement to everyone.'),
	async execute(interaction) {
        //memberRole.remove([1062842849449754764],'beacause testing');
        //const role = interaction.member;
        //console.log('role',role);
        //let replyAtEveryone = '@everyone test';
        //let guild = await client.guilds.fetch(env.GUILD_ID)
        //let id = guild.roles.everyone.id;

        //let id = interaction.guild.roles.everyone.id;
        // gills id:<@332685115606171649>
        // announcements channel: 996428352443400214
        //client.channels.cache.get('996637178694213672').send('test message');

        // interaction.roles.edit('1062842849449754764', { name: testing })
        //     .then(updated => console.log(`mentionable: ${updated.name}`))
        //     .catch(console.error);


        const memberRole = new GuildMemberRoleManager(interaction.member);
        const guildRoles = await interaction.guild.roles.fetch().then((res) => {
            for(const [role,value] of res){
                console.log(value.name);
                if (value.name === 'test'){
                    //memberRole.add(role,'because testing');
                }
            }
        });



        //console.log('guildRoles',guildRoles);
        

        //996428348890820648


        return interaction.reply('<@&1062842849449754764>');
    }
}