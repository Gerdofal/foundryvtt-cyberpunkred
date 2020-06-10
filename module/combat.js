import {_cprLog} from "./tools.js";

export const _getInitiativeFormula = function(combatant) {
  //_cprLog('Parsing initiative...');
  const rollPrefix = game.settings.get("cyberpunkred", "dieRollCommand");
  var intData = null;
  if (typeof combatant == 'undefined') {
    return rollPrefix;
  }
    
  if (typeof combatant.actor !== 'undefined' && combatant.actor !== null) {
    //_cprLog('...found actor...');
    intData = combatant.actor.data.data;  
  } else if (typeof combatant.combatstats !== 'undefined' && combatant.combatstats !== null) {
    //_cprLog('...found data...');
    intData = combatant;
  } else {
    //_cprLog('...found nothing, returning default.');
    return rollPrefix;
  }
  
  console.log(intData);
  const initadd = intData.combatstats.init.roll - intData.modifiers.modfinalmod.totalpenalty;
  const reftie = intData.attributes.ref.roll / 100;
  const dieconfig = [rollPrefix, initadd, reftie];
  //_cprLog("Returning " + dieconfig);
  return dieconfig.filter(p => p !== null).join(" + ");
};
