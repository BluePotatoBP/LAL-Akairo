const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const DabiImages = require('../../assets/tools/dabi-images/index');
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
			},
			args: [
				{
					id: 'm',
					type: 'member'
				}
			]
		});
	}

	async exec(message, { m }) {
		message.delete().catch((e) => { });

		try {
			if (!message.channel.nsfw) return;

			const embed = new Discord.MessageEmbed();
			let image = await nsfw.real.boobs();

			try {
				embed.setImage(image.url);
			} catch (e) {
				embed.setDescription('Something went wrong, please try again later.');
			}

			if (m) {
				embed.setColor(crimson);
				embed.setFooter(
					`😯 ${message.author.tag} ${lang(message, 'command.||boobs||.embed.footer.one')} 😯`
				);

				await m.send(embed);
			} else {
				embed.setColor(crimson);
				embed.setFooter(
					`😯 ${message.author.tag} ${lang(message, 'command.||boobs||.embed.footer.two')} 😯`
				);

				await message.channel.send(embed);
			}

		} catch (error) {
			message.channel.send('Something went wrong, please `re-type` the command.');
		}
	}
}
module.exports = Boobs;
