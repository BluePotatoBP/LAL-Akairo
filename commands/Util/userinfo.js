const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Userinfo extends Command {
    constructor() {
        super('userinfo',
            {
                aliases: ['userinfo', 'whois', 'who', 'uinfo'],
                category: 'Util',
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Shows useful information about any member',
                    usage: '<user>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'u',
                        type: 'user',
                        default: msg => msg.author,

                    }
                ]
            });
    }

    async exec(message, { u }) {
        await message.delete().catch(e => { });

        let question = u.presence.status;
        let capitalize = question.charAt(0).toUpperCase() + question.slice(1);
        let m = message.guild.members.cache.get(u.id);
        let highestRole = m.roles.highest.name;

        let usergame;
        let userstatus;
        for (let i = u.presence.activities.length - 1; i >= 0; i--) {
            if (u.presence.activities[i].type == 'CUSTOM_STATUS') {
                userstatus = u.presence.activities[i].state;
            }
            else if (u.presence.activities[i].type == 'PLAYING') {
                usergame = u.presence.activities[i].name;
                if (usergame.length > 13) {
                    usergame = usergame.substr(0, 13) + "...";
                } else {
                    usergame = u.presence.activities[i].name;
                }
            }
        }

        try {
            var lastmsg = m.lastMessage.content;
        } catch (error) {
            lastmsg = "\`-\` <a:thinksjagposipga:605180056897060875>";
        }
        if (lastmsg.length > 13) {
            lastmsg = lastmsg.substr(0, 13) + "...";
        } else {
            lastmsg = `${m.lastMessage.content ? m.lastMessage.content : "\`-\` <a:thinksjagposipga:605180056897060875>"}`;
        }


        const userInfoEmbed = this.client.util.embed()
            .setAuthor(u.tag, u.avatarURL({ dynamic: true }))
            .setDescription(`<@${u.id}>`)
            .setColor(crimson)
            .addField(`Joined on:`, `\`${message.guild.members.cache.get(u.id).joinedAt.toUTCString().substr(0, 16)}\` <a:blobdj:605180387584507917>`, true)
            .addField(`Registered on:`, `\`${this.client.users.cache.get(u.id).createdAt.toUTCString().substr(0, 16)}\` <a:wobbleblob:605179634899877918>`, true)
            .addField(`Status:`, `\`${capitalize}\` <a:thinkpartyblob:605181120509771811>`, true)
            .addField(`Nickname:`, `${u.nickname ? u.nickname : "\`-\` <a:superrotating:605180742288408625>"}`, true)
            .addField(`Last message`, `${m.lastMessage ? `[${lastmsg}](${m.lastMessage.url})` : "\`-\`"}`, true)
            .addField(`Last channel:`, u.lastMessage ? `<#${u.lastMessageChannelID}>` : `\`-\``, true)
            .addField(`Bot:`, `\`${u.bot ? "True" : "False"}\` <a:squidwarddance:605180674785411082>`, true)
            .addField(`Highest role:`, `\`${highestRole}\` <a:ClapClap:605179995534655512>`, true)
            .addField(`Game:`, `\`${usergame ? usergame : "-"}\``, true)
            .setThumbnail(u.avatarURL({ dynamic: true }))
            .setFooter(`ID: ${u.id}`)
            .setTimestamp()

        await message.channel.send(userInfoEmbed).catch(err => console.log(err));

    }
}
module.exports = Userinfo;