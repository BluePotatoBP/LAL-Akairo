const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, } = require('canvas');
const { contrast } = require('../../../assets/tools/canvas');
const path = require('path');

class Bobross extends Command {
    constructor() {
        super('bobross', {
            aliases: ['bobross'],
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
        message.delete().catch(e => { });

        let base = await loadImage(path.join(__dirname, '../../../assets/images/bobrossBase.png'));
        let avatar = await loadImage(u.displayAvatarURL({ format: 'png' }))

        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d')

        ctx.drawImage(avatar, 820, 140, 425, 625);
        contrast(ctx, 820, 140, 425, 810)
        ctx.drawImage(base, 0, 0);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'BobRoss.png');

        await message.channel.send(attachment);

    }
}
module.exports = Bobross;