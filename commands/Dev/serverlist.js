const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const Table = require(`cli-table3`);
const { darkRed } = require("../../assets/colors.json")
let PastebinAPI = require('pastebin-js'),
    pastebin = new PastebinAPI({
        'api_dev_key': 'ea18216abe69e7ead54e74ca1e98b4b5',
        'api_user_name': 'BluePotatoBP',
        'api_user_password': `${process.env.PASTEBINPASSWORD}`
    });;

class Serverlist extends Command {
    constructor() {
        super('serverlist',
            {
                aliases: ['serverlist', 'slist'],
                ownerOnly: true,
                description: {
                    content: 'Lists all the servers this bot is in'
                },
            });
    }

    async exec(message) {

        // Create a new table with the id, name, user count, bot count, total users count
        let table = new Table({
            head: ['ID', 'Name', 'Users', 'Bots', 'Total'], colWidths: [20, 25, 8, 8, 8]
        });
        // Push the data into the table  
        client.guilds.cache.map(g => table.push([g.id, g.name, g.members.cache.filter(u => !u.user.bot).size, g.members.cache.filter(u => u.user.bot).size, g.members.cache.size]));

        // Send the table to pastebin
        console.log(table.toString())
        pastebin
            .createPaste({
                text: `${table.toString()}`,
                title: `Serverlist; private`,
                format: null,
                privacy: 2,
                expiration: '1M'
            })
            .then(function (data) {
                message.author.send(`Here ya go: ${data}`).catch(message.channel.send("Dude open DMs... \nhttps://imgur.com/RLUojAU"))
                message.react("❤")
            })
            .catch(error => {
                console.error(error);
                message.channel.send("Couldn't send the output to pastebin.com")
            });
    }
}
module.exports = Serverlist;