const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class What extends Command {
	constructor() {
		super('what', {
			aliases: [ 'what' ],
			category: 'Fun',
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'what',
				usage: '',
				syntax: 'what'
			}
			/*args: [
                    {
                        id: "id",
                        match: "text",
                        type: "number"
                    },
                ]*/
		});
	}

	async exec(message) {
		message.delete().catch((e) => {});

		message.channel.send('https://i.imgur.com/mgRPF1H.jpg').then(async (message) => {
			await message.react('605180742288408625'); // 1
			await message.react('750539957659238452'); // 2
			await message.react('750539957772222544'); // 3
			await message.react('750539957742862346'); // 4
			await message.react('750539957751250984'); // 5
			await message.react('750539957394735187'); // 6
			await message.react('750539957822685205'); // 7
			await message.react('622860599843618816'); // 8
		});
	}
}
module.exports = What;
