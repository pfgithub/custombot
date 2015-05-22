# Custombot
Getting things ready:

`cd api;npm install;cd ../custombot;npm install;`

Running:

`cd custombot`

`node index.js`








## Usage
No work has been done at custombot at this time.

# IRC API

## New IRC
`var bot = new irc(ip,port,nick);`

Creates a new IRC bot and connects to server `ip` on `port` with the nick `nick`. Make sure `nick` is valid, the api doesn't know what to do otherwise

## `bot.send(data)`
Sends raw data to the server and logs it to the console

## `bot.say(channel, message)`
Says `message` on `channel`

## `bot.on(event, callback)`
Listenes for event `event` and calls `callback`. Warning: Only one callback is allowed per event.

## event `raw`
When raw data is recived from the server, this callback is called with the parameter `data`

## event `connect`
WIP - Once the client has recived the `End of /MOTD command` message. No parameters are passed to this function

## event `pm`
`function(message,user){`

May not work, is called on a `PRIVMSG` to your bot

## event `chat`
`function(message,user,channel){`

Called on a chat message