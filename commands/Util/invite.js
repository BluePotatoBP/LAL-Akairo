const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Invite extends Command {
	constructor() {
		super('invite', {
			aliases: [ 'invite' ],
			category: 'Util',
			ownerOnly: false,
			description: {
				content: 'Invite me to your server!',
				usage: '',
				syntax: ''
			}
		});
	}

	async exec(message) {
		message.delete().catch((e) => {});

		let iembed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
			.setDescription(
				`[${lang(
					message,
					'command.invite.iembed.desc.one'
				)}](https://discordapp.com/oauth2/authorize?client_id=${client.user
					.id}&scope=bot&permissions=2081291519) ${lang(message, 'command.invite.iembed.desc.two')}`
			)
			.setColor(crimson)
			.setFooter(`🎉 Copyright © BluePotatoBP - 2020 🎉`, `${client.user.avatarURL({ dynamic: true })}`)
			.setTimestamp();

		message.channel.send(iembed);
	}
}
module.exports = Invite;
