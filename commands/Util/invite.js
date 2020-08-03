const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { ultraBlue } = require('../../assets/colors.json')

class Invite extends Command {
    constructor() {
        super('invite',
            {
                aliases: ['invite'],
                category: 'Util',
                ownerOnly: false,
                description: {
                    content: 'Invite me to your server!'
                },
            });
    }

    async exec(message) {
        message.delete().catch(e => { });

        let iembed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setDescription(`[Invite](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8) me with \`ADMINISTRATOR\` perms! \`(Recommended)\`\n or \n[Invite](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2080759927) me with \`ESSENTIAL\` perms! \`(2nd best option)\`\n or \n[Invite](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2048) me with only \`SEND MESSAGES\` perms! \`(Not Recommended)\`\n \nThe reason why I recommend administrator is so the bot can do \nmost stuff like delete messages after sent commands, send \na message to a channel in lockdown, etc. without interruptions! \nOr if you're not combortable with that you can pick the \n"essential" permissions. <a:blobEat:605179705242550388>`)
            .setColor(ultraBlue)
            .setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉`, `${client.user.avatarURL({ dynamic: true })}`)
            .setTimestamp()

        message.channel.send(iembed)
    }
}
module.exports = Invite;