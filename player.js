var player = function () {
	this.player = 0;
	this.playerRoom = 0;
	var bordP = require('./bord.js');
	this.bord = new bordP();
	this.game = 0;
};

player.prototype.setup = function (gameClass) {
	this.game = gameClass;
}

player.prototype.setPlayer = function (socket) {
	this.player = socket;
}

player.prototype.setRoom = function (room) {
	this.playerRoom = room;
	
	this.player.join(this.playerRoom);
}

player.prototype.getRoom = function () {
	return this.playerRoom;
}
player.prototype.sendMessage = function (message) {
	console.log(message);
}

player.prototype.setGamebord = function () {
	if(this.bord.setGamebord())
	{
		console.log("Gamebord set");
	}
}

player.prototype.setSchepen = function (aoSchepen) {
	if(this.game.validateSchepen(aoSchepen, this.bord.getDimensions()))
	{
		var error = 0;
		for(var i = 0; i < aoSchepen.length; i++)
		{
			var oShip = {afmeting: aoSchepen[i].afmeting, x: aoSchepen[i].x, y: aoSchepen[i].y, position: aoSchepen[i].position};
			
			if(this.bord.setSchip(oShip))
			{
				console.log(aoSchepen[i].naam + " opgeslagen");
			}
			else
			{
				error = 1;
			}
		}
		if (error == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

player.prototype.turn = function (vorigezet) {
	this.player.emit("turn", vorigezet);
}

player.prototype.wait = function (geschoten) {
	this.player.emit("wait", geschoten);
}

player.prototype.sendMessage = function (naam, value) {
	this.player.emit(naam, value);
}

player.prototype.getSchot = function (shot) {
	return this.bord.setShot(shot);
}

player.prototype.ifBordEmpty = function () {
	var array = this.bord.getBord();
	var found = false;
	
	for(var i = 0; i < array.length; i++) {
		if (!found)
		{
			for(var j = 0; j < array[i].rij.length; j++) {
				
				if(array[i].rij[j][0] == true && array[i].rij[j][1] == false)
				{
					found = true;
					break;
				}
			}
		}
		else
		{
			break;
		}
	}
	
	if (found)
	{
		return false;
	}
	else
	{
		return true;
	}
	
}

module.exports = player;