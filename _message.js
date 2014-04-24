'use strict';

var mixin          = require('es5-ext/object/mixin')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d')
  , compile        = require('es6-template-strings/compile')
  , resolve        = require('es6-template-strings/resolve')

  , forEach = Array.prototype.forEach
  , Message, tag;

tag = function (literals/*, …substitutions*/) {
	var args = arguments, result = [];
	forEach.call(literals, function (value, i) {
		if (!i) {
			result.push(value);
			return;
		}
		result.push(args[i], value);
	});
	return result;
};

Message = module.exports = function (template, inserts) {
	var message = tag.apply(null, resolve(compile(template), inserts));
	if (setPrototypeOf) return setPrototypeOf(message, Message.prototype);
	return mixin(message, Message.prototype);
};

Message.prototype = [];
Object.defineProperties(Message.prototype, {
	constructor: d(Message),
	toString: d(function () { return this.join(''); })
});
