const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const approx = require('approximate-number');

class Purge extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge'],
            category: 'Mod',
            clientPermissions: ['MANAGE_MESSAGES '],
            userPermissions: ['MANAGE_MESSAGES '],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'later',
                usage: 'later',
                syntax: 'later'
            },
            args: [{
                    id: 'messagesAmount',
                    type: 'number',
                },
                {
                    id: 'bots',
                    match: 'flag',
                    flag: ['-bot', '-bots']
                },
                {
                    id: 'embeds',
                    match: 'flag',
                    flag: ['-embed', '-embeds']
                },
                {
                    id: 'attachments',
                    match: 'flag',
                    flag: ['-attachment', '-attachments', '-atch']
                },
                {
                    id: 'userOpt',
                    match: 'option',
                    type: 'member',
                    flag: ['-user:', '-user'],
                },
                {
                    id: 'includesOpt',
                    match: 'option',
                    flag: ['-includes:', '-includes'],
                },
                {
                    id: 'startsWithOpt',
                    match: 'option',
                    flag: ['-starts:', '-starts', '-startswith:', '-startswith'],
                },
                {
                    id: 'endsWithOpt',
                    match: 'option',
                    flag: ['-ends:', '-ends', '-endswith:', '-endsswith'],
                },
            ]
        });
    }

    async exec(message, { messagesAmount, bots, embeds, attachments, userOpt, includesOpt, startsWithOpt, endsWithOpt }) {
        message.delete().catch(e => {});

        // Staffrole Check
        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        let role = message.guild.roles.cache.get(cachedGuild.role)
        let memberRoles = message.member._roles;
        if (!role) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);

        if (memberRoles.some(r => role.id === r)) {
            // End of staffrole check/Start of purge

            if (messagesAmount > 1000) {
                return message.channel.send(`You cannot purge over a thousand messages at once. (\`${approx(messagesAmount, { decimal: '.' })}/1000\`)`).then(message => message.delete({ timeout: 10000 }))
            }

            let wait = msg => new Promise(res => setTimeout(res, msg));
            const allDeletedAmount = []
            let timesToRun = Math.ceil(messagesAmount / 100)

            for (let currentRun = 0; currentRun < timesToRun; currentRun++) {

                await wait(2000)
                //Messages under 100
                if (timesToRun - currentRun === 1) {

                    let messagesLeftToDelete = messagesAmount - (currentRun * 100)
                    let fetch = await message.channel.messages.fetch({ limit: messagesLeftToDelete })

                    ////////////////// Variations: //////////////////
                    if (bots) { fetch = fetch.filter(e => e.author.bot) }
                    if (embeds) { fetch = fetch.filter(c => c.embeds.size > 0) }
                    if (userOpt) { fetch = fetch.filter(c => c.author.id === userOpt.id) }
                    if (includesOpt) { fetch = fetch.filter(c => c.content.match(includesOpt)) }
                    if (startsWithOpt) { fetch = fetch.filter(c => c.content.startsWith(startsWithOpt)) }
                    if (endsWithOpt) { fetch = fetch.filter(c => c.content.endsWith(endsWithOpt)) }
                    if (attachments) { fetch = fetch.filter(c => c.attachments.size > 0) }

                    let deletedAmount = await message.channel.bulkDelete(fetch)
                    allDeletedAmount.push(deletedAmount.size)

                    break;
                }

                //Messages over 100
                let fetch = await message.channel.messages.fetch({ limit: 100 })

                ////////////////// Variations: //////////////////
                if (bots) { fetch = fetch.filter(e => e.author.bot) }
                if (embeds) { fetch = fetch.filter(c => c.embeds.size > 0) }
                if (userOpt) { fetch = fetch.filter(c => c.author.id === userOpt.id) }
                if (includesOpt) { fetch = fetch.filter(c => c.content.match(includesOpt)) }
                if (startsWithOpt) { fetch = fetch.filter(c => c.content.startsWith(startsWithOpt)) }
                if (endsWithOpt) { fetch = fetch.filter(c => c.content.endsWith(endsWithOpt)) }
                if (attachments) { fetch = fetch.filter(c => c.attachments.size > 0) }

                let deletedAmount = await message.channel.bulkDelete(fetch)
                allDeletedAmount.push(deletedAmount.size)
            } // End of loop

            let actuallyPurged = allDeletedAmount.length == 0 ? 0 : allDeletedAmount.reduce((a, b) => a + b);
            await wait(1000).then(message.channel.send(`Purged \`${actuallyPurged}\` messages.`).then(msg => msg.delete({ timeout: 10000 })))
            // End of purge/Start of staffrole check 2nd part

        } else {
            const staffroleEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()
            message.channel.send(staffroleEmbed).then(m => m.delete({ timeout: 5000 }));
        }
        // End of staffrole check 2nd part
    }
}
module.exports = Purge;