define([
	'matreshka_dir/core/var/sym',
	'matreshka_dir/core/initmk',
	'matreshka_dir/matreshka.class'
], function(sym, initMK, MK) {
	"use strict";
	var renderOne = function(_this, item, evt) {
		if (!item || typeof item != 'object' || !_this.renderIfPossible || evt.dontRender) return;

		if (!item[sym]) {
			initMK(item);
		}

		var id = _this[sym].id,
			renderer = item.renderer || _this.itemRenderer,
			rendererContext = renderer === item.renderer ? item : _this,
			arraysNodes = item[sym].arraysNodes = item[sym].arraysNodes || {},
			node = arraysNodes[id],
			$node,
			template,
			itemEvt,
			sandboxes,
			i;

		if (!renderer) return;

		if (evt.moveSandbox) {
			if (node = item.bound(['sandbox'])) {
				arraysNodes[id] = node;
			}
		}

		if (node && evt.forceRerender) {
			sandboxes = item.boundAll(['sandbox']);

			for (i = 0; i < sandboxes.length; i++) {
				if (node == sandboxes[i]) {
					item.unbindNode('sandbox', node);
					break;
				}
			}

			node = arraysNodes[id] = null;
		}

		if (!node) {
			if (typeof renderer == 'function') {
				renderer = renderer.call(rendererContext, item);
			}

			if (typeof renderer == 'string' && !/<|{{/.test(renderer)) {
				template = MK._getNodes(rendererContext, renderer);
				if (template = template && template[0]) {
					template = template.innerHTML;
				} else {
					throw Error('renderer node is missing: ' + renderer);
				}
			} else {
				template = renderer;
			}

			if (typeof template == 'string') {
				if (_this.useBindingsParser !== false) {
					$node = MK.parseBindings(item, template);
				} else {
					$node = MK.$.parseHTML(MK.trim(template));
				}
			} else {
				$node = MK.$(template);
			}

			if (item.bindRenderedAsSandbox !== false && $node.length) {
				MK.bindNode(item, 'sandbox', $node);
			}

			node = $node[0];

			arraysNodes[id] = node;

			itemEvt = {
				node: node,
				$nodes: $node,
				self: item,
				parentArray: _this
			};

			item.onRender && item.onRender(itemEvt);
			_this.onItemRender && _this.onItemRender(item, itemEvt);

			MK._fastTrigger(item, 'render', itemEvt);
		}

		return node;
	};
	return function(_this, evt) {
		var props = _this[sym],
			id = props.id,
			l = _this.length,
			node,
			i,
			item,
			added = evt.added,
			removed = evt.removed,
			container = props.special.container || props.special.sandbox;

		container = container && container.$nodes;
		container = container && container[0];

		if (!container) return _this;

		switch (evt.method) {
			case 'push':
				for (i = l - added.length; i < l; i++) {
					if (node = renderOne(_this, _this[i], evt)) {
						container.appendChild(node);
					}
				}

				break;
			case 'unshift':
				for (i = added.length - 1; i + 1; i--) {
					if (node = renderOne(_this, _this[i], evt)) {
						if (container.firstChild) {
							container.insertBefore(node, container.firstChild);
						} else {
							container.appendChild(node);
						}
					}
				}

				break;
			case 'pull':
			case 'pop':
			case 'shift':
				for (i = 0; i < removed.length; i++) {
					item = removed[i];
					node = item && item[sym] && item[sym].arraysNodes && item[sym].arraysNodes[id];
					if (node) {
						container.removeChild(node);
					}
				}

				break;
			case 'sort':
			case 'reverse':
				for (i = 0; i < l; i++) {
					item = _this[i];
					if (node = item && item[sym] && item[sym].arraysNodes[id]) {
						container.appendChild(node);
					}
				}

				break;
			case 'rerender':
				if (evt.forceRerender) {
					for (i = 0; i < l; i++) {
						item = _this[i];
						node = item && item[sym] && item[sym].arraysNodes && item[sym].arraysNodes[id];
						if (node) {
							container.removeChild(node);
						}
					}
				}

				for (i = 0; i < l; i++) {
					if (node = renderOne(_this, _this[i], evt)) {
						container.appendChild(node);
					}
				}

				break;
			case 'recreate':
			case 'splice':
				for (i = 0; i < removed.length; i++) {
					item = removed[i];
					node = item && item[sym] && item[sym].arraysNodes && item[sym].arraysNodes[id];
					if (node) {
						container.removeChild(node);
					}
				}

				for (i = 0; i < l; i++) {
					if (node = renderOne(_this, _this[i], evt)) {
						container.appendChild(node);
					}
				}

				break;
		}

		return _this;
	};
});
