const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, } = require('canvas');
const path = require('path');
const { delMsg } = require('../../../assets/tools/util');

class Respect extends Command {
    constructor() {
        super('respect', {
            aliases: ['respect', 'pressf'],
            category: 'Fun',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'later',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'u',
                type: 'user',
                default: (message) => message.author
            },]
        });
    }

    async exec(message, { u }) {
        await delMsg(message);

        async function greyscale(ctx, x, y, width, height) {
            const data = ctx.getImageData(x, y, width, height);
            for (let i = 0; i < data.data.length; i += 4) {
                const brightness = (0.14 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.1 * data.data[i + 2]);
                data.data[i] = brightness;
                data.data[i + 1] = brightness;
                data.data[i + 2] = brightness;
            };
            ctx.putImageData(data, x, y);
            return ctx;
        };

        let base = await loadImage(path.join(__dirname, '../../../assets/images/respectsBase.png'));
        let avatar = await loadImage(u.displayAvatarURL({ format: 'png' }))

        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d')

        ctx.rotate(-12.5 * Math.PI / 180);
        ctx.drawImage(avatar, 243, 40, 92, 120);
        await greyscale(ctx, 243, 0, 192, 220)
        ctx.rotate(12.5 * Math.PI / 180);
        ctx.drawImage(base, 0, 0);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'Respect.png');

        await message.channel.send({ files: [attachment] });

    }
}
module.exports = Respect;