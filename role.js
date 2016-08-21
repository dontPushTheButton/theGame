module.exports.harvester = function harvester(creep) {
    var sources,
//        targets,
        bestSource,
        bestTarget,
        needsToMove,
        moveToHere;

    sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
    //    targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;}}); 
    var metric = Math.random();
    //    console.log(sources.length);

    if (sources.length > 1) {
        if (metric < 0.6) {
            bestSource = sources[1];
        } else {
            bestSource = sources[0];
        }
    } else if (sources.length === 1) {
        bestSource = sources[0];
    }
    //    sources[0]    
    //    if (targets.length > 0) {
    //        bestTarget = creep.pos.findClosestByPath(targets);
    //    } else {
    bestTarget = creep.room.storage;
    //    }


    //    console.log(creep + ' ' + JSON.stringify(Game.getObjectById(creep.memory.destination)));
    if ((creep.carry.energy == 0 && creep.memory.offloading)) {
        creep.memory.offloading = false;
        creep.memory.destination = bestSource.id;
    } else if (creep.carry.energy == creep.carryCapacity && !creep.memory.offloading) {
        creep.memory.offloading = true
        creep.memory.destination = bestTarget.id;
    } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
        creep.memory.offloading = false;
        creep.memory.destination = bestSource.id;
    } else if (creep.carry.energy < creep.carryCapacity && Game.getObjectById(creep.memory.destination).energy == 0) {
        creep.memory.destination = bestSource.id;
    } else if (creep.memory.offloading && Game.getObjectById(creep.memory.destination).energy == Game.getObjectById(creep.memory.destination).energyCapacity) {
        creep.memory.destination = bestTarget.id;
    } else if (!creep.memory.offloading) {
        if (Game.getObjectById(creep.memory.destination).energy == 0) {
            creep.memory.destination = bestSource.id;
        }
    }

    moveToHere = Game.getObjectById(creep.memory.destination);
    needsToMove = !creep.pos.isNearTo(moveToHere);
    //    creep.say(needsToMove);

    if (needsToMove) {
        creep.moveTo(moveToHere);
    } else if (creep.memory.offloading) {
        creep.transfer(moveToHere, RESOURCE_ENERGY);
    } else if (!creep.memory.offloading) {
        creep.harvest(moveToHere);
    }
}

module.exports.upgrader = function upgrader(creep) {

    if (creep.memory.upgrading && creep.carry.energy == 0) {
        creep.memory.upgrading = false;
    }
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
        creep.memory.upgrading = true;
    }

    if (creep.memory.upgrading) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
    else {
        creep.memory.destination = creep.room.storage;
        if (creep.withdraw(creep.memory.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.destination);
        }
    }
}

module.exports.builder = function builder(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
    }

    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
    }

    if (creep.memory.building) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        var spawns = creep.room.find(STRUCTURE_SPAWN);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
        else {
            creep.moveTo(spawns[0]);
        }
    }
    else {
        creep.memory.destination = creep.room.storage.id;
        var result = creep.withdraw(Game.getObjectById(creep.memory.destination), RESOURCE_ENERGY);

        console.log('withdraw Error: ' + result)
        if (creep.withdraw(Game.getObjectById(creep.memory.destination), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.destination));
        } else {
            creep.withdraw(Game.getObjectById(creep.memory.destination), RESOURCE_ENERGY);
        }
    }
}

module.exports.towerTender = function towerTender(creep) {
    //    creep.say(creep.memory.tending)
    if (creep.memory.tending && creep.carry.energy == 0) {
        creep.memory.tending = false;
    }

    if (!creep.memory.tending && creep.carry.energy == creep.carryCapacity) {
        creep.memory.tending = true;
    }

    if (creep.memory.tending) {
        var towers = Game.rooms['E38S46'].find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)
            }
        });
        if (towers.length > 0) {
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0]);
            }
        }
    }
    else {
        //        var sources = Game.rooms['E38S46'].find(FIND_SOURCES);
        creep.memory.destination = creep.room.storage;
        if (creep.withdraw(creep.memory.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.destination);
        }
    }
}

