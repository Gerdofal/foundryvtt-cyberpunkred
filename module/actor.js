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
    _cprLog("Preparing character data for: " + actorData.name);
    const data = actorData.data;

    //TODO - put all these transitions into their own module

    //NOTE: ui.notifications accepts info, warn, and error
    //DEV - Make some updates to data that may need a fix without updating system.json
    if (data.modifiers.modfulldam.penalty != -2) {
      data.modifiers.modfulldam.penalty = -2;
      console.warn(".28 Update - Changing penalty for modfulldam to -2.");
      delete data.roleskills.interface;
    } //Default changed in 0.28
    //DEV - Interim solution for transition to .30
    if (data.roleskills.hasOwnProperty('interface')) {
      data.roleskills.hacking.interface = data.roleskills.interface;
      console.warn(".30 Update - Found old hacking data template and fixed.");
      delete data.roleskills.interface;
    }
    
    //Calculate itemmod values based on inventory
    //Setup modlog
    
    data.modlog = [];
    var itemName="None";
    // Iterate through items, finding modifiers
    for (let i of actorData.items) {
      const itemData = i.data;
      itemName = i.name;
      _cprLog("Now finding itemmods on " + itemName);
      console.log(i.data);
      console.log(Object.entries(itemData.modlist));
      for(let [key,mod] of Object.entries(itemData.modlist)) {
        //data.modlog.push(itemName + ":" + key + ": " + mod.modcat+"-"+mod.moditem+": " + mod.modvalue + " (active:" + mod.modactive + ")");  
        _cprLog(itemName + ":" + key + ": " + mod.modcat+"-"+mod.moditem+": " + mod.modvalue + " (on:" + mod.modactive + ")"); 
        switch(mod.modcat.toLowerCase) {
            //Modcat is the type of mod this is
            //Attribute - Permanently modifies an attribute
            //Skill - Permanently modifies a skill
          case "attribute":
            data.attributes[mod.moditem].itemmod += mod.modvalue * 1;
            break;
            
          case "skill":
            data.skills[mod.moditem].itemmod += mod.modvalue * 1;
            break;
        }
      }
    }
    //Compute all roll values to be equal to value + mod for attributes
    for (let [key, attr] of Object.entries(data.attributes)) {
      attr.roll = attr.value + attr.mod + attr.itemmod;
    }

    //Calculate Cultural Familiarity
    //TODO - Try to figure out if I should include mod in this?
    data.culturalFamiliarity = Math.floor((data.skills.education.value + data.skills.education.mod) / 3);

    //Compute all roll values to be equal to value + mod for skills
    for (let [key, attr] of Object.entries(data.skills)) {
      if (attr.value >= data.culturalFamiliarity) {
        attr.roll = attr.value + attr.mod + attr.itemmod;
      } else {
        attr.roll = data.culturalFamiliarity + attr.mod + attr.itemmod;
      }
    }

    //ROLESKILLS
    //HACKING
    data.roleskills.hacking.interface.roll = data.roleskills.hacking.interface.value + data.roleskills.hacking.interface.mod;
    data.roleskills.hacking.spd.roll = data.roleskills.hacking.spd.value + data.roleskills.hacking.spd.mod;


    //Compute roll attribute for roleskills
    for (let [key, attr] of Object.entries(data.roleskills)) {
      attr.roll = attr.value + attr.mod;
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

    var tempHealthPenalty = 0;
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
    data.modifiers.modfinalmod.healthpenalty = tempHealthPenalty;


    
  } //End Prepare Character Data

  //Various special functions for modifying skills and stats
  
  
  
  //Various Special Functions for Rolls

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
      case "hacking":
        var root = data.roleskills.hacking;
        break;
      default:
        var root = data.skills;
    }

    //Skill Roll Value
    rollArray.push(root[skill].roll);
    tags.push(game.i18n.localize("CPRED." + skill) + ": " + root[skill].value + " + " + root[skill].mod + " = " + root[skill].roll);

    //Attribute Roll Value
    rollArray.push(data.attributes[root[skill].linkedattribute].roll);
    tags.push(game.i18n.localize("CPRED." + root[skill].linkedattribute) + ": " + data.attributes[root[skill].linkedattribute].value + " + " + data.attributes[root[skill].linkedattribute].mod + " = " + data.attributes[root[skill].linkedattribute].roll);

    return {
      rollArray: rollArray,
      tags: tags
    }
  }

  rollHacking(command) {
    var rollArray = new Array();
    var tags = new Array();
    var data = this.data.data;

    switch (command) {
      case 'interfacecheck':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface","hacking");
        rollArray = tempObject.rollArray;
        tags =tempObject.tags;
        break;
      case 'attack':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface","hacking");
        rollArray = tempObject.rollArray;
        tags =tempObject.tags;
        break;
      case 'banhammerattack':
        //TODO: This needs customization in the future
        var tempObject = this.rollSkill("interface","hacking");
        rollArray = tempObject.rollArray;
        tags =tempObject.tags;
        tags.push(game.i18n.localize("CPRED.banhammer") + ": 2" );
        rollArray.push(2);
        break;
      case 'encounterblackice':
        //TODO: Needs details
        var tempObject = this.rollSkill("interface", "hacking");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        tags.push(game.i18n.localize("CPRED.spd") + ": " + data.roleskills.hacking.spd.value + " + " + data.roleskills.hacking.spd.mod + " = " + data.roleskills.hacking.spd.roll);
        rollArray.push(data.roleskills.hacking.spd.roll);
        break;
      case 'encounterblackicewithspeedy':
        //TODO: Needs details
        var tempObject = this.rollSkill("interface", "hacking");
        rollArray = tempObject.rollArray;
        tags = tempObject.tags;
        tags.push(game.i18n.localize("CPRED.spd") + ": " + data.roleskills.hacking.spd.value + " + " + data.roleskills.hacking.spd.mod + " = " + data.roleskills.hacking.spd.roll);
        rollArray.push(data.roleskills.hacking.spd.roll);
        tags.push(game.i18n.localize("CPRED.speedygonzalez") + ": 4" );
        rollArray.push(4);
        break;
      default:
        console.error("Hacking command not recognized in rollHacking: command=" + command);
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
      case '_RollHacking':
        rollObject = this.rollHacking(cmdId);
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
      default:
        rollObject[0] = roll;
        console.error("CyberpunkRED | Incoming roll command not recognized, attempting default.");
    }

    //Everything past here is the same for all rolls.

    
    //Compute the formula
    if(rollObject.rollArray) {
      rollObject.rollFormula = game.settings.get("cyberpunkred", "dieRollCommand");
      rollObject.rollArray.forEach(element => {
        rollObject.rollFormula += " + " + element;
      });      
    }
    
    //Calculate the modifier and return the new roll array and tags
    if(needsMods) {
      rollObject = this.rollMod(rollObject);
    }

    
    //Setup Chat Message
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({
        actor: this.actor
      })
    };

    console.log(rollObject);

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
