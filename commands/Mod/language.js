const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');

class Language extends Command {
	constructor() {
		super('language', {
			aliases: [ 'language', 'lang' ],
			category: 'Mod',
			ownerOnly: false,
			cooldown: 10000,
			clientPermissions: [ 'SEND_MESSAGES' ],
			userPermissions: [ 'MANAGE_MESSAGES' ],
			description: {
				content: '',
				usage: '[language]',
				syntax: '[] - optional'
			},

			*args(message) {
				let action = yield {
					type: [ 'contribute', 'german', 'english' ],
					default: 'showLan',
					prompt: {
						start: lang(message, 'command.language.prompt.start'),
						retry: lang(message, 'command.language.prompt.retry'),
						optional: true
					}
				};

				//Set new Language
				if (action !== 'contribute') {
					const i = action;
					action = 'translate';
					return { i, action };
				}

				//Show current language
				if (action == 'showLan') {
					action = 'translate';
					const i = 'showLan';
					return { i, showLan };
				}

				//Contribute
				if (action == 'contribute') return { action };
			}
		});
	}

	async exec(message, { action, i }) {
		message.delete({ timeout: 30000 }).catch((e) => {});

		if (action == 'translate') {
			let [ guildLanguageDB ] = await DB.query(`SELECT * FROM languages WHERE guildID = ? `, [
				message.guild.id
			]);
			let languageInArrayFind = guildLanguages.find((c) => c.guildID == message.guild.id);

			if (i == 'showLan') {
				let currentLan = languageInArrayFind ? languageInArrayFind.lan : 'english';
				const currentLang = new Discord.MessageEmbed()
					.setDescription(`${lang(message, 'command.language.currentLang.desc')} \`${currentLan}\``)
					.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
					.setColor(crimson)
					.setTimestamp();
				return message.channel.send(currentLang);
			}

			if (languageInArrayFind) languageInArrayFind.lan = i;
			if (!languageInArrayFind)
				guildLanguages.push({
					guildID: message.guild.id,
					lan: i
				});

			if (guildLanguageDB.length == 0)
				await DB.query(`INSERT INTO languages VALUES(?,?)`, [ message.guild.id, i ]);
			if (guildLanguageDB.length > 0)
				await DB.query(`UPDATE languages SET language = ? WHERE guildID = ?`, [ i, message.guild.id ]);

			const langUpdate = new Discord.MessageEmbed()
				.setDescription(`${lang(message, 'command.language.langUpdate.desc')} \`${i}\``)
				.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }))
				.setColor(crimson)
				.setTimestamp();

			await message.channel.send(langUpdate);
		} else {
			let sentContr;
			const contEmbed = new Discord.MessageEmbed()
				.setDescription(lang(message, 'command.language.contEmbed.desc'))
				.setColor(crimson);
			sentContr = await message.util.send(contEmbed);
			sentContr = await message.util.send({ files: [ './assets/languages/lang/english.json' ] });
		}
	}
}
module.exports = Language;
