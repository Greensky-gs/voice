const Discord = require('discord.js');

const client = new Discord.Client();

const configs = {
  prefix: '!',
  token: 'The token of your bot'
};

client.on('message', (message) => {
  var args = message.content.slice(configs.prefix.length).trim().split(' ');
  const commandName = args.shift().toLowerCase();
  
  if (!message.content.startsWith(configs.prefix) || message.author.bot) return;
  
  switch (commandName) {
    case 'join':
      if (!message.member) return;
      if (!message.member.voice.channel) return message.channel.send(`:x: | You aren't connected to a voice channel in this server`);
      
      let go = true;      
      message.member.voice.channel.join().catch((error) => {go = false});
      
      if (!go) return message.channel.send(`:x: | An error went stop the connexion to voice channel`);
      return message.channel.send(`:white_check_mark: | Connected to <#${message.member.voice.channel.id}>`);
    break;
    case 'leave':
      if (!message.guild) return;
      if (!message.member.voice.channel) return message.channel.send(`:x: You aren't connected to a voice channel in this server`);
      
      const user = message.member.voice.channel;
      const me = message.guild.me.voice.channel;
      
      if (!me) return message.channel.send(`:x: | I'm not connected to a voice channel in this server. Try to connect me with run \`${configs.prefix}join\``);
      if (me.id !== user.id) return message.channel.send(`:x: | You'r not connected to same channel than me.`);
      
      let leaved = true;
      me.leave().catch((error) => {leaved = false});
      
      if (!leaved) return message.channel.send(`:x: | An error went stop the deconnexion`);
      return message.channel.send(`:white_check_mark: | Succesfully disconnected from <#${me.id}>`);
    break;
    case 'kick':
      if (!message.guild) return;
      if (!message.member.voice.channel) return message.channel.send(`:x: You aren't connected to a voice channel in this server`);
      
      const user = message.member.voice.channel;
      const me = message.guild.me.voice.channel;
      
      if (!me) return message.channel.send(`:x: | I'm not connected to a voice channel in this server. Try to connect me with run \`${configs.prefix}join\``);
      if (me.id !== user.id) return message.channel.send(`:x: | You'r not connected to same channel than me.`);
      
      let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || 'NO_MEMBER';
      if (member === 'NO_MEMBER') return message.channel.send(`:x: | Invalid member. Use a mention or an id`);
      
      if (!member.voice.channel) return message.channel.send(`:x: | ${member.tag} isn't connected`);
      const channel = member.voice.channel;
      
      if (channel.id !== me.id) return message.channel.send(`:x: | ${member.tag} isn't connected at same channel than us`);
      let kicked = true;
      
      member.voice.kick().catch((error) => {
        kicked = false;
      });
      
      if (!kicked) return message.channel.send(`:x: | An error went wrong, ${member.tag} isn't kicked from channel`);
      return message.channel.send(`:white_check_mark: | Succesfully kicked ${member.tag} from ${me.name}`);
    break;
  };
});

client.login(configs.token);
