module.exports = {
    name: 'ping',
    description: "Bot Ping",
    
    async execute(client, message, cmd, args, Discord) {
        if(cmd === 'ping'){
            message.delete(200);
            message.channel.send(`Pong! 🏓  Latency is **${Date.now() - message.createdTimestamp}ms.** API Latency is **${Math.round(client.ws.ping)}ms.**`)
        }
    }
}