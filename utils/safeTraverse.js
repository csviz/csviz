// https://github.com/medikoo/es5-ext/blob/master/object/safe-traverse.js
'use strict';

var value = function (value) {
  if (value == null) throw new TypeError("Cannot use null or undefined");
  return value;
};

module.exports = function (obj, ...names) {
  var length, current = 1;
  value(obj);
  length = names.length;
  if (!length) return obj;
  while (current < length) {
    obj = obj[arguments[current++]];
    if (obj == null) return undefined;
  }
  return obj[arguments[current]];
};
