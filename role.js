var creepPrimitives = require('creepPrimitives');

module.exports = {
	harvester: function (creep) {
		var sources,
			targets,
			bestSourceID,
			bestDropoffID,
			bestTarget,
			needsToMove,
			moveToHere,
			hasStorage,
			currentDestinationObject;

		//bestSourceID = creepPrimitives.findBestSource(creep);
		//if (bestSourceID < 0) {
		//	return -1;
		//}
		//if (!creep.room.propertyIsEnumerable("storage") || creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
		//	bestDropoffID = creepPrimitives.findBestDropoff(creep);
		//} else if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
		//	bestDropoffID = creepPrimitives.findBestDropoff(creep);
		//} else {
		//	//bestDropoffID = creep.room.storage.id;
		//}
		//console.log(creep.pos.roomName);

		currentDestinationObject = Game.getObjectById(creep.realMemory.destination);

		if (creep.carry.energy === 0 && creep.realMemory.offloading) {
			bestSourceID = creepPrimitives.findBestSource(creep); //bestSourceID;
			if (creep.realMemory.destination !== bestSourceID) {
				creep.realMemory.offloading = false;
				creep.realMemory.destination = bestSourceID;
			}
			//console.log('test1');
		} else if (creep.carry.energy === creep.carryCapacity && !creep.realMemory.offloading) {
			try {
				creep.realMemory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
				creep.realMemory.offloading = true;
			}
			catch (e) {
				spawns = creep.room.find(FIND_MY_SPAWNS);
				creep.realMemory.destination = spawns[0].id;
				creep.say('There\'s no where to go!');
				//console.log(JSON.stringify(e));
			} finally {
				//console.log('test2');
			}
		} else if (!creep.realMemory.hasOwnProperty('offloading') || !creep.realMemory.hasOwnProperty('destination')) {
			try {
				creep.realMemory.destination = creepPrimitives.findBestSource(creep);//bestSourceID;
				creep.realMemory.offloading = false;
			}
			catch (e) {
				cosole.log('There are no sources');
			}
			finally {
				//console.log('test3');
			}
			//creep.realMemory.offloading = false;
			//creep.realMemory.destination = creepPrimitives.findBestSource(creep);//bestSourceID;
			//console.log('test3');
		} else if (creep.carry.energy < creep.carryCapacity && currentDestinationObject.energy === 0 && !currentDestinationObject.structureType === 'extension') {
			creep.realMemory.destination = creepPrimitives.findBestSource(creep); //bestSourceID;
			//console.log('test4');
		} else if (creep.room.propertyIsEnumerable("storage") && creep.realMemory.offloading && creep.room.energyCapacityAvailable === creep.room.energyAvailable && creep.room.storage.id !== creep.realMemory.destination) {
			//console.log('storage id : ' + creep.room.storage.id);
			creep.realMemory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
			creep.say('test5');
			//console.log('test5');
		} else if (!creep.realMemory.offloading && Game.getObjectById(creep.realMemory.destination).energy === 0) {
			//console.log('test6a');
			creep.realMemory.destination = creepPrimitives.findBestSource(creep); //bestSourceID;
		} else if ((currentDestinationObject.structureType === 'extension' || currentDestinationObject.structureType === 'spawn') && currentDestinationObject.energy === currentDestinationObject.energyCapacity) {
			try {
				creep.realMemory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
			}
			catch (e) {
				creep.say('There\'s no where to go!');
				//console.log(JSON.stringify(e));
			}

			if (creep.propertyIsEnumerable("storage")) {
				if (creep.realMemory.destination !== creep.room.storage.id) {
					creep.realMemory.destination = creep.room.storage.id;//bestDropoffID;
					//console.log('test7');
				}
			}
		} else if (currentDestinationObject.energy === 0 && !creep.realMemory.offloading) {
			try {
				creep.realMemory.destination = creepPrimitives.findBestSource(creep);//bestDropoffID;
				creep.realMemory.offloading = true;
			}
			catch (e) {
				creep.say('There\'s no source');
				//console.log(JSON.stringify(e));
			} finally {
				//console.log('test8');
			}
		}

		moveToHere = Game.getObjectById(creep.realMemory.destination);
		needsToMove = creepPrimitives.moveCreep(creep, 1);

		if (!needsToMove) {
			if (creep.realMemory.offloading) {
				creep.transfer(moveToHere, RESOURCE_ENERGY);
			} else if (!creep.realMemory.offloading) {
				creep.harvest(moveToHere);
			}
		}
	},

	upgrader: function (creep) {
		var needsToMove,
			moveToHere,
			bestSourceID;

		bestSourceID = creepPrimitives.findBestSource(creep, true);

		//console.log(bestSourceID);

		//sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
		//console.log((creep.realMemory.upgrading && creep.carry.energy === 0));
		//console.log(!creep.realMemory.propertyIsEnumerable('upgrading'));

		if (creep.realMemory.upgrading && creep.carry.energy === 0 || !creep.realMemory.propertyIsEnumerable('upgrading') || !creep.realMemory.propertyIsEnumerable('destination')) {
			//console.log(JSON.stringify(bestSourceID));
			creep.realMemory.destination = bestSourceID;
			creep.realMemory.upgrading = false;
			//creep.say('test1');
		}
		if (!creep.realMemory.upgrading && creep.carry.energy === creep.carryCapacity) {
			creep.realMemory.upgrading = true;
			creep.realMemory.destination = creep.room.controller.id;
			//creep.say('test2');
		}

		moveToHere = Game.getObjectById(creep.realMemory.destination);
		//console.log(JSON.stringify(moveToHere));
		if (moveToHere.structureType === 'controller') {
			needsToMove = creepPrimitives.moveCreep(creep, 3);
		} else {
			needsToMove = creepPrimitives.moveCreep(creep, 0);
		}
		//creep.say(needsToMove);

		if (!needsToMove) {
			if (creep.realMemory.upgrading) {
				creep.upgradeController(Game.getObjectById(creep.realMemory.destination));
			} else if (!creep.realMemory.upgrading) {
				if (!_.isUndefined(creep.room.storage)) {
					if (creep.realMemory.destination === creep.room.storage.id) {
						//creep.say("boo");
						creep.withdraw(moveToHere, RESOURCE_ENERGY);
					} else {
						creep.harvest(moveToHere);
					}
				} else {
					creep.harvest(moveToHere);
				}
			}
		}
	},

	builder: function (creep, constructionByRoom) {
		var bestProjectID,
			moveToHere,
			creepPath,
			needsToMove,
			bestSourceID,
			currentDestinationID,
			result;

		//console.log(constructionByRoom.propertyIsEnumerable(creep.room));
		//console.log(constructionByRoom.propertyIsEnumerable(creep.pos.roomName));

		if (constructionByRoom.propertyIsEnumerable(creep.pos.roomName)) {
			bestProjectID = constructionByRoom[creep.pos.roomName][0];
			//console.log(bestProjectID);
		} else {
			creep.realMemory = {
				role: "upgrader",
				upgrading: false
			};
			creep.realMemory.destination = creepPrimitives.findBestSource(creep, true);
			return;
		}

		bestSourceID = creepPrimitives.findBestSource(creep, true);
		currentDestinationID = Game.getObjectById(creep.realMemory.destination);

		//console.log((creep.realMemory.building && creep.carry.energy === 0) + ' ' + bestSourceID);

		if (creep.realMemory.building && creep.carry.energy === 0 || !creep.realMemory.hasOwnProperty('building')) {
			creep.realMemory.building = false;
			creep.realMemory.destination = bestSourceID;
		} else if (!creep.realMemory.building && creep.carry.energy === creep.carryCapacity) {
			creep.realMemory.building = true;
			creep.realMemory.destination = bestProjectID;
		} else if (Game.getObjectById(creep.realMemory.destination) === null) {
			creep.realMemory.destination = bestProjectID;
		}

		moveToHere = Game.getObjectById(creep.realMemory.destination);
		needsToMove = creepPrimitives.moveCreep(creep, 0);
		//creep.say('eek');

		if (!needsToMove) {
			if (creep.realMemory.building) {
				creep.build(Game.getObjectById(creep.realMemory.destination));
			} else {
				if (_.isUndefined(creep.room.storage)) {
					//creep.say("boo");
					creep.harvest(moveToHere);

				} else if (creep.realMemory.destination === creep.room.storage.id) {
					creep.withdraw(moveToHere, RESOURCE_ENERGY);
				}
			}
		}
	},


	towerTender: function (creep, roomName) {
		//	creep.say(creep.realMemory.tending)
		if (creep.realMemory.tending && creep.carry.energy === 0) {
			creep.realMemory.tending = false;
		}

		if (!creep.realMemory.tending && creep.carry.energy === creep.carryCapacity) {
			creep.realMemory.tending = true;
		}

		//moveToHere = Game.getObjectById(creep.realMemory.destination);
		//needsToMove = creepPrimitives.moveCreep(creep, 1);

		//if (!needsToMove) {
		//	if (creep.realMemory.offloading) {
		//		creep.transfer(moveToHere, RESOURCE_ENERGY);
		//	} else if (!creep.realMemory.offloading) {
		//		creep.harvest(moveToHere);
		//	}
		//}

		if (creep.realMemory.tending) {
			var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType === STRUCTURE_TOWER && structure.energy / structure.energyCapacity < .95;
				}
			});
			towers.sort(creepPrimitives.compareObjectProperties("energy", "ASC"));
			//console.log(JSON.stringify(towers));
			if (towers.length > 0) {
				if (creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(towers[0]);
				}
			}
		}
		else {
			//		var sources = Game.rooms['E38S46'].find(FIND_SOURCES);
			creep.realMemory.destination = creep.room.storage;
			if (creep.withdraw(creep.realMemory.destination, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.realMemory.destination);
			}
		}
	},

	spawnTender: function (creep) {
		var targets,
			bestTarget,
			needsToMove,
			creepPath;

		targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
		storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType === STRUCTURE_STORAGE; } });
		sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });

		//console.log(JSON.stringify(storage));

		if (targets.length > 0) {
			if (targets.length > 1) {
				bestTarget = creep.pos.findClosestByPath(targets);
			} else if (targets.length === 1) {
				bestTarget = targets[0];
			} else if (targets.length === 0) {
				//placeholder
			}
		}



		//	console.log(creep + ' ' + JSON.stringify(Game.getObjectById(creep.realMemory.destination)));
		if (creep.carry.energy === 0 && creep.realMemory.offloading) {
			creep.realMemory.offloading = false;
			if (creep.realMemory.destination !== creep.room.storage.id) {
				creep.realMemory.destination = creep.room.storage.id;
				creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
			}
		} else if (creep.carry.energy === creep.carryCapacity && !creep.realMemory.offloading && typeof bestTarget !== 'undefined') {
			creep.realMemory.offloading = true;
			//		creep.realMemory.role = 'harvester';
			if (creep.realMemory.destination !== bestTarget.id) {
				creep.realMemory.destination = bestTarget.id;
				//console.log(bestTarget);
				//console.log(creep.realMemory.destination);
				creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
			}
		} else if (!creep.realMemory.hasOwnProperty('offloading') || !creep.realMemory.hasOwnProperty('destination')) {
			creep.realMemory.offloading = false;
			if (storage.length === 1) {
				creep.realMemory.destination = creep.room.storage.id;
			} else {
				creep.realMemory.destination = sources[0];
			}
			creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
		} else if (creep.realMemory.offloading && Game.getObjectById(creep.realMemory.destination).energy === Game.getObjectById(creep.realMemory.destination).energyCapacity) {
			if (typeof bestTarget !== 'undefined') {
				creep.realMemory.destination = bestTarget.id;
				creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
			} else {
				creep.realMemory.offloading = false;
				creep.realMemory.destination = creep.room.storage.id;
				creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
			}
		} else if (!creep.realMemory.offloading) {
			if (storage.length === 1) {
				if (creep.realMemory.destination !== creep.room.storage.id) {
					creep.realMemory.destination = creep.room.storage.id;
				}
			} else {
				creep.realMemory.destination = sources[0];
			}
			//		creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));

		}

		//	console.log(creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination)));
		moveToHere = Game.getObjectById(creep.realMemory.destination);
		creepPath = creep.realMemory.pathToDestination;
		needsToMove = !creep.pos.isNearTo(moveToHere);
		creep.say(needsToMove);

		if (needsToMove) {
			var moveResult = creep.moveByPath(creepPath);
			//console.log(moveResult);
			if (moveResult === -5) {
				creep.realMemory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.realMemory.destination));
			}
		} else if (creep.realMemory.offloading) {
			creep.transfer(moveToHere, RESOURCE_ENERGY);
		} else if (!creep.realMemory.offloading) {
			creep.withdraw(moveToHere, RESOURCE_ENERGY);
		}
	},

	colorGuard: function (creep, station) {
		creep.moveTo(Game.flags[station]);
	},


	attacker: function (creep, station) {
		var targets,
			hostiles;
		if (Game.flags[station].pos.roomName !== creep.room.name || creep.pos.x > 46) {
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
	},

	scavver: function (creep, station) {
		var sources,
			bestSource;
		var bestTarget = Game.rooms[creep.realMemory.home].storage;
		//if ((Game.flags[station].pos.roomName != creep.room.name && !creep.realMemory.offloading) || (creep.pos.x < 3 && !creep.realMemory.offloading)) {
		//	creep.moveTo(Game.flags[station]);
		//} else {
		//	sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
		//	//			console.log(sources);
		//	if (sources.length > 0) {
		//		bestSource = sources[0];
		//		//			console.log(bestSource);
		//	}

		//	if ((creep.carry.energy == 0 && creep.realMemory.offloading)) {
		//		creep.realMemory.offloading = false;
		//		creep.realMemory.destination = bestSource.id;
		//	} else if (creep.carry.energy == creep.carryCapacity && !creep.realMemory.offloading) {
		//		creep.realMemory.offloading = true
		//		creep.realMemory.destination = bestTarget.id;
		//	} else if (!creep.realMemory.hasOwnProperty('offloading') || !creep.realMemory.hasOwnProperty('destination')) {
		//		creep.realMemory.offloading = false;
		//		creep.realMemory.destination = bestSource.id;
		//	} else if (creep.carry.energy < creep.carryCapacity && Game.getObjectById(creep.realMemory.destination).energy == 0) {
		//		creep.realMemory.destination = bestSource.id;
		//	} else if (creep.realMemory.offloading && Game.getObjectById(creep.realMemory.destination).energy == Game.getObjectById(creep.realMemory.destination).energyCapacity) {
		//		creep.realMemory.destination = bestTarget.id;
		//	} else if (!creep.realMemory.offloading) {
		//		if (Game.getObjectById(creep.realMemory.destination).energy == 0) {
		//			creep.realMemory.destination = bestSource.id;
		//		}
		//	} else if (!creep.realMemory.offloading && (Game.getObjectById(creep.realMemory.destination).pos.roomName != creep.pos.roomName)) {
		//		creep.realMemory.destination = bestSource.id;
		//	}

		//	if (!creep.realMemory.offloading && Game.getObjectById(creep.realMemory.destination).pos.roomName != creep.pos.roomName) {
		//		creep.realMemory.destination = bestSource.id;
		//	}

		//	moveToHere = Game.getObjectById(creep.realMemory.destination);
		//	needsToMove = !creep.pos.isNearTo(moveToHere);
		//	creep.say(!creep.realMemory.offloading);

		//	if (needsToMove) {
		//		creep.moveTo(moveToHere);
		//	} else if (creep.realMemory.offloading) {
		//		creep.transfer(moveToHere, RESOURCE_ENERGY);
		//	} else if (!creep.realMemory.offloading) {
		//		var result = creep.harvest(moveToHere);
		//		console.log(result);
		//	}

		//}
	}
};