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
  registerSystemSettings
} from "./settings.js";
import {
  _getInitiativeFormula
} from "./combat.js";


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

  _cprLog(`Register Handlebars`);

  //Setup helper for roll info
  Handlebars.registerHelper('buildRollString', function (data, skill) {
    var outStr = game.settings.get("cyberpunkred", "dieRollCommand");
    var arr = new Array();
    arr.push(data.skills[skill].roll);
    arr.push(data.attributes[data.skills[skill].linkedattribute].roll);
    arr.push(data.modifiers.modfinalmod.totalpenalty);
    arr.forEach(element => {
      outStr += " + " + element;
    });
    return (outStr);
  });

  //Setup helper for damage track
  Handlebars.registerHelper('buildDamageTrack', function (current, max) {
    var x = 1;
    var outStr = " ";
    for (x = 1; x <= max; x++) {
      if (x <= current) {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"fas fa-heart setcurrenthealth \"></i>";
      } else {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"far fa-heart setcurrenthealth \"></i>";
      }
      if (x % 5 == 0) {
        outStr += " ";
      }
      if (x % 25 == 0) {
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
        outStr += "<i data-setvalue=\"" + x + "\" class=\"fas fa-arrow-alt-circle-up setcurrentluck \"></i>";
      } else {
        outStr += "<i data-setvalue=\"" + x + "\" class=\"far fa-arrow-alt-circle-up setcurrentluck \"></i>";
      }
      if (x % 5 == 0) {
        outStr += " ";
      }
      if (x % 25 == 0) {
        outStr += "<br>";
      }
    }
    return outStr;
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
