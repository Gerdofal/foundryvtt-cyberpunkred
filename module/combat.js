import {_cprLog} from "./tools.js";

export const _getInitiativeFormula = function(combatant) {
  _cprLog('Parsing initiative...' + combatant.actor.name);
  const actor = combatant.actor;
  if ( !actor ) return "1d10";
  const initadd = actor.data.data.combatstats.init.roll;
  const reftie = actor.data.data.attributes.ref.roll / 100;
  const dieconfig = ["1d10", initadd, reftie];
  return dieconfig.filter(p => p !== null).join(" + ");
};
