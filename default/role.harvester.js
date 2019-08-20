var roleBuilder = require('role.builder');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.memory.building = false
            creep.say('harvesting');
	    }
	    if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.harvesting = false;
	    }
	   
	    if(creep.memory.harvesting) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if (creep.memory.harvesting && creep.carry == creep.carryCapacity) {
                    creep.say('storing');
                    creep.memory.building = false;
                    creep.memory.harvesting = false;
                }
                
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleBuilder.run(creep);
                creep.moveTo(Game.spawns['Spawn']);
            }
        }
	}
}

module.exports = roleHarvester;