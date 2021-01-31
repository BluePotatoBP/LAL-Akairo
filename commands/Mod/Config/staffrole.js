const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { crimson, pastelGreen } = require('../../../assets/colors.json');

class Staffrole extends Command {
    constructor() {
        super('staffrole', {
            aliases: ['staffrole'],
            userPermissions: ['MANAGE_ROLES'],
            category: '',
            ownerOnly: false,
            cooldown: 10000,
            description: {
                content: 'later',
                usage: '[role]',
                syntax: '[] - optional'
            },
            args: [{
                id: 'ch',
                type: 'role',
                prompt: {
                    start: (message) => lang(message, "command.staffrole.args.start"),
                    retry: (message) => lang(message, "command.staffrole.args.retry"),
                    optional: true
                }
            }]
        });
    }

    async exec(message, { ch }) {
        message.delete({ timeout: 30000 }).catch((e) => {});
        let [getData] = await DB.query(`SELECT * FROM staffrole WHERE guild = ?`, [message.guild.id]);
        let [getData2] = await DB.query(`SELECT * FROM logs WHERE guild = ?`, [message.guild.id]);
        let rolee;

        //Role to set given
        if (ch) {
            if (getData.length === 0) {
                rolee = await message.guild.roles.cache.get(ch.id);
            } else {
                rolee = await message.guild.roles.cache.get(getData[0].role);
            }

            if (getData.length === 0) {

                DB.query(`INSERT INTO staffrole (guild, role) VALUES(?,?)`, [message.guild.id, ch.id]);
                staffRole.push({
                    guild: message.guild.id,
                    role: ch.id
                })

                const updatedRole = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Staff Role Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, "command.staffrole.updatedRoleEmbed.desc")} ${rolee} \`[${ch.id}]\`.`)
                    .setColor(pastelGreen)
                    .setFooter(`${lang(message, "command.staffrole.updatedRoleEmbed.footer")} ${process.env.PREFIX}config staffrole <@role/id/name>`)
                    .setTimestamp();

                message.util.send(updatedRole);

            } else {
                if (ch.id === getData[0].role) {
                    //User gave same role as saved one
                    const updatedRoleExists = new MessageEmbed()
                        .setAuthor(`${message.author.username} • Role Config`, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${lang(message, "command.staffrole.updatedRoleExistsEmbed.desc")} ${rolee}.`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, "command.staffrole.updatedRoleExistsEmbed.footer")} ${process.env.PREFIX}config staffrole <@role/id/name>`)
                        .setTimestamp();
                    message.util.send(updatedRoleExists);

                } else {
                    //Update staff role 
                    DB.query(`UPDATE staffrole SET role = ? WHERE guild = ?`, [ch.id, message.guild.id]);

                    let findRoleCache = staffRole.find(c => c.guild == message.guild.id)
                    findRoleCache.role = ch.id

                    const updatedRole = new MessageEmbed()
                        .setAuthor(`${message.author.username} • Staff Role Config`, message.author.displayAvatarURL({ dynamic: true }))
                        .setDescription(`${lang(message, "command.staffrole.updatedRole2Embed.desc")} ${ch} \`[${ch.id}]\`.`)
                        .setColor(pastelGreen)
                        .setFooter(`${lang(message, "command.staffrole.updatedRole2Embed.footer")} ${process.env.PREFIX}config staffrole <@role/id/name>`)
                        .setTimestamp();
                    message.util.send(updatedRole);
                }
            }

            //No role given
        } else {
            //No data found
            if (getData.length === 0) {
                const noRoleData = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Staff Role Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`${lang(message, "command.staffrole.noRoleDataEmbed.desc")} \`${process.env.PREFIX}config staffrole [@role/id/name]\``)
                    .setColor(crimson)
                    .setFooter('Syntax: [] - optional')
                    .setTimestamp()

                message.channel.send(noRoleData);

            } else {
                rolee = await message.guild.roles.cache.get(getData[0].role);

                const defaultEmbed = new MessageEmbed()
                    .setAuthor(`${message.author.username} • Staff Role Config`, message.author.displayAvatarURL({ dynamic: true }))
                    .addField(lang(message, "command.staffrole.defaultEmbed.field1"), rolee, true)
                    .setColor(crimson)
                    .setTimestamp()

                if (getData.length !== 0) {
                    defaultEmbed.addField('Info:', `${lang(message, "command.staffrole.defaultEmbed.field2")}\n\`${process.env.PREFIX}config staffrole <@role/id/name>\``, true)
                }
                if (getData2.length === 0) {
                    defaultEmbed.addField('Logs Channel:', `\n${lang(message, "command.staffrole.defaultEmbed.field3")} \n\`${process.env.PREFIX}config logs\``, true);
                }
                message.util.send(defaultEmbed);
            }
        }
    }
}
module.exports = Staffrole;