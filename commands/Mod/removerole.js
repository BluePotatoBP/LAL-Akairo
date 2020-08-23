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
                            start: 'Please give me a \`user\` to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a \`user\` to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    },
                    {
                        id: 'r',
                        match: 'phrase',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: 'Please give me a \`role\` to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a \`role\` to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    },
                ]
            });
    }

    async exec(message, { m, r }) {
        message.delete({ timeout: 30000 }).catch(e => { });

        if (!m.roles.cache.has(r.id)) return message.channel.send(`That user already doesn't have the \`${r.name}\` role.`);
        await (m.roles.remove(r.id));

        try {
            await m.message.react("✅")
        } catch (e) {
            message.react("✅");
        }
    }
}
module.exports = Addrole;