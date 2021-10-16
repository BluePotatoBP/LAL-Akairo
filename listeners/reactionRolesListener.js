const { Listener } = require('discord-akairo');
const { Permissions } = require('discord.js');
const wait = msg => new Promise(res => setTimeout(res, msg));
const addCooldown = [];
const removeCooldown = [];

module.exports = class rrListener extends Listener {
    constructor() {
        super('rrlistener', {
            emitter: "client",
            event: "raw"
        });
    }

    async exec(packet) {
        // Check if the user reacted to a bound emoji
        if (packet.t === "MESSAGE_REACTION_ADD") {
            // Get guild from packet
            const guild = this.client.guilds.cache.get(packet.d.guild_id);
            if (!guild) return;
            // Get user from packet and return if theres no user/the user is a bot
            const user = guild.members.cache.get(packet.d.user_id);
            if (!user) return;
            if (user.bot) return;
            if (user.id === guild.me.id) return;
            // Get emoji data from cache
            const cacheEmoji = await reactionRoles.find(c => c.emoji === packet.d.emoji.id);
            // Check if the reaction comes from the same guild as the cached emoji id
            if (!cacheEmoji || cacheEmoji.guild !== guild.id) return;
            if (cacheEmoji.message !== packet.d.message_id) return;
            // If the lock flag is enabled, do nothing 
            if (cacheEmoji.lockFlag) return;
            // Queue system
            let findRoles = addCooldown.filter(c => c.user === packet.d.user_id)
            addCooldown.push({ user: packet.d.user_id })
            await wait(2000 * findRoles.length)
            findRoles.splice(0, 1)
            // Check if self destruct option is enabled and get reaction details
            const getChannel = await guild.channels.cache?.get(packet.d.channel_id);
            const getMessage = await getChannel.messages.fetch(cacheEmoji.message);
            const reactionInfo = await getMessage.reactions.cache?.get(cacheEmoji.emoji);
            if (cacheEmoji.destructAt !== null && cacheEmoji.destructAt >= reactionInfo.count) {
                await getMessage.delete().catch(() => { })
                let deleteFlag = await reactionRoles.findIndex(c => c.message === getMessage.id)
                await reactionRoles.splice(deleteFlag)
                await DB.query(`DELETE FROM reactionRoles WHERE message = ?`, [getMessage.id]);
            }
            // If the message has the verify flag enabled, remove reaction after role is given
            if (cacheEmoji.verifyFlag && guild.me.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
                await reactionInfo.users.remove(packet.d.user_id).catch(() => { });
            // Check if the reverse flag is enabled, if yes remove role
            if (cacheEmoji.reverseFlag && guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                return await user.roles.remove(cacheEmoji.role).catch(() => { })
            }
            // Check if the bot has manage roles permissions
            if (guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                await user.roles.add(cacheEmoji.role).catch(() => { });
            } else return;

        }
        // Check if the user removed their reaction from a bound emoji
        if (packet.t === "MESSAGE_REACTION_REMOVE") {
            // Get guild from packet
            const guild = this.client.guilds.cache.get(packet.d.guild_id);
            if (!guild) return;
            // Get user from packet and return if theres no user/user is a bot
            const user = guild.members.cache.get(packet.d.user_id);
            if (!user) return;
            if (user.bot) return;
            if (user.id === guild.me.id) return;
            // Get emoji data from cache
            const cacheEmoji = await reactionRoles.find(c => c.emoji === packet.d.emoji.id);
            // Check if the reaction comes from the same guild as the cached emoji id
            if (!cacheEmoji || cacheEmoji.guild !== guild.id) return;
            if (cacheEmoji.message !== packet.d.message_id) return;
            // If the lock flag is enabled, do nothing 
            if (cacheEmoji.lockFlag) return;
            // Check if the very flag is enabled, if yes return
            if (cacheEmoji.verifyFlag) return;
            // Queue system
            let findRoles = removeCooldown.filter(c => c.user === packet.d.user_id)
            removeCooldown.push({ user: packet.d.user_id })
            await wait(2000 * findRoles.length)
            findRoles.splice(0, 1)
            // Check if the reverse flag is enabled, if yes add role
            if (cacheEmoji.reverseFlag && guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                return await user.roles.add(cacheEmoji.role).catch(() => { })
            }
            // Check if the bot has manage roles permissions
            if (guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
                await user.roles.remove(cacheEmoji.role).catch(() => { });
            } else return;
        }
    }
};