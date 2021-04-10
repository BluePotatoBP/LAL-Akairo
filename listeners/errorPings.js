const { Listener } = require('discord-akairo');
const { stripIndents } = require('common-tags');
const { lightRed } = require('../assets/colors.json')

module.exports = class ErrorListener extends Listener {
    constructor() {
        super('error', {
            event: 'error',
            emitter: 'commandHandler',
        });
    }

    async exec(err, message, command) {
        console.log(err)

        let errorID = Math.random().toString(36).substring(7);
        let logChannel = this.client.channels.cache.get("818871147156340777")
        const devLog = this.client.util.embed()
            .setColor('RANDOM')
            .setThumbnail(this.client.user.avatarURL({ dynamic: true }))
            .setTitle(`${this.client.user.username} ERROR HANDLER - INFO\n`)
            .setDescription(stripIndents`
                                    Guild: \`${message.guild.name}\`
                                    Channel: ${message.channel} \`[${message.channel.id}]\`
                                    User: ${message.author} \`[${message.author.id}]\`
                                    Command: \`${command.id || 'Not a command.'}\`
                                    Error: \`${err.toString()}\``)
            .setFooter(`ID: ${errorID}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()

        if (message.guild ? message.channel.permissionsFor(this.client.user).has(['SEND_MESSAGES', 'EMBED_LINKS']) : true) {
            const userEmbed = this.client.util.embed()
                .setColor(lightRed)
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(stripIndents`The \`${command.id}\` command could not be executed, if you'd
                                            like to report this, heres the error ID: \`${errorID}\`\n
                                            Click [here](https://discord.gg/v8zkSc9 'Like a Light Support') to join the support server.`)

            await message.util.send(userEmbed)
            await logChannel.send(devLog)

        } else if (message.guild ? message.channel.permissionsFor(this.client.user).has(['SEND_MESSAGES']) : true) {
            await message.util.send(stripIndents`The \`${command.id}\` command could not be executed.
                                                 If you decide to report this, heres the error ID: \`${errorID}\`
                                                 And heres the invite to the support server: 
                                                 https://discord.gg/v8zkSc9`)
            await logChannel.send(devLog)
        }
    }
}