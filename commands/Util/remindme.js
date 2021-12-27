const { Command } = require('discord-akairo');
const { delMsg } = require('../../assets/tools/util');
const Sherlock = require('sherlockjs');
const moment = require('moment');
const lzString = require('lz-string');
const { stripIndents } = require('common-tags');

class remindMe extends Command {
    constructor() {
        super('remindme',
            {
                aliases: ['remindme', 'remind', 'reminder', 'timer'],
                category: 'Util',
                ownerOnly: true,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: 'in <time> <text>',
                    syntax: '<> - required'
                },
                args: [
                    {
                        id: 'text',
                        match: 'text',
                        type: 'string',
                        prompt: {
                            start: "Hey I need some text and a time to save, you can write it out in plain english.",
                            retry: "Sorry, I didnt quite get that, give me some text and a time to save, you can write it out in plain english."
                        }
                    },
                ]
            });
    }

    async exec(message, { text }) {
        await delMsg(message, 30000);

        // Define base var for parsed data
        const sherlocked = Sherlock.parse(text);
        // Define custom message id
        let messageId = Math.random().toString(36).substring(2);
        // Check if theres text to save, if not just save time
        let event = sherlocked.eventTitle ? stripIndents(sherlocked.eventTitle) : undefined;
        // Check if input text is longer then 1000 char
        if (event && text.length > 1000) return await message.channel.send({ content: `${lang(message, "command.remindme.charLimit.content")} \`(${text.length}/1000)\`` });
        // Check what kind of date sherlock thinks it found
        let date = sherlocked.startDate ? Math.floor(moment(sherlocked.startDate) / 1000) : Math.floor(moment(sherlocked.endDate) / 1000);
        let localTime = Math.floor(Date.now() / 1000);
        // If theres no date return an error message
        if (!date) return await message.channel.send({ content: lang(message, "command.remindme.invalidTime.content") });
        // If the input time is less then a minute return a message
        if (date - localTime <= 29) return await message.channel.send(`${lang(message, "command.remindme.lowTime.content")} \`${date - localTime}s\`)`);
        // If the input time is in the past return a funny message
        if (localTime > date) { return await message.channel.send({ content: lang(message, "command.remindme.backInTime.content") }).then(async (msg) => { await delMsg(msg, 30000) }) }
        // If theres an event compress it and send to database
        if (event) {
            let lzStringEncoded = lzString.compress(event)
            await DB.query(`INSERT INTO remindMe (text, dueAt, originTime, user, guild, messageId) VALUES(?,?,?,?,?,?)`, [lzStringEncoded, date, localTime, message.author.id, message.guild.id, messageId]);
            await remindme.push({
                text: lzStringEncoded,
                dueAt: date,
                originTime: localTime,
                user: message.author.id,
                guild: message.guild.id,
                messageId: messageId
            })
            // Send the confirmation msg
            let savedMsg = await message.channel.send({ content: `${lang(message, "command.remindme.success.content.one")} <t:${date}:R>. ${lang(message, "command.remindme.success.content.two")}` })
            await delMsg(savedMsg, 10000);
            // Send the reminder message
            if (date - localTime < 84600 && parseInt((client.uptime / 1000)) < 84600) {
                setTimeout(async () => {
                    // Send the reminder
                    await message.author.send(`${lang(message, "command.remindme.reminder.content.one")} <t:${localTime}:R> ${lang(message, "command.remindme.reminder.content.two")}\n\n\`\`\`diff\n${event}\`\`\``).catch(() => { })
                    // Delete the reminder from the database
                    await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [messageId]);
                    // Remove the reminder from the upcoming queue
                    let index = remindme.findIndex(x => x.messageId === messageId);
                    remindme.splice(index, 1);
                }, (date - localTime) * 1000);
            }
        } else return await message.channel.send({ content: lang(message, "command.remindme.noText.content") });
    }
}

module.exports = remindMe;