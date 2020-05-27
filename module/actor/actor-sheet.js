//Make the log entries for CyberpunkRED easy to find in the console log, and easy to turn off if needed.
function crlog(a) {
  //return; //Uncomment this to disable all logging.
  console.log('CyberpunkRED | ' + a);
}

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet} 
 */
export class cyberpunkredActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cyberpunkred", "sheet", "actor"],
      template: "systems/cyberpunkred/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".cpr-content",
        initial: "description"
      }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/cyberpunkred/templates/actor";
    // Return a single sheet for all actor types.
    //return `${path}/actor-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique actpr sheet by type, like `character-sheet.html`.
    return `${path}/actor-${this.actor.data.type}-sheet.html`;
  }
  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    console.log(data);
    /*
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }
    */
    
    for (let [key, attr] of Object.entries(data.data.attributes)) {
      attr.roll = attr.value + attr.mod;
      crlog("Calculating " + key + ": " + attr.value + "+" + attr.mod +  "=" + attr.roll);
    }
    
    for (let [key, attr] of Object.entries(data.data.skills)) {
      attr.roll = attr.value + attr.mod;
      crlog("Calculating " + key + ": " + attr.value + "+" + attr.mod +  "=" + attr.roll);
    }    
    
    data.data.resources["healthpool"].max = data.data.attributes["body"].roll * 5;
    crlog("Calculating Health Max " + data.data.attributes["body"].roll + " * 5 = " + data.data.resources["healthpool"].max);
    if (data.data.resources["healthpool"].max<data.data.resources["healthpool"].value) {
      data.data.resources["healthpool"].value=data.data.resources["healthpool"].max;
    }
    
    data.data.resources["luckpool"].max = data.data.attributes["luck"].roll;
    crlog("Luck Pool Max = " + data.data.attributes["luck"].roll);
    if (data.data.resources["luckpool"].max<data.data.resources["luckpool"].value) {
      data.data.resources["luckpool"].value = data.data.resources["luckpool"].max;
    }

    return data;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    crlog("Parsing Item List");
    // Initialize containers.
    const cyberware = [];
    const weapons = [];
    const gear = [];

    // Iterate through items, allocating to containers
    // let totalWeight = 0;
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'gear') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'weapons') {
        weapons.push(i);
      }
      // Append to spells.
      else if (i.type === 'cyberware') {
        cyberware.push(i);
      }

      // Assign and return
      actorData.gear = gear;
      actorData.weapons = weapons;
      actorData.cyberware = cyberware;
      console.log(cyberware);
      console.log(weapons);
      console.log(gear);
    }
  }
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (game.settings.get("cyberpunkred", "GMAlwaysWhisper") && this.actor.data.type == "npc") {
      var rollstring = "gmroll";
    } else {
      var rollstring = "roll";
    }

    console.log("Roll String: " + rollstring);

    if (dataset.roll) {

      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({
          actor: this.actor
        }),
        flavor: label
      }, {
        rollMode: rollstring
      });

    } // End if Dataset.roll
  }

}
