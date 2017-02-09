module.exports = {

	containsRoom: function (room, list) {
		for (i = 0; i < list.length; i++) {
			if (list[i].ID === room) {
				return true;
			}
		}
		return false;
	},

	getRoomsInfo: function () {
		var spawnsList,
			roomsInfo;

		spawnList = Game.spawns;
		roomsInfo = [];

		for (var spawn in spawnList) {
			var nameOfRoom = Game.spawns[spawn].pos.roomName;
			//console.log(containsRoom(nameOfRoom, roomsInfo));
			if (!this.containsRoom(nameOfRoom, roomsInfo)) {
				roomsInfo.push({ ID: nameOfRoom, "rcl": Game.rooms[nameOfRoom].controller.level });
				roomsInfo[roomsInfo.length - 1].name = nameOfRoom;
			}
			//	console.log(roomsInfo[0].ID);
		}

		return roomsInfo;
	},

	census: function () {
		var allCreeps = _.values(Game.creeps);
		var census = {};
		var memberInfo;

		if (allCreeps.length === 0) {
			return census;
		}

		for (i = 0; i < allCreeps.length; i++) {
			memberInfo = allCreeps[i].id;

			if (!census.propertyIsEnumerable(allCreeps[i].room.name)) {
				census[allCreeps[i].room.name] = {};
				census[allCreeps[i].room.name][allCreeps[i].memory.role] = [memberInfo];
			} else if (!census[allCreeps[i].room.name].propertyIsEnumerable([allCreeps[i].memory.role])) {
				census[allCreeps[i].room.name][allCreeps[i].memory.role] = [memberInfo];
			} else {
				census[allCreeps[i].room.name][allCreeps[i].memory.role].push(memberInfo);
			}
		}
		return census;
	},

	countCreeps: function (roomName) {
		var localCreeps = _.values(Game.rooms[roomName].find(FIND_MY_CREEPS));
		var census = [];
		var currentRole
		, creepObject
		, creepInfo;

		//console.log('length of localCreeps: ' + localCreeps.length);

		for (i = 0; i < localCreeps.length; i++) {
			//console.log(JSON.stringify(localCreeps[i]));
			//currentCreep = { "id": localCreeps[i].id };
			//currentRole = currentCreep.memory.role;

			creepObject = Game.getObjectById(localCreeps[i].id);
			currentRole = creepObject.memory.role;
			creepInfo = { "room": roomName, "role": currentRole, "id": creepObject.id, "name": creepObject.name };
			// console.log(JSON.stringify(creepInfo));
			if (census.length === 0) {
				census = [{ "role": currentRole, "members": [creepObject] }];
				//console.log("i=" + i + ', name=' + creepInfo.name + 'first');
			} else {
				for (j = 0; j < census.length; j++) {
					//console.log("i=" + i + ", j=" + j + ', name=' + creepInfo.name + ' pre-match');
					if (currentRole === census[j].role) {
						//console.log("i=" + i + ", j=" + j + ', name=' + creepInfo.name + ' match');
						census[j].members.push(creepObject)
						j = census.length;
					} else if (j === census.length - 1) {
						//console.log("i=" + i + ", j=" + j + ', name=' + creepInfo.name + ' no match');
						census.push({ "role": currentRole, "members": [creepObject] });
						j = census.length;
					}
				}
			}
		}

		//for (i = 0; i < census.length; i++) {
		//console.log(census[i].role + " count: " + census[i].members.length);
		//}
		//return census;
	},

	honorTheDead: function () {
		for (var name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
				console.log(name + ' has fallen.Let us remember.');
			}
		}
	},
}
