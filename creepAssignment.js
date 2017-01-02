var role = require('role'),
    creepPrimitives = require('creepPrimitives')
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



	console.log('minBasicCreepCount: ' + minBasicCreepCount);



	_.forEach(census[roomName], function (n, key) {
		localCreepCount[key] = n.length;
		//console.log(basicTypes);
		//console.log(key);
		//console.log(_.includes(basicTypes, key))
		if (_.includes(basicTypes, key)) {
			basicCreepCount = basicCreepCount + n.length;
		}
		if (true) {
			console.log(roomName + ' ' + key + ' count: ' + n.length);
		}
	});


	if (constructionByRoom.propertyIsEnumerable(roomName)) {
		minBasicCreepCount = minBasicCreepCount + minBuilders;
		console.log('minBasicCreepCount: ' + minBasicCreepCount);
		if (Game.rooms[roomName].controller.my) {
			spawnMyCreeps.spawnAllCreeps(minBasicCreepCount, basicCreepCount, roomName, census);
		}

		try {
			if (localCreepCount.harvester > minHarvesters) {
				//console.log('Too many harvesters.');
				creepToChange = Game.getObjectById(census[roomName].harvester[0]);
			} else if (localCreepCount.upgrader > minUpgraders) {
				creepToChange = Game.getObjectById(census[roomName].upgrader[0]);
			}

			if (localCreepCount.builder < minBuilders) {
				creepPrimitives.changeRole(creepToChange, {
					role: 'builder',
				});
				creep.memory.destination = creepPrimitives.findBestSource(creep, true);
			}
		}
		catch (err) {

		}


	} else {
		if (Game.rooms[roomName].controller.my) {
			spawnMyCreeps.spawnAllCreeps(minBasicCreepCount, basicCreepCount, roomName, census);
		}
		minBuilders = 0;
	}
	if (localCreepCount.builder > minBuilders) {
		creepToChange = Game.getObjectById(census[roomName].builder[0]);
		creepPrimitives.changeRole(creepToChange,
			 {
			 	role: 'upgrader',
			 });
		creep.memory.destination = creepPrimitives.findBestSource(creep, true);
	}
	if (localCreepCount.harvester > minHarvesters && localCreepCount.upgrader < minUpgraders) {
		creepToChange = Game.getObjectById(census[roomName].harvester[0]);
		creepPrimitives.changeRole(creepToChange,
			{
 				role: 'upgrader',
			});
		creep.memory.destination = creepPrimitives.findBestSource(creep, true);
	}


	//console.log('basicCreepCount: ' + basicCreepCount);


	if (constructionByRoom.propertyIsEnumerable(roomName)) {

	}

	for (var name in Game.creeps) {

		var creep = Game.creeps[name];
		//console.log(JSON.stringify(creep));
		if (creep.memory.role == 'harvester') {
			role.harvester(creep);
		}

		if (creep.memory.role == 'builder') {
			role.builder(creep, constructionByRoom);
		}

		if (creep.memory.role == 'upgrader') {
			role.upgrader(creep);
		}

		if (creep.memory.role == 'towerTender') {
			role.towerTender(creep, roomName);
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
}

