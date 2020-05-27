import {_cprLog} from "./tools.js";

export const registerSystemSettings = function() {

	game.settings.register("cyberpunkred", "dieRollCommand", {
    name: "SETTINGS.dierollcommandname",
    hint: "SETTINGS.dierollcommandhint",
    scope: "world",
    config: true,
    default: "d10x10",
    type: String
  });
	
	game.settings.register("cyberpunkred", "GMAlwaysWhisper", {
    name: "SETTINGS.gmalwayswhispername",
    hint: "SETTINGS.gmalwayswhisperhint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
	
	game.settings.register("cyberpunkred", "simpleCombatSetup", {
    name: "SETTINGS.usesimplecombatname",
    hint: "SETTINGS.usesimplecombathint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
  
	game.settings.register("cyberpunkred", "itemCombatSetup", {
    name: "SETTINGS.useitembasedcombatname",
    hint: "SETTINGS.useitembasedcombathint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
  
  game.settings.register("cyberpunkred", "showInventory", {
    name: "SETTINGS.showinventoryname",
    hint: "SETTINGS.showinventoryhint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
	
	
}