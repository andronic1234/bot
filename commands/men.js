module.exports = {
    name: 'men',
    description: "Bot Ping",
    
    async execute(client, message, cmd, args, Discord, profileData) {
        // const men = require('../men.json');
            if(cmd === 'men'){
            let the = message.author.username;
            message.channel.send(`**${the}** You have said men a total of **${profileData.men}** times! Letsgoooo!!`);
        }
    }
}