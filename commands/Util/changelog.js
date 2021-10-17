const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { MessageEmbed } = require('discord.js');
const { delMsg } = require('../../assets/tools/util');

class Changelog extends Command {
    constructor() {
        super('changelog', {
            aliases: ['changelog'],
            category: 'Util',
            ownerOnly: false,
            ownerOnly: false,
            cooldown: 5000,
            description: {
                content: 'later',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        await delMsg(message, 30000);

        const embed = new Discord.MessageEmbed()
            .setAuthor('📰 LAL Changelog 📰')
            .setDescription(`Changelog has been moved to [Github Gists](https://gist.github.com/BluePotatoBP/9e832c43ba45efba0b8da9fb9ebeb679 'Click here to visit gist.github.com')!`)
            .setColor(crimson)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        await message.channel.send({ embeds: [embed] });
    }
}
module.exports = Changelog;