const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

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
		message.delete().catch((e) => { });

		if (!u) {
			let embed = new Discord.MessageEmbed()
				.setImage('https://i.ytimg.com/vi/GW704pnVBjY/maxresdefault.jpg?size=128')
				.setColor('#32C84A');
			message.channel.send(`**Idot ${message.author} was beaned, RIP 😢**`, embed).catch((e) => {
				console.log(e);
			});
		} else {
			let embed = new Discord.MessageEmbed()
				.setImage('https://i.ytimg.com/vi/GW704pnVBjY/maxresdefault.jpg?size=128')
				.setColor('#32C84A');
			message.channel.send(`**Idot ${u} was beaned, RIP 😢**`, embed).catch((e) => {
				console.log(e);
			});
		}
	} 
}
module.exports = Bean;
