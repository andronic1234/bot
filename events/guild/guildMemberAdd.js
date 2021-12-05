const profileModel = require('../../models/profileSchema');

module.exports = async(client, Discord, member) =>{
    let profile = await profileModel.create({
        userID: member.id,
        serverID: member.guild.id,
        men: 0
    });
    profile.save();
}