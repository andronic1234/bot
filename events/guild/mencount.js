const { execute } = require('../../commands/men');
const profileModel = require('../../models/profileSchema');

module.exports = async(client, message, args, Discord, member, profileData) =>{
    if(message.author.bot) return;
    let messagearray = message.content.split(' ');
    let add = profileData.men;
    for(var i = 0; i<messagearray.length; i++){
        if(messagearray[i] === 'men'){
            add + 1;
       }
    }
        const men = await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: {
                men: add,
            }
        });

}