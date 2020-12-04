Sections: 
- [In Development](#in-development)
- [Future Plans](#future-plans)
- [Release Notes](#release-notes)

### Known Issues
- 0.42
  - In cases where a 1 is rolled, followed by a 10 (which should result in a roll of -9), the die roller is improperly exploding the 10 and adding the result.

### In Development

- 0.42
  - New die code by njfox which fits rules in core rulebook for negative exploding dice
  - Death saves no longer have die explosion (As per RTG)
  - There is now a setting on the "Settings" tab to turn on or off automation of health penalties.
  - Tweaked the combat tab UI a bit to save some space.
  - Moved the roll modifiers block higher on the combat tab.
  - As per core rules, "Cultural Familiarity" is no longer added while in that game mode
  - The "Stat Setup" tab has been renamed "Char Setup"
  - Skills on the "Char Setup" tab now show their total pool (including attribute) in the "Total" column
  - Increased the font size of the skills on the combat tab
  - The combat tab now only shows skills which have a value. (All skills are still shown on the "Char Setup" tab)
	- Default grid distance is now 2m, as per core rules. Users of custom maps please take note you may need to change the default.
	- CSS fixed so the playlist controls are now visible (changed their color)
	- Ammo type is now an option in weapons
	- The penalty for headshots is now -8 as per core rules
	- A basic check for critical injuries is now made when damage is rolled
	- There is now an option to unlink NPC health from body to make it easier for GMs to make quick and dirty NPCs
  - Adjusted die roll settings so they show as a drop-down
  - Dice So Nice! no longer crashes when trying to roll an NPC roll with "Always Whisper NPC Rolls" checked in settings
  
  
	
  


### Future Plans

- Continued implementation of core rulebook rules

- UI cleanup and usability improvements

- Token bar actions/macros

### Release Notes

- 0.41 - Released 11/25/2020 - Beta
	- IMPORTANT NOTES FOR MODULE DEVS:
      - I've made a name change to the template.json so it makes more sense as new role skills are added:
        - roleskill.hacking has become roleskill.netrunner
      - All methods and properties which used to be "hacking" are now "netrunner"
  - BUG FIXES
    - Fixed the typo causing the settings tab to not display
      - Also fixes the issue that the netrunning tab cannot be seen
  - OTHER CHANGES
    - Added basic entries for all roleskills on the stat setup tab (More role skill functionality to come in ver 0.42)
      - You can activate your role (or more than one) on the settings tab
    - Renamed the hacking tab to Netrunning
    - Tweaked the appearance of the stat setup tab so it is a little easier to read
    - Added a player notes tab
    - Changed hacking rolls to not include INT when in core rulebook mode

- 0.40 - Released 11/17/2020 - Beta
  - Bug fixes
    - The skill choice drop down on weapon items once again shows options for the core rulebook
    - There is no longer a javascript error when changing a skill mod drop-down to an attribute mod drop-down
    - Added routine to make sure all numerical data is actually saved as a number
  - Continued work implementing changes in the core rulebook
    - "autofire" is now an option to the skill drop-down for weapons. I will add a separate button in a future release.
    - The health calculation now uses the new formula introduced in the core rulebook.
    - Added a basic humanity tracking page to track humanity loss and gain. This does not yet subtrack from empathy, just keeps a log for you.
    - The armor entries on the combat setup tab now match the entries on the character sheet from the core rulebook, with a space to track degradation
  - Other Enhancements
    - Initiative is now an option for an item modification
    - Initiative is available on the NPC character sheet
    - Changed the order of tabs so they make a little more sense
    - Initiative is now rollable on the stat setup tab

- 0.39 - Released 11/14/2020 - Beta
  - Initial support of core rulebook.
	- Added setting option for GM to change ruleset between core rulebook and jumostart kit.
	- Added all new skills and skill categories as per the core rulebook.
	- Many small tweaks and cleanups.
	
- 0.38 - Released 10/27/2020 - Beta
  - Added ability to edit initiative on the character sheet
  - Added brawling as a potential skill choice for weapons on simple combat setup and on items
  - Tested system with FVTT 7.5 and updated system.json

- 0.37 - Released 10/1/2020 - Beta
  - Added DE translation (thanks to KarstenW)
  - Tweaked code for drop-down of weapon skills so it always shows the correct options on items and on the combat setup tab
  - Added attributes to NPCs
  - Normalized the data structure of NPCs and Characters (Though some items are not shown on the NPC sheet, they actually store everything the character does. NPCs actually have a few extra fields.)
  - Added initiative button to NPC sheet
  
- 0.36 - Released 9/24/2020 - Beta
  - There is now an alert shown if the actor isn't prepared after migration, offering a link to fix.
  - Skills are now grouped into categories
  - Made improvements to CSS to make headers easier to read while taking less space
  - Added categories to skill displays

- 0.35 - Released 9/21/2020 - Bugfix
  - Minor bugfixes
  - Removed some testing code from .34

- 0.34 - Released 9/20/2020 - Beta
  - Added ammo tracking to weapons in inventory
  - Added ability to edit "humanity" and automatically subtract total of item "psychosis" stat from humanity
  - Added ability to edit "reputation"
  - Added a migration function to handle template changes

- 0.33 - Released 8/25/2020 - Beta

  - Removed gm config setting for showing or hiding some portions of sheets
  - Added sheet prefs so the players can show and hide inventory and other options on a per-sheet basis
  - Added rate of fire to the item sheet
  - Added Melee Weapon choice to the drop-down for item type
  - Changed background of main ui from black to a light gray, darkened the red text
  - Improved appearance of checkboxes on settings tab
  - Fixed bug causing NPC rolls to fail
  - Sorted the skill list and attributes list alphabetically (On core rulebook release, the skill list will be categorized.)
  - Tweaked formatting of various UI elements to make them easier to read
  - Added "settings" to NPCs. Not yet implemented in this version, but the data is there.
  - Fixed CSS typo for 6 column grids
  - Minor changes to UI of items, still awaiting a full re-write here
  - Adjusted column widths on Stat Setup tab to make it easier to read
  
  - Note: This version includes changes to language strings. Details are available in: https://github.com/Gerdofal/foundryvtt-cyberpunkred/blob/development/translation_changes.md
  
- 0.32 - Released 8/4/2020 - Beta (Bugfix Release)
  - Added language support for Simplified Chinese (Thanks Ztt1996#7972)
  - Removed gm config setting for showing or hiding some portions of sheets
  - Added sheet prefs so the players can show and hide inventory and other options on a per-sheet basis
  - Fixed tab bug in FoundryVTT Ver 7.0 Alpha

- 0.31 - Released 6/30/2020 - Beta
  - Added combat section based on weapons in inventory
  - Added functionality to allow items like cyberware to modify attributes and skills
  - Changed "automod" fields to "itemmod" as that makes more sense
  - Implemented item based mods for all skills and attributes
  - Added space for armor on the combat setup tab
  - Setup workable UI for item sheet (more UI improvements for Actor and Item coming in beta 0.32)
  
  NOTICE: Significant template.json changes may impact items already in inventory. A transition will be attempted, but you might need to re-create those items.

- 0.30 - Released 6/15/2020 - Beta
  - UI: Localized remaining rolls on combat tab
  - New: Facedown, suppressive fire, reputation check, and initiative are now rollable
  - New: Added reputation to combatstats
  - Update: Set supported version to 0.6.2
  - Bugfix: INIT now uses defined roll prefix
  - UI: Changed CSS for most UI items to fit CPR theme
  - New: Implemented simple roll template with room for future expansion
  - New: Completely re-wrote roll logic to provide optional details on all rolls
  - Bugfix: Fixed bug where health, luck, and deathsave penalty are reset upon F5 page reload
  - New: Added new actions to the hacking tab
  - UI: Localized the settings tab
  
- 0.29 - Released 6/6/2020 - Beta
  - BugFix: Initiative roll will now properly change when ref value, ref mod, or init mod change.
  - Cleanup: Removed init.value from template.json since it's meaningless
  - BugFix: Die command once again displays properly on the character sheet settings tab
  - Cleanup: Changed default values for luck to something realistic (I want 25 luck too!)
  - Cleanup: Added check in actor.js to capture health and luck out of range.
  - BugFix: Teaked half damage mod to turn on when at LESS than half hp, instead of AT half hp.
  - BugFix: Added wound penalties to initiative roll
  - UI Improvement: Added button to reset luck to full.
  - UI Improvement: Added more weapons to simple combat setup, for that Solo who has to have everything!
  - UI Improvement: Adjusted health pool and luck pool so they are adjacent to each other
  - UI Improvement: Localized the death save section
  - Cleanup: Added ability to hide some weapons from simple combat setup
  - UI Improvement: Added zero luck button
  - Cleanup: Added automod field to stats for future use in item setup, so manual mods are still possible and diferentiated
  - Cleanup: Removed min and max from numerous stats
  - BugFix: Added calculations for Cultural Familiarity for all skills
  - UI Improvement: Improved appearance of navigation tabs on character sheet and made the whole tab clickable
  - UI Improvement: Adjusted the blur-radius and other text effects of clickable items to make it easier to spot
  - New Feature: Added roleskills to the template.json to hold role specific skills.
  - New Feature: Added interface to roleskills for use in hacking
  - New Feature: Added some notes to hacking tab
  - UI Improvement: Tweaked the alignment of NPC buttons

- 0.28 - Released 6/2/2020 - Beta
  - Setup damage rolls for weapons as well as weapon type for future help determining hit target at range.
  - Re-wrote CSS to begin process of setting up the final appearance of the character sheet
  - Added comments in many files to make future additions easier
  - Major changes to formatting of the combat tab to make more fit
  - Added die icons to rolls to make them easier to spot
  - Added half damage and fully damaged to the modifiers list (set automatically based on health track)
  - Added clickable health and luck tracks to the combat tab
  - Rremoved health and luck from the attr tab
  - Added buttons to alter current health and luck
  - Added death saves with appropriate modifier and help text

- 0.27 - Released 5/28/2020 - Alpha
  - Inclusion of various roll modifiers to the combat tab and change of the localization prefix from SHEET. to CPRED.

- 0.26 - Released 5/27/2020 - Alpha
  - Fixed bug introduced in 0.25 when NPC sheets were excluded from some calculations. The exclusion was also applying to characters under some circumstances.

