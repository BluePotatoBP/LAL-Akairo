const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const nekoClient = require('nekos.life');
const { nsfw } = new nekoClient();

class Neko extends Command {
    constructor() {
        super('||neko||',
            {
                aliases: ['neko'],
                category: 'Nsfw',
                ownerOnly: false,
                nsfw: true,
                cooldown: 10000,
                description: {
                    content: 'Get a random hentai image',
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

        if (!message.channel.nsfw) {
            message.channel.send("Please set the channel to \`NSFW\` mode.")
        } else {

            const embed = new Discord.MessageEmbed()
            let image = await nsfw.nekoGif()

            try {
                embed.setImage(image.url)
            } catch (e) {
                embed.setDescription("Something went wrong, please try again later.")
            }

            if (m) {

                embed.setColor(crimson)
                embed.setFooter(`😯v ${message.author.tag} sent you a neko gif 😯`)

                m.send(embed)

            } else {

                embed.setColor(crimson)
                embed.setFooter(`😯 ${message.author.tag} here: have a neko gif 😯`)

                message.channel.send(embed)
            }
        }
    }
}
module.exports = Neko;