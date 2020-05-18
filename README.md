# Branch Information

- This is the development branch. You should generally not use this for games as it may have significant bugs. For the readme of the stable branch, please see here:
  - https://github.com/Gerdofal/foundryvtt-cyberpunkred/blob/stable_release/README.md

(If you really want to use the development version, see below.)


# Cyberpunk RED

An in-development system for Cyberpunk RED. Since the game is not yet released, this is obviously not finished. It currently aligns with the rules in the CyberpunkRED Jumpstart Kit.

# Installing

- The files in the "Stable Release" branch are the best choice. Use this as the manifest URL:
  - https://raw.githubusercontent.com/Gerdofal/foundryvtt-cyberpunkred/stable_release/system.json

- If you really want to install the master branch, even if it may not work, use this URL:
  - https://raw.githubusercontent.com/Gerdofal/foundryvtt-cyberpunkred/development/system.json

# Features Planned

- Character Sheet
  1. All attributes and skills easily visible
  2. Special tab to make various combat actions easier to manage (or drag to action bar)
  3. Additional tabs that show or hide based on your selection of available abilities (hacking, etc...)
- NPCs
  1. Special system to help make using large number of NPCs easier
- Optional Rules
  1. Support for optional rules will be inclued wherever possible. For example:
     - Base die roll will be tweaked to include common options for exploding dice (don't explode, explode once, explode with limt, explode infinitely )
	 - A few different ways of handling criticals will be included
	 - There will be options to use the CP 2020 health track system instead of the CP RED health track system
- Other
  1. Other design decisions about the table, dice rolling, etc... are still beging made
  
# General Design Plans

Since playstyles vary greatly, this sheet is designed with the following in mind:

1. Everything important about a character or NPC should work just fine without using tokens, maps, action bars, or anyting else.
   - Some people just want to play the game using their mind and their own internal vision, we want to support that style of play. If all the players and GM want to use is the character sheet, this should not limit the usefullness of the system in any way.
2. Everything should be efficient and quick during play. Nothing should require multiple clicks if we can find a way to do it with just one.
3. Help text and tips should be available at the beginning, but hidable with a simple setting change.
