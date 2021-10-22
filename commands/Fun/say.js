const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const owoify = require('owoify-js').default;
const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᘔƐᔭϛ9Ɫ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
const OFFSET = '!'.charCodeAt(0);
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Say extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 's', 'echo'],
            category: 'Fun',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Make me say anything!',
                usage: '<text>\n\n[-e|-embed]\n[-owo|-uwu|-uvu (intensity)]\n[-f|-flip]\n\n{ [-av|-avatar] [-gi|-guildicon] [-ts|-timestamp] [color:#hex] }\n',
                syntax: '<> - necessary, [] - optional, {} - embed compatible'
            },
            args: [
                { // Normal text args
                    id: 'text',
                    match: 'text',
                    type: 'string',
                    prompt: {
                        start: (message) => lang(message, "command.say.noArgs"),
                        retry: (message) => lang(message, "command.say.noArgs"),
                        optional: false
                    }
                },
                { // Embed flags  
                    id: 'embed',
                    match: 'flag',
                    flag: ['-em', '-embed']
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
                    flag: ['-color:', '-c:'],
                    default: crimson
                },
                {
                    id: 'channel',
                    match: 'option',
                    type: 'textChannel',
                    flag: ['-channel:', '-ch:'],
                    default: (message) => message.channel
                },
                {
                    id: 'edit',
                    match: 'option',
                    type: 'guildMessage',
                    flag: ['-edit:', '-ed:'],
                },
                {
                    id: 'reply',
                    match: 'option',
                    type: 'message',
                    flag: ['-reply:', '-rp:']
                },
                { // Text type flags
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
                    id: 'flip',
                    match: 'flag',
                    flag: ['-f', '-flip', '-flipped']
                }
            ]
        });
    }
    async exec(message, args) {
        await delMsg(message);

        let originalText = args.text;
        // Flipping function
        let flipText = originalText.split('').map((c) => c.charCodeAt(0) - OFFSET).map((c) => mapping[c] || ' ').reverse().join('');
        // If the user has staff role they can send whatever
        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            // Check if the user wants an embed
            if (args.embed) {
                const sayEmbed = new MessageEmbed().setColor(crimson);
                // Check for text flags inside the embed
                if (args.uvu) { originalText = owoify(originalText, 'uvu'); }
                else if (args.uwu) { originalText = owoify(originalText, 'uwu'); }
                else if (args.owo) { originalText = owoify(originalText, 'owo'); }
                else if (args.flip) { originalText = flipText; }
                // Other embed options
                if (args.timestamp) sayEmbed.setTimestamp();
                if (args.color) sayEmbed.setColor(args.color);
                if (args.avatar) sayEmbed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
                if (args.guildicon) sayEmbed.setThumbnail(message.guild.iconURL({ dynamic: true }));
                // Checks if both avatar and guildicon flags are in the message
                if (args.avatar && args.guildicon) return await message.channel.send({ content: 'Pick either avatar or guild icon, smh my head my head...' });

                sayEmbed.setDescription(originalText)

                // Check if it should edit the message
                if (args.edit) { await args.edit.edit({ embeds: [sayEmbed] }).catch(() => { }); }
                else if (args.reply) { await args.reply.reply({ embeds: [sayEmbed] }).catch(() => { }); }
                else await args.channel.send({ embeds: [sayEmbed] }).catch(() => { });

            } else {// Check what type of text the user wants to be sent
                if (args.uvu) { originalText = owoify(originalText, 'uvu'); }
                else if (args.uwu) { originalText = owoify(originalText, 'uwu'); }
                else if (args.owo) { originalText = owoify(originalText, 'owo'); }
                else if (args.flip) { originalText = flipText; }

                if (args.edit) { return await args.edit.edit({ content: originalText }).catch(() => { }); }
                else if (args.reply) { return await args.reply.reply({ content: originalText }).catch(() => { }); }
                else return await args.channel.send({ content: originalText }).catch(() => { });
            }
        } else {
            if (args.uvu) { originalText = owoify(originalText, 'uvu'); }
            else if (args.uwu) { originalText = owoify(originalText, 'uwu'); }
            else if (args.owo) { originalText = owoify(originalText, 'owo'); }

            return await args.channel.send({ content: originalText }).catch(() => { });
        }
    }
}
module.exports = Say;