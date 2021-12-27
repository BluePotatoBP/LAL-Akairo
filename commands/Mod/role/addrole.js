const { Command, Util } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class Addrole extends Command {
    constructor() {
        super('addrole', {
            aliases: ['addrole', 'addr', 'arole'],
            category: '',
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            ownerOnly: false,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Add any role to any user',
                usage: '<user> <role>',
                syntax: '<> - required'
            },
            args: [{
                id: 'm',
                type: 'member',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.addrole.prompt.member.start'),
                    retry: (message) => lang(message, 'command.addrole.prompt.member.retry')
                }
            },
            {
                id: 'r',
                type: 'role',
                unordered: true,
                prompt: {
                    start: (message) => lang(message, 'command.addrole.prompt.role.start'),
                    retry: (message) => lang(message, 'command.addrole.prompt.role.retry')
                }
            }
            ]
        });
    }

    async exec(message, { m, r }) {
        await delMsg(message, 30000);

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${m.user.username} ${lang(message, 'command.addrole.embed.desc.one')} ${r} ${lang(message,'command.addrole.embed.desc.two')}`)
            .setColor(crimson);

        if (m.roles.cache.has(r.id)) return message.channel.send({ embeds: [embed] });
        try {
            await message.react('<a:check:773208316624240710>');
        } catch (error) { }
        
        try {
            await m.roles.add(r.id);
        } catch (error) {
            console.log(error);
            await message.channel.send({ content: lang(message, "command.addrole.noPermsError") });
        }
    }
}
module.exports = Addrole;