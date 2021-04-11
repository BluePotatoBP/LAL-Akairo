const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { promptMessage } = require('../../assets/tools/util');
const { pastelGreen, darkRed } = require('../../assets/colors.json');

class Kick extends Command {
    constructor() {
        super('kick', {
            aliases: ['kick'],
            category: 'Mod',
            clientPermissions: ['KICK_MEMBERS'],
            userPermissions: ['KICK_MEMBERS'],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'Kick a user with a reason',
                usage: '<user> [reason]',
                syntax: '<> - necessary, [] - optional'
            },
            args: [{
                id: 'm',
                type: 'member',
                prompt: {
                    start: (message) => lang(message, 'command.kick.prompt.start'),
                    retry: (message) => lang(message, 'command.kick.prompt.retry')
                }
            },
            {
                id: 'r',
                match: 'rest',
                type: 'string'
            }
            ]
        });
    }

    async exec(message, { m, r }) {
        message.delete({ timeout: 30000 });

        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => role.id === r) || message.member.hasPermission('KICK_MEMBERS')) {
            // If theres no reason change 'r' args to "No Reason"
            if (!r) {
                r = lang(message, 'command.kick.reason.noReason');
            }

            const sbembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(lang(message, 'command.kick.sbembed.desc'))
                .setColor(darkRed)
                .setFooter(lang(message, 'command.kick.mistake'))
                .setTimestamp();

            // Check if the user being kicked isnt the moderator themselves
            if (m.id === message.author.id) {
                return message.channel.send(sbembed);
            }

            const ambed = new Discord.MessageEmbed()
                .setTitle(lang(message, 'command.kick.ambed.title'))
                .setColor(darkRed)
                .setFooter(lang(message, 'command.kick.mistake'))
                .setTimestamp();

            // Check if the user being kicked has kick perms
            if (m.hasPermission('KICK_MEMBERS')) return message.channel.send(ambed);

            const promptEmbed = new Discord.MessageEmbed()
                .setColor(pastelGreen)
                .setTitle(lang(message, 'command.kick.promptEmbed.title'))
                .setDescription(
                    `${lang(message, 'command.kick.promptEmbed.desc.one')} \`${m.displayName}\` ${lang(
                        message,
                        'command.kick.promptEmbed.desc.two'
                    )} **${r}**?`
                );

            // Kick prompt initiation
            let editEmbed = await message.channel.send(promptEmbed);

            const emoji = await promptMessage(editEmbed, message.author, 30, ['✅', '❌']);
            // If the moderator reacted with a check mark kick the user
            if (emoji === '✅') {
                u.kick(r).catch((err) => {
                    if (err) return message.channel.send(`Well this is awkward... *${err}*`);
                });

                message.channel.send(
                    `**${message.author.tag}** ${lang(message, 'command.kick.messageAfterBan.one')} **${m.user
                        .tag}**. \n${lang(message, 'command.kick.messageAfterBan.two')} ${r}`
                );
                /*const kickEmbed = new Discord.MessageEmbed() // When i figure out how to use a database, nice embed
                    .setAuthor("Action: Kick", "https://i.imgur.com/CQjspzn.png")
                    .setThumbnail(u.user.displayAvatarURL({ dynamic: true }))
                    .setColor(salmon)
                    .setDescription(`**Offender:** ${u.tag} *(${u.id})*\n **Moderator:** ${message.author.tag} *(${message.author.id})* \n**Channel:** ${message.channel.name} *(${message.channel.id})* \n**Reason:** ${r}`)
                    .setTimestamp()
                logchannel.send(kickEmbed);*/
                // If the moderator reacted with an x cancel the action
            } else if (emoji === '❌') {
                const kickCanceled = new Discord.MessageEmbed()
                    .setDescription(`\`${m.displayName}\` ${lang(message, 'command.kick.banCanceled.desc')}`)
                    .setColor(darkRed)
                    .setFooter(`${lang(message, 'command.kick.banCanceled.desc')} ${message.author.username}`)
                    .setTimestamp();
                editEmbed.edit(kickCanceled);
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
module.exports = Kick;