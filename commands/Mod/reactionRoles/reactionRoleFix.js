const { Command } = require('discord-akairo');
const { delMsg } = require('../../../assets/tools/util')

class reactionRoleFix extends Command {
    constructor() {
        super('reactionrolefix',
            {
                aliases: ['reactionrolefix', 'rrfix'],
                category: '',
                clientPermissions: ['ADD_REACTIONS'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 60000,
                typing: true,
                description: {
                    content: '',
                    usage: '<message>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'fixMsg',
                        type: 'guildMessage',
                        unordered: false,
                        prompt: {
                            start: (message) => lang(message, "command.reactionrolefix.args.start"),
                            retry: (message) => lang(message, "command.reactionrolefix.args.start"),
                            optional: true
                        }
                    }
                ]
            });
    }

    async exec(message, { fixMsg }) {
        await delMsg(message, 30000);
        if (fixMsg) {
            // Get message from cache
            const getMessage = reactionRoles.filter(c => c.message === fixMsg.id);
            if (getMessage.length === 0) return await message.channel.send({ content: lang(message, "command.reactionrolefix.nomessage.content") }); // If no msg return sad message
            if (getMessage[0].guild !== message.guild.id) return await message.channel.send({ content: lang(message, "command.reactionrolefix.nomessage.content") }); // - || -
            // Loop through all emoji and add them to the new msg, also update cache
            for (let i = 0; i < getMessage.length; i++) {
                let emoji = message.guild.emojis.cache?.get(getMessage[i].emoji);
                if (!emoji) return await message.channel.send({ content: `${lang(message, "command.reactionrolefix.loopnoemoji.content.one")} **${getMessage[i].emoji}** ${lang(message, "command.reactionrolefix.loopnoemoji.content.two")} **${getMessage[i].message}** ${lang(message, "command.reactionrolefix.loopnoemoji.content.three")}` });

                await fixMsg.react(emoji);
            }
            // Send success message
            await message.channel.send({ content: `${lang(message, "command.reactionrolefix.success.restoredloop.content")} **${fixMsg.id}** ${lang(message, "command.reactionroleremove.word.message")}.` });
        } else {
            // Get a custom arg handler
            let resolveType = await this.client.commandHandler.resolver.type("guildMessage")
            // Get guild from cache
            const getGuild = reactionRoles.filter(c => c.guild === message.guild.id);
            if (getGuild.length === 0) return await message.channel.send({ content: "Sorry, I couldn't find any reaction roles in storage." }) // If no guild return sad message
            if (getGuild[0].guild !== message.guild.id) return await message.channel.send("Sorry, I couldn't find any reaction roles in storage."); // - || -
            // Loop through all emoji and add them to the new msg, also update cache
            for (let i = 0; i < getGuild.length; i++) {
                let emoji = message.guild.emojis.cache?.get(getGuild[i].emoji);
                if (!emoji) return await message.channel.send({ content: `${lang(message, "command.reactionrolefix.loopnoemoji.content.one")} **${getGuild[i].emoji}** ${lang(message, "command.reactionrolefix.loopnoemoji.content.two")} **${getGuild[i].message}** ${lang(message, "command.reactionrolefix.loopnoemoji.content.three")}` });
                let msg = await resolveType(message, getGuild[i].message)
                if (!msg) return await message.channel.send({ content: `${lang(message, "command.reactionrolefix.loopnoemoji.content.one")} **${getGuild[i].message}** ${lang(message, "command.reactionrolefix.failure.elseloop.content")}` });

                await msg.react(emoji);
            }
            // Send success message
            await message.channel.send({ content: lang(message, "command.reactionrolefix.success.restorednormal.content") })
        }
    }
}
module.exports = reactionRoleFix;