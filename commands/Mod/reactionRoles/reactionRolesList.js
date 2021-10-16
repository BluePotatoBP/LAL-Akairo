const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const _ = require("lodash")
const { crimson } = require('../../../assets/colors.json')
const { delMsg, cutTo } = require('../../../assets/tools/util')


class reactionRolesList extends Command {
    constructor() {
        super('reactionroleslist',
            {
                aliases: ['reactionroleslist', 'rrlist', 'rrl'],
                userPermissions: ['MANAGE_ROLES'],
                category: '',
                ownerOnly: false,
                cooldown: 10000,
                typing: true,
                description: {
                    content: '',
                    usage: '[message]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'm',
                        type: 'guildMessage',
                        prompt: {
                            start: (message) => lang(message, "command.reactionroleslist.args.start"),
                            retry: (message) => lang(message, "command.reactionroleslist.args.retry"),
                            optional: true
                        }
                    },
                ]
            });
    }

    async exec(message, { m }) {
        await delMsg(message, 30000);
        // Call guildMessage args
        let resolveType = await this.client.commandHandler.resolver.type("guildMessage")
        // Check if the user gave msg id
        if (m) {
            // Get message data from cache and args
            const cachedMessage = reactionRoles.filter(c => c.message === m.id);
            if (!reactionRoles.find(c => c.message === m.id)) return message.channel.send({ content: lang(message, "command.reactionroleslist.nomessage.content") })
            // Group cached data by message id
            const groupBy = _.groupBy(cachedMessage, (e) => { return e.message })
            // Define embed
            const listEmbed = new MessageEmbed()
                .setAuthor(`${cutTo(message.guild.name, 0, 30, true)} ${lang(message, "command.reactionroleslist.listEmbed.author.content")}`, message.guild.iconURL({ dynamic: true }))
                .setColor(crimson)
            // Add fields 
            let map;
            for (let i = 0; i < Object.values(groupBy).length; i++) {
                let group = Object.values(groupBy)
                map = group[i].map(c => `${message.guild.emojis.cache?.get(c.emoji)} ${message.guild.roles.cache?.get(c.role)}`);
                let msg = await resolveType(message, group[i][0].message)

                listEmbed.addField(' ⁡‍⁡‍⁢', `${i + 1}. **[${group[i][0].message}](${await msg.url} '${lang(message, "command.reactionroleslist.listEmbed.addField.tooltip")}')** ${group[i][0].destructAt ? `**🚩 SelfDestruct@${group[i][0].destructAt}**` : group[i][0].lockFlag ? '**🚩 Locked**' : group[i][0].verifyFlag ? '**🚩 Verify**' : group[i][0].reverseFlag ? '**🚩 Reverse**' : ''}\n${map.join('\n')}`);
            }
            // Add a description element on to the embed, just a bit later so i can get the role count
            listEmbed.setDescription(`${lang(message, "command.reactionroleslist.listEmbed.desc.content.one")} \`${map.length}\` ${lang(message, "command.reactionroleslist.listEmbed.desc.content.two")}`)

            await message.channel.send({ embeds: [listEmbed] })
        } else { // If theres no id, show entire guild list
            // Get message data from cache
            const cachedGuild = reactionRoles.filter(c => c.guild === message.guild.id);
            if (!reactionRoles.find(c => c.guild === message.guild.id)) return message.channel.send({ content: lang(message, "command.reactionroleslist.norrsaved.content") })
            // Group cached data by message id
            const groupBy = _.groupBy(cachedGuild, (e) => { return e.message })
            // Define embed
            const listEmbed = new MessageEmbed()
                .setAuthor(`${cutTo(message.guild.name, 0, 30, true)} ${lang(message, "command.reactionroleslist.listEmbed.author.content")}`, message.guild.iconURL({ dynamic: true }))
                .setDescription(lang(message, "command.reactionroleslist.listEmbed.desc.content.three"))
                .setColor(crimson)
            // Add fields 
            for (let i = 0; i < Object.values(groupBy).length; i++) {
                let group = Object.values(groupBy)
                let map = group[i].map(c => `${message.guild.emojis.cache?.get(c.emoji)} ${message.guild.roles.cache?.get(c.role)}`);
                let msg = await resolveType(message, group[i][0].message)

                listEmbed.addField(' ⁡‍⁡‍⁢', `${i + 1}. **[${group[i][0].message}](${msg ? await msg.url : ''} '${lang(message, "command.reactionroleslist.listEmbed.addField.tooltip")}')** ${group[i][0].destructAt ? `**🚩 SelfDestruct@${group[i][0].destructAt}**` : group[i][0].lockFlag ? '**🚩 Locked**' : group[i][0].verifyFlag ? '**🚩 Verify**' : group[i][0].reverseFlag ? '**🚩 Reverse**' : ''}\n${map.join('\n')}`);
            }
            await message.channel.send({ embeds: [listEmbed] })
        }
    }
}
module.exports = reactionRolesList;