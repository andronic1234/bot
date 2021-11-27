module.exports = {
    name: 'video',
    description: "test",
    
    async execute(client, message, cmd, args, Discord) {
        const { MessageEmbed } = require('discord.js');
        if(cmd === 'video'){
            message.delete(200);
            const VidEmbed = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setAuthor('GoDSlayeR', message.author.avatarURL())
            .setTitle('Random video men')
            .setDescription("http://popochan.nl/Ara/Private/Minecraft/Just%20Being%20Good.mp4")
            .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
            .setTimestamp()
            message.channel.send({ embeds: [VidEmbed] });
        }
    }
}