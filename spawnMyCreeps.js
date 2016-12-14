module.exports.spawnMyCreeps = function spawnMyCreeps(minBasicCreeps) {

    //        console.log('Spawning creeps');
    var basicCreep = [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY];
    var attackerCreep = [MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK];
    var allSpawns = _.values(Game.spawns);
    var modifiedBody = basicCreep;


    for (i = 0; i < allSpawns.length; i++) {
        var creepsInTheRoom = Game.rooms[allSpawns[i].room.name].find(FIND_MY_CREEPS).length;
        console.log('creeps = ' + creepsInTheRoom.toString());
        modifiedBody = basicCreep;
        if (creepsInTheRoom < minBasicCreeps) {
            var result = allSpawns[i].canCreateCreep(modifiedBody, null);
            console.log(result);
            if (result !== -4 && result === -6 && modifiedBody.length > 3) {
                console.log('TEST');
                if (creepsInTheRoom  < minBasicCreeps) {
//                    while (result === -6) {
                        for (j = 1; j < modifiedBody.length; j++) {
                            modifiedBody = modifiedBody.slice(0, modifiedBody.length - 3);
                            console.log('Not enough energy. Decreasing part count to ' + modifiedBody.length);
                            result = allSpawns[i].canCreateCreep(modifiedBody, null);
                        }
//                    }
                }
            }
            if (result === 0 && allSpawns[i].spawning === null) {
                result = allSpawns[i].createCreep(modifiedBody, null, { role: 'harvester' });
                console.log(result + ' is one of us.');
            } else if (result == -6) {
                console.log('We have not the enery for even the smallest basic creep.')
            } else if (result != -4) {
                console.log('There was an error: ' + result);
            }
        } else if (creepsInTheRoom >= minBasicCreeps) {

        }
    }
}
