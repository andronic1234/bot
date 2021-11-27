module.exports = {
    name: 'stats',
    description: "Status Page",

async execute(client, message, cmd, args, Discord) {
    const { MessageEmbed } = require('discord.js');
if(cmd === 'stats'){
    message.delete(200);
    const StatEmbed = new MessageEmbed()
    .setColor('DARK_GREEN')
    .setAuthor('GoDSlayeR', message.author.avatarURL())
    .setTitle ('**Status**')
    .addFields(
        { name: 'Server Name:', value: `**${message.guild.name}**`, inline: true},
        { name: 'You joined at:', value: `**${message.member.joinedAt}**`},
        { name: 'Server Created at', value: `**${message.guild.createdAt.toDateString()}**`},
    )
    .setDescription('This is official **GoDSlayeR** bot :white_check_mark: **Certified!** \n Imagine not being in the best guild in the game smh.')
    .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
    .setTimestamp()
    if (message.member.roles.cache.some(role => role.name === 'MEN')) {
        StatEmbed.setDescription('This is official **GoDSlayeR** bot :white_check_mark: **Certified!** \n Omg ur from GoDSlayeR guild?? can i get autograph pls')
            }
        message.channel.send({ embeds: [StatEmbed] });
        }
    }
}