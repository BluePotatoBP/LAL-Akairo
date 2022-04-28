const { stripIndents } = require('common-tags');
const { Command, Argument } = require('discord-akairo');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ms = require('ms');
const { crimson, lightRed, pastelGreen } = require('../../assets/colors.json')
const { delMsg } = require('../../assets/tools/util');
const Fuse = require('fuse.js');

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
            * args() {
                const command = yield {
                    type: Argument.union("commandAlias", "command"),
                    prompt: {
                        start: (message) => lang(message, "command.help.args.start"),
                        retry: (message) => lang(message, "command.help.args.retry"),
                        optional: true
                    }
                }

                return { command }
            }
        });
    }
    async exec(message, { command }) {
        await delMsg(message, 60000);

        // Get the guild prefix from cache
        let customPrefix = customPrefixes.find(c => c.guild === message.guild.id);
        const prefix = !customPrefix ? process.env.PREFIX : customPrefix.prefix;
        // Command not found embed
        const noCommandFound = this.client.util.embed()
            .setTitle(lang(message, "command.help.noCommandEmbed.title.content"))
            .setDescription(lang(message, "command.help.noCommandEmbed.desc.content"))
            .setColor(lightRed)
            .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        // If the bot has perms to send embeds send the embed
        if (message.guild.me.permissions.has(Permissions.FLAGS.EMBED_LINKS)) {
            if (command) {
                // If user gave command arguments, show command info
                try {
                    const embed = new MessageEmbed()
                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n 
                        **${lang(message, 'command.help.embedtwo.desc.two')}** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                        **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                        **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : `\`${prefix}${command.id}\``}
                        **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                        **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.categoryID.toLowerCase() === 'nsfw' ? `||${command.aliases.join(', ')}||` : command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                        .setTimestamp()

                    await message.util.send({ embeds: [embed] })
                } catch (error) { // If user gave command arguments, but the command doesn't exist, show no command found embed
                    await message.util.send({ embeds: [noCommandFound] }).catch(async e => { await message.channel.send({ content: lang(message, "command.help.noEmbedPerms.content") }) });
                }
            } else {
                // If user didn't give command arguments, show home embed
                // Define home embed
                const homeEmbed = new MessageEmbed()
                    .addField(lang(message, "command.help.homeEmbed.field.one.title.content"), lang(message, "command.help.homeEmbed.field.one.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.two.title.content"), lang(message, "command.help.homeEmbed.field.two.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.three.title.content"), lang(message, "command.help.homeEmbed.field.three.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.four.title.content"), lang(message, "command.help.homeEmbed.field.four.value.content"))
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp()
                // Define command embed
                const commandsEmbed = new MessageEmbed()
                    .setTitle(lang(message, "command.help.commandsEmbed.title.content"))
                    .setDescription(lang(message, "command.help.commandsEmbed.desc.content"))
                    .setColor(crimson)
                    .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                // Get all categories and map their commands to an array
                for (const category of this.handler.categories.values()) {
                    if (category.id === 'default' || category.id === '') { continue } else if (category) {
                        commandsEmbed.addField(`${category.id} [${category.size}]`, `${category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ')}`);
                    }
                }
                // Define buttons
                let homeBtn = new MessageButton()
                    .setCustomId('home')
                    .setEmoji('817848932209393725')
                    .setStyle('SUCCESS')
                let listBtn = new MessageButton()
                    .setCustomId('list')
                    .setEmoji('817848932364845067')
                    .setStyle('SECONDARY')
                let searchBtn = new MessageButton()
                    .setCustomId('search')
                    .setEmoji('817848932566695986')
                    .setStyle('SECONDARY')
                let exitBtn = new MessageButton()
                    .setCustomId('exit')
                    .setEmoji('817890713190662146')
                    .setStyle('DANGER')
                // Define action row and add buttons components
                const buttonRow = new MessageActionRow().addComponents([homeBtn, listBtn, searchBtn, exitBtn]);
                // Send initial message
                const msg = await message.reply({ embeds: [homeEmbed], components: [buttonRow] }).catch(async e => { await message.channel.send({ content: lang(message, "command.help.noEmbedPerms.content") }) });
                // Create a message component collector (long ass name \/)
                const filter = i => i.user.id === message.author.id;
                const buttonCollector = await msg.channel.createMessageComponentCollector({ filter, time: 60000 });
                // When a button is clicked do this
                let searchCollector;
                buttonCollector.on("collect", async i => {
                    switch (i.customId) {
                        case "home": // Home button
                            await i.update({ embeds: [homeEmbed] });
                            break;
                        case "list": // List all commands button
                            await i.update({ embeds: [commandsEmbed] });
                            break;
                        case "search": // Search button
                            await i.deferUpdate();
                            // Define search embed
                            const searchEmbed = new MessageEmbed()
                                .setTitle(lang(message, "command.help.noCommandEmbed.title.content"))
                                .setDescription(lang(message, "command.help.searchEmbed.desc.content"))
                                .setColor(crimson)
                                .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()
                            // Edit initial message
                            await msg.edit({ embeds: [searchEmbed] });
                            // Search message collector
                            const filter = m => !m.author.bot && m.author.id == message.author.id;
                            searchCollector = await msg.channel.createMessageCollector({ filter, time: 30000, max: 1 });
                            // When a message is sent do this
                            searchCollector.on("collect", async c => {
                                if (c.content.toLowerCase() === "cancel") return await msg.edit({ embeds: [homeEmbed] })
                                // Resolve command
                                let resolveType = await this.client.commandHandler.resolver.type("commandAlias");
                                let command = await resolveType(message, c.content);
                                // If command is not found ask the user if they want to try something else
                                if (!command) {
                                    if (c.content.toLowerCase() === "cancel") return await msg.edit({ embeds: [homeEmbed] })
                                    // Get all categories and push all cmds to an array
                                    let temp = [];
                                    for (const category of this.handler.categories.values()) {
                                        if (category.id === 'default' || category.id === 'Dev' || category.id === '') {
                                            continue;
                                        } else {
                                            temp.push(category.map((cmd) => `${cmd}`));
                                        }
                                    }
                                    // Since the above output looks wonk, sort it into a single array
                                    let possible = [];
                                    temp.forEach(c => { c.forEach(c => { possible.push(c) }) });
                                    // Define fuse options
                                    const options = {
                                        isCaseSensitive: false,
                                        includeScore: true,
                                        threshold: 0.5,
                                    }
                                    const fuse = await new Fuse(possible, options)
                                    // Search if input is close to a command
                                    let result = await fuse.search(c.content)
                                    // If there is a result
                                    if (result.length == 1) {
                                        // Define result
                                        result = result[0].item
                                        let command = await resolveType(message, result);
                                        // Define help embed *again*
                                        const helpEmbed = new MessageEmbed()
                                            .setTitle(lang(message, "command.help.embedtwo.title.content"))
                                            .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n
                                                                  **${lang(message, 'command.help.embedtwo.desc.two')}** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                                  **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                                                                  **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : `\`${prefix}${command.id}\``}
                                                                  **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                                  **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.categoryID.toLowerCase() === 'nsfw' ? `||${command.aliases.join(', ')}||` : command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                                            .setColor(pastelGreen)
                                            .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)

                                        await msg.edit({ embeds: [helpEmbed] });
                                    } else if (result.length > 1) {
                                        // Define multiple results embed
                                        const multipleChoice = new MessageEmbed()
                                            .setTitle("Multiple Commands Found!")
                                            .setDescription(`Sorry, I couldn\'t find that exact command, did you mean:\n\n\`[1]\` ${result[0].item}\n\`[2]\` ${result[1].item}`)
                                            .setColor(crimson)
                                            .setFooter("Type the number of the command you want to see")

                                        await msg.edit({ embeds: [multipleChoice] });
                                        // Define multiple results collector
                                        const filter = m => !m.author.bot && m.author.id == message.author.id;
                                        const multipleCollector = await msg.channel.createMessageCollector({ filter, time: 30000, max: 1 });
                                        // When a message is collected do this
                                        multipleCollector.on("collect", async i => {
                                            // If the collected is "cancel" return to home
                                            if (i.content.toLowerCase() === "cancel") return await msg.edit({ embeds: [homeEmbed] })
                                            // Predefine fuzzy embed
                                            const fuzzyEmbed = new MessageEmbed()
                                            // If the collected is "1"
                                            if (i.content === "1") {
                                                // Define result
                                                result = result[0].item
                                                let command = await resolveType(message, result);
                                                // Change fuzzy embed
                                                fuzzyEmbed.setTitle(lang(message, "command.help.embedtwo.title.content"))
                                                fuzzyEmbed.setColor(pastelGreen)
                                                fuzzyEmbed.setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                                                fuzzyEmbed.setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n
                                                **${lang(message, 'command.help.embedtwo.desc.two')}** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                                                **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : `\`${prefix}${command.id}\``}
                                                **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.categoryID.toLowerCase() === 'nsfw' ? `||${command.aliases.join(', ')}||` : command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)

                                                await msg.edit({ embeds: [fuzzyEmbed] });
                                                // If the collected is "2"
                                            } else if (i.content === "2") {
                                                // Define result
                                                result = result[1].item
                                                let command = await resolveType(message, result);
                                                // Change fuzzy embed
                                                fuzzyEmbed.setTitle(lang(message, "command.help.embedtwo.title.content"))
                                                fuzzyEmbed.setColor(pastelGreen)
                                                fuzzyEmbed.setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                                                fuzzyEmbed.setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n
                                                **${lang(message, 'command.help.embedtwo.desc.two')}** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                                                **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : `\`${prefix}${command.id}\``}
                                                **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.categoryID.toLowerCase() === 'nsfw' ? `||${command.aliases.join(', ')}||` : command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)

                                                await msg.edit({ embeds: [fuzzyEmbed] });
                                            } else { // If the collected is not "1" or "2" return to home
                                                return await msg.edit({ embeds: [homeEmbed] });
                                            }
                                        });
                                    } else { // If theres no results send no results embed
                                        await msg.edit({ embeds: [noCommandFound] })
                                    }
                                } else { // If command is found immediately; send the command embed
                                    const commandHelp = new MessageEmbed()
                                        .setTitle(lang(message, "command.help.embedtwo.title.content"))
                                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n
                                                                      **${lang(message, 'command.help.embedtwo.desc.two')}** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                                      **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                                                                      **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : `\`${prefix}${command.id}\``}
                                                                      **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                                      **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.categoryID.toLowerCase() === 'nsfw' ? `||${command.aliases.join(', ')}||` : command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                                        .setColor(pastelGreen)
                                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)

                                    await msg.edit({ embeds: [commandHelp] })
                                }
                                await searchCollector.stop() // Stop the search collector
                            });
                            break;
                        case "exit": // Exit button
                            await i.update({ components: [] });
                            await buttonCollector.stop();

                            break;
                    }
                })
            }

        } else {
            // If the bot doesnt have permissions to send embeds warn the user
            return await message.channel.send({ content: lang(message, "command.help.noEmbedPerms.content") });
        }
    }
}

module.exports = Help;