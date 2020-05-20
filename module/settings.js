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
	
	
	
}