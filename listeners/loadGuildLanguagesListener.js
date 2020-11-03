const { Listener } = require("discord-akairo")

class loadGuildLanguagesListener extends Listener {
    constructor() {
        super('loadGuildLanguages', {
            emitter: "client",
            event: "ready"
        })
    }

    async exec(client) {
        let i = 0;
        for (const guild of this.client.guilds.cache) {
            let [languagesDB] = await DB.query(`SELECT * FROM languages WHERE guildID = ?`, [guild[i]])

            let lans = languagesDB.length == 0 ? "english" : languagesDB[0].language;

            guildLanguages.push({
                guildID: guild[i],
                lan: lans
            })

        }
    }
}
module.exports = loadGuildLanguagesListener