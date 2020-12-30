const chalk = require('chalk');
const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class ForceLeave extends Command {
	constructor() {
		super('forceleave', {
			aliases: [ 'forceleave' ],
			category: '',
			ownerOnly: true,
			description: {
				content: '',
				usage: '',
				syntax: ''
			},
			args: [
				{
					id: 'id',
					match: 'text',
					type: 'int'
				}
			]
		});
	}

	async exec(message, { id }) {
		message.delete().catch((e) => {});
		let guild = client.guilds.cache.get(id);

		if (!id) {
			id = message.guild.id;
		}
		guild
			.leave()
			.then((g) =>
				console.log(
					`${debug('[DEBUG]')} ${chalk.magenta(this.client.user.username)} left the guild "${chalk.yellow(
						g
					)}"`
				)
			);
	}
}
module.exports = ForceLeave;
