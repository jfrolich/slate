'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isEmpty = _interopDefault(require('is-empty'));
var isPlainObject = _interopDefault(require('is-plain-object'));
var slate = require('slate');

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};













var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/**
 * Create selection point constants, for comparison by reference.
 *
 * @type {Object}
 */

var ANCHOR = {};
var CURSOR = {};
var FOCUS = {};

/**
 *  wrappers for decorator points, for comparison by instanceof,
 *  and for composition into ranges (anchor.combine(focus), etc)
 */

var DecoratorPoint = function DecoratorPoint(_ref, marks) {
  var key = _ref.key,
      data = _ref.data;
  classCallCheck(this, DecoratorPoint);

  _initialiseProps.call(this);

  this._key = key;
  this.marks = marks;
  this.attribs = data || {};
  this.isAtomic = !!this.attribs.atomic;
  delete this.attribs.atomic;
  return this;
};

/**
 * The default Slate hyperscript creator functions.
 *
 * @type {Object}
 */

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.withPosition = function (offset) {
    _this.offset = offset;
    return _this;
  };

  this.addOffset = function (offset) {
    _this.offset += offset;
    return _this;
  };

  this.withKey = function (key) {
    _this.key = key;
    return _this;
  };

  this.combine = function (focus) {
    if (!(focus instanceof DecoratorPoint)) throw new Error('misaligned decorations');
    return slate.Range.create(_extends({
      anchorKey: _this.key,
      focusKey: focus.key,
      anchorOffset: _this.offset,
      focusOffset: focus.offset,
      marks: _this.marks,
      isAtomic: _this.isAtomic
    }, _this.attribs));
  };
};

var CREATORS = {
  anchor: function anchor(tagName, attributes, children) {
    return ANCHOR;
  },
  block: function block(tagName, attributes, children) {
    return slate.Block.create(_extends({}, attributes, {
      nodes: createChildren(children)
    }));
  },
  cursor: function cursor(tagName, attributes, children) {
    return CURSOR;
  },
  document: function document(tagName, attributes, children) {
    return slate.Document.create(_extends({}, attributes, {
      nodes: createChildren(children)
    }));
  },
  focus: function focus(tagName, attributes, children) {
    return FOCUS;
  },
  inline: function inline(tagName, attributes, children) {
    return slate.Inline.create(_extends({}, attributes, {
      nodes: createChildren(children)
    }));
  },
  mark: function mark(tagName, attributes, children) {
    var marks = slate.Mark.createSet([attributes]);
    var nodes = createChildren(children, { marks: marks });
    return nodes;
  },
  decoration: function decoration(tagName, attributes, children) {
    if (attributes.key) {
      return new DecoratorPoint(attributes, [{ type: tagName }]);
    }

    var nodes = createChildren(children, { key: attributes.key });

    nodes[0].__decorations = (nodes[0].__decorations || []).concat([{
      anchorOffset: 0,
      focusOffset: nodes.reduce(function (len, n) {
        return len + n.text.length;
      }, 0),
      marks: [{ type: tagName }],
      isAtomic: !!attributes.data.atomic
    }]);
    return nodes;
  },
  selection: function selection(tagName, attributes, children) {
    return slate.Range.create(attributes);
  },
  value: function value(tagName, attributes, children) {
    var data = attributes.data,
        _attributes$normalize = attributes.normalize,
        normalize = _attributes$normalize === undefined ? true : _attributes$normalize;

    var document = children.find(slate.Document.isDocument);
    var selection = children.find(slate.Range.isRange) || slate.Range.create();
    var props = {};
    var decorations = [];
    var partialDecorations = {};

    // Search the document's texts to see if any of them have the anchor or
    // focus information saved, so we can set the selection.
    if (document) {
      document.getTexts().forEach(function (text) {
        if (text.__anchor != null) {
          props.anchorKey = text.key;
          props.anchorOffset = text.__anchor;
          props.isFocused = true;
        }

        if (text.__focus != null) {
          props.focusKey = text.key;
          props.focusOffset = text.__focus;
          props.isFocused = true;
        }
      });

      // now check for decorations and hoist them to the top
      document.getTexts().forEach(function (text) {
        if (text.__decorations != null) {
          // add in all mark-like (keyless) decorations
          decorations = decorations.concat(text.__decorations.filter(function (d) {
            return d._key === undefined;
          }).map(function (d) {
            return slate.Range.create(_extends({}, d, {
              anchorKey: text.key,
              focusKey: text.key
            }));
          }));

          // store or combine partial decorations (keyed with anchor / focus)
          text.__decorations.filter(function (d) {
            return d._key !== undefined;
          }).forEach(function (partial) {
            if (partialDecorations[partial._key]) {
              decorations.push(partialDecorations[partial._key].combine(partial.withKey(text.key)));

              delete partialDecorations[partial._key];
              return;
            }

            partialDecorations[partial._key] = partial.withKey(text.key);
          });
        }
      });
    }

    // should have no more parital decorations outstanding (all paired)
    if (Object.keys(partialDecorations).length > 0) {
      throw new Error('Slate hyperscript must have both an anchor and focus defined for each keyed decorator.');
    }

    if (props.anchorKey && !props.focusKey) {
      throw new Error('Slate hyperscript must have both `<anchor/>` and `<focus/>` defined if one is defined, but you only defined `<anchor/>`. For collapsed selections, use `<cursor/>`.');
    }

    if (!props.anchorKey && props.focusKey) {
      throw new Error('Slate hyperscript must have both `<anchor/>` and `<focus/>` defined if one is defined, but you only defined `<focus/>`. For collapsed selections, use `<cursor/>`.');
    }

    var value = slate.Value.fromJSON({ data: data, document: document, selection: selection }, { normalize: normalize });

    if (!isEmpty(props)) {
      selection = selection.merge(props).normalize(value.document);
      value = value.set('selection', selection);
    }

    if (decorations.length > 0) {
      decorations = decorations.map(function (d) {
        return d.normalize(value.document);
      });
      decorations = slate.Range.createList(decorations);
      value = value.set('decorations', decorations);
    }

    return value;
  },
  text: function text(tagName, attributes, children) {
    var nodes = createChildren(children, { key: attributes.key });
    return nodes;
  }
};

