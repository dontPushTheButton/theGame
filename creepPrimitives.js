//var _ = require('lodash');


module.exports = {

	findBestSource (creep, pullsFromStorage) {
		var sources,
			currentHighestSource,
			bestSourceID;

		//console.log(creep.name);
		pullsFromStorage = pullsFromStorage || false;

		if (pullsFromStorage) {
			//console.log(creep.room.propertyIsEnumerable("storage"));
			//console.log(creep.room.storage.store[RESOURCE_ENERGY] > 0);
			//console.log(bestSourceID !== creep.room.storage.id);
			if (creep.room.propertyIsEnumerable("storage") && creep.room.storage.store[RESOURCE_ENERGY] > 0 && bestSourceID !== creep.room.storage.id) {
				return creep.room.storage.id;
			}

		}

		sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });

		if (sources.length === 0) {
			creep.say('no sources');
			return creep.realMemory.destination;
		} else {
			currentHighestSource = sources[0];
		}

		for (i = 1; i <= sources.length - 1; i++) {
			if (sources[i].energy > sources[i - 1].energy) {
				currentHighestSource = sources[i];
			}
		}

		bestSourceID = currentHighestSource.id;



		//console.log(JSON.stringify(bestSourceID));
		return bestSourceID;
	},

	findBestDropoff: function (creep) {
		var dropoffs,
			storage,
			bestDropoffID;

		//creep.say('HELP!');

		dropoffs = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
					(structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
			}
		});
		//dropoffs.sort(this.compareObjectProperties("energyCapacity", "ASC"));
		storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType === STRUCTURE_STORAGE; } });
		//console.log(JSON.stringify(storage));
		//console.log(JSON.stringify(dropoffs));


		if (dropoffs.length >= 2) {
			//console.log(JSON.stringify(dropoffs));
			//console.log(JSON.stringify(creep.pos));
			//console.log(JSON.stringify(creep.pos.findClosestByPath(dropoffs)));
			return creep.pos.findClosestByPath(dropoffs).id;
		} else if (dropoffs.length === 0) {
			dropoffs.push(storage[0]);
		}			//if (dropoffs.length > 1) {

		return dropoffs[0].id;
	},

	findBestProject: function (creep) {
		var projects,
			currentMostCompleted,
			bestProjectsID;

		projects = _.sortByOrder(creep.room.find(FIND_CONSTRUCTION_SITES),
			[
				'progressTotal',
				function (o) {
					return o.progress / o.progressTotal;
				}
			],
			['asc', 'desc']);
		//console.log(JSON.stringify(projects));

		if (projects.length) {
			if (projects.length > 1) {
				bestProjectsID = projects[0].id; //creep.pos.findClosestByPath(projects).id;
			} else if (projects.length === 1) {
				bestProjectsID = projects[0].id;
			} else {
				//test
			}
		}

		return bestProjectsID;
	},

	moveCreep: function (creep, range) {
		try {
			range = range || 1;

			var moveToHere,
				needsToMove;


			moveToHere = Game.getObjectById(creep.realMemory.destination);
			needsToMove = !creep.pos.inRangeTo(moveToHere, range);
			//console.log(range);
			//creep.say(needsToMove);
			if (needsToMove) {
				creep.moveTo(moveToHere);
			}

		}
		catch (e) {
			creep.say('Trouble moving');
		}

		return needsToMove;
	},

	compareObjectProperties: function (property, order) {
		order.toUpperCase();
		switch ('ASC') {
			case 'ASC':
				//return a.hits - b.hits;
				return function (a, b) {
					//console.log(property);
					//console.log(a[property] - b[property]);
					return a[property] - b[property];
				};
				//break;
			case 'DESC':
				return b[property] - a[property];
				//break;
			default:
				break;
		}
	},

	spawnCreep: function (roomName, spawn, build, propertiesObj, neg6ErrMsg) {
		var result = spawn.canCreateCreep(build, null);
		if (result === 0 && spawn.spawning === null) {
			result = spawn.createCreep(build, null, propertiesObj);
			console.log(result + ' is one of us.');
			//console.log(Game.creeps[result].id);
			//Game.creeps[result].setProperties(propertiesObj);
		} else if (result === -6) {
			console.log('We are waiting for energy to build a better creep in room ' + roomName + '.');
		} else if (result !== -4) {
			console.log('There was an error spawning creep in ' + roomName + ': ' + result);
		}
		return result;
	},

	findCommonGround: function (firstRoomObject, secondRoomObject) {
		try {
			var commonRoomObjects = [];
			if (true) {
				throw new Error('test');
			}
		}
		catch (err) {
			console.log("There was a problem finding common ground: " + err.message);
		}

		return commonRoomObjects;

	},

	findConstructionByRoom: function () {
		var allConstruction,
			sortedConstruction,
			constructionByRoom;

		constructionByRoom = {};

		try {
			allConstruction = _.values(Game.constructionSites);
			//console.log(JSON.stringify(allConstruction));
			sortedConstruction = _.sortByOrder(
				allConstruction,
				[
					function (o) {
						return o.pos.roomName;
					},
					'progressTotal',
					function (o) {
						return o.progress / o.progressTotal;
					}
				],
				['asc', 'asc', 'desc']);

			for (i = 0; i < sortedConstruction.length; i++) {
				if (!constructionByRoom.propertyIsEnumerable(sortedConstruction[i].pos.roomName)) {
					constructionByRoom[sortedConstruction[i].pos.roomName] = [];
					constructionByRoom[sortedConstruction[i].pos.roomName].push(sortedConstruction[i].id);
				} else {
					constructionByRoom[sortedConstruction[i].pos.roomName].push(sortedConstruction[i].id);
				}
			}

			return constructionByRoom;

		}
		catch (err) {
			console.log("There was a problem creating a list of construction sites by room");
		}
		finally {
			//placeholder
		}
	},

	changeRole: function (creep, properties) {
		creep.setProperties(properties);
	},

	prototypeThis: function () {
		Room.prototype.construction = function () {
			return this.find(FIND_MY_CONSTRUCTION_SITES);
		};

		Room.prototype.census = function (print) {
			print = print || false;

			var census = {},
				creepsInRoom = this.find(FIND_MY_CREEPS),
				roomName = this.name;

			_.forEach(creepsInRoom, function (n, key) {
				var currentCreep = creepsInRoom[key],
					currentRole = currentCreep.realMemory.role;
				if (!census.propertyIsEnumerable(currentRole)) {
					census[currentRole] = [];
					census[currentRole].push(currentCreep.id);
				} else {
					census[currentRole].push(currentCreep.id);
				}
			});

			if (print) {
				_.forEach(census, function (n, key) {
					console.log(roomName + ' ' + key + ' count: ' + n.length);
				});
			}
			//console.log(JSON.stringify(census));
			return census;
		};

		Object.defineProperty(RoomObject.prototype, 'realMemory', {
			get: function () {
				try {
					if (_.isUndefined(Memory[this.id])) {
						Memory[this.id] = {};
					}
					if (!_.isObject(Memory[this.id])) {
						return undefined;
					}
					return Memory[this.id] = Memory[this.id] || {};
				}
				catch (err) {
					console.log(err.message);
				}
			},
			set: function (value) {
				try {
					if (_.isUndefined(Memory[this.id])) {
						Memory[this.id] = {};
					}
					if (!_.isObject(Memory[this.id])) {
						throw new Error('Could not set RoomObject memory');
					}
					Memory[this.id] = value;
				}
				catch (err) {
					console.log(err.message);
				}
			}
		});

		RoomObject.prototype.setProperties = function (propertyObject) {
			var objectMemory = Memory[this.id];
			console.log(JSON.stringify(objectMemory));


			for (var key in propertyObject) {
				// skip loop if the property is from prototype
				if (!propertyObject.hasOwnProperty(key)) continue;
				if (_.isUndefined(Memory[this.id][key])) {
					objectMemory[key] = {};
				}
				objectMemory[key] = propertyObject[key];
			}
		};

		RoomObject.prototype.resetProperties = function (propertyObject) {
			var objectMemory = Memory[this.id];
			//console.log(JSON.stringify(objectMemory));


			for (var key in propertyObject) {
				// skip loop if the property is from prototype
				if (!propertyObject.hasOwnProperty(key)) continue;
				if (_.isUndefined(Memory[this.id][key])) {
					objectMemory[key] = {};
				}
				objectMemory[key] = propertyObject[key];
			}
		};

		massSuicide = function (room) {
			var creepsToDie = Game.rooms[room].find(FIND_MY_CREEPS);
			for (var int in creepsToDie) {
				creepName = creepsToDie[int].name;
				Game.creeps[creepName].suicide();

				console.log(creepName + ' drank the Kool-Aid. Onward to the ascension');
			}
		};


	},

	performTask: function (){
	
	},

	CreepDestination: function (destinationID) {
			this.destinationID = destinationID;
			this.pos = Game.getObjectById(destinationID).pos;
	},

	//CreepHarvest.prototype = new module.exports.CreepDestination() {
	//	constructor(destinationID) {

	//		//this.destinationID = destinationID;
	//		//this.pos = Game.getObjectById(destiantionID).pos;
	//		this.action = 'harvest';
	//	}
	//},


	
	//creepDestination: function (destinationID) {
	//	return {
	//		destinationID: destinationID,
	//		pos: Game.getObjectById(destinationID).pos
	//	}
	//},

	//CreepHarvest: class {
	//	constructor(destinationID) {
	//		try {
	//			this.destination = module.exports.creepDestination(destinationID);
	//			this.action = 'harvest';
	//		}
	//		catch (err) {
	//			console.log('Problem creating task: ' + err.message)
	//		}
	//	}
	//}

};




