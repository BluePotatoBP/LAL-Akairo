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
                            start: 'Please provide me with a **#hex** color code. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please provide a valid color. \nYou can either send it now or you can \`re-type\` the command.',
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
                .setDescription(`Preview of your **#hex** color is on the 👈 left. \nIf the bar is \`Gray\`, that means you entered \nan invalid **#hex** color code. <:smallbrain:622860598652174356>`)
                .setColor(args.text)
                .setFooter(`You entered: ${args.text}`)
                .setTimestamp()

            message.channel.send(embed)
        } catch (error) {
            console.log(error)
            message.channel.send("Bip boop boop bap, give me a color and not that random mess <:sadpepe:613706060334759965> \nPlease \`re-type\` the command.")
        }
    }
}
module.exports = Color;