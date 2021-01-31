const { Command } = require('discord-akairo');
const HangmanGame = require('../../../assets/tools/hangmangame');

class Hangman extends Command {
    constructor() {
        super('hangman', {
            aliases: ['hangman'],
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
        const hangman = new HangmanGame(client);

        hangman.newGame(message);
    }
}
module.exports = Hangman;