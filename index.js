require('dotenv').config();
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo');
const { MessageEmbed, Intents } = require('discord.js');
const chalk = require('chalk');
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require('./assets/colors.json');
const { editPrompt } = require('./assets/tools/util')

console.clear();

// Defined global vars used elsewhere
global.debug = chalk.black.bgWhite;
global.promptFilter = [];
global.guildLanguages = [];
global.staffRole = [];
global.starBlacklistCache = [];
global.antiAdvertise = [];
global.DB = require('./assets/tools/establishDBConnection');
global.lang = require('./assets/languages/languageTranslate');

// Start akairo client
class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: process.env.OWNER,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            allowedMentions: { parse: ['users'], repliedUser: true },
            disableMentions: 'everyone'
        });

        this.commandHandler = new CommandHandler(this, {
            prefix: async (message) => {
                if (message.channel.type === 'DM') return process.env.PREFIX;
                let [data] = await DB.query(`SELECT * FROM prefixes WHERE guild = ?`, [message.guild.id]);
                return data.length == 0 ? process.env.PREFIX : data[0].prefix;;
            },
            blockBots: true,
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
                    modifyStart: async (message, text) => {
                        let embed = new MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:773199688631058442> ' + text)
                            .setFooter(lang(message, 'index.prompt.modifyStart.footer'))
                            .setTimestamp();

                        editPrompt(message, embed);
                    },
                    modifyRetry: async (message, text) => {
                        let embed = new MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:773199688631058442> ' + text)
                            .setFooter(lang(message, 'index.prompt.modifyRetry.footer'))
                            .setTimestamp();

                        editPrompt(message, embed);
                    },
                    ended: () => { },
                    cancel: async (message) => {
                        let embed = new MessageEmbed()
                            .setColor(darkRed)
                            .setDescription(`<a:cancel:773201205056503849> ${lang(message, 'index.prompt.cancel.footer')}`);

                        editPrompt(message, embed);
                    },

                    retries: 4,
                    time: 60000,
                    timeout: () => { }
                }
            }
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler
        });
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.commandHandler.loadAll();
    }
}

const client = new Client();

client.login();