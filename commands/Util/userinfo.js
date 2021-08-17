const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Userinfo extends Command {
    constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'whois', 'who', 'uinfo', 'whos'],
            category: 'Util',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Shows useful information about any member',
                usage: '<user>',
                syntax: '<> - necessary'
            },
            args: [{
                id: 'u',
                type: 'user',
                default: (msg) => msg.author
            }]
        });
    }

    async exec(message, { u }) {
        await delMsg(message);

        let question = u.presence.status;
        let capitalize = question.charAt(0).toUpperCase() + question.slice(1);
        let m = message.guild.members.cache.get(u.id);
        if (!m) {
            let status = {
                dnd: '\`Do Not Disturb\` <:dnd:773212850364743742>',
                online: '\`Online\` <:online:773212850733711360>',
                idle: '\`Idle\` <:idle:773212850533171211>',
                offline: '\`Offline\` <:offline:773212850755862538>',
                streaming: '\`Streaming\` <:streaming:773212851174506565>'
            }
            const alternateEmbed = this.client.util.embed()
                .setAuthor(u.tag, u.displayAvatarURL({ dynamic: true }))
                .setDescription(`${u}\n \n**Info:** This user is not in your current guild.`)
                .addField(`Registered On:`, `\`${this.client.users.cache.get(u.id).createdAt.toUTCString().substr(0, 16)}\` <a:animatedCool:773205297782325259>`, true)
                .addField(`Status:`, `${status[u.presence.status]}`, true)
                .addField(`Avatar:`, `[PNG](${u.displayAvatarURL({ format: 'png', size: 4096 })} 'Link to the PNG Avatar')|[JPG](${u.displayAvatarURL({ format: 'jpg', size: 4096 })} 'Link to the PNG Avatar')|[GIF](${u.displayAvatarURL({ format: 'gif', size: 4096 })} 'Link to the GIF Avatar')`, true)
                .setColor(crimson)
                .setFooter(`ID: ${u.id}`)
                .setTimestamp()
            return message.channel.send({ embeds: [alternateEmbed] })
        }
        let highestRole = m.roles.highest.name;

        let usergame;
        let statusState;
        for (let i = u.presence.activities.length - 1; i >= 0; i--) {
            if (u.presence.activities[i].type == 'CUSTOM_STATUS') {
                statusState = 'Custom Status:'
                usergame = `\`${u.presence.activities[i].state}\``;
            } else if (u.presence.activities[i].type == 'PLAYING') {
                statusState = 'Playing:'
                usergame = u.presence.activities[i].name;
                if (usergame.length > 20) {
                    usergame = `\`${usergame.substr(0, 20)}...\``;
                } else {
                    usergame = `\`${u.presence.activities[i].name}\``;
                }
            } else if (u.presence.activities[i].type == 'LISTENING') {
                statusState = 'Listening to:'
                let songName = u.presence.activities[i].details;
                if (songName.length > 15) {
                    songName = songName.substr(0, 15) + '...'
                }
                let artist = u.presence.activities[i].state;
                if (artist.length > 20) {
                    artist = artist.substr(0, 20)
                }
                let game = u.presence.activities[i].name.substr(0, 7)
                usergame = `\`${songName}\` by\n\`${artist}\` on\n\`${game}\``;
            } else {
                statusState = 'Status:'
                usergame = '\`-\`'
            }
        }

        try {
            var lastmsg = m.lastMessage.content;
        } catch (error) {
            lastmsg = '`-` <a:thinkColapse:773222808057675826>';
        }
        if (lastmsg.length > 13) {
            lastmsg = lastmsg.substr(0, 13) + '...';
        } else {
            lastmsg = `${m.lastMessage.content ? m.lastMessage.content : '`-` <a:thinkColapse:773222808057675826>'}`;
        }
        let mobileEmoji;
        try {
            if (u.presence.clientStatus.mobile) {
                mobileEmoji = '<:mobile:802732331571740742>'
            } else {
                mobileEmoji = ''
            }
        } catch (error) {
            mobileEmoji = ''
        }


        const userInfoEmbed = this.client.util.embed()
            .setAuthor(u.tag + mobileEmoji, u.displayAvatarURL({ dynamic: true }))
            .setDescription(u)
            .setColor(crimson)
            .addField(`Joined on:`, `\`${message.guild.members.cache.get(u.id).joinedAt.toUTCString().substr(0, 16)}\` <a:blobDJ:773206358991962132>`, true)
            .addField(`Registered on:`, `\`${this.client.users.cache.get(u.id).createdAt.toUTCString().substr(0, 16)}\` <a:animatedCool:773205297782325259>`, true)
            .addField(`Status:`, `\`${capitalize}\` <a:extremeShy:830640970642227211>`, true)
            .addField(`Nickname:`, `${u.nickname ? u.nickname : '`-` <a:superRotating:773222147148742657>'}`, true)
            .addField(`Last message`, `${m.lastMessage ? `[${lastmsg}](${m.lastMessage.url})` : '`-`'}`, true)
            .addField(`Last channel:`, u.lastMessage ? `<#${u.lastMessageChannelId}>` : `\`-\``, true)
            .addField(`Bot:`, `\`${u.bot ? 'True' : 'False'}\` <a:dancingSquidward:773219104479379467>`, true)
            .addField(`Highest role:`, `\`${highestRole}\` <a:handsClap:773222150676807716>`, true)
            .addField(statusState ? statusState : 'Activity:', usergame ? usergame : `\`-\``, true)
            .setThumbnail(u.displayAvatarURL({ dynamic: true }))
            .setFooter(`ID: ${u.id}`)
            .setTimestamp();

        await message.channel.send({ embeds: [userInfoEmbed] }).catch((err) => console.log(err));
    }
}
module.exports = Userinfo;