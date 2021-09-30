const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js')
const { darkRed } = require('../assets/colors.json');

module.exports = class MissingPermissionsListener extends Listener {
	constructor() {
		super('missingPermissions', {
			event: 'missingPermissions',
			emitter: 'commandHandler',
			category: 'commandHandler'
		});
	}

	async exec(message, command, type, missing) {
		const text = {
			client: () => {
				const str = this.missingPermissions(message.channel, this.client.user, missing);

				const clientMP = client.util.embed()
					.setColor(darkRed)
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(`<a:cancel:773201205056503849> Im missing the ${str} permissions.`);

				return clientMP;
			},

			user: () => {
				const str = this.missingPermissions(message.channel, message.author, missing);

				const userMP = client.util.embed()
					.setColor(darkRed)
					.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
					.setDescription(`<a:cancel:773201205056503849> You are missing the ${str} permissions.`);
				return userMP;
			}
			
		}[type];

		if (!text) return;
		if (message.guild ? message.channel.permissionsFor(this.client.user).has(Permissions.FLAGS.SEND_MESSAGES) : true) {
			await message.channel.send({ embeds: [text()] });
		}
	}

	missingPermissions(channel, user, permissions) {
		const missingPerms = channel.permissionsFor(user).missing(permissions).map((str) => {
			if (str === 'VIEW_CHANNEL') return '`Read Messages`';
			if (str === 'SEND_TTS_MESSAGES') return '`Send TTS Messages`';
			if (str === 'USE_VAD') return '`Use VAD`';
			return `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, (char) => char.toUpperCase())}\``;
		});

		return missingPerms.length > 1 ? `${missingPerms.slice(0, -1).join(', ')} and ${missingPerms.slice(-1)[0]}` : missingPerms[0];
	}
};
