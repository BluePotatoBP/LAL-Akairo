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
                cooldown: 5000,
                description: {
                    content: '',
                    usage: '<number>-<number>',
                    syntax: '<> - necessary'
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
            if (input.matches[0].input === "0-0") return await message.channel.send({ content: `**${message.author.username}** rolled **0** (0-0) - What else did you expect?` })
            let x = input.matches[0].input.replace(/(.*)-/, "");
            let y = input.matches[0].input.substring(0, input.matches[0].input.indexOf("-"));
            if (x < y) return await message.channel.send({ content: "Ooorrrr... You could use it like everyone else and do `min-max`?" });
            if (x > 10000000) return await message.channel.send({ content: "Wow you must be fun at parties 😒" });

            let dynamicRng = Math.floor(Math.random() * (x - y) + y)
            !input.matches[0].input.startsWith("0-") && dynamicRng == 0 ? dynamicRng = 1 : dynamicRng;

            await message.channel.send({ content: `**${message.author.username}** rolled **${dynamicRng}** (${input.matches[0].input})` })
        } else {
            let staticRng = Math.floor(Math.random() * 100)

            await message.channel.send({ content: `**${message.author.username}** rolled **${staticRng}** (1-100)` })
        }

    }
}
module.exports = Roll;