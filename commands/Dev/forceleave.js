const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class ForceLeave extends Command {
    constructor() {
        super('forceleave',
            {
                aliases: ['forceleave'],
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
                        match: 'text',
                        type: 'int',
                    },
                ]
            });
    }

    async exec(message, { id }) {
        message.delete().catch(e => { });

        if (!id) {
            id = message.guild.id;
        } 
        let guild = client.guilds.cache.get(id);

        guild.leave().then(g => console.log(`Left the guild "${g}"`))

    }
}
module.exports = ForceLeave;