const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Config extends Command {
    constructor() {
        super('config', {
            aliases: ['config'],
            category: 'Mod',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'later',
                usage: 'subcommands',
                syntax: 'later'
            },
            * args(message) {
                let action = yield {
                    type: [
                        ['logs', 'setlogs'],
                        ['staffrole'],
                        ['prefix', 'setprefix']
                    ],
                    default: 'list',
                    prompt: {
                        start: 'start',
                        retry: 'retry',
                        optional: true
                    }
                };

                // Start new giveaway
                if (action == 'logs') return Flag.continue('logs');

                // Edit ongoing giveaway
                if (action == 'staffrole') return Flag.continue('staffrole');

                // Edit ongoing giveaway
                if (action == 'prefix') return Flag.continue('setprefix');

                // Default msg
                if (action == 'list') return { action };
            }
        });
    }

    async exec(message, { action }) {
        message.delete({ timeout: 60000 }).catch((e) => {});
        let [logsData] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [message.guild.id]);
        let [staffroleData] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [message.guild.id]);
        let [prefixData] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);

        let staffRole;
        if (!staffroleData.length === 0) {
            staffRole = await message.guild.roles.cache.get(staffroleData[0].role);
        } else {
            staffRole = '-';
        }

        let prefixx;
        if (!prefixData.length === 0) {
            prefixx = '.';
        } else {
            prefixx = prefixData[0].prefix;
        }

        if (action === 'list') {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription(
                    `This is all the possible settings you can edit\nto change the behaviour of *${client.user
						.username}*\n
								 ┌─────────────────┄┄┄┄
								 **├ Logs Channel:** ${logsData[0].channel ? `<#${logsData[0].channel}>` : '`-`'}
								 **├ Staff Role: ᲼ ᲼** ${staffRole}
								 **├ Guild Prefix: ᲼** ${prefixx}
								 └─────────────────┄┄┄┄
								 \n**INFO:** To change any of these settings use\n\`${prefixData[0].prefix
										? process.env.PREFIX
										: '.'}config <logs/staffrole/prefix>\``
                )
                .setColor(crimson);

            await message.channel.send(embed);
        }
    }
}
module.exports = Config;