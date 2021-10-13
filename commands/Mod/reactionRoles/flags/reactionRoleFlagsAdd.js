const { Command, Argument } = require('discord-akairo');
const { delMsg } = require('../../../../assets/tools/util')

class reactionRoleFlagsAdd extends Command {
    constructor() {
        super('reactionroleflagsadd',
            {
                aliases: ['reactionroleflagsadd', 'rrfa', 'rrflagsadd', 'rrflagadd'],
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
                        match: 'option',
                        type: Argument.range('number', 1, 1000),
                        flag: ['sd', 'selfdestruct'],
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleflagsadd.args.sdflag"),
                            retry: (message) => lang(message, "command.reactionroleflagsadd.args.sdflag"),
                            optional: true
                        }
                    },
                    {
                        id: 'vFlag',
                        match: 'flag',
                        flag: ['verify', 'v'],
                        unordered: true
                    },
                    {
                        id: 'lFlag',
                        match: 'flag',
                        flag: ['lock', 'l'],
                        unordered: true
                    },
                    {
                        id: 'rFlag',
                        match: 'flag',
                        flag: ['reverse', 'r'],
                        unordered: true
                    },
                    {
                        id: 'messageID',
                        type: 'guildMessage',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleflagsadd.args.messageid.start"),
                            retry: (message) => lang(message, "command.reactionroleflagsadd.args.messageid.retry"),
                            optional: false
                        }
                    }
                ]
            });
    }

    async exec(message, { sdFlag, vFlag, lFlag, rFlag, messageID }) {
        await delMsg(message, 30000);
        // Check if the user gave flag args
        if (!sdFlag && !vFlag && !lFlag && !rFlag) return await message.channel.send({ content: lang(message, "command.reactionroleflagsadd.noFlags.content") })
        if (sdFlag && vFlag || sdFlag && lFlag || sdFlag && rFlag) return await message.channel.send({ content: `${lang(message, "command.reactionroleflagsadd.incompatible.one")} \`(SelfDestruct & ${vFlag ? 'Verify' : ''} ${lFlag ? 'Lock' : ''} ${rFlag ? 'Reverse' : ''})\`\n\n${lang(message, "command.reactionroleflagsadd.incompatible.two")}` })
        // Get cache and check if it exists
        let messageCache = reactionRoles.find(c => c.message == messageID.id);
        if (!messageCache) return await message.channel.send({ content: lang(message, "command.reactionroleflagsadd.noRR") })
        console.log(messageCache)
        if(messageCache.destructAt || messageCache.verifyFlag || messageCache.lockFlag || messageCache.reverseFlag) return await message.channel.send("Currently you can only have 1 flag per message.");
        //console.log(messageCache)
        // If self destruct flag was given, do logic for it
        if (sdFlag) {
            await DB.query(`UPDATE reactionRoles SET destructAt = ? WHERE message = ?`, [sdFlag, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: sdFlag,
                verifyFlag: null,
                lockFlag: null,
                reverseFlag: null
            })

            await message.channel.send({ content: `Added **Self Destruct** flag at **${sdFlag}** reactions to **${messageID.id}** message.` })
        } else if (vFlag) { // Else if verify flag was given, do logic for it too
            await DB.query(`UPDATE reactionRoles SET verifyFlag = ? WHERE message = ?`, [true, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: true,
                lockFlag: messageCache.lockFlag ? "true" : null,
                reverseFlag: messageCache.reverseFlag ? "true" : null
            })

            await message.channel.send({ content: `Added **Verify** flag to **${messageID.id}** message.` })
        } else if (lFlag) { // And if the lock flag was used, do logic
            await DB.query(`UPDATE reactionRoles SET lockFlag = ? WHERE message = ?`, [true, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: messageCache.verifyFlag ? "true" : null,
                lockFlag: true,
                reverseFlag: messageCache.reverseFlag ? "true" : null
            })

            await message.channel.send({ content: `Added **Lock** flag to **${messageID.id}** message.` })
        } else if (rFlag) { // And finally if reverse flag was used, produce funny
            await DB.query(`UPDATE reactionRoles SET reverseFlag = ? WHERE message = ?`, [true, messageID.id]);
            let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
            await reactionRoles.splice(deleteFlag)
            await reactionRoles.push({
                guild: messageCache.guild,
                message: messageCache.message,
                role: messageCache.role,
                emoji: messageCache.emoji,
                destructAt: null,
                verifyFlag: messageCache.verifyFlag ? "true" : null,
                lockFlag: messageCache.lockFlag ? "true" : null,
                reverseFlag: true
            })

            await message.channel.send({ content: `Added **Reverse** flag to **${messageID.id}** message.` })
        }
    }
}
module.exports = reactionRoleFlagsAdd;