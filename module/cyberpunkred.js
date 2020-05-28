// Import Modules
import {_cprLog} from "./tools.js";
import {cyberpunkredActor} from "./actor.js";
import {cyberpunkredActorSheet} from "./actor-sheet.js";
import {cyberpunkredItem} from "./item.js";
import {cyberpunkredItemSheet} from "./item-sheet.js";
import {registerSystemSettings} from "./settings.js";
import {_getInitiativeFormula} from "./combat.js";




Hooks.once('init', async function () {

  _cprLog(`Initializing Simple cyberpunkred System`);
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

  _cprLog(`Register Handlebars`);
  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });

  Handlebars.registerHelper('if_simpleCombatSetup', function (a, b, opts) {
    if (a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
  
  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });  
  
  Handlebars.registerHelper("select", function(value, options) {
  return options.fn(this)
    .split('\n')
    .map(function(v) {
      var t = 'value="' + value + '"'
      return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
    })
    .join('\n')
  })
  
  
  

});
/**
 * Re-define the dice roll click event to also unhide the formula
 */



/*
	event.preventDefault();
    let roll = $(event.currentTarget),
        tip = roll.find(".dice-tooltip");
    if ( !tip.is(":visible") ) tip.slideDown(200);
    else tip.slideUp(200);
	  	formula = roll.find(".dice-formula");
    if ( !formula.is(":visible") ) formula.slideDown(200);
    else formula.slideUp(200);
	*/
