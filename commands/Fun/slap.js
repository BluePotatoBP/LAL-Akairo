const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const nekoClient = require('nekos.life');
const { delMsg } = require('../../assets/tools/util');
const { sfw } = new nekoClient();

class Slap extends Command {
	constructor() {
		super('slap', {
			aliases: ['slap'],
			category: 'Fun',
			ownerOnly: false,
			ownerOnly: false,
			cooldown: 5000,
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
		await delMsg(message);

		let image = await sfw.slap();

		const embed = new Discord.MessageEmbed();
		embed.setImage(image.url);

		if (m) {
			embed.setColor(crimson);
			embed.setFooter(`👏 ${message.author.username} ${lang(message, 'command.slap.embed.slapped')} ${m.user.username} 👏`);

			message.channel.send({ embeds: [embed] });
		} else {
			embed.setColor(crimson);
			embed.setFooter(`👏 ${message.author.username} ${lang(message, 'command.slap.embed.slappedThemselves')} 👏`);

			message.channel.send({ embeds: [embed] });
		}
	}
}
module.exports = Slap;
