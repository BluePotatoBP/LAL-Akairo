const { Command, Argument } = require('discord-akairo');
const Discord = require('discord.js');
const ms = require('ms');
const { stripIndents } = require('common-tags');
const { crimson, lightRed, pastelGreen } = require('../../assets/colors.json')
const chalk = require('chalk');

class Help extends Command {
    constructor() {
        super('help', {
            aliases: ['help'],
            category: 'Util',
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Shows you this message',
                usage: '[command}',
                syntax: '[] - optional'
            },
            * args(message) {

                const command = yield {
                    type: Argument.union("commandAlias", ["commands", "list"]),
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
    async exec(message, { command, list }) {
        message.delete({ timeout: 60000 }).catch((e) => { });

        let SearchCollector;
        let prefix;

        let [data] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);

        data.length === 0 ? prefix = process.env.PREFIX : prefix = data[0].prefix

        const embed = new Discord.MessageEmbed()
            .setColor(crimson)
            .setAuthor(`${this.client.user.username} Help`, this.client.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(message.guild.iconURL({ dynamic: true }));

        if (message.guild.members.cache.get(this.client.user.id).permissions.has('ADD_REACTIONS')) {

            const commandsEmbed = this.client.util.embed()
                .setTitle(`${this.client.user.username} Help | Commands`)
                .setDescription(`View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``)
                .setColor(crimson)
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()

            for (const category of this.handler.categories.values()) {
                if (category.id === 'default' || category.id === '') {
                    continue;
                } else if (category) {
                    commandsEmbed.addField(`${category.id} [${category.size}]`, `${category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ')}`);
                }
            }

            //List commands
            if (!command && ["commands", "list"].some(w => command ? command.toLowerCase : command === w)) {

                let msg = await message.util.send(commandsEmbed)

                await msg.react('<:home:817848932209393725>');
                await msg.react('<:library:817848932364845067>');
                await msg.react('<:search:817848932566695986>');
                await msg.react('<:exit:817890713190662146>');

                const emojiCollector = msg.createReactionCollector((reaction, user) => {
                    return ["817848932209393725", "817848932364845067", "817848932566695986", "817890713190662146"].includes(reaction.emoji.id) && !user.bot && user.id === message.author.id;
                }, { time: 120000 });

                const homeEmbed = this.client.util.embed()
                    .addField("<:home:817848932209393725> | Home", "Returns to this page")
                    .addField("<:library:817848932364845067> | Commands", "Shows all categories along with their commands")
                    .addField("<:search:817848932566695986> | Search", "Search for any command or alias")
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp();

                emojiCollector.on("collect", async (reaction, user) => {
                    reaction.users.remove(user.id);

                    switch (reaction.emoji.id) {
                        case "817848932209393725":
                            message.util.send(homeEmbed)
                            break;
                        case "817848932364845067":
                            message.util.send(commandsEmbed)
                            break;
                        case "817890713190662146":
                            if (message.guild.members.cache.get(this.client.user.id).permissions.has('MANAGE_MESSAGES')) {
                                msg.reactions.removeAll().catch(e => console.log(e))
                            } else {
                                await msg.react('<a:cancel:773201205056503849>')
                            }

                            break;
                        case "817848932566695986":

                            const searchEmbed = this.client.util.embed()
                                .setTitle(`${this.client.user.username} Help | Search`)
                                .setDescription("Find commands or aliases by typing a query")
                                .setColor(crimson)
                                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()

                            message.util.send(searchEmbed)


                            const filter = m => !m.author.bot && m.author.id == message.author.id
                            SearchCollector = msg.channel.createMessageCollector(filter, { time: 3e5 });
                            SearchCollector.on("collect", async (commandInput) => {

                                if (commandInput.content.toLowerCase() === "cancel") return message.util.send(homeEmbed)

                                let resolveType = await this.client.commandHandler.resolver.type("commandAlias")
                                let command = await resolveType(message, commandInput.content)

                                if (!command) {

                                    const noCommandFound = this.client.util.embed()
                                        .setTitle(`${this.client.user.username} Help | Search`)
                                        .setDescription("No command found, try again.")
                                        .setColor(lightRed)
                                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                        .setTimestamp()

                                    message.util.send(noCommandFound)

                                } else {

                                    const commandHelp = this.client.util.embed()
                                        .setTitle(`${this.client.user.username} Help | Search Result`)
                                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n
                                                                      **Command:** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                                      **Description:** ${lang(message, `command.${command.id}.desc.content`)}
                                                                      **Usage:** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                                                                      **Cooldown:** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                                      **Aliases:** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                                        .setColor(pastelGreen)
                                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)

                                    message.util.send(commandHelp)
                                    SearchCollector.stop()
                                }
                            })
                            break;
                    }
                })

                return;
            }

            if (command) {

                try {
                    const embed = new Discord.MessageEmbed()
                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n 
                 **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                 **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                 **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                 **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                 **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)
                        .setTimestamp()

                    return message.util.send(embed);
                } catch (error) {
                    const noCommandFound = this.client.util.embed()
                        .setTitle(`${this.client.user.username} Help | Search`)
                        .setDescription("No command found, try again.")
                        .setColor(lightRed)
                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()

                    message.util.send(noCommandFound)
                }



            } else {
                //No command given. send main embed
                const homeEmbed = this.client.util.embed()
                    .addField("<:home:817848932209393725> | Home", "Returns to this page")
                    .addField("<:library:817848932364845067> | Commands", "Shows all categories along with their commands")
                    .addField("<:search:817848932566695986> | Search", "Search for any command or alias")
                    .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor(crimson)
                    .setTimestamp();

                const commandsEmbed = this.client.util.embed()
                    .setTitle(`${this.client.user.username} Help | Commands`)
                    .setDescription(`View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``)
                    .setColor(crimson)
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()

                for (const category of this.handler.categories.values()) {
                    if (category.id === 'default' || category.id === '') {
                        continue;
                    } else if (category) {
                        commandsEmbed.addField(`${category.id} [${category.size}]`, `${category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ')}`);
                    }
                }

                const msg = await message.util.send(homeEmbed)

                await msg.react('<:home:817848932209393725>');
                await msg.react('<:library:817848932364845067>');
                await msg.react('<:search:817848932566695986>');
                await msg.react('<:exit:817890713190662146>');

                const emojiCollector = msg.createReactionCollector((reaction, user) => {
                    return ["817848932209393725", "817848932364845067", "817848932566695986", "817890713190662146"].includes(reaction.emoji.id) && !user.bot && user.id === message.author.id;
                }, { time: 120000 });

                emojiCollector.on("collect", async (reaction, user) => {
                    reaction.users.remove(user.id);

                    switch (reaction.emoji.id) {
                        case "817848932209393725":
                            message.util.send(homeEmbed)
                            break;
                        case "817848932364845067":
                            message.util.send(commandsEmbed)
                            break;
                        case "817890713190662146":
                            if (message.guild.members.cache.get(this.client.user.id).permissions.has('MANAGE_MESSAGES')) {
                                msg.reactions.removeAll().catch(e => console.log(e))
                            } else {
                                await msg.react('<a:cancel:773201205056503849>')
                            }

                            break;
                        case "817848932566695986":

                            const searchEmbed = this.client.util.embed()
                                .setTitle(`${this.client.user.username} Help | Search`)
                                .setDescription("Find commands or aliases by typing a query")
                                .setColor(crimson)
                                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()

                            message.util.send(searchEmbed)


                            const filter = m => !m.author.bot && m.author.id == message.author.id
                            SearchCollector = msg.channel.createMessageCollector(filter, { time: 3e5 });
                            SearchCollector.on("collect", async (commandInput) => {

                                if (commandInput.content.toLowerCase() === "cancel") return message.util.send(homeEmbed)

                                let resolveType = await this.client.commandHandler.resolver.type("commandAlias")
                                let command = await resolveType(message, commandInput.content)

                                if (!command) {

                                    const noCommandFound = this.client.util.embed()
                                        .setTitle(`${this.client.user.username} Help | Search`)
                                        .setDescription("No command found, try again.")
                                        .setColor(lightRed)
                                        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                                        .setTimestamp()

                                    message.util.send(noCommandFound)

                                } else {

                                    const commandHelp = this.client.util.embed()
                                        .setTitle(`${this.client.user.username} Help | Search Result`)
                                        .setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n
                                                                      **Command:** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                                                      **Description:** ${lang(message, `command.${command.id}.desc.content`)}
                                                                      **Usage:** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                                                                      **Cooldown:** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                                                                      **Aliases:** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`)
                                        .setColor(pastelGreen)
                                        .setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`)

                                    message.util.send(commandHelp)
                                    SearchCollector.stop()
                                }
                            })
                            break;
                    }
                })
            }

        } else {
            if (!command) {
                let categories = this.handler.categories.values();
                let total = [];
                for (const category of categories) {
                    total.push(parseInt(category.size));
                    const title = category.id;

                    if (title == 'default') {
                        continue;
                    } else if (title) {
                        const dir = category.map((cmd) => `${cmd.categoryID.toLowerCase() == 'nsfw' ? `|| ${cmd} ||` : cmd}`).join(', ');
                        embed.setDescription(`${lang(message, 'command.help.embed.desc.one')} \`${prefix}\` \n${lang(message, 'command.help.embed.desc.two')} \`${this.client.user.username}\`:`);

                        try {
                            embed.addField(`> ${category} (${category.size}):`, dir);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

                embed.setFooter(`🎉 ${this.client.user.username} 🎉 | ${lang(message, 'command.help.embed.footer.one')} ${total.reduce((a, b) => a + b, 0)}`, this.client.user.displayAvatarURL({ dynamic: true }));
                embed.addField(`${lang(message, 'command.help.embed.field.one')}`, `\n${lang(message, 'command.help.embed.field.two')} [${lang(message, 'command.help.embed.field.three')}](https://discord.gg/v8zkSc9) ${lang(message, 'command.help.embed.field.four')} [${lang(message, 'command.help.embed.field.three')}](https://discordapp.com/oauth2/authorize?this.client_id=${this.client.user.id}&scope=bot&permissions=8).`);

                await message.util.send(embed);
            } else {
                if (!command) return message.util.send(embed.setTitle(lang(message, 'command.help.embed.title.one')).setDescription(`${lang(message, 'command.help.embed.title.desc.one')} \`${prefix}help\` ${lang(message, 'command.help.embed.title.desc.two')}`));

                console.log(`${debug('[DEBUG]')} '${message.author.tag}'[${message.author.id}] used ${chalk.gray(`"${prefix}help ${command.id.toLowerCase()}"`)} in '${message.guild.name}'[${message.guild.id}]`);

                embed.setDescription(stripIndents`${lang(message, 'command.help.embedtwo.desc.one')} \`${prefix}\`\n 
                **${lang(message, 'command.help.embedtwo.desc.two')} **${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                **${lang(message, 'command.help.embedtwo.desc.three')}** ${lang(message, `command.${command.id}.desc.content`)}
                **${lang(message, 'command.help.embedtwo.desc.four')}** ${command.description.usage ? `\`${prefix}${command.id} ${command.description.usage}\`` : lang(message, 'command.help.embedtwo.desc.five')}
                **${lang(message, "command.help.embedtwo.desc.ten")}** ${command.cooldown ? `\`${ms(command.cooldown)}\`` : '\`2s\`'}
                **${lang(message, 'command.help.embedtwo.desc.six')}** ${command.aliases ? command.aliases.join(', ') : lang(message, 'command.help.embedtwo.desc.seven')}`);

                embed.setFooter(`${lang(message, 'command.help.embedtwo.desc.eight')} ${command.description.syntax ? `${command.description.syntax}` : lang(message, 'command.help.embedtwo.desc.nine')}`);

                return message.util.send(embed);
            }
        }
    }
}

module.exports = Help;