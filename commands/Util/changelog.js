const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { ReactionCollector } = require('discord.js-collector');
const { MessageEmbed } = require('discord.js');

class Changelog extends Command {
	constructor() {
		super('changelog', {
			aliases: [ 'changelog' ],
			category: 'Util',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'later',
				usage: 'later',
				syntax: 'later'
			},
			args: [
				{
					id: 'text',
					match: 'text',
					type: 'string'
				}
			]
		});
	}

	async exec(message, args) {
		message.delete().catch((e) => {});

		const embed = new Discord.MessageEmbed()
			.setAuthor('📰 LAL Changelog 📰')
			.setColor(crimson)
			.setDescription('Loading...');
		const botMessage = await message.channel.send(embed);

		ReactionCollector.paginator({
			botMessage,
			user: message.author,
			pages: [
				new MessageEmbed()
					.setAuthor('📰 LAL Changelog 📰')
					.setDescription(
						"This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete."
					)
					.addField(
						'• 1.2.8',
						'⤷ *ADDED*  \n`Play command.`\n`Hangman game. (Play cmd)`\n`Connect4 game. (Play cmd)` \n`Snake game. (Play cmd)` \n⤷ *FIXED/UPDATED* \n`Merged addrole/removerole commands`\n`German translations updated thanks to` <@319183644331606016>'
					)
					.addField(
						'• 1.2.7',
						'⤷ *ADDED*  \n`Changelog command.` \n⤷ *FIXED/UPDATED* \n`Google command crashing the bot.`\n`README.md updated to include discord invite.`'
					)
					.setColor(crimson)
					.setFooter('Page: [1/3]', message.author.avatarURL({ dynamic: true }))
					.setTimestamp(),

				new MessageEmbed()
					.setAuthor('📰 LAL Changelog 📰')
					.setDescription(
						"This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete."
					)
					.addField(
						'• 1.2.5',
						'⤷ *ADDED*  \n`Language command.`\n`Slowmode command.`\n`Translations.`\n`README.md` \n⤷ *FIXED/UPDATED* \n`A lot of legacy code updated.`\n`Fixed inconsistencies with colors etc.`'
					)
					.addField(
						'• 1.2.0',
						'⤷ *ADDED*  \n`Initial push to GitHub 🤷‍♀️`\n⤷ *FIXED/UPDATED* \n`Initial push to GitHub 🤷‍♀️`'
					)
					.setColor(crimson)
					.setFooter('Page: [2/3]', message.author.avatarURL({ dynamic: true }))
					.setTimestamp(),

				new MessageEmbed()
					.setAuthor('📰 LAL Changelog 📰')
					.setDescription(
						"This is the bot changelog for LikeALight, \nbut unfortunately I haven't kept propper\nlogs before **v1.2.7** so it's uncomplete."
					)
					.addField('• 1.0.0', '⤷ *ADDED*  \n`-`\n⤷ *FIXED/UPDATED* \n`-`')
					.setColor(crimson)
					.setFooter('Page: [3/3]', message.author.avatarURL({ dynamic: true }))
					.setTimestamp()
			],
			collectorOptions: {
				time: 60000
			}
		});
	}
}
module.exports = Changelog;
