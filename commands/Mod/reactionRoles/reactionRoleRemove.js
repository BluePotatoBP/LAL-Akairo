const { Command } = require('discord-akairo');
const { MessageEmbed } = require("discord.js")
const { delMsg, promptMessage } = require('../../../assets/tools/util');
const { pastelGreen } = require('../../../assets/colors.json');

class reactionRoleRemove extends Command {
    constructor() {
        super('reactionroleremove',
            {
                aliases: ['reactionroleremove', 'rrremove'],
                clientPermissions: ['ADD_REACTIONS'],
                userPermissions: ['MANAGE_ROLES'],
                category: '',
                ownerOnly: false,
                cooldown: 10000,
                typing: true,
                description: {
                    content: '',
                    usage: '<message> [role]',
                    syntax: '<> - necessary, [] - optional'
                },
                args: [
                    {
                        id: 'messageID',
                        type: 'guildMessage',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleremove.args.messageid.start"),
                            retry: (message) => lang(message, "command.reactionroleremove.args.messageid.retry"),
                            optional: false
                        }
                    },
                    {
                        id: 'roleID',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleremove.args.roleid.start"),
                            retry: (message) => lang(message, "command.reactionroleremove.args.roleid.retry"),
                            optional: true
                        }
                    }
                ]
            });
    }

    async exec(message, { messageID, roleID }) {
        await delMsg(message, 30000);
        // Check if the funny man is trying to remove reaction roles from other servers
        if (message.guild.id != messageID.guild.id) return await message.channel.send({ content: `**${roleID.name}** ${lang(message, "command.reactionroleremove.role.alreadynotbound.content")}` });
        // Check if the user wants to delete all reactions on a message
        if (!roleID) {
            const promptEmbed = new MessageEmbed()
                .setColor(pastelGreen)
                .setTitle(lang(message, "command.reactionroleremove.promptEmbed.title"))
                .setDescription(`${lang(message, "command.reactionroleremove.promptEmbed.desc.one")} **${messageID.id}** ${lang(message, "command.reactionroleremove.word.message")}?`);
            // Ban prompt initiation
            const editEmbed = await message.util.send({ embeds: [promptEmbed] });
            const emoji = await promptMessage(editEmbed, message.author, 30, ['✅', '❌']);

            if (emoji === '✅') {
                // Filter for all of the same messages and delete from db
                const cachedMessage = reactionRoles.filter(c => c.message === messageID.id);
                await DB.query(`DELETE FROM reactionRoles WHERE message = ?`, [messageID.id]);
                // Delete all instances of the message in cache
                for (let i = 0; i < cachedMessage.length; i++) {
                    let deleteFlag = await reactionRoles.findIndex(c => c.message === messageID.id)
                    await reactionRoles.splice(deleteFlag)
                }
                await editEmbed.reactions.removeAll();
                await message.util.send({ content: `${lang(message, "command.reactionroleremove.reaction.success.content")} **${messageID.id}** ${lang(message, "command.reactionroleremove.word.message")}.` })
            } else {
                await message.util.send({ content: `${lang(message, "command.reactionroleremove.reaction.canceled.content")} **${messageID.id}** ${lang(message, "command.reactionroleremove.reaction.success.content.one")}` })
            }
        } else {
            // Get data from cache for roleID
            let getRRRoleCache = reactionRoles.find(c => c.role == roleID.id);
            // If the same role was already in cache return msg
            if (!getRRRoleCache) return await message.channel.send({ content: `**${roleID.name}** ${lang(message, "command.reactionroleremove.role.alreadynotbound.content")}` });
            // Delete role from db
            await DB.query(`DELETE FROM reactionRoles WHERE role = ?`, [roleID.id]);
            let deleteCachedRole = await reactionRoles.findIndex(c => c.role === roleID.id)
            await reactionRoles.splice(deleteCachedRole)
            // Send notification
            let successMessage = await message.channel.send({ content: `${lang(message, "command.reactionroleremove.success.content.one")} **${roleID}** ${lang(message, "command.reactionroleremove.success.content.two")} **${messageID.id}** ${lang(message, "command.reactionroleremove.word.message")}!\n\n${lang(message, "command.reactionroleremove.success.content.three")}` })
            // Delete info msg
            await delMsg(successMessage, 40000);
        }
    }
}
module.exports = reactionRoleRemove;