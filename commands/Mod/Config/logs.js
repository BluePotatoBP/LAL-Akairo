const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const mysql = require('mysql2/promise');
const { crimson, pastelGreen, darkRed } = require('../../../assets/colors.json');

class Logs extends Command {
	constructor() {
		super('logs', {
			aliases: [ 'logs' ],
			category: '',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'later',
				usage: 'later',
				syntax: 'later'
			},
			args: [
				{
					id: 'ch',
					type: 'channel'
				}
			]
		});
	}

	async exec(message, { ch }) {
		message.delete({ timeout: 30000 }).catch((e) => {});
		let [ getData ] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [ message.guild.id ]);
		let [ getData2 ] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [ message.guild.id ]);

		if (ch) {
			if (getData.length === 0) {
				DB.query(`INSERT INTO logs (guild, channel) VALUES(?,?)`, [ message.guild.id, ch.id ]);
				const updatedLogs = new MessageEmbed()
					.setAuthor(`${message.author.username} • Logs Config`, message.author.avatarURL({ dynamic: true }))
					.setDescription(`Logs channel set to <#${ch.id}> \`[${ch.id}]\`.`)
					.setColor(pastelGreen)
					.setFooter(`You can update the channel with ${process.env.PREFIX}config logs <#channel>`)
					.setTimestamp();
				message.util.send(updatedLogs);
			} else {
				if (ch.id === getData[0].channel) {
					const updatedLogsExists = new MessageEmbed()
						.setAuthor(
							`${message.author.username} • Logs Config`,
							message.author.avatarURL({ dynamic: true })
						)
						.setDescription(`*Nothing changed.*\n\nLogs were already set to <#${ch.id}>.`)
						.setColor(pastelGreen)
						.setFooter(`You can set it to something else with ${process.env.PREFIX}config logs <#channel>`)
						.setTimestamp();
					message.util.send(updatedLogsExists);
				} else {
					DB.query(`UPDATE logs SET channel = ? WHERE guild = ?`, [ ch.id, message.guild.id ]);
					const updatedLogs = new MessageEmbed()
						.setAuthor(
							`${message.author.username} • Logs Config`,
							message.author.avatarURL({ dynamic: true })
						)
						.setDescription(`Logs updated to <#${ch.id}> \`[${ch.id}]\`.`)
						.setColor(pastelGreen)
						.setFooter(`You can update it again with ${process.env.PREFIX}config logs <#channel>`)
						.setTimestamp();
					message.util.send(updatedLogs);
				}
			}
		} else {
			if (getData.length === 0) {
				const noLogsData = new MessageEmbed()
					.setAuthor(`${message.author.username} • Logs Config`, message.author.avatarURL({ dynamic: true }))
					.setDescription(
						`*No data found for this guild.*\n\nYou can set the logs channel\nwith \`${process.env
							.PREFIX}config logs <#channel>\``
					)
					.setColor(darkRed);

				message.channel.send(noLogsData);
			} else {
				const defaultEmbed = new MessageEmbed()
					.setAuthor(`${message.author.username} • Logs Config`, message.author.avatarURL({ dynamic: true }))
					.addField('Saved Channel:', `<#${getData[0].channel}>`, true)
					.addField(
						'Info:',
						`If the bot leaves your guild, the\ndata is automatically deleted.\n*You can update the channel with*\n\`${process
							.env.PREFIX}config logs <#channel>\``,
						true
					)
					.setColor(crimson)
					.setTimestamp();
				if (getData2.length === 0) {
					defaultEmbed.addField(
						'Staff Role:',
						`\nConfigure with \n\`${process.env.PREFIX}config staffrole\``,
						true
					);
				}
				message.util.send(defaultEmbed);
			}
		}
	}
}
module.exports = Logs;
