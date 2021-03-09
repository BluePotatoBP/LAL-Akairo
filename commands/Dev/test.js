const { Command } = require('discord-akairo');
const { crimson, lightRed, pastelGreen } = require('../../assets/colors.json')
const { stripIndents } = require('common-tags');
const ms = require('ms');

module.exports = class NewHelpCommand extends Command {
    constructor() {
        super('new-help', {
            aliases: ['nh'],
            category: '',
            userPermissions: [],
            clientPermissions: [],
            ignorePermissions: [],
            cooldown: 10000,
            ownerOnly: true,
            * args(message) {

                const command = yield {
                    type: "commandAlias",
                    default: "modules",
                    prompt: {
                        start: `Please give a \`Command\` argument.\n\n**• Info**\nType **ONLY** \`help\` to list all commands.`,
                        retry: `Please give a  valid \`Command\` argument. **{{}}**\n\n**• Info**\nType **ONLY** \`help\` to list all commands.`,
                        optional: true
                    }
                }

                return { command, }
            },
            description: {
                content: 'No description provided.',
                usage: ''
            },
        })
    }

    async exec(message, { command }) {
        let SearchCollector;
        let prefix = process.env.PREFIX;

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

        const emojiCollector = msg.createReactionCollector((reaction, user) => {
            return ["817848932209393725", "817848932364845067", "817848932566695986"].includes(reaction.emoji.id) && !user.bot;
        }, { time: 3e5 });

        emojiCollector.on("collect", async (reaction, user) => {
            reaction.users.remove(user.id);

            switch (reaction.emoji.id) {
                case "817848932209393725":
                    message.util.send(homeEmbed)
                    break;
                case "817848932364845067":
                    message.util.send(commandsEmbed)
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
                                .setDescription(stripIndents `**Command:** ${command.categoryID.toLowerCase() === 'nsfw' ? `|| \`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\` ||` : `\`${command.id.slice(0, 1).toUpperCase() + command.id.slice(1)}\``}
                                **Description:** ${lang(message,`command.${command.id}.desc.content`)}
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
}











/*const { Command, Argument } = require('discord-akairo');

module.exports = class NewHelpCommand extends Command {
    constructor() {
        super('new-help', {
            aliases: ['nh'],
            category: '',
            userPermissions: [],
            clientPermissions: [],
            ignorePermissions: [],
            cooldown: 0,
            ratelimit: 1,
            ownerOnly: false,
            args: [{
                id: "command",
                type: Argument.union("command", "commandAlias"),
                default: null,
                match: "restContent",
            }, ],
            description: {
                content: 'No description provided.',
                usage: ''
            },
        })
    }

    async exec(message, { command }) {
        const homeEmbed = this.client.util.embed()
            .addField("🏠 | Home", "Returns to this page")
            .addField("📚 | Commands", "Shows all categories along with their commands")
            .addField("🔎 | Search", "Search for any command or alias")
            .addField("🔧 | Customs", "Show all custom commands for this guild")
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();


        const commandsEmbed = this.client.util.embed()
            .setTitle("Atomic Help | Commands")
            .setDescription(`View all commands and their categories below\nFor further info about a specific command, use \`.help <Command>\``);


        for (const category of this.handler.categories.values()) {
            if (category.id === 'default') {
                continue;
            } else if (category) {
                commandsEmbed.addField(`${category.id} [${category.size}]`, `\`${category.map((c) => c.id).join("`, `")}\``);
            }
        }

        const msg = await message.util.send(homeEmbed)
        await msg.react("🏠");
        await msg.react("📚");
        await msg.react("🔎");

        const emojiCollector = msg.createReactionCollector((reaction, user) => { return ["🏠", "📚", "🔎"].includes(reaction.emoji.name) && !user.bot; }, { time: 3e5 });
        emojiCollector.on("collect", async (reaction, user) => {
            reaction.users.remove(user.id);

            switch (reaction.emoji.name) {
                case "🏠":
                    message.util.send(homeEmbed)
                    break;
                case "📚":
                    message.util.send(commandsEmbed)
                    break;
                case "🔎":

                    const searchEmbed = this.client.util.embed()
                        .setTitle("Atomic Help | Search")
                        .setDescription("Find commands or aliases by typing a query");
                    message.util.send(searchEmbed)


                    const filter = m => !m.author.bot && m.author.id == message.author.id
                    SearchCollector = msg.channel.createMessageCollector(filter, { time: 3e5 });
                    SearchCollector.on("collect", async (commandInput) => {

                        if (commandInput.content.toLowerCase() === "cancel") return message.util.send(homeEmbed)

                        let resolveType = await this.client.commandHandler.resolver.type("commandAlias")
                        let command = await resolveType(message, commandInput.content)

                        if (!command) {

                            const noCommandFound = this.client.util.embed()
                                .setTitle("Atomic Help | Search")
                                .setDescription("No command found");
                            message.util.send(noCommandFound)

                        } else {

                            const commandHelp = this.client.util.embed()
                                .setTitle("Atomic Help | Search")
                                .setDescription("Find commands or aliases by typing a query")
                                .addField(command.id, `your help shi`)
                                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));

                            message.util.send(commandHelp)
                            SearchCollector.stop()
                        }
                    })
                    break;
            }

        })

    }
}*/
/*const { stripIndents } = require("common-tags");
const { Command, Argument } = require("discord-akairo");
const ms = require("ms");
//const fetch = require('node-fetch');

class test extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            category: '',
            ownerOnly: true,
            cooldown: 10000,
            clientPermissions: ["ADD_REACTIONS"],
            description: {
                content: 'test',
                usage: 'test',
                syntax: 'test'
            },
            args: [{
                id: "command",
                type: Argument.union("command", "commandAlias"),
                default: null,
                match: "restContent",
            }, ],
        });
    }

    async exec(message, { s }) {
        message.delete({ timeout: 60000 }).catch((e) => {});

        let SearchCollector;
        const prefix = await (this.handler.prefix)(message);
        if (!command || command === null) {
            const Home = MessageEmbed = new MessageEmbed()
                .setTitle("Atomic Help | Home")
                .addFields([{
                        name: "🏠 | Home",
                        value: "Returns to this page",
                    },
                    {
                        name: "📚 | Commands",
                        value: "Shows all categories along with their commands",
                    },
                    {
                        name: "🔎 | Search",
                        value: "Search for any command or alias",
                    },
                    {
                        name: "🔧 | Customs",
                        value: "Show all custom commands for this guild",
                    },
                ])
                .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({ dynamic: true })
                )
                .setTimestamp();

            const Commands = new MessageEmbed()
                .setTitle("Atomic Help | Commands")
                .setDescription(
                    `View all commands and their categories below\nFor further info about a specific command, use \`${prefix}help <Command>\``
                );
            this.handler.categories.each(
                (c = Category, s) => {
                    Commands.addField(
                        `${s} [${c.size}]`,
                        `\`${c.map((c) => c.id).join("`, `")}\``
                    );
                }
            );

            const Search = new MessageEmbed()
                .setTitle("Atomic Help | Search")
                .setDescription("Find commands or aliases by typing a query");

            const Customs = new MessageEmbed()
                .setTitle("Under Construction")
                .setDescription("This feature is currently still being developed.");

            const msg = await message.util.send(Home);
            try {
                await msg.react("🏠");
                await msg.react("📚");
                await msg.react("🔎");
                await msg.react("🔧");
            } catch (er) {
                console.log(er);
            }

            const collector = msg.createReactionCollector(
                (r, u) => {
                    return ["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name) && !u.bot;
                }, { time: 3e5 }
            );

            collector.on("collect", async (r, u) => {
                if (u.bot) return;
                if (!["🏠", "📚", "🔎", "🔧"].includes(r.emoji.name)) return;
                r.users.remove(u.id);
                switch (r.emoji.name) {
                    case "🏠":
                        msg.edit(Home);
                        if (SearchCollector.client) SearchCollector.stop();
                        break;

                    case "📚":
                        msg.edit(Commands);
                        if (SearchCollector.client) SearchCollector.stop();
                        break;
                    case "🔎":
                        msg.edit(Search);
                        SearchCollector = msg.channel.createMessageCollector(
                            (m, u) => {
                                return !m.author.bot && !u.bot;
                            }, { time: 3e5 }
                        );
                        SearchCollector.on("collect", (m) => {
                            let res =
                                this.handler.modules.filter((c) => {
                                    return (
                                        c.id
                                        .toLowerCase()
                                        .match(new RegExp(m.content.toLowerCase(), "g")).length >
                                        0
                                    );
                                }) &&
                                this.handler.modules.filter((c) => {
                                    return c.aliases.some((v) => {
                                        return (
                                            v
                                            .toLowerCase()
                                            .match(new RegExp(m.content.toLowerCase(), "g")).length > 0
                                        );
                                    });
                                });

                            const Result = new MessageEmbed().setTitle(
                                "Search Results"
                            );
                            if (!res.first()) {
                                Result.setDescription("No commands or aliases have been found");
                                SearchCollector.stop();
                                msg.edit(Result);
                                return m.delete();
                            }
                            if (Object.keys(res.first()).includes("category")) {
                                Result.setDescription("Found an Command");
                                Result.addField(
                                    res.first().id,
                                    stripIndents `
                **\\>** Name: **${res.first().id}**
                **\\>** Aliases: **${res.first().aliases.join("**, **")}**
                **\\>** Cooldown: **${ms(
                  res.first().cooldown ? res.first().cooldown : this.handler.defaultCooldown,
                  {
                    long: true,
                  }
                )}**
                **\\>** Description: **${res.first().description}**
                ${res.first().ownerOnly ? "**Developer Only!**" : ""}`
                                ).setThumbnail(
                                    message.author.displayAvatarURL({ dynamic: true })
                                );
                            }
                            msg.edit(Result);
                        });
                        break;

                    case "🔧":
                        if (SearchCollector.client) SearchCollector.stop();
                        msg.edit(Customs);
                        break;
                }
            });
        } else {
            let Embed = new MessageEmbed()
                .setTitle("Atomic Help | Command Result")
                .addField(
                    command.id,
                    stripIndents `
      **\\>** Name: **${command.id}**
      **\\>** Aliases: **${command.aliases.join("**, **")}**
      **\\>** Cooldown: **${ms(
        command.cooldown ? command.cooldown : this.handler.defaultCooldown,
        { long: true }
      )}**
      **\\>** Description: **${command.description}**
      ${command.ownerOnly ? "**Developer Only!**" : ""}`
                )
                .setFooter(`Requested by: ${message.author.tag}`)
                .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            message.channel.send(Embed);
        }

        /*var expression = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi;
        var regex = new RegExp(expression);

        if (s.match(regex)) {
            message.util.send(`Successful match`);
        } else {
            message.util.send("No match");

            let a = ['test']
            if ('test' === a[0]) {
                message.channel.send('yes')
            }
        }*/

/* // Mojang API
const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${s}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
});
let uuid;
try {
    let mojson = await mojangData.json();
    uuid = mojson.id;
} catch (error) {
    return await message.util.send('give me normal username bruh');
}

await message.util.send(uuid);
// Hypixel API
const hypixelData = await fetch(
    `https://api.hypixel.net/skyblock/profiles?key=ca1797b3-3eb1-40a7-8782-fee6d1ca58cd&uuid=${uuid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }
);
const hyjson = await hypixelData.json();

//let whatever hyjson.profiles // u left off here cunt
/*let hypixelResult = '';
for (let i = 0; i < hyjson.items.length; i++) {
	hypixelResult = hyjson.items[i].title + ' - ' + hyjson.items[i].text;
	console.log(hypixelResult);
}*/


//}
//}
//module.exports = test;