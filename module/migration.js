import {
  _cprLog
} from "./tools.js";

import {
  listsSkills
} from "../lists/skills.js"

import {
  listsSkillsProperties
} from "../lists/skillsproperties.js"


export const checkAndMigrate = async function () {
  _cprLog("Checking for data migration");

  // Migrate World Actors
  for (let a of game.actors.entities) {
    const updateData = migrateActorData(a.data);
    //_cprLog("MIGRATION: UPDATEDATA");
    //console.log(updateData);
    //_cprLog("MIGRATION: ACTOR WAS");
    //console.log(a);
    if (!isObjectEmpty(updateData)) {
      _cprLog(`Migrating Actor entity ${a.name}`);
      await a.update(updateData, {
        enforceTypes: false
      });
    }
    //_cprLog("MIGRATION: ACTOR IS NOW");
    //console.log(a);
  }

  _cprLog("Done checking for data migration");
}; //End checkAndMigrate

export const migrateActorData = function (actor) {
  const updateData = {};
  _updateSkills(actor, updateData);

  return updateData;
}; //End migrateActorData

const _updateSkills = function (actor, updateData) {
  const data = actor.data;
  updateData.data = {};
  updateData.data.skills = {};

  //Compare listsSkills to actor data to make sure all skills exist
  for (let [key, val] of Object.entries(listsSkills)) {

    if (data.skills.hasOwnProperty(key)) {
      //_cprLog("Found " + key);
      updateData.data.skills[key] = data.skills[key];
      for (let [propkey, constval] of Object.entries(listsSkills[key])) {
        //Now check that any constants, as defined in the skillsList, are set properly
        //_cprLog("updateData.data.skills." + key + "." + propkey + " set to constant " + constval);
        updateData.data.skills[key][propkey] = constval;
      }
    } else {
      //_cprLog("Did not find " + key + " creating entry");
      //Create base skill object
      updateData.data.skills[key] = {};
      //Now fill the defauls
      for (let [propkey, defval] of Object.entries(listsSkillsProperties)) {
        //_cprLog("updateData.data.skills." + key + "." + propkey + " added as " + defval);
        updateData.data.skills[key][propkey] = defval;
      }
      for (let [propkey, constval] of Object.entries(listsSkills[key])) {
        //Now check that any constants, as defined in the skillsList, are set properly
        //_cprLog("updateData.data.skills." + key + "." + propkey + " set to constant " + constval);
        updateData.data.skills[key][propkey] = constval;
      }
    }
  }

  //Now compare updateData to listSkills to see if any extra exist

  for (let [key, val] of Object.entries(updateData.data.skills)) {
    if (listsSkills.hasOwnProperty(key)) {
      //_cprLog("Found " + key + " setting show to true");
      updateData.data.skills[key]["show"] = true;
    } else {
      //_cprLog("Found extra " + key + " setting show to false");
      updateData.data.skills[key]["show"] = false;
    }
  }

  //Now do the same to those in data, adding as needed

  for (let [key, val] of Object.entries(data.skills)) {
    if (listsSkills.hasOwnProperty(key)) {
      //_cprLog("Found " + key + " setting show to true");
      if (key in updateData.data.skills) {
        updateData.data.skills[key]["show"] = true;
      } else {
        updateData.data.skills[key] = {};
        updateData.data.skills[key]["show"] = true;
      }

    } else {
      //_cprLog("Found extra " + key + " setting show to false");
      if (key in updateData.data.skills) {
        updateData.data.skills[key]["show"] = false;
      } else {
        updateData.data.skills[key] = {};
        updateData.data.skills[key]["show"] = false;
      }
    }
  }


}
