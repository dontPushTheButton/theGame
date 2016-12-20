module.exports = {

    findBestSource: function (creep) {
        var sources
            ,currentHighestSource
            ,bestSourceID;

        sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });

        if (sources.length === 0) {
            return creep.memory.destination;
        } else {
            currentHighestSource = sources[0];
        }

        for (i = 1; i <= sources.length - 1; i++) {
            if (sources[i].energy > sources[i - 1].energy) {
                currentHighestSource = sources[i];
            }
        }

        bestSourceID = currentHighestSource.id;
        return bestSourceID;
    },

    findBestDropoff: function (creep) {
        var dropoffs
            ,storage
            ,bestDropoffID;

        dropoffs = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
        storage = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_STORAGE); } });

        if (dropoffs.length > 0) {
            if (dropoffs.length > 1) {
                bestDropoffID = creep.pos.findClosestByPath(dropoffs).id;
            } else if (dropoffs.length == 1) {
                bestDropoffID = dropoffs[0].id;
            } else if (dropoffs.length == 0 && storage.length == 1) {
                bestDropoffID = storage.id;
            }
        }

        return bestDropoffID;
    },

    findBestProject: function (creep) {
        var projects
            ,currentMostCompleted
            ,bestProjectsID;

        projects = creep.room.find(FIND_CONSTRUCTION_SITES);

        if (projects.length) {
            if (projects.length > 1) {
                bestProjectsID = creep.pos.findClosestByPath(projects).id;
            } else if (projects.length == 1) {
                bestProjectsID = projects[0].id;
            } else {

            }
        }

        return bestProjectsID;
    },
    
    moveCreep: function (creep, range) {
        var range = range || 1;

        var moveToHere
            ,needsToMove;

        moveToHere = Game.getObjectById(creep.memory.destination);
        needsToMove = !creep.pos.inRangeTo(moveToHere,range);
        //console.log(range);
        //creep.say(needsToMove);
        if (needsToMove) {
            creep.moveTo(moveToHere);
        }

        return needsToMove;
    },
    compareObjectProperties: function (property,order) {
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
}


