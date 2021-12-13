module.exports = {
    name: 'men',
    description: "Men Counter",
    
    async execute(client, message, cmd, args, Discord, profileData) {
            if(cmd === 'men'){
            message.delete(200);
            if(!profileData) return;
            let the = message.author.username;
            message.channel.send(`**${the}** You have said men a total of **${profileData.men}** times!`);
        }
    }
}