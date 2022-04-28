const { Listener } = require('discord-akairo');
const lzString = require('lz-string');

module.exports = class deleteOldReminders extends Listener {
    constructor() {
        super('deleteoldreminders', {
            event: 'ready',
            emitter: 'client'
        });
    }

    async exec(client) {
        // delay the execution by 2 seconds so cache loads
        setTimeout(async () => {
            // delete reminders that are older than 1 day
            let reminders = remindme.filter(c => c.dueAt <= (Math.floor(Date.now() / 1000)) - 300);
            let salvagableReminders = remindme.filter(c => c.dueAt <= (Math.floor(Date.now() / 1000)) - 120 && c.duetAt - (Math.floor(Date.now() / 1000)) < 120);
            if (!reminders.length) return;

            // if there are salvagableReminders try to resend them to the users DMs
            if (salvagableReminders.length) {
                for (let reminder of salvagableReminders) {
                    let user = await client.users.cache.get(reminder.user);
                    if (!user) continue;
                    let uncompressed = lzString.decompress(reminder.text);
                    setTimeout(async () => {
                        await user.send(`Sorry for the late reminder! <t:${reminder.originTime}:R> you told me to remind you about this:\n\n\`\`\`diff\n${uncompressed}\`\`\``).catch(async () => {
                            // if we couldnt reach the user delete data from cache and database
                            await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [reminder.messageId]);
                            remindme.splice(remindme.indexOf(reminder), 1);
                        })
                    }, 1000);
                }
            }
            // If there are no salvagable reminders delete reminders from the cache and database
            for (let reminder of reminders) {
                setTimeout(async () => {
                    // delete reminder from the array
                    remindme.splice(remindme.indexOf(reminder), 1);
                    // delete reminder from the db
                    await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [reminder.messageId]);
                }, 500);
            }

        }, 2000);
    }
};