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

    async exec() {

        global.client = this.client;

        // Automatic status changer
        let statuses = [`you type ${prefix}help`, 'the support server!'];
        setInterval(() => {
            let status = statuses[Math.floor(Math.random() * statuses.length)];
            this.client.user.setActivity(`${status}`, { type: 'WATCHING' });
        }, 10000);

        // Log basic bot info on startup
        console.log(`${chalk.yellow('[INFO]')} ${chalk.magenta(this.client.user.username)} is online in ${chalk.red(this.client.guilds.cache.size)} guilds and ready!`);
        console.log(`${chalk.yellow('[INFO]')} You can kill the bot instance by pressing ${chalk.red.bold('Ctrl+C')} at any time.`);

        // Set client status to do not disturb
        this.client.user.setStatus('dnd');

        // Checking the database every 5m for guild leaves
        setInterval(async () => {
            // Getting data from 'awaitingDelete'
            let [data2] = await DB.query(`SELECT * FROM awaitingDelete WHERE leftAt + 604800000 < '${Date.now()}'`);

            // Iterating through data to get the guild id
            for (let i = 0; i < data2.length; i++) {
                let guildID = data2[i].guild;
                console.log(`${debug('[DEBUG]')} Guild [${guildID}] kicked the bot 7d ago. Deleting data.`);

                // Deleting data from all tables where the guild id matches
                await DB.query('DELETE FROM languages WHERE guildID = ?', [guildID]);
                await DB.query('DELETE FROM logs WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM mute WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM prefixes WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM staffrole WHERE guild = ?', [guildID]);

                // Finally deleting the 'awaitingDelete' entry so we dont delete empty data indefinitely
                await DB.query(`DELETE FROM awaitingDelete WHERE guild = ?`, [guildID]);
            }
        }, 300000);

        // Anti advertisement
        let [data3] = await DB.query(`SELECT * FROM antiAdvert`);

        for (let i = 0; i < data3.length; i++) {
            antiAdvertise.push({
                guild: data3[i].guild,
                enabled: data3[i].enabled,
                excludeStaff: data3[i].excludeStaff,
                excludeBots: data3[i].excludeBots,
                warn: data3[i].warn,
                preset: data3[i].preset
            })
        }

        //StaffRole 
        let [data4] = await DB.query(`SELECT * FROM staffrole`);

        for (let i = 0; i < data4.length; i++) {
            staffRole.push({
                guild: data4[i].guild,
                role: data4[i].role,
            })
        }

    }
}

module.exports = ReadyListener;