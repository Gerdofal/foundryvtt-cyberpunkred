import {_cprLog} from "./tools.js";

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

    if (data.attributes) {
      for (let [key, attr] of Object.entries(data.attributes)) {
        attr.roll = attr.value + attr.mod;
        //_cprLog("Calculating " + key + ": " + attr.value + "+" + attr.mod + "=" + attr.roll);
      }
    } else {
      _cprLog("Skipping attribute calculations because no attributes detected");
    }

    if (data.skills) {
      for (let [key, attr] of Object.entries(data.skills)) {
        attr.roll = attr.value + attr.mod;
        //_cprLog("Calculating " + key + ": " + attr.value + "+" + attr.mod + "=" + attr.roll);
      }
    } else {
      _cprLog("Skipping skill calculations because no skills detected");
    }

    // TODO - Need to tweak NPC page so this can work for them... maybe?
    if (data.attributes) {
      data.combatstats.healthpool.max = data.attributes.body.roll * 5;
      data.combatstats.luckpool.max = data.attributes.luck.roll;
    } else {
      _cprLog("Skipping health and luck calculatons because no attributes detected");
    }


    if (!data.showInventory) {
      data.itemCombatSetup = false; //If we don't have inventory management, we can't do item combat setup
    }

    //Check wound penalties
    if (data.combatstats.healthpool.value <= (data.combatstats.healthpool.max / 2)) {
      _cprLog("Turning on half dam");
      data.modifiers.modhalfdam.checked = true;
    } else {
      _cprLog("Turning off half dam");
      data.modifiers.modhalfdam.checked = false;
    }

    //Check wound penalties
    if (data.combatstats.healthpool.value <= 0) {
      _cprLog("Turning on full dam");
      data.modifiers.modfulldam.checked = true;
    } else {
      _cprLog("Turning off full dam");
      data.modifiers.modfulldam.checked = false;
    }

    //Compute current damage mod
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