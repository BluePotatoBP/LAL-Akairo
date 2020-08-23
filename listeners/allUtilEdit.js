const { Listener } = require('discord-akairo');

module.exports = class commandFinishedListener extends Listener {
    constructor() {
        super('commandFinished', {
            event: 'commandFinished',
            emitter: 'commandHandler',
        });
    }

    async exec(message, command,  args, returnValue) {
   
        let promptMsgFind = await promptFilter.find(c => c.userID === message.author.id)

        if(!promptMsgFind) {     

        let promptFilterReset = promptFilter.filter(c => c.userID !== message.author.id)
        promptFilter = promptFilterReset
        return

        }
        let fetchMsg = await message.channel.messages.fetch(promptMsgFind.msgID)
       if(fetchMsg) await fetchMsg.delete({timeout: 5000})
          
    }
}