module.exports = {
    name: 'upload',
    description: "test2",
    
    async execute(client, message, cmd, args, Discord) {
        var body;
        const superagent = require("superagent");
        if(cmd === 'upload'){
            message.delete(200);
            if (!message.member.roles.cache.some(role => role.name === 'MEN')) {
                return;
            } else {
                start()
                async function start() {
                body = await superagent.get(`http://www.popochan.nl/GoDSlayeR/Login/MenCounter.json`);
                message.channel.send(`${body.body[message.author.id].count}`);
            }
        }
        
        }
    }
}