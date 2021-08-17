const { Command } = require('discord-akairo');
const crypto = require('crypto');
const { cutTo, delMsg } = require('../../assets/tools/util')

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
        await delMsg(message);

        // Voice region list
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

        // Random email domain list
        const emails = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'msn.com', 'comcast.net', 'live.com', 'outlook.com', 'protonmail.com']

        // Random password list
        const passwords = ['123456789', 'qwerty', 'password', '12345', `${cutTo(u.username.search('\d'), 0, 15, false)}`]

        // Random last DM list
        const dms = [
            'sry it wont happen again UwU',
            'yikes bro thats the tiniest one ive seen so far',
            '🤏',
            'man i love this lal bot',
            'BluePotatoBP: yeah no, didnt get any ideas from dank memer',
            'ye... he said no 😭',
            'she said no 😭',
            'damn i got beat with the ugly stick',
            'keeping my v card till the day i die',
            'OMG justin beiber just came to my house!!!',
            'eyo u want a shitpic?',
            'sigma male grindset',
            'Rawr X3 *nuzzles* How are you? *pounces on you* you\'re so warm o3o *notices you have a bulge*',
            'free onlybans, join now! https://www.thisworldthesedays.com/banhome.html',
            'I THINK I JUST GOT HACKED IDK WHAT TO DO PLS HELP!!!!!',
            'yikes']

        const twofa = ['2fa bypassed', 'no 2fa'];

        // Getting consistent results by seeding 
        let PRNG = require('prng'),
            prng = new PRNG(u.id);

        // generateId gets turned from integer to string
        async function generateId(len = 1) {
            let id = crypto.randomBytes(len / 2).toString('hex');
            return id;
        }

        try {
            let firstMsg = await message.channel.send({ content: `\`[Startup]\` Loading the sequence with upboot SQL on user **${u.tag}**... <a:gears:773203929507823617>` });
            setTimeout(async () => { await firstMsg.edit({ content: '`[10%]` Fetching the IP address... <a:gears:773203929507823617>' }).catch(e => { }) }, 5000);
            setTimeout(async () => { await firstMsg.edit({ content: '`[17%]` IP found: `192.168.***.***` <a:gears:773203929507823617>' }).catch(e => { }) }, 10000);
            setTimeout(async () => { await firstMsg.edit({ content: '`[23%]` Starting GeoIP lookup... <a:gears:773203929507823617>' }).catch(e => { }) }, 15000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[26%]\` Location: Somewhere in **${region[message.guild.region]}** <a:gears:773203929507823617>` }).catch(e => { }) }, 20000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[32%]\` Decrypting last DM... <a:gears:773203929507823617>` }).catch(e => { }) }, 24000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[35%]\` Last DM: \`${dms[dms.length]}\` <a:gears:773203929507823617>` }).catch(e => { }) }, 25000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[49%]\` Searching for Discord credentials... <a:gears:773203929507823617>` }).catch(e => { }) }, 30000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[55%]\` Credentials found (${twofa[prng.rand(twofa.length)]}): \`Email:${u.username.split(' ').join('')}@${emails[prng.rand(emails.length)]} Password: ${passwords[prng.rand(passwords.length)]} <a:gears:773203929507823617>` }).catch(e => { }) }, 35000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[69% (Nice)]\` Searching for the user token <a:gears:773203929507823617>` }).catch(e => { }) }, 40000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[81%]\` User token found: \`${generateId(12)}.******.**-*******************${generateId(5)}\` <a:gears:773203929507823617>` }).catch(e => { }) }, 45000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[99%]\` Cleaning up the mess... <a:gears:773203929507823617>` }).catch(e => { }) }, 50000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[COMPLETE]\` I will be sending you the user info in your DMs shortly. <a:gears:773203929507823617>` }).catch(e => { }) }, 55000);
            setTimeout(async () => { await firstMsg.edit({ content: `\`[COMPLETE]\` User info has been sent to your DMs (Unless they're locked.)` }).catch(e => { }) }, 55100);
            setTimeout(async () => { await message.author.send({ content: 'For all your doxxing needs: \n\n🤡🤡🤡' }).catch((e) => { }) }, 55000);


        } catch (error) {
            console.log(error);
            await message.channel.send({ content: 'Who deleted the message? <a:extremeShy:830640970642227211>' });
        }
    }
}
module.exports = Hack;