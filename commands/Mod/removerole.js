const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { darkRed } = require('../../assets/colors.json')

class Addrole extends Command {
    constructor() {
        super('removerole',
            {
                aliases: ['removerole', 'rrole', 'remover'],
                category: 'Mod',
                clientPermissions: ['MANAGE_ROLES'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'Remove any role from any user',
                    usage: '<user> <role>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'm',
                        type: 'member',
                        unordered: true,
                        prompt: {
                            start: message => lang(message, "command.removerole.prompt.member.start"),
                            retry: message => lang(message, "command.removerole.prompt.member.retry"),
                        }
                    },
                    {
                        id: 'r',
                        match: 'phrase',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: message => lang(message, "command.removerole.prompt.role.start"),
                            retry: message => lang(message, "command.removerole.prompt.role.retry"),
                        }
                    },
                ]
            });
    }

    async exec(message, { m, r }) {
        message.delete({ timeout: 30000 }).catch(e => { });

        if (!m.roles.cache.has(r.id)) return message.channel.send(`${m.user.username} ${lang(message, "command.removerole.embed.desc.one")} \`${r.name}\` ${lang(message, "command.removerole.embed.desc.two")}`);
        await (m.roles.remove(r.id));

        try {
            await m.message.react("✅")
        } catch (e) {
            message.react("✅");
        }
    }
}
module.exports = Addrole;