const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { promptMessage } = require("../../assets/tools/util");
const { pastelGreen, darkRed } = require('../../assets/colors.json')

class Kick extends Command {
    constructor() {
        super('kick',
            {
                aliases: ['kick'],
                category: 'Mod',
                clientPermissions: ['KICK_MEMBERS'],
                userPermissions: ['KICK_MEMBERS'],
                ownerOnly: false,
                description: {
                    content: 'Kick a user with a reason',
                    usage: '<user> [reason]',
                    syntax: '<> - necessary, [] - optional'
                },
                args: [
                    {
                        id: 'm',
                        type: 'member',
                        prompt: {
                            start: 'Please give me a user to kick \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a user to kick \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
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
            .setDescription("You cannot kick youself `LACK: BRAIN`")
            .setColor(darkRed)
            .setFooter(`If this was a mistake you can edit the message.`)
            .setTimestamp()

        // Check if the user being kicked isnt the moderator themselves
        if (m.id === message.author.id) {
            return message.channel.send(sbembed)
        }

        const ambed = new Discord.MessageEmbed()
            .setTitle("That user cannot be kicked `(HAS PERMISSIONS: KICK)`")
            .setColor(darkRed)
            .setFooter(`If this was a mistake you can edit the message.`)
            .setTimestamp()

        // Check if the user being kicked has kick perms
        if (m.hasPermission("KICK_MEMBERS")) return message.channel.send(ambed);
        /*const kickEmbed = new Discord.MessageEmbed() // When i figure out how to use a database, nice embed
          .setAuthor("Action: Kick", "https://i.imgur.com/CQjspzn.png")
          .setThumbnail(u.user.avatarURL({ dynamic: true }))
          .setColor(salmon)
          .setDescription(`**Offender:** ${u.tag} *(${u.id})*\n **Moderator:** ${message.author.tag} *(${message.author.id})* \n**Channel:** ${message.channel.name} *(${message.channel.id})* \n**Reason:** ${r}`)
          .setTimestamp()*/

        const promptEmbed = new Discord.MessageEmbed()
            .setColor(pastelGreen)
            .setTitle(`This verification becomes invalid after 30s.`)
            .setDescription(`Are you sure you want to kick \`${m.displayName}\` for **${r}**?`)

        // Kick prompt initiation
        let editEmbed = await message.channel.send(promptEmbed)

        const emoji = await promptMessage(editEmbed, message.author, 30, ["✅", "❌"]);
        // If the moderator reacted with a check mark kick the user
        if (emoji === "✅") {

            /*u.kick(r).catch(err => {
                if (err) return message.channel.send(`Well this is awkward... *${err}*`)
            });*/

            message.channel.send(`**${message.author.tag}** kicked **${m.user.tag}**. \nReason: ${r}`);
            /*logchannel.send(kickEmbed);*/
            // If the moderator reacted with an x cancel the action
        } else if (emoji === "❌") {
            const kickCanceled = new Discord.MessageEmbed()
                .setDescription(`\`${m.displayName}\` has not been kicked.`)
                .setColor(darkRed)
                .setFooter(`Reason: Action canceled by ${message.author.username}`)
                .setTimestamp()
            editEmbed.edit(kickCanceled)
        }
    }
}
module.exports = Kick;