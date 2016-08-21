var role = require('role');

module.exports = function creepAssignment(minHarvesters, minUpgraders, minTowerTenders, minSpawnTenders, minBuilders) {
    var theCreeps = _.values(Game.creeps);
    var currentHarvesters = [];
    var currentUpgraders = [];
    var currentTowerTenders = [];
    var currentSpawnTenders = [];
    var currentBuilders = [];
    var currentAttackers = [];
    var currentScavvers = [];
    var currentConstruction = _.values(Game.constructionSites);

    for (var name in Game.creeps) {

        //        Game.creeps[name].say(Game.creeps[name].body.length);
        if (Game.creeps[name].memory.role == 'harvester') {
            currentHarvesters.push(name);
        } else if (Game.creeps[name].memory.role == 'upgrader') {
            currentUpgraders.push(Game.creeps[name]);
        } else if (Game.creeps[name].memory.role == 'builder') {
            currentBuilders.push(Game.creeps[name]);
        } else if (Game.creeps[name].memory.role == 'towerTender') {
            currentTowerTenders.push(Game.creeps[name]);
        } else if (Game.creeps[name].memory.role == 'spawnTender') {
            currentSpawnTenders.push(Game.creeps[name]);
        } else if (Game.creeps[name].memory.role == 'attacker') {
            currentAttackers.push(Game.creeps[name]);
        } else if (Game.creeps[name].memory.role == 'scavver') {
            currentScavvers.push(Game.creeps[name]);
        }
        //console.log(Game.creeps[name].body.length);
    }

    //    console.log(currentHarvesters);

    console.log('Harvesters: ' + currentHarvesters.length);
    console.log('Upgraders: ' + currentUpgraders.length);
    console.log('Tower Tenders: ' + currentTowerTenders.length);
    console.log('Spawn Tenders: ' + currentSpawnTenders.length);
    console.log('Builders: ' + currentBuilders.length);
    console.log('Attackers: ' + currentAttackers.length);
    console.log('Scavvers: ' + currentScavvers.length);

    if (currentSpawnTenders < minSpawnTenders && currentHarvesters.length > 0 /* && */) {
        lastHarvester = currentHarvesters.pop();
        currentSpawnTenders.push(lastHarvester);
        changeRole(lastHarvester, 'spawnTender');
    } else if (currentHarvesters.length > minHarvesters && currentUpgraders.length < minUpgraders) {
        lastHarvester = currentHarvesters.pop();
        currentUpgraders.push(lastHarvester);
        changeRole(lastHarvester, 'upgrader');
    } else if (currentHarvesters.length > minHarvesters && currentTowerTenders.length < minTowerTenders) {
        Game.creeps[currentHarvesters[currentHarvesters.length - 1]].memory.role = 'towerTender';
    } else if (currentHarvesters.length > minHarvesters && currentSpawnTenders.length < minSpawnTenders) {
        Game.creeps[currentHarvesters[currentHarvesters.length - 1]].memory.role = 'spawnTender';
    } else if (currentHarvesters.length > minHarvesters && currentBuilders.length < minBuilders && currentConstruction.length > 0) {
        Game.creeps[currentHarvesters[currentHarvesters.length - 1]].memory.role = 'builder';
    }

    if (currentHarvesters.length >= minHarvesters && currentAttackers.length < 2) {
        var result = Game.spawns.Spawn1.createCreep([MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK], undefined, { role: 'attacker' });
    }
    if (currentHarvesters.length >= minHarvesters && currentScavvers.length < 1) {
        var homeRoom = Game.spawns.Spawn1.pos.roomName;
        var result = Game.spawns.Spawn1.createCreep([MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY]
                                                   , undefined
                                                   , {
                                                       role: 'scavver'
                                                    , home: homeRoom
                                                    , offloading: false
                                                    , destFlag: 'Flag2'
                                                   });
    } else if (currentHarvesters.length >= minHarvesters && (currentScavvers.length == 1 && currentScavvers.length < 2)) {
        var homeRoom = Game.spawns.Spawn1.pos.roomName;
        var result = Game.spawns.Spawn1.createCreep([MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY]
                                                   , undefined
                                                   , {
                                                       role: 'scavver'
                                                    , home: homeRoom
                                                    , offloading: false
                                                    , destFlag: 'Flag3'
                                                   });
    }



    for (var name in Game.creeps) {
        //        test = Game.creeps[name].body.length;
        //        console.log(name + ' has ' + test + ' body parts');

        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            role.harvester(creep);
        }

        if (creep.memory.role == 'builder') {
            role.builder(creep);
        }

        if (creep.memory.role == 'upgrader') {
            role.upgrader(creep);
        }

        if (creep.memory.role == 'towerTender') {
            role.towerTender(creep);
        }

        if (creep.memory.role == 'spawnTender') {
            role.spawnTender(creep);
        }

        if (creep.memory.role == 'attacker') {
            role.attacker(creep, 'Flag1');
        }

        if (creep.memory.role == 'scavver') {
            role.scavver(creep, creep.memory.destFlag);
        }

        if (creep.memory.role == 'colorGuard') {
            role.colorGuard(creep, 'Flag1');
        }
    }

    function changeRole(creep, newRole) {
        Game.creeps[creep].memory.role = newRole;
    }
}

