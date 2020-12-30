const { Command } = require('discord-akairo');
const Snakes = require('../../assets/tools/snakegame');

class Snake extends Command {
	constructor() {
		super('snake', {
			aliases: [ 'snake' ],
			category: '',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'later',
				usage: 'later',
				syntax: 'later'
			}
		});
	}

	async exec(message) {
		message.delete().catch((e) => {});
		const snake = new Snakes(client);

		snake.newGame(message);
	}
}
module.exports = Snake;
