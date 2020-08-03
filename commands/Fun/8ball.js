const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { lightYellow } = require('../../assets/colors.json')

class Eightball extends Command {
    constructor() {
        super('eightball',
            {
                aliases: ['eightball', '8ball', '8b'],
                category: 'Fun',
                ownerOnly: false,
                description: {
                    content: 'It is certain, but also try again later',
                    usage: '<question>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'input',
                        match: 'text',
                        type: 'string',
                        prompt: {
                            start: 'Please give me a question to check. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a question to check. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    },
                ]
            });
    }

    async exec(message, { input }) {
        message.delete().catch(e => { });

        // Roll the response
        function roll() {

            let replies = ["As I see it, yes", "Ask again later", "Better not tell you now",
                "Cannot predict now", "Concentrate and ask again", "Don’t count on it", "It is certain",
                "It is decidedly so", "Most likely", "My reply is no", "My sources say no", "Outlook good",
                "Outlook not so good", "Reply hazy, try again", "Signs point to yes", "Very doubtful",
                "Without a doubt", "Yes", "Yes, definitely", "You may rely on it"];

            let result = replies[~~(Math.random() * replies.length)];

            return result;
        }

        function cap() {
            let capitalize = input.charAt(0).toUpperCase() + input.slice(1);

            return capitalize
        }

        // If input is less then 3 return an error embed
        let qembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setDescription("Ask a question with at least `2` words. \nPlease \`re-type\` the command")
            .setColor(lightYellow)
            .setFooter(`You entered: ${input}`)
            .setTimestamp()

        if (input.length < 3) message.channel.send(qembed).then(msg => msg.delete(10000));

        // Embed for 8ball
        let ballembed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username} asked:`, message.author.avatarURL({ dynamic: true }))
            .setThumbnail("https://browsergameita.com/images/discord-emoji-transparent-7.png")
            .setColor(lightYellow)
            .setDescription(`\`${cap()}\``)
            .addField("My answer:", `\`${roll()}\``)
            .setTimestamp();

        // Send the 8ball embed
        message.channel.send(ballembed).catch(e => { console.log(e) });
    }
}

module.exports = Eightball;