const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const DabiImages = require('../../assets/tools/dabi-images/index');
const { nsfw } = new DabiImages.Client();

class Feet extends Command {
    constructor() {
        super('feet',
            {
                aliases: ['feet'],
                category: 'Nsfw',
                ownerOnly: false,
                nsfw: true,
                cooldown: 10000,
                description: {
                    content: 'Get random feet images',
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

        try {
            if (!message.channel.nsfw) {
                message.channel.send(lang(message, "command.nsfw.warning"))
            } else {
                const embed = new Discord.MessageEmbed()
                let image = await nsfw.real.pussy()

                try {
                    embed.setImage(image.url)
                } catch (e) {
                    embed.setDescription("Something went wrong, please try again later.")
                }

                if (m) {

                    embed.setColor(crimson)
                    embed.setFooter(`😯 ${message.author.tag} ${lang(message, "command.feet.embed.footer.one")} 😯`)

                    await m.send(embed)

                } else {

                    embed.setColor(crimson)
                    embed.setFooter(`😯 ${message.author.tag} ${lang(message, "command.feet.embed.footer.two")} 😯`)

                    await message.channel.send(embed)
                }
            }
        } catch (error) {
            message.channel.send('Something went wrong, please \`re-try\` the command.')
        }
    }
}
module.exports = Feet;