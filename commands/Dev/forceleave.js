const chalk = require('chalk');
const { Command } = require('discord-akairo');
const { delMsg } = require('../../assets/tools/util');

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
					id: 'argsguild',
					type: 'text',
					default: (message) => {
						message.guild
					}
				}
			]
		});
	}

	async exec(message, { argsguild }) {
		await delMsg(message, 10000);

		await argsguild.leave()
		.then(console.log(`${debug('[DEBUG]')} ${chalk.magenta(this.client.user.username)} left the guild "${chalk.greenBright(argsguild.name)}" [${chalk.yellow(argsguild.id)}] (Forced)`));
	}
}
module.exports = ForceLeave;
