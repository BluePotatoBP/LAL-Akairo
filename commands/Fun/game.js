const { Command, Flag } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Game extends Command {
    constructor() {
        super('game', {
            aliases: ['game'],
            category: 'Fun',
            ownerOnly: false,
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
            cooldown: 10000,
            description: {
                content: 'later',
                usage: '<connect4>|<hangman>|<snake>',
                syntax: '<> - necessary'
            },
            * args(message) {
                let action = yield {
                    type: [
                        ['connect4'],
                        ['hangman'],
                        ['snake']
                    ],
                    default: 'list',
                    prompt: {
                        start: (message) => lang(message, 'command.game.desc.content'),
                        retry: (message) => lang(message, 'command.game.desc.content'),
                        optional: false
                    }
                };

                // Start new giveaway
                if (action == 'connect4') return Flag.continue('connect4');

                // Edit ongoing giveaway
                if (action == 'hangman') return Flag.continue('hangman');

                // Reroll ongoing giveaway
                if (action == 'snake') return Flag.continue('snake');

                // Default msg
                //if (action == 'list') return { action };
            }
        });
    }

    async exec(message /*, { action }*/ ) {
        message.delete({ timeout: 60000 }).catch((e) => {});
    }
}
module.exports = Game;