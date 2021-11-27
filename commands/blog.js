module.exports = {
    name: 'blog',
    description: "RotMG blog",

        async execute(client, message, cmd, args, Discord) {
        if(cmd === 'blog'){
            message.delete(200);
            message.channel.send('Here is the link for the blogpost: https://remaster.realmofthemadgod.com/?page_id=15')
        }
    }
}