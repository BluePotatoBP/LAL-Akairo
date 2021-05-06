const { Listener } = require('discord-akairo');
const chalk = require('chalk');

module.exports = class guildMemberRemove extends Listener {
    constructor() {
        super('guildmemberremove', {
            event: 'guildMemberRemove',
            emitter: 'client'
        });
    }

    async exec(member) {

        // Check if the user leaving is the bot
        if (member.user.id === this.client.user.id) {
            // Log info about guild
            console.log(`${debug('[DEBUG]')} ${chalk.magenta(this.client.user.username)} left the guild "${chalk.greenBright(member.guild.name)}" [${chalk.yellow(member.guild.id)}] (Kicked, or Force left)`)
        }
    }
};