define([
	'matreshka_dir/core/var/core',
	'matreshka_dir/core/initmk'
], function(core, initMK) {
	"use strict";
	var define, defineGetter, defineSetter;

	define = core.define = function(object, key, descriptor) {
		if (!object || typeof object != 'object') return object;

		var i;

		if (typeof key == 'object') {
			for (i in key) {
				define(object, i, key[i]);
			}

			return object;
		}

		Object.defineProperty(object, key, descriptor);

		return object;
	};

	defineGetter = core.defineGetter = function(object, key, getter) {
		if (!object || typeof object != 'object') return object;

		initMK(object);

		var i,
			special;

		if (typeof key == 'object') {
			for (i in key)
				if (key.hasOwnProperty(i)) {
					defineGetter(object, i, key[i]);
				}

			return object;
		}

		special = core._defineSpecial(object, key);

		special.getter = function() {
			return getter.call(object, {
				value: special.value,
				key: key,
				self: object
			});
		};

		return object;
	};

	defineSetter = core.defineSetter = function(object, key, setter) {
		if (!object || typeof object != 'object') return object;

		initMK(object);

		var i;

		if (typeof key == 'object') {
			for (i in key)
				if (key.hasOwnProperty(i)) {
					defineSetter(object, i, key[i]);
				}

			return object;
		}

		core._defineSpecial(object, key).setter = function(v) {
			return setter.call(object, v, {
				value: v,
				key: key,
				self: object
			});
		};

		return object;
	};
});
