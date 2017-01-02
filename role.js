var creepPrimitives = require('creepPrimitives');

module.exports = {
    harvester: function (creep) {
	   var sources
		  , targets
		  , bestSourceID
		  , bestDropoffID
		  , bestTarget
		  , needsToMove
		  , moveToHere
		  , hasStorage
		  , currentDestinationObject;

	   //bestSourceID = creepPrimitives.findBestSource(creep);
	   //if (bestSourceID < 0) {
	   //    return -1;
	   //}
	   //if (!creep.room.propertyIsEnumerable("storage") || creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
	   //    bestDropoffID = creepPrimitives.findBestDropoff(creep);
	   //} else if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
	   //    bestDropoffID = creepPrimitives.findBestDropoff(creep);
	   //} else {
	   //    //bestDropoffID = creep.room.storage.id;
	   //}
	   //console.log(creep.pos.roomName);

	   currentDestinationObject = Game.getObjectById(creep.memory.destination);

	   if ((creep.carry.energy == 0 && creep.memory.offloading)) {
		  bestSourceID = creepPrimitives.findBestSource(creep); //bestSourceID;
		  if (creep.memory.destination !== bestSourceID) {
			 creep.memory.offloading = false;
			 creep.memory.destination = bestSourceID;
		  }
		  //console.log('test1');
	   } else if (creep.carry.energy === creep.carryCapacity && !creep.memory.offloading) {
		  try {
			 creep.memory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
			 creep.memory.offloading = true;
		  }
		  catch (e) {
			 spawns = creep.room.find(FIND_MY_SPAWNS);
			 creep.memory.destination = spawns[0].id;
			 creep.say('There\'s no where to go!');
			 //console.log(JSON.stringify(e));
		  } finally {
			 //console.log('test2');
		  }
	   } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
		  try {
			 creep.memory.destination = creepPrimitives.findBestSource(creep);//bestSourceID;
			 creep.memory.offloading = false;
		  } 
		  catch (e) {
			 cosole.log('There are no sources');
		  }
		  finally {
			 //console.log('test3');
		  }
		  //creep.memory.offloading = false;
		  //creep.memory.destination = creepPrimitives.findBestSource(creep);//bestSourceID;
		  //console.log('test3');
	   } else if (creep.carry.energy < creep.carryCapacity && currentDestinationObject.energy == 0 && !currentDestinationObject.structureType === 'extension') {
		  creep.memory.destination = creepPrimitives.findBestSource(creep); //bestSourceID;
		  //console.log('test4');
	   } else if (creep.room.propertyIsEnumerable("storage")) {
		  if (creep.memory.offloading && creep.room.energy === creep.room.energyCapacity && creep.room.storage.id !== creep.memory.destination) {
			 creep.memory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
			 //console.log('test5');
		  }
	   } else if (!creep.memory.offloading) {
		  //console.log('test6a');
		  if (Game.getObjectById(creep.memory.destination).energy === 0) {
			 creep.memory.destination = creepPrimitives.findBestSource(creep); //bestSourceID;
			 //console.log('test6b');
		  }
	   } else if ((currentDestinationObject.structureType === 'extension' || currentDestinationObject.structureType === 'spawn') && currentDestinationObject.energy === currentDestinationObject.energyCapacity) {
		  try {
			 creep.memory.destination = creepPrimitives.findBestDropoff(creep);//bestDropoffID;
		  }
		  catch (e) {
			 creep.say('There\'s no where to go!');
			 //console.log(JSON.stringify(e));
		  }

		  if (creep.propertyIsEnumerable("storage")) {
			 if (creep.memory.destination !== creep.room.storage.id) {
				creep.memory.destination = creep.room.storage.id;//bestDropoffID;
				//console.log('test7');
			 }
		  }
	   } else if (currentDestinationObject.energy === 0 && !creep.memory.offloading) {
		  try {
			 creep.memory.destination = creepPrimitives.findBestSource(creep);//bestDropoffID;
			 creep.memory.offloading = true;
		  }
		  catch (e) {
			 creep.say('There\'s no source');
			 //console.log(JSON.stringify(e));
		  } finally {
			 //console.log('test8');
		  }
	   }

	   moveToHere = Game.getObjectById(creep.memory.destination);
	   needsToMove = creepPrimitives.moveCreep(creep, 1);

	   if (!needsToMove) {
		  if (creep.memory.offloading) {
			 creep.transfer(moveToHere, RESOURCE_ENERGY);
		  } else if (!creep.memory.offloading) {
			 creep.harvest(moveToHere);
		  }
	   }
    },

    upgrader: function (creep) {
	   var needsToMove
		  , moveToHere
		  , bestSourceID;

	   bestSourceID = creepPrimitives.findBestSource(creep, true);

	   //console.log(bestSourceID);

	   //sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });

	   if ((creep.memory.upgrading && creep.carry.energy == 0) || !creep.memory.propertyIsEnumerable('upgrading')) {
		  creep.memory.upgrading = false;
		  creep.memory.destination = bestSourceID;
		  //console.log('test1');
	   }
	   if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
		  creep.memory.upgrading = true;
		  creep.memory.destination = creep.room.controller.id;
		  //console.log('test2');
	   }


	   moveToHere = Game.getObjectById(creep.memory.destination);
	   //console.log(JSON.stringify(moveToHere));
	   if (moveToHere.structureType === 'controller') {
		  needsToMove = creepPrimitives.moveCreep(creep, 3);
	   } else {
		  needsToMove = creepPrimitives.moveCreep(creep, 0);
	   }
	   //creep.say(needsToMove);

	   if (!needsToMove) {
		  if (creep.memory.upgrading) {
			 creep.upgradeController(Game.getObjectById(creep.memory.destination));
		  } else if (!creep.memory.upgrading) {
			 if (creep.room.storage) {
				//creep.say("boo");
				creep.withdraw(moveToHere, RESOURCE_ENERGY);
			 } else {
				creep.harvest(moveToHere);
			 }
		  }
	   }
    },

    builder: function (creep,constructionByRoom) {
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
		  creep.memory = {
			 role: "upgrader",
			 upgrading: false,
		  };
		  creep.memory.destination = creepPrimitives.findBestSource(creep, true);
		  return;
	   }

	   bestSourceID = creepPrimitives.findBestSource(creep, true);
	   currentDestinationID = Game.getObjectById(creep.memory.destination);

	   if ((creep.memory.building && creep.carry.energy === 0) || !creep.memory.hasOwnProperty('building')) {
		  creep.memory.building = false;
		  creep.memory.destination = bestSourceID;
	   } else if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
		  creep.memory.building = true;
		  creep.memory.destination = bestProjectID;
	   } else if (Game.getObjectById(creep.memory.destination) === null) {
		  creep.memory.destination = bestProjectID;
	   }

	   moveToHere = Game.getObjectById(creep.memory.destination);
	   needsToMove = creepPrimitives.moveCreep(creep, 0);

	   if (!needsToMove) {
		  if (creep.memory.building) {
			 creep.build(Game.getObjectById(creep.memory.destination));
		  } else if (!creep.memory.upgrading) {
			 if (creep.room.storage) {
				//creep.say("boo");
				creep.withdraw(moveToHere, RESOURCE_ENERGY);
			 } else {
				creep.harvest(moveToHere);
			 }
		  }
	   }
    },


    towerTender: function (creep, roomName) {
	   //    creep.say(creep.memory.tending)
	   if (creep.memory.tending && creep.carry.energy == 0) {
		  creep.memory.tending = false;
	   }

	   if (!creep.memory.tending && creep.carry.energy == creep.carryCapacity) {
		  creep.memory.tending = true;
	   }

	   if (creep.memory.tending) {
		  var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
			 filter: (structure) => {
				return (structure.structureType == STRUCTURE_TOWER && structure.energy / structure.energyCapacity < .95);
			 }
		  });
		  towers.sort(creepPrimitives.compareObjectProperties("energy", "ASC"));
		  //console.log(JSON.stringify(towers));
		  if (towers.length > 0) {
			 if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(towers[0]);
			 }
		  }
	   }
	   else {
		  //	   var sources = Game.rooms['E38S46'].find(FIND_SOURCES);
		  creep.memory.destination = creep.room.storage;
		  if (creep.withdraw(creep.memory.destination, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			 creep.moveTo(creep.memory.destination);
		  }
	   }
    },

    spawnTender: function (creep) {
	   var targets,
		  bestTarget,
		  needsToMove,
		  creepPath;

	   targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
	   storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });
	   sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });

	   //console.log(JSON.stringify(storage));

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
		  //	   creep.memory.role = 'harvester';
		  if (creep.memory.destination != bestTarget.id) {
			 creep.memory.destination = bestTarget.id;
			 //console.log(bestTarget);
			 //console.log(creep.memory.destination);
			 creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
		  }
	   } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
		  creep.memory.offloading = false;
		  if (storage.length == 1) {
			 creep.memory.destination = creep.room.storage.id;
		  } else {
			 creep.memory.destination = sources[0];
		  }
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
		  if (storage.length == 1) {
			 if (creep.memory.destination != creep.room.storage.id) {
				creep.memory.destination = creep.room.storage.id;
			 }
		  } else {
			 creep.memory.destination = sources[0];
		  }
		  //	  creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));

	   }

	   //    console.log(creep.pos.findPathTo(Game.getObjectById(creep.memory.destination)));
	   moveToHere = Game.getObjectById(creep.memory.destination);
	   creepPath = creep.memory.pathToDestination;
	   needsToMove = !creep.pos.isNearTo(moveToHere);
	   creep.say(needsToMove);

	   if (needsToMove) {
		  var moveResult = creep.moveByPath(creepPath);
		  //console.log(moveResult);
		  if (moveResult === -5) {
			 creep.memory.pathToDestination = creep.pos.findPathTo(Game.getObjectById(creep.memory.destination));
		  }
	   } else if (creep.memory.offloading) {
		  creep.transfer(moveToHere, RESOURCE_ENERGY);
	   } else if (!creep.memory.offloading) {
		  creep.withdraw(moveToHere, RESOURCE_ENERGY);
	   }
    },

    colorGuard: function (creep, station) {
	   creep.moveTo(Game.flags[station]);
    },


    attacker: function (creep, station) {
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
    },

    scavver: function (creep, station) {
	   var sources
		 , bestSource;
	   var bestTarget = Game.rooms[creep.memory.home].storage;
	   //if ((Game.flags[station].pos.roomName != creep.room.name && !creep.memory.offloading) || (creep.pos.x < 3 && !creep.memory.offloading)) {
	   //    creep.moveTo(Game.flags[station]);
	   //} else {
	   //    sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
	   //    //		  console.log(sources);
	   //    if (sources.length > 0) {
	   //	   bestSource = sources[0];
	   //	   //		  console.log(bestSource);
	   //    }

	   //    if ((creep.carry.energy == 0 && creep.memory.offloading)) {
	   //	   creep.memory.offloading = false;
	   //	   creep.memory.destination = bestSource.id;
	   //    } else if (creep.carry.energy == creep.carryCapacity && !creep.memory.offloading) {
	   //	   creep.memory.offloading = true
	   //	   creep.memory.destination = bestTarget.id;
	   //    } else if (!creep.memory.hasOwnProperty('offloading') || !creep.memory.hasOwnProperty('destination')) {
	   //	   creep.memory.offloading = false;
	   //	   creep.memory.destination = bestSource.id;
	   //    } else if (creep.carry.energy < creep.carryCapacity && Game.getObjectById(creep.memory.destination).energy == 0) {
	   //	   creep.memory.destination = bestSource.id;
	   //    } else if (creep.memory.offloading && Game.getObjectById(creep.memory.destination).energy == Game.getObjectById(creep.memory.destination).energyCapacity) {
	   //	   creep.memory.destination = bestTarget.id;
	   //    } else if (!creep.memory.offloading) {
	   //	   if (Game.getObjectById(creep.memory.destination).energy == 0) {
	   //		  creep.memory.destination = bestSource.id;
	   //	   }
	   //    } else if (!creep.memory.offloading && (Game.getObjectById(creep.memory.destination).pos.roomName != creep.pos.roomName)) {
	   //	   creep.memory.destination = bestSource.id;
	   //    }

	   //    if (!creep.memory.offloading && Game.getObjectById(creep.memory.destination).pos.roomName != creep.pos.roomName) {
	   //	   creep.memory.destination = bestSource.id;
	   //    }

	   //    moveToHere = Game.getObjectById(creep.memory.destination);
	   //    needsToMove = !creep.pos.isNearTo(moveToHere);
	   //    creep.say(!creep.memory.offloading);

	   //    if (needsToMove) {
	   //	   creep.moveTo(moveToHere);
	   //    } else if (creep.memory.offloading) {
	   //	   creep.transfer(moveToHere, RESOURCE_ENERGY);
	   //    } else if (!creep.memory.offloading) {
	   //	   var result = creep.harvest(moveToHere);
	   //	   console.log(result);
	   //    }

	   //}
    },
}