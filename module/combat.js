import {_cprLog} from "./tools.js";

export const _getInitiativeFormula = function(incomingObject) {
  
  //Get the roll prefix from GM settings
  const rollPrefix = game.settings.get("cyberpunkred", "dieRollCommand");
  
  //intData will be the final data object once we determine what was sent
  var intData = null;

  //Return default if incomingOject isn't properly defined object
  if (typeof incomingObject == 'undefined') {
    return rollPrefix;
  }
  
  //Figure out what was passed to initiative
  if (typeof incomingObject.actor !== 'undefined' && incomingObject.actor !== null) {
    //incomingObject is a combatant - This was called from the encounter bar
    intData = incomingObject.actor.data.data;  
  } else if (typeof incomingObject.combatstats !== 'undefined' && incomingObject.combatstats !== null) {
    //incomingObject is an actor, this was called from the character sheet
    intData = incomingObject;
  } else {
    //incomingOject isn't recognized, return default
    return rollPrefix;
  }
  
  //We only take off damage penalties here, other modifiers don't impact initiative
  const initadd = intData.combatstats.init.roll + intData.modifiers.modfinalmod.healthpenalty;
  
  //Reflex added as a tie
  const reftie = intData.attributes.ref.roll / 100;
  
  //Final die roll
  const dieconfig = [rollPrefix, initadd, reftie];
  return dieconfig.filter(p => p !== null).join(" + ");
};
