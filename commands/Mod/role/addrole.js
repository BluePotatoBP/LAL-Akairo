const { Command, Util } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../../assets/colors.json');

class Addrole extends Command {
	constructor() {
		super('addrole', {
			aliases: [ 'addrole', 'addr', 'arole' ],
			category: '',
			clientPermissions: [ 'MANAGE_ROLES' ],
			userPermissions: [ 'MANAGE_ROLES' ],
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'Add any role to any user',
				usage: '<user> <role>',
				syntax: '<> - necessary'
			},
			args: [
				{
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
					match: 'phrase',
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
		message.delete({ timeout: 30000 }).catch((e) => {});

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
			.setDescription(
				`${m.user.username} ${lang(message, 'command.addrole.embed.desc.one')} ${r} ${lang(
					message,
					'command.addrole.embed.desc.two'
				)}`
			)
			.setColor(crimson);

		if (m.roles.cache.has(r.id)) return message.channel.send(embed);

		try {
			await m.roles.add(r.id);
			await message.react('<a:check:773208316624240710>');
		} catch (error) {
			console.log(error);
			message.channel.send("Please move my role above the one you're trying to add.");
		}
	}
}
module.exports = Addrole;
