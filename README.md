![CyberpunkRED Media Card](https://github.com/Gerdofal/foundryvtt-cyberpunkred/blob/development/css/cpredmediacard.png?raw=true "CyberpunkRED Media Card")
# Cyberpunk RED

An in-development system for Cyberpunk RED. Since the game is not yet released, this is obviously not finished. It currently aligns with the rules in the CyberpunkRED Jumpstart Kit and will also also options for house rules to extend the system.

# Branch Information

- Current Status: Alpha
  - Character Sheet is current focus

- There are two branches for this project, development and stable_release. You should generally not use the development branch for games as it may have significant bugs. See below for download links.

# Installing

- This system is available in the "Game-systems" browser in game and may be installed there.

- You can also manually direct your FoundryVTT to the correct manifest. Use this as the manifest URL:
  - https://raw.githubusercontent.com/Gerdofal/foundryvtt-cyberpunkred/stable_release/system.json

- If you want to manually install the files from the dev branch, feel free. I don't recommend this.

# Current Status
- **Basic_Functionality**: Character sheet stores base attributes and skills and has space to save modifications for each.
- **Rolls**: All skills can be rolled from the skill tab.
- **Encounters**: Initiative may be automatically rolled, using REF as a tie breaker.
- **NPCs**: The NPC sheet is at it's beginning stages, 10 fields to set custom die pools with notes and easy to click buttons to roll dice. (Use the character sheet for named NPCs, the NPC sheet is for quick grunts.)
- **GM_Options**: The GM can determine several options, such as the base die roll to use, in System Settings.
- **Localization**: All text is localized, only EN for now.

# Recent updates

Please see https://github.com/Gerdofal/foundryvtt-cyberpunkred/blob/development/updates.md

# Upcoming Changes

**Soon**
- **Combat_Functions**: basic buttons for auto-fire, hacking, facedown, death saves, etc...
- ~~**Situational Modifiers**: tracker for various combinations of modifiers~~ Finished in 0.28
- ~~**Rolling Damage**: damage buttons, first in the sheet, then in chat~~ Added in 0.28
- ~~**Simple Combat Functionality**: a way to set weapon stats using basic text fields~~ Added in 0.28

**Next**
- **Roll Appearance Update**: Adding template for rolls so more info can be included, like damage buttons and hidden details.
- **Hacking**: buttons for all hacking actions
- **Item Based Combat**: adding weapons to the inventory will result in buttons to roll their attacks and damage
- **Item Based Mods**: adding cyberware with mods will impact stats in the sheet
- **Tokens**: calculate range for attacks, apply damage automatically, etc...

**COMING LATER - Once the Core Rulebook is Out**
- **Compendium**: if the license allows it, will include compendium of weapons and other gear.

# Features Planned

- Character Sheet
  1. All attributes and skills easily visible
  2. Special tab to make various combat actions easier to manage (or drag to action bar)
  3. Additional tabs that show or hide based on your selection of available abilities (hacking, etc...)
- NPCs
  1. System to help make using large number of NPCs easier by automating actions from multiple NPCs when possible
- Optional Rules
  1. Support for optional rules will be inclued wherever possible. For example:
     - Base die roll will be tweaked to include common options for exploding dice (don't explode, explode once, explode with limt, explode infinitely )
     - A few different ways of handling criticals will be included
     - There will be options to use the CP 2020 health track system instead of the CP RED health track system
     - Options to use inventory management or just a simple form field for tracking gear and such
- Other
  1. Other design decisions about the table, dice rolling, etc... are still beging made
  
# General Design Plans

Since playstyles vary greatly, this sheet is designed with the following in mind:

1. Everything important about a character or NPC should work just fine without using tokens, maps, action bars, or anyting else.
   - Some people just want to play the game using their mind and their own internal vision, we want to support that style of play. If all the players and GM want to use is the character sheet, this should not limit the usefullness of the system in any way.
2. Everything should be efficient and quick during play. Nothing should require multiple clicks if we can find a way to do it with just one.
3. Help text and tips should be available at the beginning, but hidable with a simple setting change.

# License and Credits

See the file license.md and credits.md

