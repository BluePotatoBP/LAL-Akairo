const { Listener } = require('discord-akairo');

module.exports = class deleteData extends Listener {
	constructor() {
		super('deleteData', {
			event: 'guildDelete',
			emitter: 'client'
		});
	}

	async exec(guild) {
		DB.query(`INSERT INTO awaitingDelete VALUES(?,?)`, [ guild.id, Date.now() ]);
	}
};
