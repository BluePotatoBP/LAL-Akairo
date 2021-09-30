const { Command, Flag } = require('discord-akairo');

class reactionRole extends Command {
    constructor() {
        super('reactionroles', {
            aliases: ['reactionroles', 'rr', 'reactionrole'],
            category: 'Mod',
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: '',
                usage: '<action> [args]',
                syntax: '<> - necessary, [] - optional'
            },
            * args() {
                let action = yield {
                    type: [['add'], ['create'], ['setup'], ['remove'], ['list'], ['flag'], ['move'], ['fix']],
                    prompt: {
                        start: (message) => lang(message, "command.reactionroles.args.start"),
                        retry: (message) => lang(message, "command.reactionroles.args.retry"),
                        optional: false
                    }
                };

                if (action == 'add') return Flag.continue('reactionroleadd');
                if (action == 'create') return Flag.continue('reactionroleadd');
                if (action == 'setup') return Flag.continue('reactionroleadd');
                if (action == 'remove') return Flag.continue('reactionroleremove');
                if (action == 'list') return Flag.continue('reactionroleslist');
                if (action == 'flag') return Flag.continue('reactionroleflags');
                if (action == 'move') return Flag.continue('reactionrolemove');
                if (action == 'fix') return Flag.continue('reactionrolefix');
            }
        });
    }
}
module.exports = reactionRole;