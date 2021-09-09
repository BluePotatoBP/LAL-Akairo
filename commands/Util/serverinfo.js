const { Command } = require('discord-akairo');
const { MessageEmbed, Message } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { ReactionCollector } = require('discord.js-collector');
const { delMsg } = require('../../assets/tools/util');

class Serverinfo extends Command {
    constructor() {
        super('serverinfo', {
            aliases: ['serverinfo', 'sinfo', 'guildinfo', 'ginfo'],
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
            category: 'Util',
            cooldown: 5000,
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
        await delMsg(message);

        let sicon = message.guild.iconURL({ dynamic: true });
        let region = {
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
        };
        let verifLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵  ┻━┻',
            VERY_HIGH: '┻┻ヽ(ಠ益ಠ)ノ┻┻'
        };

        const loadingEmbed = new MessageEmbed()
            .setAuthor(`${message.guild.name} • Page [1/2]`, sicon)
            .setDescription('Loading... \n\nIf nothing happens please \ncontact the developer [here](https://discord.gg/v8zkSc9)')
            .setThumbnail(sicon)
            .setColor(crimson)
            .setTimestamp()

        const botMessage = await message.channel.send({ embeds: [loadingEmbed] });

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

        ////////////////////////////////////////////////////////// PAGINATOR
        ReactionCollector.paginator({
            botMessage,
            user: message.author,
            pages: [
                new MessageEmbed()
                    .setAuthor(`${message.guild.name} • Page [1/2]`, sicon)
                    .addField('ID', `\`${message.guild.id}\`  👌`, true)
                    .addField('Owner', `<@${message.guild.ownerId}> <a:animatedCool:773205297782325259>`, true)
                    /* .addField('Region', `${region[message.guild.region]}`, true) */
                    .addField('Custom Emoji', `\`${message.guild.emojis.cache.size}\` <a:blobWobble:773208612776181800>`, true)
                    .addField('Roles', `\`${message.guild.roles.cache.size}\` <a:blobEat:773207674015055912>`, true)
                    .addField('Channels', `\`${message.guild.channels.cache.size}\` <a:blobGimmeLeft:773217828052402186>`, true)
                    .addField('Verification Level', `\`${verifLevels[message.guild.verificationLevel]}\` <:captcha:773217509850873886>`, true)
                    .addField('Total Members', `\`${message.guild.memberCount}\` <a:blobKnight1:773218186694098994><a:blobKnight2:773218752405307392>`, true)
                    /*                     .addField(
                                            'Status List',
                                            `${message.guild.members.cache.get(filter((o) => o.presence.status === 'online').size)} <:online:773212850733711360> Online` +
                                            `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'streaming').size)} <:streaming:773212851174506565> Streaming` +
                                            `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'dnd').size)} <:dnd:773212850364743742> DND` +
                                            `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'idle').size)} <:idle:773212850533171211> Idle` +
                                            `\n${message.guild.members.cache.get(filter((o) => o.presence.status === 'offline')).size} <:offline:773212850755862538> Offline`,
                                            true
                                        ) */
                    .addField('Highest Role', `\`${message.guild.roles.highest.name}\` <a:dancingSquidward:773219104479379467>`, true)
                    .addField('Voice AFK Timeout', `\`${message.guild.afkTimeout / 60} min\` <a:sleepyCat:773219103933464616>`, true)
                    .setThumbnail(sicon)
                    .setColor(crimson)
                    .setTimestamp(),

                rolesEmbed
            ],
            collectorOptions: {
                time: 60000
            }
        });
    }
}
module.exports = Serverinfo;