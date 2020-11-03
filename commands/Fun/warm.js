const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { orange } = require('../../assets/colors.json')

class Warm extends Command {
    constructor() {
        super('warm',
            {
                aliases: ['warm'],
                category: 'Fun',
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'Warm any user in need of hugs',
                    usage: '[user]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'u',
                        type: 'user',
                        prompt: {
                            optional: true,
                            start: message => lang(message, "command.warm.prompt.start"),
                            retry: message => lang(message, "command.warm.prompt.retry"),
                        }
                    },
                    {
                        id: 'r',
                        match: 'rest',
                        type: 'string'
                    }
                ]
            });
    }

    async exec(message, { u, r }) {
        message.delete().catch(e => { });

        if (!u) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`**${message.author} ${lang(message, "command.warm.embed.desc")} ❤**`)
                .setImage("https://i.imgur.com/z0cy78Y.jpg")
                .setColor(orange)
            message.channel.send(embed).catch(e => { console.log(e) });
        } else {
            try {
                const embed2 = new Discord.MessageEmbed()
                    .setDescription(`**${u} ${lang(message, "command.warm.embed.desc")} ❤**`)
                    .setImage("https://i.imgur.com/z0cy78Y.jpg")
                    .setColor(orange)
                if (r) {
                    function cut(text) {
                        if (r.length > 20) {
                            let res = r.length - 20;
                            text = text.slice(-res)

                            return text;
                        } else {
                            text = r;
                            return text;
                        }
                    };

                    embed2.setFooter(`${lang(message, "command.warm.embed.footer.reason")} "${cut(r) + '...'}" - ${lang(message, "command.warm.embed.footer.funny")}`)
                }
                message.channel.send(embed2).catch(e => { console.log(e) });

            } catch (error) {
                console.log(error)
                message.channel.send(`I couldn't warm that user for some reason 😢`)
            }
        }
    }
}
module.exports = Warm;