const { Command, Flag } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Role extends Command {
    constructor() {
        super('role', {
            aliases: ['role'],
            category: 'Mod',
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'later',
                usage: '<add>|<remove> <user> <role>',
                syntax: '<> - necessary'
            },
            * args(message) {
                let action = yield {
                    type: [
                        ['add'],
                        ['remove']
                    ],
                    default: 'list',
                    prompt: {
                        start: (message) => lang(message, 'command.role.prompt.start'),
                        retry: (message) => lang(message, 'command.role.prompt.retry'),
                        optional: false
                    }
                };

                // Reroll ongoing giveaway
                if (action == 'add') return Flag.continue('addrole');

                // Default msg
                if (action == 'remove') return Flag.continue('removerole');
            }
        });
    }

    async exec(message) {
        message.delete().catch((e) => { });
    }
}
module.exports = Role;