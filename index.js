const dotenv = require('dotenv').config();
const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const Discord = require("discord.js");
const { red, lightRed, darkRed, pink, darkPink, yellow, lightYellow, orange, darkOrange, darkGreen, lightGreen, veryBrightGreen, blue, darkBlue, lightBlue, purple, lightPurple, black, gray, white, dcBlack, banana, clear, gold, ultraBlue, checkGreen, crimson } = require("./assets/colors.json")

class Client extends AkairoClient {
    constructor() {
        super({
            ownerID: process.env.OWNER,
        }, {
            disableMentions: 'everyone'
        });

        this.commandHandler = new CommandHandler(this, {
            prefix: process.env.PREFIX,
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
                    modifyStart: (message, text) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:724754529702379541> ' + text)
                            .setFooter('Type cancel to void this command.')
                            .setTimestamp()
                        message.util.send(embed);
                    },
                    modifyRetry: (message, text) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(crimson)
                            .setDescription('<a:loading:724754529702379541> ' + text)
                            .setFooter('Type cancel to void this command.')
                            .setTimestamp()
                        message.util.send(embed);
                    },
                    ended: (message) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(darkRed)
                            .setDescription('<a:rxm:683827905377206310> Too many \`re-tries\`. The command has been canceled.')
                        //message.channel.send(embed);
                    },
                    cancel: (message) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(checkGreen)
                            .setDescription('<a:gcw:683827123227852813> The command has been canceled.')
                        message.util.send(embed);
                    },
                    retries: 4,
                    time: 30000,
                    timeout: (message) => {
                        let embed = new Discord.MessageEmbed()
                            .setColor(darkRed)
                            .setDescription('<a:rxm:683827905377206310> Time ran out, the command has been cancelled!')
                        //message.channel.send(embed);
                    }
                }
            }
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
        });

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll()
    }
}
const client = new Client();

client.login();