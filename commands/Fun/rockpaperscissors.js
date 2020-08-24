const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { pastelGreen, lightYellow, lightRed } = require('../../assets/colors.json')
const { promptMessage } = require("../../assets/tools/util");

class RPS extends Command {
    constructor() {
        super('rps',
            {
                aliases: ['rps', 'rockpaperscissors'],
                category: 'Fun',
                cooldown: 10000,
                ownerOnly: false,
                description: {
                    content: 'Play RPS against me!',
                    usage: '[rock|paper|scissors]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'i',
                        match: 'text',
                        type: 'string',
                        default: null

                    },
                ]
            });
    }

    async exec(message, { i }) {
        message.delete({ timeout: 30000 }).catch(e => { });

        let result = Math.floor((Math.random() * 3) + 1)
        const endEmbed = new Discord.MessageEmbed()

        if (i) {
            //#region Args
            i = i.toLowerCase();

            if (i === "rock") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: 🗻`)

                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: 📰`)

                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: ✂`)

                }
            }
            if (i === "paper") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: 🗻`)

                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: 📰`)

                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: ✂`)

                }
            }
            if (i === "scissors") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: 🗻`)

                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: 📰`)

                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: ✂`)

                }
            }
            await message.channel.send(endEmbed)
            //#endregion Args
        } else {
            //#region NoArgs
            const promptEmbed = new Discord.MessageEmbed()
                .setColor(pastelGreen)
                .setTitle(`React to one of the emoji below to play!`)
                .setDescription(`🗻 = Rock, 📰 = Paper, ✂ = Scissors`)

            let editEmbed = await message.channel.send(promptEmbed)
            const emoji = await promptMessage(editEmbed, message.author, 60, ["🗻", "📰", "✂"]);

            if (emoji === "🗻") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: 🗻`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: 📰`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: 🗻 & I chose: ✂`)

                    editEmbed.edit(endEmbed)
                }
            } else if (emoji === "📰") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: 🗻`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: 📰`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: 📰 & I chose: ✂`)

                    editEmbed.edit(endEmbed)
                }
            } else if (emoji === "✂") {
                if (result === 1) { // Rock 🗻
                    endEmbed.setColor(lightRed)
                    endEmbed.setDescription(`You lost against me! 😢`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: 🗻`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 2) { // Paper 📰
                    endEmbed.setColor(pastelGreen)
                    endEmbed.setDescription(`You won against me! 😁`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: 📰`)

                    editEmbed.edit(endEmbed)
                }
                if (result === 3) { // Scissors ✂
                    endEmbed.setColor(lightYellow)
                    endEmbed.setDescription(`You tied with me! 🤝`)
                    endEmbed.setTitle(`You chose: ✂ & I chose: ✂`)

                    editEmbed.edit(endEmbed)
                }
            } else {
                editEmbed.delete({ timeout: 60000 })
            };
            //#endregion NoArgs
        }
    }
}
module.exports = RPS;