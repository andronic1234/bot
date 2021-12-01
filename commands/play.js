const { MessageActionRow, MessageButton, ButtonInteraction } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, AudioPlayer, createAudioResource } = require('@discordjs/voice');
const { opus: Opus, FFmpeg } = require('prism-media');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { MessageEmbed } = require('discord.js');
const clear = require('./clear');
var tempMsg;
var player = createAudioPlayer();
var player2 = createAudioPlayer();
var queue = [];
var connection;
var stream;
var timeout;
var looping;
const evn = [
    'info',
    'progress',
    'abort',
    'request',
    'response',
    'error',
    'redirect',
    'retry',
    'reconnect',
];


module.exports = {
    name: 'play',
    description: "Play command",
    aliases: ['stop', 'skip', 'leave', 'pause', 'resume', 'remove', 'queue', 'shuffle', 'loop', 'p'],
    
    async execute(client, message, cmd, args, Discord) {
        
        const guildID = message.guild.id;
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.channel.send('Ur not in **joice** channel noob');
        
        if (cmd === 'play'){
            message.delete(200);
            if (!args.length) return message.channel.send('Men Giv song');
            if (queue.indexOf(guildID) == -1) {
                queue.push(guildID);
                queue.push([args.join(' ')]);
            } else {
                queue[queue.indexOf(guildID)+1].push(args.join(' '));
            }
            
            try {
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guildID,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                video_player(message, connection, true, false);
            } catch (err) {
                message.channel.send('Men i cant connect frick');
                throw err;
            }
            clearTimeout(timeout);
        }
        else if(cmd === 'skip') skip_song(message, connection);
        else if(cmd === 'stop') stop_song(message);
        else if(cmd === 'leave') leave_voice(message, connection)
        else if(cmd === 'pause') pause_song(player.pause());
        else if(cmd === 'resume') pause_song(player.pause(), true);
        else if(cmd === 'remove') remove_song(message, args);
        else if(cmd === 'queue') manifest_queue(message, args);
        else if(cmd === 'shuffle') shuffle_queue(message, connection);
        else if(cmd === 'loop') {looping = !looping; message.channel.send(looping ? "Queue will now loop." : "Queue will stop looping loops.");};
        
        console.log(queue, "Queue after full command (72)");
    }
}



const video_player = async (message, connection, adding, nextSong) => {
    const filters = [];
    let isList = false;
    let song = { url: " " };

    if (queue[queue.indexOf(message.guild.id)+1].length == 0) {
        console.log("No songs in queue, stop!");
        message.channel.send("No songs left in the queue!");
        player.pause();
        bot_timeout_leave(message, connection);
        return;
    }

    let newSongName = queue[queue.indexOf(message.guild.id)+1][0];
    if (adding) newSongName = queue[queue.indexOf(message.guild.id)+1][queue[queue.indexOf(message.guild.id)+1].length-1].toString();

    if (ytdl.validateURL(newSongName) || newSongName.includes("list=")) {
        if (newSongName.includes("list=")) {
            console.log(newSongName.substr(newSongName.search("list=")+5, 34));
            const list = await ytSearch( { listId: newSongName.substr(newSongName.search("list=")+5, 34) } );
            queue[queue.indexOf(message.guild.id)+1].pop();

            for (let i = 0; i < Math.min(list.videos.length, 80); i++) {
                queue[queue.indexOf(message.guild.id)+1].push(list.videos[i].title);
                song.url == " " ? song = { title: list.videos[i].title, url: `https://www.youtube.com/watch?v=${list.videos[i].thumbnail.substr(23, 11)}` } : song.url;
                if (i == 79) {
                    message.channel.send('Limit-breaker (max 80 songs per playlist, added the first 80, sorry bro(nii-chan))!');
                }
            }
            isList = true;
        } else {
            const song_info = await ytdl.getInfo(newSongName);
            song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
            console.log(song);
        }
    } else {
        const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return (video_result.videos.length > 1) ? video_result.videos[0] : null;
        }
        const video = await video_finder(newSongName);
        if(video){
            song = { title: video.title, url: video.url };
        } else {
            message.channel.send('Could not find video, please try again.');
        }
    }

    if (!isList && !looping) queue[queue.indexOf(message.guild.id)+1].splice(queue[queue.indexOf(message.guild.id)+1].length-1, 1, song.title);
    console.log(queue[queue.indexOf(message.guild.id)+1], "Queue after command 2 (127)");
    if (adding && queue[queue.indexOf(message.guild.id)+1].length == 1 || nextSong || isList) {
        message.channel.send(`🎶 Now playing **${song.title}**`);
    } else {
        message.channel.send(`Added **${song.title}** to the queue!`);
        return console.log("There are other songs in the queue, waiting for them to end...");
    }

    stream = await YouTubePlayer(song.url, {
        quality: 'highestaudio',
        filter: 'audioonly',
        highWaterMark: 1 << 25,
        type: "opus",
        encoder: filters.length ? ['-af', filters.join(',')] : [],
        opusEncoded: true,
    });

    stream.on('error', (err) => {
        message.channel.send("There was an error, check if everything is still working!");
        return console.log(
            `An unexpected error has occurred.\nPossible type \`${err}\``,
        );
    });

    const resource = createAudioResource(stream);
    connection.subscribe(player);
    player.play(resource);



    stream.on('finish', () => {
        bot_timeout_leave(message, connection);
    });
}

