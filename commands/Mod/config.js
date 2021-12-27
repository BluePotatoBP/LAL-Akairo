const { Command, Flag } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Config extends Command {
    constructor() {
        super('config', {
            aliases: ['config'],
            userPermissions: ['MANAGE_GUILD'],
            category: 'Mod',
            ownerOnly: false,
            cooldown: 10000,
            ratelimit: 2,
            description: {
                content: '',
                usage: '[sub-command]',
                syntax: '[] - optional'
            },
            * args() {
                let action = yield {
                    type: [
                        ['logs', 'setlogs'],
                        ['staffrole'],
                        ['prefix', 'setprefix'],
                        ['antiadvert', 'antiad'],
                        ['star', 'starboard', 'sb'],
                        ['lang', 'language'],
                        ['deletecommand', 'delcmd', 'delcmds', 'deletecommands']
                    ],
                    default: 'list',
                    prompt: {
                        start: (message) => lang(message, "command.config.desc.content"),
                        retry: (message) => lang(message, "command.config.desc.content"),
                        optional: true
                    }
                };
                // If args is this, pass command
                if (action == 'logs') return Flag.continue('logs');
                if (action == 'staffrole') return Flag.continue('staffrole');
                if (action == 'prefix') return Flag.continue('setprefix');
                if (action == 'lang') return Flag.continue('language');
                if (action == 'antiadvert') return Flag.continue('antiadvert');
                if (action == 'star') return Flag.continue('star');
                if (action == 'deletecommand') return Flag.continue('deletecmdafter');
                // Default msg
                if (action == 'list') return { action };
            }
        });
    }

    async exec(message, { action }) {
        await delMsg(message, 60000);

        let [logsData] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [message.guild.id]);
        let [staffroleData] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [message.guild.id]);
        let [prefixData] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);
        let [advertData] = await DB.query(`SELECT * FROM antiAdvert WHERE guild = ?`, [message.guild.id]);
        let [languageData] = await DB.query(`SELECT * FROM languages WHERE guild = ?`, [message.guild.id]);
        let [deleteCommandData] = await DB.query(`SELECT * FROM deleteCommandAfter WHERE guild = ?`, [message.guild.id]);
        // Staffrole info
        let staffRole;
        staffroleData.length === 0 ? staffRole = `[-](${message.url} '${lang(message, "command.config.tooltip.noStaffrole")}')` : staffRole = await message.guild.roles.cache.get(staffroleData[0].role);
        // Custom prefix info
        let prefixx;
        prefixData.length === 0 ? prefixx = '.' : prefixx = `**[${prefixData[0].prefix}](${message.url} '${lang(message, "command.config.tooltip.customPrefix")} ${prefixData[0].prefix}')**`;
        // Logs channel info
        let logsChannel;
        logsData.length === 0 ? logsChannel = `[-](${message.url} '${lang(message, "command.config.tooltip.noLogs")}')` : logsChannel = await message.guild.channels.cache.get(logsData[0].channel);
        // AntiAdvert info
        let advertEnabled;
        advertData.length === 0 ? advertEnabled = `**[FALSE](${message.url} '${lang(message, "command.config.tooltip.antiad.disabled")}')**` : advertData[0].enabled === 'true' ? advertEnabled = `**[TRUE](${message.url} '${lang(message, "command.config.tooltip.antiad.enabled")}')**` : advertEnabled = `**[FALSE](${message.url} '${lang(message, "command.config.tooltip.antiad.disabled")}')**`;
        let advertExcludeStaff;
        advertData.length === 0 ? advertExcludeStaff = `<:xCircle:801085848829034566>` : advertData[0].excludeStaff === 'true' ? advertExcludeStaff = `<:checkCircle:801085028938285088>` : advertExcludeStaff = `<:xCircle:801085848829034566>`;
        let advertExcludeBots;
        advertData.length === 0 ? advertExcludeBots = `<:xCircle:801085848829034566>` : advertData[0].excludeBots === 'true' ? advertExcludeBots = `<:checkCircle:801085028938285088>` : advertExcludeBots = `<:xCircle:801085848829034566>`;
        let advertWarn;
        advertData.length === 0 ? advertWarn = `<:xCircle:801085848829034566>` : advertData[0].warn === 'true' ? advertWarn = `<:checkCircle:801085028938285088>` : advertWarn = `<:xCircle:801085848829034566>`;
        let language;
        languageData.length === 0 ? language = '**[english](${message.url})**' : language = `**[${languageData[0].language}](${message.url})**`;
        // Delete command info
        let delCommand;
        deleteCommandData.length === 0 ? delCommand = `**[${lang(message, "command.deletecmdafter.yes.content")}](${message.url})**` : deleteCommandData[0].deleteCommand === 'yes' ? delCommand = `**[${lang(message, "command.deletecmdafter.yes.content")}](${message.url})**` : delCommand = `**[${lang(message, "command.deletecmdafter.no.content")}](${message.url})**`;
        if (action === 'list') {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `${lang(message, "command.config.embed.desc1")}.\n
								 ┌─────────────────
                                 **├ <:logs:801080508310093834> Logs Channel:**
                                 **├** *⤷* ${logsChannel}
                                 **├ <:staffrole:801054561816805437> Staff Role:**
                                 **├** *⤷* ${staffRole}
                                 **├ <:prefix:801057237547221013> Guild Prefix:**
                                 **├** *⤷* ${prefixx}
                                 **├ <:antiad:801073624584159232> Anti Advert:**
                                 **├** *⤷* Enabled: ${advertEnabled}
                                 **├** *⤷* Exclude Staff: ${advertExcludeStaff}
                                 **├** *⤷* Exclude Bots: ${advertExcludeBots}
                                 **├** *⤷* Warn: ${advertWarn}
                                 **├ <:language:895659493491372042> Language:**
                                 **├** *⤷* ${language}
                                 **├ <:disable:823340316769779733> Delete Commands:**
                                 **├** *⤷* ${delCommand}
								 └─────────────────
								 \n${lang(message, "command.config.embed.desc2")}\n${prefixx}config \`<logs/staffrole/prefix/antiadvert/language/deletecommand>\``
                )
                .setColor(crimson);

            await message.channel.send({ embeds: [embed] });
        }
    }
}
module.exports = Config;