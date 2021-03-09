const { Command } = require('discord-akairo');
const Table = require(`cli-table3`);
const paste = require("better-pastebin");
paste.setDevKey(process.env.PASTEBINKEY);

class Serverlist extends Command {
    constructor() {
        super('serverlist', {
            aliases: ['serverlist', 'slist'],
            ownerOnly: true,
            category: '',
            description: {
                content: '',
                usage: '',
                syntax: ''
            },
        });
    }

    async exec(message) {

        // Create a new table with the id, name, user count, bot count, total users count
        let table = new Table({
            head: ['ID', 'Name', 'Users', 'Bots', 'Total'],
            colWidths: [20, 25, 8, 8, 8]
        });
        // Push the data into the table  
        client.guilds.cache.map(g => table.push([g.id, g.name, g.members.cache.filter(u => !u.user.bot).size, g.members.cache.filter(u => u.user.bot).size, g.members.cache.size]));

        // Send the table to pastebin and console
        console.log(table.toString())
        paste.login("BluePotatoBP", process.env.PASTEBINPASSWORD, function(success, data) {
            if (!success) {
                console.log("Failed (" + data + ")");
                return false;
            }
            paste.create({
                contents: `${table.toString()}`,
                name: "Serverlist; private",
                privacy: "2",
                expires: '1D',
                format: 'javascript'
            }, async function(success, data) {
                if (success) {
                    try {
                        message.author.send(`Here ya go: ${data}`)
                        message.react("❤")
                    } catch (error) {
                        message.channel.send("Dude open DMs rn \nhttps://imgur.com/RLUojAU")
                    }
                } else {
                    console.log(data);
                    message.channel.send('Couldn\'t send the output to pastebin.com')
                }
            });
        });
    }
}
module.exports = Serverlist;