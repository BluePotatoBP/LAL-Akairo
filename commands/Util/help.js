const chalk = require('chalk');
const { stripIndents } = require('common-tags');
const { Command, Argument } = require('discord-akairo');
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
        await delMsg(message, 60000)

        // Get the guild prefix from cache
        let customPrefix = customPrefixes.find(c => c.guild === message.guild.id);
        const prefix = !customPrefix ? process.env.PREFIX : customPrefix.prefix;
        const noCommandFound = this.client.util.embed()
            .setTitle(lang(message, "command.help.noCommandEmbed.title.content"))
            .setDescription(lang(message, "command.help.noCommandEmbed.desc.content"))
            .setColor(lightRed)
            .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        // If the bot has perms to add reactions use new help
        if (message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (command) { // If user gave cmd args, show cmd info
                try {
                    const embed = new MessageEmbed()
                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n 
                        **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                        **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                        **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                        **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                        **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                        .setTimestamp()

                    return await message.util.send({ embeds: [embed] });
                } catch (error) {
                    await message.util.send({ embeds: [noCommandFound] })
                }
            } else { //No command given. send main embed

                const homeEmbed = new MessageEmbed()
                    .addField(lang(message, "command.help.homeEmbed.field.one.title.content"), lang(message, "command.help.homeEmbed.field.one.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.two.title.content"), lang(message, "command.help.homeEmbed.field.two.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.three.title.content"), lang(message, "command.help.homeEmbed.field.three.value.content"))
                    .addField(lang(message, "command.help.homeEmbed.field.four.title.content"), lang(message, "command.help.homeEmbed.field.four.value.content"))
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp()

                const commandsEmbed = new MessageEmbed()
                    .setTitle(lang(message, "command.help.commandsEmbed.title.content"))
                    .setDescription(lang(message, "command.help.commandsEmbed.desc.content"))
                    .setColor(crimson)
                    .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
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
                const msg = await message.reply({ embeds: [homeEmbed], components: [buttonRow] })
                const filter = i => i.user.id === message.author.id;
                // Create a message component collector (long ass name \/)
                const buttonCollector = await msg.channel.createMessageComponentCollector({ filter, time: 60000 });

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
                                .setTitle(lang(message, "command.help.noCommandEmbed.title.content"))
                                .setDescription(lang(message, "command.help.searchEmbed.desc.content"))
                                .setColor(crimson)
                                .setFooter(lang(message, "command.help.noCommandEmbed.footer.content"), message.author.displayAvatarURL({ dynamic: true }))
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
                                    await message.util.send({ embeds: [noCommandFound] })
                                } else {

                                    const commandHelp = new MessageEmbed()
                                        .setTitle(lang(message, "command.help.embedtwo.title.content"))
                                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n
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
                            await i.update({ components: [] });
                            await buttonCollector.stop();

                            break;
                    }
                })
            }

        } else { // If the bot doesnt have reaction add permissions, show old help
            const embed = new MessageEmbed()
                .setColor(crimson)

            if (!command) { // If theres no cmd input show list of cmds
                let categories = this.handler.categories.values();
                let total = [];

                for (const category of categories) {
                    total.push(parseInt(category.size));
                    const title = category.id;

                    if (title == 'default') { continue } else if (title) {
                        const dir = category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ');
                        embed.setDescription(lang(message, 'command.help.embed.desc.one'));
                        embed.addField(`> ${category} (${category.size}):`, dir);
                    }
                }

                embed.setFooter(`🎉 ${this.client.user.username} 🎉 | ${lang(message, 'command.help.embed.footer.one')} ${total.reduce((a, b) => a + b, 0)}`, this.client.user.displayAvatarURL({ dynamic: true }));
                embed.addField(`${lang(message, 'command.help.embed.field.one')}`, `\n${lang(message, 'command.help.embed.field.two')} [${lang(message, 'command.help.embed.field.three')}](https://discord.gg/v8zkSc9) ${lang(message, 'command.help.embed.field.four')} [${lang(message, 'command.help.embed.field.three')}](https://discordapp.com/oauth2/authorize?this.client_id=${this.client.user.id}&scope=bot&permissions=8).`);

                await message.util.send({ embeds: [embed] });
            } else { // If theres a command input show cmd info
                if (!command) return await message.util.send({ embeds: [embed.setTitle(lang(message, 'command.help.embed.title.one')).setDescription(`${lang(message, 'command.help.embed.title.desc.one')} \`${prefix}help\` ${lang(message, 'command.help.embed.title.desc.two')}`)] });
                embed.setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')}\n 
                **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`);

                embed.setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`);

                return await message.util.send({ embeds: [embed] });
            }
        }
    }
}

module.exports = Help;