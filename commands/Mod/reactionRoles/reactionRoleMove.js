const { Command } = require('discord-akairo');
const { delMsg } = require('../../../assets/tools/util')

class reactionRoleMove extends Command {
    constructor() {
        super('reactionrolemove',
            {
                aliases: ['reactionrolemove', 'rrm', 'rrmove'],
                category: '',
                clientPermissions: ['ADD_REACTIONS'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '<old message> <new message>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'input',
                        match: 'separate',
                        unordered: false,
                        prompt: {
                            start: (message) => lang(message, "command.reactionrolemove.args.start"),
                            retry: (message) => lang(message, "command.reactionrolemove.args.retry"),
                            optional: false
                        }
                    }
                ]
            });
    }

    async exec(message, { input }) {
        await delMsg(message, 30000);
        console.log(input[0])
        console.log(input[1])
        // Get message from cache
        const getMessage = reactionRoles.filter(c => c.message === input[0]);
        if (getMessage.length === 0) return await message.channel.send({ content: lang(message, "command.reactionrolemove.nooriginalmessage.content") }); // If no msg return sad message
        if (getMessage[0].guild !== message.guild.id) return await message.channel.send({ content: lang(message, "command.reactionrolemove.nooriginalmessage.content") }); // - || -
        // Call guildMessage resolver so i dont have to loop through all channels myself
        let resolveType = await this.client.commandHandler.resolver.type("guildMessage")
        let msg = await resolveType(message, input[1])
        if (!msg) return await message.channel.send({ content: lang(message, "command.reactionrolemove.nonewmessage.content") })
        // Loop through all emoji and add them to the new msg, also update cache
        for (let i = 0; i < getMessage.length; i++) {
            let emoji = message.guild.emojis.cache?.get(getMessage[i].emoji);
            if (!emoji) return await message.channel.send({ content: `${lang(message, "command.reactionrolemove.noemoji.content.one")} **${getMessage[i].emoji}** ${lang(message, "command.reactionrolemove.noemoji.content.two")} **${getMessage[i].message}** ${lang(message, "command.reactionrolemove.noemoji.content.three")}` })

            let deleteFlag = await reactionRoles.findIndex(c => c.message === input[0]);

            await reactionRoles.splice(deleteFlag);
            await reactionRoles.push({
                guild: getMessage[i].guild,
                message: input[1],
                role: getMessage[i].role,
                emoji: getMessage[i].emoji,
                destructAt: getMessage[i].destructAt,
                verifyFlag: getMessage[i].verifyFlag,
                lockFlag: getMessage[i].lockFlag,
                reverseFlag: getMessage[i].reverseFlag
            })

            await msg.react(emoji)
        }
        // Update data in database
        await DB.query(`UPDATE reactionRoles SET message = ? WHERE message = ?`, [input[1], input[0]]);
        // Send success message
        await message.channel.send({ content: `${lang(message, "command.reactionrolemove.success.content.one")} **${input[0]}** ${lang(message, "command.reactionrolemove.success.content.two")} **${input[1]}**.${lang(message, "command.reactionrolemove.success.content.three")}` })

    }
}
module.exports = reactionRoleMove;