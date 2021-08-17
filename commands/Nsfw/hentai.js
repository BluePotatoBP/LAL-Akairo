const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const nekoClient = require('nekos.life');
const { delMsg } = require('../../assets/tools/util');
const { nsfw } = new nekoClient();

class Hentai extends Command {
	constructor() {
		super('hentai', {
			aliases: ['hentai'],
			category: 'Nsfw',
			ownerOnly: false,
			nsfw: true,
			cooldown: 5000,
			ratelimit: 2,
			description: {
				content: 'Get a random hentai image',
				usage: '[user]',
				syntax: '[] - optional'
			}
		});
	}

	async exec(message) {
		await delMsg(message);

		try {
			if (!message.channel.nsfw) return;

			let image = await nsfw.hentai();

			await message.channel.send({ attachment: image });
		} catch (error) {
			await message.channel.send({ content: 'Something went wrong, please `re-type` the command.' })
		}

	}
}
module.exports = Hentai;
