
var behaviorTower = require('behavior.tower');
var creepAssignment = require('creepAssignment');
var creepPrimitives = require('creepPrimitives');
var crpPrim = require('crpPrim');
var bookkeeping = require('bookkeeping');
var spawnMyCreeps = require('spawnMyCreeps');

var minUpgraders = 5;
var minHarvesters = 2;
var minBuilders = 4;
var minBasicCreeps;

creepPrimitives.prototypeThis();

//var idealPop = creepPrimitives.idealPopulation();

module.exports.loop = function () {


	//var test1 = new crpPrim.CreepDestination(Game.spawns['Spawn1'].id);
	//console.log(JSON.stringify(test1));

	var constructionByRoom = creepPrimitives.findConstructionByRoom(),
		roomsInfo = bookkeeping.getRoomsInfo(),
		roomsToClaim = [];

	bookkeeping.honorTheDead();
	//console.log(JSON.stringify(Game.spawns));
	for (i = 0; i < roomsInfo.length; i++) {
		var roomName = roomsInfo[i].ID,
			currentRoom = Game.rooms[roomName];

		var census = currentRoom.census();
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
			behaviorTower.maintainStructures(roomName, 6, 0, .95);
			//behaviorTower.maintainStructure(roomName, STRUCTURE_CONTAINER, 3, 1, .95);
		}
	}
};

