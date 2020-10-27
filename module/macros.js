export async function createCPRRollMacro(data=false, slot=false) {

  if(!data || !slot) {
    return ui.notifications.warn("Create macro failed because data or slot were unknown.");
  }
  // Create the macro command
  const command = `game.dnd5e.rollItemMacro("${item.name}");`;

  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));

  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: {
        "dnd5e.itemMacro": true
      }
    });
  }

  game.user.assignHotbarMacro(macro, slot);

  return false;
}
