
var behaviorTower = require('behavior.tower');
var creepAssignment = require('creepAssignment');
var creepPrimitives = require('creepPrimitives');
var bookkeeping = require('bookkeeping');
var spawnMyCreeps = require('spawnMyCreeps');

var minUpgraders = 1;
var minHarvesters = 2;
var minBuilders = 2;
var minBasicCreeps;

creepPrimitives.prototypeThis();

//var idealPop = creepPrimitives.idealPopulation();


module.exports.loop = function () {

	var constructionByRoom = creepPrimitives.findConstructionByRoom(),
	   roomsInfo = bookkeeping.getRoomsInfo(),
	   test;

	bookkeeping.honorTheDead();
	//console.log(JSON.stringify(Game.spawns));
	for (i = 0; i < roomsInfo.length; i++) {
		var roomName = roomsInfo[i].ID,
			currentRoom = Game.rooms[roomName];

		census = currentRoom.census();
		//test = Game.rooms[roomName].stats();
		//console.log(JSON.stringify(currentRoom.construction()));

		//test = idealPop.rcl["1"].creeps.worker.desiredQty(roomName); // buildings.STRUCTURE_CONTAINER.placeConstructionSites(roomName);
		//console.log(test);

		creepAssignment(minHarvesters, minUpgraders, minBuilders, roomName, census, constructionByRoom);

		hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

		if (hostiles.length > 0) {
			behaviorTower.defendRoom(roomName, hostiles);
		} else {
			//behaviorTower.repairRamparts(roomName, minRampartHealth);
			//behaviorTower.repairWalls(roomName, 0.25, minWallHealth);
			//behaviorTower.maintainRoads(roomName, 0.75);
			behaviorTower.maintainStructures(roomName, 3, 0, .95);
			//behaviorTower.maintainStructure(roomName, STRUCTURE_CONTAINER, 3, 1, .95);
		}
	}
}

