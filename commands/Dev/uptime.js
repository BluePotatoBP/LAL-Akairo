const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Uptime extends Command {
    constructor() {
        super('uptime',
            {
                aliases: ['uptime'],
                ownerOnly: true,
                description: {
                    content: 'Shows the bot instance uptime'
                },
            });
    }

    async exec(message) {
        message.delete().catch(e => { });
        try {
            var seconds = parseInt((client.uptime / 1000) % 60),
                minutes = parseInt((client.uptime / (1000 * 60)) % 60),
                hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            var bicon = client.user.avatarURL({ dynamic: true });
            const words = ["Benis", "Yes", "Word", "Discord", "lol", "Yeet", "Sad", "Bored", "Woke", "Dot.", "No", "Uptime", "You", "Bruh", "Train", "Overview", "Tutorial", "Keyboard", "Bender"]

            var embed = new Discord.MessageEmbed()
                .setThumbnail(bicon)
                .setAuthor(`Word of the day: ${words[~~(Math.random() * words.length)]} `, bicon)
                .addField('Uptime', `\`${hours}\`h \`${minutes}\`m \`${seconds}\`s`)
                .setColor(crimson)
                .setTimestamp()
                .setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉`)
            message.channel.send(embed)
        } catch (error) {
            console.log(error)
            message.channel.send("Oopsie happened 🤷‍♀️")
        }
    }
}
module.exports = Uptime;