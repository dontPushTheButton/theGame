var creepPrimitives = require('creepPrimitives');

module.exports = {
	spawnAllCreeps: function (minBasicCreeps, basicCreepsInTheRoom, roomName, census) {
		this.spawnMyBasicCreeps(minBasicCreeps, basicCreepsInTheRoom, roomName, census);
		this.spawnTowerTenders(roomName, census);
		//this.spawnColorguard(roomName);
	},

	spawnMyBasicCreeps: function (minBasicCreeps, basicCreepsInTheRoom, roomName, census) {
		var basicCreep = [MOVE, WORK, CARRY, MOVE, WORK, CARRY,
			MOVE, WORK, CARRY, MOVE, WORK, CARRY,
			MOVE, WORK, CARRY, MOVE, WORK, CARRY,
			MOVE, WORK, CARRY, MOVE, WORK, CARRY,
			MOVE, WORK, CARRY, MOVE, WORK, CARRY,
			MOVE, WORK, CARRY, MOVE, WORK, CARRY];
		var allSpawns = _.values(Game.spawns);
		var modifiedBody = basicCreep;
		var spawn,
			creepsInTheRoom;

		//console.log(JSON.stringify(roomName));

		//basicCreepsInTheRoom = Game.rooms[roomName].find(FIND_MY_CREEPS).length;
		//console.log(creepsInTheRoom.toString() + ' creeps in room ' + );
		spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
		modifiedBody = basicCreep;

		//console.log(spawn.id);
		//console.log(JSON.stringify(creepsInTheRoom));
		//console.log(JSON.stringify(spawn));

		var noHarvesters = true;

		//if (census.propertyIsEnumerable(roomName)) {
		if (census.propertyIsEnumerable("harvester")) {
			noHarvesters = false;
		}
		// }



		if (basicCreepsInTheRoom < minBasicCreeps) {
			result = spawn.canCreateCreep(modifiedBody, null);
			//console.log(JSON.stringify(census['harvester']));
			//console.log(JSON.stringify(Game.rooms[roomName]));
			if (noHarvesters || Game.rooms[roomName].energyAvailable === Game.rooms[roomName].energyCapacityAvailable) {
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
				result = spawn.createCreep(modifiedBody, null, { role: 'harvester', basic: true });
				console.log(result + ' is one of us.');
			} else if (result === -6) {
				console.log('We are waiting for energy to build the best creep ' + roomName + '.');
			} else if (result !== -4) {
				console.log('There was an error: ' + result);
			}
		}
	},

	spawnTowerTenders: function (roomName, census) {
		var towersInTheRoom = _.values(Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType === STRUCTURE_TOWER; } }));
		var towerTenderBuild = [MOVE, CARRY];
		var desiredNumTowerTenders,
			actualNumTowerTenders,
			spawn;

		desiredNumTowerTenders = Math.ceil(towersInTheRoom.length / 3.0);
		spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
		//console.log(desiredNumTowerTenders);
		//console.log(JSON.stringify(census.propertyIsEnumerable(["towerTender"])));

		if (towersInTheRoom.length === 0) {
			return -1;
		} else if (desiredNumTowerTenders.length === 0) {
			return -2;
		}

		if (!census.propertyIsEnumerable("towerTender")) {
			actualNumTowerTenders = 0;
		} else {
			actualNumTowerTenders = Game.rooms[roomName].find(FIND_MY_CREEPS, { filter: (creep) => { return creep.realMemory.role === 'towerTender'; } }).length;
			//console.log(JSON.stringify(!!spawn.spawning));
			//console.log(actualNumTowerTenders.length);
			//actualNumTowerTenders = census["towerTender"].length;
		}
		//console.log('TT actual: ' + actualNumTowerTenders + ' TT desired: ' + desiredNumTowerTenders);
		//console.log(JSON.stringify(spawn.spawning));
		if (actualNumTowerTenders < desiredNumTowerTenders) {

			result = creepPrimitives.spawnCreep(roomName, spawn, towerTenderBuild, { role: 'towerTender' }, 'We need energy to create a tower tender in room ' + roomName + '.');
			//spawn.canCreateCreep(towerTenderBuild, null);
			//if (result === 0 && spawn.spawning === null) {
			//	result = spawn.createCreep(towerTenderBuild, null, { role: 'towerTender' });
			//	console.log(result + ' is one of us.');
			//} else if (result === -6) {
			//	console.log('We have not the energy for a Tower Tender in room ' + roomName + '.')
			//} else if (result !== -4) {
			//	console.log('There was an error: ' + result);
			//}

		}
		//console.log(actualNumTowerTenders);


		//actualNumTowerTenders = census.role['towerTender'].members.length;

	},

	spawnColorguard: function (roomName) {
		var colorguardBuild = [MOVE, WORK, CARRY, CLAIM];
		var desiredNumColorguard,
			actualNumColorGuard,
			spawn;
		spawn = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
		desiredNumColorguard = [Game.flags].length;//.length;
		actualNumColorGuard = _(Game.creeps).filter({ memory: { role: 'color' } });
		console.log(JSON.stringify(desiredNumColorguard));
		console.log(JSON.stringify(actualNumColorGuard.length));

		if (actualNumColorGuard < desiredNumColorguard || !actualNumColorGuard.length) {
			result = spawn.canCreateCreep(colorguardBuild, null);
			if (result === 0 && spawn.spawning === null) {
				result = spawn.createCreep(colorguardBuild, null, { role: 'colorguard' });
				console.log(result + ' is one of us.');
			} else if (result === -6) {
				console.log('We have not the energy for a colorguard in room ' + roomName + '.');
			} else if (result !== -4) {
				console.log('There was an error: ' + result);
			}

		}

	}
};


