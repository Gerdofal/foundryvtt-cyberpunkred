//Make the log entries for CyberpunkRED easy to find in the console log, and easy to turn off if needed.
function crlog(a) {
	//return; //Uncomment this to disable all logging.
	console.log('CyberpunkRED | ' + a);
}

export const registerSystemSettings = function() {

	game.settings.register("cyberpunkred", "dieRollCommand", {
    name: "Die roll command for rolls.",
    hint: "Default: d10x",
    scope: "world",
    config: true,
    default: "d10x",
    type: String
  });
}