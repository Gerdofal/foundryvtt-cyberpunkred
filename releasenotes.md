Sections: 
- [In Development](#in-development)
- [Release Notes](#release-notes)
- [Future Plans](#future-plans)

### In Development

- 0.29 - In Development / Not Yet Released - Beta
  - BugFix: Initiative roll will now properly change when ref value, ref mod, or init mod change.
  - Cleanup: Removed init.value from template.json since it's meaningless
  - BugFix: Die command once again displays properly on the character sheet settings tab
  - Cleanup: Changed default values for luck to something realistic (I want 25 luck too!)
  - Cleanup: Added check in actor.js to capture health and luck out of range.
  - BugFix: Teaked half damage mod to turn on when at LESS than half hp, instead of AT half hp.
  - BugFix: Added wound penalties to initiative roll
  - Ease of Use: Added button to reset luck to full.
  - Ease of Use: Added more weapons to simple combat setup, for that Solo who has to have everything!

### Release Notes

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

### Future Plans

- 0.31 - Item Inventory System (Including modifiers and other attributes based on items)
- 0.30 - Re-write roll system to use a custom card
- 0.29 - Tweak formatting of the character sheet to improve usability and squash bugs.