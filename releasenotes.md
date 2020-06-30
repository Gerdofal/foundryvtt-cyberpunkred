Sections: 
- [Future Plans](#future-plans)
- [In Development](#in-development)
- [Release Notes](#release-notes)

### Future Plans

- 0.31 - Item Inventory System (Including modifiers and other attributes based on items, as well as ranges and damage for weapons
- 0.32 - UI cleanup, adding ways to edit random attributes not included on other tabs, .

- TBD
  - Total the Cyber Psychosis from cyberware for the character sheet
  
### In Development

- 0.31 - In Development / Not Yet Released
  - Added combat section based on weapons in inventory
  - Added functionality to allow items like cyberware to modify attributes and skills
  - Changed "automod" fields to "itemmod" as that makes more sense
  - Implemented item based mods for all skills and attributes
  - Added space for armor on the combat setup tab
  
In Development Known Issues:
  - Some item sheet tabs are not localized
  - The item sheet is ugly
  - Numerous item fields on the "Attributes" tab of the item sheet are text entry instead of the appropriate drop-down, checkbox, or other element
  - The "active" flag on item mods is permanently set to true for the time being

### Release Notes

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

