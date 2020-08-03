const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')
var crypto = require("crypto");

class Hack extends Command {
    constructor() {
        super('hack',
            {
                aliases: ['hack'],
                category: 'Fun',
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Hacks into the selected users account',
                    usage: '<user>',
                    syntax: '<> - necessary'

                },
                args: [
                    {
                        id: 'u',
                        type: 'user',
                        prompt: {
                            start: 'Please give me a user to check \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a user to check \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    }
                ]
            });
    }

    async exec(message, { u }) {
        message.delete().catch(e => { });

        let region = {
            "brazil": "Brazil :flag_br:",
            "europe": "Europe :flag_eu:",
            "eu-central": "Central Europe :flag_eu:",
            "singapore": "Singapore :flag_sg:",
            "us-central": "U.S. Central :flag_us:",
            "sydney": "Sydney :flag_au:",
            "us-east": "U.S. East :flag_us:",
            "us-south": "U.S. South :flag_us:",
            "us-west": "U.S. West :flag_us:",
            "eu-west": "Europe :flag_eu:",
            "vip-us-east": "U.S. East :flag_us:",
            "india": "India :flag_in:",
            "japan": "Japan :flag_jp:",
            "london": "London :flag_gb:",
            "amsterdam": "Amsterdam :flag_nl:",
            "hongkong": "Hong Kong :flag_hk:",
            "russia": "Russia :flag_ru:",
            "southafrica": "South Africa :flag_za:"
        };

        // generateId :: Integer -> String
        function generateId(len = 1) {
            var id = crypto.randomBytes(len / 2).toString('hex');
            return id;
        }

        try {
            console.log(generateId(10))
            let firstMsg = await message.channel.send(`\`[Startup]\` Loading the sequence with upboot SQL on user **${u.tag}**... <a:gears:619268321065304065>`)
            setTimeout(() => {
                firstMsg.edit("\`[10%]\` Fetching the IP address... <a:gears:619268321065304065>");
            }, 5000);
            setTimeout(() => {
                firstMsg.edit("\`[15%]\` IP found: \`192.\*\*\*.\*\*\*.\*\*\*\` <a:gears:619268321065304065>");
            }, 10000);

            setTimeout(() => {
                firstMsg.edit("\`[23%]\` Starting GeoIP lookup... <a:gears:619268321065304065>");
            }, 15000);

            setTimeout(() => {
                firstMsg.edit(`\`[38%]\` Location: Somewhere in **${region[message.guild.region]}** <a:gears:619268321065304065>`);
            }, 20000);

            setTimeout(() => {
                firstMsg.edit("\`[49%]\` Searching for Discord credentials... <a:gears:619268321065304065>");
            }, 25000);

            setTimeout(() => {
                firstMsg.edit(`\`[55%]\` Credentials found (2fa bypassed): \`Email:${u.username.split(" ").join("")}@\*\*\*\*\*.\*\*\* Password: \*\*\*\*\*\*\*\*\` <a:gears:619268321065304065>`);
            }, 30000);

            setTimeout(() => {
                firstMsg.edit(`\`[69%]\` Searching for the user token <a:gears:619268321065304065>`);
            }, 35000);
            setTimeout(() => {
                firstMsg.edit(`\`[81%]\` User token found: \`${generateId(12)}.******.**-*******************${generateId(5)}\` <a:gears:619268321065304065>`);
            }, 40000);
            setTimeout(() => {
                firstMsg.edit(`\`[99%]\` Cleaning up the mess... <a:gears:619268321065304065>`);
            }, 45000);
            setTimeout(() => {
                firstMsg.edit(`\`[COMPLETE]\` I will be sending you the user info in your DMs shortly. <a:gears:619268321065304065>`);
            }, 50000);
            setTimeout(() => {
                message.author.send("For all your doxxing needs: 🤡").catch(e => {
                });
            }, 55000);
            setTimeout(() => {
                firstMsg.edit(`\`[COMPLETE]\` User info has been sent to your DMs (Unless they're locked.)`);
            }, 55100);

        } catch (error) {
            console.log(error)
            message.channel.send("Who deleted the message? <a:thinkpartyblob:605181120509771811><a:thinkpartyblob:605181120509771811><a:thinkpartyblob:605181120509771811>")
        }
    }
}
module.exports = Hack;