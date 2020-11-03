const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
const mysql2 = require('mysql2/promise');

class Language extends Command {
    constructor() {
        super('language',
            {
                aliases: ['language', 'lang'],
                category: 'Mod',
                ownerOnly: false,
                cooldown: 10000,
                clientPermissions: ['SEND_MESSAGES'],
                userPermissions: ['MANAGE_MESSAGES'],
                description: {
                    content: 'Change the bots language for this guild\n**Currently supported languages:** \`en-US\` \n',
                    usage: '[language]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'i',
                        match: 'phrase',
                        type: ['english', 'german'],
                        prompt: {
                            start: message => lang(message, "command.language.prompt.start"),
                            retry: message => lang(message, "command.language.prompt.retry"),
                            optional: true
                        }
                    },
                ]
            });
    }

    async exec(message, { i }) {
        message.delete({ timeout: 30000 }).catch(e => { });
        let [data] = await DB.query(`SELECT * FROM languages WHERE guildId = ?`, [message.guild.id])

        if (!i) {

            let checkedLang;
            if (data.length === 0) {
                checkedLang = "en"
            } else {
                checkedLang = data[0].language;
            }

            const currentLang = new Discord.MessageEmbed()
                .setDescription(`${lang(message, "command.language.currentLang.desc")} \`${checkedLang}\``)
                .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                .setColor(crimson)
                .setTimestamp()

            message.channel.send(currentLang)
        } else {
            if (data.length === 0) {
                await DB.query(`INSERT INTO languages (guildID, language) VALUES(?, ?)`, [message.guild.id, i])
                const langSet = new Discord.MessageEmbed()
                    .setDescription(`${lang(message, "command.language.langSet.desc")} \`${i}\``)
                    .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp()

                message.channel.send(langSet)
            } else {
                await DB.query("UPDATE languages SET language = ? WHERE guildId = ?", [i, message.guild.id])
                const langUpdate = new Discord.MessageEmbed()
                    .setDescription(`${lang(message, "command.language.langUpdate.desc")} \`${i}\``)
                    .setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp()

                message.channel.send(langUpdate)
            }
        }

        let languageInArrayFind = guildLanguages.find(c => c.guildID == message.guild.id);
        if (languageInArrayFind) languageInArrayFind.lan = i;
        if (!languageInArrayFind) guildLanguages.push({
            guildID: message.guild.id,
            lan: i
        })
    }
}
module.exports = Language;