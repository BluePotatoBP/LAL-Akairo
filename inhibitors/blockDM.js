const { Inhibitor } = require('discord-akairo');

module.exports = class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklistDM', {
            reason: 'blacklistDM',
            type: 'all'
        })
    }

    async exec(message) {
        if (message.channel.type === "dm") return;

    }
}