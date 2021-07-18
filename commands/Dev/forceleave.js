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
					type: 'text',
					default: (message) => {
						message.guild.id
					}
				}
			]
		});
	}

	async exec(message, { id }) {
		message.delete().catch((e) => {});
		let guild = this.client.guilds.cache.get(id);

		message.guild.leave()
		.then(console.log(`${debug('[DEBUG]')} ${chalk.magenta(this.client.user.username)} left the guild "${chalk.greenBright(guild.name)}" [${chalk.yellow(guild.id)}] (Forced)`));
	}
}
module.exports = ForceLeave;
