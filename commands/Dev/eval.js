const chalk = require('chalk');
const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { inspect } = require('util');
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require('../../assets/colors.json');
const paste = require('better-pastebin');
paste.setDevKey(process.env.PASTEBINKEY);

class Eval extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval'],
            ownerOnly: true,
            category: '',
            description: {
                content: '',
                usage: '',
                syntax: ''
            },
            args: [
                {
                    id: 'code',
                    match: 'text',
                    type: 'string',
                    default: 'null'
                },
                {
                    id: "aw",
                    match: "flag",
                    flag: ['-await', '-a']
                }
            ]
        });
    }

    async exec(message, { code, aw }) {
        const token = this.client.token.split('').join('[^]{0,2}');
        const rev = this.client.token.split('').reverse().join('[^]{0,2}');
        const tokenRegex = new RegExp(`${token}|${rev}`, 'g');
        let evaluated;

        if (JSON.stringify(code).match(/(process.env.DISCORD_TOKEN|this.client.token|client.token)/gmi)) return await message.channel.send({ content: "ha ha eat my ass"});

        try {
            evaluated = inspect(await eval(aw ? `(async() => { ${code} })()` : code, { depth: 1 })); 
            evaluated.replace(tokenRegex, '[FUCK YOU]')
        } catch (error) {
                const evalembed = new Discord.MessageEmbed()
                    .setAuthor('I did it boss, bwut thewes an oopsie fow suwe...', client.user.displayAvatarURL({ dynamic: true }))
                    .addField('Input Code', `\`\`\`\n${code}\n\`\`\``)
                    .addField('Output Code', `\n\`\`\`${error.message}\`\`\`\n`, { maxLength: 1900 })
                    .setColor(darkRed);
    
                return await message.channel.send({ embeds: [evalembed] });
        }

        if (evaluated && evaluated.length > 1900) {
            let wmessage = await message.channel.send({ content: 'Output is too long, creating a pastebin link... <a:gears:773203929507823617>' });
            // Log into pastebin and create a paste
            paste.login('BluePotatoBP', process.env.PASTEBINPASSWORD, function (success, data) {
                if (!success) return console.log('Failed to log into PasteBin (' + data + ')');
                paste.create({
                    contents: `${evaluated}`,
                    name: 'Eval; private',
                    privacy: '2',
                    expires: '1D',
                    format: 'javascript'
                }, async function (success, data) {
                        if (success) {
                            if (code) {
                                let evalembed = new Discord.MessageEmbed()
                                    .setAuthor('I did it boss, maywe thewes an oopsie hewe or thewe tho...', client.user.displayAvatarURL({ dynamic: true }))
                                    .addField('Input Code', `\`\`\`\n${code}\n\`\`\``)
                                    .addField('Output Code', `\n[Click here](${data}) for full output`, { maxLength: 1900 })
                                    .setColor(veryBrightGreen);

                                await wmessage.edit({ embeds: [evalembed] });
                            } else {
                                let embedo = new Discord.MessageEmbed()
                                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                                    .setDescription(`<:redxmark:627905972731510784> Too few arguments given. \n \nUsage: \`${module.exports.help.name} ${module.exports.help.usage}\` \nAliases: \`none\``)
                                    .setColor(crimson);

                                await message.channel.send({ embeds: [embedo] });
                            }
                        } else {
                            console.log(data);
                            await message.channel.send({ content: "Couldn't send the output to pastebin.com" });
                        }
                    }
                );
            });
        } else {
            if (code) {
                let evalembed = new Discord.MessageEmbed()
                    .setAuthor('I did it boss, maywe thewes an oopsie hewe or thewe tho...', client.user.displayAvatarURL({ dynamic: true }))
                    .addField('Input Code', `\`\`\`\n${code}\n\`\`\``)
                    .addField('Output Code', `\nJust below this, boss`)
                    .setColor(veryBrightGreen);

                console.log(debug('[DEBUG]') + " Eval Output:" + chalk.gray(`\n${evaluated}`))
                return ((await message.channel.send({ embeds: [evalembed] })) + (await message.channel.send({ content: `\`\`\`javascript\n${evaluated}\n\`\`\`` })));
            } else {
                let embedo = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<:redxmark:627905972731510784> Too few arguments given. \n \nUsage: \`${module.exports.help.name} ${module.exports.help.usage}\` \nAliases: \`none\``)
                    .setColor(crimson);

                await message.channel.send({ embeds: [embedo] });
            }
        }

        console.log(`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] in '${message.guild.name}'[${message.guild.id}] used: \n${chalk.gray(`${process.env.PREFIX}eval ${code}`)}`);
    }
}
module.exports = Eval;