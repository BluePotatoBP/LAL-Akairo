const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Invite extends Command {
    constructor() {
        super('invite', {
            aliases: ['invite'],
            category: 'Util',
            ownerOnly: false,
            ownerOnly: false,
            cooldown: 5000,
            description: {
                content: 'Invite me to your server!',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        await delMsg(message);

        let iembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`[${lang(message, 'command.invite.iembed.desc.one')}](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1342565446) ${lang(message, 'command.invite.iembed.desc.two')}`)
            .setColor(crimson)
            .setTimestamp();

        await message.channel.send({ embeds: [iembed] });
    }
}
module.exports = Invite;