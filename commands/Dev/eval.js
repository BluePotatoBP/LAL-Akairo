const chalk = require('chalk');
const { Command } = require('discord-akairo');
const Discord = require("discord.js");
const { inspect } = require("util")
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require("../../assets/colors.json")
const paste = require("better-pastebin");
paste.setDevKey(process.env.PASTEBINKEY);

class Eval extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            ownerOnly: true,
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
            let toEval = args.text;
            let evaluated = inspect(eval(toEval, { depth: 0 }))
            console.log(`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] in '${message.guild.name}'[${message.guild.id}] used: \n${chalk.gray(`${process.env.PREFIX}eval ${toEval}`)}`)
            // Check if the message is over 1.9k characters (dc limit)
            if (evaluated.length >= 1900) {
                let wmessage = await message.channel.send("Output is too long, creating a pastebin link... <a:gears:773203929507823617>")
                try {
                    // Log into pastebin and create a paste
                    paste.login("BluePotatoBP", process.env.PASTEBINPASSWORD, function (success, data) {
                        if (!success) {
                            console.log("Failed (" + data + ")");
                            return false;
                        }
                        paste.create({
                            contents: `${evaluated}`,
                            name: "Serverlist; private",
                            privacy: "2",
                            expires: '1D',
                            format: 'javascript'
                        }, async function (success, data) {
                            if (success) {
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
                            } else {
                                console.log(data);
                                message.channel.send('Couldn\'t send the output to pastebin.com')
                            }
                        });
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