const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const urban = require('relevant-urban');
const { cutTo, softWrap, delMsg } = require('../../assets/tools/util')
const { crimson } = require('../../assets/colors.json');

class Urban extends Command {
    constructor() {
        super('urban', {
            aliases: ['urban'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
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
                    start: 'What would you like to search for?',
                    retry: 'Didnt quite catch that, what would you like to search for?',
                    optional: false
                }
            }]
        });
    }

    async exec(message, { args }) {
        await delMsg(message, 30000);
        try {
            // Call the urban dictionary API
            let res = await urban(args)

            const nrembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(lang(message, 'command.urban.nrembed.desc'))
                .setColor(darkRed)
                .setTimestamp();

            // If theres no data, return an embed 
            if (!res) return message.channel.send({ embeds: [nrembed] });

            let { word, thumbsUp, thumbsDown, permalink, author } = res;
            let example = await res.example.replace(/\[/g, '').replace(/\]/g, ''); // Replace all [] with '' because theres no way to get those hyperlinks
            let definition = await res.definition.replace(/\[/g, '').replace(/\]/g, ''); // ^

            definition = await softWrap(await cutTo(definition, 0, 800, true), 50) // Cut the text if its over 800 characters
            example = await softWrap(await cutTo(example, 0, 800, true), 50) //        ^

            let nembed = new Discord.MessageEmbed()
                .setColor(crimson)
                .setAuthor(`${lang(message, 'command.urban.nembed.author')} '${word}'`, client.user.displayAvatarURL({ dynamic: true }))
                .setThumbnail('https://i.imgur.com/KeDXCWj.png')
                .setDescription(`
                        \`${lang(message, 'command.urban.nembed.desc.definition')}\` \n${definition || lang(message, 'command.urban.nembed.desc.noDefinition')}
                        \`${lang(message, 'command.urban.nembed.desc.example')}\` \n${example || lang(message, 'command.urban.nembed.desc.noExample')}
                        \`${lang(message, 'command.urban.nembed.desc.upvotes')}\` ${thumbsUp || 0}
                        \`${lang(message, 'command.urban.nembed.desc.downvotes')}\` ${thumbsDown || 0}
                        \`${lang(message, 'command.urban.nembed.desc.link')}\` [${lang(message, 'command.urban.nembed.desc.linkTo')} '${word}'](${permalink || 'https://www.urbandictionary.com/'})`)
                .setTimestamp()
                .setFooter(`${lang(message, 'command.urban.nembed.desc.author')} ${author || 'unknown'}`);

            await message.channel.send({ embeds: [nembed] });
        } catch (error) {
            const swrembed = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sorry I couldnt find anything about0 '\`${await cutTo(args, 0, 100, true)}\`'`)
                .setColor(crimson)
                .setFooter(`If you made a mistake, edit the command or re-send it`)
                .setTimestamp();
            await message.channel.send({ embeds: [swrembed] });
        }
    }
}
module.exports = Urban;