const Discord = { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS] });
const fs = require('fs');
const mongoose = require('mongoose');


client.on('guildMemberAdd', guildMember =>{
    console.log('someone joined')
    let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'MEN');
 
    guildMember.roles.add(welcomeRole);
    guildMember.guild.channels.cache.get('788800600968003647').send(`Welcome <@${guildMember.user.id}> to the server`)
});


const activities_list = [
    "with his own code!", 
    "Ping Pong",
    "a Game", 
    "with cats",
    "with a rock",
    "with GoDSlayeR"
    ];

client.on('ready', () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
        client.user.setActivity(activities_list[index]);
    }, 10000);
});


client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log('Connected to MongoDB');
}).catch((err) =>{
    console.log(err);
});


const profileModel = require('./models/profileSchema');
client.on('message', async message => {
    if(message.author.bot) return;
    let messagearray = message.content.split(' ');
    let add = 0;
    for(var i = 0; i<messagearray.length; i++){
        if(messagearray[i] === 'men'){
            add++;
       }
    }
        const rewrite = await profileModel.findOneAndUpdate({
            userID: message.author.id,
        }, {
            $inc: {
                men: add,
            }
        });
        if(!rewrite){
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                men: 0,
            });
            profile.save();
        }
 });

client.login(process.env.DJS_TOKEN);
