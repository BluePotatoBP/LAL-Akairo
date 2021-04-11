const { Command } = require('discord-akairo');
const Snakes = require('../../../assets/tools/snakegame');

class Snake extends Command {
    constructor() {
        super('snake', {
            aliases: ['snake'],
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
            category: '',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: '',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        message.delete().catch((e) => { });
        const snake = new Snakes(client);

        snake.newGame(message);
    }
}
module.exports = Snake;