/**
 * Create a Slate hyperscript function with `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function createHyperscript() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var creators = resolveCreators(options);

  function create(tagName, attributes) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    var creator = creators[tagName];

    if (!creator) {
      throw new Error('No hyperscript creator found for tag: "' + tagName + '"');
    }

    if (attributes == null) {
      attributes = {};
    }

    if (!isPlainObject(attributes)) {
      children = [attributes].concat(children);
      attributes = {};
    }

    children = children.filter(function (child) {
      return Boolean(child);
    }).reduce(function (memo, child) {
      return memo.concat(child);
    }, []);

    var element = creator(tagName, attributes, children);
    return element;
  }

  return create;
}

/**
 * Create an array of `children`, storing selection anchor and focus.
 *
 * @param {Array} children
 * @param {Object} options
 * @return {Array}
 */

function createChildren(children) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var array = [];
  var length = 0;

  // When creating the new node, try to preserve a key if one exists.
  var firstNodeOrText = children.find(function (c) {
    return typeof c !== 'string';
  });
  var firstText = slate.Text.isText(firstNodeOrText) ? firstNodeOrText : null;
  var key = options.key ? options.key : firstText ? firstText.key : undefined;
  var node = slate.Text.create({ key: key, leaves: [{ text: '', marks: options.marks }] });

  // Create a helper to update the current node while preserving any stored
  // anchor or focus information.
  function setNode(next) {
    var _node = node,
        __anchor = _node.__anchor,
        __focus = _node.__focus,
        __decorations = _node.__decorations;

    if (__anchor != null) next.__anchor = __anchor;
    if (__focus != null) next.__focus = __focus;
    if (__decorations != null) next.__decorations = __decorations;
    node = next;
  }

  children.forEach(function (child, index) {
    var isLast = index === children.length - 1;

    // If the child is a non-text node, push the current node and the new child
    // onto the array, then creating a new node for future selection tracking.
    if (slate.Node.isNode(child) && !slate.Text.isText(child)) {
      if (node.text.length || node.__anchor != null || node.__focus != null || node.getMarksAtIndex(0).size) {
        array.push(node);
      }

      array.push(child);

      node = isLast ? null : slate.Text.create({ leaves: [{ text: '', marks: options.marks }] });

      length = 0;
    }

    // If the child is a string insert it into the node.
    if (typeof child == 'string') {
      setNode(node.insertText(node.text.length, child, options.marks));
      length += child.length;
    }

    // If the node is a `Text` add its text and marks to the existing node. If
    // the existing node is empty, and the `key` option wasn't set, preserve the
    // child's key when updating the node.
    if (slate.Text.isText(child)) {
      var __anchor = child.__anchor,
          __focus = child.__focus,
          __decorations = child.__decorations;

      var i = node.text.length;

      if (!options.key && node.text.length == 0) {
        setNode(node.set('key', child.key));
      }

      child.getLeaves().forEach(function (leaf) {
        var marks = leaf.marks;

        if (options.marks) marks = marks.union(options.marks);
        setNode(node.insertText(i, leaf.text, marks));
        i += leaf.text.length;
      });

      if (__anchor != null) node.__anchor = __anchor + length;
      if (__focus != null) node.__focus = __focus + length;

      if (__decorations != null) {
        node.__decorations = (node.__decorations || []).concat(__decorations.map(function (d) {
          return d instanceof DecoratorPoint ? d.addOffset(length) : _extends({}, d, {
            anchorOffset: d.anchorOffset + length,
            focusOffset: d.focusOffset + length
          });
        }));
      }

      length += child.text.length;
    }

    // If the child is a selection object store the current position.
    if (child == ANCHOR || child == CURSOR) node.__anchor = length;
    if (child == FOCUS || child == CURSOR) node.__focus = length;

    // if child is a decorator point, store it as partial decorator
    if (child instanceof DecoratorPoint) {
      node.__decorations = (node.__decorations || []).concat([child.withPosition(length)]);
    }
  });

  // Make sure the most recent node is added.
  if (node != null) {
    array.push(node);
  }

  return array;
}

