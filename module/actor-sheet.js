import {
  _cprLog
} from "./tools.js";

import {
  environmentSettings
} from "../environment.js"


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
        initial: "welcome"
      }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/cyberpunkred/templates/actor";
    // Unique actor sheet by type, like `character-sheet.html`.
    return `${path}/actor-${this.actor.data.type}-sheet.html`;
  }
  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    this._prepareCharacterItems(data);
    _cprLog("Loading getData in actor-sheet.js");
    console.log(data);
    return data;
  }

  /** @override */
  //Override the drag handler so it will allow dragging of non-items
  _onDragStart(event) {
    const target = $(event.currentTarget);
    if (target.hasClass("item")) {
      const li = event.currentTarget;
      const item = this.actor.getOwnedItem(li.dataset.itemId);
      const dragData = {
        type: "Item",
        actorId: this.actor.id,
        data: item.data
      };
      if (this.actor.isToken) dragData.tokenId = this.actor.token.id;
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    } else {
      // TODO - This is for non-item dragging
    }
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
    //_cprLog("Categorizing Item List for Actor Sheet");
    // Initialize containers.
    const cyberware = [];
    const weapons = [];
    const gear = [];

    // Iterate through items, allocating to containers
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

    // Reset all modifiers that are checked
    html.find('.resetallmods').click(ev => {
      const actor = this.actor;
      const modData = duplicate(actor.data.data);
      for (const property in modData.modifiers) {
        if (modData.modifiers[property].hasOwnProperty("checked")) {
          if (modData.modifiers[property].checked) {
            modData.modifiers[property].checked = false;
          };
        }
      }
      modData.modifiers.modmanualmod.penalty = 0;
      actor.update({
        "data.modifiers": modData.modifiers
      });
    });

    //Add a new humanity entry
    html.find('.saveHumanityEntry').click(ev => {
      const actor = this.actor;
      var tempHumArr = this.actor.data.data.humanityarray;
      var setArray = [];
      setArray[0] = $(ev.currentTarget).attr("newHumanityValue") * 1;
      setArray[1] = $(ev.currentTarget).attr("newHumanityDescription") * 1;
      _cprLog("Saving new humanity entry " + setArray[0] + " for " + setArray[1]);
      tempHumArr.push(setArray);
      
      actor.update({
        "data.humanityarray": tempHumArr
      });
    });
    
    //Set current health based on click on dot
    html.find('.setcurrenthealth').click(ev => {
      const actor = this.actor;
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      var newHealth = setTo * 1;
      actor.update({
        "data.combatstats.healthpool.value": newHealth
      });
    });

    //Set current luck based on click on dot....
    html.find('.setcurrentluck').click(ev => {
      const actor = this.actor;
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      var newLuck = setTo * 1;
      actor.update({
        "data.combatstats.luckpool.value": newLuck
      });
    });

    //Set current health based on click on modifier number
    html.find('.alterhealth').click(ev => {
      const actor = this.actor;
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = actor.data.data.combatstats.healthpool.max;
      var newHealth = actor.data.data.combatstats.healthpool.value + setTo;
      if (newHealth > max) {
        newHealth = max;
      }
      if (newHealth < 0) {
        newHealth = 0;
      }
      actor.update({
        "data.combatstats.healthpool.value": newHealth
      });
    });

    //Set current luck based on click on modifier number
    html.find('.alterluck').click(ev => {
      const actor = this.actor;
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = actor.data.data.combatstats.luckpool.max;
      var newLuck = actor.data.data.combatstats.luckpool.value + setTo;

      if (newLuck > max) {
        newLuck = max;
      }
      if (newLuck < 0) {
        newLuck = 0;
      }
      actor.update({
        "data.combatstats.luckpool.value": newLuck
      });
    });

    //Set current ammo based on click on modifier number
    html.find('.alterammo').click(ev => {
      const actor = this.actor;
      var weaponID = $(ev.currentTarget).attr("data-weaponid");
      const item = actor.data.items.find(i => i._id === weaponID);

      var ammoChange = $(ev.currentTarget).attr("data-change") * 1;
      var newAmmo = (item.data.ammo.value * 1) + (ammoChange * 1);
      actor.updateOwnedItem({
        _id: weaponID,
        "data.ammo.value": newAmmo
      });
    });

    //Reload weapon
    html.find('.reloadammo').click(ev => {
      const actor = this.actor;
      var weaponID = $(ev.currentTarget).attr("data-weaponid");
      const item = actor.data.items.find(i => i._id === weaponID);

      var newAmmo = (item.data.ammo.max * 1);
      actor.updateOwnedItem({
        _id: weaponID,
        "data.ammo.value": newAmmo
      });
    });

    //Set the deathsave counter
    html.find('.alterdeathsave').click(ev => {
      const actor = this.actor;
      var change = $(ev.currentTarget).attr("data-change") * 1;
      var newPenalty = actor.data.data.combatstats.deathsave.penalty + (change * 1);
      if (newPenalty < 0) {
        newPenalty = 0;
      }
      if (newPenalty > 10) {
        newPenalty = 10;
      }
      actor.update({
        "data.combatstats.deathsave.penalty": newPenalty
      });
    });

    //Increment penalty on deathsave
    html.find('.deathsave').click(ev => {
      const actor = this.actor;
      var newPenalty = actor.data.data.combatstats.deathsave.penalty + 1;
      actor.update({
        "data.combatstats.deathsave.penalty": newPenalty
      });
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

    //This function calls rollCPR with whatever was sent to the command. 
    //All special roll logic happens in rollCPR which is in actor.js

    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    var tagData = [];
    //Default template data
    let templateData = {
      title: this.actor.data.name,
      flavor: '',
      details: dataset.label ? `${dataset.label}` : '',
      tags: tagData,
      uid: this.actor.data._id + (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2)
    }

    this.actor.rollCPR(dataset.roll, this.actor.data, templateData);

  } // end OnRoll

} //End class cyberpunkredactorsheet
