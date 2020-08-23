const { Inhibitor } = require('discord-akairo');

module.exports = class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklistDM', {
            reason: 'blacklistDM',
            type: 'all'
        })
    }

    exec(message) {
        const blockedChannels = ['dm'];
        return blockedChannels.includes(message.channel.type);
    }
}