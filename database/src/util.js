const fs = require("fs");

function isObject(data) {
  return (!Array.isArray(data) && !(data instanceof Map) && (typeof data == "object"));
}

module.exports.isObject = isObject;

module.exports.isValidValue = function (value) {
  return ((["string", "number", "undefined", "boolean"]).includes(typeof value) || isObject(value) || Array.isArray(value));
}

module.exports.getObject = function (data, key, seperator) {
  if (key.includes(seperator || ".")) {
    let result = data;

    for (let i = 0; i < key.split(seperator || ".").length; i++) {
      let element = key.split(seperator || ".")[i];

      if (typeof result == "undefined") {
        break;
      } else {
        result = result[element];
      }
    }

    return result;
  } else {
    return data[key];
  }
}

module.exports.setObject = function (data, key, value, seperator) {
  if (key.includes(seperator || ".")) {
   
    let elements = key.split(seperator || ".");
    let lastEl = elements.pop();
    let lastObj = elements.reduce((a, b) => {
      if (typeof a[b] == "undefined") a[b] = {};

      return a[b];
    }, data);

    lastObj[lastEl] = value;

    return data;
  } else {
    data[key] = value;

    return data;
  }
}

module.exports.deleteObject = function (data, key, seperator) {
  if (key.includes(seperator || ".")) {
    let evalString = "delete data";

    for (let i = 0; i < key.split(seperator || ".").length; i++) {
      evalString += `["${key.split(seperator || ".")[i]}"]`;
    }

    eval(evalString);

    return data;
  } else {
    delete data[key];

    return data;
  }
}
