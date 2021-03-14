const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { softWrap, cutTo } = require('../../../assets/tools/util');
const path = require('path');

class Suntzu extends Command {
    constructor() {
        super('suntzu', {
            aliases: ['suntzu'],
            category: 'Fun',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'later',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'input',
                match: 'rest',
                default: "It is better to cum in the shower then to shower in the cum."
            }, ]
        });
    }

    async exec(message, { input }) {
        message.delete().catch(e => {});

        registerFont(path.join(__dirname, '../../../assets/fonts/whitney-medium.otf'), { family: 'Whitney' });

        const base = await loadImage(path.join(__dirname, '../../../assets/images/sunTzuBase.png'));
        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d')

        ctx.drawImage(base, 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.font = '80px Whitney';
        ctx.fillText(cutTo(softWrap(input, 18), 0, 90, true), 685, 150);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sunTzu.png');

        await message.channel.send(attachment);

    }
}
module.exports = Suntzu;