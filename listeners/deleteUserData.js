const { Listener } = require('discord-akairo');

module.exports = class deleteUserData extends Listener {
	constructor() {
		super('deleteUserData', {
			event: 'ready',
			emitter: 'client'
		});
	}

	async exec(guild) {
		// Checking the database every 5m for guild leaves
		setInterval(async () => {
			// Getting data from 'awaitingDelete'
			let [ data ] = await DB.query(`SELECT * FROM awaitingDelete WHERE leftAt + 604800000 < '${Date.now()}'`);

			// Iterating through data to get the guild id
			for (let i = 0; i < data.length; i++) {
				let guildID = data[i].guild;
				console.log(`${debug('[DEBUG]')} Guild [${guildID}] kicked the bot 7d ago. Deleting data.`);

				// Deleting data from all tables where the guild id matches
				await DB.query('DELETE FROM languages WHERE guildID = ?', [ guildID ]);
				await DB.query('DELETE FROM logs WHERE guild = ?', [ guildID ]);
				await DB.query('DELETE FROM mute WHERE guild = ?', [ guildID ]);
				await DB.query('DELETE FROM prefixes WHERE guild = ?', [ guildID ]);
				await DB.query('DELETE FROM staffrole WHERE guild = ?', [ guildID ]);

				// Finally deleting the 'awaitingDelete' entry so we dont delete empty data indefinitely
				await DB.query(`DELETE FROM awaitingDelete WHERE guild = ?`, [ guildID ]);
			}
		}, 300000);
	}
};
