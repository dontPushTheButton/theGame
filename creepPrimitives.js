//var _ = require('lodash');


module.exports = {
	idealPopulation: function () {
		return {
			"rcl": {
				"1": {
					"creeps": {
						"worker": {
							"parts": [],
							"desiredQty": function (roomName) {
								var sources,
								   suitableStructures,
								   needed,
								   distance;
								suitableStructures = [];
								needed = 0;
								try {
									sources = Game.rooms[roomName].find(FIND_SOURCES);
									if (sources.length > 0) {
										for (i = 0; i < sources.length; i++) {
											suitableStructures = Game.rooms[roomName].lookAtArea(sources[i].pos.y - 2, sources[i].pos.x - 2, sources[i].pos.y + 2, sources[i].pos.x + 2, 1);
											console.log(JSON.stringify(suitableStructures));
											suitableStructures = _.filter(_.filter(suitableStructures, function (obj) {
												return obj.type === "structure";
											}), function (obj) {
												return obj.structure.structureType === STRUCTURE_CONTAINER || obj.structure.structureType === STRUCTURE_LINK;
											});
											//console.log('boop suitableStructures.length: ' + suitableStructures.length);
											if (suitableStructures.length > 0) {
												//console.log('needed before: ' + needed);
												needed++;
												//console.log('needed after: ' + needed);
											}
										}
									}
								}
								catch (e) {
									console.log('Can\'t detemine the desired number of workers.');
									//console.log(JSON.stringify(e));
								} finally {
									return needed;
								}
							},
						},
						"trucker": {
							"parts": [],
							"desiredQty": function () {

							},
						},
						"soldier": {

						},
						"basic": {

						}
					},
					"buildings": {
						"STRUCTURE_SPAWN": {

						},
						"STRUCTURE_ROAD": {

						},
						"STRUCTURE_WALL": {

						},
						"STRUCTURE_CONTAINER": {
							"desiredQty": function (roomName) {
								return Game.rooms[roomName].find(FIND_SOURCES).length + 1; // one for the spawn and each source
							},
							"currentQty": function (roomName) {
								var numberCompleted,
								   numberSlated;

								numberCompleted = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
									filter: { structureType: STRUCTURE_CONTAINER }
								}).length;

								numberSlated = Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES, {
									filter: { structureType: STRUCTURE_CONTAINER }
								}).length;

								return numberCompleted + numberSlated;
							},
							"findLocations": {

							},
							"placeConstructionSites": function (roomName) {
								if (this.desiredQty(roomName) - this.currentQty(roomName)) {
									console.log("You must place more containers.");
								}
							},
						},
					}
				}
			}
		}
	},

	findBestSource: function (creep, pullsFromStorage) {
		var sources
		   , currentHighestSource
		   , bestSourceID;

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
			return creep.memory.destination;
			creep.say('no sources');
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
		var dropoffs
		   , storage
		   , bestDropoffID;

		//creep.say('HELP!');

		dropoffs = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (
				   (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity);
			}
		});
		//dropoffs.sort(this.compareObjectProperties("energyCapacity", "ASC"));
		storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });
		//console.log(JSON.stringify(storage));
		//console.log(JSON.stringify(dropoffs));


		if (dropoffs.length >= 2) {
			//console.log(JSON.stringify(dropoffs));
			//console.log(JSON.stringify(creep.pos));
			//console.log(JSON.stringify(creep.pos.findClosestByPath(dropoffs)));
			return creep.pos.findClosestByPath(dropoffs).id;
		} else if (dropoffs.length === 0) {
			dropoffs.push(storage[0]);
		}		 //if (dropoffs.length > 1) {

		return dropoffs[0].id;
	},

	findBestProject: function (creep) {
		var projects,
		   currentMostCompleted,
		   bestProjectsID;

		projects = _.sortByOrder(creep.room.find(FIND_CONSTRUCTION_SITES),
		   ['progressTotal',
			  function (o) {
			  	return o.progress / o.progressTotal;
			  }],
		   ['asc', 'desc']);
		//console.log(JSON.stringify(projects));

		if (projects.length) {
			if (projects.length > 1) {
				bestProjectsID = projects[0].id; //creep.pos.findClosestByPath(projects).id;
			} else if (projects.length == 1) {
				bestProjectsID = projects[0].id;
			} else {

			}
		}

		return bestProjectsID;
	},

	moveCreep: function (creep, range) {
		var range = range || 1;

		var moveToHere,
			needsToMove;
		try {
			if (Game.getObjectById(creep.memory.destination) !== null) {

			}
			moveToHere = Game.getObjectById(creep.memory.destination);
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
				}
				break;
			case 'DESC':
				return b[property] - a[property];
				break;
			default:
				break;
		}
	},

	spawnCreep: function (roomName, spawn, build, propertiesObj, neg6ErrMsg) {
		var result = spawn.canCreateCreep(build, null);
		if (result === 0 && spawn.spawning === null) {
			result = spawn.createCreep(build, null, propertiesObj);
			console.log(result + ' is one of us.');
		} else if (result === -6) {
			console.log('We are waiting for energy to build a better creep in room ' + roomName + '.')
		} else if (result !== -4) {
			console.log('There was an error spawning creep in ' + roomName + ': ' + result);
		}
		return result;
	},

	findCommonGround: function (firstRoomObject, secondRoomObject) {
		var commonRoomObjects;

		commonRoomObjects = [];

		try {
			if (true) {
				throw new Error('test');
			}
		}
		catch (err) {
			console.log("outer" + err.message);
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
			sortedConstruction = _.sortByOrder(allConstruction,
			   [function (o) {
			   	return o.pos.roomName;
			   },
				  'progressTotal',
				  function (o) {
				  	return o.progress / o.progressTotal;
				  }],
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

		}
	},

	changeRole: function (creep, properties) {
		creep.memory = properties;
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
					currentRole = currentCreep.memory.role;
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
	},
}


