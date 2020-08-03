const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Serverinfo extends Command {
    constructor() {
        super('serverinfo',
            {
                aliases: ['serverinfo', 'sinfo', 'guildinfo', 'ginfo'],
                category: 'Util',
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Shows useful information about the current server'
                },
                args: [
                    {
                        id: 'text',
                        match: 'text',
                        type: 'string',
                    },
                ]
            });
    }

    async exec(message, args) {
        message.delete().catch(e => { });

        // Define bicon (bot icon) and sicon (server icon) 
        var bicon = client.user.avatarURL({ dynamic: true });
        var sicon = message.guild.iconURL({ dynamic: true });

        var region = {
            "brazil": "\`Brazil\` :flag_br:",
            "europe": "\`Europe\` :flag_eu:",
            "eu-central": "\`Central Europe\` :flag_eu:",
            "singapore": "\`Singapore\` :flag_sg:",
            "us-central": "\`U.S. Central\` :flag_us:",
            "sydney": "\`Sydney\` :flag_au:",
            "us-east": "\`U.S. East\` :flag_us:",
            "us-south": "\`U.S. South\` :flag_us:",
            "us-west": "\`U.S. West\` :flag_us:",
            "eu-west": "\`estern Europe\` :flag_eu:",
            "vip-us-east": "\`VIP U.S. East\` :flag_us:",
            "india": "India :flag_in:",
            "japan": "Japan :flag_jp:",
            "london": "\`London\` :flag_gb:",
            "amsterdam": "\`Amsterdam\` :flag_nl:",
            "hongkong": "\`Hong Kong\` :flag_hk:",
            "russia": "\`Russia\` :flag_ru:",
            "southafrica": "\`South Africa\` :flag_za:"
        };
        var verifLevels = {
            "NONE": "None",
            "LOW": "Low",
            "MEDIUM": "Medium",
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻┻ヽ(ಠ益ಠ)ノ┻┻"
        };

        var serverembed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, sicon)
            .addField("ID", `\`${message.guild.id}\`  👌`, true)
            .addField("Owner", `${message.guild.owner} <a:BlobCool:640348267485331466>`, true)
            .addField("Region", `${region[message.guild.region]}`, true)
            .addField("Custom Emoji", `\`${message.guild.emojis.cache.size}\` <a:wobbleblob:605179634899877918>`, true)
            .addField("Roles", `\`${message.guild.roles.cache.size}\` <a:BlobEat:605179705242550388>`, true)
            .addField("Channels", `\`${message.guild.channels.cache.size}\` <a:gimmeLeft:613704022607790110>`, true)
            .addField("You joined", `\`${message.member.joinedAt.toUTCString().substr(0, 16)}\` 🖖`, true)
            .addField("Verification Level", `\`${verifLevels[message.guild.verificationLevel]}\` <:captcha:603616843625922600>`, true)
            .addField("Total Members", `\`${message.guild.memberCount}\` <a:BlobKnight1:618523912220835840><a:BlobKnight2:618523972124016661>`, true)
            .addField("Status List", `${message.guild.members.cache.filter(o => o.presence.status === 'online').size} <:online:580819575742922753> Online` + `\n${message.guild.members.cache.filter(o => o.presence.status === 'streaming').size} <:streaming:613525444808933379> Streaming` + `\n${message.guild.members.cache.filter(o => o.presence.status === 'dnd').size} <:dnd:580819574816112640> DND` + `\n${message.guild.members.cache.filter(o => o.presence.status === 'idle').size} <:idle:580819575088742413> Idle` + `\n${message.guild.members.cache.filter(o => o.presence.status === 'offline').size} <:offline:580819575319560243> Offline`, true)
            .addField("Highest Role", `\`${message.guild.roles.highest.name}\` <a:squidwarddance:605180674785411082>`, true)
            .addField("Voice AFK Timeout", `\`${message.guild.afkTimeout / 60} min\` <a:sleepycat:724769209393086544>`, true)
            .setThumbnail(sicon)
            .setColor(crimson)
            .setTimestamp()
            .setFooter("🎉 Copyright © BluePotatoBP - 2020 🎉", bicon)

        message.channel.send(serverembed);
    }
}
module.exports = Serverinfo;