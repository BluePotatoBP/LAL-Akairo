const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const wiki = require('wikipedia-tldr');
const { white, lightRed } = require('../../assets/colors.json')
const { cutTo, softWrap, delMsg } = require('../../assets/tools/util');
const { stripIndents } = require('common-tags');

class Wikipedia extends Command {
    constructor() {
        super('wikipedia',
            {
                aliases: ['wikipedia', 'wiki', 'wikisearch'],
                category: 'Util',
                nsfw: true,
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'later',
                    usage: 'laterl',
                    syntax: 'later'
                },
                args: [
                    {
                        id: 'input',
                        match: 'text',
                        type: 'string',
                    },
                ]
            });
    }

    async exec(message, { input }) {
        delMsg(message, 30000)

        if(!message.channel.nsfw) return await message.channel.send({ content: "You have to set this channel to `NSFW` mode to use this command."})

        try {
            await wiki(input).then(async result => {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(cutTo(`Wikipedia - ${result.title}`, 0, 200, true), 'https://i.imgur.com/cY4WMFg.png', `https://en.wikipedia.org/wiki/${input.split(" ").join("_")}`)
                    .setDescription(stripIndents`\`Summary:\`\n> ${softWrap(cutTo(result.extract, 0, 400, true), 500)}\n\nDonate to [Wikipedia](https://donate.wikimedia.org/wiki/Special:MyLanguage/Ways_to_Give?utm_medium=donatewiki_nocountry 'Click to visit "Wikimedia Foundation Donations"')`)
                    .setColor(white)
                    .setThumbnail(result.thumbnail.source)

                await message.util.send({ embeds: [embed] });
            })
        } catch (error) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(stripIndents`Sorry I couldn\'t find anything related to *${cutTo(input ? input : "-", 0, 200, true)}*.`)
                .setColor(lightRed)
                .setFooter('If you made a typo you can edit the message or resend the command')
                .setTimestamp()

            await message.util.send({ embeds: [embed] });

        }
    }
}
module.exports = Wikipedia;