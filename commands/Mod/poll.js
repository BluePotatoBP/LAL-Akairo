const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const { crimson, darkRed } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Poll extends Command {
    constructor() {
        super('poll', {
            aliases: ['poll', 'vote', 'createpoll', 'createvote'],
            category: 'Mod',
            clientPermissions: ['ADD_REACTIONS'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Create a poll for the community to vote for something',
                usage: '[#channel] <text>',
                syntax: '<> - required, [] - optional'
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
        delMsg(message, 30000)

        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => cachedGuild.role === r) || message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {

            const embed = new MessageEmbed()
                .setDescription(t)
                .setColor(crimson)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(`🎉 ${lang(message, 'command.poll.embed.pollAuthor')} 🎉`, message.guild.iconURL({ dynamic: true }))
                .setTimestamp();

            if (c) {
                // Sends embed and reacts
                await c.send({ embeds: [embed] }).then(async (message) => {
                    await message.react('🔺');
                    await message.react('🔻');
                });
            } else {
                // Sends embed and reacts
                await message.channel.send({ embeds: [embed] }).then(async (message) => {
                    await message.react('🔺');
                    await message.react('🔻');
                });
            }
        } else {
            const staffroleEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()

            await message.channel.send({ embeds: [staffroleEmbed] }).then(m => delMsg(m, 5000));
        }
    }
}
module.exports = Poll;