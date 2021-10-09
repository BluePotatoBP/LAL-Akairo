const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const DabiImages = require('../../assets/tools/dabi-images/index');
const { delMsg } = require('../../assets/tools/util');
const { nsfw } = new DabiImages.Client();

class Feet extends Command {
	constructor() {
		super('feet', {
			aliases: ['feet'],
			category: 'Nsfw',
			ownerOnly: false,
			nsfw: true,
			cooldown: 5000,
			ratelimit: 2,
			description: {
				content: 'Get random feet images',
				usage: '',
				syntax: ''
			}
		});
	}

	async exec(message) {
		await delMsg(message);

		try {
			let image = await nsfw.real.feet();

			await message.channel.send({ attachment: image });

		} catch (error) {
			await message.channel.send({ content: lang(message, "nsfw.couldntFetch.content")});
		}
	}
}
module.exports = Feet;
