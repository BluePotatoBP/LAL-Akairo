const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const owoify = require('owoify-js').default;
const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᘔƐᔭϛ9Ɫ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
const OFFSET = '!'.charCodeAt(0);
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require('../../assets/colors.json');

class Say extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 's'],
            category: 'Fun',
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            ownerOnly: false,
            description: {
                content: 'Make me say anything!',
                usage: '<text>\n \n[-e|-embed]  { [-av|-avatar], [-gi|-guildicon],\n [-ts|-timestamp], [color:#hex] }\n \n[-owo|-uwu|-uvu (intensity)], [-f|-flip], [-tts]',
                syntax: '<> - necessary, [] - optional, {} - embed compatible'
            },
            args: [
                //#region ArgsAndFlags

                {
                    // Normal text args
                    id: 'text',
                    match: 'text',
                    type: 'string'
                },
                {
                    // Embed flags
                    id: 'embed',
                    match: 'flag',
                    flag: ['-e', '-embed']
                },
                {
                    id: 'avatar',
                    match: 'flag',
                    flag: ['-av', '-avatar']
                },
                {
                    id: 'guildicon',
                    match: 'flag',
                    flag: ['-gi', '-guildicon']
                },
                {
                    id: 'timestamp',
                    match: 'flag',
                    flag: ['-ts', '-timestamp']
                },
                {
                    id: 'color',
                    match: 'option',
                    flag: ['-color:'],
                    default: crimson
                },
                {
                    // Text type flags
                    id: 'uvu',
                    match: 'flag',
                    flag: '-uvu'
                },
                {
                    id: 'uwu',
                    match: 'flag',
                    flag: '-uwu'
                },
                {
                    id: 'owo',
                    match: 'flag',
                    flag: '-owo'
                },
                {
                    id: 'tts',
                    match: 'flag',
                    flag: '-tts'
                },
                {
                    id: 'flip',
                    match: 'flag',
                    flag: ['-f', '-flip', '-flipped']
                }
                //#endregion ArgsAndFlags
            ]
        });
    }
    async exec(message, args) {
        message.delete().catch((e) => {});

        try {
            if (!args.text) {
                const noArgs = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(lang(message, 'command.say.noArgs'))
                    .setColor(crimson);

                message.channel.send(noArgs);
            } else {
                let flipText = args.text
                    .split('')
                    .map((c) => c.charCodeAt(0) - OFFSET)
                    .map((c) => mapping[c] || ' ')
                    .reverse()
                    .join('');
                // Check if the user wants an embed
                if (args.embed) {
                    const eembed = new Discord.MessageEmbed().setColor(crimson);
                    //#region EmbedTextTypes

                    // Check for other text flags inside the embed

                    if (args.uvu) {
                        eembed.setDescription(owoify(args.text), 'uvu');
                    } else if (args.uwu) {
                        eembed.setDescription(owoify(args.text), 'uwu');
                    } else if (args.owo) {
                        eembed.setDescription(owoify(args.text), 'owo');
                    } else {
                        eembed.setDescription(args.text);
                    }

                    // Checks if the embed should have the user avatar as the thumbnail
                    if (args.avatar) {
                        eembed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
                    }
                    // Checks if the embed should have the guild icon as the thumbnail
                    if (args.guildicon) {
                        eembed.setThumbnail(message.guild.iconURL({ dynamic: true }));
                    }
                    // Checks if both avatar and guildicon flags are in the message
                    if (args.avatar && args.guildicon) {
                        return message.channel.send(
                            'Pick avatar or guild icon, smh my head my head... <:thonkingong:568878623910526997>'
                        );
                    }
                    // Checks if there should be a timestamp in the embed
                    if (args.timestamp) {
                        eembed.setTimestamp();
                    }
                    // Checks if it should change the embed color
                    if (args.color) {
                        eembed.setColor(args.color);
                    }
                    if (args.flip) {
                        eembed.setDescription(flipText);
                    }
                    //#endregion EmbedTextTypes

                    await message.channel.send(eembed);

                    //#region NormalSay
                    // Check what type of text the user wants to be sent
                } else {
                    if (args.uvu) {
                        return message.channel.send(owoify(args.text), 'uvu');
                    } else if (args.uwu) {
                        return message.channel.send(owoify(args.text), 'uwu');
                    } else if (args.owo) {
                        return message.channel.send(owoify(args.text), 'owo');
                    } else if (args.tts) {
                        return message.channel.send(args.text, { tts: true });
                    } else if (args.flip) {
                        return message.channel.send(flipText);
                    } else {
                        return message.channel.send(args.text);
                    }
                    //#endregion NormalSay
                }
            }
        } catch (error) {
            console.log(error);
            message.channel.send("<:sadpepe:774640053020000266> u bwoke me... idfk how don't ask");
        }
    }
}
module.exports = Say;