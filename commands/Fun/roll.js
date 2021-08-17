const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Roll extends Command {
    constructor() {
        super('roll',
            {
                aliases: ['roll'],
                category: 'Fun',
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                },
                args: [
                    {
                        id: 'input',
                        type: /[0-9]-[0-9]/gmi,
                    }
                ]
            });
    }

    async exec(message, { input }) {
        if (input) {
            let x = input.matches[0].input.replace(/(.*)-/, "");
            let y = input.matches[0].input.substring(0, input.matches[0].input.indexOf("-"));
            if (x < y) return message.channel.send({ content: "Ooorrrr... You could use it like everyone else and do `min-max`?" });
            if (x > 10000000) return message.channel.send({ content: "Wow you must be fun at parties 😒" });

            let dynamicRng = Math.floor(Math.random() * (x - y) + y)

            await message.channel.send({ content: `**${message.author.username}** rolled **${dynamicRng}** (${input.matches[0].input})` })
        } else {
            let staticRng = Math.floor(Math.random() * 100)

            await message.channel.send({ content: `**${message.author.username}** rolled ${staticRng} (1-100)` })
        }

    }
}
module.exports = Roll;