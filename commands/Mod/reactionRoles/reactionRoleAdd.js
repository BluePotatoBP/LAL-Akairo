const { Command } = require('discord-akairo');
const { delMsg } = require('../../../assets/tools/util');

class reactionRoleAdd extends Command {
    constructor() {
        super('reactionroleadd',
            {
                aliases: ['reactionroleadd', 'rradd'],
                clientPermissions: ['ADD_REACTIONS'],
                userPermissions: ['MANAGE_ROLES'],
                category: '',
                ownerOnly: false,
                cooldown: 10000,
                typing: true,
                description: {
                    content: '',
                    usage: '<message> <emoji> <role>',
                    syntax: '<> - required, [] - optional'
                },
                args: [
                    {
                        id: 'messageID',
                        type: 'guildMessage',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleadd.args.messageid.start"),
                            retry: (message) => lang(message, "command.reactionroleadd.args.messageid.retry"),
                            optional: false
                        }
                    },
                    {
                        id: 'emojiID',
                        type: 'emojiMention',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleadd.args.emojiid.start"),
                            retry: (message) => lang(message, "command.reactionroleadd.args.emojiid.retry"),
                            optional: false
                        }
                    },
                    {
                        id: 'roleID',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleadd.args.roleid.start"),
                            retry: (message) => lang(message, "command.reactionroleadd.args.roleid.retry"),
                            optional: false
                        }
                    }
                ]
            });
    }

    async exec(message, { messageID, emojiID, roleID }) {
        delMsg(message, 30000) // Delete command

        // Get data from cache for roleID
        let getRRRoleCache = reactionRoles.find(c => c.role == roleID.id);
        let getRRGuildCache = reactionRoles.filter(c => c.guild.id == messageID.guild.id);
        // Get data from cache for emojiID
        let getRREmojiCache = reactionRoles.find(c => c.emoji == emojiID.id);
        // If the same role was already in cache return msg
        if (getRRRoleCache) return await message.channel.send({ content: `**${roleID.name}** ${lang(message, "command.reactionroleadd.role.alreadybound.content")}` });
        if (getRRGuildCache.length >= 100) return await message.channel.send({ content: lang(message, "command.reactionroleadd.limitreached.content") });
        // If the same emoji was already in cache return msg
        if (getRREmojiCache) return await message.channel.send({ content: `**${emojiID}** ${lang(message, "command.reactionroleadd.emoji.alreadybound.content")}` });

        // Insert new role
        await DB.query(`INSERT INTO reactionRoles VALUES(?,?,?,?,?,?,?,?)`, [messageID.guild.id, messageID.id, roleID.id, emojiID.id, null, null, null, null]);
        reactionRoles.push({
            guild: message.guild.id,
            message: messageID.id,
            role: roleID.id,
            emoji: emojiID.id,
            destructAt: null,
            verifyFlag: null,
            lockFlag: null,
            reverseFlag: null
        })

        // Add reaction
        await messageID.react(emojiID.id);

        // Send notification
        let tempMsg = await message.channel.send({ content: `${lang(message, "command.reactionroleadd.success.content.one")} **${messageID.id}** ${lang(message, "command.reactionroleadd.success.content.two")} **${emojiID}** ${lang(message, "command.reactionroleadd.success.content.three")} **${roleID}** ${lang(message, "command.reactionroleadd.success.content.four")}` })
        // Delete info msg
        delMsg(tempMsg, 40000)
    }
}

module.exports = reactionRoleAdd;