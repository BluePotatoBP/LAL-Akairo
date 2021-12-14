const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { delMsg, cutTo } = require('../../../assets/tools/util');
let permsToArray = require("discord-perms-array");

class roleInfo extends Command {
    constructor() {
        super('roleinfo',
            {
                aliases: ['roleinfo'],
                category: '',
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                },
                args: [
                    {
                        id: 'r',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.roleinfo.role.prompt.start"),
                            retry: (message) => lang(message, "command.roleinfo.role.prompt.retry"),
                            optional: false
                        }
                    },
                ]
            });
    }

    async exec(message, { r }) {
        await delMsg(message, 30000);
        let roleCount = await message.guild.roles.cache.get(r.id).members.map(c => c.user.id).length

        const intToHex = (int) => {
            let hex = Number(int).toString(16);
            if (hex.length < 2) hex = "0" + hex;
            return hex;
        };

        let rolePerms = permsToArray(Object.values(r.permissions)).map(c => `\`${c}\`,`).join(" ");

        const infoEmbed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Role", `${r}`, true)
            .addField("Color", `\`#${intToHex(r.color)}\``, true)
            .addField("Members", `\`${roleCount}\``, true)
            .addField("Hoisted", `\`${r.hoist}\``, true)
            .addField("Mentionable", `\`${r.mentionable}\``, true)
            .addField("Position", `\`${r.rawPosition}\``, true)
            .addField("Permissions", cutTo(rolePerms ? rolePerms : '\`-\`', 0, 900, true))
            .setFooter(`ID: ${r.id}`)
            .setColor(r.color)
            .setTimestamp()

        await message.channel.send({ embeds: [infoEmbed] })
    }
}

module.exports = roleInfo;