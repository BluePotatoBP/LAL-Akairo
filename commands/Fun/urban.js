const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const urban = require("urban")
const { crimson, darkRed } = require('../../assets/colors.json')

class Urban extends Command {
    constructor() {
        super('urban',
            {
                aliases: ['urban'],
                category: 'Fun',
                ownerOnly: false,
                description: {
                    content: 'You\'re not sure what it means? The Urban Dictionary most likely has an answer. \`(NSFW)\`',
                    usage: '[search|!input=random] <query>',
                    syntax: '<> - necessary, [] - optional \n \n"!input=random" means that if theres no "search" argument it will find a random term.'
                },
                args: [
                    {
                        id: 'args',
                        match: 'text',
                        type: 'string',
                    },
                ]
            });
    }

    async exec(message, { args }) {
        message.delete().catch(e => { });

        let search = args ? urban(args) : urban.random()
        try {
            search.first(res => {
                const nrembed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                    .setDescription(`No results found for that topic.`)
                    .setColor(darkRed)
                    .setTimestamp()

                if (!res) return message.channel.send(nrembed)
                let { word, definition, example, thumbs_up, thumbs_down, permalink, author } = res

                let nembed = new Discord.MessageEmbed()
                    .setColor(crimson)
                    .setAuthor(`Heres what I found about '${word}'`, client.user.avatarURL({ dynamic: true }))
                    .setThumbnail("https://i.imgur.com/KeDXCWj.png")
                    .setDescription(`\`Definition:\` \n${definition || "No definition"}
                        \`Example:\` \n${example || "No example"}
                        \`Upvotes:\` ${thumbs_up || 0}
                        \`Downvotes:\` ${thumbs_down || 0}
                        \`Link:\` [Link to '${word}'](${permalink || "https://www.urbandictionary.com/"})`)
                    .setTimestamp()
                    .setFooter(`Written by ${author || "unknown"}`)

                message.channel.send(nembed)
            })
        } catch (error) {
            console.log(error)
            const swrembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setDescription("Whoops, something wen't wrong... Please try again!")
                .setColor(darkRed)
                .setTimestamp()
            message.channel.send(swrembed)
        }
    }
}
module.exports = Urban;