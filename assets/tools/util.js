module.exports = {
    getMember: function (message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members) target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find((member) => {
                return (
                    member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind)
                );
            });
        }

        if (!target) target = message.member;

        return target;
    },

    cutTo: function (input, from = 0, to = 250, ending = true) {
        /* NOTE: Does not check for ' '(spaces) */
        if (input.length > to) {
            let output = input.substring(from, to);

            if (ending) {
                return output + '...';
            } else {
                return output;
            }
        } else {
            //input = s;
            return input;
        }
    },

    softWrap: function (input, length = 30) {
        const wrap = input.replace(new RegExp(`(?![^\\n]{1,${length}}$)([^\\n]{1,${length}})\\s`, 'g'), '$1\n');

        return wrap;
    },

    capitalize: function (input) {
        let capitalize = input.charAt(0).toUpperCase() + input.slice(1);

        return capitalize;
    },

    formatDate: function (date) {
        return new Intl.DateTimeFormat('en-US').format(date);
    },

    editPrompt: async function (message, embed) {
        let promptMsg;

        let promptMsgFind = await promptFilter.find(c => c.userID === message.author.id && c.channelID === message.channel.id);
        // If no message was found push alternate data to promptFilter
        if (!promptMsgFind) {
            promptMsg = await message.util.send({ embeds: [embed] });

            promptFilter.push({
                userID: message.author.id,
                msgID: promptMsg.id,
                channelID: message.channel.id,
            });
            return;
        }
        // If message found push to promptFilter
        if (promptMsgFind) {
            try {
                let promptMsgFetch = await message.channel.messages.fetch(promptMsgFind.msgID);
                promptMsg = await promptMsgFetch.edit({ embeds: [embed] });
                return
            } catch (e) {
                promptMsg = await message.util.send({ embeds: [embed] });
                promptFilter.push({
                    userID: message.author.id,
                    msgID: promptMsg.id,
                    channelID: message.channel.id,
                });
            }
        }
        return promptMsg;
    },

    delMsg: async function (message, time = 0) {
        setTimeout(async () => { await message.delete() }, time);
    },

    promptMessage: async function (message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author,
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions({ filter, max: 1, time: time })
            .then((collected) => collected.first() && collected.first().emoji.name);
    }
};