const { Command } = require('discord-akairo');
const Discord = require("discord.js");
const { crimson } = require("../../assets/colors.json")
const mysql2 = require('mysql2/promise');
const { stripIndents } = require("common-tags")

class Help extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'Shows you this message',
                usage: '[command}',
                syntax: '[] - optional'
            },
            args: [
                {
                    id: 'command',
                    type: 'commandAlias',
                },
            ]
        });
    }
    async exec(message, { command }) {
        message.delete().catch(e => { });

        let [data] = await DB.query(`SELECT * FROM prefixes WHERE guildId = ?`, [message.guild.id])
        let prefix;

        if (data.length === 0) {
            prefix = process.env.PREFIX;
        } else {
            prefix = `${data[0].prefix}`;
        }

        const embed = new Discord.MessageEmbed()
            .setColor(crimson)
            .setAuthor(`${this.client.user.username} Help`, this.client.user.avatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL({ dynamic: true }))

        if (!command) {
            var categories = this.handler.categories.values();
            let total = [];
            for (const category of categories) {
                total.push(parseInt(category.size));

                const title = category.id;
                if (title == 'default') {
                    continue;
                }
                else if (title) {
                    const dir = category.map(cmd => `${cmd.categoryID.toLowerCase() == "nsfw" ? `|| ${cmd} ||` : cmd}`).join(', ')
                    embed.setDescription(`${lang(message, "command.help.embed.desc.one")} \`${prefix}\` \n${lang(message, "command.help.embed.desc.two")} \`${this.client.user.username}\`:`);

                    try {
                        embed.addField(`> ${category} (${category.size}):`, dir)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            embed.setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉 | ${lang(message, "command.help.embed.footer.one")} ${total.reduce((a, b) => a + b, 0)}`, this.client.user.avatarURL({ dynamic: true }));
            embed.addField(`${lang(message, "command.help.embed.field.one")}`, `\n${lang(message, "command.help.embed.field.two")} [${lang(message, "command.help.embed.field.three")}](https://discord.gg/v8zkSc9) ${lang(message, "command.help.embed.field.four")} [${lang(message, "command.help.embed.field.three")}](https://discordapp.com/oauth2/authorize?this.client_id=${this.client.user.id}&scope=bot&permissions=8).`)
            await message.channel.send(embed)

        } else {
            if (!command) return message.channel.send(embed.setTitle(lang(message, "command.help.embed.title.one")).setDescription(`${lang(message, "command.help.embed.title.desc.one")} \`${prefix}help\` ${lang(message, "command.help.embed.title.desc.two")}`))
            console.log(`[DEBUG] '${message.author.tag}'[${message.author.id}] used "${prefix}help ${command.id.toLowerCase()}" in '${message.guild.name}'[${message.guild.id}]`)

            embed.setDescription(stripIndents`${lang(message, "command.help.embedtwo.desc.one")} \`${prefix}\`\n 
            **${lang(message, "command.help.embedtwo.desc.two")} **${command.categoryID.toLowerCase() === "nsfw" ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
            **${lang(message, "command.help.embedtwo.desc.three")}** ${lang(message, `command.${command.id}.desc.content`)}
            **${lang(message, "command.help.embedtwo.desc.four")}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, "command.help.embedtwo.desc.five")}
            **${lang(message, "command.help.embedtwo.desc.six")}** ${command.aliases ? command.aliases.join(", ") : lang(message, "command.help.embedtwo.desc.seven")}`)
            embed.setFooter(`${lang(message, "command.help.embedtwo.desc.eight")} ${command.description.syntax ? `${command.description.syntax}` : lang(message, "command.help.embedtwo.desc.nine")}`)

            return message.channel.send(embed)
        }

    }
}
module.exports = Help;