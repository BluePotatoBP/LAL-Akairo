const { Command } = require('discord-akairo');

class Coinflip extends Command {
    constructor() {
        super('coinflip',
            {
                aliases: ['coinflip', 'coin', 'cf'],
                category: 'Fun',
                ownerOnly: false,
                cooldown: 10000,
                ratelimit: 2,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                }
            });
    }

    async exec(message) {
        let flipMsg = await message.channel.send({ content: "<a:coinflip:874872942205468742>" })

        setTimeout(async () => {
            let emoji = ['<:heads:874881091088035870> Heads', '<:tails:874881091209662494> Tails']
            let rng = Math.floor(Math.random() * emoji.length)
            await flipMsg.edit({ content: emoji[rng] })
        }, 2800)
    }
}
module.exports = Coinflip;