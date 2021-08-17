const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Ram extends Command {
    constructor() {
        super('ram', {
            aliases: ['ram'],
            ownerOnly: true,
            category: '',
            description: {
                content: '',
                usage: '',
                syntax: ''
            },
        });
    }

    async exec(message) {
        message.delete().catch((e) => {});

        try {
            let usageMb = process.memoryUsage().heapUsed / 1024 / 1024;
            let usage = usageMb.toFixed(2);

            let rembed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Im currently chewing on \`${usage}mb\` of RAM <:sadpepe:774640053020000266>`)
                .setColor(crimson)
                .setTimestamp();
            message.channel.send({embeds: [rembed]});
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = Ram;