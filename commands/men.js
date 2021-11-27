module.exports = {
    name: 'men',
    description: "Bot Ping",
    
    async execute(client, message, cmd, args, Discord) {
        const men = require('../men.json');
        if(cmd === 'men'){
            message.delete(200);
            let the = message.author.username;
            message.channel.send(`**${the}** You have said men a total of **${men[message.author.id].count}** times! Letsgoooo!!`);
        }
    }
}