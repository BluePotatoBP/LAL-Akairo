const { Command } = require('discord-akairo');
const ConnectFour = require('../../../assets/tools/connect4game');

class Connect4 extends Command {
    constructor() {
        super('connect4', {
            aliases: ['connect4', 'connectfour'],
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
            category: '',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: '',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        message.delete().catch((e) => {});
        const connect4 = new ConnectFour(client);

        connect4.newGame(message);
    }
}
module.exports = Connect4;