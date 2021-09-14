const { Listener } = require('discord-akairo');
const { Permissions, MessageEmbed } = require('discord.js')
const { stripIndents } = require('common-tags');
const { lightRed, crimson } = require('../assets/colors.json');
const { cutTo } = require('../assets/tools/util');
const addCooldown = new Set()

module.exports = class ErrorListener extends Listener {
    constructor() {
        super('error', {
            event: 'error',
            emitter: 'commandHandler',
        });
    }

    async exec(err, message, command) {
        console.log(err)
        // return if user is on cooldown and define some vars for later
        if (addCooldown.has(message.author.id)) return;
        const errorID = Math.random().toString(36).substring(7);
        const logChannel = await client.channels.cache.get("818871147156340777");
        const devLogEmbed = new MessageEmbed()
            .setAuthor(`Error Catcher`, client.user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
            .setColor(crimson)
            .addField('Source', stripIndents`
                    Guild: ${message.guild.name} \`${message.guild.id}\`
                    Channel: ${message.channel} \`${message.channel.id}\`
                    User: ${message.author} \`${message.author.id}\``)
            .addField('Warning', stripIndents`
                    Command: \`${command ? command.id : 'Not a command.'}\`
                    Content: \`${message.content ? cutTo(message.content, 0, 300, true) : 'No content?'}\`
                    Error: \`${cutTo(err.message, 0, 1000, true)}\`
                    ID: \`${errorID}\``)
            .setFooter(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
        // Check if the bot has permissions to send msgs and embeds
        if (message.guild ? message.channel.permissionsFor(this.client.user).has([Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.EMBED_LINKS]) : true) {
            const userEmbed = new MessageEmbed()
                .setColor(lightRed)
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(stripIndents`The \`${command ? command.id : 'Internal-Module'}\` command could not be executed, 
                                            if you'd like to report this, heres the error ID: \`${errorID}\`\n
                                            Click [here](https://discord.gg/v8zkSc9 'Like a Light Support') to join the support server.`)

            await message.util.send({ embeds: [userEmbed] })
            await logChannel.send({ embeds: [devLogEmbed] })
            // Add user to cooldown so they cant spam the pings
            addCooldown.add(message.author.id);
            setTimeout(() => addCooldown.delete(message.author.id), 10000);
        } else if (message.guild ? message.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES) : true) {
            await message.util.send({
                content: stripIndents`The \`${command.id}\` command could not be executed.
                                                 If you decide to report this, heres the error ID: \`${errorID}\`
                                                 And heres the invite to the support server: 
                                                 https://discord.gg/v8zkSc9`})
            await logChannel.send({ embeds: [devLogEmbed] })
            // Add user to cooldown so they cant spam the pings
            addCooldown.add(message.author.id);
            setTimeout(() => addCooldown.delete(message.author.id), 10000);
        } else {
            // Add user to cooldown so they cant spam the pings
            addCooldown.add(message.author.id);
            setTimeout(() => addCooldown.delete(message.author.id), 10000);
            await logChannel.send({ embeds: [devLogEmbed] })
        }
    }
}