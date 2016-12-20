﻿
module.exports = {
    spawnAllCreeps: function (minBasicCreeps,roomName,census) {
        this.spawnMyBasicCreeps(minBasicCreeps,roomName,census);
        this.spawnTowerTenders(roomName, census);
        //this.spawnColorguard(roomName);
    },

    spawnMyBasicCreeps: function (minBasicCreeps, roomName, census) {
        var basicCreep = [MOVE, WORK, CARRY, MOVE, WORK, CARRY
                     , MOVE, WORK, CARRY, MOVE, WORK, CARRY
                     , MOVE, WORK, CARRY, MOVE, WORK, CARRY
                     , MOVE, WORK, CARRY, MOVE, WORK, CARRY
                     , MOVE, WORK, CARRY, MOVE, WORK, CARRY];
        var allSpawns = _.values(Game.spawns);
        var modifiedBody = basicCreep;
        var spawn,
            creepsInTheRoom;

        //console.log(roomName);

        creepsInTheRoom = Game.rooms[roomName].find(FIND_MY_CREEPS).length;
        //console.log(creepsInTheRoom.toString() + ' creeps in room ' + );
        spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        modifiedBody = basicCreep;

        //console.log(spawn.id);
        //console.log(JSON.stringify(creepsInTheRoom));
        //console.log(JSON.stringify(spawn));
        
        if (creepsInTheRoom < minBasicCreeps) {
            result = spawn.canCreateCreep(modifiedBody, null);
            //console.log(JSON.stringify(census[roomName]['harvester']));
            //console.log(JSON.stringify(Game.rooms[roomName]));
            if (!census[roomName]['harvester'] || Game.rooms[roomName].energyAvailable === Game.rooms[roomName].energyCapacityAvailable) {
                for (j = 1; j < basicCreep.length; j++) {
                    if (result === -6 && modifiedBody.length > 3) {
                        modifiedBody = modifiedBody.slice(0, modifiedBody.length - 1);
                        result = spawn.canCreateCreep(modifiedBody, null);
                    } else if (result === 0) {
                        j = basicCreep.length; // breaks outer loop
                    }
                }
            }

            if (result === 0 && spawn.spawning === null) {
                result = spawn.createCreep(modifiedBody, null, { role: 'harvester' });
                console.log(result + ' is one of us.');
            } else if (result === -6) {
                console.log('We have not the energy for even the simplest creep in room ' + roomName + '.')
            } else if (result !== -4) {
                console.log('There was an error: ' + result);
            }
        }
    },

    spawnTowerTenders: function (roomName,census) {
        var towersInTheRoom = _.values(Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType === STRUCTURE_TOWER)} }));
        var towerTenderBuild = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
        var desiredNumTowerTenders
            ,actualNumTowerTenders
            ,spawn;

        desiredNumTowerTenders = Math.ceil(towersInTheRoom.length / 3.0);
        spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        //console.log(desiredNumTowerTenders);
        //console.log(JSON.stringify(census[roomName].propertyIsEnumerable(["towerTender"])));

        if (towersInTheRoom.length === 0) {
            return -1;
        } else if (desiredNumTowerTenders.length === 0) {
            return -2;
        }

        if (!census[roomName].propertyIsEnumerable(["towerTender"])) {
            actualNumTowerTenders = 0;
        } else {
            actualNumTowerTenders = Game.rooms[roomName].find(FIND_MY_CREEPS, { filter: (creep) => { return (creep.memory.role === 'towerTender' && creep.ticksToLive > 150) } }).length;
            //console.log(actualNumTowerTenders.length);
            //actualNumTowerTenders = census[roomName]["towerTender"].length;
        }

        if (actualNumTowerTenders < desiredNumTowerTenders) {
            result = spawn.canCreateCreep(towerTenderBuild, null);
            if (result === 0 && spawn.spawning === null) {
                result = spawn.createCreep(towerTenderBuild, null, { role: 'towerTender' });
                console.log(result + ' is one of us.');
            } else if (result === -6) {
                console.log('We have not the energy for a Tower Tender in room ' + roomName + '.')
            } else if (result !== -4) {
                console.log('There was an error: ' + result);
            }

        }
        //console.log(actualNumTowerTenders);

       
        //actualNumTowerTenders = census.role['towerTender'].members.length;
        
    },

    spawnColorguard: function (roomName) {
        var colorguardBuild = [MOVE, WORK, CARRY, CLAIM];
        var desiredNumColorguard
            , actualNumColorGuard
            , spawn;
        spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
        desiredNumColorguard = [Game.flags].length;//.length;
        actualNumColorGuard =  _(Game.creeps).filter({ memory: { role: 'color' } });
        console.log(JSON.stringify(desiredNumColorguard));
        console.log(JSON.stringify(actualNumColorGuard.length));

        if (actualNumColorGuard < desiredNumColorguard || !actualNumColorGuard.length) {
            result = spawn.canCreateCreep(colorguardBuild, null);
            if (result === 0 && spawn.spawning === null) {
                result = spawn.createCreep(colorguardBuild, null, { role: 'colorguard' });
                console.log(result + ' is one of us.');
            } else if (result === -6) {
                console.log('We have not the energy for a colorguard in room ' + roomName + '.')
            } else if (result !== -4) {
                console.log('There was an error: ' + result);
            }

        }

    },
}


