'use strict';

var toPosInt = require('es5-ext/number/to-pos-integer')
  , firstKey = require('es5-ext/object/first-key')
  , d        = require('d')
  , Message  = require('./_message')

  , isArray = Array.isArray, defineProperties = Object.defineProperties;

module.exports = function (locale) {
	var self, resolve;
	self = function (keyS/*, keyP, n, inserts*/) {
		var inserts, template, keyP, key, n;
		keyS = String(keyS);
		if (arguments.length > 2) { // Plural
			inserts = arguments[3];
			keyP = String(arguments[1]);
			key = 'n\0' + keyS + '\0' + keyP;
			n = toPosInt(arguments[2]);
			template = resolve.call(this, key, n);
			if (template === key) template = (n > 1) ? keyP : keyS;
		} else {
			inserts = arguments[1];
			template = resolve.call(this, keyS);
		}
		if (!inserts) return template;
		return new Message(template, inserts);
	};
	resolve = function (key, n) {
		var locale = self.locale, context, template, isMulti;
		if (!locale) return key;
		if ((locale = locale[key]) == null) return key;
		if (typeof locale === 'string') return locale;
		isMulti = (n != null);
		if (isMulti && (typeof locale === 'function')) return locale(n);
		if (!isMulti || !isArray(locale)) {
			context = ((this == null) || (this === self)) ? 'default' : this;
			if (locale[context] != null) {
				template = locale[context];
			} else if (locale.default != null) {
				template = locale.default;
			} else {
				context = firstKey(locale);
				if (context == null) return key;
				template = locale[context];
			}
		} else {
			template = locale;
		}
		if (!isMulti) return String(template);
		if (typeof template === 'function') return template(n);
		if (isArray(template)) {
			if (n) --n;
			while (n && (template[n] == null)) --n;
			if (template[n] != null) return template[n];
			return key;
		}
		return String(template);
	};

	return defineProperties(self, {
		locale: d(locale),
		_: d(self)
	});
};
