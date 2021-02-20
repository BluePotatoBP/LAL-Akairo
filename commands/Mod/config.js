const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Config extends Command {
    constructor() {
        super('config', {
            aliases: ['config'],
            userPermissions: ['MANAGE_GUILD'],
            category: 'Mod',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: '',
                usage: '[sub-command]',
                syntax: '[] - optional'
            },
            * args(message) {
                let action = yield {
                    type: [
                        ['logs', 'setlogs'],
                        ['staffrole'],
                        ['prefix', 'setprefix'],
                        ['antiadvert', 'antiad'],
                        ['lang', 'language']
                    ],
                    default: 'list',
                    prompt: {
                        start: (message) => lang(message, "command.config.desc.content"),
                        retry: (message) => lang(message, "command.config.desc.content"),
                        optional: true
                    }
                };

                if (action == 'logs') return Flag.continue('logs');

                if (action == 'staffrole') return Flag.continue('staffrole');

                if (action == 'prefix') return Flag.continue('setprefix');

                if (action == 'lang') return Flag.continue('language');

                if (action == 'antiadvert') return Flag.continue('antiadvert');

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
        let [advertData] = await DB.query(`SELECT * FROM antiAdvert WHERE guild = ?`, [message.guild.id]);

        let staffRole;
        if (staffroleData.length === 0) {
            staffRole = `[-](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.noStaffrole")}')`;
        } else {
            staffRole = await message.guild.roles.cache.get(staffroleData[0].role);
        }

        let prefixx;
        if (prefixData.length === 0) {
            prefixx = '.';
        } else {
            prefixx = `**[${prefixData[0].prefix}](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.customPrefix")} ${prefixData[0].prefix}')**`;
        }

        let logsChannel;
        if (logsData.length === 0) {
            logsChannel = `[-](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.noLogs")}')`;
        } else {
            logsChannel = await message.guild.channels.cache.get(logsData[0].channel);;
        }

        let advertEnabled;
        if (advertData.length === 0) {
            advertEnabled = `[FALSE](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.antiad.disabled")}')`;
        } else {
            if (advertData[0].enabled === 'true') {
                advertEnabled = `[TRUE](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.antiad.enabled")}')`;
            } else {
                advertEnabled = `[FALSE](${message.author.lastMessage.url} '${lang(message, "command.config.tooltip.antiad.disabled")}')`;
            }
        }

        let advertExcludeStaff;
        if (advertData.length === 0) {
            advertExcludeStaff = `<:xCircle:801085848829034566>`;
        } else {
            if (advertData[0].excludeStaff === 'true') {
                advertExcludeStaff = `<:checkCircle:801085028938285088>`;
            } else {
                advertExcludeStaff = `<:xCircle:801085848829034566>`;
            }
        }

        let advertExcludeBots;
        if (advertData.length === 0) {
            advertExcludeBots = `<:xCircle:801085848829034566>`;
        } else {
            if (advertData[0].excludeBots === 'true') {
                advertExcludeBots = `<:checkCircle:801085028938285088>`;
            } else {
                advertExcludeBots = `<:xCircle:801085848829034566>`;
            }
        }

        let advertWarn;
        if (advertData.length === 0) {
            advertWarn = `<:xCircle:801085848829034566>`;
        } else {
            if (advertData[0].warn === 'true') {
                advertWarn = `<:checkCircle:801085028938285088>`;
            } else {
                advertWarn = `<:xCircle:801085848829034566>`;
            }
        }

        if (action === 'list') {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `${lang(message, "command.config.embed.desc1")} *${client.user.username}*.\n
								 ┌─────────────────┄┄┄┄
                                 **├ <:logs:801080508310093834> Logs Channel:**
                                 **├** *⤷* ${logsChannel}
                                 **├ <:staffrole:801054561816805437> Staff Role:**
                                 **├** *⤷* ${staffRole}
                                 **├ <:prefix:801057237547221013> Guild Prefix:**
                                 **├** *⤷* ${prefixx}
                                 **├ <:antiad:801073624584159232> Anti Advert:**
                                 **├** *⤷* Active: ${advertEnabled}
                                 **├** *⤷* Exclude Staff: ${advertExcludeStaff}
                                 **├** *⤷* Exclude Bots: ${advertExcludeBots}
                                 **├** *⤷* Warn: ${advertWarn}
								 └─────────────────┄┄┄┄
								 \n${lang(message, "command.config.embed.desc2")}\n${prefixx}config \`<logs/staffrole/prefix/language>\``
                )
                .setColor(crimson);

            await message.channel.send(embed);
        }
    }
}
module.exports = Config;