const { Listener } = require('discord-akairo');
const Discord = require("discord.js");
const mysql2 = require('mysql2/promise');
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

        // Keep the database alive
        setInterval(async () => {
            let dot = '.';
                let [data] = await DB.query(`SELECT * FROM keepAlive`)
                if (data.length === 0) {
                    await DB.query(`INSERT INTO keepAlive VALUES(?)`, [dot])
                    await DB.query("DELETE FROM keepAlive")

                } else {
                    await DB.query("DELETE FROM keepAlive")
                    console.log("[DEBUG] No items were deleted (Table was already empty)")
                }

            // console.log('[DEBUG] Database lifespan expanded by 2.5 minutes!');
        }, 150000);

        // Send startup message
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