const dotenv = require('dotenv').config();
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require("./assets/colors.json")
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
const Discord = require('discord.js');
const mysql2 = require('mysql2/promise');
const chalk = require('chalk');

//#region Utility for other stuff

console.clear();
global.startup = chalk.greenBright;
global.info = chalk.keyword('orange');
global.debug = chalk.black.bgWhite;
global.promptFilter = [];
global.guildLanguages = [];
global.lang = require("./assets/languages/languageTranslate");
let promptMsg;

// Connect to database
(async () => {

    global.DB = await mysql2.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        enableKeepAlive: true
    })
    console.log(`${startup('[STARTUP]')} Connected to Database ${chalk.yellow(`${process.env.DB_NAME} (Ricardo)`)}!`)

})()

async function editPrompt(message, embed) {

    let promptMsgFind = await promptFilter.find(c => c.userID === message.author.id && c.channelID === message.channel.id)

    if (!promptMsgFind) {
        promptMsg = await message.util.send(embed);

        promptFilter.push({
            userID: message.author.id,
            msgID: promptMsg.id,
            channelID: message.channel.id
        })

    }

    if (promptMsgFind) {

        let promptMsgFetch = await message.channel.messages.fetch(promptMsgFind.msgID)
        if (!promptMsgFetch) promptMsg = await message.util.send(embed)

        promptMsg = await promptMsgFetch.edit(embed)
    }

}
//#endregion Utility for other stuff
// Start akairo client
class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: process.env.OWNER,
        });

        this.commandHandler = new CommandHandler(this, {
            prefix: async (message) => {

                let [data] = await DB.query(`SELECT * FROM prefixes WHERE guildId = ?`, [message.guild.id])
                let customPrefix;

                if (data.length === 0) {
                    customPrefix = process.env.PREFIX;
                } else {
                    customPrefix = data[0].prefix;
                }
                return customPrefix;
            },
            blockBots: true,
            disableMentions: 'everyone',
            blockClient: true,
            allowMention: true,
            automateCategories: false,
            defaultCooldown: 2000,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 600000,
            storeMessages: true,
            directory: './commands/',
            argumentDefaults: {
                prompt: {
                    //#region prompts
                    modifyStart: async (message, text) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:773199688631058442> ' + text)
                            .setFooter(lang(message, 'index.prompt.modifyStart.footer'))
                            .setTimestamp()

                        editPrompt(message, embed)
                    },
                    modifyRetry: async (message, text) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:773199688631058442> ' + text)
                            .setFooter(lang(message, "index.prompt.modifyRetry.footer"))
                            .setTimestamp()

                        editPrompt(message, embed)
                    },
                    ended: () => { },
                    cancel: async (message) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(darkRed)
                            .setDescription(`<a:cancel:773201205056503849> ${lang(message, 'index.prompt.cancel.footer')}`)

                        editPrompt(message, embed)
                    },

                    retries: 4,
                    time: 60000,
                    timeout: () => { }
                }
                //#endregion prompt
            }
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.commandHandler.loadAll()
    }
}

const client = new Client();
client.login();