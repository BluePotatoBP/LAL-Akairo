const { Command } = require('discord-akairo');
const chalk = require('chalk');

class Restart extends Command {
	constructor() {
		super('restart', {
			aliases: ['restart'],
			category: '',
			ownerOnly: true,
			description: {
				content: '',
				usage: '',
				syntax: ''
			}
		});
	}

	async exec(message) {
		message.delete({ timeout: 10000 }).catch((e) => { });

		try {
			await message.react('✅');
			console.log(
				`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] in '${message.guild.name}'[${message
					.guild.id}] used: \n${chalk.gray(`${process.env.PREFIX}restart`)}`
			);

			process.exit();
		} catch (error) {
			console.log(error);
			message.channel.send({content: 'No stonks this time... how did you manage this? <:sadpepe:774640053020000266>'});
		}
	}
}
module.exports = Restart;
