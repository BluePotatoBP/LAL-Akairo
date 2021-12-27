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
                syntax: '<> - required'
            },
            * args() {
                let action = yield {
                    type: [['add'], ['remove'], ['color'], ['info']],
                    prompt: {
                        start: (message) => lang(message, 'command.role.prompt.start'),
                        retry: (message) => lang(message, 'command.role.prompt.retry'),
                        optional: false
                    }
                };

                if (action == 'add') return Flag.continue('addrole');
                if (action == 'remove') return Flag.continue('removerole');
                if (action == 'color') return Flag.continue('rolecolor');
                if (action == 'info') return Flag.continue('roleinfo');
            }
        });
    }
}
module.exports = Role;