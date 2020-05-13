//Make the log entries for CyberpunkRED easy to find in the console log, and easy to turn off if needed.
function crlog(a) {
	//return; //Uncomment this to disable all logging.
	console.log('CyberpunkRED | ' + a);
}

// Import Modules
import { cyberpunkredActor } from "./actor/actor.js";
import { cyberpunkredActorSheet } from "./actor/actor-sheet.js";
import { cyberpunkredItem } from "./item/item.js";
import { cyberpunkredItemSheet } from "./item/item-sheet.js";
import { registerSystemSettings } from "./settings.js";

Hooks.once('init', async function() {
	
  crlog(`Initializing Simple cyberpunkred System`);
  // Register System Settings
  crlog(`Register System Settings`);
  registerSystemSettings();

  crlog(`Register System Settings`);
  game.cyberpunkred = {
    cyberpunkredActor,
    cyberpunkredItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  crlog(`Register Initiative`);
  CONFIG.Combat.initiative = {
    formula: "1d10",
    decimals: 2
  };

  crlog(`Define custom entity classes`);
  // Define custom Entity classes
  CONFIG.Actor.entityClass = cyberpunkredActor;
  CONFIG.Item.entityClass = cyberpunkredItem;

  crlog(`Register sheet application classes`);
  // Register sheet application classes 
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cyberpunkred", cyberpunkredActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cyberpunkred", cyberpunkredItemSheet, { makeDefault: true });

  crlog(`Register Handlebars`);
  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  }); 
	
  Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('setting_die', function(str) {
    return game.settings.get("cyberpunkred","dieRollCommand");
  });
	
});

