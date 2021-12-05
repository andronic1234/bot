const profileModel = require('../models/profileSchema');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: "Men Leaderboard",
    aliases: ['rank', 'lb', 'lead', 'ranks'],
    
    async execute(client, message, cmd, args, Discord, ) {
            if(cmd === 'leaderboard'){
            message.delete(200);
            try{
            let profileBoard = await profileModel.find({});
            
            let members = []

            for (let obj of profileBoard) {
                if(message.guild.members.cache
                .map((member) => member.id)
                .includes(obj.userID)) members.push(obj)
            }
    
            const Lead = new MessageEmbed()
            .setColor('DARK_GREEN')
            .setAuthor("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
            .setTitle('The Men Leaderboard')
            .setTimestamp()

            members = members.sort(function (b, a) {
                return a.men - b.men
            })

            members = members.filter(function BigEnough(value) {
                return value.men > 0
            })

            let pos = 0
            for( let obj of members) {
                pos++
                if(obj.userID == message.member.user.id) {
                    Lead.setFooter(`You're No.${pos} in the Leaderboard`)
                }
            }

            members = members.slice(0, 10)
            let desc = ""
            for(let i = 0; i < members.length; i++) {
                let user = client.users.cache.get(members[i].userID)
                if(!user) return
                let val = members[i].men
                desc += `**${i +1}.** __${user.tag}__ - ${val}\n`
            }

            Lead.setDescription(desc)

            message.channel.send({ embeds: [Lead] });
            }catch(err){
            console.log(err)
            }
        }
    }
}