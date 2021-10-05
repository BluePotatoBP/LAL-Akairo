const { Command } = require('discord-akairo');
const { delMsg, cutTo } = require('../../assets/tools/util');
const fs = require("fs");
const path = require('path');

class checkLangFile extends Command {
    constructor() {
        super('checklangfile',
            {
                aliases: ['checklangfile'],
                category: '',
                ownerOnly: true,
                cooldown: 10000,
                description: {
                    content: '',
                    usage: '',
                    syntax: ''
                },
                args: [
                    {
                        id: 'lang',
                        match: 'text',
                        type: 'string',
                        prompt: {
                            start: "I need a lang file to check, chief.",
                            retry: "Oi, lang file or no deal.",
                            optional: false
                        }
                    },
                ]
            });
    }

    async exec(message, { lang }) {
        await delMsg(message, 30000);
        // For whatever reason fs doesnt accept direct path input so I gotta do this, im sure theres a way but I cant be bothered
        let path1 = path.join(__dirname, "../../assets/languages/lang/english.json")
        let path2 = path.join(__dirname, `../../assets/languages/lang/${lang}.json`)
        // Read lang files
        let b = fs.readFileSync(path1);
        let c = fs.readFileSync(path2);
        let baseFile = await JSON.parse(b);
        let checkFile = await JSON.parse(c);
        // If the files dont exist send message
        if (!baseFile) return await message.channel.send({ content: `Ugh chief... something went seriously wrong, the base file is gone 😱` })
        if (!checkFile) return await message.channel.send({ content: `Sorry, I couldnt find \'${lang}.json\'` })
        // Get both objects and turn them into a string, check if they match 100%, if not do the loop
        let baseKeys = Object.keys(baseFile);
        let checkKeys = Object.keys(checkFile);
        let baseStringified = baseKeys.sort().toString();
        let checkStringified = checkKeys.sort().toString();

        if (baseStringified === checkStringified) return await message.channel.send({ content: "Both file keys match 100%" })
        // If above returns false loop through all keys and check if they match, if not push to array
        let missingKeys = [];
        for (let i = 0; i < baseKeys.length; i++) {
            if (!checkKeys.find(c => c === baseKeys[i])) {
                missingKeys.push(baseKeys[i])
            }
        }

        let map = missingKeys.map(c => `\`${c}\`,`).join('\n');
        await message.channel.send({ content: missingKeys.length ? `${(checkKeys.length/baseKeys.length*100).toFixed(1)}% of the keys from \'${lang}.json\' match. \`${checkKeys.length}/${baseKeys.length}\` (${baseKeys.length - checkKeys.length} are missing)\n${cutTo(map, 0, 1500, true)}\nPlease check the console for a full list.` : `Both file keys match 100%` })

        missingKeys.length ? console.log(missingKeys) : '';
    }
}

module.exports = checkLangFile;