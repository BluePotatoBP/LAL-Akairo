const { Inhibitor } = require('discord-akairo');
const cooldown = new Set();

module.exports = class cacheRefresh extends Inhibitor {
    constructor() {
        super('cacheRefresh', {
            event: 'commandStarted',
            emitter: 'commandHandler'
        });
    }

    async exec(message, command, args) {
        if (command.id === "refreshCache") {
            cooldown.add("enabled")
            console.log(cooldown)
            setTimeout(async () => { cooldown.delete("enabled") }, 5000)
        }

        if (cooldown.has("enabled") && command.category.id === "Mod") return await message.channel.send({ content: "Refreshing cache, please try again in ~\`5s\`" }).catch(() => { })
    }
};