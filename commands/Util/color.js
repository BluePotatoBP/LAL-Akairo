const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
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
		message.delete({ timeout: 30000 }).catch((e) => {});
		let promptMsg;

		try {
			let CRed = hexRgb(c).red;
			let CGreen = hexRgb(c).red;
			let CBlue = hexRgb(c).red;
			let CAlpha = hexRgb(c).red;

			let embed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
				.addField(lang(message, 'command.color.embed.field1'), c)
				.addField(lang(message, 'command.color.embed.field2'), `${CRed}, ${CGreen}, ${CBlue} - ${CAlpha}`)
				.setColor(c)
				.setTimestamp();

			promptMsg = await message.util.send(embed);
		} catch (error) {
			const errorEmbed = new Discord.MessageEmbed()
				.setDescription(lang(message, 'command.color.bigError'))
				.setColor(crimson);
			promptMsg = await message.util.send(errorEmbed);
		}
	}
}
module.exports = Color;
