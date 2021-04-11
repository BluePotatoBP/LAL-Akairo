const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson, darkRed } = require('../../assets/colors.json');

class Poll extends Command {
    constructor() {
        super('poll', {
            aliases: ['poll', 'vote', 'createpoll', 'createvote'],
            category: 'Mod',
            clientPermissions: ['ADD_REACTIONS'],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'Create a poll for the community to vote for something',
                usage: '[#channel] <text>',
                syntax: '<> - necessary, [] - optional'
            },
            args: [{
                id: 'c',
                match: 'phrase',
                type: 'channel',
                prompt: {
                    start: (message) => lang(message, 'command.poll.channel.prompt.start'),
                    retry: (message) => lang(message, 'command.poll.channel.prompt.retry'),
                    optional: true
                }
            },
            {
                id: 't',
                match: 'rest',
                type: 'string',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.poll.text.prompt.start'),
                    retry: (message) => lang(message, 'command.poll.text.prompt.retry')
                }
            }
            ]
        });
    }

    async exec(message, { c, t }) {
        message.delete({ timeout: 30000 }).catch((e) => { });

        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => role.id === r)) {
            let sicon = message.guild.iconURL({ dynamic: true });

            const embed = new Discord.MessageEmbed()
                .setDescription(t)
                .setColor(crimson)
                .setThumbnail(sicon)
                .setFooter(`🎉 ${lang(message, 'command.poll.embed.pollAuthor')} ${message.author.username}! 🎉`, sicon)
                .setTimestamp();
            if (c) {
                // Sends embed and reacts
                c.send(embed).then(async (message) => {
                    await message.react('🔺');
                    await message.react('🔻');
                });
            } else {
                // Sends embed and reacts
                message.channel.send(embed).then(async (message) => {
                    await message.react('🔺');
                    await message.react('🔻');
                });
            }
        } else {
            const staffroleEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()
            message.channel.send(staffroleEmbed).then(m => m.delete({ timeout: 5000 }));
        }
    }
}
module.exports = Poll;