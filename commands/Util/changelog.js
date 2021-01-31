const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { ReactionCollector } = require('discord.js-collector');
const { MessageEmbed } = require('discord.js');

class Changelog extends Command {
    constructor() {
        super('changelog', {
            aliases: ['changelog'],
            category: 'Util',
            clientPermissions: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
            ownerOnly: false,
            cooldown: 20000,
            description: {
                content: 'later',
                usage: '',
                syntax: ''
            }
        });
    }

    async exec(message) {
        message.delete().catch((e) => {});

        const embed = new Discord.MessageEmbed()
            .setAuthor('📰 LAL Changelog 📰')
            .setColor(crimson)
            .setDescription('Loading...');
        const botMessage = await message.channel.send(embed);

        ReactionCollector.paginator({
            botMessage,
            user: message.author,
            pages: [
                new MessageEmbed()
                .setAuthor('📰 LAL Changelog 📰')
                .setDescription(
                    "This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete. \n You can find the Trello board [here.](https://trello.com/b/3sZpdVwe/like-a-light 'Trello Page')"
                )
                .addField(
                    '• 1.3.0',
                    `⤷ *ADDED*  \n\`Config command.\`\n\`AntiAdvert scanning (Config cmd)\`\n\`Set StaffRole command (Config cmd)\`\n\`Set Logs command (Config cmd)\`\n\`Bobross command (Image cmd)\`\n\`Respect command (Image cmd)\`\n\`Trash command (Image cmd)\` \n⤷ *FIXED/UPDATED* \n\`DB connection improved thanks to\` <@520261612997836820> \`[JBTech]\`\n\`Merged prefix cmd with config cmd\`\n\`Merged language cmd with config cmd\`\n\`Merged role add/remove cmd with config cmd\`\n\`Updated bot icon!!!\` <:lalOld:662119800301944863> -> <:lal:804373200304603136>\n\`German translations updated thanks to\` <@319183644331606016> \`[xavons]\`\n\`All commands should check for permissions now\`\n\`Many crashes ironed out\``
                )
                .setColor(crimson)
                .setFooter('Page: [1/4]', message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp(),

                new MessageEmbed()
                .setAuthor('📰 LAL Changelog 📰')
                .setDescription(
                    "This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete. \n You can find the Trello board [here.](https://trello.com/b/3sZpdVwe/like-a-light)"
                )
                .addField(
                    '• 1.2.9',
                    `⤷ *ADDED*  \n\`-\` \n⤷ *FIXED/UPDATED* \n\`What command reacts to other messages (${process.env.PREFIX}help what)\` \n\`Botinfo updated to show more stuff about frameworks\`\n\`Serverinfo updated to show all guild roles with pages\`\n\`German translations updated thanks to\` <@319183644331606016>`
                )
                .addField(
                    '• 1.2.8',
                    '⤷ *ADDED*  \n`Play command.`\n`Hangman game. (Play cmd)`\n`Connect4 game. (Play cmd)` \n`Snake game. (Play cmd)` \n⤷ *FIXED/UPDATED* \n`Merged addrole/removerole commands`\n`German translations updated thanks to` <@319183644331606016>'
                )
                .setColor(crimson)
                .setFooter('Page: [2/4]', message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp(),

                new MessageEmbed()
                .setAuthor('📰 LAL Changelog 📰')
                .setDescription(
                    "This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete. \n You can find the Trello board [here.](https://trello.com/b/3sZpdVwe/like-a-light)"
                )
                .addField(
                    '• 1.2.7',
                    '⤷ *ADDED*  \n`Changelog command.` \n⤷ *FIXED/UPDATED* \n`Google command crashing the bot.`\n`README.md updated to include discord invite.`'
                )
                .addField(
                    '• 1.2.5',
                    '⤷ *ADDED*  \n`Language command.`\n`Slowmode command.`\n`Translations.`\n`README.md` \n⤷ *FIXED/UPDATED* \n`A lot of legacy code updated.`\n`Fixed inconsistencies with colors etc.`'
                )
                .setColor(crimson)
                .setFooter('Page: [3/4]', message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp(),

                new MessageEmbed()
                .setAuthor('📰 LAL Changelog 📰')
                .setDescription(
                    "This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete. \n You can find the Trello board [here.](https://trello.com/b/3sZpdVwe/like-a-light)"
                )
                .addField(
                    '• 1.2.0',
                    '⤷ *ADDED*  \n`Initial push to GitHub 🤷‍♀️`\n⤷ *FIXED/UPDATED* \n`Initial push to GitHub 🤷‍♀️`'
                )
                .addField('• 1.0.0', '⤷ *ADDED*  \n`-`\n⤷ *FIXED/UPDATED* \n`-`')
                .setColor(crimson)
                .setFooter('Page: [4/4]', message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
            ],
            collectorOptions: {
                time: 300000
            }
        });
    }
}
module.exports = Changelog;