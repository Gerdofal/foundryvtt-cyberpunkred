// Just some programming and debugging tools to make life easier

export const _cprLog = function (msg) {
  console.log('CyberpunkRED | ' + msg);
};

/*
 * Recursively merge properties of two objects 
 */
export function mergeWithoutOverwrite(t, s) {
  // Do nothing if they're the same object
  if (t === s) {
    return;
  }
  // Loop through source
  Object.keys(s).forEach(function (key) {
    // Get the value
    var val = s[key];

    // Is it a non-null object reference?
    if (val !== null && typeof val === "object") {
      // If it doesn't exist yet on target, create it
      if (!t.hasOwnProperty(key)) {
        t[key] = {};
      }
      // Recurse into that object
      mergeWithoutOverwrite(t[key], s[key]);


    } else if (!t.hasOwnProperty(key)) {
      // Not a non-null object ref, copy if target doesn't have it
      // Use JSON.stringify to remove any reference
      t[key] = JSON.parse(JSON.stringify(s[key]));
    }
  });
}
