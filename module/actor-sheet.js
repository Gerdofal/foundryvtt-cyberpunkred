import {
  _cprLog
} from "./tools.js";
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
    _cprLog("Returning sheet data");
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


    _cprLog("Parsing Item List");
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
      _cprLog(cyberware);
      _cprLog(weapons);
      _cprLog(gear);
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

    // Reset all modifiers and clear penalties
    html.find('.resetallmods').click(ev => {
      var intdata = this.actor.data;
      for (let [key, attr] of Object.entries(this.actor.data.data.modifiers)) {
        if (attr.hasOwnProperty("checked")) {
          if (attr.checked) {
            attr.checked = false;
          }
        }
      }
      this.actor.data.data.modifiers.modmanualmod.penalty = 0;
      this.actor.prepareData();this.actor.render();
    });

    //Set current health based on click on dot
    html.find('.setcurrenthealth').click(ev => {
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      this.actor.data.data.combatstats.healthpool.value = setTo * 1;
      this.actor.prepareData();this.actor.render();
    });

    //Set current luck based on click on dot....
    html.find('.setcurrentluck').click(ev => {
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      this.actor.data.data.combatstats.luckpool.value = setTo * 1;
      this.actor.prepareData();this.actor.render();
    });

    //Set current health based on click on modifier number
    html.find('.alterhealth').click(ev => {
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = this.actor.data.data.combatstats.healthpool.max;
      this.actor.data.data.combatstats.healthpool.value += setTo;
      if (this.actor.data.data.combatstats.healthpool.value > max) {
        this.actor.data.data.combatstats.healthpool.value = max;
      }
      if (this.actor.data.data.combatstats.healthpool.value < 0) {
        this.actor.data.data.combatstats.healthpool.value = 0;
      }
      this.actor.prepareData();this.actor.render();
    });

    //Set current luck based on click on modifier number
    html.find('.alterluck').click(ev => {
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = this.actor.data.data.combatstats.luckpool.max;
      this.actor.data.data.combatstats.luckpool.value += setTo;
      if (this.actor.data.data.combatstats.luckpool.value > max) {
        this.actor.data.data.combatstats.luckpool.value = max;
      }
      if (this.actor.data.data.combatstats.luckpool.value < 0) {
        this.actor.data.data.combatstats.luckpool.value = 0;
      }
      this.actor.prepareData();this.actor.render();
    });

      //Set the deathsave counter
    html.find('.alterdeathsave').click(ev => {
      var change = $(ev.currentTarget).attr("data-change") * 1;
      this.actor.data.data.combatstats.deathsave.penalty += (change * 1);
      if (this.actor.data.data.combatstats.deathsave.penalty<0) {
        this.actor.data.data.combatstats.deathsave.penalty=0;
      }
      _cprLog("Death save is now " + this.actor.data.data.combatstats.deathsave.penalty);
      this.actor.prepareData();this.actor.render();
    });

    //Increment penalty on deathsave
    html.find('.deathsave').click(ev => {
      this.actor.data.data.combatstats.deathsave.penalty++;
      this.actor.prepareData();this.actor.render();
    });


    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
    html.find('.npcrollable').click(this._onRoll.bind(this));
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

    this.actor.rollCPR(dataset.roll, this.actor.data.data);
    
    /* Testing new roll template
    if (dataset.roll) {
      //console.log(dataset);
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
    end testing */
  } // end OnRoll


} //End class cyberpunkredactorsheet
