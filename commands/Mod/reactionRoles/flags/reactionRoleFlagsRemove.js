const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../../../assets/colors.json')
const { delMsg } = require('../../../../assets/tools/util')

class reactionRoleFlagsRemove extends Command {
    constructor() {
        super('reactionroleflagsremove',
            {
                aliases: ['reactionroleflagsremove', 'rrfr', 'rrflagsremove', 'rrflagremove'],
                category: '',
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 10000,
                typing: true,
                description: {
                    content: 'later',
                    usage: '<flag> <message>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'sdFlag',
                        match: 'flag',
                        flag: ['sd', 'selfdestruct'],
                        unordered: false
                    },
                    {
                        id: 'vFlag',
                        match: 'flag',
                        flag: ['verify', 'v'],
                        unordered: false
                    },
                    {
                        id: 'lFlag',
                        match: 'flag',
                        flag: ['lock', 'l'],
                        unordered: false
                    },
                    {
                        id: 'rFlag',
                        match: 'flag',
                        flag: ['reverse', 'r'],
                        unordered: false
                    },
                    {
                        id: 'messageID',
                        type: 'guildMessage',
                        unordered: false,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleflagsremove.args.messageid.start"),
                            retry: (message) => lang(message, "command.reactionroleflagsremove.args.messageid.retry"),
                            optional: false
                        }
                    }
                ]
            });
    }

    async exec(message, { sdFlag, vFlag, lFlag, rFlag, messageID }) {
        await delMsg(message, 30000);
        // Check if the user gave flag args
        if (!sdFlag && !vFlag && !lFlag && !rFlag) return await message.channel.send({ content: lang(message, "command.reactionroleflagsremove.noFlags.content") })
        // Get cache and check if it exists
        let messageCache = reactionRoles.find(c => c.message == messageID.id);
        if (!messageCache) return await message.channel.send({ content: lang(message, "command.reactionroleflagsremove.noRR") })
        if (messageCache.guild !== message.guild.id) return await message.channel.send({ content: lang(message, "command.reactionroleflagsremove.noRR") })
        // If self destruct flag was given, do logic for it
        if (sdFlag) {
            await DB.query(`DELETE FROM reactionRoles where destructAt = ? WHERE message = ?`, [null, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: null,
                lockFlag: null,
                reverseFlag: null
            })

            await message.channel.send({ content: `Removed **Self Destruct** flag from **${messageID.id}** message.` })
        } else if (vFlag) { // Else if verify flag was given, do logic for it too
            await DB.query(`UPDATE reactionRoles SET verifyFlag = ? WHERE message = ?`, [null, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: null,
                lockFlag: null,
                reverseFlag: null
            })

            await message.channel.send({ content: `Removed **Verify** flag from **${messageID.id}** message.` })
        } else if (lFlag) { // And if the unique flag was used, do logic
            await DB.query(`UPDATE reactionRoles SET lockFlag = ? WHERE message = ?`, [null, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: null,
                lockFlag: null,
                reverseFlag: null
            })

            await message.channel.send({ content: `Removed **Lock** flag from **${messageID.id}** message.` })
        } else if (rFlag) { // And finally if reverse flag was used, do funny
            await DB.query(`UPDATE reactionRoles SET reverseFlag = ? WHERE message = ?`, [null, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: null,
                lockFlag: null,
                reverseFlag: null
            })

            await message.channel.send({ content: `Removed **Reverse** flag from **${messageID.id}** message.` })
        }
    }
}
module.exports = reactionRoleFlagsRemove;