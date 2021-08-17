const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const DabiImages = require('../../assets/tools/dabi-images/index');
const { delMsg } = require('../../assets/tools/util');
const { nsfw } = new DabiImages.Client();

class Boobs extends Command {
	constructor() {
		super('boobs', {
			aliases: ['boobs', 'boobies'],
			category: 'Nsfw',
			ownerOnly: false,
			nsfw: true,
			cooldown: 5000,
			ratelimit: 2,
			description: {
				content: 'Get a random boobies image',
				usage: '[user]',
				syntax: '[] - optional'
			}
		});
	}

	async exec(message) {
		await delMsg(message);

		try {
			let image = await nsfw.real.boobs();

			await message.channel.send({ attachment: image });

		} catch (error) {
			await message.channel.send('Something went wrong, please `re-type` the command.');
		}
	}
}
module.exports = Boobs;
