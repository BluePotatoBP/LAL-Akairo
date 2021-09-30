const { Command } = require('discord-akairo');
const Discord = require("discord.js");
const { crimson } = require("../../assets/colors.json");
const { delMsg } = require('../../assets/tools/util');

class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 10000,
            ratelimit: 2,
            description: {
                content: 'Shows the bot message latency and API latency'
            }
        });
    }

    async exec(message) {
        delMsg(message);

        let dbPing;
        let [data] = await DB.query(`SELECT * FROM keepAlive`)

        if (data.length === 0) {
            let dbPingOne;
            let dbPingTwo;

            await DB.query(`INSERT INTO keepAlive VALUES(?)`, ['.']).then(dbPingOne = Date.now())
            await DB.query("DELETE FROM keepAlive").then(dbPingTwo = Date.now())

            dbPing = dbPingTwo - dbPingOne + "ms"
            dbPing < 0 ? dbPing : 'Error'

        } else await DB.query("DELETE FROM keepAlive")

        /* try { */
        await message.channel.send({ content: "Doing the funny stuff..." }).then(m => {
            let ping = m.createdTimestamp - message.createdTimestamp
            let choices = ["Please don't be like 500...", `Eh... ${ping}???`, "Funny stuff: Done", `I wish it was under ${ping}...`]
            let response = choices[Math.floor(Math.random() * choices.length)]

            const pembed = new Discord.MessageEmbed()
                .setDescription(`🏓 Pong! \n \n**Bot Latency:** \`${ping}ms\` \n**API Latency:** \`${Math.round(this.client.ws.ping).toString()}ms\`\n**Database Latency:** \`${dbPing ? dbPing : 'ERROR'}\`\n \n[Discord Status Page](https://status.discord.com/)`)
                .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                .setColor(crimson)

            m.edit({ content: response, embeds: [pembed] })
        })
    } 
}

module.exports = Ping;