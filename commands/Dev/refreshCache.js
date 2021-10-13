const { Command } = require('discord-akairo');
const chalk = require('chalk');
const moment = require('moment')
const { delMsg } = require('../../assets/tools/util');

class refreshCache extends Command {
    constructor() {
        super('refreshCache',
            {
                aliases: ['refreshCache'],
                category: '',
                ownerOnly: true,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                }
            });
    }

    async exec(message) {
        await delMsg(message, 30000);
        // Console log some debug info
        console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} ${message.author.tag} issued a manual cache refresh from \'${message.guild.name}\' [${message.guild.id}]`)
        await message.channel.send({ content: "Refreshing cache... Please wait..." })

        try {
            // Load Languages
            for (const guild of this.client.guilds.cache) {
                let [languagesDB] = await DB.query(`SELECT * FROM languages WHERE guild = ?`, [guild[0]]);
                let lans = languagesDB.length == 0 ? "english" : languagesDB[0].language;
                guildLanguages.push({ guildID: guild[0], lan: lans })
            }
            console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'languages' cache initialized.`)
            // Load Anti advertisement
            let [antiAdvertData] = await DB.query(`SELECT * FROM antiAdvert`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'antiAdvert' cache initialized.`));
            antiAdvertise = antiAdvertData;
            // Load StaffRole 
            let [staffRoleData] = await DB.query(`SELECT * FROM staffrole`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'staffrole' cache initialized.`));
            staffRole = staffRoleData;
            // Load Blacklist
            const [blackListData] = await DB.query(`SELECT * FROM starBlacklist`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'starBlacklist' cache initialized.`));
            starBlacklistCache = blackListData;
            // Load ReactionRoles
            const [reactionRoleData] = await DB.query(`SELECT * FROM reactionRoles`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'reactionRoles' cache initialized.`));
            reactionRoles = reactionRoleData;
            // Load Custom prefixes
            const [prefixesData] = await DB.query(`SELECT * FROM prefixes`).then(console.log(`${chalk.gray(`(${moment(Date.now()).format('YYYY-MM-DD HH:m:s')})`)} ${debug('[DEBUG]')} 'prefixes' cache initialized.`));
            customPrefixes = prefixesData;
        } catch (error) { console.log(error) }

        setTimeout(async () => { await message.channel.send({ content: "Cache refreshed successfully!" }) }, 5000)
    }
}

module.exports = refreshCache;