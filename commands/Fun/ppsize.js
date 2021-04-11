const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class PPSize extends Command {
    constructor() {
        super('ppsize', {
            aliases: ['ppsize', 'pp', 'pplength'],
            category: 'Fun',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Accurately measures your pp size',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'u',
                type: 'user',
                default: (msg) => msg.author
            }]
        });
    }

    async exec(message, { u }) {
        message.delete().catch((e) => { });

        let sizes = [
            'An error occurred: Not visible by the human eye',
            '() (Also considered as a vagina)',
            'D (Really small, seriously go get penis enlargement surgery)',
            '8D (Micropenis)',
            '8=D (VERY SMOL PP)',
            '8==D (Still tiny)',
            '8===D (About average)',
            '8====D (Above average (also these measurements are not scientific im not gay im just making these up i feel like i have to say this))',
            'An error occurred: Not measurable (too big)',
            '8=====D \nhttps://www.youtube.com/watch?v=jXglHzoG_Zs',
            '8■■■■■■■■■■■■■■■■■■■■■■■■D (Bigger than a country dang)',
            '8∞∞∞∞∞∞∞∞∞∞∞∞∞∞D (MASSIVE PP)'
        ];
        let images = [
            'https://i.imgur.com/aibmFgU.jpg',
            'https://i.imgur.com/TxWae5X.png',
            'https://media1.tenor.com/images/46d73c3cc50fa32e0e1d8c2a38007477/tenor.gif?itemid=7513882',
            'https://media1.tenor.com/images/6eaab0d39bd1afa7be8985eb7ac2d28b/tenor.gif?itemid=4425303',
            'https://media1.tenor.com/images/fb21c5a0ff18e29aab890d1d1f6d6e64/tenor.gif?itemid=15357817'
        ];

        let PRNG = require('prng'),
            prng = new PRNG(u.id);
        let chance = prng.rand(100) + '%';

        try {
            let ppembed2 = new Discord.MessageEmbed()
                .setAuthor(u.username, u.displayAvatarURL({ dynamic: true }))
                .setThumbnail(images[~~(prng.rand(images.length))])
                .setColor('RANDOM')
                .addField(lang(message, 'command.ppsize.embed.field.one'), sizes[~~(prng.rand(sizes.length))])
                .addField(lang(message, 'command.ppsize.embed.field.two'), chance)
                .setFooter(`${lang(message, 'command.ppsize.embed.footer')} ${message.author.username}`)
                .setTimestamp();

            message.channel.send(ppembed2);
        } catch (error) {
            console.log(error);
            message.channel.send('Something went wrong 🤷‍♀️');
        }
    }
}
module.exports = PPSize;