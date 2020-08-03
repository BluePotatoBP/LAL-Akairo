const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class What extends Command {
    constructor() {
        super('what',
            {
                aliases: ['what'],
                category: 'Fun',
                ownerOnly: false,
                description: {
                    content: 'Ehhhhhhhhhhhhhh what?',
                    usage: '',
                },
            });
    }

    async exec(message) {
        message.delete().catch(e => { });

        message.channel.send("https://i.imgur.com/mgRPF1H.jpg")
    }
}
module.exports = What;