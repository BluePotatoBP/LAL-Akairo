const { Listener } = require('discord-akairo');

module.exports = class commandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            event: 'commandFinished',
            emitter: 'commandHandler',
        });
    }

    async exec(message) {
        let promptMsgFind = await promptFilter.find(c => c.userID == message.author.id && c.channelID == message.channel.id)

        if (!promptMsgFind) return;

        for (let i = 0; i < promptFilter.length; i++) {
            if (promptFilter[i].userID === message.author.id && promptFilter[i].channelID === message.channel.id) {
                promptFilter.splice(i, 1);
                break;
            }
        }

        let channel = message.guild.channels.cache.get(promptMsgFind.channelID)
        let fetchMsg = await channel.messages.fetch(promptMsgFind.msgID)
        if (fetchMsg) setTimeout(async () => { await fetchMsg.delete().catch(() => { }) }, 5000)

    }
}