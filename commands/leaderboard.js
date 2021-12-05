const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: "Men Leaderboard",
    aliases: ['rank', 'lb', 'lead', 'ranks'],
    
    async execute(client, message, cmd, args, Discord, profileBoard) {
            if(cmd === 'leaderboard'){
            message.delete(200);
            if(!profileBoard) return;
            const Lead = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
            .setTitle('The Men Leaderboard')
            .setFooter(`${profileBoard}`)
            .setTimestamp()
            message.channel.send({ embeds: [Lead] });
        }
    }
}