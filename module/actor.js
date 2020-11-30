import {
  _cprLog
} from "./tools.js";

import {
  listsModifiers
} from "../lists/modifiers.js"

import {
  listsSkills
} from "../lists/skills.js"

import {
  environmentSettings
} from "../environment.js"

import {
  itemmodJSK,
  itemmodCore
} from "../lists/itemmods.js"


/**
 * Reconfiguration of the base actor to work for CyberpunkRED
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

    //######################
    //
    //Determine Settings
    //
    //######################

    data.dieRollCommand = game.settings.get("cyberpunkred", "dieRollCommand");
    data.GMAlwaysWhisper = game.settings.get("cyberpunkred", "GMAlwaysWhisper");

    if (!data.settings.prefs.showInventory) {
      data.settings.prefs.itemCombatSetup = false; //If we don't have inventory management, we can't do item combat setup
    }

    // TODO: Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    //if (actorData.type === 'character') 

    // CURRENTLY: This option always calls preparedata for all types of actors
    // Note: npcs have all the stats and everything that actors do, but not all of them show on the sheet, nor are they editable

    this._prepareCharacterData(actorData);

    //After a migration, preparedata sometimes fails to run as expected. This variable will track that.
    _cprLog("Data prep is complete for " + this.name);
    this.data.data.backend.dataprepcomplete = true;
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    _cprLog("Loading _prepareCharacterData in actor.js for " + actorData.name);
    const data = actorData.data;

    //Generally helpful variables
    var x = 0; //Our for loop counter

    //######################
    //
    //Determine Game System
    //
    //######################

    var allowJSK = false;
    var allowCore = false;
    var settingGameSystem = "core";

    settingGameSystem = game.settings.get("cyberpunkred", "gameSystem");
    data.gameSystem = game.settings.get("cyberpunkred", "gameSystem");
    switch (settingGameSystem) {
      case "core":
        _cprLog("Game is running in Core Rulebook mode.")
        allowJSK = false;
        allowCore = true;
        data.backend.core = true;
        data.backend.jsk = false;
        break;
      case "jsk":
        _cprLog("Game is running in Jumpstart Kit mode.")
        allowJSK = true;
        allowCore = false;
        data.backend.core = false;
        data.backend.jsk = true;
        break;
      default:
        _cprLog("ERROR: Game setting not found for environment. Setting default to core.")
        allowJSK = false;
        allowCore = true;
        data.backend.core = true;
        data.backend.jsk = false;
    }


    //####################
    //
    //Temporary Migrations
    //
    //####################
    //TODO - put all these migrations into their own module


    if (data.settings.showtabs.hasOwnProperty('hacking')) {
      _cprLog(".41 Update - Found old hacking showtab and deleted.");
      delete data.settings.showtabs.hacking;
    }


    //######################
    //
    //Load Skill Constants
    //
    //######################

    for (let [key, val] of Object.entries(listsSkills)) {
      //For each skill in the list, add constants to the data model
      if (data.skills.hasOwnProperty(key)) {
        for (let [propkey, constval] of Object.entries(listsSkills[key])) {
          data.skills[key][propkey] = constval;
        }
      }
    }

    //######################
    //
    //Cleanup non-numeric entries
    //
    //######################

    for (let [key, val] of Object.entries(data.skills)) {
      for (let [innerkey, innerval] of Object.entries(data.skills[key])) {
        if (!isNaN(data.skills[key][innerkey])) {
          data.skills[key][innerkey] = Number(data.skills[key][innerkey]);
        }
      }
    }

    for (let [key, val] of Object.entries(data.attributes)) {
      for (let [innerkey, innerval] of Object.entries(data.attributes[key])) {
        if (!isNaN(data.attributes[key][innerkey])) {
          data.attributes[key][innerkey] = Number(data.attributes[key][innerkey]);
        }
      }
    }

    for (let [key, val] of Object.entries(data.combatstats)) {
      for (let [innerkey, innerval] of Object.entries(data.combatstats[key])) {
        if (!isNaN(data.combatstats[key][innerkey])) {
          data.combatstats[key][innerkey] = Number(data.combatstats[key][innerkey]);
        }
      }
    }

    //######################
    //
    //Humanity Array
    //
    //
    //######################

    data.backend.humanityTotal = 0;
    data.backend.humanityPositive = 0;
    data.backend.humanityNegative = 0;
    var tempNum = 0;
    data.humanityarray.forEach(function (arr) {
      tempNum = Number(arr[0]);
      _cprLog("Humanity Change " + tempNum);
      data.backend.humanityTotal += tempNum;
      if (tempNum > 0) {
        data.backend.humanityPositive += tempNum;
      }
      if (tempNum < 0) {
        data.backend.humanityNegative += tempNum;
      }
    });

    _cprLog("Humanity Total " + data.backend.humanityTotal);
    _cprLog("Humanity Positive " + data.backend.humanityPositive);
    _cprLog("Humanity Negative " + data.backend.humanityNegative);
    //Computer humanity TODO-guessing at formula may need to fix this for final rule release
    data.combatstats.humanity.itemmod = 0;
    data.combatstats.humanity.current = 0;

    //######################
    //
    //Show or hide skills based on environment
    //(Note they are hidden, not deleted.)
    //
    //Also sets skill categories
    //
    //######################

    data.backend.skillcategories = {};
    for (let [key, val] of Object.entries(data.skills)) {
      if (allowJSK && data.skills[key]["jsk"]) {
        data.skills[key]["show"] = true;
        data.backend.skillcategories[val.category] = true;
        //_cprLog(key + " set to SHOW");
      } else if (allowCore && data.skills[key]["core"]) {
        data.skills[key]["show"] = true;
        data.backend.skillcategories[val.category] = true;
        //_cprLog(key + " set to SHOW");
      } else {
        data.skills[key]["show"] = false;
        //_cprLog(key + " set to HIDE");
      }
    }

    //####################
    //
    //Sorting
    //
    //####################

    //Sort the skills and attributes

    let sortAttributesBy = 'sort';
    let sortSkillsBy = 'sort';

    let compareAttributes = (k, kk) => +(data.attributes[k][sortAttributesBy] > data.attributes[kk][sortAttributesBy]) || -(data.attributes[kk][sortAttributesBy] > data.attributes[k][sortAttributesBy]);
    let sortedAttributes = Object.keys(data.attributes).sort(compareAttributes).reduce((a, d) => ({
      ...a,
      ...{
        [d]: data.attributes[d]
      }
    }), {});
    data.attributes = sortedAttributes;

    let compareSkills = (k, kk) => +(data.skills[k][sortSkillsBy] > data.skills[kk][sortSkillsBy]) || -(data.skills[kk][sortSkillsBy] > data.skills[k][sortSkillsBy]);
    let sortedSkills = Object.keys(data.skills).sort(compareSkills).reduce((a, d) => ({
      ...a,
      ...{
        [d]: data.skills[d]
      }
    }), {});
    data.skills = sortedSkills;


    //####################
    //
    //Parse Inventory Items
    //
    //####################

    //Calculate itemmod values based on inventory
    //Setup modlog
    data.modlog = [];

    //All itemmod values must start at 0 because we have to add mods to them
    //Attributes
    for (let [key, attr] of Object.entries(data.attributes)) {
      attr.itemmod = 0;
    }
    //Items
    for (let [key, attr] of Object.entries(data.skills)) {
      attr.itemmod = 0;
    }

    var itemName = "None";
    var totalPsychosis = 0;
    // Iterate through items, finding modifiers
    for (let i of actorData.items) {
      const itemData = i.data;
      itemName = i.name;

      //Count psychosis
      if (itemData.hasOwnProperty('psychosis')) {
        totalPsychosis += (itemData.psychosis.value) * 1;
      }


      //_cprLog("Now finding itemmods on " + itemName);
      for (let [key, mod] of Object.entries(itemData.modlist)) {
        //data.modlog.push(itemName + ":" + key + ": " + mod.modcat+"-"+mod.moditem+": " + mod.modvalue + " (active:" + mod.modactive + ")");  
        //_cprLog(itemName + ":" + key + ": " + mod.modcat + "-" + mod.moditem + ": " + mod.modvalue + " (on:" + mod.modactive + ")");
        if (key.substr(0, 3) == "mod" && mod.modcat.toLowerCase != "none" && mod.moditem.toLowerCase != "none" && (mod.modvalue * 1) != 0) {
          switch (mod.modcat.toLowerCase()) {
            //Modcat is the type of mod this is
            //Attributes - Permanently modifies an attribute
            //Skills - Permanently modifies a skill
            case "attributes":
              try {
                //_cprLog("ITEMMOD: Attribute " + mod.moditem + " + " + mod.modvalue * 1);
                data.modlog.push(itemName + ":" + key + ": " + mod.modcat + "-" + mod.moditem + ": " + mod.modvalue + " (on:" + mod.modactive + ")");
                data.attributes[mod.moditem].itemmod += mod.modvalue * 1;
              } catch (err) {
                _cprLog("Tried to do an itemmod but it isn't properly formatted. Maybe in the middle of setting it up.");
              }
              break;

            case "skills":
              try {
                //_cprLog("ITEMMOD: Skill " + mod.moditem + " + " + mod.modvalue * 1);
                data.modlog.push(itemName + ":" + key + ": " + mod.modcat + "-" + mod.moditem + ": " + mod.modvalue + " (on:" + mod.modactive + ")");
                data.skills[mod.moditem].itemmod += mod.modvalue * 1;
              } catch (err) {
                _cprLog("Tried to do an itemmod but it isn't properly formatted. Maybe in the middle of setting it up.");
              }
              break;

            case "combatstats":
              try {
                //_cprLog("ITEMMOD: Combatstats " + mod.moditem + " + " + mod.modvalue * 1);
                data.modlog.push(itemName + ":" + key + ": " + mod.modcat + "-" + mod.moditem + ": " + mod.modvalue + " (on:" + mod.modactive + ")");
                data.combatstats[mod.moditem].itemmod += mod.modvalue * 1;
              } catch (err) {
                _cprLog("Tried to do an itemmod but it isn't properly formatted. Maybe in the middle of setting it up.");
              }
              break;

            default:
              _cprLog("WARNING: Badly formed mod command (not processed): " + mod.moditem + " + " + mod.modvalue * 1);
          }
        }
      }
    }


    //####################
    //
    //Attribute Roll Values
    //
    //####################
    //Compute all roll values to be equal to value + mod for attributes
    for (let [key, attr] of Object.entries(data.attributes)) {
      attr.roll = ((attr.value * 1) + (attr.mod * 1) + (attr.itemmod * 1)) * 1;
    }

    //####################
    //
    //Skill Roll Values
    //
    //####################


    //Calculate Cultural Familiarity
    //TODO - Try to figure out if I should include mod in this?
    
    if(allowJSK) {
      data.culturalFamiliarity = Math.floor((data.skills.education.value + data.skills.education.mod) / 3);
    } else {
      data.culturalFamiliarity = 0;
    }

    //Compute all roll values to be equal to value + mod for skills
    for (let [key, attr] of Object.entries(data.skills)) {
      if (attr.value >= data.culturalFamiliarity) {
        attr.roll = ((attr.value * 1) + (attr.mod * 1) + (attr.itemmod * 1)) * 1;
        attr.totalpool = attr.roll + data.attributes[attr.linkedattribute].roll;
      } else {
        attr.roll = data.culturalFamiliarity + attr.mod + attr.itemmod;
      }
    }


    //####################
    //
    //Armor
    //
    //####################
    //TODO: armor should be an inventory item too

    //Calculate armor

    data.armorsetup.armorhead.remain = Number(data.armorsetup.armorhead.value) - Number(data.armorsetup.armorhead.degrade);
    data.armorsetup.armorbody.remain = Number(data.armorsetup.armorbody.value) - Number(data.armorsetup.armorbody.degrade);
    data.armorsetup.armorshield.remain = Number(data.armorsetup.armorshield.value) - Number(data.armorsetup.armorshield.degrade);

    //####################
    //
    //Roleskills
    //
    //####################

    //NETRUNNER
    data.roleskills.netrunner.interface.roll = Number(data.roleskills.netrunner.interface.value) + Number(data.roleskills.netrunner.interface.mod) + Number(data.roleskills.netrunner.interface.itemmod);
    data.roleskills.netrunner.spd.roll = Number(data.roleskills.netrunner.spd.value) + Number(data.roleskills.netrunner.spd.mod) + Number(data.roleskills.netrunner.spd.itemmod);


    //####################
    //
    //Initiative
    //
    //####################

    data.combatstats.init.value = (data.attributes.ref.roll * 1) + (data.combatstats.init.mod * 1);

    //####################
    //
    //Base Pools
    //
    //####################

    // Calculate health and luck
    if (allowJSK) {
      data.combatstats.healthpool.max = data.attributes.body.roll * 5;
    } else {
      data.combatstats.healthpool.max = 10 + (5 * Math.ceil((data.attributes.body.roll + data.attributes.will.roll) / 2));
    }

    if (data.combatstats.healthpool.value > data.combatstats.healthpool.max) {
      data.combatstats.healthpool.value = data.combatstats.healthpool.max;
    }


    data.combatstats.luckpool.max = data.attributes.luck.roll;
    if (data.combatstats.luckpool.value > data.combatstats.luckpool.max) {
      data.combatstats.luckpool.value = data.combatstats.luckpool.max;
    }

    //Now need to set roll for combatstats
    //Some of these may be trouble. Not sure on rules for going over max yet.

    for (let [key, attr] of Object.entries(data.combatstats)) {
      if (key == "init") {
        attr.roll = ((attr.value * 1) + (attr.mod * 1) + (attr.itemmod * 1)) * 1;
      }
    }

    //####################
    //
    //Roll Penalty
    //
    //####################
    
    //Adjust template stored modifiers to match list
    
    for (let [key, attr] of Object.entries(listsModifiers)) {
      if (data.modifiers.hasOwnProperty(key)) {
        data.modifiers[key].penalty = attr.penalty;
      }
    }
    
      var tempHealthPenalty = 0;
    if (data.settings.prefs.automateDamageMod) {
      //Players can turn off this automation

      //Check wound penalties for half damage
      if (data.combatstats.healthpool.value < (data.combatstats.healthpool.max / 2)) {
        data.modifiers.modhalfdam.checked = true;
        tempHealthPenalty += data.modifiers.modhalfdam.penalty;
      } else {
        data.modifiers.modhalfdam.checked = false;
      }

      //Check wound penalties for zero health
      if (data.combatstats.healthpool.value <= 0) {
        //_cprLog("Turning on full dam");
        data.modifiers.modfulldam.checked = true;
        tempHealthPenalty += data.modifiers.modfulldam.penalty;
      } else {
        //_cprLog("Turning off full dam");
        data.modifiers.modfulldam.checked = false;
      }

    } else {
      //If the automation is off, we still need to set tempHealthPenalty based on what is clicked
      if(data.modifiers.modhalfdam.checked) {
        //Half damage is clicked
        tempHealthPenalty += data.modifiers.modhalfdam.penalty;
      } 
      
      if(data.modifiers.modfulldam.checked) {
        //Full damage is clicked
        tempHealthPenalty += data.modifiers.modfulldam.penalty;
      } 
    }

    //Compute current total mod
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
    data.modifiers.modfinalmod.healthpenalty = tempHealthPenalty;

  } //End Prepare Character Data

  //Various Special Functions for Rolls.
  //Change with extreme care!

  rollMod(rollObject) {
    //Compute current total mod
    var data = this.data.data;
    rollObject.rollFormula = rollObject.rollFormula + " + " + data.modifiers.modfinalmod.totalpenalty;
    rollObject.tags.push("<hr>");
    rollObject.tags.push("Total Penalty: " + data.modifiers.modfinalmod.totalpenalty + "<hr>");
    for (let [key, attr] of Object.entries(data.modifiers)) {
      if (attr.hasOwnProperty("checked")) {
        if (attr.checked) {
          rollObject.tags.push(game.i18n.localize("CPRED." + key) + ": " + attr.penalty);
        }
      }
    }
    return rollObject;
  }

  rollSkill(skill, rootstr = "skills") {
    var rollArray = new Array();
    var tags = new Array();
    var data = this.data.data;

    //rootstr identifies the root skill location to be used
    switch (rootstr) {
      case "netrunner":
        var root = data.roleskills.netrunner;
        //Skill Roll Value
        rollArray.push(root[skill].roll);
        tags.push(game.i18n.localize("CPRED." + skill) + ": " + root[skill].value + " + " + root[skill].mod + " + " + root[skill].itemmod + " = " + root[skill].roll);

        if (data.backend.jsk) {
          //Attribute Roll Value
          rollArray.push(data.attributes[root[skill].linkedattribute].roll);
          tags.push(game.i18n.localize("CPRED." + root[skill].linkedattribute) + ": " + data.attributes[root[skill].linkedattribute].value + " + " + data.attributes[root[skill].linkedattribute].mod + " + " + data.attributes[root[skill].linkedattribute].itemmod + " = " + data.attributes[root[skill].linkedattribute].roll);
        }

        break;
      default:
        var root = data.skills;
        //Skill Roll Value
        rollArray.push(root[skill].roll);
        tags.push(game.i18n.localize("CPRED." + skill) + ": " + root[skill].value + " + " + root[skill].mod + " + " + root[skill].itemmod + " = " + root[skill].roll);

        //Attribute Roll Value
        rollArray.push(data.attributes[root[skill].linkedattribute].roll);
        tags.push(game.i18n.localize("CPRED." + root[skill].linkedattribute) + ": " + data.attributes[root[skill].linkedattribute].value + " + " + data.attributes[root[skill].linkedattribute].mod + " + " + data.attributes[root[skill].linkedattribute].itemmod + " = " + data.attributes[root[skill].linkedattribute].roll);
    }


    return {
      rollArray: rollArray,
      tags: tags
    }
  }

  rollNPC(command) {
    var rollArray = new Array();
    var tags = new Array();

    rollArray.push(command * 1);
    tags.push("NPC Value: " + command);

    return {
      rollArray: rollArray,
      tags: tags
    }
  }

  rollNetrunner(command) {
    var rollArray = new Array();
    var tags = new Array();
    var data = this.data.data;

    switch (command) {
      case 'interfacecheck':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface", "netrunner");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        break;
      case 'attack':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface", "netrunner");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        break;
      case 'banhammerattack':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface", "netrunner");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        tags.push(game.i18n.localize("CPRED.banhammer") + ": 2");
        rollArray.push(2);
        break;
      case 'encounterblackice':
        //TODO: Needs details
        var tempObject = this.rollSkill("interface", "netrunner");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        tags.push(game.i18n.localize("CPRED.spd") + ": " + data.roleskills.netrunner.spd.value + " + " + data.roleskills.netrunner.spd.mod + " = " + data.roleskills.netrunner.spd.roll);
        rollArray.push(data.roleskills.netrunner.spd.roll);
        break;
      case 'encounterblackicewithspeedy':
        //TODO: Needs details
        var tempObject = this.rollSkill("interface", "netrunner");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        tags.push(game.i18n.localize("CPRED.spd") + ": " + data.roleskills.netrunner.spd.value + " + " + data.roleskills.netrunner.spd.mod + " = " + data.roleskills.netrunner.spd.roll);
        rollArray.push(data.roleskills.netrunner.spd.roll);
        tags.push(game.i18n.localize("CPRED.speedygonzalez") + ": 4");
        rollArray.push(4);
        break;
      default:
        _cprLog("Netrunner command not recognized in rollNetrunner: command=" + command);
    }

    return {
      rollArray: rollArray,
      tags: tags
    }
  }

  rollInitiative() {
    var arr = new Array();
    var tags = new Array();
    var data = this.data.data;
    var outStr = Combat.prototype._getInitiativeFormula(data);
    tags.push(game.i18n.localize("CPRED.initiativerolldetail"));
    var retArray = [outStr, tags];
    return {
      rollFormula: outStr,
      tags: tags
    }
  }

  checkCritInjury(roll) {
    let sixes = 0;
    let results = roll.dice[0].results;
    for (var i = 0; i < results.length; i++) {
      if (results[i]["result"] === 6) {
        sixes++;
      }
    }
    return sixes >= 2;
  }

  checkCritFail(roll) {
    return roll.dice[0].results[0]["result"] === 1;
  }

  checkCritSuccess(roll) {
    return roll.dice[0].results[0]["result"] === 10;
  }

  async rollCPR(roll, actorData, templateData = null) {
    _cprLog("rollCPR - Computing Roll");

    //Setup critical variables
    let template = 'systems/cyberpunkred/templates/chat/roll-cpr.html';

    const data = actorData.data;

    //Expects a command like "_RollSkill marksmanship"
    var cmdArray = roll.split(" "); //Split the incoming command into an array
    var cmdCmd = cmdArray[0]; //ex _RollSkill
    var cmdId = cmdArray[1]; //ex marksmanship
    var needsMods = true;
    var rollObject = {};
    //Expected Return:
    //retArray[0] will have an array of each forula element
    //retArray[1] will have an array additional tags
    switch (cmdCmd) {
      case '_RollSkill':
        rollObject = this.rollSkill(cmdId);
        break;
      case '_RollInitiative':
        rollObject = this.rollInitiative();
        needsMods = false;
        break;
      case '_RollNetrunner':
        rollObject = this.rollNetrunner(cmdId);
        break;
      case '_RollWithMods':
        rollObject.rollFormula = roll.replace('_RollWithMods', '');
        rollObject.tags = new Array();
        rollObject.tags.push("Manual Formula");
        break;
      case '_RollWithoutMods':
        rollObject.rollFormula = roll.replace('_RollWithoutMods', '');
        rollObject.tags = new Array();
        rollObject.tags.push("Manual Formula");
        needsMods = false;
        break;
      case '_RollDamage':
        rollObject.rollFormula = roll.replace('_RollDamage', '');
        rollObject.tags = new Array();
        rollObject.tags.push("Damage Formula");
        needsMods = false;
        break;
      case '_RollNPC':
        rollObject = this.rollNPC(cmdId);
        needsMods = false;
        break;
      default:
        rollObject[0] = roll;
        _cprLog("Incoming roll command not recognized, attempting default.");
    }

    //Everything past here is the same for all rolls.
    _cprLog("Incoming Roll: " + cmdCmd + " : " + cmdId);

    //Compute the formula
    if (rollObject.rollArray) {
      rollObject.rollFormula = game.settings.get("cyberpunkred", "dieRollCommand");
      rollObject.rollArray.forEach(element => {
        rollObject.rollFormula += " + " + element;
      });
    }

    //Calculate the modifier and return the new roll array and tags
    if (needsMods) {
      rollObject = this.rollMod(rollObject);
    }


    //Setup Chat Message
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({
        actor: this.actor
      })
    };

    //Setup the output tags
    var tempTags = templateData.tags;
    templateData.tags = tempTags.concat(rollObject.tags);

    //Setup the output formula
    var formula = rollObject.rollFormula;

    //Config option from CPR Settings
    if (game.settings.get("cyberpunkred", "GMAlwaysWhisper") && actorData.type == "npc") {
      chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");
      templateData.tags.push("NPC Rolls always GM Only");
      _cprLog("NPC Rolls Always Whisper");
    } else {
      let rollMode = game.settings.get("core", "rollMode");

      if (["gmroll", "blindroll"].includes(rollMode)) {
        chatData["whisper"] = ChatMessage.getWhisperRecipients("GM");
        templateData.tags.push("Sent to GM");
      }

      if (rollMode === "selfroll") {
        templateData.tags.push("Whispered to " + game.user.name);
        chatData["whisper"] = [game.user._id];
      }

      if (rollMode === "blindroll") {
        chatData["blind"] = true;
        templateData.tags.push("Sent blindly to GM");
      }
    }

    if (formula != null) {
      _cprLog("rollCPR - Rendering roll using template")
      // Do the roll.
      let roll = new Roll(`${formula}`);
      roll.roll();
      if (cmdCmd != "_RollDamage") {
        // Don't check for critical success/failure on damage rolls
        if (this.checkCritFail(roll)) {
          templateData["critfail"] = "Critical Failure!";
        } else if (this.checkCritSuccess(roll)) {
          templateData["critsuccess"] = "Critical Success!";
        }
      }
      if (cmdCmd === "_RollDamage" && this.checkCritInjury(roll)) {
          templateData["critinjury"] = "Critical Injury!";
      }
      // Render it.
      roll.render().then(r => {
        templateData.rollcpr = r;
        renderTemplate(template, templateData).then(content => {
          chatData.content = content;
          if (game.dice3d) {
            game.dice3d.showForRoll(roll, chatData.whisper, chatData.blind).then(displayed => ChatMessage.create(chatData));
          } else {
            chatData.sound = CONFIG.sounds.dice;
            ChatMessage.create(chatData);
          }
        });
      }); //End Roll Render
    } // End if formula != null
  } // End rollCPR
} // End extension of actor
