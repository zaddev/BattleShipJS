var bordRij = function () {
	this.width = 0;
	this.rij = [];
};

bordRij.prototype.setWidth = function (sWidth) {
	this.width = sWidth;
	
	for(var i = 0; i < this.width; i++)
	{
		this.rij[i] = [false, false];		// Eerste is schip, tweede is geschoten
	}
}

bordRij.prototype.setSchip = function (x) {
	if(this.rij[x][0] == true)
	{
		console.log("Error! Er zijn schepen op elkaar geplaatst");
		return false;	
	}
	else
	{
		this.rij[x] = [true, false];
		return true;
	}
	
}
bordRij.prototype.getBordRij = function () {
	return this.rij;
}

bordRij.prototype.setShot = function (shotx) {
	this.rij[shotx][1] = true;
	
	if(this.rij[shotx][0])
	{
		return "hit";
	}
	else
	{
		return "missed";
	}
	return false;
}

module.exports = bordRij;