const { Command, Flag } = require('discord-akairo');

class reactionRoleFlags extends Command {
    constructor() {
        super('reactionroleflags', {
            aliases: ['reactionroleflags', 'rrfl', 'rrflags'],
            category: '',
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: '',
                usage: '<add|remove>',
                syntax: '<> - necessary'
            },
            * args() {
                let action = yield {
                    type: [['add'], ['remove']],
                    prompt: {
                        start: (message) => lang(message, "command.reactionroleflags.args.start"),
                        retry: (message) => lang(message, "command.reactionroleflags.args.retry"),
                        optional: false
                    }
                };

                if (action == 'add') return Flag.continue('reactionroleflagsadd');
                if (action == 'remove') return Flag.continue('reactionroleflagsremove');

            }
        });
    }
}
module.exports = reactionRoleFlags;