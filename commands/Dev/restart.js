const { Command } = require('discord-akairo');
const chalk = require('chalk');
const { delMsg } = require('../../assets/tools/util');

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
		// Try reacting with a checkmark
		await message.react('✅').catch(() => {});
		// Console log some debug info and then exit the process
		try {
			console.log(`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] in '${message.guild.name}'[${message.guild.id}] used: \n${chalk.gray(`${process.env.PREFIX}restart`)}`);
			process.exit();
		} catch (error) {
			// If these 2 lines somehow error (knowing my luck they will...) tell the user it shit the bed
			console.log(error);
			message.channel.send({content: 'It appears that something went wrong 🤷‍♀️'});
		}
	}
}
module.exports = Restart;