const pop_song = (message) => {
    let oldSong = queue[queue.indexOf(message.guild.id)+1][0];
    console.log(queue[queue.indexOf(message.guild.id)+1][0]);
    queue[queue.indexOf(message.guild.id)+1].shift();
    console.log(looping);
    if (looping) queue[queue.indexOf(message.guild.id)+1].push(oldSong);
}

const skip_song = (message, connection) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if (queue[queue.indexOf(message.guild.id)] == -1) {
        return message.channel.send(`There are no songs in queue 😔`);
    }
    pop_song(message);
    console.log(queue, "Queue after skipping (175)");
    clearTimeout(timeout);
    timeout = setTimeout(video_player.bind(null, message, connection, false, true), 600);
}

const stop_song = (message) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    queue[queue.indexOf(message.guild.id)+1] = [];
    player.pause();
}

const leave_voice = (message, connection) => {
    queue[queue.indexOf(message.guild.id)+1] = [];
    connection.destroy();
}

const pause_song = (paused, force) => {
    !paused || force ? player.unpause() : player.pause();
}

const bot_timeout_leave = (message, connection) => {
    clearTimeout(timeout);
    pop_song(message);
    if (queue[queue.indexOf(message.guild.id)+1].length == 0) {
        console.log(queue, "Queue after finish (199)");
        timeout = setTimeout(leave_voice.bind(null, message, connection), 600000);
    } else {
        video_player(message, connection, false, true);
    }
}

const remove_song = (message, args) => {
    console.log(args.toString());
    console.log(parseInt(args.toString()));
    var regexVar = new RegExp(args.join('.{0,60}').toString(), "i");
    if (parseInt(args.toString()) == 1) {
        skip_song(message, connection);
    } else if (parseInt(args.toString()) > 1) {
        if (parseInt(args.toString()) > queue[queue.indexOf(message.guild.id)+1].length) {
            return message.channel.send("No song found, count better next time.");
        }
        queue[queue.indexOf(message.guild.id)+1].splice(parseInt(args.toString())-1, 1);
    } else {
        let trackNum = 0;
        for (let i = 0; i < queue[queue.indexOf(message.guild.id)+1].length; i++) {
            if (queue[queue.indexOf(message.guild.id)+1][i].search(regexVar) != -1) {
                trackNum = i+1;
                break;
            }
        }
        if (trackNum < 1) {
            return message.channel.send("No song found, type better next time.");
        } else if (trackNum == 1) {
            skip_song(message, connection);
        }
        queue[queue.indexOf(message.guild.id)+1].splice(trackNum-1, 1);
    }
}

