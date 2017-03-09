function crpPrim() {

	CreepDestination = class {
		constructor(destinationID) {
			this.destinationID = destinationID;
			this.pos = Game.getObjectById(destinationID).pos;
			this.path = {};
		}
	}

	//CreepHarvest = class extends CreepDestination {
	//	constructor(destinationID) {
	//		//this.destinationID = destinationID;
	//		//this.pos = Game.getObjectById(destiantionID).pos;
	//		this.action = 'harvest';
	//	}
	//}

}

module.exports = crpPrim;