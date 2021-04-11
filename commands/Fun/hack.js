const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const crypto = require('crypto');

class Hack extends Command {
    constructor() {
        super('hack', {
            aliases: ['hack'],
            category: 'Fun',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Hack into the selected users account',
                usage: '<user>',
                syntax: '<> - necessary'
            },
            args: [{
                id: 'u',
                type: 'user',
                prompt: {
                    start: (message) => lang(message, 'command.hack.prompt.start'),
                    retry: (message) => lang(message, 'command.hack.prompt.retry')
                }
            }]
        });
    }

    async exec(message, { u }) {
        message.delete().catch((e) => { });

        let region = {
            brazil: 'Brazil :flag_br:',
            europe: 'Europe :flag_eu:',
            'eu-central': 'Central Europe :flag_eu:',
            singapore: 'Singapore :flag_sg:',
            'us-central': 'U.S. Central :flag_us:',
            sydney: 'Sydney :flag_au:',
            'us-east': 'U.S. East :flag_us:',
            'us-south': 'U.S. South :flag_us:',
            'us-west': 'U.S. West :flag_us:',
            'eu-west': 'Europe :flag_eu:',
            'vip-us-east': 'U.S. East :flag_us:',
            india: 'India :flag_in:',
            japan: 'Japan :flag_jp:',
            london: 'London :flag_gb:',
            amsterdam: 'Amsterdam :flag_nl:',
            hongkong: 'Hong Kong :flag_hk:',
            russia: 'Russia :flag_ru:',
            southafrica: 'South Africa :flag_za:'
        };

        // generateId :: Integer -> String
        function generateId(len = 1) {
            let id = crypto.randomBytes(len / 2).toString('hex');
            return id;
        }

        try {
            let firstMsg = await message.channel.send(
                `\`[Startup]\` Loading the sequence with upboot SQL on user **${u.tag}**... <a:gears:773203929507823617>`
            );
            setTimeout(() => {
                firstMsg.edit('`[10%]` Fetching the IP address... <a:gears:773203929507823617>').catch(e => { });
            }, 5000);
            setTimeout(() => {
                firstMsg.edit('`[15%]` IP found: `192.***.***.***` <a:gears:773203929507823617>').catch(e => { });
            }, 10000);

            setTimeout(() => {
                firstMsg.edit('`[23%]` Starting GeoIP lookup... <a:gears:773203929507823617>').catch(e => { });
            }, 15000);

            setTimeout(() => {
                firstMsg.edit(`\`[38%]\` Location: Somewhere in **${region[message.guild.region]}** <a:gears:773203929507823617>`).catch(e => { });
            }, 20000);

            setTimeout(() => {
                firstMsg.edit('`[49%]` Searching for Discord credentials... <a:gears:773203929507823617>').catch(e => { });
            }, 25000);

            setTimeout(() => {
                firstMsg.edit(`\`[55%]\` Credentials found (2fa bypassed): \`Email:${u.username.split(' ').join('')}@\*\*\*\*\*.\*\*\* Password: \*\*\*\*\*\*\*\*\` <a:gears:773203929507823617>`).catch(e => { });
            }, 30000);

            setTimeout(() => {
                firstMsg.edit(`\`[69%]\` Searching for the user token <a:gears:773203929507823617>`).catch(e => { });
            }, 35000);
            setTimeout(() => {
                firstMsg.edit(`\`[81%]\` User token found: \`${generateId(12)}.******.**-*******************${generateId(5)}\` <a:gears:773203929507823617>`).catch(e => { });
            }, 40000);
            setTimeout(() => {
                firstMsg.edit(`\`[99%]\` Cleaning up the mess... <a:gears:773203929507823617>`).catch(e => { });
            }, 45000);
            setTimeout(() => {
                firstMsg.edit(`\`[COMPLETE]\` I will be sending you the user info in your DMs shortly. <a:gears:773203929507823617>`).catch(e => { });
            }, 50000);

            setTimeout(() => {
                firstMsg.edit(`\`[COMPLETE]\` User info has been sent to your DMs (Unless they're locked.)`).catch(e => { });
            }, 55100);
            setTimeout(() => {
                message.author.send('For all your doxxing needs: 🤡').catch((e) => { });
            }, 55000);


        } catch (error) {
            console.log(error);
            message.channel.send(
                'Who deleted the message? <a:extremeShy:830640970642227211>'
            );
        }
    }
}
module.exports = Hack;