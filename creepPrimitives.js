module.exports.findBestSource = function findBestSource(creep) {
    var sources
        ,currentHighestSource
        ,bestSourceID;

    sources = creep.room.find(FIND_SOURCES, { filter: (source) => { return source.energy > 0; } });
    currentHighestSource = sources[0];

    for (i = 1; i <= sources.length - 1; i++) {
        if (sources[i].energy > sources[i - 1].energy) {
            currentHighestSource = sources[i];
        }
    }

    bestSourceID = currentHighestSource.id;
    return bestSourceID;
}

module.exports.findBestDropoff = function findBestDropoff(creep) {
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
}

module.exports.findBestProject = function findBestProject(creep) {
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
}

module.exports.moveCreep = function moveCreep(creep) {



    return
}


