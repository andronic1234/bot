module.exports = {
    name: 'help',
    description: "help menu",
    
    async execute(client, message, cmd, args, Discord) {
        const { MessageEmbed } = require('discord.js');
        if(cmd === 'help'){
            message.delete(200);
            const HelpEmbed = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setAuthor('GoDSlayeR', message.author.avatarURL())
            .setTitle('Help Menu')
            .setDescription('**!blog** `Sends a link to RotMG\'s blog.` \n**!clear** `Clears messages.(Perms only)` \n**!men** `Displays men counter.` \n**!leaderboard** `Displays The Men Leaderboard.` \n**!ping** `Displays bot\'s response time.` \n**!play** `Do` **!playhelp** `for more details.` \n**!stats** `Displays server\'s status.`')
            .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
            .setTimestamp()
            message.channel.send({ embeds: [HelpEmbed] });

        }
    }
}