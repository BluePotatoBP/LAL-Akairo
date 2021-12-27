const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const { delMsg } = require('../../assets/tools/util');

class Avatar extends Command {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av'],
			category: 'Util',
			ownerOnly: false,
			cooldown: 5000,
			ownerOnly: false,
			description: {
				content: 'Someone has a dank pfp? Yoink, mine now',
				usage: '<user>',
				syntax: '<> - required'
			},
			args: [
				{
					id: 'u',
					type: 'user',
					default: (msg) => msg.author
				}
			]
		});
	}

	async exec(message, { u }) {
		await delMsg(message, 10000);

		let avatar;
		let pngicon;
		let jpgicon;
		let gificon;
		let avembed = new Discord.MessageEmbed()
			.setTimestamp()
			.setFooter(`${lang(message, 'command.avatar.avembed.content')} ${message.author.tag}`)
			.setColor(crimson);

		avembed.setTitle(`Avatar for ${u.tag}`);
		avatar = u.displayAvatarURL({ dynamic: true, size: 4096 });
		avembed.setImage(avatar);
		pngicon = u.displayAvatarURL({ format: 'png', size: 4096 });
		jpgicon = u.displayAvatarURL({ format: 'jpg', size: 4096 });
		gificon = u.displayAvatarURL({ format: 'gif', size: 4096 });
		avembed.setDescription(`Link as \n[PNG](${pngicon}) | [JPG](${jpgicon}) | [GIF](${gificon})`, true);

		message.channel.send({ embeds: [avembed] }).catch((err) => console.log(err));
	}
}
module.exports = Avatar;
