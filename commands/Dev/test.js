const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const fetch = require('node-fetch');

class test extends Command {
    constructor() {
        super('test', {
            aliases: ['test'],
            category: '',
            ownerOnly: true,
            cooldown: 10000,
            description: {
                content: 'test',
                usage: 'test',
                syntax: 'test'
            },
            args: [{
                id: 's',
                prompt: {
                    start: 'benis give me shit 1',
                    retry: 'benis give me shit 2'
                }
            }]
        });
    }

    async exec(message, { s }) {
        message.delete({ timeout: 60000 }).catch((e) => {});

        var expression = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gi;
        var regex = new RegExp(expression);

        if (s.match(regex)) {
            message.util.send(`Successful match`);
        } else {
            message.util.send("No match");

            let a = ['test']
            if ('test' === a[0]) {
                message.channel.send('yes')
            }
        }

        /* // Mojang API
        const mojangData = await fetch(`https://api.mojang.com/users/profiles/minecraft/${s}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        let uuid;
        try {
            let mojson = await mojangData.json();
            uuid = mojson.id;
        } catch (error) {
            return await message.util.send('give me normal username bruh');
        }

        await message.util.send(uuid);
        // Hypixel API
        const hypixelData = await fetch(
            `https://api.hypixel.net/skyblock/profiles?key=ca1797b3-3eb1-40a7-8782-fee6d1ca58cd&uuid=${uuid}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const hyjson = await hypixelData.json();

        //let whatever hyjson.profiles // u left off here cunt
        /*let hypixelResult = '';
        for (let i = 0; i < hyjson.items.length; i++) {
        	hypixelResult = hyjson.items[i].title + ' - ' + hyjson.items[i].text;
        	console.log(hypixelResult);
        }*/
    }
}
module.exports = test;