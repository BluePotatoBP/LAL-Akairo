const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const Akairo = require('discord-akairo');
const { delMsg } = require('../../assets/tools/util');

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
            .addField(`**${lang(message, 'command.botinfo.embed.field.one')}**`, `\`BluePotatoBP#5214\``, true)
            .addField(`**${lang(message, 'command.botinfo.embed.field.two')}**`, `\`${client.user.id}\``, true)
            .addField(`**${lang(message, 'command.botinfo.embed.field.three')}**`, `\`${process.env.VERSION}\``, true)
            .addField(`**${lang(message, 'command.botinfo.embed.field.four')}**`, `\`${client.user.createdAt.toUTCString().substr(0, 16)}\``, true)
            .addField(`**${lang(message, 'command.botinfo.embed.field.five')}**`, `\`${hours}\`h \`${minutes}\`m \`${seconds}\`s`, true)
            .addField(`**${lang(message, "command.botinfo.embed.field.ten")}**`, `Akairo: \`v${Akairo.version}\`\nDiscordJS: \`v${Discord.version}\`\nNodeJS: \`${process.version}\``, true)
            .addField(`**${lang(message, "command.botinfo.embed.field.eleven")}**`, `${lang(message, "command.botinfo.embed.field.thirteen")} [Invite](https://discord.gg/v8zkSc9 'Support Server')`, true)
            .addField(
                `**${lang(message, "command.botinfo.embed.field.twelve")}**`,
                `${lang(message, "command.botinfo.embed.field.fourteen")} [Invite](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1342504007 'Invite the bot')`, true)
            .setThumbnail(bicon)
            .setTimestamp()
            .setColor(crimson);

        await message.channel.send({ embeds: [embed] });
    }
}
module.exports = Botinfo;