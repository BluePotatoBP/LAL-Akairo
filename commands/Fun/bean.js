const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Bean extends Command {
	constructor() {
		super('bean', {
			aliases: ['bean'],
			category: 'Fun',
			cooldown: 5000,
			ratelimit: 2,
			ownerOnly: false,
			description: {
				content: 'Uh oh, you just got beaned!!!',
				usage: '[user]',
				syntax: '[] - optional'
			},
			args: [
				{
					id: 'u',
					type: 'user',
					prompt: {
						optional: true,
						start: (message) => lang(message, 'command.bean.prompt.start'),
						retry: (message) => lang(message, 'command.bean.prompt.retry')
					}
				}
			]
		});
	}

	async exec(message, { u }) {
		await delMsg(message);

		if (!u) {
			let embed = new Discord.MessageEmbed()
				.setImage('https://i.ytimg.com/vi/GW704pnVBjY/maxresdefault.jpg?size=128')
				.setColor('#32C84A');
			message.channel.send({ embeds: [embed], content: `**Idot ${message.author} was beaned, RIP 😢**` }).catch((e) => {
				console.log(e);
			});
		} else {
			let embed = new Discord.MessageEmbed()
				.setImage('https://i.ytimg.com/vi/GW704pnVBjY/maxresdefault.jpg?size=128')
				.setColor('#32C84A');
			message.channel.send({ embeds: [embed], content: `**Idot ${u} was beaned, RIP 😢**` }).catch((e) => {
				console.log(e);
			});
		}
	}
}
module.exports = Bean;
