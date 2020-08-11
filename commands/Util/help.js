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
                    const dir = category.map(cmd => cmd).join(', ')
                    embed.setDescription(`The prefix for this guild is: \`${prefix}\` \nThese are the currently available commands for \`${this.client.user.username}\`:`);

                    try {
                        embed.addField(`> ${category} (${category.size}):`, dir)
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            embed.setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉 | Total Commands: ${total.reduce((a, b) => a + b, 0)}`, this.client.user.avatarURL({ dynamic: true }));
            embed.addField(`More help:`, `\nClick [here](https://discord.gg/v8zkSc9) to join the support server, \nor if you'd like to you can invite me [here](https://discordapp.com/oauth2/authorize?this.client_id=${this.client.user.id}&scope=bot&permissions=8).`)
            await message.channel.send(embed)

        } else {
            if (!command) return message.channel.send(embed.setTitle("Invalid command.").setDescription(`Do \`${prefix}help\` for the list of commands.`))

            embed.setDescription(stripIndents`The bot's prefix is: \`${prefix}\`\n
            **Command: **\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\`
            **Description:** ${command.description.content}
            **Usage:** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : "No usage"}
            **Aliases:** ${command.aliases ? command.aliases.join(", ") : "none"}`)
            embed.setFooter(`Syntax: ${command.description.syntax ? `${command.description.syntax}` : "No syntax"}`)

            return message.channel.send(embed)
        }
    }
}
module.exports = Help;