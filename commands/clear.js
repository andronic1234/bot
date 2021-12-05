module.exports = {
    name: 'clear',
    description: "Clear Messages",
    
    async execute(client, message, cmd, args, Discord) {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply('You don\'t have the permission for that');
        } else
        if (cmd === 'clear'){
            console.log('Clear works')

            if(!args[0]) return message.reply("Please specify the amount of messages you want to clear.");
            if(isNaN(args[0])) return message.reply("I can only read numbers men am not that smart");

            if(args[0] > 100) return message.reply("I can only delete 100 messages  men sorry.");
            if(args[0] < 0) return message.reply("Ah, yes. Lemme write some messages real quick. Noob men");
            if(args[0] < 1)  return message.reply("Did u just type **0** lmao retard");
            
            
            await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);

            });
        }
    }
}
