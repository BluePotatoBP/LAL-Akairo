const { Command, Flag } = require('discord-akairo');

class Role extends Command {
    constructor() {
        super('role', {
            aliases: ['role'],
            category: 'Mod',
            clientPermissions: ['MANAGE_ROLES'],
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
                    type: [['add'], ['remove']],
                    prompt: {
                        start: (message) => lang(message, 'command.role.prompt.start'),
                        retry: (message) => lang(message, 'command.role.prompt.retry'),
                        optional: false
                    }
                };

                if (action == 'add') return Flag.continue('addrole');

                if (action == 'remove') return Flag.continue('removerole');
            }
        });
    }
}
module.exports = Role;