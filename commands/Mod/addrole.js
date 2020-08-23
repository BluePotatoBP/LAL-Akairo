const { Command, Util } = require('discord-akairo');
const Discord = require('discord.js');
const { darkRed } = require('../../assets/colors.json')

class Addrole extends Command {
    constructor() {
        super('addrole',
            {
                aliases: ['addrole', 'addr', 'arole'],
                category: 'Mod',
                clientPermissions: ['MANAGE_ROLES'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                description: {
                    content: 'Add any role to any user',
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

          if (m.roles.cache.has(r.id)) return message.channel.send(`That user already has the \`${r.name}\` role.`);
          await (m.roles.add(r.id));
        
          try {
            await m.message.react("✅")
          } catch (e) {
            message.react("✅");
          }
    }
}
module.exports = Addrole;