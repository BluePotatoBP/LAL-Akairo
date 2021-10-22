const { Listener } = require('discord-akairo');
const chalk = require('chalk');
const mysql2 = require('mysql2/promise');
const moment = require('moment')

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        // Define global client
        global.client = this.client;
        // Connect to database
        (async () => {
            global.dbConnection = await mysql2.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                port: 3306,
                enableKeepAlive: true
            })
            console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${chalk.yellow('[INFO]')} Connected to Database ${chalk.yellow(`${process.env.DB_NAME}`)}!`);
        })();
        // Set client status to do not disturb and the activity to .help
        this.client.user.setStatus('dnd');
        await client.user.setActivity('.help', { type: 'PLAYING' })
        // Log basic bot info on startup
        console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${chalk.yellow('[INFO]')} ${chalk.magenta(this.client.user.username)} is online in ${chalk.red(this.client.guilds.cache.size)} guilds and ready!`);
        console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${chalk.yellow('[INFO]')} You can kill the bot instance by pressing ${chalk.red.bold('Ctrl+C')} at any time.`);
        // Checking the database every 5m for guild leaves
        setInterval(async () => {
            // Getting data from 'awaitingDelete'
            let [data2] = await DB.query(`SELECT * FROM awaitingDelete WHERE leftAt + 604800000 < '${Date.now()}'`);
            // Iterating through data to get the guild id
            for (let i = 0; i < data2.length; i++) {
                let guildID = data2[i].guild;
                console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} Guild [${guildID}] kicked the bot 7d ago. Deleting data...`);
                // Deleting data from all tables where the guild id matches
                await DB.query('DELETE FROM languages WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM antiAdvert WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM logs WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM mute WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM prefixes WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM staffrole WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM reactionRoles WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM starBlacklist WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM starred WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM starSettings WHERE guild = ?', [guildID]);
                await DB.query('DELETE FROM deleteCommandAfter WHERE guild = ?', [guildID]);
                // Finally deleting the 'awaitingDelete' entry so we dont delete empty data indefinitely
                await DB.query(`DELETE FROM awaitingDelete WHERE guild = ?`, [guildID]);
                // Log debug info
                console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} Deleted data for guild [${guildID}] successfully!`);
            }
        }, 300000);
        // Load cache
        try {
            // Languages
            for (const guild of this.client.guilds.cache) {
                let [languagesDB] = await DB.query(`SELECT * FROM languages WHERE guild = ?`, [guild[0]]);
                let lans = languagesDB.length == 0 ? "english" : languagesDB[0].language;
                guildLanguages.push({
                    guildID: guild[0],
                    lan: lans
                })
            }
            console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'languages' cache initialized.`)
            // Anti advertisement
            let [antiAdvertData] = await DB.query(`SELECT * FROM antiAdvert`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'antiAdvert' cache initialized.`));
            antiAdvertise = antiAdvertData;
            // StaffRole 
            let [staffRoleData] = await DB.query(`SELECT * FROM staffrole`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'staffrole' cache initialized.`));
            staffRole = staffRoleData;
            // Blacklist
            const [blackListData] = await DB.query(`SELECT * FROM starBlacklist`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'starBlacklist' cache initialized.`));
            starBlacklistCache = blackListData;
            // ReactionRoles
            const [reactionRoleData] = await DB.query(`SELECT * FROM reactionRoles`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'reactionRoles' cache initialized.`));
            reactionRoles = reactionRoleData;
            // Custom prefixes
            const [prefixesData] = await DB.query(`SELECT * FROM prefixes`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'prefixes' cache initialized.`));
            customPrefixes = prefixesData;
            // Delete Commands
            const [deleteCommandData] = await DB.query(`SELECT * FROM deleteCommandAfter`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'deleteCommandAfter' cache initialized.`));
            deleteCommand = deleteCommandData;
        } catch (error) { console.log(error) }

    }
}

module.exports = ReadyListener;