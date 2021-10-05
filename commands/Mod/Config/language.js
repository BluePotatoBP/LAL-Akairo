const { Command } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const { crimson, darkRed } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class Language extends Command {
    constructor() {
        super('language', {
            aliases: ['language', 'lang'],
            category: 'Mod',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: '',
                usage: '[language]',
                syntax: '[] - optional'
            },

            * args(message) {
                let action = yield {
                    type: ['contribute', 'german', 'english'],
                    default: 'showLan',
                    prompt: {
                        start: lang(message, 'command.language.prompt.start'),
                        retry: lang(message, 'command.language.prompt.retry'),
                        optional: true
                    }
                };

                //Set new Language
                if (action !== 'contribute') {
                    const i = action;
                    action = 'translate';
                    return { i, action };
                }

                //Show current language
                if (action == 'showLan') {
                    action = 'translate';
                    const i = 'showLan';
                    return { i, showLan };
                }

                //Contribute
                if (action == 'contribute') return { action };
            }
        });
    }

    async exec(message, { action, i }) {
        await delMsg(message, 30000);

        if (action == 'translate') {
            let [guildLanguageDB] = await DB.query(`SELECT * FROM languages WHERE guild = ? `, [
                message.guild.id
            ]);
            let languageInArrayFind = await guildLanguages.find((c) => c.guildID == message.guild.id);

            if (i == 'showLan') {
                let currentLan = languageInArrayFind ? languageInArrayFind.lan : 'english';
                const currentLang = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, 'command.language.currentLang.desc1')} \`${currentLan}\`\n\n${lang(message, "command.language.currentLang.desc2")} \`${process.env.PREFIX}language [language]\`\n\n**${lang(message, "command.language.currentLang.desc3")}**\n\`english, german\``)
                    .setFooter('Syntax: [] - optional')
                    .setColor(crimson)
                    .setTimestamp();

                return await message.channel.send({ embeds: [currentLang] });
            }

            const noPermsEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`<a:cancel:773201205056503849> You are missing the \`MANAGE_GUILD\` permissions.`)
                .setColor(darkRed)
                .setTimestamp()

            if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return await message.channel.send({ embeds: [noPermsEmbed] });

            if (languageInArrayFind) languageInArrayFind.lan = i;
            if (!languageInArrayFind) guildLanguages.push({
                    guildID: message.guild.id,
                    lan: i
                });

            if (guildLanguageDB.length == 0)
                await DB.query(`INSERT INTO languages VALUES(?,?)`, [message.guild.id, i]);
            if (guildLanguageDB.length > 0)
                await DB.query(`UPDATE languages SET language = ? WHERE guild = ?`, [i, message.guild.id]);

            const langUpdate = new MessageEmbed()
                .setDescription(`${lang(message, 'command.language.langUpdate.desc')} \`${i}\``)
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(crimson)
                .setTimestamp();

            await await message.channel.send({ embeds: [langUpdate] });
        } else {
            const contEmbed = new MessageEmbed()
                .setDescription(lang(message, 'command.language.contEmbed.desc'))
                .setColor(crimson);
            await message.util.send({ embeds: [contEmbed] });
            await message.util.send({ files: ['./assets/languages/lang/english.json'] });
        }
    }
}
module.exports = Language;