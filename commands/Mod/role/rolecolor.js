const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class roleColor extends Command {
    constructor() {
        super('rolecolor',
            {
                aliases: ['rolecolor', 'rcolor'],
                category: '',
                clientPermissions: ['MANAGE_ROLES'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                },
                args: [
                    {
                        id: 'r',
                        type: 'role',
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.rolecolor.role.prompt.start"),
                            retry: (message) => lang(message, "command.rolecolor.role.prompt.retry"),
                            optional: false
                        }
                    },
                    {
                        id: 'color',
                        type: 'color',
                        default: crimson,
                        unordered: true,
                        prompt: {
                            start: (message) => lang(message, "command.rolecolor.color.prompt.start"),
                            retry: (message) => lang(message, "command.rolecolor.color.prompt.retry"),
                            optional: false
                        }
                    }
                ]
            });
    }

    async exec(message, { r, color }) {
        await delMsg(message, 30000);
        // Convert into to hex
        const intToHex = (int) => {
            let hex = Number(int).toString(16);
            if (hex.length < 2) hex = "0" + hex;
            return hex;
        };
        // Assign int to new hex
        color = intToHex(color)
        // Try to react with a checkmark
        try {
            await message.react('<a:check:773208316624240710>');
        } catch (error) { }
        // Try to change the color
        try {
            await r.edit({ color: color })
        } catch (error) {
            console.log(error);
            await message.channel.send({ content: lang(message, "command.addrole.noPermsError") });
        }

    }
}

module.exports = roleColor;