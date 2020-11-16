import {
  _cprLog
} from "./tools.js";

import {
  environmentSettings
} from "../environment.js"

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
    itemData.data.temp = {};
    itemData.data.temp.attributes = this.actor ? this.actor.data.data.attributes : {};
    itemData.data.temp.skills = this.actor ? this.actor.data.data.skills : {};
		itemData.data.temp.combtstats = this.actor ? this.actor.data.data.combatstats : {};
    itemData.data.temp.none = {};
    itemData.data.temp.type = this.data.type;
    itemData.data.backend = {};

		settingGameSystem = game.settings.get("cyberpunkred", "gameSystem");
    data.gameSystem = game.settings.get("cyberpunkred", "gameSystem");
    switch (settingGameSystem) {
      case "core":
        _cprLog("Game is running in Core Rulebook mode.")
        allowJSK = false;
        allowCore= true;
				data.backend.core = true;
				data.backend.jsk = false;
        break;
      case "jsk":
        _cprLog("Game is running in Jumpstart Kit mode.")
        allowJSK = true;
        allowCore = false;
				data.backend.core=false;
				data.backend.jsk=true;
        break;
      default:
        _cprLog("ERROR: Game setting not found for environment. Setting default to core.")
        allowJSK = false;
        allowCore= true;
				data.backend.core = true;
				data.backend.jsk = false;
		}
				
    const data = itemData.data;
  }
}
