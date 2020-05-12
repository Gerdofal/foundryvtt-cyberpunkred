//Make the log entries for CyberpunkRED easy to find in the console log, and easy to turn off if needed.
function crlog(a) {
	//return; //Uncomment this to disable all logging.
	console.log('CyberpunkRED | ' + a);
}

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
    const data = itemData.data;
  }
}
