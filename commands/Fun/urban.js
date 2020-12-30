const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const urban = require('urban');
const { crimson, darkRed } = require('../../assets/colors.json');

class Urban extends Command {
	constructor() {
		super('urban', {
			aliases: [ 'urban' ],
			category: 'Fun',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: "You're not sure what it means? The Urban Dictionary most likely has an answer.",
				usage: '[query]',
				syntax: '[] - optional'
			},
			args: [
				{
					id: 'args',
					match: 'text',
					type: 'string'
				}
			]
		});
	}

	async exec(message, { args }) {
		message.delete().catch((e) => {});

		let search = (await args) ? urban(args) : urban.random();

		try {
			search.first(async (res) => {
				const nrembed = new Discord.MessageEmbed()
					.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
					.setDescription(lang(message, 'command.urban.nrembed.desc'))
					.setColor(darkRed)
					.setTimestamp();

				if (!res) return message.channel.send(nrembed);
				let { word, definition, example, thumbs_up, thumbs_down, permalink, author } = res;

				let nembed = new Discord.MessageEmbed()
					.setColor(crimson)
					.setAuthor(
						`${lang(message, 'command.urban.nembed.author')} '${word}'`,
						client.user.avatarURL({ dynamic: true })
					)
					.setThumbnail('https://i.imgur.com/KeDXCWj.png')
					.setDescription(
						`
                        \`${lang(message, 'command.urban.nembed.desc.definition')}\` \n${definition ||
							lang(message, 'command.urban.nembed.desc.noDefinition')}
                        \`${lang(message, 'command.urban.nembed.desc.example')}\` \n${example ||
							lang(message, 'command.urban.nembed.desc.noExample')}
                        \`${lang(message, 'command.urban.nembed.desc.upvotes')}\` ${thumbs_up || 0}
                        \`${lang(message, 'command.urban.nembed.desc.downvotes')}\` ${thumbs_down || 0}
                        \`${lang(message, 'command.urban.nembed.desc.link')}\` [${lang(
							message,
							'command.urban.nembed.desc.linkTo'
						)} '${word}'](${permalink || 'https://www.urbandictionary.com/'})`
					)
					.setTimestamp()
					.setFooter(`${lang(message, 'command.urban.nembed.desc.author')} ${author || 'unknown'}`);

				message.channel.send(nembed);
			});
		} catch (error) {
			console.log(error);
			const swrembed = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
				.setDescription("Whoops, something wen't wrong... Please try again!")
				.setColor(darkRed)
				.setTimestamp();
			message.channel.send(swrembed);
		}
	}
}
module.exports = Urban;
