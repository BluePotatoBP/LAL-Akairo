const { Inhibitor } = require('discord-akairo');

module.exports = class BlockBetaNonOwner extends Inhibitor {
    constructor() {
        super('blockBetaNonOwner', {
            reason: 'blockBetaNonOwner',
            type: 'all'
        })
    }

    async exec(message) {
        if (client.user.id === "685922621669244962" && message.author !== process.env.OWNER) return;

    }
}