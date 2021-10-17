const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const owoify = require('owoify-js').default;
const mapping = '¡"#$%⅋,)(*+\'-˙/0ƖᘔƐᔭϛ9Ɫ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~';
const OFFSET = '!'.charCodeAt(0);
const { darkRed, crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Say extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 's'],
            category: 'Fun',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Make me say anything!',
                usage: '<text>\n \n[-e|-embed]\n[-owo|-uwu|-uvu (intensity)]\n[-f|-flip]\n\n{ [-av|-avatar] [-gi|-guildicon] [-ts|-timestamp] [color:#hex] }\n',
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
                    flag: ['-color:', '-c:'],
                    default: crimson
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
        // Flipping function
        let flipText = args.text.split('').map((c) => c.charCodeAt(0) - OFFSET).map((c) => mapping[c] || ' ').reverse().join('');
        // Check if the user wants an embed
        if (args.embed) {
            // Staffrole check
            let cachedGuild = staffRole.find(c => c.guild == message.guild.id)
            if (!cachedGuild) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
            let role = message.guild.roles.cache.get(cachedGuild.role)
            if (!role) return await message.channel.send({ content: `${lang(message, "staffroleEmbed.noneFound")} \`${process.env.PREFIX}config staffrole\`` });
            let memberRoles = message.member._roles;
            // If the user has the staffrole, proceed
            if (memberRoles.some(r => cachedGuild.role === r)) {
                // Define embed
                const eembed = new MessageEmbed().setColor(crimson);
                // Check for other text flags inside the embed
                if (args.uvu) {
                    eembed.setDescription(owoify(args.text), 'uvu');
                } else if (args.uwu) {
                    eembed.setDescription(owoify(args.text), 'uwu');
                } else if (args.owo) {
                    eembed.setDescription(owoify(args.text), 'owo');
                } else eembed.setDescription(args.text);
                // Checks if the embed should have the user avatar as the thumbnail
                if (args.avatar) eembed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
                // Checks if the embed should have the guild icon as the thumbnail
                if (args.guildicon) eembed.setThumbnail(message.guild.iconURL({ dynamic: true }));
                // Checks if both avatar and guildicon flags are in the message
                if (args.avatar && args.guildicon) return await message.channel.send({ content: 'Pick either avatar or guild icon, smh my head my head...' });
                // Checks if there should be a timestamp in the embed
                if (args.timestamp) eembed.setTimestamp();
                // Checks if it should change the embed color
                if (args.color) eembed.setColor(args.color);
                // Checks if it should flip the message
                if (args.flip) eembed.setDescription(flipText);

                await message.channel.send({ embeds: [eembed] }).catch(() => { });
            } else {
                const staffroleEmbed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, "staffroleEmbed.desc1")} ${role} ${lang(message, "staffroleEmbed.desc2")}`)
                    .setColor(darkRed)
                    .setTimestamp()

                await message.channel.send({ embeds: [staffroleEmbed] }).catch(() => { });
            }
        } else {// Check what type of text the user wants to be sent
            if (args.uvu) {
                return await message.channel.send({ content: owoify(args.text, 'uvu') });
            } else if (args.uwu) {
                return await message.channel.send({ content: owoify(args.text, 'uwu') });
            } else if (args.owo) {
                return await message.channel.send({ content: owoify(args.text, 'owo') });
            } else if (args.flip) {
                return await message.channel.send({ content: flipText });
            } else return await message.channel.send({ content: args.text });
        }

    }
}
module.exports = Say;