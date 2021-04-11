const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const nekoClient = require('nekos.life');
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

		if (!message.channel.nsfw) {
			message.channel.send(lang(message, 'command.nsfw.warning'));
		} else {
			const embed = new Discord.MessageEmbed();
			let image = await nsfw.hentai();

			try {
				embed.setImage(image.url);
			} catch (e) {
				embed.setDescription('Something went wrong, please try again later.');
			}

			if (m) {
				embed.setColor(crimson);
				embed.setFooter(`😯v ${message.author.tag} ${lang(message, 'command.hentai.embed.footer.one')} 😯`);

				m.send(embed);
			} else {
				embed.setColor(crimson);
				embed.setFooter(`😯 ${message.author.tag} ${lang(message, 'command.hentai.embed.footer.two')} 😯`);

				message.channel.send(embed);
			}
		}
	}
}
module.exports = Hentai;
