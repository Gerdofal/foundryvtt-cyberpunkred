import {
  _cprLog
} from "./tools.js";

import {
  listsSkills
} from "../lists/skills.js"

import {
  listsSkillsProperties
} from "../lists/skillsproperties.js"


/**
 * Perform a system migration for the entire World, applying migrations for Actors, Items, and Compendium packs
 * @return {Promise}      A Promise which resolves once the migration is completed
 */
export const migrateWorld = async function () {

  // Migrate World Actors
  for (let a of game.actors.entities) {
    var lowestOkVersion = 15;
    var needsMigration = false;
    if (a.data.data.backend.upgradedversion < lowestOkVersion || a.data.data.backend.upgradedversion==null) {
      needsMigration = true;
      _cprLog(`Migrating Actor entity ${a.name} because upgradedversion was too low (${a.data.data.backend.upgradedversion})`);
    }

    if (needsMigration) {
      try {
        const updateData = migrateActorData(a.data);
        if (!isObjectEmpty(updateData)) {
          updateData.data.backend.upgradedversion = lowestOkVersion;
          console.log(updateData);
          await a.update(updateData, {
            enforceTypes: false
          });
        }
      } catch (err) {
        _cprLog(err);
      }
    }
  }

  // Migrate World Items
  for (let i of game.items.entities) {
    try {
      const updateData = migrateItemData(i.data);
      if (!isObjectEmpty(updateData)) {
        _cprLog(`Migrating Item entity ${i.name}`);
        await i.update(updateData, {
          enforceTypes: false
        });
      }
    } catch (err) {
      _cprLog(err);
    }
  }

  // Migrate Actor Override Tokens
  for (let s of game.scenes.entities) {
    try {
      const updateData = migrateSceneData(s.data);
      if (!isObjectEmpty(updateData)) {
        _cprLog(`Migrating Scene entity ${s.name}`);
        await s.update(updateData, {
          enforceTypes: false
        });
      }
    } catch (err) {
      _cprLog(err);
    }
  }

  // Migrate World Compendium Packs
  const packs = game.packs.filter(p => {
    return (p.metadata.package === "world") && ["Actor", "Item", "Scene"].includes(p.metadata.entity)
  });
  for (let p of packs) {
    await migrateCompendium(p);
  }

};

/* -------------------------------------------- */

/**
 * Apply migration rules to all Entities within a single Compendium pack
 * @param pack
 * @return {Promise}
 */
export const migrateCompendium = async function (pack) {
  const entity = pack.metadata.entity;
  if (!["Actor", "Item", "Scene"].includes(entity)) return;

  // Begin by requesting server-side data model migration and get the migrated content
  await pack.migrate();
  const content = await pack.getContent();

  // Iterate over compendium entries - applying fine-tuned migration functions
  for (let ent of content) {
    try {
      let updateData = null;
      if (entity === "Item") updateData = migrateItemData(ent.data);
      else if (entity === "Actor") updateData = migrateActorData(ent.data);
      else if (entity === "Scene") updateData = migrateSceneData(ent.data);
      if (!isObjectEmpty(updateData)) {
        expandObject(updateData);
        updateData["_id"] = ent._id;
        await pack.updateEntity(updateData);
        _cprLog(`Migrated ${entity} entity ${ent.name} in Compendium ${pack.collection}`);
      }
    } catch (err) {
      _cprLog(err);
    }
  }
  _cprLog(`Migrated all ${entity} entities from Compendium ${pack.collection}`);
};

/* -------------------------------------------- */
/*  Entity Type Migration Helpers               */
/* -------------------------------------------- */

/**
 * Migrate a single Actor entity to incorporate latest data model changes
 * Return an Object of updateData to be applied
 * @param {Actor} actor   The actor to Update
 * @return {Object}       The updateData to apply
 */
export const migrateActorData = function (actor) {
  const updateData = cleanActorData(actor);

  // Remove deprecated fields
  _migrateRemoveDeprecated(actor, updateData);

  // Migrate Owned Items
  if (!actor.items) return updateData;
  let hasItemUpdates = false;
  const items = actor.items.map(i => {

    // Migrate the Owned Item
    let itemUpdate = migrateItemData(i);

    // Prepared, Equipped, and Proficient for NPC actors
    /*
    if ( actor.type === "npc" ) {
      if (getProperty(i.data, "preparation.prepared") === false) itemUpdate["data.preparation.prepared"] = true;
      if (getProperty(i.data, "equipped") === false) itemUpdate["data.equipped"] = true;
      if (getProperty(i.data, "proficient") === false) itemUpdate["data.proficient"] = true;
    }
    */

    // Update the Owned Item
    if (!isObjectEmpty(itemUpdate)) {
      hasItemUpdates = true;
      return mergeObject(i, itemUpdate, {
        enforceTypes: false,
        inplace: false
      });
    } else return i;
  });
  if (hasItemUpdates) updateData.items = items;
  return updateData;
};

