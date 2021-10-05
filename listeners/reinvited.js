const { Listener } = require('discord-akairo');

module.exports = class reinvited extends Listener {
    constructor() {
        super('reinvited', {
            event: 'guildCreate',
            emitter: 'client'
        });
    }

    async exec(guild) {
        try {
            await DB.query(`DELETE FROM awaitingDelete WHERE guild = ?`, [guild.id]);
        } catch (error) {

        }
    }
};