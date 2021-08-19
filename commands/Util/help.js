const chalk = require('chalk');
const { stripIndents } = require('common-tags');
const { Command } = require('discord-akairo');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ms = require('ms');
const { crimson, lightRed, pastelGreen } = require('../../assets/colors.json')
const { delMsg } = require('../../assets/tools/util');

class Help extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'Shows you this message',
                usage: '[command}',
                syntax: '[] - optional'
            },
            * args(message) {
                const command = yield {
                    prompt: {
                        start: `What command would you like to check?`,
                        retry: `I didn't quite get that, what command would you like to check?`,
                        optional: true
                    }
                }

                return { command }
            }
        });
    }
    async exec(message, { command }) {
        await delMsg(message, 60000)

        let [data] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);
        let prefix;

        data.length === 0 ? prefix = process.env.PREFIX : prefix = await data[0].prefix;

        if (message.guild.members.cache.get(this.client.user.id).permissions.has(Permissions.FLAGS.ADD_REACTIONS)) { // If the bot has perms to add reactions use new help
            if (command) { // If user gave cmd args, show cmd info
                try {
                    const embed = new MessageEmbed()
                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n 
                        **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                        **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                        **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                        **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                        **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                        .setTimestamp()

                    return message.util.send({ embeds: [embed] });
                } catch (error) {
                    const noCommandFound = this.client.util.embed()
                        .setTitle(`${this.client.user.username} Help | Search`)
                        .setDescription("No command found, try again.")
                        .setColor(lightRed)
                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()

                    message.util.send({ embeds: [noCommandFound] })
                }
            } else { //No command given. send main embed

                const homeEmbed = new MessageEmbed()
                    .addField("<:home:817848932209393725> | Home", "Returns to this page")
                    .addField("<:library:817848932364845067> | Commands", "Shows all categories along with their commands")
                    .addField("<:search:817848932566695986> | Search", "Search for any command or alias")
                    .addField("<:exit:817890713190662146> | Exit", "Cancel this command")
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp()

                const commandsEmbed = new MessageEmbed()
                    .setTitle(`${this.client.user.username} Help | Commands`)
                    .setDescription(`View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``)
                    .setColor(crimson)
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                for (const category of this.handler.categories.values()) {
                    if (category.id === 'default' || category.id === '') { continue } else if (category) {
                        commandsEmbed.addField(`${category.id} [${category.size}]`, `${category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ')}`);
                    }
                }
                // Define buttons
                let homeBtn = new MessageButton()
                    .setCustomId('home')
                    .setEmoji('817848932209393725')
                    .setStyle('SUCCESS');
                let listBtn = new MessageButton()
                    .setCustomId('list')
                    .setEmoji('817848932364845067')
                    .setStyle('SECONDARY');
                let searchBtn = new MessageButton()
                    .setCustomId('search')
                    .setEmoji('817848932566695986')
                    .setStyle('SECONDARY');
                let exitBtn = new MessageButton()
                    .setCustomId('exit')
                    .setEmoji('817890713190662146')
                    .setStyle('DANGER');

                // Define action row and add buttons components
                const buttonRow = new MessageActionRow().addComponents([homeBtn, listBtn, searchBtn, exitBtn]);
                // Send initial message
                const msg = await message.util.reply({ embeds: [homeEmbed], components: [buttonRow] })

                // Filter for a button with id 'primary' and for specific user clicking it
                const filter = i => i.user.id === message.author.id;
                // Create a message component collector (long ass name \/)
                const buttonCollector = msg.channel.createMessageComponentCollector({ filter, time: 60000 });

                const exitEmbed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`<a:cancel:773201205056503849> Help command canceled.\n\n**Reason:** manually closed`)
                    .setTimestamp()

                let searchCollector;

                buttonCollector.on("collect", async i => {
                    switch (i.customId) {
                        case "home":
                            await i.update({ embeds: [homeEmbed] });
                            break;
                        case "list":
                            await i.update({ embeds: [commandsEmbed] });
                            break;
                        case "search":
                            await i.deferUpdate();

                            const searchEmbed = new MessageEmbed()
                                .setTitle(`${this.client.user.username} Help | Search`)
                                .setDescription("Find commands or aliases by typing a query")
                                .setColor(crimson)
                                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()

                            await message.util.send({ embeds: [searchEmbed] });

                            // Search message collector filter
                            const filter = m => !m.author.bot && m.author.id == message.author.id;
                            // Search message collector
                            searchCollector = await msg.channel.createMessageCollector({ filter, time: 30000 });
                            // On collect do funny
                            searchCollector.on("collect", async c => {

                                if (c.content.toLowerCase() === "cancel") return await message.util.send({ embeds: [homeEmbed] })

                                let resolveType = await this.client.commandHandler.resolver.type("commandAlias");
                                let command = await resolveType(message, c.content);

                                if (!command) {

                                    const noCommandFound = new MessageEmbed()
                                        .setTitle(`${this.client.user.username} Help | Search`)
                                        .setDescription("No command found, try again.")
                                        .setColor(lightRed)
                                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                        .setTimestamp()

                                    await message.util.send({ embeds: [noCommandFound] })
                                } else {

                                    const commandHelp = new MessageEmbed()
                                        .setTitle(`${this.client.user.username} Help | Search Result`)
                                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n
                                                                      **Command:** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                                      **Description:** ${lang(message, `command.${command.id}.desc.content`)}
                                                                      **Usage:** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                                                                      **Cooldown:** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                                      **Aliases:** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                                        .setColor(pastelGreen)
                                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)

                                    await message.util.send({ embeds: [commandHelp] })
                                }
                                await searchCollector.stop()
                            })
                            break;
                        case "exit":
                            await i.update({ embeds: [exitEmbed], components: [] });
                            await buttonCollector.stop();
                            await searchCollector.stop()

                            break;
                    }
                })
            }

        } else { // If the bot doesnt have reaction add permissions, show old help
            if (!command) { // If theres no cmd input show list of cmds
                let categories = this.handler.categories.values();
                let total = [];

                for (const category of categories) {
                    total.push(parseInt(category.size));
                    const title = category.id;

                    if (title == 'default') { continue } else if (title) {
                        const dir = category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ');
                        embed.setDescription(`${lang(message, 'command.help.embed.desc.one')} \`${prefix}\` \n${lang(message, 'command.help.embed.desc.two')} \`${this.client.user.username}\`:`);
                        embed.addField(`> ${category} (${category.size}):`, dir);
                    }
                }

                embed.setFooter(`🎉 ${this.client.user.username} 🎉 | ${lang(message, 'command.help.embed.footer.one')} ${total.reduce((a, b) => a + b, 0)}`, this.client.user.displayAvatarURL({ dynamic: true }));
                embed.addField(`${lang(message, 'command.help.embed.field.one')}`, `\n${lang(message, 'command.help.embed.field.two')} [${lang(message, 'command.help.embed.field.three')}](https://discord.gg/v8zkSc9) ${lang(message, 'command.help.embed.field.four')} [${lang(message, 'command.help.embed.field.three')}](https://discordapp.com/oauth2/authorize?this.client_id=${this.client.user.id}&scope=bot&permissions=8).`);

                await message.util.send({ embeds: [embed] });
            } else { // If theres a command input show cmd info
                if (!command) return message.util.send({ embeds: [embed.setTitle(lang(message, 'command.help.embed.title.one')).setDescription(`${lang(message, 'command.help.embed.title.desc.one')} \`${prefix}help\` ${lang(message, 'command.help.embed.title.desc.two')}`)] });

                console.log(`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] used ${chalk.gray(`"${prefix}help ${command.id.toLowerCase()}"`)} in '${message.guild.name}'[${message.guild.id}]`);

                embed.setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n 
                **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`);

                embed.setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`);

                return message.util.send({ embds: [embed] });
            }
        }
    }
}

module.exports = Help;