const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const { darkRed } = require('../../assets/colors.json')

class Addrole extends Command {
    constructor() {
        super('addrole',
            {
                aliases: ['addrole', 'ar', 'addr'],
                category: 'Mod',
                clientPermissions: ['MANAGE_ROLES'],
                userPermissions: ['MANAGE_ROLES'],
                ownerOnly: false,
                description: {
                    content: 'Add any role to any user',
                    usage: '<user> <role>',
                    syntax: '<> - necessary'
                },
                args: [
                    {
                        id: 'm',
                        type: 'member',
                        unordered: true,
                        prompt: {
                            start: 'Please give me a user and role to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                            retry: 'Please give me a user and role to continue \`(Mention/Username/Discrim/ID)\`. \nYou can either send it now or you can \`re-type\` the command.',
                        }
                    },
                    {
                        id: 'r',
                        match: 'phrase',
                        type: 'role',
                        unordered: true
                    },
                ]
            });
    }

    async exec(message, { m, r }) {
        message.delete({ timeout: 30000 }).catch(e => { });

          let pembed = new Discord.MessageEmbed()
            .setTitle("You dont have permissions to do that `LACK PERMISSIONS: MANAGE_ROLES`")
            .setColor(darkRed)
            .setFooter(`If this was a mistake you can edit the message.`)
            .setTimestamp()

          if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply(pembed).then(msg => msg.delete(30000));
          if (!r) {
              message.channel.send("Please gimme a role, ill add embed tomorrow (edit old msg)")
          }
          if (!m) {
              m = message.author;
          }
          
          if (m.roles.cache.has(r.id)) return message.channel.send(`That user already has the \`${r.name}\` role.`);
          await (m.roles.add(r.id));
        
          try {
            await m.message.react("✅")
          } catch (e) {
            message.react("✅");
          }
    }
}
module.exports = Addrole;