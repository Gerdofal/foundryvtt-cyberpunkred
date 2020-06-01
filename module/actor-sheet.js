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

    _cprLog("Got Data");
    console.log(data);
    
    //DEV - Make some updates to data that may need a fix without updating system.json
    data.data.modifiers.modfulldam.penalty = -2; //Changed in 0.28

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
    if (data.data.attributes) {
      for (let [key, attr] of Object.entries(data.data.attributes)) {
        attr.roll = attr.value + attr.mod;
        //_cprLog("Calculating " + key + ": " + attr.value + "+" + attr.mod + "=" + attr.roll);
      }
    } else {
      _cprLog("Skipping attribute calculations because no attributes detected");
    }

    if (data.data.skills) {
      for (let [key, attr] of Object.entries(data.data.skills)) {
        attr.roll = attr.value + attr.mod;
        //_cprLog("Calculating " + key + ": " + attr.value + "+" + attr.mod + "=" + attr.roll);
      }
    } else {
      _cprLog("Skipping skill calculations because no skills detected");
    }

    // TODO - Need to tweak NPC page so this can work for them... maybe?
    if (data.data.attributes) {
      data.data.combatstats["healthpool"].max = data.data.attributes["body"].roll * 5;
      //_cprLog("Calculating Health Max " + data.data.attributes["body"].roll + " * 5 = " + data.data.combatstats["healthpool"].max);

      data.data.combatstats["luckpool"].max = data.data.attributes["luck"].roll;
      //_cprLog("Luck Pool Max = " + data.data.attributes["luck"].roll);
    } else {
      _cprLog("Skipping health and luck calculatons because no attributes detected");
    }

    //Set variables for some of the system settings
    data.simpleCombatSetup = game.settings.get("cyberpunkred", "simpleCombatSetup");
    data.GMAlwaysWhisper = game.settings.get("cyberpunkred", "GMAlwaysWhisper");
    data.itemCombatSetup = game.settings.get("cyberpunkred", "itemCombatSetup");
    data.dieRollCommand = game.settings.get("cyberpunkred", "dieRollCommand");
    data.showInventory = game.settings.get("cyberpunkred", "showInventory");
    if (!data.showInventory) {
      data.itemCombatSetup = false; //If we don't have inventory management, we can't do item combat setup
    }

    //Check wound penalties
    if (data.data.combatstats["healthpool"].value <= (data.data.combatstats["healthpool"].max / 2)) {
      data.data.modifiers.modhalfdam.checked = true;
    } else {
      data.data.modifiers.modhalfdam.checked = false;
    }

    //Check wound penalties
    if (data.data.combatstats["healthpool"].value <= 0) {
      data.data.modifiers.modfulldam.checked = true;
    } else {
      data.data.modifiers.modfulldam.checked = false;
    }

    //Compute current damage mod
    var tempmod = 0;
    for (let [key, attr] of Object.entries(data.data.modifiers)) {
      if (attr.hasOwnProperty("checked")) {
        if (attr.checked) {
          tempmod += attr.penalty;
        }
      }
    }
    tempmod += data.data.modifiers.modmanualmod.penalty;
    data.data.modifiers.modfinalmod.totalpenalty = tempmod;

    //Setup helper for roll info
    Handlebars.registerHelper('buildRollString', function (skill) {
      var outStr = game.settings.get("cyberpunkred", "dieRollCommand");
      var arr = new Array();
      arr.push(data.data.skills[skill].roll);
      arr.push(data.data.attributes[data.data.skills[skill].linkedattribute].roll);
      arr.push(data.data.modifiers.modfinalmod.totalpenalty);
      arr.forEach(element => {
        outStr += " + " + element;
      });
      return (outStr);
    });

    //Setup helper for damage track
    Handlebars.registerHelper('buildDamageTrack', function () {
      var x = 1;
      var outStr = " ";
      var current = data.data.combatstats["healthpool"].value;
      var max = data.data.combatstats["healthpool"].max;
      for (x = 1; x <= max; x++) {
        if (x <= current) {
          outStr += "<i data-setvalue=\"" + x + "\" class=\"fas fa-heart setcurrenthealth \"></i>";
        } else {
          outStr += "<i data-setvalue=\"" + x + "\" class=\"far fa-heart setcurrenthealth \"></i>";
        }
        if (x % 5 == 0) {
          outStr += " ";
        }
        if (x % 25 == 0) {
          outStr += "<br>";
        }

      }
      return outStr;
    });

    //Setup helper for luck track
    Handlebars.registerHelper('buildLuckTrack', function () {
      var x = 1;
      var outStr = " ";
      var current = data.data.combatstats["luckpool"].value;
      var max = data.data.combatstats["luckpool"].max;
      for (x = 1; x <= max; x++) {
        if (x <= current) {
          outStr += "<i data-setvalue=\"" + x + "\" class=\"fas fa-arrow-alt-circle-up setcurrentluck \"></i>";
        } else {
          outStr += "<i data-setvalue=\"" + x + "\" class=\"far fa-arrow-alt-circle-up setcurrentluck \"></i>";
        }
        if (x % 5 == 0) {
          outStr += " ";
        }
        if (x % 25 == 0) {
          outStr += "<br>";
        }
      }
      return outStr;
    });

    _cprLog("Finished setting up data");
    console.log(data);
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
      for (let [key, attr] of Object.entries(intdata.data.modifiers)) {
        if (attr.hasOwnProperty("checked")) {
          if (attr.checked) {
            attr.checked = false;
          }
        }
      }
      intdata.data.modifiers.modmanualmod.penalty = 0;
      this.actor.update({
        "data.modifiers": intdata.modifiers
      });
    });

    //Set current health based on click on dot
    html.find('.setcurrenthealth').click(ev => {
      var intdata = this.actor.data;
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      intdata.data.combatstats.healthpool.value = setTo;
      this.actor.update({
        "data.combatstats": intdata.combatstats
      });
    });

    //Set current luck based on click on dot....
    html.find('.setcurrentluck').click(ev => {
      var intdata = this.actor.data;
      var setTo = $(ev.currentTarget).attr("data-setvalue") * 1;
      intdata.data.combatstats.luckpool.value = setTo;
      this.actor.update({
        "data.combatstats": intdata.combatstats
      });
    });

    //Set current health based on click on modifier number
    html.find('.alterhealth').click(ev => {
      var intdata = this.actor.data;
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = intdata.data.combatstats.healthpool.max;
      intdata.data.combatstats.healthpool.value += setTo;
      if (intdata.data.combatstats.healthpool.value > max) {
        intdata.data.combatstats.healthpool.value = max;
      }
      if (intdata.data.combatstats.healthpool.value < 0) {
        intdata.data.combatstats.healthpool.value = 0;
      }
      this.actor.update({
        "data.combatstats": intdata.combatstats
      });
    });

    //Set current luck based on click on modifier number
    html.find('.alterluck').click(ev => {
      var intdata = this.actor.data;
      var setTo = $(ev.currentTarget).attr("data-change") * 1;
      var max = intdata.data.combatstats.luckpool.max;
      intdata.data.combatstats.luckpool.value += setTo;
      if (intdata.data.combatstats.luckpool.value > max) {
        intdata.data.combatstats.luckpool.value = max;
      }
      if (intdata.data.combatstats.luckpool.value < 0) {
        intdata.data.combatstats.luckpool.value = 0;
      }
      this.actor.update({
        "data.combatstats": intdata.combatstats
      });
    });


    //Increment penalty on deathsave
    html.find('.deathsave').click(ev => {
      var intdata = this.actor.data;
      console.log(this);
      console.log(intdata);
      intdata.data.combatstats.deatsave.penalty++;
      this.actor.update({
        "data.combatstats": intdata.combatstats
      });
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
  } // end OnRoll


} //End class cyberpunkredactorsheet
