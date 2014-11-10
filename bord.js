var Bord = function () {
	this.width = 10,
	this.height = 10;
	this.gameBord = [];
};
Bord.prototype.setGamebord = function () {
	var bordRij = require('./bordrij.js');
	for(var i = 0; i < this.height; i++)
	{
		this.gameBord[i] = new bordRij();
		this.gameBord[i].setWidth(this.width);
		
	}
	return true;
}
Bord.prototype.getDimensions = function () {
	return {width: this.width, height: this.height};	
}
Bord.prototype.setSchip = function (oShip) {
	// {afmeting:, x:, y:, position:}
	var error = false;
	if(oShip.position == 'horizontaal')
	{
		for(var i = 0; i < oShip.afmeting; i++)
		{
			if(!this.gameBord[oShip.y].setSchip((oShip.x + i)))
			{
				error = true;
			}
		}
	}
	else if (oShip.position == 'verticaal'){
		for(var i = 0; i < oShip.afmeting; i++)
		{
			if(!this.gameBord[(oShip.y + i)].setSchip(oShip.x))
			{
				error = true;
			}
		}
	}
	else {
		console.log("Whoooooops! geen horizontaal en geen verticaal whut!?");
		error = true;
	}
	
	if(error)
	{
		console.log("ERROR!");
		return false;
	}
	else
	{
		return true;
	}
}

Bord.prototype.setShot = function (shot) {
	return this.gameBord[shot[1]].setShot(shot[0]);
}

module.exports = Bord;