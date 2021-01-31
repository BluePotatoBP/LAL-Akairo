const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, } = require('canvas');
const { contrast } = require('../../../assets/tools/canvas');
const path = require('path');

class Trash extends Command {
    constructor() {
        super('trash', {
            aliases: ['trash'],
            category: 'Fun',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'later',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'u',
                type: 'user',
                default: (message) => message.author
            }, ]
        });
    }

    async exec(message, { u }) {
        message.delete().catch(e => {});

        let base = await loadImage(path.join(__dirname, '../../../assets/images/trashBase.png'));
        let avatar = await loadImage(u.displayAvatarURL({ format: 'png' }))

        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d')

        ctx.drawImage(avatar, 120, 135, 195, 195);
        contrast(ctx, 120, 135, 195, 195)
        ctx.drawImage(base, 0, 0);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'Trash.png');

        await message.channel.send(attachment);

    }
}
module.exports = Trash;