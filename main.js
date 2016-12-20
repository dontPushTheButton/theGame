
var behaviorTower = require('behavior.tower');
var creepAssignment = require('creepAssignment');
var creepPrimitives = require('creepPrimitives');
var bookkeeping = require('bookkeeping');
var spawnMyCreeps = require('spawnMyCreeps');

var minColorGuard = 0;
var minAttackers = 0;
var minUpgraders = 3;
var minHarvesters = 3;
var minBuilders = 1;
var minTowerTenders = 0;
var minSpawnTenders = 0;
var minBasicCreeps = minHarvesters
                   + minUpgraders
                   + minTowerTenders
                   + minSpawnTenders
                   + minBuilders
                   + minColorGuard;
var minWallHealth = 100000;
var minRampartHealth = 1e7;
var roomsInfo = [];

module.exports.loop = function () {

    bookkeeping.honorTheDead();


    var census;

    roomsInfo = bookkeeping.getRoomsInfo();
    census = bookkeeping.census();

    //console.log(JSON.stringify(census));

    for (i = 0; i<roomsInfo.length; i++) {
        var roomName = roomsInfo[i].ID;
        spawnMyCreeps.spawnAllCreeps(minBasicCreeps, roomName, census);
        creepAssignment(minHarvesters, minUpgraders, minTowerTenders, minSpawnTenders, minBuilders, roomName);

        hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);

        if (hostiles.length > 0) {
            behaviorTower.defendRoom(roomName, hostiles);
        } else {
            behaviorTower.repairRamparts(roomName, minRampartHealth);
            behaviorTower.repairWalls(roomName, 0.25, minWallHealth);
            behaviorTower.maintainRoads(roomName, 0.75);
        }
    }

    //bookkeeping.honorTheDead();



}

