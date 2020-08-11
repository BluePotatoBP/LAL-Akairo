const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { pastelGreen, lightRed } = require('../../assets/colors.json')
const mysql2 = require('mysql2/promise');

class SetPrefix extends Command {
    constructor() {
        super('setprefix',
            {
                aliases: ['setprefix', 'sprefix', 'spr', 'prefix'],
                category: 'Mod',
                clientPermissions: ['SEND_MESSAGES'],
                userPermissions: ['MANAGE_MESSAGES'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: 'Set the bot prefix for this server',
                    usage: 'fill later',
                    syntax: 'fill later'
                },
                args: [
                    {
                        id: 'p',
                        match: 'text',
                        type: 'string',
                    },
                ]
            });
    }

    async exec(message, { p }) {
        message.delete().catch(e => { });
        const prefixEmbed = new Discord.MessageEmbed()

        let [data] = await DB.query(`SELECT * FROM prefixes WHERE guildId = ?`, [message.guild.id])

        if (!p) {
            if (data.length === 0) {

                prefixEmbed.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                prefixEmbed.setDescription(`The prefix for this guild is: \`${process.env.PREFIX}\` \nTo set a custom prefix use \`${process.env.PREFIX}setprefix\``)
                prefixEmbed.setColor(pastelGreen)

                message.channel.send(prefixEmbed)

            } else {
                prefixEmbed.setDescription(`The prefix for this guild is: \`${data[0].prefix}\``)
                prefixEmbed.setColor(pastelGreen)
                message.channel.send(prefixEmbed)

            }
        } else if (p.length > 5) {
            prefixEmbed.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            prefixEmbed.setDescription('You cannot set a prefix thats longer then \`5\` letters.')
            prefixEmbed.setColor(lightRed)

            message.channel.send(prefixEmbed)

        } else {
            if (data.length !== 0) {
                DB.query("UPDATE prefixes SET prefix = ? WHERE guildId = ?", [p, message.guild.id])

                prefixEmbed.setDescription(`The prefix for this guild has been updated to: \`${p}\``)
                prefixEmbed.setColor(pastelGreen)
    
                message.channel.send(prefixEmbed)

            } else {
                await DB.query(`INSERT INTO prefixes (guildId, prefix) VALUES(?, ?)`, [message.guild.id, p])

                prefixEmbed.setDescription(`The new prefix for this guild is: \`${p}\``)
                prefixEmbed.setColor(pastelGreen)
    
                message.channel.send(prefixEmbed)

            }
        }


        //DB.query(`INSERT INTO prefixes (guildId, prefix VALUES(?, ?)`,[message.guild.id, p])

        //DB.query("UPDATE prefixes SET prefix = ? WHERE guildId = ?", [p, message.guild.id])

        //DB.query("DELETE FROM prefixes WHERE guild = ?", [message.guild.id])

        //console.log(data[0].prefix)
        //console.log(data[0].guildId)
    }
}
module.exports = SetPrefix;