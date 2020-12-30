const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const nekoClient = require('nekos.life');
const { nsfw } = new nekoClient();

class Neko extends Command {
	constructor() {
		super('neko', {
			aliases: [ 'neko' ],
			category: 'Nsfw',
			ownerOnly: false,
			nsfw: true,
			cooldown: 10000,
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
		message.delete().catch((e) => {});

		if (!message.channel.nsfw) {
			message.channel.send(lang(message, 'command.nsfw.warning'));
		} else {
			const embed = new Discord.MessageEmbed();
			let image = await nsfw.nekoGif();

			try {
				embed.setImage(image.url);
			} catch (e) {
				embed.setDescription('Something went wrong, please try again later.');
			}

			if (m) {
				embed.setColor(crimson);
				embed.setFooter(`😯v ${message.author.tag} ${lang(message, 'command.neko.embed.footer.one')} 😯`);

				m.send(embed);
			} else {
				embed.setColor(crimson);
				embed.setFooter(`😯 ${message.author.tag} ${lang(message, 'command.neko.embed.footer.two')} 😯`);

				message.channel.send(embed);
			}
		}
	}
}
module.exports = Neko;
