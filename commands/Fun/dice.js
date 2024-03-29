const { MessageEmbed } = require('discord.js');
const { Command } = require('discord-akairo');
const { dice } = require('random-js')
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Dice extends Command {
    constructor() {
        super('dice', {
            aliases: ['dice'],
            category: 'Fun',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'later',
                usage: '',
                syntax: ''
            },
            args: [{
                id: 'text',
                match: 'text',
                type: 'string',
            },]
        });
    }

    async exec(message, args) {
        await delMsg(message);

        /* let sides = {
            1: "https://i.imgur.com/epZt2e0.png",
            2: "https://i.imgur.com/9W3PLvx.png",
            3: "https://i.imgur.com/GCzEhEI.png",
            4: "https://i.imgur.com/wNAt4Fr.png",
            5: "https://i.imgur.com/6Mjl7U1.png",
            6: "https://i.imgur.com/0YwYQeW.png"
        } */

        let number = Math.floor(Math.random() * 6);
        number === 0 ? number = 1 : number;

        const embed = new MessageEmbed()
            /* .setImage(sides[number]) */
            .setColor(crimson)
            .setFooter(`You rolled a [${number}]`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await message.channel.send({ embeds: [embed] });
    }
}
module.exports = Dice;