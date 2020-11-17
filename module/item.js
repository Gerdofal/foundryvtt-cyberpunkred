import {
  _cprLog
} from "./tools.js";

import {
  environmentSettings
} from "../environment.js"

import {
  itemmodJSK, itemmodCore
} from "../lists/itemmods.js"

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class cyberpunkredItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    itemData.data.backend = {};

		var settingGameSystem = game.settings.get("cyberpunkred", "gameSystem");
    itemData.data.gameSystem = game.settings.get("cyberpunkred", "gameSystem");
    switch (settingGameSystem) {
      case "core":
        _cprLog("Game is running in Core Rulebook mode.")
				itemData.data.backend.core = true;
				itemData.data.backend.jsk = false;
        break;
      case "jsk":
        _cprLog("Game is running in Jumpstart Kit mode.")
				itemData.data.backend.core=false;
				itemData.data.backend.jsk=true;
        break;
      default:
        _cprLog("ERROR: Game setting not found for environment. Setting default to core.")
				itemData.data.backend.core = true;
				itemData.data.backend.jsk = false;
		}
		
    
    //Setup the dropdowns for mods
    
    itemData.data.temp = {};
    if (settingGameSystem=="jsk") {
      itemData.data.temp.attributes = itemmodJSK.attributes;
      itemData.data.temp.skills = itemmodJSK.skills;
      itemData.data.temp.combatstats = itemmodJSK.combatstats;
    } else {
      itemData.data.temp.attributes = itemmodCore.attributes;
      itemData.data.temp.skills = itemmodCore.skills;
      itemData.data.temp.combatstats = itemmodCore.combatstats;      
    }
    
		itemData.data.temp.none = {};

    itemData.data.temp.type = this.data.type;

    const data = itemData.data;
  }
}
