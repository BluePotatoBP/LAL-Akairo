const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson, pastelGreen } = require('../../assets/colors.json');
const { delMsg, cutTo, promptMessage } = require('../../assets/tools/util');
const lzString = require('lz-string');

class reminders extends Command {
    constructor() {
        super('reminders',
            {
                aliases: ['reminder', 'reminders', 'remindlist', 'reminder-list', 'remind-list'],
                category: 'Util',
                ownerOnly: false,
                cooldown: 5000,
                description: {
                    content: 'later',
                    usage: 'later',
                    syntax: 'later'
                },
                args: [
                    {
                        id: 'clearone',
                        type: 'number',
                        match: 'option',
                        flag: ['clear', 'delete', 'remove'],
                    },
                    {
                        id: 'clearall',
                        match: 'flag',
                        flag: ['clearall', 'deleteall', 'removeall']
                    },
                ]
            });
    }

    async exec(message, { clearone, clearall }) {
        await delMsg(message, 30000);

        let reminders = remindme.filter(reminder => reminder.user === message.author.id);
        if (!reminders.length) return await message.channel.send({ content: "No reminders found!" });

        if (clearone) {
            let reminder = reminders[clearone - 1];
            if (!reminder) return await message.channel.send({ content: "That reminder doesn't exist!" });

            // Create a prompt
            const promptEmbed = new MessageEmbed()
                .setColor(pastelGreen)
                .setTitle("Are you sure you want to delete this reminder?")
                .setDescription(`React with ✅ if you want to delete reminder number **${clearone}**.`);
            let editEmbed = await message.channel.send({ embeds: [promptEmbed] });
            const emoji = await promptMessage(editEmbed, message.author, 30, ['✅', '❌']);

            if (emoji === "✅") {
                // Delete the reminder
                remindme.splice(reminders.indexOf(reminder), 1);
                await DB.query(`DELETE FROM remindMe WHERE messageId = ?`, [reminder.messageId]);

                const confirmationEmbed = new MessageEmbed()
                    .setColor(pastelGreen)
                    .setTitle("<a:check:773208316624240710> Complete")
                    .setDescription(`Reminder number **${clearone}** has been deleted!`);

                return await editEmbed.edit({ embeds: [confirmationEmbed] });
            } else {
                // Cancel deleting the reminder
                const canceledEmbed = new MessageEmbed()
                    .setColor(crimson)
                    .setTitle("<a:cancel:773201205056503849> Canceled")
                    .setDescription(`Canceled deleting reminder number **${clearone}**!`);

                return await editEmbed.edit({ embeds: [canceledEmbed] });
            }

        } else if (clearall) {
            // Create a prompt
            const promptEmbed = new MessageEmbed()
                .setColor(pastelGreen)
                .setTitle("Are you sure you want to delete all reminders?")
                .setDescription(`React with ✅ if you want to delete all reminders.`);
            let editEmbed = await message.channel.send({ embeds: [promptEmbed] });
            const emoji = await promptMessage(editEmbed, message.author, 30, ['✅', '❌']);

            if (emoji === "✅") {
                // Delete all reminders
                remindme.splice(0, reminders.length);
                await DB.query(`DELETE FROM remindMe WHERE user = ?`, [message.author.id]);

                const confirmationEmbed = new MessageEmbed()
                    .setColor(pastelGreen)
                    .setTitle("<a:check:773208316624240710> Complete")
                    .setDescription(`All reminders have been deleted!`);

                return await editEmbed.edit({ embeds: [confirmationEmbed] });
            } else {
                // Cancel deleting the reminder
                const canceledEmbed = new MessageEmbed()
                    .setColor(crimson)
                    .setTitle("<a:cancel:773201205056503849> Canceled")
                    .setDescription(`Canceled deleting all reminders!`);

                return await editEmbed.edit({ embeds: [canceledEmbed] });
            }
        } else {
            // make a var to store the reminders map and check its length, if over 2000 char cut it off
            let reminderMap = [];
            let reminderMapLength = 0;
            for (let reminder of reminders) {
                let reminderText = cutTo(`${lzString.decompress(reminder.text)}`, 0, 35, true);
                reminderMap.push(`\`${reminderText}\` <t:${reminder.dueAt}:R>`);
                reminderMapLength += reminderText.length;
            }
            if (reminderMapLength > 2000) {
                reminderMap = reminderMap.slice(0, 2000);
                reminderMap.push(`*...and ${reminders.length - reminderMap.length} more*`);
            }

            const embed = new MessageEmbed()
                .setColor(crimson)
                .setTitle(`Reminders for ${message.author.tag}`)
                .setDescription(reminderMap.map((c, i) => `**${i + 1}.** ${c}`).join("\n"))
                .setTimestamp()

            await message.channel.send({ embeds: [embed] });
        }
    }
}

module.exports = reminders;