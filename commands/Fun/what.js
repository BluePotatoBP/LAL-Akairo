const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class What extends Command {
	constructor() {
		super('what', {
			aliases: [ 'what' ],
			category: 'Fun',
			clientPermissions: [ 'ADD_REACTIONS' ],
			ownerOnly: false,
			cooldown: 10000,
			description: {
				content: 'what',
				usage: '[message id]',
				syntax: '[] - optional'
			},
			args: [
				{
					id: 'id',
					match: 'text',
					type: 'message',
					default: (message) => {
						message.channel.send('https://i.imgur.com/mgRPF1H.jpg').then(async (message) => {
							await message.react('605180742288408625'); // 1
							await message.react('750539957659238452'); // 2
							await message.react('750539957772222544'); // 3
							await message.react('750539957742862346'); // 4
							await message.react('750539957751250984'); // 5
							await message.react('750539957394735187'); // 6
							await message.react('750539957822685205'); // 7
							await message.react('773222808057675826'); // 8
						});
					}
				}
			]
		});
	}

	async exec(message, { id }) {
		message.delete().catch((e) => {});

		if (id) {
			try {
				await id.react('605180742288408625'); // 1
				await id.react('750539957659238452'); // 2
				await id.react('750539957772222544'); // 3
				await id.react('750539957742862346'); // 4
				await id.react('750539957751250984'); // 5
				await id.react('750539957394735187'); // 6
				await id.react('750539957822685205'); // 7
				await id.react('773222808057675826'); // 8
			} catch (error) {
				console.log(error);
			}
		}
	}
}
module.exports = What;
