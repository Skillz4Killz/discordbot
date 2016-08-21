/**
 * Created by julian on 16.05.2016.
 */
var config = require('../../config/main.json');
var path = require('path');
var voice = require('../utility/voice');
var messageHelper = require('../utility/message');
var inventory = require('./misc/inventory');
var r34 = require('./misc/rule34');
var serverModel = require('../../DB/server');
var basicCommands = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case'!w.help':
            bot.reply(message, "Hey im Wolke-Chan," +
                "your Bot for doing Stuff other bots do bad \n" +
                "Commands you can write:" +
                " ```!w.help --> Help \n" +
                "SUPPORT:\n" +
                "!w.bug --> get the Link of the Support Discord \n" +
                "!w.version --> My Version\n" +
                "!w.add --> add me to your server \n" +
                "--------------------------------\n" +
                "Music:\n" +
                "!w.voice --> i join the Voice Channel you are currently in \n" +
                "!w.silent --> i leave the Voice Channel i am currently connected to.\n" +
                "!w.songlist --> Lists all Songs that are currently added to the Bot Database\n" +
                "!w.play name --> Play a Song/Youtube Video max Length: 1H30M\n" +
                "!w.forever name --> Plays a Song/Youtube Video in repeat until another Song is played/added to the Queue\n" +
                "!w.pause --> Pause the Current Song\n" +
                "!w.resume --> Resume the pause Song\n" +
                "!w.search name --> Searches for a Song in the Bot Database and shows the 5 best Results\n" +
                "!w.skip --> Skips the Current Song\n" +
                "!w.qa name --> Adds a Song/Youtube Video to the Queue max Length: 1H30M\n" +
                "!w.qrl --> removes the latest added song out of the queue \n" +
                "!w.queue --> Shows the current Queue\n" +
                "!w.rq --> Adds a random Song to the Queue max Length: 1H30M\n" +
                "!w.random --> Plays a Random Song\n" +
                "!w.osu maplink --> download a Osu Map\n" +
                "--------------------------------\n" +
                "Youtube:\n" +
                //"!w.yt youtubelink --> download a Youtube Video max Length: 1H30M\n" +
                "!w.yts query --> Searches Youtube and gives you the First Result\n" +
                "!w.ytq query --> Searches Youtube and adds the First Result to the Queue\n" +
                "--------------------------------\n" +
                "Other Stuff:\n" +
                "!w.level --> Your Level and XP needed for next Level\n" +
                "!w.noLevel --> disables the level system for you. Use again to enable it again for you.\n" +
                "!w.noPm --> disables the PM notifications for you. Use again to enable it again for you.\n" +
                "!w.pp beatmaplink acc --> Calculates PP for the beatmap with acc, currently nomod only...\n" +
                "!w.setLewd--> Sets the current Channel as the NSFW Channel\n" +
                "!w.cookie user --> Gives a Cookie to the mentioned User or shows your Cookies if no one is mentioned.\n" +
                "If you want to talk with me @mention me with a message :D```");
            return;
        case "!w.version":
            bot.reply(message, 'I am running on Version ' + config.version);
            return;
        case "!w.add":
            bot.reply(message, "Use this Link to add me to your Server: \<https://discordapp.com/oauth2/authorize?client_id=" + config.client_id + "&scope=bot&permissions=0\>");
            return;
        case "!w.bug":
            bot.reply(message, 'Please join the support Discord: https://discord.gg/yuTxmYn to report a Bug.');
            return;
        case "!w.songlist":
            bot.reply(message, 'The List of Songs can be found at <http://w.onee.moe/songlist>');
            return;
        case "!w.level":
            messageHelper.getLevel(bot, message, function (err) {
                if (err) return console.log(err);
            });
            return;
        case "!w.voice":
            if (message.author.voiceChannel) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                    if (role.name === "Proxerteam") {
                        admin = true;
                    }
                }
                if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== '118689714319392769' && message.server.id !== "166242205038673920") {
                    bot.joinVoiceChannel(message.author.voiceChannel, function (err, connection) {
                        if (!err) {
                            voice.saveVoice(message.author.voiceChannel, function (err) {
                                if (err) {
                                    console.log('errrrr');
                                    return console.log(err);
                                }
                                console.log('Saved Voice!');
                            });
                            voice.startQueue(bot, message);
                        } else {
                            console.log(err);
                            bot.reply(message, 'An Error has occured while trying to join Voice!');
                        }
                    });
                } else {
                    bot.reply(message, 'No Permission!');
                }
            } else {
                bot.reply(message, "You are not in a Voice Channel!");
            }
            return;
        case "!w.silent":
            if (!message.channel.isPrivate) {
                var admin = false;
                for (var role of message.server.rolesOfUser(message.author)) {
                    if (role.name === 'WolkeBot') {
                        admin = true;
                    }
                    if (role.name === "Proxerteam") {
                        admin = true;
                    }
                }
                if (voice.inVoice(bot, message)) {
                    var channel = voice.getVoiceChannel(bot, message);
                    if (message.server.id === '118689714319392769' && admin || message.server.id === "166242205038673920" && admin || message.server.id !== '118689714319392769' && message.server.id !== "166242205038673920") {
                        bot.leaveVoiceChannel(channel, function (err, connection) {
                            if (err) console.log(err);
                            voice.clearVoice(message, function (err) {
                                if (err) return console.log(err);
                            });
                        });
                    } else {
                        bot.reply(message, 'No Permission!');
                    }
                } else {
                    bot.reply(message, 'I am not connected to any Voice Channels on this Server!');
                }
            } else {
                bot.reply(message, 'This Command does not work in private Channels');
            }
            return;
        case "!w.wtf":
            bot.reply(message, "http://wtf.watchon.io");
            return;
        case "!w.stats":
            var plural;
            var users = 0;
            if (bot.servers.length > 1) {
                plural = 'servers';
                for (var i = 0; bot.servers.length > i; i++) {
                    users = users + bot.servers[i].memberCount;
                }
            } else {
                plural = 'server';
                users = bot.servers[0].members.memberCount;
            }
            users = users - bot.servers.length;
            bot.reply(message, "I am currently used on " + bot.servers.length + " " + plural + " with " + users + " users.");
            return;
        case "!w.rm":
            if (!message.channel.isPrivate && message.author.id === '128392910574977024') {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    var number = 0;
                    try {
                        number = parseInt(messageSplit[1]);
                    } catch (e) {
                        return bot.reply(message, 'Could not parse the Number !');
                    }
                    bot.getChannelLogs(message.channel, number, function (err, Messages) {
                        if (err) return bot.reply(message, 'Error while trying to get Channel Logs!');
                        if (Messages.length > 0) {
                            bot.deleteMessages(Messages, function (err) {
                                if (err) return bot.reply(message, 'Error while trying to delete Messages!');
                            });
                        }
                    });
                } else {
                    bot.reply(message, 'No Number of Messages to delete provided!');
                }
            } else {
                bot.reply(message, 'You should not know this...');
            }
            return;
        case "!w.noLevel":
            messageHelper.disableLevel(bot, message);
            return;
        case "!w.noPm":
            messageHelper.disablePm(bot,message);
            return;
        case "!w.lewd":
            bot.sendFile(message.channel, 'https://cdn.discordapp.com/attachments/191455136013352960/209718642722603008/412.png');
            return;
        case "!w.cookie":
            inventory(bot,message,messageSplit);
            return;
        case "!w.r34":
            serverModel.findOne({id:message.server.id}, function (err,Server) {
                if (err) return console.log(err);
                if (Server) {
                    if (typeof(Server.nsfwChannel) !== 'undefined') {
                        if (Server.nsfwChannel === message.channel.id) {
                            r34(bot, message, messageSplit);
                        } else {
                            bot.reply(message, 'This Command is only allowed in the NSFW Channel')
                        }
                    } else {
                        r34(bot, message, messageSplit);
                    }
                } else {
                    r34(bot, message, messageSplit);
                }
            });
            return;
        case "!w.setLewd":
            admin = false;
            for (role of message.server.rolesOfUser(message.author)) {
                if (role.hasPermission('administrator')) {
                    admin = true
                }
            }
            if (admin) {
                serverModel.findOne({id:message.server.id}, function (err,Server) {
                    if (err) return console.log(err);
                    if (Server) {
                        Server.updateNsfw(message.channel.id, function (err) {
                            if (err) return console.log(err);
                            bot.reply(message, `Set NSFW Channel to ${message.channel.name}`);
                        });
                   } else {
                       var server = new serverModel({
                           id:message.server.id,
                           lastVoiceChannel:"",
                           nsfwChannel:message.channel.id,
                           cmdChannel:"",
                           permissions:[],
                           prefix:"!w",
                           disabledCmds:[],
                           Groups:[],
                           Blacklist:[]
                       });
                        server.save();
                        bot.reply(message, `Set NSFW Channel to ${message.channel.name}`);
                    }
                });
            } else {
                bot.reply(message, "No Permission!");
            }
            return;
        default:
            return;
    }
};
module.exports = basicCommands;