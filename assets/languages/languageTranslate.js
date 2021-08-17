module.exports = (message, textCode) => {
    let lang;
    const selectedLanguageFind = guildLanguages.find(c => c.guildID == message.guild.id)

    if (!selectedLanguageFind) {
        lang = require(`./lang/english.json`)

        if (!lang[textCode]) return `I couldn't translate this message. [Report Here](https://discord.gg/v8zkSc9)`

        return lang[textCode]
    } else {
        try {
            lang = require(`./lang/${selectedLanguageFind.lan}.json`)
        } catch (error) {
            message.channel.send({content: 'Something went wrong... I reported it back to the developer!'})
        }

        if (!lang[textCode]) return `I couldn't translate this message. [Report Here](https://discord.gg/v8zkSc9)`

        return lang[textCode]
    }
}