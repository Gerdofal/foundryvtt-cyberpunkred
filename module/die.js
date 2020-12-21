import {
    _cprLog
  } from "./tools.js";



export class cyberpunkredDie extends Die {
    constructor(termData) {
        termData.faces=10;
        super(termData);
        this.modifiers = ["ixo1", "xo10"];
    }
    static DENOMINATION = "p";
    invertExplode(modifier, { recursive = true } = {}) {
        // Match the explode or "explode once" modifier
        const rgx = /[iI][xX][oO]?([0-9]+)?([<>=]+)?([0-9]+)?/;
        const match = modifier.match(rgx);
        if (!match) return this;
        let [max, comparison, target] = match.slice(1);

        // If no comparison was set, treat the max as the target
        if (!comparison) {
            target = max;
            max = null;
        }

        // Determine threshold values
        max = parseInt(max) || null;
        target = parseInt(target) || this.faces;
        comparison = comparison || "=";

        // Recursively explode until there are no remaining results to explode
        let checked = 0;
        let initial = this.results.length;
        while (checked < this.results.length) {
            let r = this.results[checked];
            checked++;
            if (!r.active) continue;

            // Maybe we have run out of explosions
            if ((max !== null) && (max <= 0)) break;

            // Determine whether to explode the result and roll again!
            if (DiceTerm.compareResult(r.result, comparison, target) && r.canExplode) {
                r.exploded = true;
                this.roll();
                let newRoll = this.results[this.results.length-1];
                newRoll.canExplode = false;
                if (max !== null) max -= 1;
                DiceTerm._applyDeduct([newRoll],"<=", 10,{invertFailure:true});
            }

            // Limit recursion if it's a "small explode"
            if (!recursive && (checked >= initial)) checked = this.results.length;
            if (checked > 1000) throw new Error("Maximum recursion depth for exploding dice roll exceeded");
        }
    }

    invertExplodeOnce(modifier) {
        return this.invertExplode(modifier, { recursive: false });
    }

   // @override 
    explode(modifier, {recursive=true}={}) {
        // Match the explode or "explode once" modifier
        const rgx = /[xX][oO]?([0-9]+)?([<>=]+)?([0-9]+)?/;
        const match = modifier.match(rgx);
        if ( !match ) return this;
        let [max, comparison, target] = match.slice(1);

        // If no comparison was set, treat the max as the target
        if ( !comparison ) {
            target = max;
            max = null;
        }

        // Determine threshold values
        max = parseInt(max) || null;
        target = parseInt(target) || this.faces;
        comparison = comparison || "=";

        // Recursively explode until there are no remaining results to explode
        let checked = 0;
        let initial = this.results.length;
        while ( checked < this.results.length ) {
            let r = this.results[checked];
            checked++;
            if (!r.active) continue;
            
            // Maybe we have run out of explosions
            if ( (max !== null) && (max <= 0) ) break;

            // Determine whether to explode the result and roll again!
            if ( DiceTerm.compareResult(r.result, comparison, target) && r.canExplode ) {
                r.exploded = true;
                this.roll();
                this.results[this.results.length-1].canExplode = false;
                if ( max !== null ) max -= 1;
            }
            // Limit recursion if it's a "small explode"
            if ( !recursive && (checked >= initial) ) checked = this.results.length;
            if ( checked > 1000 ) throw new Error("Maximum recursion depth for exploding dice roll exceeded");
        }
    }

    // @override 
    roll({minimize=false, maximize=false}={}) {
        const rand = CONFIG.Dice.randomUniform();
        let result = Math.ceil(rand * this.faces);
        if ( minimize ) result = 1;
        if ( maximize ) result = this.faces;
        const roll = {result, active: true, canExplode: true};
        this.results.push(roll);
        return roll;
    }
}
cyberpunkredDie.MODIFIERS = Die.MODIFIERS;
cyberpunkredDie.MODIFIERS.ix = "invertExplode";
cyberpunkredDie.MODIFIERS.ixo = "invertExplodeOnce";
