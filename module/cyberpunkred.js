// Import Modules
import { cyberpunkredActor } from "./actor/actor.js";
import { cyberpunkredActorSheet } from "./actor/actor-sheet.js";
import { cyberpunkredItem } from "./item/item.js";
import { cyberpunkredItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {
  console.log(`Initializing Simple cyberpunkred System`);
  game.cyberpunkred = {
    cyberpunkredActor,
    cyberpunkredItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = cyberpunkredActor;
  CONFIG.Item.entityClass = cyberpunkredItem;

  // Register sheet application classes 
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("cyberpunkred", cyberpunkredActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("cyberpunkred", cyberpunkredItemSheet, { makeDefault: true });

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
});