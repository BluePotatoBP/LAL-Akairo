const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const DabiImages = require('../../assets/tools/dabi-images/index');
const { nsfw } = new DabiImages.Client();

class Panties extends Command {
    constructor() {
        super('||panties||',
            {
                aliases: ['panties'],
                category: 'Nsfw',
                ownerOnly: false,
                nsfw: true,
                cooldown: 10000,
                description: {
                    content: 'Get a random pantie image',
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
            let image = await nsfw.real.thighs()

            try {
                embed.setImage(image.url)
            } catch (e) {
                embed.setDescription("Something went wrong, please try again later.")
            }

            if (m) {

                embed.setColor(crimson)
                embed.setFooter(`👙 ${message.author.tag} sent you some panties 👙`)

                m.send(embed)

            } else {

                embed.setColor(crimson)
                embed.setFooter(`👙 ${message.author.tag} have some panties 👙`)

                message.channel.send(embed)
            }
        }
    }
}
module.exports = Panties;