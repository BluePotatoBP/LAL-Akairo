const { Listener } = require("discord-akairo");
const { crimson } = require('../assets/colors.json');
const addCooldown = new Set()
const removeCooldown = new Set()

module.exports = class clientReadyListener extends Listener {
	constructor() {
		super("msgReaction", {
			emitter: "client",
			event: "raw"
		})
	}
	async exec(packet) {
		let wait = msg => new Promise(res => setTimeout(res, msg));

		//#region Reaction added EVENT
		if (packet.t === "MESSAGE_REACTION_ADD") {

			// Check if the emoji is a star
			if (packet.d.emoji.name !== "⭐") return;

			// Cooldown check
			if (addCooldown.has(packet.d.user_id)) return

			// Get guild, if it cant find it return
			const guild = this.client.guilds.cache.get(packet.d.guild_id)
			if (!guild) return;

			// Get user channel
			const userChannel = guild.channels.cache.get(packet.d.channel_id)
			if (!userChannel) return;

			// Get user 
			const user = guild.members.cache.get(packet.d.user_id)

			// Get user message
			const userMessage = await userChannel.messages.fetch(packet.d.message_id)

			// Get settings from db
			const [guildSettings] = await DB.query(`SELECT * FROM starSettings WHERE guild = ?`, [guild.id])

			// Blacklist triger
			if (getBlackList(userChannel, user, guild)) return console.log("blacklist")

			// If settings are set to off, return in that guild
			if (guildSettings.length == 0 ? "false" : guildSettings[0].enabled === 'false') return;
			if (guildSettings.length == 0 ? "false" : guildSettings[0].allowSelfStar === 'false' && packet.d.user_id === userMessage.author.id) return;
			if (guildSettings.length == 0 ? "false" : guildSettings[0].allowNsfw === 'false' && userChannel.nsfw) return;

			const starCount = userMessage.reactions.cache.get('⭐') ? userMessage.reactions.cache.get('⭐').count : 0
			const minStars = guildSettings.length == 0 ? 1 : guildSettings[0].minStars
			const maxStars = guildSettings.length == 0 ? 200 : guildSettings[0].maxStars

			const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
			const originalStar = starredMessages.length == 0 ? user.user.username : starredMessages[0].originalStar


			//Bot Messages vars
			const botChannel = await getBotChannel()
			if (!botChannel) return;

			const botMessage = await getBotMessage()

			//Resend logger embed

			if (!botMessage) {


				if (starCount < minStars) {
					return starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?,?,?,?)`, [guild.id, userMessage.id, "NONE", userMessage.reactions.cache.get('⭐').users.cache.map(c => c.username).slice(0, 1).join(""), "false", Date.now(), starCount]) : await DB.query(`UPDATE starred SET botMessageID = ? WHERE userMessageID = ?`, [sentBotMsg.id, packet.d.message_id])
				}

				//Locked
				if (starCount >= maxStars) {
					await DB.query(`UPDATE starred SET lockedStars = ? WHERE userMessageID = ?`, [starCount, packet.d.message_id])
					const [lockedDB] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])


					const locked = this.client.util.embed()
						.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
						.setDescription(userMessage.content)
						.addField('Jump to Source <:starlock:816311266108375140>', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
						.setColor(crimson)
						.setFooter(`⭐${starCount} | Original star by ${originalStar}`)
						.setTimestamp()
					if (userMessage.attachments.size > 0) locked.setImage(userMessage.attachments.array()[0].url)
					const sentBotMsg = await botChannel.send(locked)

					if (starCount < minStars) {
						return starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?,?,?,?)`, [guild.id, userMessage.id, "NONE", userMessage.reactions.cache.get('⭐').users.cache.map(c => c.username).slice(0, 1).join(""), "false", Date.now(), starCount]) : await DB.query(`UPDATE starred SET botMessageID = ? WHERE userMessageID = ?`, [sentBotMsg.id, packet.d.message_id])
					}

					starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?,?,?,?)`, [guild.id, userMessage.id, sentBotMsg.id, user.user.username, "false", Date.now(), starCount]) : await DB.query(`UPDATE starred SET botMessageID = ? WHERE userMessageID = ?`, [sentBotMsg.id, packet.d.message_id])

					return
				}

				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | Original star by ${originalStar}`)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				const sentBotMsg = await botChannel.send(starEmbed)

				starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?,?,?,?)`, [guild.id, userMessage.id, sentBotMsg.id, user.user.username, "false", Date.now(), starCount]) : await DB.query(`UPDATE starred SET botMessageID = ?, lockedStars = ? WHERE userMessageID = ?`, [sentBotMsg.id, starCount, packet.d.message_id])

			} else {

				if (starCount < minStars) {
					return starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?,?,?,?)`, [guild.id, userMessage.id, "NONE", userMessage.reactions.cache.get('⭐').users.cache.map(c => c.username).slice(0, 1).join(""), "false", Date.now(), starCount]) : await DB.query(`UPDATE starred SET botMessageID = ? WHERE userMessageID = ?`, [sentBotMsg.id, packet.d.message_id])
				}

				if (starCount >= maxStars) {

					const [lockedDB] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])

					const locked = this.client.util.embed()
						.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
						.setDescription(userMessage.content)
						.addField('Jump to Source <:starlock:816311266108375140>', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
						.setColor(crimson)
						.setFooter(`⭐${lockedDB[0].lockedStars} | Original star by ${originalStar} `)
						.setTimestamp()
					if (userMessage.attachments.size > 0) locked.setImage(userMessage.attachments.array()[0].url)
					botMessage.edit(locked)

					return
				}

				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | Original star by ${originalStar} `)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				botMessage.edit(starEmbed)
				await DB.query(`UPDATE starred SET lockedStars = ? WHERE userMessageID = ?`, [starCount, packet.d.message_id])

			}


			//Functions
			async function getBotChannel() {


				//No saved logger channel
				if (guildSettings.length === 0) return null
				//Saved logger channel
				const botChannel = guild.channels.cache.get(guildSettings[0].channel)
				if (!botChannel) return null;
				return botChannel

			}

			async function getBotMessage() {

				const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
				//No logger embed found associated with the userMessageID
				if (starredMessages.length == 0) return null;
				try {
					const botMessage = await botChannel.messages.fetch(starredMessages[0].botMessageID)
					return botMessage
				} catch (e) {
					return null
				}

			}

			addCooldown.add(user.id)
			setTimeout(() => {
				addCooldown.delete(user.id)
			}, 5000)
		}
		//#endregion Reaction added EVENT

		//#region Reaction removed EVENT
		if (packet.t === "MESSAGE_REACTION_REMOVE") {
			if (packet.d.emoji.name !== "⭐") return;

			//Cooldowncheck
			if (addCooldown.has(packet.d.user_id)) return
			const guild = this.client.guilds.cache.get(packet.d.guild_id)
			if (!guild) return;

			//User Messages vars
			const userChannel = guild.channels.cache.get(packet.d.channel_id)
			if (!userChannel) return;

			const user = guild.members.cache.get(packet.d.user_id)
			const userMessage = await userChannel.messages.fetch(packet.d.message_id)

			// Get settings from db
			const [guildSettings] = await DB.query(`SELECT * FROM starSettings WHERE guild = ?`, [guild.id])

			// Blacklist triger
			if (getBlackList(userChannel, user, guild)) return;

			// If settings are set to off, return in that guild
			if (guildSettings.length == 0 ? "false" : guildSettings[0].enabled === 'false') return;
			if (guildSettings.length == 0 ? "false" : guildSettings[0].allowSelfStar === 'false' && packet.d.user_id === userMessage.author.id) return;
			if (guildSettings.length == 0 ? "false" : guildSettings[0].allowNsfw === 'false' && userChannel.nsfw) return;

			const starCount = userMessage.reactions.cache.get('⭐') ? userMessage.reactions.cache.get('⭐').count : 0
			const minStars = guildSettings.length == 0 ? 1 : guildSettings[0].minStars
			const maxStars = guildSettings.length == 0 ? 200 : guildSettings[0].maxStars

			const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
			const originalStar = starredMessages.length == 0 ? user.user.username : starredMessages[0].originalStar


			//Bot Messages vars
			const botChannel = await getBotChannel()
			if (!botChannel) return;
			const botMessage = await getBotMessage()

			//Resend logger embed
			if (!botMessage) {
				if (starCount <= minStars) {
					await DB.query(`DELETE FROM starred WHERE userMessageID = ?`, [userMessage.id])
					try { await botMessage.delete() } catch (error) { }
					return;
				}

				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | Original star by ${originalStar} `)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				const sentBotMsg = await botChannel.send(starEmbed)

				starredMessages.length == 0 ? await DB.query(`INSERT INTO starred VALUES (?,?,?,?)`, [guild.id, userMessage.id, sentBotMsg.id, user.user.username]) : await DB.query(`UPDATE starred SET botMessageID = ? WHERE userMessageID = ?`, [sentBotMsg.id, packet.d.message_id])


			} else {

				if (starCount <= minStars) {
					await DB.query(`DELETE FROM starred WHERE userMessageID = ?`, [userMessage.id])
					await botMessage.delete().catch(e => { })

					return;
				}
				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | Original star by  ${originalStar} `)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				botMessage.edit(starEmbed)

			}

			//Functions
			async function getBotChannel() {

				const [guildSettings] = await DB.query(`SELECT * FROM starSettings WHERE guild = ?`, [packet.d.guild_id])

				//No saved logger channel
				if (guildSettings.length === 0) return null
				//Saved logger channel
				const botChannel = guild.channels.cache.get(guildSettings[0].channel)
				if (!botChannel) return null;
				return botChannel

			}

			async function getBotMessage() {

				const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
				//No logger embed found associated with the userMessageID
				if (starredMessages.length == 0) return null;

				try {
					const botMessage = await botChannel.messages.fetch(starredMessages[0].botMessageID)
					return botMessage
				} catch (e) {
					return null
				}
			}

			removeCooldown.add(user.id)
			setTimeout(() => {
				removeCooldown.delete(user.id)
			}, 5000)
		}

		//#endregion Reaction removed EVENT
		if (packet.t === 'MESSAGE_REACTION_REMOVE_ALL') {

			const guild = this.client.guilds.cache.get(packet.d.guild_id)
			if (!guild) return;

			//User Messages vars
			const userChannel = guild.channels.cache.get(packet.d.channel_id)
			if (!userChannel) return;

			await wait(5000)

			const userMessage = await userChannel.messages.fetch(packet.d.message_id)
			const user = guild.members.cache.get(userMessage.author.id)
			const starCount = userMessage.reactions.cache.get('⭐') ? userMessage.reactions.cache.get('⭐').count : 0

			const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
			const originalStar = starredMessages.length == 0 ? user.user.username : starredMessages[0].originalStar
			//Bot Messages vars
			const botChannel = await getBotChannel()
			if (!botChannel) return;
			const botMessage = await getBotMessage()

			//Resend logger embed
			if (!botMessage) {

				if (starCount < 1) {
					await DB.query(`DELETE FROM starred WHERE userMessageID = ?`, [userMessage.id])
					await botMessage.delete().catch(e => { })
					return;
				}

				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | ${originalStar} `)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				const sentBotMsg = await botChannel.send(starEmbed)

				await DB.query(`INSERT INTO starred VALUES (?,?,?,?)`, [guild.id, userMessage.id, sentBotMsg.id, user.user.username])

			} else {

				if (starCount < 1) {
					await DB.query(`DELETE FROM starred WHERE userMessageID = ?`, [userMessage.id])
					await botMessage.delete().catch(e => { })
					return;
				}
				const starEmbed = this.client.util.embed()
					.setAuthor(userMessage.author.username, userMessage.author.displayAvatarURL({ dynamic: true }))
					.setDescription(userMessage.content)
					.addField('Jump to Source', `[${userMessage.channel}](${userMessage.url} 'Jump to the message!')`)
					.setColor(crimson)
					.setFooter(`⭐${starCount} | Original star by  ${originalStar} `)
					.setTimestamp()
				if (userMessage.attachments.size > 0) starEmbed.setImage(userMessage.attachments.array()[0].url)
				botMessage.edit(starEmbed)

			}

			//Functions
			async function getBotChannel() {

				const [guildSettings] = await DB.query(`SELECT * FROM starSettings WHERE guild = ?`, [packet.d.guild_id])

				//No saved logger channel
				if (guildSettings.length === 0) return null
				//Saved logger channel
				const botChannel = guild.channels.cache.get(guildSettings[0].channel)
				if (!botChannel) return null;
				return botChannel

			}

			async function getBotMessage() {

				const [starredMessages] = await DB.query(`SELECT * FROM starred WHERE userMessageID = ?`, [packet.d.message_id])
				//No logger embed found associated with the userMessageID
				if (starredMessages.length == 0) return null;

				try {
					const botMessage = await botChannel.messages.fetch(starredMessages[0].botMessageID)
					return botMessage
				} catch (e) {
					return null
				}
			}
		}


		//Blacklist cache function
		function getBlackList(userChannel, member, guild) {
			//Find Channel
			const channelFind = starBlacklistCache.find(g => g.blacklistedID === userChannel.id)
			if (channelFind) {
				return true;
			}
			const userFind = starBlacklistCache.find(g => g.guildID === guild.id && g.blacklistedID === member.id)
			if (userFind) {
				return true;
			}
			const rolesFind = starBlacklistCache.find(g => g.guildID === guild.id && member.roles.cache.some(r => r.id === g.blacklistedID))
			if (rolesFind) {
				return true;
			}
			return false;
		}
	}
}