const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { promptMessage } = require("../../assets/tools/util");
const { pastelGreen, darkRed, salmon } = require('../../assets/colors.json')

class Ban extends Command {
    constructor() {
        super('ban',
            {
                aliases: ['ban'],
                category: 'Mod',
                clientPermissions: ['BAN_MEMBERS'],
                userPermissions: ['BAN_MEMBERS'],
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Ban a user with a reason',
                    usage: '<user> [reason]',
                    syntax: '<> - necessary, [] - optional'
                },
                args: [
                    {
                        id: 'm',
                        type: 'member',
                        prompt: {
                            start: message => lang(message, "command.ban.prompt.start"),
                            retry: message => lang(message, "command.ban.prompt.retry"),
                        }
                    },
                    {
                        id: 'r',
                        match: 'rest',
                        type: 'string'
                    },
                ]
            });
    }

    async exec(message, { m, r }) {
        message.delete({ timeout: 30000 });

        // If theres no reason change 'r' args to "No Reason"
        if (!r) {
            r = lang(message, "command.ban.reason.noReason")
        }

        const sbembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setDescription(lang(message, "command.ban.sbembed.desc"))
            .setColor(darkRed)
            .setFooter(lang(message, "command.ban.mistake"))
            .setTimestamp()

        // Check if the user being banned isnt the moderator themselves
        if (m.id === message.author.id) {
            return message.channel.send(sbembed)
        }

        const ambed = new Discord.MessageEmbed()
            .setTitle(lang(message, "command.ban.ambed.title"))
            .setColor(darkRed)
            .setFooter(lang(message, "command.ban.mistake"))
            .setTimestamp()

        // Check if the user being banned has ban perms
        if (m.hasPermission("BAN_MEMBERS")) return message.channel.send(ambed);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor(pastelGreen)
            .setTitle(lang(message, "command.ban.promptEmbed.title"))
            .setDescription(`${lang(message, "command.ban.promptEmbed.desc.one")} \`${m.displayName}\` ${lang(message, "command.ban.promptEmbed.desc.two")} **${r}**?`)

        // Ban prompt initiation
        let editEmbed = await message.channel.send(promptEmbed)

        const emoji = await promptMessage(editEmbed, message.author, 30, ["✅", "❌"]);
        // If the moderator reacted with a check mark ban the user
        if (emoji === "✅") {

            m.ban(r).catch(err => {
                if (err) return message.channel.send(`Well this is awkward... *${err}*`)
            });

            message.channel.send(`**${message.author.tag}** ${lang(message, "command.ban.messageAfterBan.one")} **${m.user.tag}**. \n${lang(message, "command.ban.messageAfterBan.two")} ${r}`);

            /*const banEmbed = new Discord.MessageEmbed() // When i figure out how to use a database, nice embed
                .setAuthor("Action: Ban", "https://i.imgur.com/CQjspzn.png")
                .setThumbnail(m.user.avatarURL({ dynamic: true }))
                .setColor(salmon)
                .setDescription(`**Offender:** ${m.tag} *(${m.id})*\n **Moderator:** ${message.author.tag} *(${message.author.id})* \n**Channel:** ${message.channel.name} *(${message.channel.id})* \n**Reason:** ${r}`)
                .setTimestamp()

            logchannel.send(banEmbed);*/

            // If the moderator reacted with an x cancel the action
        } else if (emoji === "❌") {
            const banCanceled = new Discord.MessageEmbed()
                .setDescription(`\`${m.displayName}\` ${lang(message, "command.ban.banCanceled.desc")}`)
                .setColor(darkRed)
                .setFooter(`${lang(message, "command.ban.banCanceled.footer")} ${message.author.username}`)
                .setTimestamp()
            editEmbed.edit(banCanceled)
        }
    }
}
module.exports = Ban;