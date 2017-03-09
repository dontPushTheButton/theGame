var role = require('role'),
	creepPrimitives = require('creepPrimitives');
spawnMyCreeps = require('spawnMyCreeps');

module.exports = function creepAssignment(minHarvesters, minUpgraders, minBuilders, roomName, census, constructionByRoom) {
	var localCreepCount = {},
		creepToChange,
		basicCreepCount = 0,
		basicTypes = ['harvester',
					'upgrader',
					'builder'],

		minBasicCreepCount = minHarvesters + minUpgraders;

	if (!localCreepCount.propertyIsEnumerable('builder')) {
		localCreepCount.builder = 0;
	}

	if (!localCreepCount.propertyIsEnumerable('upgrader')) {
		localCreepCount.upgrader = 0;
	}



	//console.log('minBasicCreepCount: ' + minBasicCreepCount);



	_.forEach(census, function (n, key) {
		localCreepCount[key] = n.length;
		//console.log(basicTypes);
		//console.log(key);
		//console.log(_.includes(basicTypes, key))
		if (_.includes(basicTypes, key)) {
			basicCreepCount = basicCreepCount + n.length;
		}
		if (false) {
			console.log(roomName + ' ' + key + ' count: ' + n.length);
		}
	});

	if (constructionByRoom.propertyIsEnumerable(roomName)) {
		minBasicCreepCount = minBasicCreepCount + minBuilders;
		//console.log('minBasicCreepCount: ' + minBasicCreepCount);
		if (Game.rooms[roomName].controller.my) {
			spawnMyCreeps.spawnAllCreeps(minBasicCreepCount, basicCreepCount, roomName, census);
		}

		try {
			if (localCreepCount.harvester > minHarvesters) {
				//console.log('Too many harvesters.');
				//console.log(census.harvester[0]);
				creepToChange = Game.getObjectById(census.harvester[0]);
			} else if (localCreepCount.upgrader >= minUpgraders) {
				creepToChange = Game.getObjectById(census.upgrader[0]);
			}

			if (localCreepCount.builder < minBuilders) {
				creepPrimitives.changeRole(creepToChange, {
					role: 'builder'
				});
				creep.realMemory.destination = creepPrimitives.findBestSource(creep, true);
			}
		}
		catch (err) {
			console.log("failure in Role change");
		}


	} else {
		if (Game.rooms[roomName].controller.my) {
			spawnMyCreeps.spawnAllCreeps(minBasicCreepCount, basicCreepCount, roomName, census);
		}
		minBuilders = 0;
	}
	if (localCreepCount.builder > minBuilders) {
		creepToChange = Game.getObjectById(census.builder[0]);
		creepPrimitives.changeRole(creepToChange,
			{
				role: 'upgrader',
				basic: true
			});
		creep.realMemory.destination = creepPrimitives.findBestSource(creep, true);
	}
	if (localCreepCount.harvester > minHarvesters && localCreepCount.upgrader < minUpgraders) {
		try {
			creepToChange = Game.getObjectById(census.harvester[0]);
			if (!creepToChange.spawning) {
				console.log('trying to change: ' + creepToChange.name + ' id: ' + creepToChange.id);
				creepPrimitives.changeRole(creepToChange,
					{
						role: 'upgrader',
						basic: true,
						destination: []
					});
				creep.realMemory.destination = creepPrimitives.findBestSource(creep, true);
			} else {
				console.log('not even trying to change');
			}
		}
		catch (e) {
			//placeholder
		}
	}


	//console.log('basicCreepCount: ' + basicCreepCount);



	for (var name in Game.creeps) {

		var creep = Game.creeps[name];

		if (creep.ticksToLive >= CREEP_LIFE_TIME - 1 && !creep.spawning) {
			creep.setProperties(creep.memory);
			delete Memory.creeps[name];
		}

		if (!creep.spawning) {
			if (creep.realMemory.role === 'harvester') {
				role.harvester(creep);
			}

			if (creep.realMemory.role === 'builder') {
				role.builder(creep, constructionByRoom);
			}

			if (creep.realMemory.role === 'upgrader') {
				role.upgrader(creep);
			}

			if (creep.realMemory.role === 'towerTender') {
				role.towerTender(creep, roomName);
			}

			if (creep.realMemory.role === 'spawnTender') {
				role.spawnTender(creep);
			}

			if (creep.realMemory.role === 'attacker') {
				role.attacker(creep, 'Flag1');
			}

			if (creep.realMemory.role === 'scavver') {
				role.scavver(creep, creep.realMemory.destFlag);
			}

			if (creep.realMemory.role === 'colorGuard') {
				role.colorGuard(creep, 'Flag1');
			}
		}
	}
};

