const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson, pastelGreen } = require('../../../assets/colors.json');
const { delMsg } = require('../../../assets/tools/util');

class deleteCmdAfter extends Command {
    constructor() {
        super('deletecmdafter',
            {
                aliases: ['deletecmdafter', 'delcmdafter', 'delcmd', 'delcmds', 'deletecommands'],
                userPermissions: ['MANAGE_MESSAGES'],
                clientPermissions: ['MANAGE_MESSAGES'],
                category: 'Mod',
                ownerOnly: false,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '[yes|no]]',
                    syntax: '[] - optional'
                },
                args: [
                    {
                        id: 'yesDelete',
                        match: 'flag',
                        flag: ['true', 'yes'],
                    },
                    {
                        id: 'noDelete',
                        match: 'flag',
                        flag: ['false', 'no'],
                    },
                ]
            });
    }

    async exec(message, { yesDelete, noDelete }) {
        await delMsg(message, 30000);
        // Get data from db
        const [getData] = await DB.query(`SELECT * FROM deleteCommandAfter WHERE guild = ?`, [message.guild.id]);
        let choice = 'yes';
        let del; getData.length === 0 ? del = 'yes' : del = getData[0].deleteCommand;
        let cacheData = deleteCommand.find(c => c.guild === message.guild.id);
        // If theres no args send info embed
        const infoEmbed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${lang(message, "command.deletecmdafter.infoEmbed.desc.content")} \`${del}\``)
            .setColor(crimson)
        if (!yesDelete && !noDelete) return await message.channel.send({ embeds: [infoEmbed] });
        if (yesDelete && cacheData.deleteCommand === 'yes' || noDelete && cacheData.deleteCommand === 'no') return await message.channel.send({ embeds: [infoEmbed] });
        // Check if theres any saved data
        if (yesDelete) {
            choice = 'yes';
            if (getData.length === 0) {
                await DB.query(`INSERT INTO deleteCommandAfter (guild, deleteCommand) VALUES(?,?)`, [message.guild.id, choice]);
                await deleteCommand.push({
                    guild: message.guild.id,
                    deleteCommand: choice
                })
            } else {
                await DB.query(`UPDATE deleteCommandAfter SET deleteCommand = ? WHERE guild = ?`, [choice, message.guild.id]);
                cacheData.deleteCommand = choice;
            }

        } else if (noDelete) {
            choice = 'no';
            if (getData.length === 0) {
                await DB.query(`INSERT INTO deleteCommandAfter (guild, deleteCommand) VALUES(?,?)`, [message.guild.id, choice]);
                await deleteCommand.push({
                    guild: message.guild.id,
                    deleteCommand: choice
                })
            } else {
                await DB.query(`UPDATE deleteCommandAfter SET deleteCommand = ? WHERE guild = ?`, [choice, message.guild.id]);
                cacheData.deleteCommand = choice;
            }
        }
        // Send update embed
        const updatedDelete = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`${lang(message, "command.deletecmdafter.updateEmbed.desc.content")} \`${choice}\``)
            .setColor(pastelGreen)

        await message.channel.send({ embeds: [updatedDelete] });
    }
}

module.exports = deleteCmdAfter;