/* -------------------------------------------- */


/**
 * Scrub an Actor's system data, removing all keys which are not explicitly defined in the system template
 * @param {Object} actorData    The data object for an Actor
 * @return {Object}             The scrubbed Actor data
 */
function cleanActorData(actorData) {

  // Load the model
  const model = game.system.model.Actor[actorData.type];
  //Remove anything we do not want
  actorData.data = filterObject(actorData.data, model);

  //Clean anything not in the model
  _cleanOldValues(actorData.data, model);
  //Add anything we now need
  _mergeWithoutOverwrite(actorData.data, model);

  // Return the scrubbed data
  return actorData;
}


/* -------------------------------------------- */

/**
 * Migrate a single Item entity to incorporate latest data model changes
 * @param item
 */
export const migrateItemData = function (item) {
  const updateData = {};

  // Remove deprecated fields
  _migrateRemoveDeprecated(item, updateData);

  // Return the migrated update data
  return updateData;
};

/*
 * Recursively merge properties of two objects 
 */
function _mergeWithoutOverwrite(targetObject, sourceObject) {
  // Do nothing if they're the same object
  if (targetObject === sourceObject) {
    return;
  }
  // Loop through source
  Object.keys(sourceObject).forEach(function (key) {
    // Get the value
    var val = sourceObject[key];

    // Is it a non-null object reference?
    if (val !== null && typeof val === "object") {
      // If it doesn't exist yet on target, create it
      if (!targetObject.hasOwnProperty(key)) {
        _cprLog("Creating " + key + " as it exists in the model but not the actor");
        targetObject[key] = {};
      }
      // Recurse into that object
      _mergeWithoutOverwrite(targetObject[key], sourceObject[key]);


    } else if (!targetObject.hasOwnProperty(key)) {
      // Not a non-null object ref, copy if target doesn't have it
      // Use JSON.stringify to remove any reference
      _cprLog("Creating " + key + " as it exists in the model but not the actor");
      targetObject[key] = JSON.parse(JSON.stringify(sourceObject[key]));
    }
  });
}

/*
 * Clean old values in target that no longer exist in source
 */
function _cleanOldValues(targetObject, sourceObject) {
  // Do nothing if they're the same object
  if (targetObject === sourceObject) {
    return;
  }
  // Loop through source
  Object.keys(targetObject).forEach(function (key) {
    // Get the value
    var val = targetObject[key];

    // Is it a non-null object reference?
    if (val !== null && typeof val === "object") {

      if (!sourceObject.hasOwnProperty(key)) {
        delete targetObject[key];
        _cprLog("Removing " + key + " as it no longer exists in the model");
      } else {
        // Recurse into that object
        _cleanOldValues(targetObject[key], sourceObject[key]);
      }

    } else if (!targetObject.hasOwnProperty(key)) {
      // Not a non-null object ref, copy if target doesn't have it
      // Delete it now if not in the souce
      if (!sourceObject.hasOwnProperty(key)) {
        delete targetObject[key];
        _cprLog("Removing " + key + " as it no longer exists in the model");
      }
    }
  });
}


/* -------------------------------------------- */

/**
 * Migrate a single Scene entity to incorporate changes to the data model of it's actor data overrides
 * Return an Object of updateData to be applied
 * @param {Object} scene  The Scene data to Update
 * @return {Object}       The updateData to apply
 */
export const migrateSceneData = function (scene) {
  const tokens = duplicate(scene.tokens);
  return {
    tokens: tokens.map(t => {
      if (!t.actorId || t.actorLink || !t.actorData.data) {
        t.actorData = {};
        return t;
      }
      const token = new Token(t);
      if (!token.actor) {
        t.actorId = null;
        t.actorData = {};
      } else if (!t.actorLink) {
        const updateData = migrateActorData(token.data.actorData);
        t.actorData = mergeObject(token.data.actorData, updateData);
      }
      return t;
    })
  };
};

/* -------------------------------------------- */
/*  Low level migration utilities
/* -------------------------------------------- */


/**
 * A general migration to remove all fields from the data model which are flagged with a _deprecated tag
 * @private
 */
const _migrateRemoveDeprecated = function (ent, updateData) {
  const flat = flattenObject(ent.data);

  // Identify objects to deprecate
  const toDeprecate = Object.entries(flat).filter(e => e[0].endsWith("_deprecated") && (e[1] === true)).map(e => {
    let parent = e[0].split(".");
    parent.pop();
    return parent.join(".");
  });

  // Remove them
  for (let k of toDeprecate) {
    let parts = k.split(".");
    parts[parts.length - 1] = "-=" + parts[parts.length - 1];
    updateData[`data.${parts.join(".")}`] = null;
  }
};
