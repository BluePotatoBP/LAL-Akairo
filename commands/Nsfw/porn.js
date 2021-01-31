const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const DabiImages = require('../../assets/tools/dabi-images/index');
const { nsfw } = new DabiImages.Client();

class Porn extends Command {
    constructor() {
        super('randomporn', {
            aliases: ['porn', 'randomp', 'randomporn'],
            category: 'Nsfw',
            ownerOnly: false,
            nsfw: true,
            cooldown: 10000,
            description: {
                content: 'Get a random nsfw image',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'm',
                type: 'member'
            }]
        });
    }

    async exec(message, { m }) {
        message.delete().catch((e) => {});

        if (!message.channel.nsfw) {
            message.channel.send(lang(message, 'command.nsfw.warning'));
        } else {
            const embed = new Discord.MessageEmbed();
            let image = await nsfw.real.random();

            try {
                embed.setImage(image.url);
            } catch (e) {
                embed.setDescription('Something went wrong, please try again later.');
            }

            if (m) {
                embed.setColor(crimson);
                embed.setFooter(`👀 ${message.author.tag} ${lang(message, 'command.randomporn.embed.footer.one')} 👀`);

                m.send(embed);
            } else {
                embed.setColor(crimson);
                embed.setFooter(`👀 ${message.author.tag} ${lang(message, 'command.randomporn.embed.footer.two')} 👀`);

                message.channel.send(embed);
            }
        }
    }
}
module.exports = Porn;