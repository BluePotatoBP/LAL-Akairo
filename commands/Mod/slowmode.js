const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const { crimson, lightRed } = require('../../assets/colors.json');
const ms = require('ms');
const { delMsg } = require('../../assets/tools/util');

class Slowmode extends Command {
    constructor() {
        super('slowmode', {
            aliases: ['slowmode', 'smode'],
            category: 'Mod',
            clientPermissions: ['MANAGE_CHANNELS'],
            userPermissions: ['MANAGE_CHANNELS'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: '',
                usage: '<time> [rest|off] [-channel(:)|-ch(:)]',
                syntax: '<> - required, [] - optional, () - optional symbol'
            },
            args: [{
                id: 'nr',
                match: 'text',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.slowmode.prompt.start'),
                    retry: (message) => lang(message, 'command.slowmode.prompt.retry'),
                    optional: true
                }
            },
            {
                id: 'reset',
                match: 'flag',
                unordered: true,
                flag: ['reset', 'off']
            },
            {
                id: 'channelOpt',
                type: 'textChannel',
                match: 'option',
                unordered: true,
                flag: ['-channel', '-channel:', '-ch', '-ch:'],
                default: (message) => message.channel
            }
            ]
        });
    }

    async exec(message, { nr, reset, channelOpt }) {
        delMsg(message, 30000)

        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => cachedGuild.role === r) || message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            let rateLimit = channelOpt.messages.channel.rateLimitPerUser;
            const embed = new MessageEmbed();
            let slowMessage;

            if (nr >= 21600) {
                const embed2 = new MessageEmbed()
                    .setTitle(lang(message, 'command.slowmode.embed.title'))
                    .setDescription(lang(message, 'command.slowmode.embed.desc'))
                    .setColor(crimson)
                    .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                await message.channel.send({ embeds: [embed2] });
            } else if (nr < 0) {
                const embed = new MessageEmbed()
                    .setDescription(`Unfortunately for you, funny man, slowmode \`cant\` go below \`0\`.\nPlease \`edit\` or resend your message with a positive number.`)
                    .setColor(lightRed)
                    .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                await message.util.send({ embeds: [embed] });
            } else {
                if (nr) {
                    if (nr.match(/^[0-9]*$/gm)) { nr = `${nr}s` }
                    let inputToMS = ms(nr);
                    let msToSeconds = inputToMS / 1000;

                    if (!rateLimit || rateLimit === 0) {
                        if (nr === rateLimit) {
                            slowMessage = lang(message, 'command.slowmode.embed.slowMessage.alreadyExists');
                        } else {
                            slowMessage = lang(message, 'command.slowmode.embed.slowMessage.new');
                        }
                    } else if (nr === 0) {
                        slowMessage = lang(message, 'command.slowmode.embed.slowMessage.reset');
                    } else {
                        slowMessage = lang(message, 'command.slowmode.embed.slowMessage.updated');
                        embed.setDescription(`${lang(message, 'command.slowmode.embed.slowMessage.previous')}\n\`\`\`• ${ms(rateLimit * 1000)}\n\`\`\``);
                    }

                    await channelOpt.messages.channel.setRateLimitPerUser(msToSeconds);

                    embed.setTitle(`${slowMessage} \`${msToSeconds}\` ${lang(message, 'command.slowmode.embed.slowMessage.seconds')}`);
                    embed.setColor(crimson);
                    embed.setFooter(`${message.author.username} | #${channelOpt.messages.channel.name}`, message.author.displayAvatarURL({ dynamic: true }));
                    embed.setTimestamp();

                    await message.channel.send({ embeds: [embed] });
                } else if (reset) {

                    channelOpt.messages.channel.setRateLimitPerUser(0);
                    slowMessage = lang(message, 'command.slowmode.embed.slowMessage.reset');

                    embed.setTitle(`${slowMessage} \`0\` ${lang(message, 'command.slowmode.embed.slowMessage.seconds')}`);
                    embed.setColor(crimson);
                    embed.setFooter(`${message.author.username} | #${channelOpt.messages.channel.name}`, message.author.displayAvatarURL({ dynamic: true }));
                    embed.setTimestamp();

                    await message.channel.send({ embeds: [embed] });
                } else {
                    const embed3 = new MessageEmbed()
                        .setDescription(`Current slowmode in ${channelOpt.messages.channel} channel:\n\`\`\`${rateLimit ? ms(rateLimit * 1000) : `0s`}\`\`\``)
                        .setColor(crimson)
                        .setFooter(`${message.author.username} | #${channelOpt.messages.channel.name}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()

                    await message.channel.send({ embeds: [embed3] })
                }
            }
        } else {
            const staffroleEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()

            await message.channel.send({ embeds: [staffroleEmbed] }).then(m => delMsg(m, 5000)).catch(e => { });
        }
    }
}
module.exports = Slowmode;