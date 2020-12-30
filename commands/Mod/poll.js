const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson, darkRed } = require('../../assets/colors.json');

class Poll extends Command {
	constructor() {
		super('poll', {
			aliases: [ 'poll', 'vote', 'createpoll', 'createvote' ],
			category: 'Mod',
			clientPermissions: [ 'MANAGE_CHANNELS' ],
			userPermissions: [ 'MANAGE_CHANNELS' ],
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'Create a poll for the community to vote for something',
				usage: '[#channel] <text>',
				syntax: '<> - necessary, [] - optional'
			},
			args: [
				{
					id: 'c',
					match: 'phrase',
					type: 'channel',
					prompt: {
						start: (message) => lang(message, 'command.poll.channel.prompt.start'),
						retry: (message) => lang(message, 'command.poll.channel.prompt.retry'),
						optional: true
					}
				},
				{
					id: 't',
					match: 'rest',
					type: 'string',
					prompt: {
						start: (message) => lang(message, 'command.poll.text.prompt.start'),
						retry: (message) => lang(message, 'command.poll.text.prompt.retry')
					}
				}
			]
		});
	}

	async exec(message, { c, t }) {
		message.delete({ timeout: 30000 }).catch((e) => {});

		let sicon = message.guild.iconURL({ dynamic: true });

		const embed = new Discord.MessageEmbed()
			.setDescription(t)
			.setColor(crimson)
			.setThumbnail(sicon)
			.setFooter(`🎉 ${lang(message, 'command.poll.embed.pollAuthor')} ${message.author.username}! 🎉`, sicon)
			.setTimestamp();
		if (c) {
			// Sends embed and reacts
			c.send(embed).then(async (message) => {
				await message.react('🔺');
				await message.react('🔻');
			});
		} else {
			// Sends embed and reacts
			message.channel.send(embed).then(async (message) => {
				await message.react('🔺');
				await message.react('🔻');
			});
		}
	}
}
module.exports = Poll;
