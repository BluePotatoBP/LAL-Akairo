const { Inhibitor } = require('discord-akairo');
const { MessageEmbed, Permissions } = require('discord.js');
const { crimson } = require('../assets/colors.json')

module.exports = class nsfwCMD extends Inhibitor {
    constructor() {
        super('nsfwCMD', {
            event: 'commandStarted',
            emitter: 'commandHandler'
        });
    }

    async exec(message, command, args) {
        if (message.channel.nsfw === false) {
            if (command.categoryID === 'Nsfw') {
                const randomTitles = [
                    'WOAH BUDDY! NSFW now allowed here!',
                    'HEY, NSFW isn\'t allowed in this channel!',
                    'YO! Can\'t do that here, set the channel to NSFW mode!',
                    'WHOOPS, can\'t show that here, enable NSFW mode please!']

                const embed = new MessageEmbed()
                    .setTitle(randomTitles[Math.floor(Math.random() * randomTitles.length)])
                    .setDescription(`To use NSFW commands the channel has to be marked\nas NSFW, ask an admin to check channel settings for this toggle.${message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS) ? '\n\nYou have \`MANAGE_CHANNELS\` permissions, so you should be able\nto change this setting!' : ''}`)
                    .setColor(crimson)
                    .setImage('https://i.imgur.com/oe4iK5i.gif')

                return await message.channel.send({ embeds: [embed] })
            }
        }
    }
};