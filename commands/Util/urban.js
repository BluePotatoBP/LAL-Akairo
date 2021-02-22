const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const urban = require('urban');
const { cutTo, softWrap } = require('../../assets/tools/util')
const { crimson, darkRed } = require('../../assets/colors.json');

class Urban extends Command {
    constructor() {
        super('urban', {
            aliases: ['urban'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: "You're not sure what it means? The Urban Dictionary most likely has an answer.",
                usage: '[query]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'args',
                match: 'text',
                type: 'string',
                prompt: {
                    start: 'start',
                    retry: 'retry',
                    optional: false
                }

            }]
        });
    }

    async exec(message, { args }) {
        message.delete().catch((e) => {});
        // Call the urban dictionary API
        let search = await urban(args)

        try {
            search.first(async (res) => { // Search for input data
                const nrembed = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(lang(message, 'command.urban.nrembed.desc'))
                    .setColor(darkRed)
                    .setTimestamp();

                // If theres no data, return an embed 
                if (!res) return message.channel.send(nrembed);

                let { word, thumbs_up, thumbs_down, permalink, author } = res;
                let example = await res.example.replace(/\[/g, '').replace(/\]/g, ''); // Replace all [] with '' because theres no way to get those hyperlinks
                let definition = await res.definition.replace(/\[/g, '').replace(/\]/g, ''); // ^

                definition = softWrap(cutTo(definition, 0, 800, true), 50) // Cut the text if its over 800 characters
                example = softWrap(cutTo(example, 0, 800, true), 50) //        ^

                let nembed = new Discord.MessageEmbed()
                    .setColor(crimson)
                    .setAuthor(`${lang(message, 'command.urban.nembed.author')} '${word}'`, client.user.displayAvatarURL({ dynamic: true }))
                    .setThumbnail('https://i.imgur.com/KeDXCWj.png')
                    .setDescription(`
                        \`${lang(message, 'command.urban.nembed.desc.definition')}\` \n${definition || lang(message, 'command.urban.nembed.desc.noDefinition')}
                        \`${lang(message, 'command.urban.nembed.desc.example')}\` \n${example || lang(message, 'command.urban.nembed.desc.noExample')}
                        \`${lang(message, 'command.urban.nembed.desc.upvotes')}\` ${thumbs_up || 0}
                        \`${lang(message, 'command.urban.nembed.desc.downvotes')}\` ${thumbs_down || 0}
                        \`${lang(message, 'command.urban.nembed.desc.link')}\` [${lang(message,'command.urban.nembed.desc.linkTo')} '${word}'](${permalink || 'https://www.urbandictionary.com/'})`)
                    .setTimestamp()
                    .setFooter(`${lang(message, 'command.urban.nembed.desc.author')} ${author || 'unknown'}`);

                await message.channel.send(nembed);
            });

        } catch (error) {
            console.log(error);

            const swrembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription("Whoops, something wen't wrong... Please try again!")
                .setColor(darkRed)
                .setTimestamp();
            await message.channel.send(swrembed);
        }
    }
}
module.exports = Urban;