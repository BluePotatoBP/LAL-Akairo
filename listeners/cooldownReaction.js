const { Listener } = require('discord-akairo');
const cooldown = new Set();

module.exports = class cooldownReact extends Listener {
    constructor() {
        super('cooldownReact', {
            event: 'cooldown',
            emitter: 'commandHandler'
        });
    }

    async exec(message, command, remaining) {

        if (cooldown.has(message.author.id)) return;

        await message.react("⏰").then(setTimeout(() => { message.reactions.cache.get("⏰").remove().catch(e => console.error(e)) }, remaining));

        cooldown.add(message.author.id);
        setTimeout(() => {
            cooldown.delete(message.author.id)
        }, 5000)
    }
};