const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const Akairo = require('discord-akairo');
const { delMsg } = require('../../assets/tools/util');
const moment = require('moment');

class Botinfo extends Command {
    constructor() {
        super('botinfo', {
            aliases: ['botinfo', 'binfo'],
            category: 'Util',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Shows information about the bot',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        await delMsg(message);

        let bicon = client.user.displayAvatarURL({ dynamic: true });
        let seconds = parseInt((client.uptime / 1000) % 60),
            minutes = parseInt((client.uptime / (1000 * 60)) % 60),
            hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} - ${lang(message, 'command.botinfo.embed.author')}`, bicon)
            .addField('🧭Info', `**Dev:** \`${await client.users.cache.get(process.env.OWNER).tag}\`\n**ID:** \`${client.user.id}\`\n**Version:** ${process.env.VERSION}\n\n**Birthday:** <t:${moment(client.user.createdAt).unix()}:R>\n**Uptime:** \`${hours}\`h \`${minutes}\`m \`${seconds}\`s`, true)
            .addField(`ℹ️**${lang(message, "command.botinfo.embed.field.eleven")}**`, `${lang(message, "command.botinfo.embed.field.thirteen")}\n\n👋**${lang(message, "command.botinfo.embed.field.twelve")}**\n${lang(message, "command.botinfo.embed.field.fourteen")}`, true)
            .setThumbnail(bicon)
            .setTimestamp()
            .setColor(crimson);

        await message.channel.send({ embeds: [embed] });
    }
}
module.exports = Botinfo;