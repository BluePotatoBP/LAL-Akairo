const { Listener } = require('discord-akairo');
const Discord = require("discord.js");
const prefix = process.env.PREFIX;
const guildInvites = new Map();

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {

        // Clear console and send startup message
        console.clear()
        global.client = this.client;

        let statuses = [` you type ${prefix}help`, " the support server!"];
        setInterval(() => {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(`${status}`, { type: "WATCHING" });
        }, 10000);

        console.log(`[STARTUP] ${this.client.user.username} is online in ${this.client.guilds.cache.size} guilds and ready!`);
        // Set status to dnd
        this.client.user.setStatus('dnd')

    } // End of exec()
}

module.exports = ReadyListener;