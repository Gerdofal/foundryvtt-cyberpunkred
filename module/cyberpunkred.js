// Import Modules
import {
  _cprLog
} from "./tools.js";
import {
  cyberpunkredActor
} from "./actor.js";
import {
  cyberpunkredActorSheet
} from "./actor-sheet.js";
import {
  cyberpunkredItem
} from "./item.js";
import {
  cyberpunkredItemSheet
} from "./item-sheet.js";
import {
  cyberpunkredDie
} from "./die.js";
/* Removed in 0.43
import {
  combinedCPREDDieHandler
} from "./die-handler.js"
*/
import {
  registerSystemSettings
} from "./settings.js";
import {
  _getInitiativeFormula
} from "./combat.js";
import {
  migrateWorld
} from "./migration.js";

import {
  environmentSettings
} from "../environment.js";

import * as macros from "./macros.js";


Hooks.once('init', async function () {

  _cprLog(`Initializing CyberpunkRED System`);

  // Register System Settings
  _cprLog(`Register System Settings`);
  registerSystemSettings();

  _cprLog(`Register System Settings`);
  game.cyberpunkred = {
    cyberpunkredActor,
    cyberpunkredItem
  };


  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  _cprLog(`Register Initiative`);
  CONFIG.Combat.initiative = {
    formula: "1d10",
    decimals: 2
  };
  // Change to our init function...
  Combat.prototype._getInitiativeFormula = _getInitiativeFormula;


  _cprLog(`Define custom entity classes`);
  // Define custom Entity classes
  CONFIG.Actor.entityClass = cyberpunkredActor;
  CONFIG.Item.entityClass = cyberpunkredItem;

  _cprLog(`Register sheet application classes`);
  // Register sheet application classes 
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cyberpunkred", cyberpunkredActorSheet, {
    makeDefault: true
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cyberpunkred", cyberpunkredItemSheet, {
    makeDefault: true
  });

  _cprLog(`Register cyberpunkred die`);
  CONFIG.Dice.terms["p"] = cyberpunkredDie;
  /* REMOVED FROM USE in 0.43)
  CONFIG.Dice.terms["l"] = combinedCPREDDieHandler;
  */
  _cprLog(`Register Handlebars`);

  //Setup helper for roll info
  Handlebars.registerHelper('rollSkill', function (skill) {
    return "_RollSkill " + skill;
  });

  Handlebars.registerHelper('rollInitiative', function () {
    return "_RollInitiative";
  });

  Handlebars.registerHelper('rollNetrunner', function (command) {
    return "_RollNetrunner " + command;
  });

  Handlebars.registerHelper('rollNPC', function (command) {
    return "_RollNPC " + command;
  });

  Handlebars.registerHelper('RollWithMods', function (formula) {
    return "_RollWithMods " + formula;
  });

  Handlebars.registerHelper('RollWithoutMods', function (formula) {
    return "_RollWithoutMods " + formula;
  });

  Handlebars.registerHelper('RollDeathSave', function (formula) {
    return "_RollDeathSave " + formula;
  });

  Handlebars.registerHelper('rollDamage', function (formula) {
    return "_RollDamage " + formula;
  });

  //Setup helper for damage track
  Handlebars.registerHelper('buildDamageTrack', function (current, max) {
    var x = 1;
    var outStr = " ";
    for (x = 1; x <= max; x++) {
      if (x <= current) {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"clickable fas fa-heart setcurrenthealth \"></i>";
      } else {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"clickable far fa-heart setcurrenthealth \"></i>";
      }
      if (x % 5 == 0) {
        outStr += " ";
      }
      if (x % 10 == 0 && x != max) {
        outStr += "<br>";
      }
    }
    return outStr;
  });


  //Setup helper for luck track
  Handlebars.registerHelper('buildLuckTrack', function (current, max) {
    var x = 1;
    var outStr = " ";
    for (x = 1; x <= max; x++) {
      if (x <= current) {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"clickable fas fa-arrow-alt-circle-up setcurrentluck \"></i>";
      } else {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"clickable far fa-arrow-alt-circle-up setcurrentluck \"></i>";
      }
      if (x % 5 == 0) {
        outStr += " ";
      }
      if (x % 10 == 0 && x != max) {
        outStr += "<br>";
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('cprTags', function (tagsInput) {
    let output = '<div class="tags">';
    tagsInput.forEach(element => {
      output += `<div class="tag">${element}</div>`;
    });
    output += '</div>';
    return output;
  });

  Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
    } [operator];
  });

  //Return concatination of all arguments - Used for localizing sometimes
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  //Display block only if a and b are equal
  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  //Display block only if a and b are not equal
  Handlebars.registerHelper('if_not_eq', function (a, b, opts) {
    if (a != b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });


  //Displays the block only if the property b (a string) exists in object a (an object)
  Handlebars.registerHelper('if_exists', function (a, b, opts) {
    if (a.hasOwnProperty(b)) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  //TODO - Am I still using this ?
  Handlebars.registerHelper('if_simpleCombatSetup', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  //Returns string in lowercase
  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  //Indicate selected option in select list
  Handlebars.registerHelper("select", function (value, options) {
    return options.fn(this)
      .split('\n')
      .map(function (v) {
        var t = 'value="' + value + '"'
        return !RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
      })
      .join('\n')
  });


});


Hooks.once("ready", function () {
  //Once FoundryVTT is loaded, perform a migration check
  const worldDataVersion = game.settings.get("cyberpunkred", "systemMigrationVersion");
  const systemDataVersion = game.system.data.version;
  if (worldDataVersion != systemDataVersion || environmentSettings.forcemigrate) {
    if (environmentSettings.forcemigrate) {
      ui.notifications.info("Environment settings have forced migrate of data.");
    } else {
      ui.notifications.info("Performing data update from " + worldDataVersion + " to " + systemDataVersion);
    }
    migrateWorld();
  }
  game.settings.set("cyberpunkred", "systemMigrationVersion", game.system.data.version);


  //Check all system settings to make sure they are okay
  var settingsOK = true;
  _cprLog("Checking game settings");
  
  switch (game.settings.get("cyberpunkred", "dieRollCommand")) {
    //Allowed die rolls go here
    case "dp":
      _cprLog("Die command is ok");
      settingsOK = true;
      break;
      //Nothing else allowed
    default:
      _cprLog("Die command is NOT ok");
      settingsOK = false;
  }

  if (!settingsOK) {
    ui.notifications.error("Your system settings are out of date and must be reset before you try to play. The GM must click the GEAR tab, then CONFIGURE SETTINGS, then SYSTEM SETTINGS then must click SAVE CHANGES. Die rolls will not function until that happens.", {
      permanent: true
    });
  }

  // Hotbar handler should be loaded last, once everything is ready
  /*
  In progress:
  happens in core code, in ActorSheet._onDragStart
  have to override or monkey patch that to get the data you want, then use event.dataTransfer.setData("text/plain", JSON.stringify(myData))
  then in the "hotbarDrop" hook, use that data to create the appropriate macro
  */
  Hooks.on("hotbarDrop", (bar, data, slot) => macros.createCPRRollMacro(data, slot));


  ui.notifications.info("CyberpunkRED " + systemDataVersion + " Fully Loaded");
  ui.notifications.warn("GM - Please see known issues and make sure you set die roller in system settings as appropriate for 0.7.8. To do this, click the gear tab on the top right, then Configure Settings and then System Settings. Set the appropriate CPRED Core Rulebook Handler.", {permanent: true});
});
