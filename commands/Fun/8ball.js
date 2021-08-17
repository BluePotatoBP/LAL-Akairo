const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { lightYellow } = require('../../assets/colors.json');
const { cutTo, softWrap, capitalize, delMsg } = require('../../assets/tools/util')

class Eightball extends Command {
    constructor() {
        super('eightball', {
            aliases: ['eightball', '8ball', '8b'],
            category: 'Fun',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'It is certain, but also try again later',
                usage: '<question>',
                syntax: '<> - necessary'
            },
            args: [{
                id: 'input',
                match: 'text',
                type: 'string',
                prompt: {
                    start: (message) => lang(message, 'command.eightball.prompt.start'),
                    retry: (message) => lang(message, 'command.eightball.prompt.retry')
                }
            }]
        });
    }

    async exec(message, { input }) {
        await delMsg(message);

        // Roll the response
        function roll() {
            let replies = [
                lang(message, 'command.eightball.replies.one'),
                lang(message, 'command.eightball.replies.two'),
                lang(message, 'command.eightball.replies.three'),
                lang(message, 'command.eightball.replies.four'),
                lang(message, 'command.eightball.replies.five'),
                lang(message, 'command.eightball.replies.six'),
                lang(message, 'command.eightball.replies.seven'),
                lang(message, 'command.eightball.replies.eight'),
                lang(message, 'command.eightball.replies.nine'),
                lang(message, 'command.eightball.replies.ten'),
                lang(message, 'command.eightball.replies.eleven'),
                lang(message, 'command.eightball.replies.twelve'),
                lang(message, 'command.eightball.replies.thirteen'),
                lang(message, 'command.eightball.replies.fourteen'),
                lang(message, 'command.eightball.replies.fifteen'),
                lang(message, 'command.eightball.replies.sixteen'),
                lang(message, 'command.eightball.replies.seventeen'),
                lang(message, 'command.eightball.replies.eighteen'),
                lang(message, 'command.eightball.replies.nineteen'),
                lang(message, 'command.eightball.replies.twenty')
            ];

            let result = replies[~~(Math.random() * replies.length)];

            return result;
        }

        // If input is less then 3 return an error embed
        let qembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(lang(message, 'command.eightball.qembed.desc'))
            .setFooter(`${lang(message, 'command.eightball.qembed.footer')} ${input}`)
            .setColor(lightYellow)
            .setTimestamp();

        if (input.length < 3) message.channel.send({ embeds: [qembed] }).then((msg) => msg.delete(10000));

        // Embed for eightball
        let ballembed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username} ${lang(message, 'command.eightball.ballembed.author')}`, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail('https://browsergameita.com/images/discord-emoji-transparent-7.png')
            .setColor(lightYellow)
            .setDescription(`\`\`\`${softWrap(cutTo(capitalize(input), 0, 500, true), 32)}\`\`\``)
            .addField(lang(message, 'command.eightball.ballembed.field'), `\`${roll()}\``)
            .setTimestamp();

        // Send the eightball embed
        message.channel.send({ embeds: [ballembed] }).catch((e) => console.log(e));
    }
}

module.exports = Eightball;