const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Color extends Command {
    constructor() {
        super('color',
            {
                aliases: ['color', 'hex', 'whatcolor', 'c'],
                category: 'Util',
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'Get a preview of a #hex color code',
                    usage: '<color>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'text',
                        match: 'text',
                        type: 'string',
                        prompt: {
                            start: message => lang(message, "command.color.prompt.start"),
                            retry: message => lang(message, "command.color.prompt.retry"),
                        }
                    },
                ]
            });
    }

    async exec(message, args) {
        message.delete().catch(e => { });
        try {
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription(`${lang(message, "command.color.embed.desc")} <:smallbrain:622860598652174356>`)
                .setColor(args.text)
                .setFooter(`${lang(message, "command.color.embed.footer")} ${args.text}`)
                .setTimestamp()

            message.channel.send(embed)
        } catch (error) {
            console.log(error)
            message.channel.send("Bip boop bap, give me a color and not that random scrap <:sadpepe:613706060334759965> \nPlease \`re-type\` the command.")
        }
    }
}
module.exports = Color;