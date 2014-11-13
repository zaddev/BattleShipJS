var app = require('express')();
var http = require('http').Server(app);
var port = 3700;
GLOBAL.io = require('socket.io')(http);

var game = require('./game.js')
	, connected = 0
	, schepenset = 0;

var players = game.makePlayers();
player1 = players[0];
player2 = players[1];

player1.setGamebord();
player2.setGamebord();

io.on('connection', function(socket){
	if(connected == 0)
	{
		player1.setPlayer(socket);
		player1.setRoom(0);
		connected = 1;
		console.log("Player 1 set");
	}
	else if(connected == 1)
	{
		player2.setPlayer(socket);
		player2.setRoom(1);
		connected = 2;
		console.log("Player 2 set");
	}
	
	if(connected == 2)
	{
		console.log("Om te beginnen. Plaats uw schepen!");
		game.broadcastToAll("getSchepen", game.getSchepen(), game.getDimensions());
	}
	
	socket.on('setSchepen', function(aoSchepen){
		if(socket.rooms[1] == player1.getRoom())
		{
			if(player1.setSchepen(aoSchepen))
			{
				console.log("Alle schepen van player 1 zitten in de kaart");
				if(schepenset == 0) {
					schepenset = 1;
					console.log("Player 1 wacht op player 2");
				}
				else if( schepenset == 1)
				{
					console.log("Let's begin to shoot!");
					game.play();
				}
			}
			else
			{
				console.log("Error met de setSchepen functie");
			}
		}
		else if (socket.rooms[1] == player2.getRoom())
		{
			if(player2.setSchepen(aoSchepen))
			{
				console.log("Alle schepen van player 2 zitten in de kaart");
				if(schepenset == 0) {
					schepenset = 1;
					console.log("Player 2 wacht op player 1");
				}
				else if( schepenset == 1)
				{
					console.log("Let's begin to shoot!");
					game.play();
				}
			}
			else
			{
				console.log("Error met de setSchepen functie");
			}
		}
		else
		{
			console.log("Wow error!!");
			console.log("Dit is het:" + socket.rooms[1]);
			console.log("Dit had het moeten zijn:" + player1.getRoom() + " of " + player2.getRoom());
		}
	});
	
	socket.on('setShoot', function(aShot){
		game.setShoot(aShot, socket);
	});
	
});

app.get('/', function(req, res){
	res.sendfile('index.html');
});
app.get('/style.css', function(req, res) {
	res.sendfile('css/style.css');
});
 
http.listen(port, function(){
	console.log('listening on *:' + port);
});

