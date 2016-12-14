module.exports.spawnMyCreeps = function spawnMyCreeps(minBasicCreeps) {

    var basicCreep = [MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY];
    var attackerCreep = [MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK];
    var allSpawns = _.values(Game.spawns);
    var modifiedBody = basicCreep;


    for (i = 0; i < allSpawns.length; i++) {
        var creepsInTheRoom
            ,result;

        creepsInTheRoom = Game.rooms[allSpawns[i].room.name].find(FIND_MY_CREEPS).length;
        //console.log('creeps = ' + creepsInTheRoom.toString());
        modifiedBody = basicCreep;

        if (creepsInTheRoom < minBasicCreeps) {
            result = allSpawns[i].canCreateCreep(modifiedBody, null);
            for (j = 1; j < basicCreep.length; j++) {
                if (result === -6 && modifiedBody.length > 3) {
                    modifiedBody = modifiedBody.slice(0, modifiedBody.length - 1);
                    result = allSpawns[i].canCreateCreep(modifiedBody, null);
                } else if (result === 0) {
                    j = basicCreep.length; // breaks outer loop
                }
            }

            if (result === 0 && allSpawns[i].spawning === null) {
                result = allSpawns[i].createCreep(modifiedBody, null, { role: 'harvester' });
                console.log(result + ' is one of us.');
            } else if (result === -6) {
                console.log('We have not the energy for even the simplest creep.')
            } else if (result !== -4) {
                console.log('There was an error: ' + result);
            }
        }
    }
}
