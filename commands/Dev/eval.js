const { Command } = require('discord-akairo');
const Discord = require("discord.js");
const { inspect } = require("util")
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require("../../assets/colors.json")
var PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
        'api_dev_key': 'ea18216abe69e7ead54e74ca1e98b4b5',
        'api_user_name': 'BluePotatoBP',
        'api_user_password': `${process.env.PASTEBINPASSWORD}`
    });;

class Eval extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            ownerOnly: true,
            description: {
                content: 'Evaluate big brain code'
            },
            args: [
                {
                    id: 'text',
                    match: 'text',
                    type: 'string',

                },
            ]
        });
    }

    async exec(message, args) {
        try {
            var toEval = args.text;
            var evaluated = inspect(eval(toEval, { depth: 0 }))
            if (evaluated.length >= 1900) {
                var wmessage = await message.channel.send("Output is too long, creating a pastebin link... <a:gears:773203929507823617>")
                try {
                    pastebin
                        .createPaste({
                            text: evaluated,
                            title: `Eval output; private`,
                            format: "javascript",
                            privacy: 2,
                            expiration: '1M'
                        })
                        .then(async function (data) {
                            if (toEval) {
                                let evalembed = new Discord.MessageEmbed()
                                    .setAuthor("I did it boss, maywe thewes an oopsie hewe or thewe tho...", client.user.avatarURL({ dynamic: true }))
                                    .addField("Input Code", `\`\`\`\n${toEval}\n\`\`\``)
                                    .addField("Output Code", `\n[Click here](${data}) for full output`, { maxLength: 1900 })
                                    .setColor(veryBrightGreen)
                                wmessage.edit(evalembed)

                            } else {
                                let embedo = new Discord.MessageEmbed()
                                    .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                                    .setDescription(`<:redxmark:627905972731510784> Too few arguments given. \n \nUsage: \`${module.exports.help.name} ${module.exports.help.usage}\` \nAliases: \`none\``)
                                    .setColor(crimson)
                                message.channel.send(embedo)
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            message.channel.send("Couldn't send the output to pastebin.com")
                        });

                } catch (e) {
                    let badevalembed = new Discord.MessageEmbed()
                        .setAuthor("An error occurred whilst evaluating:", client.user.avatarURL({ dynamic: true }))
                        .addField("Input Code", `\`\`\`\n${toEval}\n\`\`\``)
                        .addField("Error", `\`\`\`\n${e.message}\n\`\`\``)
                        .setColor(darkRed)
                    message.channel.send(badevalembed)
                }
            } else {
                if (toEval) {
                    let evalembed = new Discord.MessageEmbed()
                        .setAuthor("I did it boss, maywe thewes an oopsie hewe or thewe tho...", client.user.avatarURL({ dynamic: true }))
                        .addField("Input Code", `\`\`\`\n${toEval}\n\`\`\``)
                        .addField("Output Code", `\nJust below this, boss`)
                        .setColor(veryBrightGreen)
                    return message.channel.send(evalembed) + message.channel.send(`\`\`\`javascript\n${evaluated}\n\`\`\``)

                } else {
                    let embedo = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`<:redxmark:627905972731510784> Too few arguments given. \n \nUsage: \`${module.exports.help.name} ${module.exports.help.usage}\` \nAliases: \`none\``)
                        .setColor(crimson)
                    message.channel.send(embedo)
                }
            }
        } catch (error) {
            let evalembed = new Discord.MessageEmbed()
                .setAuthor("I did it boss, bwut thewes an oopsie fow suwe...", client.user.avatarURL({ dynamic: true }))
                .addField("Input Code", `\`\`\`\n${toEval}\n\`\`\``)
                .addField("Output Code", `\n\`\`\`${error.message}\`\`\`\n`, { maxLength: 1900 })
                .setColor(darkRed)
            message.channel.send(evalembed)
        }
    }
}
module.exports = Eval;