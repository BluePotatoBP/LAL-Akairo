const { Listener } = require('discord-akairo');

module.exports = class antiAdvertisement extends Listener {
    constructor() {
        super('antiAdvertisement', {
            event: 'message',
            emitter: 'client'
        });
    }

    async exec(message) {

    }
};