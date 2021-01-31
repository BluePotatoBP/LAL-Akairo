const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const hexRgb = require('hex-rgb');

class Color extends Command {
	constructor() {
		super('color', {
			aliases: [ 'color', 'hex', 'whatcolor', 'c' ],
			category: 'Util',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'Get a preview of a #hex color code',
				usage: '<color>',
				syntax: '<> - necessary'
			},

			args: [
				{
					id: 'c',
					match: 'text',
					type: 'string',
					prompt: {
						start: (message) => lang(message, 'command.color.prompt.start'),
						retry: (message) => lang(message, 'command.color.prompt.retry')
					}
				}
			]
		});
	}

	async exec(message, { c }) {
		message.delete({ timeout: 60000 }).catch((e) => {});

		// Using a trycatch just because user input can be invalid sometimes (wrong hex code)
		try {
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
			ctx.fillStyle = c;
			ctx.fillRect(0, 0, base.width, base.height);

			// Buffering the finished image to the built in discord attachment manager (Major pain in the ass to figure out)
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'color.png');

			// Output embed
			let embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.addField(
					lang(message, 'command.color.embed.field1'),
					`${c} [[?]](https://gist.github.com/BluePotatoBP/446f180644b331d9d71cfe24575f5adc 'If the embed and image colors dont match, click here.')`
				)
				.addField(lang(message, 'command.color.embed.field2'), `${CRed}, ${CGreen}, ${CBlue}`)
				.setThumbnail('attachment://color.png')
				.attachFiles(attachment)
				.setColor(c)
				.setTimestamp();

			// Ship it
			await message.util.send(embed);
		} catch (error) {
			// Make an "error" embed (only used when a wrong hex is given) and send it
			const errorEmbed = new Discord.MessageEmbed()
				.setDescription(lang(message, 'command.color.bigError'))
				.setColor(crimson);
			await message.util.send(errorEmbed);
		}
	}
}
module.exports = Color;
