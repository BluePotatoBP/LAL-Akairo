const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const nekoClient = require('nekos.life');
const { sfw } = new nekoClient();

class Hug extends Command {
    constructor() {
        super('hug',
            {
                aliases: ['hug'],
                category: 'Fun',
                ownerOnly: false,
                description: {
                    content: 'Hug someone who needs it',
                    usage: '[user]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'm',
                        type: 'member'
                    }
                ]
            });
    }

    async exec(message, { m }) {
        message.delete().catch(e => { });

        let image = await sfw.hug()

        const embed = new Discord.MessageEmbed()
        embed.setImage(image.url)

        if (m) {
            
            embed.setColor(crimson)
            embed.setFooter(`❤️ ${message.author.username} hugged ${m.user.username} ❤️`)

            message.channel.send(embed)

        } else {

            embed.setColor(crimson)
            embed.setFooter(`❤️ ${message.author.username} hugged themself ❤️`)

            message.channel.send(embed)
        }
    }
}
module.exports = Hug;