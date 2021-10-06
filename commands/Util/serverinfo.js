const { Command } = require('discord-akairo');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Serverinfo extends Command {
    constructor() {
        super('serverinfo', {
            aliases: ['serverinfo', 'sinfo', 'guildinfo', 'ginfo'],
            clientPermissions: ['MANAGE_MESSAGES'],
            category: 'Util',
            cooldown: 10000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: '',
                usage: '<query>',
                syntax: '<> - necessary'
            }
        });
    }

    async exec(message) {
        let sicon = message.guild.iconURL({ dynamic: true });
        /* let region = {
            brazil: '`Brazil` :flag_br:',
            europe: '`Europe` :flag_eu:',
            'eu-central': '`Central Europe` :flag_eu:',
            singapore: '`Singapore` :flag_sg:',
            'us-central': '`U.S. Central` :flag_us:',
            sydney: '`Sydney` :flag_au:',
            'us-east': '`U.S. East` :flag_us:',
            'us-south': '`U.S. South` :flag_us:',
            'us-west': '`U.S. West` :flag_us:',
            'eu-west': '`estern Europe` :flag_eu:',
            'vip-us-east': '`VIP U.S. East` :flag_us:',
            india: 'India :flag_in:',
            japan: 'Japan :flag_jp:',
            london: '`London` :flag_gb:',
            amsterdam: '`Amsterdam` :flag_nl:',
            hongkong: '`Hong Kong` :flag_hk:',
            russia: '`Russia` :flag_ru:',
            southafrica: '`South Africa` :flag_za:'
        }; */
        let verifLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵  ┻━┻',
            VERY_HIGH: '┻┻ヽ(ಠ益ಠ)ノ┻┻'
        };

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

        const infoEmbed = new MessageEmbed()
            .setAuthor(`${message.guild.name} • Page [1/2]`, sicon)
            .addField('ID', `\`${message.guild.id}\``, true)
            .addField('Owner', `<@${message.guild.ownerId}>`, true)
            /* .addField('Region', `${region[message.channel.region]}`, true) */
            .addField('Custom Emoji', `\`${message.guild.emojis.cache.size}\``, true)
            .addField('Roles', `\`${message.guild.roles.cache.size}\``, true)
            .addField('Channels', `\`${message.guild.channels.cache.size}\``, true)
            .addField('Verification Level', `\`${verifLevels[message.guild.verificationLevel]}\``, true)
            .addField('Total Members', `\`${message.guild.memberCount}\``, true)
            /* .addField(
                'Status List',
                `${message.guild.members.cache.get(filter((o) => o.presence.status === 'online').size)} <:online:773212850733711360> Online` +
                `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'streaming').size)} <:streaming:773212851174506565> Streaming` +
                `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'dnd').size)} <:dnd:773212850364743742> DND` +
                `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'idle').size)} <:idle:773212850533171211> Idle` +
                `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'offline')).size} <:offline:773212850755862538> Offline`,
                true
            ) */
            .addField('Highest Role', `${message.guild.roles.highest}`, true)
            .addField('Voice AFK Timeout', `\`${message.guild.afkTimeout / 60} min\``, true)
            .setThumbnail(sicon)
            .setColor(crimson)
            .setTimestamp()

        let backBtn = new MessageButton()
            .setCustomId('back')
            .setEmoji('891664001379991572')
            .setStyle('PRIMARY');
        let nextBtn = new MessageButton()
            .setCustomId('next')
            .setEmoji('891664001380020264')
            .setStyle('PRIMARY');
        let exitBtn = new MessageButton()
            .setCustomId('exit')
            .setEmoji('817890713190662146')
            .setStyle('DANGER');
        // Define action row and add buttons components
        const buttonRow = new MessageActionRow().addComponents([backBtn, nextBtn, exitBtn]);
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
                return await message.channel.send({ content: "Sorry, something went wrong. Please re-send the command." })
            }
        });

        buttonCollector.on("end", async () => {
            await msg.edit({ components: [] }).catch(() => { })
        });

    }
}

module.exports = Serverinfo;