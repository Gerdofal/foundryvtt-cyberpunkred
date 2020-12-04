import {_cprLog} from "./tools.js";

export const registerSystemSettings = function() {

  	game.settings.register("cyberpunkred", "gameSystem", {
    name: "CPRED.gamesystemname",
    hint: "CPRED.gamesystemhint",
    scope: "world",
    config: true,
    default: "core",
    choices: {
      "core": "Core Rulebook",
      "jsk": "Jumpstart Kit"
    },
    type: String
  });

	game.settings.register("cyberpunkred", "dieRollCommand", {
    name: "CPRED.dierollcommandname",
    hint: "CPRED.dierollcommandhint",
    scope: "world",
    config: true,
    default: "1dpixo1xo10",
    choices: {
      "1dpixo1xo10": "Explode 10s (once) and subtract 1s (once)",
      "1dpixo1x10": "Explode 10s (infinitely) and subtract 1s (once)",
      "1dpix1x10": "Explode 10s (infinitely) and subtract 1s (infinitely)",
      "1d10xo10": "Explode 10s (once)",
      "1d10x10": "Explode 10s (infinitely)",
      "1dpixo1": "Subtract 1s (once)",
      "1dp1x1": "Subtract 1s (infinitely)"
    },
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
  
  game.settings.register("cyberpunkred", "systemMigrationVersion", {
    name: "Ver",
    scope: "world",
    config: false,
    default: 0,
    type: Number
  });
	
}