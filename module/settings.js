import {_cprLog} from "./tools.js";

export const registerSystemSettings = function() {

	game.settings.register("cyberpunkred", "dieRollCommand", {
    name: "CPRED.dierollcommandname",
    hint: "CPRED.dierollcommandhint",
    scope: "world",
    config: true,
    default: "d10x10",
    type: String
  });
	
	game.settings.register("cyberpunkred", "GMAlwaysWhisper", {
    name: "CPRED.gmalwayswhispername",
    hint: "CPRED.gmalwayswhisperhint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
	
	game.settings.register("cyberpunkred", "simpleCombatSetup", {
    name: "CPRED.usesimplecombatname",
    hint: "CPRED.usesimplecombathint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
	
}