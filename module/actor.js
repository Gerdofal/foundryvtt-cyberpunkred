import {
  _cprLog
} from "./tools.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class cyberpunkredActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;

    //All sheets need setup variables
    data.dieRollCommand = game.settings.get("cyberpunkred", "dieRollCommand");
    data.simpleCombatSetup = game.settings.get("cyberpunkred", "simpleCombatSetup");
    data.GMAlwaysWhisper = game.settings.get("cyberpunkred", "GMAlwaysWhisper");
    data.itemCombatSetup = game.settings.get("cyberpunkred", "itemCombatSetup");
    data.showInventory = game.settings.get("cyberpunkred", "showInventory");
    if (!data.showInventory) {
      data.itemCombatSetup = false; //If we don't have inventory management, we can't do item combat setup
    }

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.data;
    _cprLog("Preparing character data");

    //DEV - Make some updates to data that may need a fix without updating system.json
    data.modifiers.modfulldam.penalty = -2; //Changed in 0.28

    //Compute all roll values to be equal to value + mod for attributes
    for (let [key, attr] of Object.entries(data.attributes)) {
      attr.roll = attr.value + attr.mod;
    }
    
    //Calculate Cultural Familiarity
    //TODO - Try to figure out if I should include mod in this?
    data.culturalFamiliarity = Math.floor((data.skills.education.value + data.skills.education.mod)/3);
    _cprLog("CF is " + data.culturalFamiliarity);
    //Compute all roll values to be equal to value + mod for skills
    for (let [key, attr] of Object.entries(data.skills)) {
      if (attr.value >= data.culturalFamiliarity) {
          attr.roll = attr.value + attr.mod;
      } else {
        attr.roll = data.culturalFamiliarity + attr.mod;
      }
    }
    
    

    //TODO - Need to add a field to edit init.mod
    data.combatstats.init.roll = data.attributes.ref.roll + data.combatstats.init.mod;

    // Calculate health and luck
    data.combatstats.healthpool.max = data.attributes.body.roll * 5;
    if (data.combatstats.healthpool.value > data.combatstats.healthpool.max) {
      data.combatstats.healthpool.value = data.combatstats.healthpool.max;
    }
    data.combatstats.luckpool.max = data.attributes.luck.roll;
    if (data.combatstats.luckpool.value > data.combatstats.luckpool.max) {
      data.combatstats.luckpool.value = data.combatstats.luckpool.max;
    }

    //Check wound penalties for half damage
    if (data.combatstats.healthpool.value < (data.combatstats.healthpool.max / 2)) {
      _cprLog("Turning on half dam");
      data.modifiers.modhalfdam.checked = true;
    } else {
      _cprLog("Turning off half dam");
      data.modifiers.modhalfdam.checked = false;
    }


    //Check wound penalties for zero health
    if (data.combatstats.healthpool.value <= 0) {
      _cprLog("Turning on full dam");
      data.modifiers.modfulldam.checked = true;
    } else {
      _cprLog("Turning off full dam");
      data.modifiers.modfulldam.checked = false;
    }

    //Compute current total damage mod
    var tempmod = 0;
    for (let [key, attr] of Object.entries(data.modifiers)) {
      if (attr.hasOwnProperty("checked")) {
        if (attr.checked) {
          tempmod += attr.penalty;
        }
      }
    }
    tempmod += data.modifiers.modmanualmod.penalty;
    data.modifiers.modfinalmod.totalpenalty = tempmod;
    
    

  }

}
