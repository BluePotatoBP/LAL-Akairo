const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg, cutTo } = require('../../assets/tools/util');

class Userinfo extends Command {
    constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'whois', 'who', 'uinfo', 'whos'],
            category: 'Util',
            cooldown: 5000,
            ratelimit: 2,
            ownerOnly: false,
            description: {
                content: 'Shows useful information about any user',
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

        // Predefine some vars for later use
        let m = message.guild.members.cache.get(u.id);
        let highestRole = m.roles.highest.name;
        let statusState;
        let usergame;
        let statusEmojis = {
            dnd: '<:dnd:773212850364743742>',
            online: '<:online:773212850733711360>',
            idle: '<:idle:773212850533171211>',
            offline: '<:offline:773212850755862538>',
            streaming: '<:streaming:773212851174506565>'
        }
        // Check if user is on mobile and then show icon if they are
        let statusIndicator;
        if (m.presence) {
            if (m.presence.clientStatus.mobile === null) {
                statusIndicator = `${statusEmojis[m.presence.status]} <:mobile:802732331571740742>`
            } else statusIndicator = `${statusEmojis[m.presence.status]}`
        } else statusIndicator = statusEmojis.offline

        // If the given user isnt a member in that guild, send alternate embed
        if (!m) {
            const alternateEmbed = new MessageEmbed()
                .setAuthor(u.tag, u.displayAvatarURL({ dynamic: true }))
                .setDescription(`${u}\n \n**Info:** This user is not in your current guild.`)
                .addField(`Registered On:`, `\`${this.client.users.cache.get(u.id).createdAt.toUTCString().substr(0, 16)}\` <a:animatedCool:773205297782325259>`, true)
                .addField(`Avatar:`, `[PNG](${u.displayAvatarURL({ format: 'png', size: 4096 })} 'Link to the PNG Avatar')|[JPG](${u.displayAvatarURL({ format: 'jpg', size: 4096 })} 'Link to the PNG Avatar')|[GIF](${u.displayAvatarURL({ format: 'gif', size: 4096 })} 'Link to the GIF Avatar')`, true)
                .setColor(crimson)
                .setFooter(`ID: ${u.id}`)
                .setTimestamp()
            return message.channel.send({ embeds: [alternateEmbed] })
        } else {
            if (m.presence !== [] || null || undefined) { // Since v13 it can be any of this bs
                // Custom status logic, checks if they have a custom status, playing a game or listening to something on spotify
                for (let i = m.presence.activities.length - 1; i >= 0; i--) {
                    if (m.presence.activities[i].type === 'CUSTOM') { // If status type is custom, set userstate to that
                        statusState = 'Custom Status:'
                        let state = m.presence.activities[i].state;
                        let emoji = await message.guild.emojis.cache.get(m.presence.activities[i].emoji.id)
                        if (state && emoji) {
                            usergame = `${emoji} \`${cutTo(state, 0, 25, true)}\``
                        } else if (state && !emoji) {
                            usergame = `\`${cutTo(state, 0, 25, true)}\``
                        } else if (!state && emoji) {
                            usergame = emoji
                        } else usergame = '\`-\`'
                        //usergame = await cutTo(state !== null ? `\`${state}\`` : '\`-\`', 0, 20, true);
                    } else if (m.presence.activities[i].type === 'PLAYING') { // If status type is playing, set status to game name
                        statusState = 'Playing:'
                        usergame = m.presence.activities[i].name;
                        usergame = `\`${await cutTo(usergame, 0, 25, true)}\``;
                    } else if (m.presence.activities[i].type === 'LISTENING') { // If status type is listening, show song info
                        statusState = 'Listening to:'
                        // Get song name
                        let songName = m.presence.activities[i].details || 'Unknown';
                        songName = await cutTo(songName, 0, 25, true)
                        // Get artist name
                        let artist = m.presence.activities[i].state || 'Unknown';
                        artist = await cutTo(artist, 0, 25)
                        // Get album name
                        let album = m.presence.activities[i].assets.largeText || m.presence.activities[i].assets.smallText || 'Spotify'
                        album = await cutTo(album, 0, 25, true)
                        usergame = `\`${songName}\` by\n\`${artist}\` on\n\`${album}\``;
                    }
                }
            }

            let createdAt = Math.floor(this.client.users.cache.get(m.id).createdAt.getTime() / 1000)
            let joinedAt = Math.floor(message.guild.members.cache.get(m.id).joinedAt.getTime() / 1000)
            // Main embed with member
            const userInfoEmbed = new MessageEmbed()
                .setDescription(`${u.tag} ${statusIndicator}`)
                .setColor(crimson)
                .addField(`Joined:`, `<t:${joinedAt}:R> <a:blobDJ:773206358991962132>`, true)
                .addField(`Registered:`, `<t:${createdAt}:R> <a:animatedCool:773205297782325259>`, true)
                .addField(`Nickname:`, `${m.nickname ? m.nickname : '`-` <a:superRotating:773222147148742657>'}`, true)
                .addField(`Bot:`, `\`${m.bot ? 'true' : 'false'}\` <a:dancingSquidward:773219104479379467>`, true)
                .addField(`Highest role:`, `\`${highestRole}\` <a:handsClap:773222150676807716>`, true)
                .addField(statusState ? statusState : 'Status:', usergame ? usergame : '\`-\`', true)
                .setThumbnail(u.displayAvatarURL({ dynamic: true }))
                .setFooter(`ID: ${m.id}`)
                .setTimestamp();

            await message.channel.send({ embeds: [userInfoEmbed] }).catch((err) => console.log(err));
        }
    }
}
module.exports = Userinfo;