const manifest_queue = async (message, args, queuePage, queueMessage) => {
    var buttoned = false;
    if (queueMessage == null) var queueMessage;
    else buttoned = true;
    if (!queuePage) var queuePage = 1;

    if (queue.indexOf(message.guild.id) != -1 && queue[queue.indexOf(message.guild.id)+1].length != 0) {
        
        if (parseInt(args.join(' ')) > 1) {
            queuePage = parseInt(args.join(' '));
        }

        if (queuePage < 1) queuePage = 1;
        const queue_embed = new MessageEmbed()
        .setColor('DARK_GREEN')
        .setAuthor(message.guild.name, message.author.avatarURL())
        .setThumbnail("https://cdn.discordapp.com/attachments/755482197150007448/912481617950437437/GoDSlayeRLogoLOW2.png")
        .setTitle('Song queue')
        .setTimestamp()
        .setFooter(`page ${queuePage}`);

        if (queue[queue.indexOf(message.guild.id)+1].length-((queuePage-1)*10) < 0) {tempMsg = await message.channel.send(`Page doesn\'t exist, last page is **${Math.ceil(queue[queue.indexOf(message.guild.id)+1].length/10)}**.`); return;}
        for (let i = 0; i < (Math.min(queue[queue.indexOf(message.guild.id)+1].length-((queuePage-1)*10), 10)); i++) {
            queue_embed.addFields(
                { name: `󠁤󠁡󠁢󠁡󠁢󠁹󠁨`, value: `**${i+1+((queuePage-1)*10)} ｜ \`${queue[queue.indexOf(message.guild.id)+1][i+((queuePage-1)*10)]}\`**`}
            );
        }

        row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('First')
                .setLabel('First Page')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('Previous')
                .setLabel('Previous Page')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('Next')
                .setLabel('Next Page')
                .setStyle('SUCCESS'),
            new MessageButton()
                .setCustomId('Last')
                .setLabel('Last Page')
                .setStyle('PRIMARY'),
        );

        if (buttoned) {
            await queueMessage.edit({ embeds: [queue_embed], components: [row] });
        } else {
            queueMessage = await message.channel.send({ embeds: [queue_embed], components: [row] });
        }
        

        const collector = message.channel.createMessageComponentCollector();
        
        collector.on('collect', async(ButtonInteraction)  => {
            try {
                const id = ButtonInteraction.customId;
                if (id === 'First') {
                    queuePage = 1;
                }
                else if (id === 'Last') {
                    queuePage = Math.ceil(queue[queue.indexOf(message.guild.id)+1].length/10);
                }
                else if (id === 'Next') {
                    queuePage++;
                }
                else if (id === 'Previous') {
                    if (queuePage != 1){
                    queuePage--;
                    }
                }

                await ButtonInteraction.deferUpdate();
                await manifest_queue(message, args, queuePage, queueMessage);
            } catch {
                return console.log('Men it is gay (310)');
            }
        });
    }
    else return message.channel.send(`There is no queue, noob.`);
}


const shuffle_queue = (message, connection) => {

    queue[queue.indexOf(message.guild.id)+1].sort( ()=>Math.random()-0.5 );
    message.channel.send('Shuffling queue...');
    video_player(message, connection, false, true);
    
}





const YouTubePlayer = (url, opts) => {
    try {
        if (!url) {
            return console.log("No URL provided.");
        }
        if (typeof url !== 'string') {
            throw new SyntaxError(
                `input URL must be a string. Received ${typeof url}!`,
            );
        }

        let FFmpegArgs = [
            '-analyzeduration',
            '0',
            '-loglevel',
            '0',
            '-f',
            `${
                opts && opts.fmt && typeof opts.fmt == 'string' ? opts.fmt : 's16le'
            }`,
            '-ar',
            '48000',
            '-ac',
            '2',
        ];

        if (opts && opts.seek && !isNaN(opts.seek)) {
            FFmpegArgs.unshift('-ss', opts.seek.toString());
        }

        if (opts && opts.encoderArgs && Array.isArray(opts.encoderArgs)) {
            FFmpegArgs = FFmpegArgs.concat(opts.encoderArgs);
        }

        const dispatcher = new FFmpeg({
            args: FFmpegArgs,
        });

        const originalStream = ytdl(url, opts);
        const stream = originalStream.pipe(dispatcher);
        if (opts && !opts.opusEncoded) {
            for (const event of evn) {
                originalStream.on(event, (...args) => stream.emit(event, ...args));
            }
            originalStream.on('error', () => dispatcher.destroy());
            stream.on('close', () => dispatcher.destroy());
            return stream;
        }

        const opus = new Opus.Encoder({
            rate: 48000,
            channels: 2,
            frameSize: 960,
        });

        const streamStream = stream.pipe(opus);

        for (const event of evn) {
            originalStream.on(event, (...args) =>
                streamStream.emit(event, ...args),
            );
        }

        streamStream.on('close', () => {
            dispatcher.destroy();
            opus.destroy();
        });
        return streamStream;
    } catch {
        message.channel.send('An error occured, skipping song...')
        skip_song(message, connection);
    }
};