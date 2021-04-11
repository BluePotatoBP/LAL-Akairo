const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../../assets/colors.json')

class AntiAdvert extends Command {
    constructor() {
        super('antiadvert', {
            aliases: ['antiadvert', 'antiad'],
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            category: '',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'later',
                usage: '[enable|disable] [includestaff|excludestaff] [includebots|excludebots] [warn(togglable)] [preset light|moderate|heavy]',
                syntax: '[] - optional'
            },
            args: [{ //#region args
                id: 'enable',
                match: 'flag',
                flag: 'enable',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.enable.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.enable.retry")
                }
            },
            {
                id: 'disable',
                match: 'flag',
                flag: 'disable',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.enable.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.enable.retry")
                }
            },
            {
                id: 'excludestaff',
                match: 'flag',
                flag: 'includestaff',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.includestaff.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.includestaff.retry")
                }
            },
            {
                id: 'includestaff',
                match: 'flag',
                flag: 'excludestaff',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.includestaff.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.includestaff.retry")
                }
            },
            {
                id: 'excludebots',
                match: 'flag',
                flag: 'includebots',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.includebots.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.includebots.retry")
                }
            },
            {
                id: 'includebots',
                match: 'flag',
                flag: 'excludebots',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.includebots.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.includebots.retry")
                }
            },
            {
                id: 'warn',
                match: 'flag',
                flag: 'warn',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.warn.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.warn.retry")
                }
            },
            {
                id: 'presetLight',
                match: 'flag',
                flag: 'preset light',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.preset.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.preset.retry")
                }
            },
            {
                id: 'presetModerate',
                match: 'flag',
                flag: 'preset moderate',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.preset.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.preset.retry")
                }
            },
            {
                id: 'presetHeavy',
                match: 'flag',
                flag: 'preset Heavy',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, "command.antiadvert.args.preset.start"),
                    retry: (message) => lang(message, "command.antiadvert.args.preset.retry")
                }
            },
            ] //#endregion args
        });
    }

    async exec(message, { enable, disable, includestaff, excludestaff, includebots, excludebots, warn, presetLight, presetModerate, presetHeavy }) {
        message.delete({ timeout: 30000 }).catch(e => { });
        let [getData] = await DB.query(`SELECT * FROM antiAdvert WHERE guild = ?`, [message.guild.id]);

        let arrayData = antiAdvertise.find(c => c.guild === message.guild.id)

        const updateEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(lang(message, "command.antiadvert.updateEmbed.desc"))
            .setColor(crimson)
            .setTimestamp()

        if (enable || disable || includestaff || excludestaff || includebots || excludebots || warn || presetLight || presetModerate || presetHeavy) {
            //#region Init
            ////////////////// UPDATE ENABLED STATE
            if (enable) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'true', 'false', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'true',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                } else {
                    if (getData[0].enabled === 'true') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.trueNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET enabled = ? WHERE guild = ?`, ['true', message.guild.id]);
                        arrayData.enabled = 'true'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                    }
                }
            } else if (disable) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                } else {
                    if (getData[0].enabled === 'false') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.falseNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET enabled = ? WHERE guild = ?`, ['false', message.guild.id]);
                        arrayData.enabled = 'false'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.enabled"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                    }
                }
            }

            ////////////////// UPDATE STAFF EXCLUSION
            if (includestaff) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'true', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                } else {
                    if (getData[0].excludeStaff === 'false') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.falseNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET excludeStaff = ? WHERE guild = ?`, ['false', message.guild.id]);
                        arrayData.excludeStaff = 'false'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                    }
                }

            } else if (excludestaff) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'true',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                } else {
                    if (getData[0].excludeStaff === 'true') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.trueNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET excludeStaff = ? WHERE guild = ?`, ['true', message.guild.id]);
                        arrayData.excludeStaff = 'true'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkStaff"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                    }
                }
            }

            ////////////////// UPDATE BOT EXCLUSION
            if (includebots) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'true', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                } else {
                    if (getData[0].excludeBots === 'false') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.falseNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET excludeBots = ? WHERE guild = ?`, ['false', message.guild.id]);
                        arrayData.excludeBots = 'false'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                    }
                }

            } else if (excludebots) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'true',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                } else {
                    if (getData[0].excludeBots === 'true') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.trueNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET excludeBots = ? WHERE guild = ?`, ['true', message.guild.id]);
                        arrayData.excludeBots = 'true'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.checkBots"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                    }
                }
            }

            ////////////////// UPDATE WARN
            if (warn) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'true', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'true',

                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.warnEveryone"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                } else {
                    if (getData[0].warn === 'false') {
                        await DB.query(`UPDATE antiAdvert SET warn = ? WHERE guild = ?`, ['true', message.guild.id]);
                        arrayData.warn = 'true'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.warnEveryone"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.true")}\n\`\`\``)
                    } else if (getData[0].warn === 'true') {
                        await DB.query(`UPDATE antiAdvert SET warn = ? WHERE guild = ?`, ['false', message.guild.id]);
                        arrayData.warn = 'false'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.warnEveryone"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.false")}\n\`\`\``)
                    }
                }
            }
            //#endregion Init
            ////////////////// CHECK PRESETS
            //#region Presets
            if (presetLight) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'light']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'light',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.light")}\n\`\`\``)
                } else {
                    if (getData[0].preset === 'light') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.lightNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET preset = ? WHERE guild = ?`, ['light', message.guild.id]);
                        arrayData.preset = 'light'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.light")}\n\`\`\``)
                    }
                }
            }
            if (presetModerate) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'moderate']);
                    await antiAdvertise.push({
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'moderate',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.moderate")}\n\`\`\``)
                } else {
                    if (getData[0].preset === 'moderate') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.moderateNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET preset = ? WHERE guild = ?`, ['moderate', message.guild.id]);
                        arrayData.preset = 'moderate'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.moderate")}\n\`\`\``)
                    }
                }
            }
            if (presetHeavy) {
                if (getData.length === 0) {
                    await DB.query(`INSERT INTO antiAdvert (guild, enabled, excludeStaff, excludeBots, warn, preset) VALUES(?,?,?,?,?,?)`, [message.guild.id, 'false', 'false', 'false', 'false', 'heavy']);
                    await antiAdvertise.push({
                        guild: message.guild.id,
                        enabled: 'false',
                        excludeStaff: 'false',
                        excludeBots: 'false',
                        preset: 'heavy',
                        guild: message.guild.id,
                        warn: 'false',
                    })

                    updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.heavy")}\n\`\`\``)
                } else {
                    if (getData[0].preset === 'heavy') {
                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.heavyNoChanges")}\n\`\`\``)
                    } else {
                        await DB.query(`UPDATE antiAdvert SET preset = ? WHERE guild = ?`, ['heavy', message.guild.id]);
                        arrayData.preset = 'heavy'

                        updateEmbed.addField(lang(message, "command.antiadvert.updateEmbed.changes.preset"), `\`\`\`js\n${lang(message, "command.antiadvert.updateEmbed.changes.preset.heavy")}\n\`\`\``)
                    }
                }
            }
            //#endregion Presets
            await message.channel.send(updateEmbed);
        } else {
            //#region Embed
            let advertEnabled;
            if (getData.length === 0) {
                advertEnabled = `[FALSE](${message.author.lastMessage.url} 'Anti-Advertising is not enabled.')`;
            } else {
                if (getData[0].enabled === 'true') {
                    advertEnabled = `[TRUE](${message.author.lastMessage.url} 'Anti-Advertising is enabled.')`;
                } else {
                    advertEnabled = `[FALSE](${message.author.lastMessage.url} 'Anti-Advertising is not enabled.')`;
                }
            }

            let advertExcludeStaff;
            if (getData.length === 0) {
                advertExcludeStaff = `<:xCircle:801085848829034566>`;
            } else {
                if (getData[0].excludeStaff === 'true') {
                    advertExcludeStaff = `<:checkCircle:801085028938285088>`;
                } else {
                    advertExcludeStaff = `<:xCircle:801085848829034566>`;
                }
            }

            let advertExcludeBots;
            if (getData.length === 0) {
                advertExcludeBots = `<:xCircle:801085848829034566>`;
            } else {
                if (getData[0].excludeBots === 'true') {
                    advertExcludeBots = `<:checkCircle:801085028938285088>`;
                } else {
                    advertExcludeBots = `<:xCircle:801085848829034566>`;
                }
            }

            let advertWarn;
            if (getData.length === 0) {
                advertWarn = `<:xCircle:801085848829034566>`;
            } else {
                if (getData[0].warn === 'true') {
                    advertWarn = `<:checkCircle:801085028938285088>`;
                } else {
                    advertWarn = `<:xCircle:801085848829034566>`;
                }
            }

            let advertPreset;
            if (getData.length === 0) {
                advertPreset = `[${lang(message, "command.antiadvert.updateEmbed.changes.preset.moderate")}](https://gist.github.com/BluePotatoBP/9415fb46a72480363926c74027307188 'Click here for info.')`;
            } else if (getData[0].preset === 'light') {
                advertPreset = `[${lang(message, "command.antiadvert.updateEmbed.changes.preset.light")}](https://gist.github.com/BluePotatoBP/9415fb46a72480363926c74027307188 'Click here for info.')`;
            } else if (getData[0].preset === 'moderate') {
                advertPreset = `[${lang(message, "command.antiadvert.updateEmbed.changes.preset.moderate")}](https://gist.github.com/BluePotatoBP/9415fb46a72480363926c74027307188 'Click here for info.')`;
            } else if (getData[0].preset === 'heavy') {
                advertPreset = `[${lang(message, "command.antiadvert.updateEmbed.changes.preset.heavy")}](https://gist.github.com/BluePotatoBP/9415fb46a72480363926c74027307188 'Click here for info.')`;
            }
            //#endregion Embed

            const listEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(crimson)
                .setTimestamp()
                .setDescription(`
                                 ┌────────┄┄┄┄
                                 **├ <:antiad:801073624584159232> Anti Advert:**
                                 **├** *⤷* ${lang(message, "command.antiadvert.updateEmbed.changes.enabled")}: ${advertEnabled}
                                 **├** *⤷* ${lang(message, "command.antiadvert.updateEmbed.changes.preset")}: ${advertPreset}
                                 **├** *⤷* ${lang(message, "command.antiadvert.updateEmbed.changes.excludeStaff")}: ${advertExcludeStaff}
                                 **├** *⤷* ${lang(message, "command.antiadvert.updateEmbed.changes.excludeBots")}: ${advertExcludeBots}
                                 **├** *⤷* ${lang(message, "command.antiadvert.updateEmbed.changes.warnEveryone")}: ${advertWarn}
								 └────────┄┄┄┄
                                `)

            message.channel.send(listEmbed)
        }
    }
}

module.exports = AntiAdvert;