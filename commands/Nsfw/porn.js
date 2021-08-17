const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json');
const DabiImages = require('../../assets/tools/dabi-images/index');
const { delMsg } = require('../../assets/tools/util');
const { nsfw } = new DabiImages.Client();

class Porn extends Command {
    constructor() {
        super('randomporn', {
            aliases: ['porn', 'randomp', 'randomporn'],
            category: 'Nsfw',
            ownerOnly: false,
            nsfw: true,
            cooldown: 5000,
            ratelimit: 2,
            description: {
                content: 'Get a random nsfw image',
                usage: '[user]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'm',
                type: 'member'
            }]
        });
    }

    async exec(message, { m }) {
        await delMsg(message);

        try {
            if (!message.channel.nsfw) return;

            let image = await nsfw.real.random();

            await message.channel.send({ attachment: image });
        } catch (error) {
            await message.channel.send({ content: 'Something went wrong, please `re-type` the command.' })
        }
    }
}
module.exports = Porn;