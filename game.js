
var beurt = 0;
var bordP = require('./bord.js');
var bord = new bordP();

var player = require('./player.js');

var player1 = new player(),
	player2 = new player();

var schepen = ['vliegdekschip', 'slagschip', 'onderzeeer', 'torpedobootjager', 'patrouilleschip'];
var aantal = [1, 2, 3, 3, 4];
var afmeting = [5, 4, 3, 3, 2];


exports.makePlayers = function () {
	player1.setup(this);
	player2.setup(this);
	return [player1, player2];
}

exports.getDimensions = function () {
	return bord.getDimensions();
}

exports.getSchepen = function () {
	//return {schepen: schepen, aantal: aantal, afmeting: afmeting};
	
	var schepenJSON = [];
	
	for (var i = 0; i < schepen.length; i++)
	{
		var aantali = aantal[i];
		for(var j = schepenJSON.length, z = aantali; z > 0; j++, z--)
		{
			var object = {naam:schepen[i], afmeting:afmeting[i], x: 0, y: 0, position: 0}
			schepenJSON.push(object);
		}
	}
	return schepenJSON;
}

exports.validateSchepen = function (aoSchepen, dimensions) {
	var exampleJSON = this.getSchepen();
	var error = false;
	for (var i = 0; i < aoSchepen.length; i++)
	{
		if(aoSchepen[i].afmeting == exampleJSON[i].afmeting)
		{
			switch(aoSchepen[i].position) {
				case "horizontaal":
					if((aoSchepen[i].x + aoSchepen[i].afmeting) > dimensions.width || (aoSchepen[i].x + aoSchepen[i].afmeting) < 0)
					{
						console.log("De x loopt uit het veld");
						error = true;
						
					}
					else
					{
						if(aoSchepen[i].y > dimensions.height || aoSchepen[i].y < 0)
						{
							console.log("De y loopt uit het veld");
							error = true;
						}
					}
					break;
				case "verticaal":
					if((aoSchepen[i].y + aoSchepen[i].afmeting) > dimensions.height || (aoSchepen[i].y + aoSchepen[i].afmeting) < 0)
					{
						console.log("De y loopt uit het veld");
						error = true;
					}
					else
					{
						if(aoSchepen[i].x > dimensions.width || aoSchepen[i].x < 0)
						{
							console.log("De x loopt uit het veld");
							error = true;
						}
					}
					break;
				default:
					console.log("Een schip mag alleen 'horizontaal' of 'verticaal' zijn");
					error = true;
			}
		}
		else
		{
			console.log("We hebben een hacker onder ons.");
			error = true;
		}
	}
	if(!error)
	{
		console.log("Data goed gekeurd");
		return true;
	}
	else
	{
		console.log("Error!");
	}
	
}
exports.play = function() {
	var beginplayer = Math.floor(Math.random() * 2) == 0;
	
	if (beginplayer)
	{
		player1.turn();
		player2.wait();
		beurt = 1;
	}
	else
	{
		player2.turn();
		player1.wait();
		beurt = 2;
	}
}

exports.setShoot = function(shot, socket) {
	// shot = [x,y]
	if (shot[0] > this.getDimensions().width || shot[0] < 0 || shot[1] > this.getDimensions().height || shot[1] < 0)
	{
		console.log("Je shot is uit het veld!");
	}
	
	if(socket.rooms[1] == player1.getRoom())
	{
		if(beurt == 1)
		{
			var resultaat = player2.getSchot(shot);
			if(resultaat == 'hit' || resultaat == 'missed')
			{
				console.log("Geschoten");
				if(player2.ifBordEmpty()) {	//Controleer of het spel klaar is
					console.log("Het spel is klaar!");
				}
				else
				{
					player2.turn(shot);
					player1.wait(resultaat);
					beurt = 2;
				}
			}
			else
			{
				console.log("Error in functie getSchot");
			}
		}
		else
		{
			console.log("Voor je beurt gaan? Serieus!?");
		}
	}
	else if (socket.rooms[1] == player2.getRoom())
	{
		if(beurt == 2)
		{
			var resultaat = player1.getSchot(shot);
			if(resultaat == 'hit' || resultaat == 'missed')
			{
				console.log("Geschoten");
				if(player1.ifBordEmpty()) {	//Controleer of het spel klaar is
					console.log("Het spel is klaar!");
				}	
				else
				{
					player1.turn(shot);
					player2.wait(resultaat);
					beurt = 1;
				}
			}
			else
			{
				console.log("Error in functie getSchot");
			}
		}
		else
		{
			console.log("Voor je beurt gaan? Serieus!?");
		}
	}
	else
	{
		console.log("Wow error!!");
		console.log("Dit is het:" + socket.rooms[1]);
		console.log("Dit had het moeten zijn:" + player1.getRoom() + " of " + player2.getRoom());
		return false;
	}
}

exports.broadcastToAll = function(onderwerp, message, dimensions) {
	if(typeof message === 'undefined')
	{
		GLOBAL.io.emit(onderwerp);
	}
	else
	{
		GLOBAL.io.emit(onderwerp, [message, dimensions]);
	}
	console.log("Alle gebruikers hebben een bericht gekregen");
}