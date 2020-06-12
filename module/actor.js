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
    console.log(actorData);
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


    //Compute all roll values to be equal to value + mod for attributes
    for (let [key, attr] of Object.entries(data.attributes)) {
      attr.roll = attr.value + attr.mod;
    }

    //Calculate Cultural Familiarity
    //TODO - Try to figure out if I should include mod in this?
    data.culturalFamiliarity = Math.floor((data.skills.education.value + data.skills.education.mod) / 3);

    //Compute all roll values to be equal to value + mod for skills
    for (let [key, attr] of Object.entries(data.skills)) {
      if (attr.value >= data.culturalFamiliarity) {
        attr.roll = attr.value + attr.mod;
      } else {
        attr.roll = data.culturalFamiliarity + attr.mod;
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

    //Check wound penalties for half damage
    if (data.combatstats.healthpool.value < (data.combatstats.healthpool.max / 2)) {
      data.modifiers.modhalfdam.checked = true;
    } else {
      data.modifiers.modhalfdam.checked = false;
    }

    //Check wound penalties for zero health
    if (data.combatstats.healthpool.value <= 0) {
      //_cprLog("Turning on full dam");
      data.modifiers.modfulldam.checked = true;
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

  } //End Prepare Character Data

  
  //Various Special Functions for Rolls
  
  rollSkill(skill) {
    var outStr = game.settings.get("cyberpunkred", "dieRollCommand");
    var arr = new Array();
    var tags = new Array();
    var data = this.data.data;
    console.log(data);
    //Skill Roll Value
    arr.push(data.skills[skill].roll);
    tags.push(game.i18n.localize("CPRED." + skill) + ": " + data.skills[skill].value + " + " + data.skills[skill].mod + " = " + data.skills[skill].roll);
    
    //Attribute Roll Value
    arr.push(data.attributes[data.skills[skill].linkedattribute].roll);
    tags.push(game.i18n.localize("CPRED." + data.skills[skill].linkedattribute) + ": " + data.attributes[data.skills[skill].linkedattribute].value + " + " + data.attributes[data.skills[skill].linkedattribute].mod + " = " + data.attributes[data.skills[skill].linkedattribute].roll);
    
    //Roll Mod
    arr.push(data.modifiers.modfinalmod.totalpenalty);
    
    //Compute current total damage mod
    for (let [key, attr] of Object.entries(data.modifiers)) {
      if (attr.hasOwnProperty("checked")) {
        if (attr.checked) {
          tags.push(game.i18n.localize("CPRED." + key) + ": " + attr.penalty);
        }
      }
    }
    
    arr.forEach(element => {
      outStr += " + " + element;
    });
    var retArray = [outStr,tags];
    console.debug(retArray);
    return (retArray);  
  }
  
  async rollCPR(roll, actorData, templateData = null) {
    _cprLog("rollCPR - Rendering roll using template");
    /*
    _cprLog("roll");
    console.log(roll);
    _cprLog("actorData");
    console.log(actorData);
    _cprLog("templateData");
    console.log(templateData);
    */
    //Setup critical variables
    let template = 'systems/cyberpunkred/templates/chat/roll-cpr.html';
    let formula = '';
    const data = actorData.data;

    //Here we capture any normal roll string
    //this is not desirable as we want to print details
    if (roll.match(/(\d*)d\d+/g)) {
      formula = roll;
      console.warn("CyberpunkRED | Incoming roll did not match expected format introduced in version .30. Rendering using default method.");
    } else {
      //Expects a command like "_RollSkill marksmanship"
      var cmdArray = roll.split(" "); //Split the incoming command into an array
      var cmdCmd = cmdArray[0]; //ex _RollSkill
      var cmdId = cmdArray[1]; //ex marksmanship
      var retArray = [];
      //Expected Return:
      //retArray[0] will have the formula as a string
      //retArray[1] will have an array additional tags
      switch(cmdCmd) {
        case '_RollSkill':
          retArray=this.rollSkill(cmdId);
          break;
        case '_RollInitiative':
          retArray=this.actor.rollInitiative();
          break;
        case '_RollHacking':
          retArray=this.actor.rollHacking(command);
          break;
        case '_RollManualFormula':
          retArray[0] = roll;
          break;
        default:
          retArray[0] = roll;
          console.error("CyberpunkRED | Incoming roll command not recognized, attempting default.");
      }
      formula=retArray[0];
      var tempTags = templateData.tags;
      templateData.tags = tempTags.concat(retArray[1]);
    }

    
    //Everything past here is the same for all rolls.
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({
        actor: this.actor
      })
    };

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