module.exports.spawnTender = function spawnTender(creep) {
    var targets,
        bestTarget,
        needsToMove,
        creepPath;

    targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });

    if (targets.length > 0) {
        if (targets.length > 1) {
            bestTarget = creep.pos.findClosestByPath(targets);
        } else if (targets.length == 1) {
            bestTarget = targets[0];
        } else if (targets.length == 0) {

        }
    }



    //    console.log(creep + ' ' + JSON.stringify(Game.getObjectById(creep.memory.destination)));
    if (creep.carry.energy == 0 && creep.memory.offloading) {
        creep.memory.offloading = false;
        if (creep.memory.destination != creep.room.storage.id) {
            creep.memory.destination = creep.room.storage.id;
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        }
    } else if (creep.carry.energy == creep.carryCapacity && !creep.memory.offloading && typeof bestTarget !== 'undefined') {
        creep.memory.offloading = true;
        //        creep.memory.role = 'harvester';
        if (creep.memory.destination != bestTarget.id) {
            creep.memory.destination = bestTarget.id;
            console.log(bestTarget);
            console.log(creep.memory.destination);
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        }
    } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
        creep.memory.offloading = false;
        creep.memory.destination = creep.room.storage.id;
        creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
    } else if (creep.memory.offloading && Game.getObjectById(creep.memory.destination).energy == Game.getObjectById(creep.memory.destination).energyCapacity) {
        if (typeof bestTarget !== 'undefined') {
            creep.memory.destination = bestTarget.id;
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        } else {
            creep.memory.offloading = false;
            creep.memory.destination = creep.room.storage.id;
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        }
    } else if (!creep.memory.offloading) {
        if (creep.memory.destination != creep.room.storage.id) {
            creep.memory.destination = creep.room.storage.id;
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        }
    }

    //    console.log(creep.pos.findPathTo(Game.getObjectById(creep.memory.destination)));
    moveToHere = Game.getObjectById(creep.memory.destination);
    creepPath = creep.memory.pathToDestination;
    needsToMove = !creep.pos.isNearTo(moveToHere);
    creep.say(needsToMove);

    if (needsToMove) {
        var moveResult = creep.moveByPath(creepPath);
        console.log(moveResult);
        if (moveResult === -5) {
            creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
        }
    } else if (creep.memory.offloading) {
        creep.transfer(moveToHere, RESOURCE_ENERGY);
    } else if (!creep.memory.offloading) {
        creep.withdraw(moveToHere, RESOURCE_ENERGY);
    }
}

module.exports.colorGuard = function colorGuard(creep, station) {
    creep.moveTo(Game.flags[station]);

}

module.exports.attacker = function attacker(creep, station) {
    var targets
       , hostiles;
    if (Game.flags[station].pos.roomName != creep.room.name || creep.pos.x > 46) {
        creep.moveTo(Game.flags[station]);
    } else {
        hostiles = Game.rooms['E37S46'].find(FIND_HOSTILE_CREEPS);
        targets = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_ROAD } });
        if (targets.length > 0) {
            if (!creep.pos.isNearTo(targets[0])) {
                creep.moveTo(targets[0]);
            } else {
                creep.attack(targets[0]);
            }
        } else if (hostiles.length > 0) {
            if (!creep.pos.isNearTo(hostiles[0])) {
                creep.moveTo(hostiles[0]);
            } else {
                creep.attack(hostiles[0]);
            }
        }
    }
}

module.exports.scavver = function scavver(creep, station) {
    var sources
       , bestSource;
    var bestTarget = Game.rooms[creep.memory.home].storage;
    if ((Game.flags[station].pos.roomName != creep.room.name && !creep.memory.offloading) || (creep.pos.x < 3 && !creep.memory.offloading)) {
        creep.moveTo(Game.flags[station]);
    } else {
        sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
        //            console.log(sources);
        if (sources.length > 0) {
            bestSource = sources[0];
            //            console.log(bestSource);
        }

        if ((creep.carry.energy == 0 && creep.memory.offloading)) {
            creep.memory.offloading = false;
            creep.memory.destination = bestSource.id;
        } else if (creep.carry.energy == creep.carryCapacity && !creep.memory.offloading) {
            creep.memory.offloading = true
            creep.memory.destination = bestTarget.id;
        } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
            creep.memory.offloading = false;
            creep.memory.destination = bestSource.id;
        } else if (creep.carry.energy < creep.carryCapacity && Game.getObjectById(creep.memory.destination).energy == 0) {
            creep.memory.destination = bestSource.id;
        } else if (creep.memory.offloading && Game.getObjectById(creep.memory.destination).energy == Game.getObjectById(creep.memory.destination).energyCapacity) {
            creep.memory.destination = bestTarget.id;
        } else if (!creep.memory.offloading) {
            if (Game.getObjectById(creep.memory.destination).energy == 0) {
                creep.memory.destination = bestSource.id;
            }
        } else if (!creep.memory.offloading && (Game.getObjectById(creep.memory.destination).pos.roomName != creep.pos.roomName)) {
            creep.memory.destination = bestSource.id;
        }

        if (!creep.memory.offloading && Game.getObjectById(creep.memory.destination).pos.roomName != creep.pos.roomName) {
            creep.memory.destination = bestSource.id;
        }

        moveToHere = Game.getObjectById(creep.memory.destination);
        needsToMove = !creep.pos.isNearTo(moveToHere);
        creep.say(!creep.memory.offloading);

        if (needsToMove) {
            creep.moveTo(moveToHere);
        } else if (creep.memory.offloading) {
            creep.transfer(moveToHere, RESOURCE_ENERGY);
        } else if (!creep.memory.offloading) {
            var result = creep.harvest(moveToHere);
            console.log(result);
        }

    }
}