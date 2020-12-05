import {
  _cprLog
} from "./tools.js";

/**
 * Extend the Die to handle critical failures (implemented by @JDW on the foundryvtt discord)
 * @extends {Die}
 */
export class combinedCPREDDieHandler extends Die {
  constructor(termData) {
    termData.faces = 10;
    super(termData);
  }

  parseRolls() {

    // Determine threshold values
    let max = 1000;
    let targetHigh = this.faces;
    let targetLow = 1;
    let comparison = "=";
    
    // Recursively explode until there are no remaining results to explode
    let checked = 0;
    let initial = this.results.length;
    while (checked < this.results.length) {
      let r = this.results[checked];
      checked++;
      if (!r.active) continue;
      
      // Maybe we have run out of explosions
      if ((max !== null) && (max <= 0)) break;

      // Determine whether to explode on highest and roll again!
      if (!r.exploded && DiceTerm.compareResult(r.result, comparison, targetHigh)) {
        r.exploded = true;
        this.roll();
        if (max !== null) max -= 1;
      }
      
      // Determine whether we got a 1 and need to roll again!
      if (!r.exploded && DiceTerm.compareResult(r.result, comparison, targetLow)) {
        r.exploded = true;
        this.roll();
        if (max !== null) max -= 1;
      }
    }
    
    let summed = 0;
    let totalSum = 0;
    let doneProcessing = false;
    for(summed=0;summed < this.results.length;summed++) {
      let r = this.results[summed];
      if (r.result>targetLow && r.result<targetHigh&&!doneProcessing) {
        totalSum += r.result;
        doneProcessing=true; //As soon as we have a non-exploded value, we are done.
        r.active = true; //Done processing this value
      } else if (r.result == targetLow&&!doneProcessing) {
        r.active = true; //Done processing this value
        summed++; //Skip to next value
        r = this.results[summed];
        totalSum = targetLow - r.result;
        doneProcessing=true; //We have exploded and subtracted a result so we are done.
        r.active = true; //Done processing this value
      } else if (r.result == targetHigh&&!doneProcessing) {
        r.active = true; //Done processing this value
        summed++; //Skip to next value
        r = this.results[summed];
        totalSum = targetHigh - r.result;
        doneProcessing=true; //We have exploded and added a result so we are done.
        r.active = true; //Done processing this value
      } else {
        //If we got this far, we do not want this result at all.
        r.discarded = true;
        r.active = false;
      }
    }
    return this.results.reduce((t, r) => {
      if ( !r.active ) return t;
      if ( r.count !== undefined ) return t + r.count;
      else return t + r.result;
    }, 0);

  }
}


/* EXISTING MODIFIERS in FVTT
Die.MODIFIERS = {
  "r": "reroll",
  "x": "explode",
  "xo": "explodeOnce",
  "k": "keep",
  "kh": "keep",
  "kl": "keep",
  "d": "drop",
  "dh": "drop",
  "dl": "drop",
  "cs": "countSuccess",
  "cf": "countFailures",
  "df": "deductFailures",
  "sf": "subtractFailures",
  "ms": "marginSuccess",
};
*/

combinedCPREDDieHandler.MODIFIERS = Die.MODIFIERS;
combinedCPREDDieHandler.MODIFIERS.cpred = "parseRolls";
