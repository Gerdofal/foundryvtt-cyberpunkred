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
      "1dpixo1xo10": "Explode 10s and subtract 1s",
      "1d10xo10": "Only explode 10s"
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