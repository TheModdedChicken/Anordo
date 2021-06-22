module.exports.evalProp = (prop1, prop2, gate) => {
  if (typeof prop2 == "string") {
    if (prop1 === prop2) return true;
    return false;
  } else if (typeof prop2 == "object") {
    var falseComNum = 0;
    for (var i = 0; i < prop2.length; i++) {
      if (gate === "and") {
        if (prop1 !== prop2[i]) falseComNum++;
      } else if (gate === "or") {
        if (prop1 !== prop2[i]) return false;
      }
    }

    if (falseComNum === prop2.length) return false;

    return true;
  }
}