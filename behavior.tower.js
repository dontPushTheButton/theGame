var creepPrimitives = require('creepPrimitives');

module.exports = {
	defendRoom: function (roomName, hostiles) {
		var towers;
		if (hostiles.length > 0) {
			var username = hostiles[0].owner.username;
			Game.notify(`User ${username} spotted in room ${roomName}`);
			towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
			towers.forEach(tower => tower.attack(hostiles[0]));
		}
	},


	repairWalls: function (roomName, minPercentTowerEnergy, minWallHealth) {
		if (!Math.abs(Game.time % 3 - 1)) {
			var roomID = Game.rooms[roomName];
			var walls = roomID.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_WALL } });
			var towers = roomID.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
			walls.sort(creepPrimitives.compareObjectProperties('hits', 'ASC'));

			for (j = 0; j < towers.length; j++) {
				if (towers[j].energy > minPercentTowerEnergy * towers[j].energyCapacity) {
					if (walls.length > 0) {
						towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
						towers.forEach(tower => {
							tower.repair(walls[0]);
							walls.splice(0, 1);
						});
					} else {
						return;
					}
				}
			}
		}
	},

	maintainRoads: function (roomName, minPercentTowerEnergy) {
		var roads = Game.rooms[roomName].find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_ROAD } });
		var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
		//console.log(JSON.stringify(towers));
		for (j = 0; j < towers.length; j++) {
			for (i = 0; i < roads.length; i++) {
				if (towers[j].energy > minPercentTowerEnergy * towers[j].energyCapacity && roads[i].hits < 0.90 * roads[i].hitsMax || roads[i].hits < 300) {
					//console.log(towers[j].energy > minPercentTowerEnergy*towers[j].energyCapacity || roads[i].hits < 300);
					var roadRepair = towers[j].repair(roads[i]);
					//console.log(roads[i].hits);
				}
			}
		}
	},

	maintainStructures: function (roomName, frequency, offset, minRatio) {
		//console.log('maintainStructure() called');
		if (!Math.abs(Game.time % frequency - offset)) {
			//console.log('maintainStructure() activated');
			var targets;
			//console.log(buildingType);
			targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
				filter: (target) => {
					return target.hits / target.hitsMax <= minRatio;
				}
			});

			targets = _.sortByOrder(
				targets,
				[
					function (target) {
						return target.hits / target.hitsMax;
					}
				],
				['asc']
				);
			//targets.sort(creepPrimitives.compareObjectProperties('hits', 'ASC'));
			//console.log(JSON.stringify(targets));
			if (targets.length > 0) {
				var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });
				towers.forEach(tower => {
					tower.repair(targets[0]);
					targets.splice(0, 1);
				});
			} else {
				return;
			}
		}
	}
}; 