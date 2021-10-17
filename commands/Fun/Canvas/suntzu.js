const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { softWrap, cutTo, delMsg } = require('../../../assets/tools/util');
const path = require('path');

class Suntzu extends Command {
    constructor() {
        super('suntzu', {
            aliases: ['suntzu'],
            clientPermissions: ['ATTACH_FILES'],
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
                id: 'input',
                match: 'rest',
                default: "It is better to poop in the shower then to shower in the poop."
            },]
        });
    }

    async exec(message, { input }) {
        await delMsg(message);

        registerFont(path.join(__dirname, '../../../assets/fonts/whitney-medium.otf'), { family: 'Whitney' });

        const base = await loadImage(path.join(__dirname, '../../../assets/images/sunTzuBase.png'));
        const canvas = createCanvas(base.width, base.height);
        const ctx = canvas.getContext('2d')

        ctx.drawImage(base, 0, 0);

        ctx.fillStyle = '#ffffff';
        ctx.font = '80px Whitney';
        ctx.fillText(cutTo(softWrap(input, 18), 0, 90, true), 685, 150);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sunTzu.png');

        await message.channel.send({ files: [attachment] });

    }
}
module.exports = Suntzu;