const { Command, Argument } = require('discord-akairo');
const Discord = require('discord.js');
const { stripIndents } = require('common-tags');
const { crimson, darkRed } = require('../../../assets/colors.json')
const { PasteGG } = require("paste.gg")
const pasteGG = new PasteGG();

class Star extends Command {
    constructor() {
        super('star', {
            aliases: ['star'],
            category: '',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: '',
                usage: '\n[channel(:)]\n[min(:)|minimum(:)]\n[max(:)|maximum(:)]\n',
                syntax: '[] - optional, () - optional symbol'
            },
            args: [{
                id: 'enableOpt',
                match: 'flag',
                flag: ['enable', 'on']
            },
            {
                id: 'disableOpt',
                match: 'flag',
                flag: ['disable', 'off']
            },
            {
                id: 'minOpt',
                match: 'option',
                type: Argument.range('number', 1, 1000000),
                flag: ['min', 'minimum', 'min:', 'minimum:'],
                prompt: {
                    start: 'Minimum cannot be lower then \`1\`',
                    retry: 'Minimum cannot be lower then \`1\`',
                    optional: true
                }
            },
            {
                id: 'maxOpt',
                match: 'option',
                type: Argument.range('number', 1, 1000000),
                flag: ['max', 'maximum', 'max:', 'maximum:'],
                prompt: {
                    start: 'Maximum cannot be higher then \`1,000,000\`',
                    retry: 'Maximum cannot be higher then \`1,000,000\`',
                    optional: true
                }
            },
            {
                id: 'channelOpt',
                match: 'option',
                type: 'textChannel',
                flag: ['ch', 'channel', 'ch:', 'channel:']
            },
            {
                id: 'selfStarsOpt',
                match: 'option',
                type: 'string',
                flag: ['selfstar', 'selfstar:', 'self', 'self:']
            },
            {
                id: 'nsfwOpt',
                match: 'option',
                type: 'string',
                flag: ['nsfw', 'nsfw:']
            },
            ]
        });
    }

    async exec(message, { enableOpt, disableOpt, minOpt, maxOpt, channelOpt, selfStarsOpt, nsfwOpt }) {
        message.delete({ timeout: 1000 }).catch(e => { });

        /////////////////////////////// STAFFROLE CHECK
        let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
        if (!cachedGuild) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let role = message.guild.roles.cache.get(cachedGuild.role)
        if (!role) return message.channel.send(`${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\``);
        let memberRoles = message.member._roles;

        if (memberRoles.some(r => role.id === r)) {

            /////////////////////////////// START OF WORK CODE
            // Get settings from db
            const [currentSettings] = await DB.query(`SELECT * FROM starSettings WHERE guild = ?`, [message.guild.id])

            // Is the channel set
            let channelArray = { 'NO_CHANNEL': '**├** <:logs:801080508310093834> **Channel:** \`-\`' }

            // Is there blacklisted channels/users/roles
            let mappedList = await starBlacklistCache.filter(c => c.guild === message.guild.id).map(c => c.blacklistedID);
            const rolesCount = mappedList.filter(c => message.guild.roles.cache.get(c))
            const usersCount = mappedList.filter(c => this.client.users.cache.get(c))
            const channelCount = mappedList.filter(c => message.guild.channels.cache.get(c))

            /////////////////////////////// Send list to Paste.gg 
            let pasteContent = await starBlacklistCache.filter(c => c.guild === message.guild.id).map(c => stripIndents`-=+ ${this.client.user.username} Starboard Blacklist +=-\n⤷ Roles: ${rolesCount.length}\n⤷ Users: ${usersCount.length}\n⤷ Channels: ${channelCount.length}\n-=+ ${this.client.user.username} Starboard Blacklist +=-\n\n${message.guild.channels.cache.get(c.blacklistedID) ? `Channel - ${message.guild.channels.cache.get(c.blacklistedID).name} [${message.guild.channels.cache.get(c.blacklistedID).id}]` :
                message.guild.members.cache.get(c.blacklistedID) ? `User - ${message.guild.members.cache.get(c.blacklistedID).username} [${message.guild.members.cache.get(c.blacklistedID).id}]` :
                    message.guild.roles.cache.get(c.blacklistedID) ? `Role - ${message.guild.roles.cache.get(c.blacklistedID).name} [${message.guild.roles.cache.get(c.blacklistedID).id}]` :
                        '\`ERROR\`'}`).join("\n")

            if (pasteContent) {
                const paste = await pasteGG.post({
                    name: `${message.guild.name} - Starboard Blacklist`,
                    description: `Blacklisted users, roles and channels for the ${this.client.user.username} Starboard feature.`,
                    expires: new Date(Date.now() + 86400000).toISOString(),
                    files: [{
                        name: `IgnoredList`,
                        content: {
                            format: "text",
                            highlight_language: 'javascript',
                            value: pasteContent,
                        }
                    }]
                })

                paste ? console.log(`${debug('[DEBUG]')} User ${message.author.tag} uploaded 'Starboard Blacklist' to paste.gg (https://paste.gg/p/anonymous/${paste.result.id})\nat ${paste.result.created_at} with the deletion key '${paste.result.deletion_key}'`) : '';
            }

            /////////////////////////////// Embed preparation
            // Blacklisted string for embed
            let blacklisted = await pasteContent ? `\n**├** <:disable:823340316769779733> **Blacklist:** [[List]](https://paste.gg/p/anonymous/${paste.result.id} 'paste.gg') \n**├** *⤷* Roles: \`${rolesCount.length}\`\n**├** *⤷* Users: \`${usersCount.length}\`\n**├** *⤷* Channels: \`${channelCount.length}\`` : '';

            const listEmbed = new Discord.MessageEmbed()
                .setTitle('⭐ Starboard ⭐')
                .setColor(crimson)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            // If there is no data saved
            if (currentSettings.length === 0) {

                // Data that gets sent to the database
                const enabled = enableOpt ? 'true' : disableOpt ? 'false' : 'false';
                const minStars = minOpt ? minOpt : 1;
                const maxStars = maxOpt ? maxOpt : 100;
                const logChannel = channelOpt ? channelOpt.id : "NO_CHANNEL";
                const selfStars = selfStarsOpt ? selfStarsOpt : "false";
                const nsfwAllowed = nsfwOpt ? nsfwOpt : "false";

                await DB.query(`INSERT INTO starSettings (enabled, guild, channel, minStars, maxStars, allowSelfStar, allowNsfw ) VALUES(?,?,?,?,?,?,?)`, [enabled, message.guild.id, logChannel, minStars, maxStars, selfStars, nsfwAllowed])

                listEmbed.setDescription(stripIndents`
                        ┌────────┄┄┄┄
                        **├** <:checkCircle:801085028938285088> **Enabled:** \`${enabled}\`
                        **├** <:logs:801080508310093834> **Channel:** \`-\`
                        **├** <:min:823341363679461376> **Minimum:** \`${minStars}\`
                        **├** <:max:823341363474071602> **Maximum:** \`${maxStars}\`
                        **├** <:staffrole:801054561816805437> **Allow Self Star:** \`${selfStars}\`
                        **├** <:nonsfw:823990821794873385> **Allow NSFW Msgs:** \`${nsfwAllowed}\`${blacklisted}
                        └────────┄┄┄┄`)

                return await message.util.send(listEmbed)
            }

            // If there is data saved
            const enabled = enableOpt ? 'true' : disableOpt ? 'false' : currentSettings[0].enabled;
            const newMinStars = minOpt ? minOpt : currentSettings[0].minStars;
            const newMaxStars = maxOpt ? maxOpt : currentSettings[0].maxStars;
            const newChannel = channelOpt ? channelOpt.id : currentSettings[0].channel;
            const selfStars = selfStarsOpt ? selfStarsOpt : currentSettings[0].allowSelfStar === '' ? 'false' : currentSettings[0].allowSelfStar;
            const nsfwAllowed = nsfwOpt ? nsfwOpt : currentSettings[0].allowNsfw;

            // Update data
            await DB.query(`UPDATE starSettings SET enabled = ?, minStars = ?, maxStars = ?, channel = ?, allowSelfStar = ?, allowNsfw = ? WHERE guild = ?`, [enabled, newMinStars, newMaxStars, newChannel, selfStars, nsfwAllowed, message.guild.id])

            // If there is data, updated embed
            listEmbed.setDescription(stripIndents`
                        ┌────────┄┄┄┄
                        **├** <:checkCircle:801085028938285088> **Enabled:** \`${enabled}\`
                        ${channelArray[newChannel] ? channelArray[newChannel] : `**├** <:logs:801080508310093834> **Channel:** <#${newChannel}>`}
                        **├** <:min:823341363679461376> **Minimum:** \`${newMinStars}\`
                        **├** <:max:823341363474071602> **Maximum:** \`${newMaxStars}\`
                        **├** <:staffrole:801054561816805437> **Allow Self Star:** \`${selfStars}\`
                        **├** <:nonsfw:823990821794873385> **Allow NSFW Msgs:** \`${nsfwAllowed}\`${blacklisted}
                        └────────┄┄┄┄`)

            await message.channel.send(listEmbed)

            /////////////////////////////// END OF WORK CODE
        } else {
            const staffroleEmbed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                .setColor(darkRed)
                .setTimestamp()
            await message.util.send(staffroleEmbed).then(m => m.delete({ timeout: 5000 }));
        }
        /////////////////////////////// END OF STAFFROLE CHECK
    }
}
module.exports = Star;