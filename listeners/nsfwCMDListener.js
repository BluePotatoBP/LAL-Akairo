const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../assets/colors.json')

module.exports = class nsfwCMD extends Listener {
    constructor() {
        super('nsfwCMD', {
            event: 'commandStarted',
            emitter: 'commandHandler'
        });
    }

    async exec(message, command, args) {
        if (message.channel.nsfw === false) {
            if (command.categoryID === 'Nsfw') {
                const randomTitles = ['WOAH BUDDY! NSFW now allowed here!', 
                                      'HEY, NSFW isn\'t allowed in this channel!', 
                                      'YO! Can\'t do that here, set the channel to NSFW mode!', 
                                      'WHOOPS, can\'t show that here, enable NSFW mode please!']

                const embed = new Discord.MessageEmbed()
                    .setTitle(randomTitles[Math.floor(Math.random() * randomTitles.length)])
                    .setDescription(`To use NSFW commands the channel has to be marked\nas NSFW, check channel settings for this toggle.${message.member.hasPermission('MANAGE_CHANNELS') ? '\n\nYou have \`MANAGE_CHANNELS\` permissions, so you should be able\nto change this setting!' : ''}`)
                    .setColor(crimson)
                    .setImage('https://i.imgur.com/oe4iK5i.gif')

                await message.channel.send(embed)
            }
        }
    }
};