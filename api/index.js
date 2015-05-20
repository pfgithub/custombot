var net = require('net');
function irc (ip,port,name) {
	this.client = new net.Socket();
	this.nick = name;
	
	this.send = function(data){
		if(this.client.writable){
			console.log('I>'+data);
			this.client.write(data);
		}else{
			console.log('ERROR - Socket not writable');
		}
	};
	
	this.client.connect(port, ip);
	
	this.client.on('connect', function(my){
		console.log('Connected');
		var data = {toString: function(){return ":*** Checking Ident"}};
		if(data.toString().indexOf(':*** Checking Ident') > -1){
			this.send("USER "+ this.nick +" "+ this.nick +" "+ this.nick +" :Made with CustomBot");
			this.send("NICK "+ this.nick);
			this.send("JOIN "+ '#bottesting');
			
		}
		
	}.bind(this));
	
	this.client.on('data', function(data){
		console.log('I<' + data.toString());
	}.bind(this));

 
	this.client.on('close', function() {
		console.log('Connection closed');
	});
	
	this.client.setEncoding('ascii');
	this.client.setNoDelay();
}



var bot = new irc('irc.alphachat.net',6667,'irclib2');

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