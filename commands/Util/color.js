const { Command } = require('discord-akairo');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const hexRgb = require('hex-rgb');
const { delMsg } = require('../../assets/tools/util');

class Color extends Command {
    constructor() {
        super('color', {
            aliases: ['color', 'hex', 'whatcolor'],
            clientPermissions: ['ATTACH_FILES'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Get a preview of a #hex color code',
                usage: '<color>',
                syntax: '<> - necessary'
            },

            args: [{
                id: 'c',
                type: 'color',
                prompt: {
                    start: (message) => lang(message, 'command.color.prompt.start'),
                    retry: (message) => lang(message, 'command.color.prompt.retry'),
                    optional: false
                }
            }]
        });
    }

    async exec(message, { c }) {
        delMsg(message, 30000)
        // Using a trycatch just because user input can be invalid sometimes (wrong hex code)
        try {
            // Converting the input (int) to a hexadecimal string (hex)
            const intToHex = (int) => {
                let hex = Number(int).toString(16);
                if (hex.length < 2) hex = "0" + hex;
                return hex;
            };

            c = intToHex(c);
            // Getting the different color values from input
            let CRed = hexRgb(c).red;
            let CGreen = hexRgb(c).green;
            let CBlue = hexRgb(c).blue;

            // Definding base, canvas and ctx; all necessary for the canvas image
            const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'images', 'ferrisWheel.png'));
            const canvas = createCanvas(base.width, base.height);
            const ctx = canvas.getContext('2d');

            // Instructions for canvas, "draw the image", "set global composite operation to source-in",
            // "fill with input c", "create a rectangle and mask it to the image"
            ctx.drawImage(base, 0, 0);
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = c.includes("#") ? c : `#${c}`;
            ctx.fillRect(0, 0, base.width, base.height);

            // Buffering the finished image to the built in discord attachment manager (Major pain in the ass to figure out)
            const attachment = new MessageAttachment(canvas.toBuffer(), 'color.png');

            // Output embed
            let embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .addField(lang(message, 'command.color.embed.field1'), `${c.includes("#") ? c : `#${c}`} [[?]](https://gist.github.com/BluePotatoBP/446f180644b331d9d71cfe24575f5adc 'If the embed and image colors dont match, click here.')`)
                .addField(lang(message, 'command.color.embed.field2'), `${CRed}, ${CGreen}, ${CBlue}`)
                .setThumbnail('attachment://color.png')
                .setColor(c.includes("#") ? c : `#${c}`)
                .setTimestamp();

            // Ship it
            await message.util.send({ embeds: [embed], files: [attachment] });
        } catch (error) {
            // Make an "error" embed (only used when a wrong hex is given) and send it
            const errorEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`<a:cancel:773201205056503849> ${lang(message, 'command.color.bigError')}`)
                .setColor(crimson);

            await message.util.send({ embeds: [errorEmbed] });
        }
    }
}
module.exports = Color;