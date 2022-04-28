const { Command } = require('discord-akairo');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');
const moment = require('moment');

class Serverinfo extends Command {
    constructor() {
        super('serverinfo', {
            aliases: ['serverinfo', 'sinfo', 'guildinfo', 'ginfo'],
            category: 'Util',
            cooldown: 10000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: '',
                usage: '<query>',
                syntax: '<> - required'
            }
        });
    }

    async exec(message) {
        delMsg(message, 30000);

        let sicon = message.guild.iconURL({ dynamic: true });
        // fetch the guild owner
        let guildOwner = await message.guild.members.fetch(message.guild.ownerId);
        let verifLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵  ┻━┻',
            VERY_HIGH: '┻┻ヽ(ಠ益ಠ)ノ┻┻'
        };
        let regions = {
            "en-US": 'English (United States)',
            "en-GB": 'English (Great Britain)',
            "bg": 'Bulgarian',
            "zh-CN": 'Chinese (China)',
            "zh-TW": 'Chinese (Taiwan)',
            "hr": 'Croatian',
            "cs": 'Czech',
            "da": 'Danish',
            "nl": 'Dutch',
            "fi": 'Finnish',
            "fr": 'French',
            "de": 'German',
            "el": 'Greek',
            "hi": 'Hindi',
            "hu": 'Hungarian',
            "it": 'Italian',
            "ja": 'Japanese',
            "ko": 'Korean',
            "lt": 'Lithuanian',
            "no": 'Norwegian',
            "pl": 'Polish',
            "pt-BR": 'Portuguese (Brazil)',
            "ro": 'Romanian',
            "ru": 'Russian',
            "es-ES": 'Spanish (Spain)',
            "sv-SE": 'Swedish',
            "th": 'Thai',
            "tr": 'Turkish',
            "uk": 'Ukrainian',
            "vi": 'Vietnamese'
        };

        // PAGE 2
        const rolesSize = message.guild.roles.cache.filter((c) => c.managed == false).size;
        const rolesFilterSort = message.guild.roles.cache.filter((c) => c.managed == false).sort((a, b) => b.rawPosition - a.rawPosition);
        const rolesEmbed = new MessageEmbed()
            .setAuthor(`${message.guild.name} • Page [2/2]`, sicon)
            .setDescription(`Roles managed by other applications\nwill not be shown. [Something wrong?](https://discord.gg/v8zkSc9 'Support Server')\n\n**Roles [${rolesSize}]:**`)
            .setThumbnail(sicon)
            .setColor(crimson)
            .setTimestamp()

        for (let i = 0, secondSliceNumber = 1, firstSliceNumber = 0; i <= rolesSize; i++, secondSliceNumber++) {
            let totalLength = rolesFilterSort.map((c) => c).slice(firstSliceNumber, secondSliceNumber).join(' ').length;

            if (totalLength > 1024 || i == rolesSize) {
                let rolesMap = rolesFilterSort.map((c) => c).slice(firstSliceNumber, secondSliceNumber - 1).join(' ');

                rolesEmbed.addField(`‌ `, rolesMap);
                firstSliceNumber = secondSliceNumber - 1;
            }
        }

        // PAGE 1
        const infoEmbed = new MessageEmbed()
            .setAuthor(`${message.guild.name} • Page [1/2]`, sicon)
            .addField('🧭Info', `**Owner:** ${guildOwner}\n**ID:** \`${message.guild.id}\`\n\n**Created:** <t:${moment(message.guild.createdAt).unix()}:R>\n**AFK Timeout:** \`${message.guild.afkTimeout / 60} min\`\n**Highest Role:** ${message.guild.roles.highest}`, true)
            .addField('📊Stats', `**Emoji:** \`${message.guild.emojis.cache.size}\`\n**Roles:** \`${message.guild.roles.cache.size}\`\n**Channels:** \`${message.guild.channels.cache.size}\`\n**Members:** \`${message.guild.memberCount}\`\n\n**❗Press Buttons to**\n**❗switch pages ⇄**`, true)
            .setThumbnail(sicon)
            .setColor(crimson)
            .setTimestamp()

        let backBtn = new MessageButton()
            .setCustomId('back')
            .setEmoji('891664001379991572')
            .setStyle('SECONDARY');
        let nextBtn = new MessageButton()
            .setCustomId('next')
            .setEmoji('891664001380020264')
            .setStyle('SECONDARY');
        let exitBtn = new MessageButton()
            .setCustomId('exit')
            .setEmoji('817890713190662146')
            .setStyle('DANGER');
        // Define action row and add buttons components
        const buttonRow = new MessageActionRow().addComponents([backBtn, exitBtn, nextBtn]);
        // Send initial message
        const msg = await message.reply({ embeds: [infoEmbed], components: [buttonRow] })
        const filter = i => i.user.id === message.author.id;
        // Create a message component collector (long ass name \/)
        const buttonCollector = msg.channel.createMessageComponentCollector({ filter, time: 60000 });
        // On collect do logic
        let currentPage = 1;

        buttonCollector.on("collect", async i => {
            try {
                // Check what button was pressed
                switch (i.customId) {
                    case "back":
                        if (currentPage !== 1) {
                            await i.update({ embeds: [infoEmbed] });
                            currentPage = 1;
                        } else {
                            await i.update({ embeds: [rolesEmbed] });
                            currentPage = 2;
                        }

                        break;

                    case "next":
                        if (currentPage !== 2) {
                            await i.update({ embeds: [rolesEmbed] });
                            currentPage = 2;
                        } else {
                            await i.update({ embeds: [infoEmbed] });
                            currentPage = 1;
                        }

                        break;

                    case "exit":
                        await i.update({ components: [] });
                        break;
                }
            } catch (error) {
                console.log(error)
                return await message.channel.send({ content: "Sorry, something went wrong. Please re-send the command." })
            }
        });

        buttonCollector.on("end", async () => {
            await msg.edit({ components: [] }).catch(() => { })
        });

    }
}

module.exports = Serverinfo;