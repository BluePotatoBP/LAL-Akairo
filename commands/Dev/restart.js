const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Restart extends Command {
    constructor() {
        super('restart',
            {
                aliases: ['restart'],
                ownerOnly: true,
                description: {
                    content: 'Restarts the bot instance'
                },
            });
    }

    async exec(message) {
        try {
                await message.react("✅")
                await process.exit();
        } catch (error) {
            console.log(error)
            message.channel.send("No stonks this time... how did you manage this? <:sadpepe:613706060334759965>")
        }
    }
}
module.exports = Restart;