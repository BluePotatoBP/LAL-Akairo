const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { promptMessage } = require("../../assets/tools/util");
const { pastelGreen, darkRed } = require('../../assets/colors.json')

class Ban extends Command {
    constructor() {
        super('ban',
            {
                aliases: ['ban'],
                category: 'Mod',
                clientPermissions: ['BAN_MEMBERS'],
                userPermissions: ['BAN_MEMBERS'],
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
                            start: 'Please give me a user to ban \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a user to ban \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
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
            r = 'No Reason'
        }

        const sbembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setDescription("You cannot ban youself `LACK: BRAIN`")
            .setColor(darkRed)
            .setFooter(`If this was a mistake you can edit the message.`)
            .setTimestamp()

        // Check if the user being banned isnt the moderator themselves
        if (m.id === message.author.id) {
            return message.channel.send(sbembed)
        }

        const ambed = new Discord.MessageEmbed()
            .setTitle("That user cannot be banned `(HAS PERMISSIONS: BAN)`")
            .setColor(darkRed)
            .setFooter(`If this was a mistake you can edit the message.`)
            .setTimestamp()

        // Check if the user being banned has ban perms
        if (m.hasPermission("BAN_MEMBERS")) return message.channel.send(ambed);
        const banEmbed = new Discord.MessageEmbed() // When i figure out how to use a database, nice embed
          .setAuthor("Action: Ban", "https://i.imgur.com/CQjspzn.png")
          .setThumbnail(u.user.avatarURL({ dynamic: true }))
          .setColor(salmon)
          .setDescription(`**Offender:** ${u.tag} *(${u.id})*\n **Moderator:** ${message.author.tag} *(${message.author.id})* \n**Channel:** ${message.channel.name} *(${message.channel.id})* \n**Reason:** ${r}`)
          .setTimestamp()

        const promptEmbed = new Discord.MessageEmbed()
            .setColor(pastelGreen)
            .setTitle(`This verification becomes invalid after 30s.`)
            .setDescription(`Are you sure you want to ban \`${m.displayName}\` for **${r}**?`)

        // Ban prompt initiation
        let editEmbed = await message.channel.send(promptEmbed)

        const emoji = await promptMessage(editEmbed, message.author, 30, ["✅", "❌"]);
        // If the moderator reacted with a check mark ban the user
        if (emoji === "✅") {

            u.ban(r).catch(err => {
                if (err) return message.channel.send(`Well this is awkward... *${err}*`)
            });

            message.channel.send(`**${message.author.tag}** banned **${m.user.tag}**. \nReason: ${r}`);
            /*logchannel.send(banEmbed);*/
            // If the moderator reacted with an x cancel the action
        } else if (emoji === "❌") {
            const banCanceled = new Discord.MessageEmbed()
                .setDescription(`\`${m.displayName}\` has not been banned.`)
                .setColor(darkRed)
                .setFooter(`Reason: Action canceled by ${message.author.username}`)
                .setTimestamp()
            editEmbed.edit(banCanceled)
        }
    }
}
module.exports = Ban;