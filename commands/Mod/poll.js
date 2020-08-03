const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson, darkRed } = require('../../assets/colors.json')

class Poll extends Command {
    constructor() {
        super('poll',
            {
                aliases: ['poll', 'vote', 'createpoll', 'createvote'],
                category: 'Mod',
                clientPermissions: ['MANAGE_CHANNELS'],
                userPermissions: ['MANAGE_CHANNELS'],
                ownerOnly: false,
                description: {
                    content: 'Create a poll for the community to vote for something',
                    usage: '[#channel] <text>',
                    syntax: '<> - necessary, [] - optional'
                },
                args: [
                    {
                        id: 'c',
                        match: 'phrase',
                        type: 'channel',
                    },
                    {
                        id: 't',
                        match: 'rest',
                        type: 'string',
                        prompt: {
                            start: 'Please give me some text. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me some text. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    }
                ]
            });
    }

    async exec(message, { c, t }) {
        message.delete({ timeout: 30000 }).catch(e => { });

        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            let pembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription("You dont have permissions to do that `LACK PERMISSIONS: MANAGE_CHANNELS`")
                .setColor(darkRed)
                .setFooter(`If this was a mistake you can edit the message.`)
                .setTimestamp()
            message.channel.send(pembed)
        } else {
            const pembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription("You dont have permissions to do that `LACK PERMISSIONS: MANAGE_MESSAGES`")
                .setColor(darkRed)
                .setFooter(`If this was a mistake you can edit the message.`)
                .setTimestamp()

            // Check if user has permissions to make a poll
            if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(pembed);

            let sicon = message.guild.iconURL({ dynamic: true });

            const embed = new Discord.MessageEmbed()
                .setDescription(t)
                .setColor(crimson)
                .setThumbnail(sicon)
                .setFooter(`🎉 Poll from ${message.author.username}! 🎉`, sicon)
                .setTimestamp()
            if (c) {
                // Sends embed and reacts
                c.send(embed).then(async message => {
                    await message.react("🔺")
                    await message.react("🔻")
                });
            } else {
                // Sends embed and reacts
                message.channel.send(embed).then(async message => {
                    await message.react("🔺")
                    await message.react("🔻")
                });
            }
        }
    }
}
module.exports = Poll;