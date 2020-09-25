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
    itemData.data.temp.none = {};
    itemData.data.temp.type = this.data.type;
    itemData.data.backend = {};
    itemData.data.backend.core = environmentSettings.core;
    itemData.data.backend.jsk = environmentSettings.jsk;
    const data = itemData.data;
  }
}
