const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const approx = require('approximate-number');
const { darkRed } = require('../../assets/colors.json')
const { delMsg } = require('../../assets/tools/util');

class Purge extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge', 'bulkdelete', 'massdelete', 'delete'],
            category: 'Mod',
            clientPermissions: ['MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: '', //[bots] then \n[-embed(s)] \/
                usage: '<amount>\n\n[-bot(s)]\n[-attachment(s)|-atch]\n[-human(s)]\n[-link(s)]\n[-invite(s)]\n\n[-user(:)] *\n[-include(s)(:)] *\n[-starts(:)|-startswith(:)] *\n[-ends(:)|-endswith(:)] *\n\n*These options can check for multiple entries within quotes\n(ex. -user: "ID1, ID2" or -includes: "blue is funny")\n',
                syntax: '<> - necessary, [] - optional, () - optional symbol'
            },
            args: [{
                id: 'messagesAmount',
                type: 'number',
                prompt: {
                    start: (message) => lang(message, "command.purge.args.number.start"),
                    retry: (message) => lang(message, "command.purge.args.number.retry")
                }
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
                id: 'humans',
                match: 'flag',
                flag: ['-human', '-humans']
            },
            {
                id: 'links',
                match: 'flag',
                flag: ['-link', '-links']
            },
            {
                id: 'invites',
                match: 'flag',
                flag: ['-invite', '-invites']
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

    async exec(message, { messagesAmount, bots, embeds, attachments, humans, links, invites, userOpt, includesOpt, startsWithOpt, endsWithOpt }) {
        await delMsg(message, 30000);

        // Staffrole Check
        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => cachedGuild.role === r) || message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            // End of staffrole check/Start of purge
            if (messagesAmount > 1000) return message.channel.send({ content: `${lang(message, "command.purge.warning.content")} (\`${approx(messagesAmount, { decimal: '.' })}/1000\`)` }).then(message => delMsg(message, 10000))

            let wait = msg => new Promise(res => setTimeout(res, msg));
            const allDeletedAmount = []
            let timesToRun = Math.ceil(messagesAmount / 100)

            for (let currentRun = 0; currentRun < timesToRun; currentRun++) {

                await wait(2000)
                //Messages under 100
                if (timesToRun - currentRun === 1) {

                    let messagesLeftToDelete = messagesAmount - (currentRun * 100)
                    let fetch = await message.channel.messages.fetch({ limit: messagesLeftToDelete })
                    fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false)

                    ////////////////// Variations: //////////////////
                    if (bots) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.author.bot) }
                    //if (embeds) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.embeds.size > 0) }
                    if (userOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.author.id === userOpt.id) }
                    if (includesOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.match(includesOpt)) }
                    if (startsWithOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.startsWith(startsWithOpt)) }
                    if (endsWithOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.endsWith(endsWithOpt)) }
                    if (attachments) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.attachments.size > 0) }
                    if (humans) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && !c.author.bot) }
                    if (links) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.match(/(https?\:|www\.|discord\.gg(\/invite)?|(\.com))/gmi)) }
                    if (invites) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.match(/(discord\.gg(\/invite)?)/gmi)) }

                    let deletedAmount = await message.channel.bulkDelete(fetch)
                    allDeletedAmount.push(deletedAmount.size)

                    break;
                }

                //Messages over 100
                let fetch = await message.channel.messages.fetch({ limit: 100 })
                fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false)

                ////////////////// Variations: //////////////////
                if (bots) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.author.bot) }
                //if (embeds) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.embeds.size > 0) }
                if (userOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.author.id === userOpt.id) }
                if (includesOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.match(includesOpt)) }
                if (startsWithOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.startsWith(startsWithOpt)) }
                if (endsWithOpt) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.endsWith(endsWithOpt)) }
                if (attachments) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.attachments.size > 0) }
                if (humans) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && !c.author.bot) }
                if (links) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.includes(/(https?\:|www\.|discord\.gg(\/invite)?|(\.com))/gmi)) }
                if (invites) { fetch = fetch.filter(c => (Date.now() - c.createdTimestamp) < 1123200000 && c.pinned == false && c.content.includes(/(discord\.gg(\/invite)?)/gmi)) }

                let deletedAmount = await message.channel.bulkDelete(fetch)
                allDeletedAmount.push(deletedAmount.size)
            } // End of loop

            let actuallyPurged = allDeletedAmount.length == 0 ? 0 : allDeletedAmount.reduce((a, b) => a + b);
            await wait(1000).then(await message.channel.send({ content: `Purged \`${actuallyPurged}\` messages.` }).then(msg => delMsg(msg, 10000)));
            // End of purge/Start of staffrole check 2nd part

        } else {// If the user doesnt have the staffrole, return this embed
            const staffroleEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()

            await message.channel.send({ embeds: [staffroleEmbed] }).then(m => delMsg(m, 5000));
        }
        // End of staffrole check 2nd part
    }
}
module.exports = Purge;