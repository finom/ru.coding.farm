define(['exports', 'matreshka'], function (exports, _matreshka) {
	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _MK = _interopRequireDefault(_matreshka);

	describe('MK.Array custom methods', function () {
		it('pulls', function () {
			var arr = new _MK['default'].Array(),
			    removed = undefined;
			arr.push('a', 'b', 'c');
			removed = arr.pull(1);

			expect(removed).toEqual('b');
			expect(arr.toArray()).toEqual(['a', 'c']);
			expect(arr.length).toEqual(2);
		});

		it('pulls object', function () {
			var arr = new _MK['default'].Array(),
			    object1 = {},
			    object2 = {},
			    object3 = {},
			    removed = undefined;

			arr.push(object1, object2, object3);

			removed = arr.pull(object2);

			expect(removed === object2).toBe(true);

			expect(arr.length).toEqual(2);
		});

		it('recreates', function () {
			var arr = new _MK['default'].Array(),
			    object1 = {},
			    object2 = {},
			    object3 = {};

			arr.recreate([object1, object2, object3]);

			expect(arr.length).toEqual(3);
			expect(arr[0] === object1).toBe(true);
			expect(arr[1] === object2).toBe(true);
			expect(arr[2] === object3).toBe(true);

			arr.recreate();

			expect(arr.length).toEqual(0);
			expect(arr[0] === undefined).toBe(true);
			expect(arr[1] === undefined).toBe(true);
			expect(arr[2] === undefined).toBe(true);
		});

		it('emptifies', function () {
			var arr = new _MK['default'].Array(),
			    object1 = {},
			    object2 = {},
			    object3 = {};

			arr.recreate([object1, object2, object3]);

			expect(arr.length).toEqual(3);
			arr.recreate();

			expect(arr.length).toEqual(0);
			expect(arr[0] === undefined).toBe(true);
			expect(arr[1] === undefined).toBe(true);
			expect(arr[2] === undefined).toBe(true);
		});

		it('tracks by _id', function () {
			var arr = new _MK['default'].Array(),
			    object0 = { _id: 0, a: 0 },
			    object1 = { _id: 1, a: 1 },
			    object2 = { _id: 2, a: 2 },
			    object3 = { _id: 0, a: 3 },
			    object4 = { _id: 1, a: 4 },
			    object5 = { _id: 3, a: 5 };

			arr.trackBy = '_id';

			arr.recreate([object0, object1, object2]);

			expect(arr[0] === object0).toBe(true);
			expect(arr[1] === object1).toBe(true);
			expect(arr[2] === object2).toBe(true);

			arr.recreate([object4, object5, object3]);

			expect(arr[0] === object1).toBe(true);
			expect(arr[1] === object5).toBe(true);
			expect(arr[2] === object0).toBe(true);
		});

		it('tracks by _id', function () {
			var arr = new _MK['default'].Array(),
			    object0 = { _id: 0, a: 0 },
			    object1 = { _id: 1, a: 1 },
			    object2 = { _id: 2, a: 2 },
			    object3 = { _id: 0, a: 3 },
			    object4 = { _id: 1, a: 4 },
			    object5 = { _id: 3, a: 5 };

			arr.trackBy = '_id';

			arr.recreate([object0, object1, object2]);

			expect(arr[0] === object0).toBe(true);
			expect(arr[1] === object1).toBe(true);
			expect(arr[2] === object2).toBe(true);

			arr.recreate([object4, object5, object3]);

			expect(arr[0] === object1).toBe(true);
			expect(arr[1] === object5).toBe(true);
			expect(arr[2] === object0).toBe(true);

			expect(arr[0].a).toEqual(4);
			expect(arr[1].a).toEqual(5);
			expect(arr[2].a).toEqual(3);
		});

		it('tracks by $index', function () {
			var arr = new _MK['default'].Array(),
			    object0 = { a: 0 },
			    object1 = { a: 1 },
			    object2 = { a: 2 },
			    object3 = { a: 3 },
			    object4 = { a: 4 },
			    object5 = { a: 5 },
			    object6 = { a: 6 };

			arr.trackBy = '$index';

			arr.recreate([object0, object1, object2]);

			expect(arr[0] === object0).toBe(true);
			expect(arr[1] === object1).toBe(true);
			expect(arr[2] === object2).toBe(true);

			arr.recreate([object3, object4, object5, object6]);

			expect(arr[0] === object0).toBe(true);
			expect(arr[1] === object1).toBe(true);
			expect(arr[2] === object2).toBe(true);
			expect(arr[3] === object6).toBe(true);

			expect(arr[0].a).toEqual(3);
			expect(arr[1].a).toEqual(4);
			expect(arr[2].a).toEqual(5);
			expect(arr[3].a).toEqual(6);
		});
	});
});