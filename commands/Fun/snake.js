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
				usage: '',
				syntax: ''
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
