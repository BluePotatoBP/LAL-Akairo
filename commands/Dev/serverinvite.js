const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class ServerInvite extends Command {
	constructor() {
		super('serverinvite', {
			aliases: [ 'serverinvite' ],
			category: '',
			ownerOnly: true,
			description: {
				content: '',
				usage: '',
				syntax: ''
			},
			args: [
				{
					id: 'id',
					match: 'text',
					type: 'int'
				}
			]
		});
	}

	async exec(message, { id }) {
		try {
			let g = client.guilds.cache.get(id);
			let e = g.channels.cache.find((c) => c.type == 'text' && c.position == 1);

			e
				.createInvite({ maxAge: 300, maxUses: 1, reason: 'Dev Inspection' })
				.then((invite) =>
					message.channel.send(`Invite Link for **${g.name}**\nhttps://discord.gg/${invite.code}`)
				);

			message.delete().catch((e) => {});
		} catch (error) {
			message.react('❌');
		}
	}
}
module.exports = ServerInvite;
