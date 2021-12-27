const { Listener } = require('discord-akairo');
const lzString = require('lz-string');

module.exports = class remindMeListener extends Listener {
    constructor() {
        super('remindmelistener', {
            event: 'ready',
            emitter: 'client'
        });
    }

    async exec(client) {

        // Get all reminders and sort them in a priority queue (remindMeUpcoming array)
        try {
            for (let i = 0; i < remindme.length; i++) {
                const timeDue = remindme[i].dueAt;
                if (timeDue - Date.now() / 1000 < 84600) {
                    remindmeUpcoming.push(remindme[i]);
                    remindme.splice(i, 1);
                } else if (timeDue > Date.now() / 1000) {
                    remindme.splice(i, 1);
                    await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [remindme[i].messageId]);
                } else continue;
            }
        } catch (error) {
            console.log(error);
            console.log("Theres probably no reminders saved in the database");
        }

        // After the reminders have been sorted in a priority queue, start a timeout for each one
        try {
            for (let i = 0; i < remindmeUpcoming.length; i++) {
                const timeDue = remindmeUpcoming[i].dueAt;
                setTimeout(async () => {
                    // Get the user
                    const user = await client.users.fetch(remindmeUpcoming[i].user);
                    // Decompress the text
                    const message = lzString.decompress(remindmeUpcoming[i].text);
                    // Send the reminder
                    await user.send(`${lang(message, "command.remindme.reminder.content.one")} <t:${remindmeUpcoming[i].originTime / 1000}:R> ${lang(message, "command.remindme.reminder.content.two")}\n\n\`\`\`diff\n${message}\`\`\``).catch(() => { })
                    // Delete the reminder from the database
                    await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [remindmeUpcoming[i].messageId]);
                    // Remove the reminder from the upcoming queue
                    remindmeUpcoming.splice(i, 1);
                }, timeDue * 1000);
            }
        } catch (error) {
            console.log(error);
            console.log("Theres probably no reminders saved in the database");
        }

    }
};