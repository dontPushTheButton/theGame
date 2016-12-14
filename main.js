var honorTheDead = require('honorTheDead');
var spawnMyCreeps = require('spawnMyCreeps');
var creepAssignment = require('creepAssignment');
var behaviorTower = require('behavior.tower');
//var testingGround = require('testingGround');

var minColorGuard = 0;
var minAttackers = 2;
var minUpgraders = 2;
var minHarvesters = 5;
var minBuilders = 2;
var minTowerTenders = 1;
var minSpawnTenders = 0;
var minBasicCreeps = minHarvesters
                   + minUpgraders
                   + minTowerTenders
                   + minSpawnTenders
                   + minBuilders
                   + minColorGuard;
var minWallHealth = 100000;
var minRampartHealth = 3000;
var roomsInfo = [];


module.exports.loop = function () {

    var spawnList = Game.spawns;
    var flagList = Game.flags;
    //    console.log(JSON.stringify(roomList));

    for (var spawn in spawnList) {
        var nameOfRoom = Game.spawns[spawn].pos.roomName;
        console.log(containsRoom(nameOfRoom, roomsInfo));
        if (!containsRoom(nameOfRoom, roomsInfo)) {
            roomsInfo.push({ ID: nameOfRoom, "rcl": Game.rooms[nameOfRoom].controller.level });
            roomsInfo[roomsInfo.length - 1].name = nameOfRoom;
        }
        //        console.log(roomsInfo[0].ID);
    }

    console.log(roomsInfo.length);
    console.log(JSON.stringify(roomsInfo));

    honorTheDead();
    spawnMyCreeps.spawnMyCreeps(minBasicCreeps);
    creepAssignment(minHarvesters, minUpgraders, minTowerTenders, minSpawnTenders, minBuilders);


    //    hostiles = Game.rooms['E38S46'].find(FIND_HOSTILE_CREEPS);

    //    spawnMyCreeps.spawnMyCreeps(minBasicCreeps);

    //    while (hostiles.length > 0) {
    //        behaviorTower.defendRoom('E38S46', hostiles);
    //    }

    //    behaviorTower.repairRamparts('E38S46',minRampartHealth);
    //    behaviorTower.repairWalls('E38S46',0.25,minWallHealth);
    //    behaviorTower.maintainRoads('E38S46',0.75);

}

function containsRoom(room, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].ID == room) {
            return true;
        }
    }
    return false;
}