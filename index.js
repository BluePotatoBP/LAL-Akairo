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
global.reactionRoles = [];
global.customPrefixes = [];
global.rrCooldown = [];
global.DB = require('./assets/tools/establishDBConnection');
global.lang = require('./assets/languages/languageTranslate');

// Start akairo client
class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: process.env.OWNER,
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS
            ],
            allowedMentions: { parse: ['users'], repliedUser: true },
            disableMentions: 'everyone'
        });

        this.commandHandler = new CommandHandler(this, {
            prefix: async (message) => {
                if (message.channel.type === 'DM') return process.env.PREFIX;
                const customPrefix = customPrefixes.find(c => c.guild === message.guild.id);
                return !customPrefix ? process.env.PREFIX : customPrefix.prefix;
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
                            .setDescription('<a:gears:773203929507823617> ' + text)
                            .setFooter(lang(message, 'index.prompt.modifyStart.footer'))
                            .setTimestamp();

                        await editPrompt(message, embed);
                    },
                    modifyRetry: async (message, text, { retries: promptRetries }) => {
                        let retries = promptRetries - 1;
                        let embed = new MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:gears:773203929507823617> ' + text)
                            .setFooter(lang(message, 'index.prompt.modifyRetry.footer') + ` - [${retries}/3]`)
                            .setTimestamp();

                        await editPrompt(message, embed);
                    },
                    ended: async (message) => {
                        let embed = new MessageEmbed()
                            .setColor(darkRed)
                            .setDescription(`<a:cancel:773201205056503849> ${lang(message, 'index.prompt.failed.desc')}`);

                        await editPrompt(message, embed);
                    },
                    cancel: async (message) => {
                        let embed = new MessageEmbed()
                            .setColor(darkRed)
                            .setDescription(`<a:cancel:773201205056503849> ${lang(message, 'index.prompt.cancel.desc')}`);

                        await editPrompt(message, embed);
                    },

                    retries: 3,
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