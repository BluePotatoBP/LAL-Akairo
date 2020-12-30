const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const nekoClient = require('nekos.life');
const { sfw } = new nekoClient();

class Slap extends Command {
	constructor() {
		super('slap', {
			aliases: [ 'slap' ],
			category: 'Fun',
			ownerOnly: false,
			description: {
				content: 'Slap someone who deserves it',
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

		let image = await sfw.slap();

		const embed = new Discord.MessageEmbed();
		embed.setImage(image.url);

		if (m) {
			embed.setColor(crimson);
			embed.setFooter(
				`👏 ${message.author.username} ${lang(message, 'command.slap.embed.slapped')} ${m.user.username} 👏`
			);

			message.channel.send(embed);
		} else {
			embed.setColor(crimson);
			embed.setFooter(
				`👏 ${message.author.username} ${lang(message, 'command.slap.embed.slappedThemselves')} 👏`
			);

			message.channel.send(embed);
		}
	}
}
module.exports = Slap;