/**
 * Resolve a set of hyperscript creators an `options` object.
 *
 * @param {Object} options
 * @return {Object}
 */

function resolveCreators(options) {
  var _options$blocks = options.blocks,
      blocks = _options$blocks === undefined ? {} : _options$blocks,
      _options$inlines = options.inlines,
      inlines = _options$inlines === undefined ? {} : _options$inlines,
      _options$marks = options.marks,
      marks = _options$marks === undefined ? {} : _options$marks,
      _options$decorators = options.decorators,
      decorators = _options$decorators === undefined ? {} : _options$decorators;


  var creators = _extends({}, CREATORS, options.creators || {});

  Object.keys(blocks).map(function (key) {
    creators[key] = normalizeNode(key, blocks[key], 'block');
  });

  Object.keys(inlines).map(function (key) {
    creators[key] = normalizeNode(key, inlines[key], 'inline');
  });

  Object.keys(marks).map(function (key) {
    creators[key] = normalizeMark(key, marks[key]);
  });

  Object.keys(decorators).map(function (key) {
    creators[key] = normalizeNode(key, decorators[key], 'decoration');
  });

  return creators;
}

/**
 * Normalize a node creator with `key` and `value`, of `object`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @param {String} object
 * @return {Function}
 */

function normalizeNode(key, value, object) {
  if (typeof value == 'function') {
    return value;
  }

  if (typeof value == 'string') {
    value = { type: value };
  }

  if (isPlainObject(value)) {
    return function (tagName, attributes, children) {
      var attrKey = attributes.key,
          rest = objectWithoutProperties(attributes, ['key']);

      var attrs = _extends({}, value, {
        object: object,
        key: attrKey,
        data: _extends({}, value.data || {}, rest)
      });

      return CREATORS[object](tagName, attrs, children);
    };
  }

  throw new Error('Slate hyperscript ' + object + ' creators can be either functions, objects or strings, but you passed: ' + value);
}

/**
 * Normalize a mark creator with `key` and `value`.
 *
 * @param {String} key
 * @param {Function|Object|String} value
 * @return {Function}
 */

function normalizeMark(key, value) {
  if (typeof value == 'function') {
    return value;
  }

  if (typeof value == 'string') {
    value = { type: value };
  }

  if (isPlainObject(value)) {
    return function (tagName, attributes, children) {
      var attrs = _extends({}, value, {
        data: _extends({}, value.data || {}, attributes)
      });

      return CREATORS.mark(tagName, attrs, children);
    };
  }

  throw new Error('Slate hyperscript mark creators can be either functions, objects or strings, but you passed: ' + value);
}

/**
 * Export.
 *
 * @type {Function}
 */

var index = createHyperscript();

exports.default = index;
exports.createHyperscript = createHyperscript;
//# sourceMappingURL=slate-hyperscript.js.map
