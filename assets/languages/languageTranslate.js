const replaceOnce = require('replace-once');

module.exports = (message, textCode) => {
    let lang;
    let selectedLanguageFind = guildLanguages.find(c => c.guildID == message.guild.id);
    let textToReplace = ['%AUTHOR_USERNAME%', '%AUTHOR_TAG%', '%BOT_USERNAME%', '%BOT_TAG%', '%GUILD_NAME%', '%PREFIX%', '%CUSTOM_PREFIX%', '(%NOTE).*\-(.*)(%)']
    let replaceWith = [
        message.author.username,
        message.author.tag,
        client.user.username,
        client.user.tag,
        message.guild.name,
        process.env.PREFIX,
        customPrefixes.find(c => c.guild === message.guild.id) ? customPrefixes.find(c => c.guild === message.guild.id).prefix : process.env.PREFIX,
        '',
    ]

    if (!selectedLanguageFind) {
        lang = require(`./lang/english.json`)
        if (!lang[textCode]) return `I couldn't translate this message. [Report Here](https://discord.gg/v8zkSc9)`;

        let textToTranslate = lang[textCode]
        let translated = replaceOnce(textToTranslate, textToReplace, replaceWith, "gmi")

        return translated;
    } else {
        lang = require(`./lang/${selectedLanguageFind.lan}.json`)
        if (!lang[textCode]) return `I couldn't translate this message. [Report Here](https://discord.gg/v8zkSc9)`;

        let textToTranslate = lang[textCode]
        let translated = replaceOnce(textToTranslate, textToReplace, replaceWith, "gmi")
        return translated;
    }
}