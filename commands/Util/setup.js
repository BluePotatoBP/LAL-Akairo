const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { crimson } = require('../../assets/colors.json')

class Setup extends Command {
    constructor() {
        super('setup',
            {
                aliases: ['setup'],
                category: 'Util',
                ownerOnly: true,
                cooldown: 10000,
                description: {
                    content: 'later',
                    usage: 'later',
                    syntax: 'later'
                },
                args: [
                    {
                        id: 'text',
                        match: 'text',
                        type: 'string',
                    },
                ]
            });
    }

    async exec(message, args) {
        //message.delete().catch(e => { });

        // Send first message and declare an empty array for storing the channels temporarily
        await message.util.send(`Welcome to the **${client.user.username}** bot setup!\n*Please sit tight while I check a few things.* <a:gears:773203929507823617>`);

        let channelArray = [];
        let roleArray = [];
        let steps = 10;
        let currentStep;

        // Search for all text type channels and push them to channelArray
        await message.guild.channels.cache.filter(c => c.type === "text").forEach(async (channel) => { channelArray.push(channel.name) })

        // Search for all roles with staff in their names
        await message.guild.roles.cache.forEach(async (role) => { roleArray.push(role.name) });

        let foundRole = roleArray.filter(value => value.match(/staff/gmi));

        // Check for channels with "logs" in the name
        let foundChannels = channelArray.filter(value => /(logs?)/.test(value));

        // If found do:
        if (foundChannels.length > 0) {

            // Set a timeout to give the effect of calculating 
            setTimeout(async () => {
                currentStep = 1;

                const pickLogsEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username} - BOT SETUP`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`*Okay, first on the list is a logs channel. <:logs:801080508310093834>\ny'know, for the bans... and stuff...* \n\n━━━━━━━━━━━━━━━━━━\n${foundChannels.length ? `I've found one or more channels with \`logs\` in its name.\nPlease pick one of the top 3 or #tag your custom channel now.` : `*Please pick a channel by #tagging it / sending the\nchannel ID now.*`}\n━━━━━━━━━━━━━━━━━━\n\n${foundChannels.length ? `1️⃣ ${foundChannels[0]}${foundChannels[1] ? `\n2️⃣ ${foundChannels[1]}` : ''}${foundChannels[2] ? `\n2️⃣ ${foundChannels[2]}` : ''}\n⏭ **CUSTOM CHANNEL**` : ` `}`)
                    .setColor(crimson)
                    .setFooter(`Step ${currentStep}/${steps}`)
                    .setTimestamp()

                let pickLogsMsg = await message.util.send(pickLogsEmbed)

                // React with correct ammount of emoji per channel
                switch (foundChannels.length) {
                    case 1:
                        await pickLogsMsg.react("1️⃣")
                        break;

                    case 2:
                        await pickLogsMsg.react("1️⃣")
                        await pickLogsMsg.react("2️⃣")
                        break;

                    default:
                        await pickLogsMsg.react("1️⃣")
                        await pickLogsMsg.react("2️⃣")
                        await pickLogsMsg.react("3️⃣")
                        break;
                }

                // Reaction collector until i can be arsed to use buttons
                const pickLogsReactionCollector = await pickLogsMsg.createReactionCollector((reaction, user) => {
                    return !user.bot && user.id === message.author.id;
                }, { time: 60000 });


                ////////////////// You left off here dingus
                /*btw collector.stop() will stop the collector but idk how to make 2 work at the same time and then have the embed/continue code in one if*/

                await pickLogsReactionCollector.on("collect", async (reaction, user) => {
                    // If ⏭ was used send custom channel embed
                    if (reaction.emoji.name === "⏭") {
                        // Remove all reactions after selection
                        await pickLogsMsg.reactions.removeAll().catch(e => console.log(e))

                        const pickedCustomChannelEmbed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.username} - BOT SETUP`, message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`Right, what channel would you like to set as logs?\n\nYou can send the channel ID or tag it. (#channel).`)
                            .setColor(crimson)
                            .setFooter(`Step ${currentStep}/${steps}`)
                            .setTimestamp()

                        await message.util.send(pickedCustomChannelEmbed);

                    } else {
                        // Check what reaction happened
                        let selectedChannel;
                        switch (reaction.emoji.name) {
                            case "1️⃣":
                                selectedChannel = foundChannels[0];
                                break;

                            case "2️⃣":
                                selectedChannel = foundChannels[1];
                                break;

                            case "3️⃣":
                                selectedChannel = foundChannels[2];
                                break;
                        }
                        // Remove all reactions after selection
                        await pickLogsMsg.reactions.removeAll().catch(e => console.log(e))
                        // Increment step
                        currentStep++;
                        // Switch to check what reaction happened


                        const pickedFoundChannelEmbed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.username} - BOT SETUP`, message.author.displayAvatarURL({ dynamic: true }))
                            .setDescription(`*Alright, I set the logs channel to \`${selectedChannel}\`* <a:check:773208316624240710>\n*Next we need a \`Staff Role\`* <a:gears:773203929507823617>\n\n${foundRole.length ? `━━━━━━━━━━━━━━━━━━\nI've found a role with \`staff\` in its name,\nif you'd like to have it set as the staff role\nreact with <:staffrole:801054561816805437>.\n\n*Or you can pick a custom role by @tagging \nit / sending the role ID now.*\n━━━━━━━━━━━━━━━━━━\n\n<:staffrole:801054561816805437> **${foundRole}**\n \n` : `*Please pick a role by @tagging it / sending the\nrole ID now.*`}`)
                            .setColor(crimson)
                            .setFooter(`Step ${currentStep}/${steps}`)
                            .setTimestamp()

                        let secondStaffRoleMsg = await message.util.send(pickedFoundChannelEmbed);

                    }


                });

            }, 5000)

        } else {
            setTimeout(() => {
                message.util.send("no logs channel found :(")
            }, 5000)
        }


    }
}
module.exports = Setup;