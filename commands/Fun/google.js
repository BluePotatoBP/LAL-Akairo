const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Google extends Command {
    constructor() {
        super('google',
            {
                aliases: ['google', 'whatis', 'g'],
                category: 'Fun',
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'For the people that can\'t google themselves',
                    usage: '<query>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 's',
                        match: 'text',
                        type: 'string',
                        prompt: {
                            start: message => lang(message, "command.google.prompt.start"),
                            retry: message => lang(message, "command.google.prompt.retry"),
                        }
                    },
                ]
            });
    }

    async exec(message, { s }) {
        message.delete().catch(e => { });

        function cut(text) {
            if (s.length > 250) {
                let res = s.length - 250;
                text = text.slice(-res)

                return text;
            } else {
                text = s;
                return text;
            }
        };

        let query = s.split(" ").join("+");
        let embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setTitle(`"${cut(s) + '...'}"`)
            .setDescription(`[${lang(message, "command.google.embed.desc")}](http://lmgtfy.com/?iie=1&q=${query})`)
            .setColor('RANDOM');

        message.channel.send(embed)

    }
}
module.exports = Google;