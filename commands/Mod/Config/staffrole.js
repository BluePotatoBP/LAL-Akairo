const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson, pastelGreen, darkRed } = require('../../../assets/colors.json');

class Staffrole extends Command {
	constructor() {
		super('staffrole', {
			aliases: [ 'staffrole' ],
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
					type: 'role'
				}
			]
		});
	}

	async exec(message, { ch }) {
		message.delete({ timeout: 30000 }).catch((e) => {});
		let [ getData ] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [ message.guild.id ]);
		let [ getData2 ] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [ message.guild.id ]);
		let rolee = await message.guild.roles.cache.get(getData[0].role);

		if (ch) {
			if (getData.length === 0) {
				DB.query(`INSERT INTO staffrole (guild, role) VALUES(?,?)`, [ message.guild.id, ch.id ]);
				const updatedRole = new MessageEmbed()
					.setAuthor(
						`${message.author.username} • Staff Role Config`,
						message.author.avatarURL({ dynamic: true })
					)
					.setDescription(`Staff Role set to ${rolee} \`[${ch.id}]\`.`)
					.setColor(pastelGreen)
					.setFooter(
						`You can update the staff role with ${process.env.PREFIX}config staffrole <@role/id/name>`
					)
					.setTimestamp();
				message.util.send(updatedRole);
			} else {
				if (ch.id === getData[0].role) {
					const updatedRoleExists = new MessageEmbed()
						.setAuthor(
							`${message.author.username} • Role Config`,
							message.author.avatarURL({ dynamic: true })
						)
						.setDescription(`*Nothing changed.*\n\nStaff Role was already set to ${rolee}.`)
						.setColor(pastelGreen)
						.setFooter(
							`You can set it to something else with ${process.env
								.PREFIX}config staffrole <@role/id/name>`
						)
						.setTimestamp();
					message.util.send(updatedRoleExists);
				} else {
					DB.query(`UPDATE staffrole SET role = ? WHERE guild = ?`, [ ch.id, message.guild.id ]);
					const updatedRole = new MessageEmbed()
						.setAuthor(
							`${message.author.username} • Staff Role Config`,
							message.author.avatarURL({ dynamic: true })
						)
						.setDescription(`Staff Role updated to ${ch} \`[${ch.id}]\`.`)
						.setColor(pastelGreen)
						.setFooter(`You can update it again with ${process.env.PREFIX}config staffrole <@role/id/name>`)
						.setTimestamp();
					message.util.send(updatedRole);
				}
			}
		} else {
			if (getData.length === 0) {
				const noRoleData = new MessageEmbed()
					.setAuthor(
						`${message.author.username} • Staff Role Config`,
						message.author.avatarURL({ dynamic: true })
					)
					.setDescription(
						`*No data found for this guild.*\n\nYou can set it to something else with ${process.env
							.PREFIX}config staffrole <@role/id/name>`
					)
					.setColor(darkRed);

				message.channel.send(noRoleData);
			} else {
				const defaultEmbed = new MessageEmbed()
					.setAuthor(
						`${message.author.username} • Staff Role Config`,
						message.author.avatarURL({ dynamic: true })
					)
					.addField('Saved Role:', rolee, true)
					.addField(
						'Info:',
						`If the bot leaves your guild, the\ndata is automatically deleted.\n*You can update the staff role with*\n\`${process
							.env.PREFIX}config staffrole <@role/id/name>\``,
						true
					)
					.setColor(crimson)
					.setTimestamp();
				if (getData2.length === 0) {
					defaultEmbed.addField(
						'Logs Channel:',
						`\nConfigure with \n\`${process.env.PREFIX}config logs\``,
						true
					);
				}
				message.util.send(defaultEmbed);
			}
		}
	}
}
module.exports = Staffrole;
