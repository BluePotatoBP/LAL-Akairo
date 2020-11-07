const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Restart extends Command {
    constructor() {
        super('restart',
            {
                aliases: ['restart'],
                category: '',
                ownerOnly: true,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                }
            });
    }

    async exec(message) {
        message.delete().catch(e => { });

        try {
            await message.author.react("✅")
            process.exit();
        } catch (error) {
            console.log(error)
            message.channel.send("No stonks this time... how did you manage this? <:sadpepe:774640053020000266>")
        }
    }
}
module.exports = Restart;