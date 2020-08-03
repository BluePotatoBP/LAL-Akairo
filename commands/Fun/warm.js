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
                            start: 'Please give me a user to warm \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a user to warm \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
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
                .setDescription(`**${message.author} has been warmed. Have a nice day! ❤**`)
                .setImage("http://umirror.in/wp-content/uploads/2017/04/Main-image-warm.jpg?size=128")
                .setColor(orange)
            message.channel.send(embed).catch(e => { console.log(e) });
        } else {
            try {
                const embed2 = new Discord.MessageEmbed()
                    .setDescription(`**${u} has been warmed. Have a nice day! ❤**`)
                    .setImage("http://umirror.in/wp-content/uploads/2017/04/Main-image-warm.jpg?size=128")
                    .setColor(orange)
                if (r) {
                    embed2.setFooter(`Reason: ${r} - now you feel bad, don't you?`)
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