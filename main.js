
var behaviorTower = require('behavior.tower');
var creepAssignment = require('creepAssignment');
var creepPrimitives = require('creepPrimitives');
var bookkeeping = require('bookkeeping');
var spawnMyCreeps = require('spawnMyCreeps');

var minColorGuard = 0;
var minAttackers = 0;
var minUpgraders = 1;
var minHarvesters = 2;
var minBuilders = 0;
var minTowerTenders = 1;
var minSpawnTenders = 0;
var minBasicCreeps = minHarvesters
                   + minUpgraders
                   + minTowerTenders
                   + minSpawnTenders
                   + minBuilders
                   + minColorGuard;
var minWallHealth = 1e6;
var minRampartHealth = 1e6;
var roomsInfo = [];
var idealPop = creepPrimitives.idealPopulation();


module.exports.loop = function () {

    bookkeeping.honorTheDead();


    var census,
        test;

    roomsInfo = bookkeeping.getRoomsInfo();
    census = bookkeeping.census();

    //console.log(JSON.stringify(census));

    for (i = 0; i < roomsInfo.length; i++) {
        var roomName = roomsInfo[i].ID;
        //test = idealPop.rcl["1"].creeps.worker.desiredQty(roomName); // buildings.STRUCTURE_CONTAINER.placeConstructionSites(roomName);

        //console.log(test);

        spawnMyCreeps.spawnAllCreeps(minBasicCreeps, roomName, census);
        creepAssignment(minHarvesters, minUpgraders, minTowerTenders, minSpawnTenders, minBuilders, roomName);

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

