const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');
const cooldown = new Set();
const moment = require('moment');

module.exports = class cooldownReact extends Listener {
    constructor() {
        super('cooldownReact', {
            event: 'cooldown',
            emitter: 'commandHandler',
        });
    }

    async exec(message, command, remaining) {
        // If the user is already on a cooldown return
        if (cooldown.has(message.author.id)) return;
        // Check if the bot has permissions to react
        if (message.guild.me.permissions.has(Permissions.FLAGS.ADD_REACTIONS)) {
            await message.react("⏰"); // If yes react with clock
            setTimeout(async () => {
                await message.reactions.cache?.get("⏰").remove().catch(e => { })
            }, remaining);
        } else { // If not send a message and delete after time runs out
            try {
                let cooldownMessage = await message.channel.send({ content: `⏰ \`${remaining !== 0 ? moment(remaining) : '0s'}\`` })
                setTimeout(async () => {
                    await cooldownMessage.delete()
                }, remaining < 2000 ? 2000 : remaining)
            } catch (error) { }
        }

        cooldown.add(message.author.id);
        setTimeout(() => { cooldown.delete(message.author.id) }, 5000)
    }
};