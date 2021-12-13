module.exports = {
    name: 'stats',
    description: "Status Page",

async execute(client, message, cmd, args, Discord) {
    const { MessageEmbed } = require('discord.js');
if(cmd === 'stats'){
    message.delete(200);
    const StatEmbed = new MessageEmbed()
    .setColor('DARK_GREEN')
    .setAuthor(message.author.avatarURL())
    .setTitle ('**Status**')
    .addFields(
        { name: 'Server Name:', value: `**${message.guild.name}**`, inline: true},
        { name: 'You joined at:', value: `**${message.member.joinedAt}**`},
        { name: 'Server Created at', value: `**${message.guild.createdAt.toDateString()}**`},
    )
    .setDescription('This is a **Discord** bot. :white_check_mark:\n')
    .setTimestamp()
        message.channel.send({ embeds: [StatEmbed] });
        }
    }
}