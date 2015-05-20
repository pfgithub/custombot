var net = require('net');
var parse = require('irc-message').parse;

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

function irc (ip,port,name) {
	this.client = new net.Socket();
	this.nick = name;
	this.events = {
		chat: function(){},
		pm: function(){},
		connect: function(){},
		disconnect: function(){},
		raw: function(){}
	};
	this.connected = false;
	
	this.on = function(event,callback){
		switch (event) {
			case 'chat':
				this.events.chat = callback;
				break;
			case 'pm':
				this.events.pm = callback;
				break;
			case 'join':
				
				break;
			case 'leave':
				
				break;
			case 'connect':
				this.events.connect = callback;
				break;
			case 'disconnect':
				this.events.disconnect = callback;
				break;
			case 'raw':
				this.events.raw = callback;
				break;
			default:
				// code
		}
	};
	
	this.send = function(data){
		if(this.client.writable){
			this.client.write(data + '\n', 'ascii', function(err){
				if(err){
					console.log(err);
				}else{
					console.log("I>"+data);
				}
			});
		}else{
			console.log('ERROR - Socket not writable');
		}
	};
	
	this.command = function(command, data, message){
		this.send(command.toUpperCase() + ' ' + data + (message === undefined ? '' : (' :' + message)));
	};
	
	this.say = function(channel, message){
		this.command('privmsg', channel, message);
	};
	
	this.join = function(channel){
		this.command('join', channel);
	};
	
	this.part = function(channel){
		this.command('part', channel);
	};
	
	this.client.connect(port, ip);
	
	this.client.on('connect', function(){
		console.log('Connected');
		var data = {toString: function(){return ":*** Checking Ident"}};
		if(data.toString().indexOf(':*** Checking Ident') > -1){
			this.send("USER "+ this.nick +" "+ this.nick +" "+ this.nick +" :Made with CustomBot");
			this.send("NICK "+ this.nick);
			
		}
	}.bind(this));
	
	this.client.on('data', function(data){
		this.events.raw(data);
		console.log('I<' + data.toString());
		if(data.toString().indexOf(':*** Checking Ident') > -1){
			this.send("USER "+ this.nick +" "+ this.nick +" "+ this.nick +" :Made with CustomBot");
			this.send("NICK "+ this.nick);
		}
		if(data.toString().indexOf(" :End of /MOTD command.") > -1 && !this.connected){
			this.events.connect();
			this.connected = true;
		}
		if(data.toString().indexOf('PING :') > -1){
			this.send("PONG :"+ data.toString().replace("PING :", ""));
		}
		var noclrf = data.toString().split('\n');
		var cdata = [];
		
		noclrf.forEach(function(bit){
			cdata.push(parse(bit));
		});
		cdata.forEach(function(parsed){
			console.log(parsed);
			if(parsed !== null){
				switch (parsed.command) {
					case 'PRIVMSG':
						var fulldata = [parsed.params[1].replace('\r',''),{raw:parsed.prefix,nick:parsed.prefix.split('!')[0]},parsed.params[0]];
						if(parsed.params[0].startsWith('#')){
							this.events.chat(fulldata[0],fulldata[1],fulldata[2]);
						}else{
							this.events.pm(fulldata[0],fulldata[1],fulldata[2]);
						}
						console.log(fulldata[0]);
						console.log(fulldata[1]);
						console.log(fulldata[2]);
						break;
					
					default:
						// code
				}
			}
		}.bind(this));
		
	}.bind(this));

 
	this.client.on('close', function() {
		console.log('Connection closed');
	});
	
	this.client.setEncoding('ascii');
	this.client.setNoDelay();
}



var bot = new irc('irc.alphachat.net',6667,'ircapitest');

bot.on('raw', function(data){
	console.log('Data recived: ' + data);
});

bot.on('connect', function(){
	bot.join('#bottesting');
	setTimeout(function(){
		bot.say('#bottesting', 'Connection Succesfull');
	},1000);
});

bot.on('chat', function(message,user,channel){
	console.log('chat: ' + message);
	if(message == 'data sent'){
		bot.say(channel,'data recived from ' + user.nick);
	}
});

bot.on('pm', function(message,user,channel){
	console.log('pm: ' + message);
	if(message == 'data sent'){
		bot.say(user.nick,'data recived from ' + user.nick);
	}
});

/*

var net = require('net');
var irc = {};

irc.socket = new net.Socket();
irc.socket.on('connect', function () {
	console.log('Established connection, registering and shit...');
	setTimeout(function () {
		irc.raw('NICK nick');
		irc.raw('USER callum 8 * :Node.js IRC bot');
	}, 1000);
});

irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(6667, 'irc.freenode.net');

*/