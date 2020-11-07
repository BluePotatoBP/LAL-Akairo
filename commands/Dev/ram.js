const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Ram extends Command {
    constructor() {
        super('ram',
            {
                aliases: ['ram'],
                ownerOnly: true,
                description: {
                    content: 'Shows the RAM usage'
                }
            });
    }

    async exec(message) {
        message.delete().catch(e => { });

        try {
            let usageMb = process.memoryUsage().heapUsed / 1024 / 1024;
            let usage = usageMb.toFixed(2);

            let rembed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                .setDescription(`Im currently chewing on \`${usage}mb\` of RAM <:sadpepe:613706060334759965>`)
                .setColor(crimson)
                .setTimestamp()
            message.channel.send(rembed)
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = Ram;