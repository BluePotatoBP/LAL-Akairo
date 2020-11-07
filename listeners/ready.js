const { Listener } = require('discord-akairo');
const chalk = require('chalk');
const prefix = process.env.PREFIX;

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        global.client = this.client;
        let statuses = [` you type ${prefix}help`, " the support server!"];

        // Keep the database alive (ping it every 2.5 minutes)
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
        }, 150000);
        // Automatic status changer
        setInterval(() => {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(`${status}`, { type: "WATCHING" });
        }, 10000);
        // Log basic bot info on startup
        console.log(`${startup('[STARTUP]')} ${chalk.magenta(this.client.user.username)} is online in ${chalk.red(this.client.guilds.cache.size)} guilds and ready!`);
        console.log(`${info('[INFO]')} You can kill the bot instance by pressing ${chalk.red.bold('Ctrl+C')} at any time.`)
        // Set client status to do not disturb
        this.client.user.setStatus('dnd')
    }
}

module.exports = ReadyListener;