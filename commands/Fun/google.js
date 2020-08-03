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
                            start: 'Please give something to look up \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give something to look up \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
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
            .setTitle(cut(s + '...'))
            .setDescription(`[I googled it for you!](http://lmgtfy.com/?iie=1&q=${query})`)
            .setColor('RANDOM');

        message.channel.send(embed)

    }
}
module.exports = Google;