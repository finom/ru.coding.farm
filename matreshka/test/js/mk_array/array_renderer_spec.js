define(['exports', 'matreshka', 'balalaika'], function (exports, _matreshka, _balalaika) {
	'use strict';

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _MK = _interopRequireDefault(_matreshka);

	var _$ = _interopRequireDefault(_balalaika);

	var q = function q(s, c) {
		return (0, _$['default'])(s, c)[0] || null;
	};

	describe('MK.Array#renderer', function () {
		var n = 10;
		function createArr() {
			var Model = (function (_MK$Object) {
				_inherits(Model, _MK$Object);

				function Model() {
					var _this = this;

					_classCallCheck(this, Model);

					for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
						args[_key] = arguments[_key];
					}

					_get(Object.getPrototypeOf(Model.prototype), 'constructor', this).apply(this, args);
					this.on('render', function (evt) {
						return _this.bindNode('x', ':sandbox span', _MK['default'].binders.innerHTML());
					});
				}

				return Model;
			})(_MK['default'].Object);

			var Arr = (function (_MK$Array) {
				_inherits(Arr, _MK$Array);

				function Arr() {
					_classCallCheck(this, Arr);

					for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
						args[_key2] = arguments[_key2];
					}

					_get(Object.getPrototypeOf(Arr.prototype), 'constructor', this).apply(this, args);
					this.Model = Model;
					this.bindNode('sandbox', _$['default'].create('div', {
						attributes: {
							role: 'parent'
						}
					}));
				}

				return Arr;
			})(_MK['default'].Array);

			return new Arr();
		}

		it('renders', function () {
			var arr = createArr(),
			    index = 0;
			arr.itemRenderer = function () {
				return '<div role="child" index="' + index++ + '"><span></span></div>';
			};
			for (var i = 0; i < n; i++) {
				arr.push({
					x: i
				});
			}

			expect(arr.length).toEqual(n);
			expect(index).toEqual(n);
			expect(arr.sandbox.children.length).toEqual(n);
		});

		it('forces rendering', function () {
			var arr = createArr(),
			    index = 0;

			arr.itemRenderer = function () {
				return '<div role="child" index="' + index++ + '"><span></span></div>';
			};

			for (var i = 0; i < n; i++) {
				arr.push({
					x: i
				});
			}

			arr.rerender({
				forceRerender: true
			});

			expect(arr.length).toEqual(n);
			expect(index).toEqual(n * 2);
			expect(arr.sandbox.children.length).toEqual(n);
		});

		it('rerenders when rendered is changed', function () {
			var arr = createArr(),
			    index = 0;

			arr.itemRenderer = function () {
				return '<div role="child" index="' + index++ + '"><span></span></div>';
			};

			for (var i = 0; i < n; i++) {
				arr.push({
					x: i
				});
			}

			arr.itemRenderer = function () {
				return '<div role="child2" index="' + index++ + '"><span></span></div>';
			};

			expect(arr.length).toEqual(n);
			expect(index).toEqual(n * 2);
			expect(arr.sandbox.children.length).toEqual(n);
		});

		it('removes rendered nodes', function () {
			var arr = createArr(),
			    index = 0;

			arr.itemRenderer = function () {
				return '<div role="child" index="' + index++ + '"><span></span></div>';
			};

			for (var i = 0; i < n; i++) {
				arr.push({
					x: i
				});
			}

			arr.recreate();

			expect(arr.length).toEqual(0);
			expect(index).toEqual(n);
			expect(arr.sandbox.children.length).toEqual(0);
		});

		it('renders if silent: true', function () {
			var arr = createArr(),
			    index = 0;

			arr.itemRenderer = function () {
				return '<div role="child" index="' + index++ + '"><span></span></div>';
			};

			for (var i = 0; i < n; i++) {
				arr.push_({
					x: i
				}, {
					silent: true
				});
			}

			expect(arr.length).toEqual(n);
			expect(index).toEqual(n);
			expect(arr.sandbox.children.length).toEqual(n);
		});

		it('uses bindings parser', function () {
			var arr = createArr(),
			    index = 0;

			arr.itemRenderer = function () {
				return '<div role="child3" index="' + index++ + '"><span attr="hey {{x}}"></span></div>';
			};

			for (var i = 0; i < n; i++) {
				arr.push({
					x: i
				});
			}

			expect(q('[attr]', arr[5].sandbox).getAttribute('attr')).toEqual('hey ' + 5);
			expect(arr.length).toEqual(n);
			expect(index).toEqual(n);
			expect(arr.sandbox.children.length).toEqual(n);
		});
	});
});