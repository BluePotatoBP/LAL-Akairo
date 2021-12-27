const { Command } = require('discord-akairo');
const { promptMessage, delMsg } = require('../../assets/tools/util');
const { pastelGreen, darkRed } = require('../../assets/colors.json');
const { MessageEmbed, Permissions } = require('discord.js');

class Ban extends Command {
    constructor() {
        super('ban', {
            aliases: ['ban'],
            category: 'Mod',
            clientPermissions: ['BAN_MEMBERS'],
            userPermissions: ['BAN_MEMBERS'],
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Ban a user with a reason',
                usage: '<user> [reason]',
                syntax: '<> - required, [] - optional'
            },
            args: [{
                id: 'm',
                type: 'member',
                prompt: {
                    start: (message) => lang(message, 'command.ban.prompt.start'),
                    retry: (message) => lang(message, 'command.ban.prompt.retry')
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
        await delMsg(message, 30000);

        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => cachedGuild.role === r) || message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            // If theres no reason change 'r' args to "No Reason"
            !r ? r = lang(message, 'command.ban.reason.noReason') : ''

            const sbembed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(lang(message, 'command.ban.sbembed.desc'))
                .setColor(darkRed)
                .setFooter(lang(message, 'command.ban.mistake'))
                .setTimestamp();

            // Check if the user being banned isnt the moderator themselves
            if (m.id === message.author.id) return await message.channel.send({ embeds: [sbembed] });

            const ambed = new MessageEmbed()
                .setTitle(lang(message, 'command.ban.ambed.title'))
                .setColor(darkRed)
                .setFooter(lang(message, 'command.ban.mistake'))
                .setTimestamp();

            // Check if the user being banned has ban perms
            if (m.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return await message.channel.send({ embeds: [ambed] });

            const promptEmbed = new MessageEmbed()
                .setColor(pastelGreen)
                .setTitle(lang(message, 'command.ban.promptEmbed.title'))
                .setDescription(`${lang(message, 'command.ban.promptEmbed.desc.one')} \`${m.displayName}\` ${lang(message, 'command.ban.promptEmbed.desc.two')} **${r}**?`);

            // Ban prompt initiation
            let editEmbed = await message.channel.send({ embeds: [promptEmbed] });

            const emoji = await promptMessage(editEmbed, message.author, 30, ['✅', '❌']);
            // If the moderator reacted with a check mark ban the user
            if (emoji === '✅') {
                await m.ban(r);

                await message.channel.send(`**${message.author.tag}** ${lang(message, 'command.ban.messageAfterBan.one')} **${m.user.tag}**. \n${lang(message, 'command.ban.messageAfterBan.two')} ${r}`);

                /*const banEmbed = new MessageEmbed() // When i figure out how to use a database, nice embed
                    .setAuthor("Action: Ban", "https://i.imgur.com/CQjspzn.png")
                    .setThumbnail(m.user.displayAvatarURL({ dynamic: true }))
                    .setColor(salmon)
                    .setDescription(`**Offender:** ${m.tag} *(${m.id})*\n **Moderator:** ${message.author.tag} *(${message.author.id})* \n**Channel:** ${message.channel.name} *(${message.channel.id})* \n**Reason:** ${r}`)
                    .setTimestamp()
	
                logchannel.send(banEmbed);*/

                // If the moderator reacted with an x cancel the action
            } else if (emoji === '❌') {
                const banCanceled = new MessageEmbed()
                    .setDescription(`\`${m.displayName}\` ${lang(message, 'command.ban.banCanceled.desc')}`)
                    .setColor(darkRed)
                    .setFooter(lang(message, 'command.ban.banCanceled.footer'))
                    .setTimestamp();

                await editEmbed.edit({ embeds: [banCanceled] });
            }
        } else {
            const staffroleEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()

            await message.channel.send({ embeds: [staffroleEmbed] }).then(delMsg(message, 5000));
        }
    }
}

module.exports = Ban;