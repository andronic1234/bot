module.exports = {
    name: 'playhelp',
    description: "playhelp menu",
    
    async execute(client, message, cmd, args, Discord) {
        const { MessageEmbed } = require('discord.js');
        if(cmd === 'playhelp'){
            message.delete(200);
            const PlayEmbed = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setAuthor('GoDSlayeR', message.author.avatarURL())
            .setTitle('Music Menu')
            .setDescription('**!play** `Plays music`. \n**!skip** `Skips current song.` \n**!stop** `Clears queue.` \n**!leave** `Makes bot leave vc.` \n**!pause/resume** `Pauses/unpauses current song.` \n**!remove** `Removes song from queue.` \n**!shuffle** `Shuffles queue.` \n**!loop** `Loops queue.`')
            .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
            .setTimestamp()
            message.channel.send({ embeds: [PlayEmbed] });
        }
    }
}