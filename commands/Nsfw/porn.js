const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const DabiImages = require('../../assets/tools/dabi-images/index');
const { nsfw } = new DabiImages.Client();

class Porn extends Command {
    constructor() {
        super('||porn||',
            {
                aliases: ['porn', 'randomporn'],
                category: 'Nsfw',
                ownerOnly: false,
                nsfw: true,
                cooldown: 10000,
                description: {
                    content: 'Get a random nsfw image',
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
            let image = await nsfw.real.random()

            try {
                embed.setImage(image.url)
            } catch (e) {
                embed.setDescription("Something went wrong, please try again later.")
            }

            if (m) {

                embed.setColor(crimson)
                embed.setFooter(`👀 ${message.author.tag} sent you something 👀`)

                m.send(embed)

            } else {

                embed.setColor(crimson)
                embed.setFooter(`👀 ${message.author.tag} enjoy whatever you got 👀`)

                message.channel.send(embed)
            }
        }
    }
}
module.exports = Porn;