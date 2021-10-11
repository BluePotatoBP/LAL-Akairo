const { Command } = require('discord-akairo');
const DabiImages = require('../../assets/tools/dabi-images/index');
const { delMsg } = require('../../assets/tools/util');
const { nsfw } = new DabiImages.Client();

class Pussy extends Command {
	constructor() {
		super('pussy', {
			aliases: ['pussy'],
			category: 'Nsfw',
			ownerOnly: false,
			nsfw: true,
			cooldown: 5000,
			ratelimit: 2,
			description: {
				content: 'Get a random pussy image',
				usage: '',
				syntax: ''
			}
		});
	}

	async exec(message) {
		await delMsg(message);

		try {
			let image = await nsfw.real.pussy();

			await message.channel.send({ content: image.url });

		} catch (error) {
			await message.channel.send({ content: lang(message, "nsfw.couldntFetch.content") });
		}
	}
}
module.exports = Pussy;
