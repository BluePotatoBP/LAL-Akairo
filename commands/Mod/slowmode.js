const { Command, Util } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Slowmode extends Command {
    constructor() {
        super('slowmode',
            {
                aliases: ['slowmode', 'smode'],
                category: 'Mod',
                clientPermissions: ['MANAGE_CHANNELS'],
                userPermissions: ['MANAGE_CHANNELS'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '<time>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'nr',
                        match: 'text',
                        type: 'number',
                        unordered: true,
                        prompt: {
                            start: message => lang(message, "command.slowmode.prompt.start"),
                            retry: message => lang(message, "command.slowmode.prompt.retry"),
                            optional: true
                        }
                    },
                    {
                        id: 'reset',
                        match: 'flag',
                        flag: ['reset', 'off']
                    },
                ]
            });
    }

    async exec(message, { nr, reset }) {
        message.delete({ timeout: 30000 }).catch(e => { });
        if (nr >= 21600) {
            const embed2 = new Discord.MessageEmbed()
                .setTitle(lang(message, "command.slowmode.embed.title"))
                .setDescription(lang(message, "command.slowmode.embed.desc"))
                .setColor(crimson)
                .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setTimestamp()
            message.channel.send(embed2);

        } else {
            let rateLimit = message.channel.rateLimitPerUser;
            let slowMessage;
            const embed = new Discord.MessageEmbed()

            if (reset) {
                nr = 0;
            }
            if (!rateLimit || rateLimit === 0) {
                if (nr === rateLimit) {
                    slowMessage = lang(message, "command.slowmode.embed.slowMessage.alreadyExists")
                } else {
                    slowMessage = lang(message, "command.slowmode.embed.slowMessage.new")
                }
            } else if (nr === 0) {
                slowMessage = lang(message, "command.slowmode.embed.slowMessage.reset")
            } else {
                slowMessage = lang(message, "command.slowmode.embed.slowMessage.updated")
                embed.setDescription(`${lang(message, "command.slowmode.embed.slowMessage.previous")}\n\`\`\`• ${rateLimit}s\n\`\`\``)
            }

            message.channel.setRateLimitPerUser(nr)

            embed.setTitle(`${slowMessage} \`${nr}\` ${lang(message, "command.slowmode.embed.slowMessage.seconds")}`)
            embed.setColor(crimson)
            embed.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
            embed.setTimestamp()
            message.channel.send(embed);
        }
    }
}
module.exports = Slowmode;