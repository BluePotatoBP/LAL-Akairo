const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const { pastelGreen, darkRed } = require('../../../assets/colors.json');
const mysql2 = require('mysql2/promise');
const { delMsg } = require('../../../assets/tools/util');

class SetPrefix extends Command {
    constructor() {
        super('setprefix', {
            aliases: ['setprefix', 'sprefix', 'spr', 'prefix'],
            category: 'Mod',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
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
        await delMsg(message, 30000);

        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            const prefixEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            const customPrefix = await customPrefixes.find(c => c.guild === message.guild.id);

            if (!p) {
                if (!customPrefix) {
                    prefixEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                    prefixEmbed.setDescription(`${lang(message, 'command.setprefix.prefixEmbed.desc.one')} \`${process.env.PREFIX}\` \n${lang(message, 'command.setprefix.prefixEmbed.desc.two')} \`${process.env.PREFIX}setprefix [prefix]\``);
                    prefixEmbed.setFooter('Syntax: [] - optional')
                    prefixEmbed.setColor(pastelGreen);

                    await message.channel.send({ embeds: [prefixEmbed] });
                } else {
                    prefixEmbed.setDescription(`${lang(message, 'command.setprefix.prefixEmbed.desc.one')} \`${customPrefix.prefix}\``);
                    prefixEmbed.setColor(pastelGreen);

                    await message.channel.send({ embeds: [prefixEmbed] });
                }
            } else if (p.length > 5) {
                prefixEmbed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                prefixEmbed.setDescription(lang(message, 'command.setprefix.prefixEmbed.longPrefix'));
                prefixEmbed.setColor(darkRed);

                await message.channel.send({ embeds: [prefixEmbed] });
            } else {
                if (customPrefix) {
                    if (customPrefix.prefix === p) {
                        prefixEmbed.setDescription(`The prefix was already set to: \`${p}\``);
                        prefixEmbed.setColor(darkRed);

                        await message.channel.send({ embeds: [prefixEmbed] });
                    } else {
                        await DB.query('UPDATE prefixes SET prefix = ? WHERE guild = ?', [p, message.guild.id]);
                        let deletePrefix = await customPrefixes.findIndex(c => c.prefix === customPrefix.prefix)
                        await customPrefixes.splice(deletePrefix, deletePrefix + 1)
                        await customPrefixes.push({
                            guild: message.guild.id,
                            prefix: p
                        })

                        prefixEmbed.setDescription(`${lang(message, 'command.setprefix.prefixEmbed.updatePrefix')} \`${p}\``);
                        prefixEmbed.setColor(pastelGreen);

                        message.channel.send({ embeds: [prefixEmbed] });
                    }
                } else {
                    await DB.query(`INSERT INTO prefixes (guild, prefix) VALUES(?, ?)`, [message.guild.id, p]);
                    await customPrefixes.push({
                        guild: message.guild.id,
                        prefix: p
                    })

                    prefixEmbed.setDescription(`${lang(message, 'command.setprefix.prefixEmbed.newPrefix')} \`${p}\``);
                    prefixEmbed.setColor(pastelGreen);

                    await message.channel.send({ embeds: [prefixEmbed] });
                }
            }
        } else {
            let normiePrefix = customPrefixes.find(c => c.guild === message.guild.id);
            normiePrefix ? normiePrefix = normiePrefix.prefix : process.env.PREFIX;
            const normieEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, 'command.setprefix.prefixEmbed.desc.one')} \`${normiePrefix}\``)
                .setColor(pastelGreen);

            await message.channel.send({ embeds: [normieEmbed] });
        }
    }
}
module.exports = SetPrefix;