var irc = require('../api/index.js');

var moment = require('moment');

//var fs = require('fs');
//var obj = JSON.parse(fs.readFileSync(__dirname + '/bot/bot.json', 'utf8'));
var obj = require(__dirname + '/bot/bot.json', 'utf8');

var bot = new irc.irc(obj.settings.ip, obj.settings.port, 'custombot');


var lastSeen = {};


if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

bot.on('raw', function(data){
	console.log('Data recived: ' + data);
});

bot.on('connect', function(){
	obj.channels.forEach(function(channel){
		bot.join(channel);
	});
	setTimeout(function(){
		bot.say('#bottesting', 'Connection Succesfull');
	},1000);
});


var parseData = function(data,dataParser){
	var str = data;
	dataParser.forEach(function(bit){
		console.log(bit);
		str = str.replace('$$' +bit.id+ '$$', bit.val);
		console.log(str);
	});
	return str;
};

bot.on('chat', function(message,user,channel){
	console.log('chat: ' + message);
	lastSeen[user.nick] = new Date();
	console.log(lastSeen[user.nick]);
	if(message.startsWith(obj.settings.prefix)){
		var msg = message.slice(1).split(' ');
		var cmd = obj.commands[msg[0]];
		var dataParser = [
			{id: "NICK", val: user.nick},
			{id: "CHANNEL", val: channel}
		];
		if(cmd !== undefined){
			cmd.actions.forEach(function(action){
				console.log(cmd);
				cmd.args.params.forEach(function(bit,i){
					dataParser.push({id:bit.id, val:msg[i + 1]});
				});
				cmd.args.calc.forEach(function(bit,i){
					var val = '';
					
					switch (bit.type) {
						case 'lastseen':
							console.log(lastSeen[parseData(bit.params.user,dataParser)]);
							val = moment(lastSeen[parseData(bit.params.user,dataParser)]).fromNow();
							break;
							
						case 'concat':
							
							break;
						
						
						default:
							// code
					}
					
					dataParser.push({id:bit.id, val:val});
				});
				
				switch (action.perms) {
					case 'chanop':
						// code
						break;
					
					default:
						// code
				}
				
				switch (action.type) {
					case 'raw':
						bot.send(parseData(action.params.data,dataParser));
						break;
					case 'chat':
						bot.say(parseData(action.params.channel,dataParser), parseData(action.params.message,dataParser));
						break;
					case 'multiline-chat':
						action.params.message.forEach(function(bit){
							bot.say(parseData(action.params.channel,dataParser), parseData(bit,dataParser));
						});
						break;
					default:
						bot.say(channel, "Error in JSON file: Type " + cmd.type + " not found");
				}
			});
		}else{
			bot.say(channel, "Command does not exist");
		}
	}
});

bot.on('pm', function(message,user,channel){
	console.log('pm: ' + message);
	if(message == 'data sent'){
		bot.say(user.nick,'data recived from ' + user.nick);
	}
});
