const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Botinfo extends Command {
    constructor() {
        super('botinfo',
            {
                aliases: ['botinfo', 'binfo'],
                category: 'Util',
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Shows information about the bot'
                },
            });
    }

    async exec(message) {
        message.delete().catch(e => { });

        let bicon = client.user.avatarURL({ dynamic: true });
        var seconds = parseInt((client.uptime / 1000) % 60),
            minutes = parseInt((client.uptime / (1000 * 60)) % 60),
            hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - Bot Info`, bicon)
            .addField(`**Developer:**`, `\`BluePotatoBP#5214\` <a:anismart:605179506013110373>`, true)
            .addField(`**ID**`, `\`${client.user.id}\``, true)
            .addField('**Version**', `\`${process.env.VERSION}\` <a:gears:619268321065304065>`, true)
            .addField('**Created At**', `\`${client.user.createdAt.toUTCString().substr(0, 16)}\` <a:blobdj:605180387584507917>`, true)
            .addField('**Uptime**', `\`${hours}\`h \`${minutes}\`m \`${seconds}\`s`, true)
            .addField('**All Guild Stats**', `Members: \`${client.users.cache.size}\` \nGuilds: \`${client.guilds.cache.size}\` <a:blobSnowball:605179774817796106><a:bolbsnowball2:640348610609020939>\nChannels: \`${client.channels.cache.size}\``, true)
            .setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉`, bicon)
            .setThumbnail(bicon)
            .setTimestamp()
            .setColor(crimson)

        message.channel.send(embed)
    }
}
module.exports = Botinfo;