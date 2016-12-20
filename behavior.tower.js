var creepPrimitives = require('creepPrimitives');

module.exports.defendRoom = function defendRoom(roomName, hostiles) {

    if (hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

module.exports.repairWalls = function repairWall(roomName, minPercentTowerEnergy, minWallHealth) {
    var roomID = Game.rooms[roomName];
    var walls = roomID.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_WALL } });
    var towers = roomID.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

    for (j = 0; j < towers.length; j++) {
        if (towers[j].energy > minPercentTowerEnergy * towers[j].energyCapacity) {
            for (i = 0; i < walls.length; i++) {
                if (walls[i].hits < minWallHealth) {
                    towers[j].repair(walls[i]);
                }
            }
        }
    }
}

module.exports.maintainRoads = function maintainRoads(roomName, minPercentTowerEnergy) {
    var roads = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_ROAD } });
    var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
    //    console.log(JSON.stringify(towers));
    for (j = 0; j < towers.length; j++) {
        for (i = 0; i < roads.length; i++) {
            if ((towers[j].energy > minPercentTowerEnergy * towers[j].energyCapacity && roads[i].hits < 0.90 * roads[i].hitsMax) || roads[i].hits < 300) {
                //                console.log(towers[j].energy > minPercentTowerEnergy*towers[j].energyCapacity || roads[i].hits < 300);
                var roadRepair = towers[j].repair(roads[i]);
                //                console.log(roads[i].hits);
            }
        }
    }
}

module.exports.repairRamparts = function repairRamparts(roomName, minRampartHealth) {
    var ramparts = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_RAMPART } });
    //console.log(JSON.stringify(ramparts));
    //var orderedRamparts = creepPrimitives.sortObjects(ramparts, 'hits', 'ASC');
    //console.log(JSON.stringify(orderedRamparts));
    ramparts.sort(creepPrimitives.compareObjectProperties('hits','ASC'));
        //for (i = 0; i < orderedRamparts.length; i++) {
        if (ramparts.length > 0) {
            var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
            towers.forEach(tower => tower.repair(ramparts[0]));
    //    }
        } else {
            return;
        }
}