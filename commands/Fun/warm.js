const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { orange } = require('../../assets/colors.json');
const { cutTo, delMsg } = require('../../assets/tools/util')

class Warm extends Command {
	constructor() {
		super('warm', {
			aliases: ['warm'],
			category: 'Fun',
			ownerOnly: false,
			cooldown: 5000,
			ratelimit: 2,
			description: {
				content: 'Warm any user in need of hugs',
				usage: '[user]',
				syntax: '[] - optional'
			},
			args: [
				{
					id: 'u',
					type: 'user',
					prompt: {
						optional: true,
						start: (message) => lang(message, 'command.warm.prompt.start'),
						retry: (message) => lang(message, 'command.warm.prompt.retry')
					}
				},
				{
					id: 'r',
					match: 'rest',
					type: 'string'
				}
			]
		});
	}

	async exec(message, { u, r }) {
		await delMsg(message);

		if (!u) {
			const embed = new Discord.MessageEmbed()
				.setDescription(`**${message.author} ${lang(message, 'command.warm.embed.desc')} ❤**`)
				.setImage('https://i.imgur.com/z0cy78Y.jpg')
				.setColor(orange);

			message.channel.send({ embeds: [embed] }).catch((e) => console.log(e));
		} else {
			try {
				const embed2 = new Discord.MessageEmbed()
					.setDescription(`**${u} ${lang(message, 'command.warm.embed.desc')} ❤**`)
					.setImage('https://i.imgur.com/z0cy78Y.jpg')
					.setColor(orange);

				if (r) {
					embed2.setFooter(`${lang(message, 'command.warm.embed.footer.reason')} "${cutTo(r, 0, 20, true)}" - ${lang(message, 'command.warm.embed.footer.funny')}`);
				}
				message.channel.send({ embeds: [embed2] }).catch((e) => console.log(e));
			} catch (error) {
				console.log(error);
				message.channel.send({ content: `I couldn't warm that user for some reason 😢` });
			}
		}
	}
}
module.exports = Warm;
