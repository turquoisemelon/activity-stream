"use strict";

const {Cc, Ci, components} = require("chrome");
const {stack: Cs} = components;

function doGetFile(path, allowNonexistent) {
  try {
    let lf = Cc["@mozilla.org/file/directory_service;1"]
      .getService(Ci.nsIProperties)
      .get("CurWorkD", Ci.nsILocalFile);

    let bits = path.split("/");
    for (let bit of bits.filter(bit => bit)) {
      if (bit !== "..") {
        lf.append(bit);
      } else {
        lf = lf.parent;
      }
    }

    if (!allowNonexistent && !lf.exists()) {
      // Not using do_throw(): caller will continue.
      let stack = Cs.caller;
      console.error(`[${stack.name} : ${stack.lineNumber}] ${lf.path} does not exist`);
    }

    return lf;
  }
  catch (ex) {
    doThrow(ex.toString(), Cs.caller);
  }

  return null;
}

function doThrow(error, stack) {
  // If we didn't get passed a stack, maybe the error has one
  // otherwise get it from our call context
  stack = stack || error.stack || Cs.caller;

  let filename = "";
  if (stack instanceof Ci.nsIStackFrame) {
    filename = stack.filename;
  } else if (error.fileName) {
    filename = error.fileName;
  }

  throw(new Error(`Error at ${filename}`));
}

exports.doGetFile = doGetFile;
exports.doThrow = doThrow;
