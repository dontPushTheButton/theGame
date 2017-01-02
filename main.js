
var behaviorTower = require('behavior.tower');
var creepAssignment = require('creepAssignment');
var creepPrimitives = require('creepPrimitives');
var bookkeeping = require('bookkeeping');
var spawnMyCreeps = require('spawnMyCreeps');

var minUpgraders = 2;
var minHarvesters = 2;
var minBuilders = 2;
var minBasicCreeps;

//var idealPop = creepPrimitives.idealPopulation();


module.exports.loop = function () {

    var census = bookkeeping.census(),
	   constructionByRoom = creepPrimitives.findConstructionByRoom(),
	   roomsInfo = bookkeeping.getRoomsInfo();

    bookkeeping.honorTheDead();

    //console.log(JSON.stringify(census));
    //console.log(minBasicCreeps);
    //test = creepPrimitives.findCommonGround();
    //
    //console.log(JSON.stringify(test2));

    for (i = 0; i < roomsInfo.length; i++) {
	   var roomName = roomsInfo[i].ID;
	   //test = idealPop.rcl["1"].creeps.worker.desiredQty(roomName); // buildings.STRUCTURE_CONTAINER.placeConstructionSites(roomName);

	   //console.log(test);

	   //spawnMyCreeps.spawnAllCreeps(minBasicCreeps, roomName, census);
	   creepAssignment(minHarvesters, minUpgraders, minBuilders, roomName, census, constructionByRoom);

	   hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

	   if (hostiles.length > 0) {
		  behaviorTower.defendRoom(roomName, hostiles);
	   } else {
		  //behaviorTower.repairRamparts(roomName, minRampartHealth);
		  //behaviorTower.repairWalls(roomName, 0.25, minWallHealth);
		  //behaviorTower.maintainRoads(roomName, 0.75);
		  behaviorTower.maintainStructure(roomName, STRUCTURE_RAMPART, 3, 0, .95);
		  behaviorTower.maintainStructure(roomName, STRUCTURE_CONTAINER, 3, 1, .95);
	   }
    }
}

