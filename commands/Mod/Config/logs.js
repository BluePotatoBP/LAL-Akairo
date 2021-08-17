const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const mysql = require('mysql2/promise');
const { crimson, pastelGreen, darkRed } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class Logs extends Command {
    constructor() {
        super('logs', {
            aliases: ['logs'],
            userPermissions: ['MANAGE_GUILD'],
            category: '',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'later',
                usage: '[channel]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'ch',
                type: 'channel',
                prompt: {
                    start: (message) => lang(message, "command.logs.prompt.start"),
                    retry: (message) => lang(message, "command.logs.prompt.retry"),
                    optional: true
                }
            }]
        });
    }

    async exec(message, { ch }) {
        await delMsg(message, 30000);
        
        let [getData] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [message.guild.id]);
        let [getData2] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [message.guild.id]);

        if (ch) {
            if (getData.length === 0) {
                DB.query(`INSERT INTO logs (guild, channel) VALUES(?,?)`, [message.guild.id, ch.id]);
                const updatedLogs = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Logs Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, "command.logs.updatedLogsEmbed.desc")} <#${ch.id}> \`[${ch.id}]\`.`)
                    .setColor(pastelGreen)
                    .setFooter(`${lang(message, "command.logs.updatedLogsEmbed.footer")} ${process.env.PREFIX}config logs <#channel>`)
                    .setTimestamp();

                message.util.send({ embeds: [updatedLogs] });
            } else {
                if (ch.id === getData[0].channel) {
                    const updatedLogsExists = new MessageEmbed()
                        .setAuthor(`${message.author.username} • Logs Config`, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`*${lang(message, "command.logs.updatedLogsExistsEmbed.desc1")}*\n\n${lang(message, "command.logs.updatedLogsExistsEmbed.desc2")} <#${ch.id}>.`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, "command.logs.updatedLogsExistsEmbed.footer")} ${process.env.PREFIX}config logs <#channel>`)
                        .setTimestamp();

                    message.util.send({ embeds: [updatedLogsExists] });
                } else {
                    DB.query(`UPDATE logs SET channel = ? WHERE guild = ?`, [ch.id, message.guild.id]);
                    const updatedLogs = new MessageEmbed()
                        .setAuthor(`${message.author.username} • Logs Config`, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${lang(message, "command.logs.updatedLogsEmbed2.desc")} <#${ch.id}> \`[${ch.id}]\`.`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, "command.logs.updatedLogsEmbed2.footer")} ${process.env.PREFIX}config logs <#channel>`)
                        .setTimestamp();
                    message.util.send({ embeds: [updatedLogs] });
                }
            }
        } else {
            if (getData.length === 0) {
                const noLogsData = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Logs Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, "command.logs.noLogsDataEmbed.desc")} \`${process.env.PREFIX}config logs <#channel>\``)
                    .setColor(darkRed);

                message.channel.send({ embeds: [noLogsData] });
            } else {
                const defaultEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Logs Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .addField(lang(message, "command.logs.defaultEmbed.field1"), `<#${getData[0].channel}>`, true)
                    .setColor(crimson)
                    .setTimestamp()

                if (getData.length !== 0) {
                    defaultEmbed.addField('Info:', `${lang(message, "command.logs.defaultEmbed.field2")}\n\`${process.env.PREFIX}config logs <#channel>\``, true)
                }
                if (getData2.length === 0) {
                    defaultEmbed.addField(lang(message, "command.logs.defaultEmbed.field3"), `\n${lang(message, "command.logs.defaultEmbed.field4")} \n\`${process.env.PREFIX}config staffrole\``, true);
                }
                message.util.send({ embeds: [defaultEmbed] });
            }
        }
    }
}
module.exports = Logs;