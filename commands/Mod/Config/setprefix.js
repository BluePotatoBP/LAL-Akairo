const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { pastelGreen, darkRed } = require('../../../assets/colors.json');
const mysql2 = require('mysql2/promise');

class SetPrefix extends Command {
    constructor() {
        super('setprefix', {
            aliases: ['setprefix', 'sprefix', 'spr', 'prefix'],
            category: 'Mod',
            userPermissions: ['MANAGE_MESSAGES'],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: "Set the bot's prefix for this server",
                usage: '[prefix]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'p',
                match: 'text',
                type: 'string'
            }]
        });
    }

    async exec(message, { p }) {
        message.delete().catch((e) => { });
        const prefixEmbed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        let [data] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);

        if (!p) {
            if (data.length === 0) {
                prefixEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                prefixEmbed.setDescription(
                    `${lang(message, 'command.setprefix.prefixEmbed.desc.one')} \`${process.env.PREFIX}\` \n${lang(
                        message,
                        'command.setprefix.prefixEmbed.desc.two'
                    )} \`${process.env.PREFIX}setprefix [prefix]\``
                );
                prefixEmbed.setFooter('Syntax: [] - optional')
                prefixEmbed.setColor(pastelGreen);

                message.channel.send(prefixEmbed);
            } else {
                prefixEmbed.setDescription(
                    `${lang(message, 'command.setprefix.prefixEmbed.desc.one')} \`${data[0].prefix}\``
                );
                prefixEmbed.setColor(pastelGreen);
                message.channel.send(prefixEmbed);
            }
        } else if (p.length > 5) {
            prefixEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
            prefixEmbed.setDescription(lang(message, 'command.setprefix.prefixEmbed.longPrefix'));
            prefixEmbed.setColor(darkRed);

            message.channel.send(prefixEmbed);
        } else {
            if (data.length !== 0) {
                if (data[0].prefix === p) {
                    prefixEmbed.setDescription(`The prefix was already set to: \`${p}\``);
                    prefixEmbed.setColor(darkRed);

                    message.channel.send(prefixEmbed);
                } else {
                    await DB.query('UPDATE prefixes SET prefix = ? WHERE guild = ?', [p, message.guild.id]);

                    prefixEmbed.setDescription(
                        `${lang(message, 'command.setprefix.prefixEmbed.updatePrefix')} \`${p}\``
                    );
                    prefixEmbed.setColor(pastelGreen);

                    message.channel.send(prefixEmbed);
                }
            } else {
                await DB.query(`INSERT INTO prefixes (guild, prefix) VALUES(?, ?)`, [message.guild.id, p]);

                prefixEmbed.setDescription(`${lang(message, 'command.setprefix.prefixEmbed.newPrefix')} \`${p}\``);
                prefixEmbed.setColor(pastelGreen);

                message.channel.send(prefixEmbed);
            }
        }
    }
}
module.exports = SetPrefix;