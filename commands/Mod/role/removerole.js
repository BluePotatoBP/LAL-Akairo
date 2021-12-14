const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { darkRed } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class Addrole extends Command {
    constructor() {
        super('removerole', {
            aliases: ['removerole', 'rrole', 'remover'],
            category: '',
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Remove any role from any user',
                usage: '<user> <role>',
                syntax: '<> - necessary'
            },
            args: [{
                id: 'm',
                type: 'member',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.removerole.prompt.member.start'),
                    retry: (message) => lang(message, 'command.removerole.prompt.member.retry')
                }
            },
            {
                id: 'r',
                type: 'role',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.removerole.prompt.role.start'),
                    retry: (message) => lang(message, 'command.removerole.prompt.role.retry')
                }
            }
            ]
        });
    }

    async exec(message, { m, r }) {
        await delMsg(message, 30000);

        if (!m.roles.cache.has(r.id))
            return message.channel.send({ content: `${m.user.username} ${lang(message, 'command.removerole.embed.desc.one')} \`${r.name}\` ${lang(message, 'command.removerole.embed.desc.two')}` });
        try {
            await message.react('<a:check:773208316624240710>');
        } catch (error) { }
        try {
            await m.roles.remove(r.id);
        } catch (error) {
            console.log(error);
            await message.channel.send({ content: lang(message, "command.removerole.noPermsError") });
        }
    }
}
module.exports = Addrole;