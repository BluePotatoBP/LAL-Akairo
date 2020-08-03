const { Command } = require('discord-akairo');
const Discord = require("discord.js");
const { crimson } = require("../../assets/colors.json")

class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Util',
            description: {
                content: 'Shows the bot message latency and API latency'
            }
        });
    }

    exec(message) {
        message.delete().catch(e => { });
        try {
            message.channel.send("Doing the funny stuff...").then(m => {
                let ping = m.createdTimestamp - message.createdTimestamp
                let choices = ["Please don't be like 500...", `Eh... ${ping}???`, "Funny stuff: Done", `I wish it was under ${ping}...`]
                let response = choices[Math.floor(Math.random() * choices.length)]

                const pembed = new Discord.MessageEmbed()
                    .setDescription(`🏓 Pong! \n \n**Bot Latency:** \`${ping}ms\` \n**API Latency:** \`${Math.round(this.client.ws.ping).toString()}ms\`\n \n[Discord Status Page](https://status.discord.com/)`)
                    .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
                    .setColor(crimson)
                m.edit(`${response}`, pembed)
            })

        } catch (error) {
            console.log(error)
            const lembed = new Discord.MessageEmbed()
                .setDescription(`**You:** 🏓 Ping!\n **Me:** 🏓 Pong! \n \n*Discord:* **(╯°□°）╯        ┻━┻        NO PING FOR YOU 😡**`)
                .setColor(crimson)
            message.channel.send(lembed)
        }
    } // End of exec(message)
}

module.exports = Ping;