import isPlainObject from 'is-plain-object';
import logger from 'slate-dev-logger';
import { List, Map as Map$1, Record, Set, OrderedSet, Stack } from 'immutable';
import direction from 'direction';
import { reverse } from 'esrever';
import Debug from 'debug';
import isEqual from 'lodash/isEqual';
import { CHILD_OBJECT_INVALID, CHILD_REQUIRED, CHILD_TYPE_INVALID, CHILD_UNKNOWN, FIRST_CHILD_OBJECT_INVALID, FIRST_CHILD_TYPE_INVALID, LAST_CHILD_OBJECT_INVALID, LAST_CHILD_TYPE_INVALID, NODE_DATA_INVALID, NODE_IS_VOID_INVALID, NODE_MARK_INVALID, NODE_OBJECT_INVALID, NODE_TEXT_INVALID, NODE_TYPE_INVALID, PARENT_OBJECT_INVALID, PARENT_TYPE_INVALID } from 'slate-schema-violations';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import isEmpty from 'is-empty';

/**
 * Slate-specific model types.
 *
 * @type {Object}
 */

var MODEL_TYPES = {
  BLOCK: '@@__SLATE_BLOCK__@@',
  CHANGE: '@@__SLATE_CHANGE__@@',
  CHARACTER: '@@__SLATE_CHARACTER__@@',
  DOCUMENT: '@@__SLATE_DOCUMENT__@@',
  HISTORY: '@@__SLATE_HISTORY__@@',
  INLINE: '@@__SLATE_INLINE__@@',
  LEAF: '@@__SLATE_LEAF__@@',
  MARK: '@@__SLATE_MARK__@@',
  OPERATION: '@@__SLATE_OPERATION__@@',
  RANGE: '@@__SLATE_RANGE__@@',
  SCHEMA: '@@__SLATE_SCHEMA__@@',
  STACK: '@@__SLATE_STACK__@@',
  TEXT: '@@__SLATE_TEXT__@@',
  VALUE: '@@__SLATE_VALUE__@@'

  /**
   * Export type identification function
   *
   * @param {string} type
   * @param {any} any
   * @return {boolean}
   */

};function isType(type, any) {
  return !!(any && any[MODEL_TYPES[type]]);
}

/**
 * An auto-incrementing index for generating keys.
 *
 * @type {Number}
 */

var n = void 0;

/**
 * The global key generating function.
 *
 * @type {Function}
 */

var generate = void 0;

/**
 * Create a key, using a provided key if available.
 *
 * @param {String|Void} key
 * @return {String}
 */

function create(key) {
  if (key == null) {
    return generate();
  }

  if (typeof key === 'string') {
    return key;
  }

  throw new Error('Keys must be strings, but you passed: ' + key);
}

/**
 * Set a different unique ID generating `function`.
 *
 * @param {Function} func
 */

function setGenerator(func) {
  generate = func;
}

/**
 * Reset the key generating function to its initial state.
 */

function resetGenerator() {
  n = 0;
  generate = function generate() {
    return '' + n++;
  };
}

/**
 * Set the initial state.
 */

resetGenerator();

/**
 * Export.
 *
 * @type {Object}
 */

var KeyUtils = {
  create: create,
  setGenerator: setGenerator,
  resetGenerator: resetGenerator
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  data: new Map$1(),
  isVoid: false,
  key: undefined,
  nodes: new List(),
  type: undefined

  /**
   * Block.
   *
   * @type {Block}
   */

};
var Block = function (_Record) {
  inherits(Block, _Record);

  function Block() {
    classCallCheck(this, Block);
    return possibleConstructorReturn(this, (Block.__proto__ || Object.getPrototypeOf(Block)).apply(this, arguments));
  }

  createClass(Block, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the block.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        type: this.type,
        isVoid: this.isVoid,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'block';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the block is empty.
     * Returns true if block is not void and all it's children nodes are empty.
     * Void node is never empty, regardless of it's content.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.isVoid && !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the block's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Block` from `attrs`.
     *
     * @param {Object|String|Block} attrs
     * @return {Block}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Block.isBlock(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Block.fromJSON(attrs);
      }

      throw new Error('`Block.create` only accepts objects, strings or blocks, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Blocks` from `attrs`.
     *
     * @param {Array<Block|Object>|List<Block|Object>} attrs
     * @return {List<Block>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(attrs) || Array.isArray(attrs)) {
        var list = new List(attrs.map(Block.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts arrays or lists, but you passed it: ' + attrs);
    }

    /**
     * Create a `Block` from a JSON `object`.
     *
     * @param {Object|Block} object
     * @return {Block}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Block.isBlock(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$isVoid = object.isVoid,
          isVoid = _object$isVoid === undefined ? false : _object$isVoid,
          _object$key = object.key,
          key = _object$key === undefined ? KeyUtils.create() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Block.fromJSON` requires a `type` string.');
      }

      var block = new Block({
        key: key,
        type: type,
        isVoid: !!isVoid,
        data: Map$1(data),
        nodes: Block.createChildren(nodes)
      });

      return block;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Block`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isBlockList',


    /**
     * Check if `any` is a block list.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isBlockList(any) {
      return List.isList(any) && any.every(function (item) {
        return Block.isBlock(item);
      });
    }
  }]);
  return Block;
}(Record(DEFAULTS));

/**
 * Attach a pseudo-symbol for type checking.
 */

Block.fromJS = Block.fromJSON;
Block.isBlock = isType.bind(null, 'BLOCK');
Block.prototype[MODEL_TYPES.BLOCK] = true;

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$1 = {
  data: new Map$1(),
  isVoid: false,
  key: undefined,
  nodes: new List(),
  type: undefined

  /**
   * Inline.
   *
   * @type {Inline}
   */

};
var Inline = function (_Record) {
  inherits(Inline, _Record);

  function Inline() {
    classCallCheck(this, Inline);
    return possibleConstructorReturn(this, (Inline.__proto__ || Object.getPrototypeOf(Inline)).apply(this, arguments));
  }

  createClass(Inline, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the inline.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        type: this.type,
        isVoid: this.isVoid,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'inline';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the inline is empty.
     * Returns true if inline is not void and all it's children nodes are empty.
     * Void node is never empty, regardless of it's content.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.isVoid && !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the inline's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Inline` with `attrs`.
     *
     * @param {Object|String|Inline} attrs
     * @return {Inline}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Inline.isInline(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Inline.fromJSON(attrs);
      }

      throw new Error('`Inline.create` only accepts objects, strings or inlines, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Inlines` from an array.
     *
     * @param {Array<Inline|Object>|List<Inline|Object>} elements
     * @return {List<Inline>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = new List(elements.map(Inline.create));
        return list;
      }

      throw new Error('`Inline.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Inline` from a JSON `object`.
     *
     * @param {Object|Inline} object
     * @return {Inline}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Inline.isInline(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$isVoid = object.isVoid,
          isVoid = _object$isVoid === undefined ? false : _object$isVoid,
          _object$key = object.key,
          key = _object$key === undefined ? KeyUtils.create() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Inline.fromJS` requires a `type` string.');
      }

      var inline = new Inline({
        key: key,
        type: type,
        isVoid: !!isVoid,
        data: new Map$1(data),
        nodes: Inline.createChildren(nodes)
      });

      return inline;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Inline`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isInlineList',


    /**
     * Check if `any` is a list of inlines.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isInlineList(any) {
      return List.isList(any) && any.every(function (item) {
        return Inline.isInline(item);
      });
    }
  }]);
  return Inline;
}(Record(DEFAULTS$1));

/**
 * Attach a pseudo-symbol for type checking.
 */

Inline.fromJS = Inline.fromJSON;
Inline.isInline = isType.bind(null, 'INLINE');
Inline.prototype[MODEL_TYPES.INLINE] = true;

/**
 * Data.
 *
 * This isn't an immutable record, it's just a thin wrapper around `Map` so that
 * we can allow for more convenient creation.
 *
 * @type {Object}
 */

var Data = function () {
  function Data() {
    classCallCheck(this, Data);
  }

  createClass(Data, null, [{
    key: 'create',

    /**
     * Create a new `Data` with `attrs`.
     *
     * @param {Object|Data|Map} attrs
     * @return {Data} data
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Map$1.isMap(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Data.fromJSON(attrs);
      }

      throw new Error('`Data.create` only accepts objects or maps, but you passed it: ' + attrs);
    }

    /**
     * Create a `Data` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Data}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      return new Map$1(object);
    }

    /**
     * Alias `fromJS`.
     */

  }]);
  return Data;
}();

/**
 * Export.
 *
 * @type {Object}
 */

Data.fromJS = Data.fromJSON;

/**
 * GLOBAL: True if memoization should is enabled.
 *
 * @type {Boolean}
 */

var ENABLED = true;

/**
 * GLOBAL: Changing this cache key will clear all previous cached results.
 *
 * @type {Number}
 */

var CACHE_KEY = 0;

/**
 * The leaf node of a cache tree. Used to support variable argument length. A
 * unique object, so that native Maps will key it by reference.
 *
 * @type {Object}
 */

var LEAF = {};

/**
 * A value to represent a memoized undefined value. Allows efficient value
 * retrieval using Map.get only.
 *
 * @type {Object}
 */

var UNDEFINED = {};

/**
 * Default value for unset keys in native Maps
 *
 * @type {Undefined}
 */

var UNSET = undefined;

/**
 * Memoize all of the `properties` on a `object`.
 *
 * @param {Object} object
 * @param {Array} properties
 * @return {Record}
 */

function memoize(object, properties) {
  var _loop = function _loop(property) {
    var original = object[property];

    if (!original) {
      throw new Error("Object does not have a property named \"" + property + "\".");
    }

    object[property] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // If memoization is disabled, call into the original method.
      if (!ENABLED) return original.apply(this, args);

      // If the cache key is different, previous caches must be cleared.
      if (CACHE_KEY !== this.__cache_key) {
        this.__cache_key = CACHE_KEY;
        this.__cache = new Map(); // eslint-disable-line no-undef,no-restricted-globals
        this.__cache_no_args = {};
      }

      if (!this.__cache) {
        this.__cache = new Map(); // eslint-disable-line no-undef,no-restricted-globals
      }

      if (!this.__cache_no_args) {
        this.__cache_no_args = {};
      }

      var takesArguments = args.length !== 0;

      var cachedValue = void 0;
      var keys = void 0;

      if (takesArguments) {
        keys = [property].concat(args);
        cachedValue = getIn(this.__cache, keys);
      } else {
        cachedValue = this.__cache_no_args[property];
      }

      // If we've got a result already, return it.
      if (cachedValue !== UNSET) {
        return cachedValue === UNDEFINED ? undefined : cachedValue;
      }

      // Otherwise calculate what it should be once and cache it.
      var value = original.apply(this, args);
      var v = value === undefined ? UNDEFINED : value;

      if (takesArguments) {
        this.__cache = setIn(this.__cache, keys, v);
      } else {
        this.__cache_no_args[property] = v;
      }

      return value;
    };
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var property = _step.value;

      _loop(property);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/**
 * Get a value at a key path in a tree of Map.
 *
 * If not set, returns UNSET.
 * If the set value is undefined, returns UNDEFINED.
 *
 * @param {Map} map
 * @param {Array} keys
 * @return {Any|UNSET|UNDEFINED}
 */

function getIn(map, keys) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      map = map.get(key);
      if (map === UNSET) return UNSET;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return map.get(LEAF);
}

/**
 * Set a value at a key path in a tree of Map, creating Maps on the go.
 *
 * @param {Map} map
 * @param {Array} keys
 * @param {Any} value
 * @return {Map}
 */

function setIn(map, keys, value) {
  var parent = map;
  var child = void 0;

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      child = parent.get(key);

      // If the path was not created yet...
      if (child === UNSET) {
        child = new Map(); // eslint-disable-line no-undef,no-restricted-globals
        parent.set(key, child);
      }

      parent = child;
    }

    // The whole path has been created, so set the value to the bottom most map.
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  child.set(LEAF, value);
  return map;
}

/**
 * In DEV mode, clears the previously memoized values, globally.
 *
 * @return {Void}
 */

function resetMemoization() {
  CACHE_KEY++;

  if (CACHE_KEY >= Number.MAX_SAFE_INTEGER) {
    CACHE_KEY = 0;
  }
}

/**
 * In DEV mode, enable or disable the use of memoize values, globally.
 *
 * @param {Boolean} enabled
 * @return {Void}
 */

function useMemoization(enabled) {
  ENABLED = enabled;
}

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$2 = {
  data: new Map$1(),
  type: undefined

  /**
   * Mark.
   *
   * @type {Mark}
   */

};
var Mark = function (_Record) {
  inherits(Mark, _Record);

  function Mark() {
    classCallCheck(this, Mark);
    return possibleConstructorReturn(this, (Mark.__proto__ || Object.getPrototypeOf(Mark)).apply(this, arguments));
  }

  createClass(Mark, [{
    key: 'getComponent',


    /**
     * Get the component for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Component|Void}
     */

    value: function getComponent(schema) {
      return schema.__getComponent(this);
    }

    /**
     * Return a JSON representation of the mark.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        type: this.type,
        data: this.data.toJSON()
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     */

    get: function get$$1() {
      return 'mark';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Mark` with `attrs`.
     *
     * @param {Object|Mark} attrs
     * @return {Mark}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { type: attrs };
      }

      if (isPlainObject(attrs)) {
        return Mark.fromJSON(attrs);
      }

      throw new Error('`Mark.create` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Create a set of marks.
     *
     * @param {Array<Object|Mark>} elements
     * @return {Set<Mark>}
     */

  }, {
    key: 'createSet',
    value: function createSet(elements) {
      if (Set.isSet(elements) || Array.isArray(elements)) {
        var marks = new Set(elements.map(Mark.create));
        return marks;
      }

      if (elements == null) {
        return Set();
      }

      throw new Error('`Mark.createSet` only accepts sets, arrays or null, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable mark properties from `attrs`.
     *
     * @param {Object|String|Mark} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Mark.isMark(attrs)) {
        return {
          data: attrs.data,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = Data.create(attrs.data);
        return props;
      }

      throw new Error('`Mark.createProperties` only accepts objects, strings or marks, but you passed it: ' + attrs);
    }

    /**
     * Create a `Mark` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Mark}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          type = object.type;


      if (typeof type != 'string') {
        throw new Error('`Mark.fromJS` requires a `type` string.');
      }

      var mark = new Mark({
        type: type,
        data: new Map$1(data)
      });

      return mark;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Mark`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isMarkSet',


    /**
     * Check if `any` is a set of marks.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isMarkSet(any) {
      return Set.isSet(any) && any.every(function (item) {
        return Mark.isMark(item);
      });
    }
  }]);
  return Mark;
}(Record(DEFAULTS$2));

/**
 * Attach a pseudo-symbol for type checking.
 */

Mark.fromJS = Mark.fromJSON;
Mark.isMark = isType.bind(null, 'MARK');
Mark.prototype[MODEL_TYPES.MARK] = true;

/**
 * Memoize read methods.
 */

memoize(Mark.prototype, ['getComponent']);

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes = {};

/**
 * Mix in the changes that pass through to their at-range equivalents because
 * they don't have any effect on the selection.
 */

var PROXY_TRANSFORMS = ['deleteBackward', 'deleteCharBackward', 'deleteLineBackward', 'deleteWordBackward', 'deleteForward', 'deleteCharForward', 'deleteWordForward', 'deleteLineForward', 'setBlocks', 'setInlines', 'splitInline', 'unwrapBlock', 'unwrapInline', 'wrapBlock', 'wrapInline'];

PROXY_TRANSFORMS.forEach(function (method) {
  Changes[method] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var value = change.value;
    var selection = value.selection;

    var methodAtRange = method + 'AtRange';
    change[methodAtRange].apply(change, [selection].concat(args));

    if (method.match(/Backward$/)) {
      change.collapseToStart();
    } else if (method.match(/Forward$/)) {
      change.collapseToEnd();
    }
  };
});

Changes.setBlock = function () {
  logger.deprecate('slate@0.33.0', 'The `setBlock` method of Slate changes has been renamed to `setBlocks`.');

  Changes.setBlocks.apply(Changes, arguments);
};

Changes.setInline = function () {
  logger.deprecate('slate@0.33.0', 'The `setInline` method of Slate changes has been renamed to `setInlines`.');

  Changes.setInlines.apply(Changes, arguments);
};

/**
 * Add a `mark` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document,
      selection = value.selection;


  if (selection.isExpanded) {
    change.addMarkAtRange(selection, mark);
  } else if (selection.marks) {
    var marks = selection.marks.add(mark);
    var sel = selection.set('marks', marks);
    change.select(sel);
  } else {
    var _marks = document.getActiveMarksAtRange(selection).add(mark);
    var _sel = selection.set('marks', _marks);
    change.select(_sel);
  }
};

/**
 * Add a list of `marks` to the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.addMarks = function (change, marks) {
  marks.forEach(function (mark) {
    return change.addMark(mark);
  });
};

/**
 * Delete at the current selection.
 *
 * @param {Change} change
 */

Changes.delete = function (change) {
  var value = change.value;
  var selection = value.selection;

  change.deleteAtRange(selection);

  // Ensure that the selection is collapsed to the start, because in certain
  // cases when deleting across inline nodes, when splitting the inline node the
  // end point of the selection will end up after the split point.
  change.collapseToStart();
};

/**
 * Insert a `block` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Block} block
 */

Changes.insertBlock = function (change, block) {
  block = Block.create(block);
  var value = change.value;
  var selection = value.selection;

  change.insertBlockAtRange(selection, block);

  // If the node was successfully inserted, update the selection.
  var node = change.value.document.getNode(block.key);
  if (node) change.collapseToEndOf(node);
};

/**
 * Insert a `fragment` at the current selection.
 *
 * @param {Change} change
 * @param {Document} fragment
 */

Changes.insertFragment = function (change, fragment) {
  if (!fragment.nodes.size) return;

  var value = change.value;
  var _value = value,
      document = _value.document,
      selection = _value.selection;
  var _value2 = value,
      startText = _value2.startText,
      endText = _value2.endText,
      startInline = _value2.startInline;

  var lastText = fragment.getLastText();
  var lastInline = fragment.getClosestInline(lastText.key);
  var firstChild = fragment.nodes.first();
  var lastChild = fragment.nodes.last();
  var keys = document.getTexts().map(function (text) {
    return text.key;
  });
  var isAppending = !startInline || selection.hasEdgeAtStartOf(startText) || selection.hasEdgeAtEndOf(endText);

  var isInserting = firstChild.hasBlockChildren() || lastChild.hasBlockChildren();

  change.insertFragmentAtRange(selection, fragment);
  value = change.value;
  document = value.document;

  var newTexts = document.getTexts().filter(function (n) {
    return !keys.includes(n.key);
  });
  var newText = isAppending ? newTexts.last() : newTexts.takeLast(2).first();

  if (newText && (lastInline || isInserting)) {
    change.select(selection.collapseToEndOf(newText));
  } else if (newText) {
    change.select(selection.collapseToStartOf(newText).move(lastText.text.length));
  } else {
    change.select(selection.collapseToStart().move(lastText.text.length));
  }
};

/**
 * Insert an `inline` at the current selection.
 *
 * @param {Change} change
 * @param {String|Object|Inline} inline
 */

Changes.insertInline = function (change, inline) {
  inline = Inline.create(inline);
  var value = change.value;
  var selection = value.selection;

  change.insertInlineAtRange(selection, inline);

  // If the node was successfully inserted, update the selection.
  var node = change.value.document.getNode(inline.key);
  if (node) change.collapseToEndOf(node);
};

/**
 * Insert a string of `text` with optional `marks` at the current selection.
 *
 * @param {Change} change
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 */

Changes.insertText = function (change, text, marks) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  marks = marks || selection.marks || document.getInsertMarksAtRange(selection);
  change.insertTextAtRange(selection, text, marks);

  // If the text was successfully inserted, and the selection had marks on it,
  // unset the selection's marks.
  if (selection.marks && document != change.value.document) {
    change.select({ marks: null });
  }
};

/**
 * Split the block node at the current selection, to optional `depth`.
 *
 * @param {Change} change
 * @param {Number} depth (optional)
 */

Changes.splitBlock = function (change) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var value = change.value;
  var selection = value.selection,
      document = value.document;

  var marks = selection.marks || document.getInsertMarksAtRange(selection);
  change.splitBlockAtRange(selection, depth).collapseToEnd();

  if (marks && marks.size !== 0) {
    change.select({ marks: marks });
  }
};

/**
 * Remove a `mark` from the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.removeMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document,
      selection = value.selection;


  if (selection.isExpanded) {
    change.removeMarkAtRange(selection, mark);
  } else if (selection.marks) {
    var marks = selection.marks.remove(mark);
    var sel = selection.set('marks', marks);
    change.select(sel);
  } else {
    var _marks2 = document.getActiveMarksAtRange(selection).remove(mark);
    var _sel2 = selection.set('marks', _marks2);
    change.select(_sel2);
  }
};

/**
 * Replace an `oldMark` with a `newMark` in the characters in the current selection.
 *
 * @param {Change} change
 * @param {Mark} oldMark
 * @param {Mark} newMark
 */

Changes.replaceMark = function (change, oldMark, newMark) {
  change.removeMark(oldMark);
  change.addMark(newMark);
};

/**
 * Add or remove a `mark` from the characters in the current selection,
 * depending on whether it's already there.
 *
 * @param {Change} change
 * @param {Mark} mark
 */

Changes.toggleMark = function (change, mark) {
  mark = Mark.create(mark);
  var value = change.value;

  var exists = value.activeMarks.has(mark);

  if (exists) {
    change.removeMark(mark);
  } else {
    change.addMark(mark);
  }
};

/**
 * Wrap the current selection with prefix/suffix.
 *
 * @param {Change} change
 * @param {String} prefix
 * @param {String} suffix
 */

Changes.wrapText = function (change, prefix) {
  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : prefix;
  var value = change.value;
  var selection = value.selection;

  change.wrapTextAtRange(selection, prefix, suffix);

  // If the selection was collapsed, it will have moved the start offset too.
  if (selection.isCollapsed) {
    change.moveStart(0 - prefix.length);
  }

  // Adding the suffix will have pushed the end of the selection further on, so
  // we need to move it back to account for this.
  change.moveEnd(0 - suffix.length);

  // There's a chance that the selection points moved "through" each other,
  // resulting in a now-incorrect selection direction.
  if (selection.isForward != change.value.selection.isForward) {
    change.flip();
  }
};

/**
 * Dependencies.
 */

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$3 = {
  data: new Map$1(),
  key: undefined,
  nodes: new List()

  /**
   * Document.
   *
   * @type {Document}
   */

};
var Document = function (_Record) {
  inherits(Document, _Record);

  function Document() {
    classCallCheck(this, Document);
    return possibleConstructorReturn(this, (Document.__proto__ || Object.getPrototypeOf(Document)).apply(this, arguments));
  }

  createClass(Document, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the document.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        data: this.data.toJSON(),
        nodes: this.nodes.toArray().map(function (n) {
          return n.toJSON(options);
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'document';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check if the document is empty.
     * Returns true if all it's children nodes are empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return !this.nodes.some(function (child) {
        return !child.isEmpty;
      });
    }

    /**
     * Get the concatenated text of all the document's children.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getText();
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Document` with `attrs`.
     *
     * @param {Object|Array|List|Text} attrs
     * @return {Document}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Document.isDocument(attrs)) {
        return attrs;
      }

      if (List.isList(attrs) || Array.isArray(attrs)) {
        attrs = { nodes: attrs };
      }

      if (isPlainObject(attrs)) {
        return Document.fromJSON(attrs);
      }

      throw new Error('`Document.create` only accepts objects, arrays, lists or documents, but you passed it: ' + attrs);
    }

    /**
     * Create a `Document` from a JSON `object`.
     *
     * @param {Object|Document} object
     * @return {Document}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Document.isDocument(object)) {
        return object;
      }

      var _object$data = object.data,
          data = _object$data === undefined ? {} : _object$data,
          _object$key = object.key,
          key = _object$key === undefined ? KeyUtils.create() : _object$key,
          _object$nodes = object.nodes,
          nodes = _object$nodes === undefined ? [] : _object$nodes;


      var document = new Document({
        key: key,
        data: new Map$1(data),
        nodes: Document.createChildren(nodes)
      });

      return document;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Document`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }]);
  return Document;
}(Record(DEFAULTS$3));

/**
 * Attach a pseudo-symbol for type checking.
 */

Document.fromJS = Document.fromJSON;
Document.isDocument = isType.bind(null, 'DOCUMENT');
Document.prototype[MODEL_TYPES.DOCUMENT] = true;

/**
 * Compare paths `a` and `b` to see which is before or after.
 *
 * @param {List} a
 * @param {List} b
 * @return {Number|Null}
 */

function compare(a, b) {
  // PERF: if the paths are the same we can exit early.
  if (a.size !== b.size) return null;

  for (var i = 0; i < a.size; i++) {
    var av = a.get(i);
    var bv = b.get(i);

    // If a's value is ever less than b's, it's before.
    if (av < bv) return -1;

    // If b's value is ever less than a's, it's after.
    if (av > bv) return 1;
  }

  // Otherwise they were equal the whole way, it's the same.
  return 0;
}

/**
 * Create a path from `attrs`.
 *
 * @param {Array|List} attrs
 * @return {List}
 */

function create$1(attrs) {
  if (attrs == null) {
    return null;
  }

  if (List.isList(attrs)) {
    return attrs;
  }

  if (Array.isArray(attrs)) {
    return List(attrs);
  }

  throw new Error('Paths can only be created from arrays or lists, but you passed: ' + attrs);
}

/**
 * Crop paths `a` and `b` to an equal size, defaulting to the shortest.
 *
 * @param {List} a
 * @param {List} b
 */

function crop(a, b) {
  var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : min(a, b);

  var ca = a.slice(0, size);
  var cb = b.slice(0, size);
  return [ca, cb];
}

/**
 * Decrement a `path` by `n` at `index`, defaulting to the last index.
 *
 * @param {List} path
 * @param {Number} n
 * @param {Number} index
 */

function decrement(path) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : path.size - 1;

  return increment(path, 0 - n, index);
}

/**
 * Increment a `path` by `n` at `index`, defaulting to the last index.
 *
 * @param {List} path
 * @param {Number} n
 * @param {Number} index
 */

function increment(path) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : path.size - 1;

  var value = path.get(index);
  var newValue = value + n;
  var newPath = path.set(index, newValue);
  return newPath;
}

/**
 * Is a `path` above another `target` path?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isAbove(path, target) {
  var _crop = crop(path, target),
      _crop2 = slicedToArray(_crop, 2),
      p = _crop2[0],
      t = _crop2[1];

  return path.size < target.size && compare(p, t) === 0;
}

/**
 * Is a `path` after another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isAfter(path, target) {
  var _crop3 = crop(path, target),
      _crop4 = slicedToArray(_crop3, 2),
      p = _crop4[0],
      t = _crop4[1];

  return compare(p, t) === 1;
}

/**
 * Is a `path` before another `target` path in a document?
 *
 * @param {List} path
 * @param {List} target
 * @return {Boolean}
 */

function isBefore(path, target) {
  var _crop5 = crop(path, target),
      _crop6 = slicedToArray(_crop5, 2),
      p = _crop6[0],
      t = _crop6[1];

  return compare(p, t) === -1;
}

/**
 * Lift a `path` to refer to its parent.
 *
 * @param {List} path
 * @return {Array}
 */

function lift(path) {
  var parent = path.slice(0, -1);
  return parent;
}

/**
 * Get the maximum length of paths `a` and `b`.
 *
 * @param {List} path
 * @param {List} path
 * @return {Number}
 */

function max(a, b) {
  var n = Math.max(a.size, b.size);
  return n;
}

/**
 * Get the minimum length of paths `a` and `b`.
 *
 * @param {List} path
 * @param {List} path
 * @return {Number}
 */

function min(a, b) {
  var n = Math.min(a.size, b.size);
  return n;
}

/**
 * Get the common ancestor path of path `a` and path `b`.
 *
 * @param {List} a
 * @param {List} b
 * @return {List}
 */

function relate(a, b) {
  var array = [];

  for (var i = 0; i < a.size && i < b.size; i++) {
    var av = a.get(i);
    var bv = b.get(i);

    // If the values aren't equal, they've diverged and don't share an ancestor.
    if (av !== bv) break;

    // Otherwise, the current value is still a common ancestor.
    array.push(av);
  }

  var path = create$1(array);
  return path;
}

/**
 * Export.
 *
 * @type {Object}
 */

var PathUtils = {
  compare: compare,
  create: create$1,
  crop: crop,
  decrement: decrement,
  increment: increment,
  isAbove: isAbove,
  isAfter: isAfter,
  isBefore: isBefore,
  lift: lift,
  max: max,
  min: min,
  relate: relate
};

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$4 = {
  anchorKey: null,
  anchorOffset: 0,
  anchorPath: null,
  focusKey: null,
  focusOffset: 0,
  focusPath: null,
  isAtomic: false,
  isBackward: null,
  isFocused: false,
  marks: null

  /**
   * Range.
   *
   * @type {Range}
   */

};
var Range = function (_Record) {
  inherits(Range, _Record);

  function Range() {
    classCallCheck(this, Range);
    return possibleConstructorReturn(this, (Range.__proto__ || Object.getPrototypeOf(Range)).apply(this, arguments));
  }

  createClass(Range, [{
    key: 'hasAnchorAtStartOf',


    /**
     * Check whether anchor point of the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    value: function hasAnchorAtStartOf(node) {
      // PERF: Do a check for a `0` offset first since it's quickest.
      if (this.anchorOffset != 0) return false;
      var first = getFirstText(node);
      return this.anchorKey == first.key;
    }

    /**
     * Check whether anchor point of the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorAtEndOf',
    value: function hasAnchorAtEndOf(node) {
      var last = getLastText(node);
      return this.anchorKey == last.key && this.anchorOffset == last.text.length;
    }

    /**
     * Check whether the anchor edge of a range is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorBetween',
    value: function hasAnchorBetween(node, start, end) {
      return this.anchorOffset <= end && start <= this.anchorOffset && this.hasAnchorIn(node);
    }

    /**
     * Check whether the anchor edge of a range is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasAnchorIn',
    value: function hasAnchorIn(node) {
      return node.object == 'text' ? node.key == this.anchorKey : this.anchorKey != null && node.hasDescendant(this.anchorKey);
    }

    /**
     * Check whether focus point of the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtEndOf',
    value: function hasFocusAtEndOf(node) {
      var last = getLastText(node);
      return this.focusKey == last.key && this.focusOffset == last.text.length;
    }

    /**
     * Check whether focus point of the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusAtStartOf',
    value: function hasFocusAtStartOf(node) {
      if (this.focusOffset != 0) return false;
      var first = getFirstText(node);
      return this.focusKey == first.key;
    }

    /**
     * Check whether the focus edge of a range is in a `node` and at an
     * offset between `start` and `end`.
     *
     * @param {Node} node
     * @param {Number} start
     * @param {Number} end
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusBetween',
    value: function hasFocusBetween(node, start, end) {
      return start <= this.focusOffset && this.focusOffset <= end && this.hasFocusIn(node);
    }

    /**
     * Check whether the focus edge of a range is in a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'hasFocusIn',
    value: function hasFocusIn(node) {
      return node.object == 'text' ? node.key == this.focusKey : this.focusKey != null && node.hasDescendant(this.focusKey);
    }

    /**
     * Check whether the range is at the start of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtStartOf',
    value: function isAtStartOf(node) {
      return this.isCollapsed && this.hasAnchorAtStartOf(node);
    }

    /**
     * Check whether the range is at the end of a `node`.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'isAtEndOf',
    value: function isAtEndOf(node) {
      return this.isCollapsed && this.hasAnchorAtEndOf(node);
    }

    /**
     * Focus the range.
     *
     * @return {Range}
     */

  }, {
    key: 'focus',
    value: function focus() {
      return this.merge({
        isFocused: true
      });
    }

    /**
     * Blur the range.
     *
     * @return {Range}
     */

  }, {
    key: 'blur',
    value: function blur() {
      return this.merge({
        isFocused: false
      });
    }

    /**
     * Unset the range.
     *
     * @return {Range}
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      return this.merge({
        anchorKey: null,
        anchorOffset: 0,
        anchorPath: null,
        focusKey: null,
        focusOffset: 0,
        focusPath: null,
        isFocused: false,
        isBackward: false
      });
    }

    /**
     * Flip the range.
     *
     * @return {Range}
     */

  }, {
    key: 'flip',
    value: function flip() {
      return this.merge({
        anchorKey: this.focusKey,
        anchorOffset: this.focusOffset,
        anchorPath: this.focusPath,
        focusKey: this.anchorKey,
        focusOffset: this.anchorOffset,
        focusPath: this.anchorPath,
        isBackward: this.isBackward == null ? null : !this.isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Range}
     */

  }, {
    key: 'moveAnchor',
    value: function moveAnchor() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          isBackward = this.isBackward;

      var anchorOffset = this.anchorOffset + n;
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: anchorKey == focusKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the anchor offset `n` characters.
     *
     * @param {Number} n (optional)
     * @return {Range}
     */

  }, {
    key: 'moveFocus',
    value: function moveFocus() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          focusKey = this.focusKey,
          isBackward = this.isBackward;

      var focusOffset = this.focusOffset + n;
      return this.merge({
        focusOffset: focusOffset,
        isBackward: focusKey == anchorKey ? anchorOffset > focusOffset : isBackward
      });
    }

    /**
     * Move the range's anchor point to a new `key` or `path` and `offset`.
     *
     * @param {String|List} key or path
     * @param {Number} offset
     * @return {Range}
     */

  }, {
    key: 'moveAnchorTo',
    value: function moveAnchorTo(key, offset) {
      var anchorKey = this.anchorKey,
          focusKey = this.focusKey,
          focusOffset = this.focusOffset,
          anchorPath = this.anchorPath,
          focusPath = this.focusPath,
          isBackward = this.isBackward;


      if (typeof key === 'string') {
        var isAnchor = key === anchorKey;
        var isFocus = key === focusKey;
        return this.merge({
          anchorKey: key,
          anchorPath: isFocus ? focusPath : isAnchor ? anchorPath : null,
          anchorOffset: offset,
          isBackward: isFocus ? offset > focusOffset : isAnchor ? isBackward : null
        });
      } else {
        var path = key;
        var _isAnchor = path && path.equals(anchorPath);
        var _isFocus = path && path.equals(focusPath);
        return this.merge({
          anchorPath: path,
          anchorKey: _isAnchor ? anchorKey : _isFocus ? focusKey : null,
          anchorOffset: offset,
          isBackward: _isFocus ? offset > focusOffset : _isAnchor ? isBackward : null
        });
      }
    }

    /**
     * Move the range's focus point to a new `key` or `path` and `offset`.
     *
     * @param {String|List} key or path
     * @param {Number} offset
     * @return {Range}
     */

  }, {
    key: 'moveFocusTo',
    value: function moveFocusTo(key, offset) {
      var focusKey = this.focusKey,
          anchorKey = this.anchorKey,
          anchorOffset = this.anchorOffset,
          anchorPath = this.anchorPath,
          focusPath = this.focusPath,
          isBackward = this.isBackward;


      if (typeof key === 'string') {
        var isAnchor = key === anchorKey;
        var isFocus = key === focusKey;
        return this.merge({
          focusKey: key,
          focusPath: isAnchor ? anchorPath : isFocus ? focusPath : null,
          focusOffset: offset,
          isBackward: isAnchor ? offset < anchorOffset : isFocus ? isBackward : null
        });
      } else {
        var path = key;
        var _isAnchor2 = path && path.equals(anchorPath);
        var _isFocus2 = path && path.equals(focusPath);
        return this.merge({
          focusPath: path,
          focusKey: _isFocus2 ? focusKey : _isAnchor2 ? anchorKey : null,
          focusOffset: offset,
          isBackward: _isAnchor2 ? offset < anchorOffset : _isFocus2 ? isBackward : null
        });
      }
    }

    /**
     * Move the range to `anchorOffset`.
     *
     * @param {Number} anchorOffset
     * @return {Range}
     */

  }, {
    key: 'moveAnchorOffsetTo',
    value: function moveAnchorOffsetTo(anchorOffset) {
      return this.merge({
        anchorOffset: anchorOffset,
        isBackward: this.anchorKey == this.focusKey ? anchorOffset > this.focusOffset : this.isBackward
      });
    }

    /**
     * Move the range to `focusOffset`.
     *
     * @param {Number} focusOffset
     * @return {Range}
     */

  }, {
    key: 'moveFocusOffsetTo',
    value: function moveFocusOffsetTo(focusOffset) {
      return this.merge({
        focusOffset: focusOffset,
        isBackward: this.anchorKey == this.focusKey ? this.anchorOffset > focusOffset : this.isBackward
      });
    }

    /**
     * Move the range to `anchorOffset` and `focusOffset`.
     *
     * @param {Number} anchorOffset
     * @param {Number} focusOffset (optional)
     * @return {Range}
     */

  }, {
    key: 'moveOffsetsTo',
    value: function moveOffsetsTo(anchorOffset) {
      var focusOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : anchorOffset;

      return this.moveAnchorOffsetTo(anchorOffset).moveFocusOffsetTo(focusOffset);
    }

    /**
     * Move the focus point to the anchor point.
     *
     * @return {Range}
     */

  }, {
    key: 'moveToAnchor',
    value: function moveToAnchor() {
      return this.moveFocusTo(this.anchorKey, this.anchorOffset);
    }

    /**
     * Move the anchor point to the focus point.
     *
     * @return {Range}
     */

  }, {
    key: 'moveToFocus',
    value: function moveToFocus() {
      return this.moveAnchorTo(this.focusKey, this.focusOffset);
    }

    /**
     * Move the range's anchor point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveAnchorToStartOf',
    value: function moveAnchorToStartOf(node) {
      node = getFirstText(node);
      return this.moveAnchorTo(node.key, 0);
    }

    /**
     * Move the range's anchor point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveAnchorToEndOf',
    value: function moveAnchorToEndOf(node) {
      node = getLastText(node);
      return this.moveAnchorTo(node.key, node.text.length);
    }

    /**
     * Move the range's focus point to the start of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveFocusToStartOf',
    value: function moveFocusToStartOf(node) {
      node = getFirstText(node);
      return this.moveFocusTo(node.key, 0);
    }

    /**
     * Move the range's focus point to the end of a `node`.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'moveFocusToEndOf',
    value: function moveFocusToEndOf(node) {
      node = getLastText(node);
      return this.moveFocusTo(node.key, node.text.length);
    }

    /**
     * Move to the entire range of `start` and `end` nodes.
     *
     * @param {Node} start
     * @param {Node} end (optional)
     * @return {Range}
     */

  }, {
    key: 'moveToRangeOf',
    value: function moveToRangeOf(start) {
      var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;

      var range = this.isBackward ? this.flip() : this;
      return range.moveAnchorToStartOf(start).moveFocusToEndOf(end);
    }

    /**
     * Normalize the range, relative to a `node`, ensuring that the anchor
     * and focus nodes of the range always refer to leaf text nodes.
     *
     * @param {Node} node
     * @return {Range}
     */

  }, {
    key: 'normalize',
    value: function normalize(node) {
      var range = this;
      var anchorKey = range.anchorKey,
          anchorOffset = range.anchorOffset,
          anchorPath = range.anchorPath,
          focusKey = range.focusKey,
          focusOffset = range.focusOffset,
          focusPath = range.focusPath,
          isBackward = range.isBackward;


      var anchorOffsetType = typeof anchorOffset === 'undefined' ? 'undefined' : _typeof(anchorOffset);
      var focusOffsetType = typeof focusOffset === 'undefined' ? 'undefined' : _typeof(focusOffset);

      if (anchorOffsetType != 'number' || focusOffsetType != 'number') {
        logger.warn('The range offsets should be numbers, but they were of type "' + anchorOffsetType + '" and "' + focusOffsetType + '".');
      }

      // If either point in the range is unset, make sure it is fully unset.
      if (anchorKey == null && anchorPath == null || focusKey == null && focusPath == null) {
        return range.merge({
          anchorKey: null,
          anchorOffset: 0,
          anchorPath: null,
          focusKey: null,
          focusOffset: 0,
          focusPath: null,
          isBackward: false
        });
      }

      // Get the anchor and focus nodes.
      var anchorNode = node.getNode(anchorKey || anchorPath);
      var focusNode = node.getNode(focusKey || focusPath);

      // If the range is malformed, warn and zero it out.
      if (!anchorNode || !focusNode) {
        logger.warn('The range was invalid and was reset. The range in question was:', range);

        var first = node.getFirstText();
        var path = first && node.getPath(first.key);
        return range.merge({
          anchorKey: first ? first.key : null,
          anchorOffset: 0,
          anchorPath: first ? path : null,
          focusKey: first ? first.key : null,
          focusOffset: 0,
          focusPath: first ? path : null,
          isBackward: false
        });
      }

      // If the anchor node isn't a text node, match it to one.
      if (anchorNode.object != 'text') {
        logger.warn('The range anchor was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', anchorNode);

        var anchorText = anchorNode.getTextAtOffset(anchorOffset);
        var offset = anchorNode.getOffset(anchorText.key);
        anchorOffset = anchorOffset - offset;
        anchorNode = anchorText;
      }

      // If the focus node isn't a text node, match it to one.
      if (focusNode.object != 'text') {
        logger.warn('The range focus was set to a Node that is not a Text node. This should not happen and can degrade performance. The node in question was:', focusNode);

        var focusText = focusNode.getTextAtOffset(focusOffset);
        var _offset = focusNode.getOffset(focusText.key);
        focusOffset = focusOffset - _offset;
        focusNode = focusText;
      }

      anchorKey = anchorNode.key;
      focusKey = focusNode.key;
      anchorPath = node.getPath(anchorKey);
      focusPath = node.getPath(focusKey);

      // If `isBackward` is not set, derive it.
      if (isBackward == null) {
        var result = PathUtils.compare(anchorPath, focusPath);
        isBackward = result === 0 ? anchorOffset > focusOffset : result === 1;
      }

      // Merge in any updated properties.
      return range.merge({
        anchorKey: anchorKey,
        anchorOffset: anchorOffset,
        anchorPath: anchorPath,
        focusKey: focusKey,
        focusOffset: focusOffset,
        focusPath: focusPath,
        isBackward: isBackward
      });
    }

    /**
     * Return a JSON representation of the range.
     *
     * @param {Object} options
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        anchorKey: this.anchorKey,
        anchorOffset: this.anchorOffset,
        anchorPath: this.anchorPath && this.anchorPath.toArray(),
        focusKey: this.focusKey,
        focusOffset: this.focusOffset,
        focusPath: this.focusPath && this.focusPath.toArray(),
        isAtomic: this.isAtomic,
        isBackward: this.isBackward,
        isFocused: this.isFocused,
        marks: this.marks == null ? null : this.marks.toArray().map(function (m) {
          return m.toJSON();
        })
      };

      if (!options.preserveKeys) {
        delete object.anchorKey;
        delete object.focusKey;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'range';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Check whether the range is blurred.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get$$1() {
      return !this.isFocused;
    }

    /**
     * Check whether the range is collapsed.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get$$1() {
      return this.anchorKey == this.focusKey && this.anchorOffset == this.focusOffset;
    }

    /**
     * Check whether the range is expanded.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get$$1() {
      return !this.isCollapsed;
    }

    /**
     * Check whether the range is forward.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get$$1() {
      return this.isBackward == null ? null : !this.isBackward;
    }

    /**
     * Check whether the range's keys are set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isSet',
    get: function get$$1() {
      return this.anchorKey != null && this.focusKey != null || this.anchorPath != null && this.focusPath != null;
    }

    /**
     * Check whether the range's keys are not set.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isUnset',
    get: function get$$1() {
      return !this.isSet;
    }

    /**
     * Get the start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get$$1() {
      return this.isBackward ? this.focusKey : this.anchorKey;
    }

    /**
     * Get the start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get$$1() {
      return this.isBackward ? this.focusOffset : this.anchorOffset;
    }

    /**
     * Get the start path.
     *
     * @return {String}
     */

  }, {
    key: 'startPath',
    get: function get$$1() {
      return this.isBackward ? this.focusPath : this.anchorPath;
    }

    /**
     * Get the end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get$$1() {
      return this.isBackward ? this.anchorKey : this.focusKey;
    }

    /**
     * Get the end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get$$1() {
      return this.isBackward ? this.anchorOffset : this.focusOffset;
    }

    /**
     * Get the end path.
     *
     * @return {String}
     */

  }, {
    key: 'endPath',
    get: function get$$1() {
      return this.isBackward ? this.anchorPath : this.focusPath;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Range` with `attrs`.
     *
     * @param {Object|Range} attrs
     * @return {Range}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Range.isRange(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Range.fromJSON(attrs);
      }

      throw new Error('`Range.create` only accepts objects or ranges, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Ranges` from `elements`.
     *
     * @param {Array<Range|Object>|List<Range|Object>} elements
     * @return {List<Range>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = new List(elements.map(Range.create));
        return list;
      }

      throw new Error('`Range.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable range properties from `attrs`.
     *
     * @param {Object|String|Range} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Range.isRange(a)) {
        return {
          anchorKey: a.anchorKey,
          anchorOffset: a.anchorOffset,
          anchorPath: a.anchorPath,
          focusKey: a.focusKey,
          focusOffset: a.focusOffset,
          focusPath: a.focusPath,
          isAtomic: a.isAtomic,
          isBackward: a.isBackward,
          isFocused: a.isFocused,
          marks: a.marks
        };
      }

      if (isPlainObject(a)) {
        var p = {};
        if ('anchorKey' in a) p.anchorKey = a.anchorKey;
        if ('anchorOffset' in a) p.anchorOffset = a.anchorOffset;
        if ('anchorPath' in a) p.anchorPath = PathUtils.create(a.anchorPath);
        if ('focusKey' in a) p.focusKey = a.focusKey;
        if ('focusOffset' in a) p.focusOffset = a.focusOffset;
        if ('focusPath' in a) p.focusPath = PathUtils.create(a.focusPath);
        if ('isAtomic' in a) p.isAtomic = a.isAtomic;
        if ('isBackward' in a) p.isBackward = a.isBackward;
        if ('isFocused' in a) p.isFocused = a.isFocused;
        if ('marks' in a) p.marks = a.marks == null ? null : Mark.createSet(a.marks);

        // If only a path is set, or only a key is set, ensure that the other is
        // set to null so that it can be normalized back to the right value.
        // Otherwise we won't realize that the path and key don't match anymore.
        if ('anchorPath' in a && !('anchorKey' in a)) p.anchorKey = null;
        if ('anchorKey' in a && !('anchorPath' in a)) p.anchorPath = null;
        if ('focusPath' in a && !('focusKey' in a)) p.focusKey = null;
        if ('focusKey' in a && !('focusPath' in a)) p.focusPath = null;

        return p;
      }

      throw new Error('`Range.createProperties` only accepts objects or ranges, but you passed it: ' + a);
    }

    /**
     * Create a `Range` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Range}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$anchorKey = object.anchorKey,
          anchorKey = _object$anchorKey === undefined ? null : _object$anchorKey,
          _object$anchorOffset = object.anchorOffset,
          anchorOffset = _object$anchorOffset === undefined ? 0 : _object$anchorOffset,
          _object$anchorPath = object.anchorPath,
          anchorPath = _object$anchorPath === undefined ? null : _object$anchorPath,
          _object$focusKey = object.focusKey,
          focusKey = _object$focusKey === undefined ? null : _object$focusKey,
          _object$focusOffset = object.focusOffset,
          focusOffset = _object$focusOffset === undefined ? 0 : _object$focusOffset,
          _object$focusPath = object.focusPath,
          focusPath = _object$focusPath === undefined ? null : _object$focusPath,
          _object$isAtomic = object.isAtomic,
          isAtomic = _object$isAtomic === undefined ? false : _object$isAtomic,
          _object$isBackward = object.isBackward,
          isBackward = _object$isBackward === undefined ? null : _object$isBackward,
          _object$isFocused = object.isFocused,
          isFocused = _object$isFocused === undefined ? false : _object$isFocused,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? null : _object$marks;


      var range = new Range({
        anchorKey: anchorKey,
        anchorOffset: anchorOffset,
        anchorPath: PathUtils.create(anchorPath),
        focusKey: focusKey,
        focusOffset: focusOffset,
        focusPath: PathUtils.create(focusPath),
        isAtomic: isAtomic,
        isBackward: isBackward,
        isFocused: isFocused,
        marks: marks == null ? null : new Set(marks.map(Mark.fromJSON))
      });

      return range;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isRange',


    /**
     * Check if an `obj` is a `Range`.
     *
     * @param {Any} obj
     * @return {Boolean}
     */

    value: function isRange(obj) {
      return !!(obj && obj[MODEL_TYPES.RANGE]);
    }
  }]);
  return Range;
}(Record(DEFAULTS$4));

/**
 * Attach a pseudo-symbol for type checking.
 */

Range.fromJS = Range.fromJSON;
Range.prototype[MODEL_TYPES.RANGE] = true;

/**
 * Mix in some "move" convenience methods.
 */

var MOVE_METHODS = [['move', ''], ['move', 'To'], ['move', 'ToStartOf'], ['move', 'ToEndOf']];

MOVE_METHODS.forEach(function (_ref) {
  var _ref2 = slicedToArray(_ref, 2),
      p = _ref2[0],
      s = _ref2[1];

  Range.prototype['' + p + s] = function () {
    var _ref3;

    return (_ref3 = this[p + 'Anchor' + s].apply(this, arguments))[p + 'Focus' + s].apply(_ref3, arguments);
  };
});

/**
 * Mix in the "start", "end" and "edge" convenience methods.
 */

var EDGE_METHODS = [['has', 'AtStartOf', true], ['has', 'AtEndOf', true], ['has', 'Between', true], ['has', 'In', true], ['collapseTo', ''], ['move', ''], ['moveTo', ''], ['move', 'To'], ['move', 'OffsetTo']];

EDGE_METHODS.forEach(function (_ref4) {
  var _ref5 = slicedToArray(_ref4, 3),
      p = _ref5[0],
      s = _ref5[1],
      hasEdge = _ref5[2];

  var anchor = p + 'Anchor' + s;
  var focus = p + 'Focus' + s;

  Range.prototype[p + 'Start' + s] = function () {
    return this.isBackward ? this[focus].apply(this, arguments) : this[anchor].apply(this, arguments);
  };

  Range.prototype[p + 'End' + s] = function () {
    return this.isBackward ? this[anchor].apply(this, arguments) : this[focus].apply(this, arguments);
  };

  if (hasEdge) {
    Range.prototype[p + 'Edge' + s] = function () {
      return this[anchor].apply(this, arguments) || this[focus].apply(this, arguments);
    };
  }
});

/**
 * Mix in some aliases for convenience / parallelism with the browser APIs.
 */

var ALIAS_METHODS = [['collapseTo', 'moveTo'], ['collapseToAnchor', 'moveToAnchor'], ['collapseToFocus', 'moveToFocus'], ['collapseToStart', 'moveToStart'], ['collapseToEnd', 'moveToEnd'], ['collapseToStartOf', 'moveToStartOf'], ['collapseToEndOf', 'moveToEndOf'], ['extend', 'moveFocus'], ['extendTo', 'moveFocusTo'], ['extendToStartOf', 'moveFocusToStartOf'], ['extendToEndOf', 'moveFocusToEndOf']];

ALIAS_METHODS.forEach(function (_ref6) {
  var _ref7 = slicedToArray(_ref6, 2),
      alias = _ref7[0],
      method = _ref7[1];

  Range.prototype[alias] = function () {
    return this[method].apply(this, arguments);
  };
});

/**
 * Get the first text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getFirstText(node) {
  return node.object == 'text' ? node : node.getFirstText();
}

/**
 * Get the last text of a `node`.
 *
 * @param {Node} node
 * @return {Text}
 */

function getLastText(node) {
  return node.object == 'text' ? node : node.getLastText();
}

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$5 = {
  marks: new Set(),
  text: ''

  /**
   * Character.
   *
   * @type {Character}
   */

};
var Character = function (_Record) {
  inherits(Character, _Record);

  function Character() {
    classCallCheck(this, Character);
    return possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).apply(this, arguments));
  }

  createClass(Character, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the character.
     *
     * @return {Object}
     */

    value: function toJSON() {
      var object = {
        object: this.object,
        text: this.text,
        marks: this.marks.toArray().map(function (m) {
          return m.toJSON();
        })
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'character';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a `Character` with `attrs`.
     *
     * @param {Object|String|Character} attrs
     * @return {Character}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Character.isCharacter(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if (isPlainObject(attrs)) {
        return Character.fromJSON(attrs);
      }

      throw new Error('`Character.create` only accepts objects, strings or characters, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Characters` from `elements`.
     *
     * @param {String|Array<Object|Character|String>|List<Object|Character|String>} elements
     * @return {List<Character>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (typeof elements == 'string') {
        elements = elements.split('');
      }

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = new List(elements.map(Character.create));
        return list;
      }

      throw new Error('`Block.createList` only accepts strings, arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Character` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Character}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var text = object.text,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? [] : _object$marks;


      if (typeof text != 'string') {
        throw new Error('`Character.fromJSON` requires a block `text` string.');
      }

      var character = new Character({
        text: text,
        marks: new Set(marks)
      });

      return character;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Character`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isCharacterList',


    /**
     * Check if `any` is a character list.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isCharacterList(any) {
      return List.isList(any) && any.every(function (item) {
        return Character.isCharacter(item);
      });
    }
  }]);
  return Character;
}(Record(DEFAULTS$5));

/**
 * Attach a pseudo-symbol for type checking.
 */

Character.fromJS = Character.fromJSON;
Character.isCharacter = isType.bind(null, 'CHARACTER');
Character.prototype[MODEL_TYPES.CHARACTER] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$6 = {
  marks: Set(),
  text: ''

  /**
   * Leaf.
   *
   * @type {Leaf}
   */

};
var Leaf = function (_Record) {
  inherits(Leaf, _Record);

  function Leaf() {
    classCallCheck(this, Leaf);
    return possibleConstructorReturn(this, (Leaf.__proto__ || Object.getPrototypeOf(Leaf)).apply(this, arguments));
  }

  createClass(Leaf, [{
    key: 'getCharacters',


    /**
     * Return leaf as a list of characters
     *
     * @return {List<Character>}
     */

    value: function getCharacters() {
      logger.deprecate('slate@0.34.0', 'The `characters` property of Slate objects is deprecated');

      var marks = this.marks;

      var characters = Character.createList(this.text.split('').map(function (char) {
        return Character.create({
          text: char,
          marks: marks
        });
      }));

      return characters;
    }

    /**
     * Update a `mark` at leaf, replace with newMark
     *
     * @param {Mark} mark
     * @param {Mark} newMark
     * @returns {Leaf}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(mark, newMark) {
      var marks = this.marks;

      if (newMark.equals(mark)) return this;
      if (!marks.has(mark)) return this;
      var newMarks = marks.withMutations(function (collection) {
        collection.remove(mark).add(newMark);
      });
      return this.set('marks', newMarks);
    }

    /**
     * Add a `set` of marks at `index` and `length`.
     *
     * @param {Set<Mark>} set
     * @returns {Text}
     */

  }, {
    key: 'addMarks',
    value: function addMarks(set$$1) {
      var marks = this.marks;

      return this.set('marks', marks.union(set$$1));
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Mark} mark
     * @returns {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(mark) {
      var marks = this.marks;

      return this.set('marks', marks.remove(mark));
    }

    /**
     * Return a JSON representation of the leaf.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        text: this.text,
        marks: this.marks.toArray().map(function (m) {
          return m.toJSON();
        })
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'leaf';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Leaf` with `attrs`.
     *
     * @param {Object|Leaf} attrs
     * @return {Leaf}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Leaf.isLeaf(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { text: attrs };
      }

      if (isPlainObject(attrs)) {
        return Leaf.fromJSON(attrs);
      }

      throw new Error('`Leaf.create` only accepts objects, strings or leaves, but you passed it: ' + attrs);
    }

    /**
     * Create a valid List of `Leaf` from `leaves`
     *
     * @param {List<Leaf>} leaves
     * @return {List<Leaf>}
     */

  }, {
    key: 'createLeaves',
    value: function createLeaves(leaves) {
      if (leaves.size <= 1) return leaves;

      var invalid = false;

      // TODO: we can make this faster with [List] and then flatten
      var result = List().withMutations(function (cache) {
        // Search from the leaves left end to find invalid node;
        leaves.findLast(function (leaf, index) {
          var firstLeaf = cache.first();

          // If the first leaf of cache exist, check whether the first leaf is connectable with the current leaf
          if (firstLeaf) {
            // If marks equals, then the two leaves can be connected
            if (firstLeaf.marks.equals(leaf.marks)) {
              invalid = true;
              cache.set(0, firstLeaf.set('text', '' + leaf.text + firstLeaf.text));
              return;
            }

            // If the cached leaf is empty, drop the empty leaf with the upcoming leaf
            if (firstLeaf.text === '') {
              invalid = true;
              cache.set(0, leaf);
              return;
            }

            // If the current leaf is empty, drop the leaf
            if (leaf.text === '') {
              invalid = true;
              return;
            }
          }

          cache.unshift(leaf);
        });
      });

      if (!invalid) return leaves;
      return result;
    }

    /**
     * Split a list of leaves to two lists; if the leaves are valid leaves, the returned leaves are also valid
     * Corner Cases:
     *   1. if offset is smaller than 0, then return [List(), leaves]
     *   2. if offset is bigger than the text length, then return [leaves, List()]
     *
     * @param {List<Leaf> leaves
     * @return {Array<List<Leaf>>}
     */

  }, {
    key: 'splitLeaves',
    value: function splitLeaves(leaves, offset) {
      if (offset < 0) return [List(), leaves];

      if (leaves.size === 0) {
        return [List(), List()];
      }

      var endOffset = 0;
      var index = -1;
      var left = void 0,
          right = void 0;

      leaves.find(function (leaf) {
        index++;
        var startOffset = endOffset;
        var text = leaf.text;

        endOffset += text.length;

        if (endOffset < offset) return false;
        if (startOffset > offset) return false;

        var length = offset - startOffset;
        left = leaf.set('text', text.slice(0, length));
        right = leaf.set('text', text.slice(length));
        return true;
      });

      if (!left) return [leaves, List()];

      if (left.text === '') {
        if (index === 0) {
          return [List.of(left), leaves];
        }

        return [leaves.take(index), leaves.skip(index)];
      }

      if (right.text === '') {
        if (index === leaves.size - 1) {
          return [leaves, List.of(right)];
        }

        return [leaves.take(index + 1), leaves.skip(index + 1)];
      }

      return [leaves.take(index).push(left), leaves.skip(index + 1).unshift(right)];
    }

    /**
     * Create a `Leaf` list from `attrs`.
     *
     * @param {Array<Leaf|Object>|List<Leaf|Object>} attrs
     * @return {List<Leaf>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(attrs) || Array.isArray(attrs)) {
        var list = new List(attrs.map(Leaf.create));
        return list;
      }

      throw new Error('`Leaf.createList` only accepts arrays or lists, but you passed it: ' + attrs);
    }

    /**
     * Create a `Leaf` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Leaf}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$text = object.text,
          text = _object$text === undefined ? '' : _object$text,
          _object$marks = object.marks,
          marks = _object$marks === undefined ? [] : _object$marks;


      var leaf = new Leaf({
        text: text,
        marks: Set(marks.map(Mark.fromJSON))
      });

      return leaf;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Leaf`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isLeafList',


    /**
     * Check if `any` is a list of leaves.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isLeafList(any) {
      return List.isList(any) && any.every(function (item) {
        return Leaf.isLeaf(item);
      });
    }
  }]);
  return Leaf;
}(Record(DEFAULTS$6));

/**
 * Attach a pseudo-symbol for type checking.
 */

Leaf.fromJS = Leaf.fromJSON;
Leaf.isLeaf = isType.bind(null, 'LEAF');
Leaf.prototype[MODEL_TYPES.LEAF] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$7 = {
  leaves: List(),
  key: undefined

  /**
   * Text.
   *
   * @type {Text}
   */

};
var Text = function (_Record) {
  inherits(Text, _Record);

  function Text() {
    classCallCheck(this, Text);
    return possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).apply(this, arguments));
  }

  createClass(Text, [{
    key: 'getString',


    /**
     * Get the concatenated text of the node, cached for text getter
     *
     * @returns {String}
     */

    value: function getString() {
      return this.leaves.reduce(function (string, leaf) {
        return string + leaf.text;
      }, '');
    }

    /**
     * Get the concatenated characters of the node;
     *
     * @returns {String}
     */

  }, {
    key: 'searchLeafAtOffset',


    /**
     * Find the 'first' leaf at offset; By 'first' the alorighthm prefers `endOffset === offset` than `startOffset === offset`
     * Corner Cases:
     *   1. if offset is negative, return the first leaf;
     *   2. if offset is larger than text length, the leaf is null, startOffset, endOffset and index is of the last leaf
     *
     * @param {number}
     * @returns {Object}
     *   @property {number} startOffset
     *   @property {number} endOffset
     *   @property {number} index
     *   @property {Leaf} leaf
     */

    value: function searchLeafAtOffset(offset) {
      var endOffset = 0;
      var startOffset = 0;
      var index = -1;

      var leaf = this.leaves.find(function (l) {
        index++;
        startOffset = endOffset;
        endOffset = startOffset + l.text.length;
        return endOffset >= offset;
      });

      return {
        leaf: leaf,
        endOffset: endOffset,
        index: index,
        startOffset: startOffset
      };
    }

    /**
     * Add a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'addMark',
    value: function addMark(index, length, mark) {
      var marks = Set.of(mark);
      return this.addMarks(index, length, marks);
    }

    /**
     * Add a `set` of marks at `index` and `length`.
     * Corner Cases:
     *   1. If empty text, and if length === 0 and index === 0, will make sure the text contain an empty leaf with the given mark.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Set<Mark>} set
     * @return {Text}
     */

  }, {
    key: 'addMarks',
    value: function addMarks(index, length, set$$1) {
      if (this.text === '' && length === 0 && index === 0) {
        var _leaves = this.leaves;

        var first = _leaves.first();

        if (!first) {
          return this.set('leaves', List.of(Leaf.fromJSON({ text: '', marks: set$$1 })));
        }

        var newFirst = first.addMarks(set$$1);
        if (newFirst === first) return this;
        return this.set('leaves', List.of(newFirst));
      }

      if (this.text === '') return this;
      if (length === 0) return this;
      if (index >= this.text.length) return this;

      var _Leaf$splitLeaves = Leaf.splitLeaves(this.leaves, index),
          _Leaf$splitLeaves2 = slicedToArray(_Leaf$splitLeaves, 2),
          before = _Leaf$splitLeaves2[0],
          bundle = _Leaf$splitLeaves2[1];

      var _Leaf$splitLeaves3 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves4 = slicedToArray(_Leaf$splitLeaves3, 2),
          middle = _Leaf$splitLeaves4[0],
          after = _Leaf$splitLeaves4[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.addMarks(set$$1);
      }), after);
      return this.setLeaves(leaves);
    }

    /**
     * Get the decorations for the node from a `schema`.
     *
     * @param {Schema} schema
     * @return {Array}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(schema) {
      return schema.__getDecorations(this);
    }

    /**
     * Derive the leaves for a list of `decorations`.
     *
     * @param {Array|Void} decorations (optional)
     * @return {List<Leaf>}
     */

  }, {
    key: 'getLeaves',
    value: function getLeaves() {
      var _this2 = this;

      var decorations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var leaves = this.leaves;

      if (leaves.size === 0) return List.of(Leaf.create({}));
      if (!decorations || decorations.length === 0) return leaves;
      if (this.text.length === 0) return leaves;
      var key = this.key;


      decorations.forEach(function (range) {
        var startKey = range.startKey,
            endKey = range.endKey,
            startOffset = range.startOffset,
            endOffset = range.endOffset,
            marks = range.marks;

        var hasStart = startKey == key;
        var hasEnd = endKey == key;

        if (hasStart && hasEnd) {
          var index = hasStart ? startOffset : 0;
          var length = hasEnd ? endOffset - index : _this2.text.length - index;

          if (length < 1) return;
          if (index >= _this2.text.length) return;

          if (index !== 0 || length < _this2.text.length) {
            var _Leaf$splitLeaves5 = Leaf.splitLeaves(leaves, index),
                _Leaf$splitLeaves6 = slicedToArray(_Leaf$splitLeaves5, 2),
                before = _Leaf$splitLeaves6[0],
                bundle = _Leaf$splitLeaves6[1];

            var _Leaf$splitLeaves7 = Leaf.splitLeaves(bundle, length),
                _Leaf$splitLeaves8 = slicedToArray(_Leaf$splitLeaves7, 2),
                middle = _Leaf$splitLeaves8[0],
                after = _Leaf$splitLeaves8[1];

            leaves = before.concat(middle.map(function (x) {
              return x.addMarks(marks);
            }), after);
            return;
          }
        }

        leaves = leaves.map(function (x) {
          return x.addMarks(marks);
        });
      });

      if (leaves === this.leaves) return leaves;
      return Leaf.createLeaves(leaves);
    }

    /**
     * Get all of the active marks on between two offsets
     * Corner Cases:
     *   1. if startOffset is equal or bigger than endOffset, then return Set();
     *   2. If no text is selected between start and end, then return Set()
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarksBetweenOffsets',
    value: function getActiveMarksBetweenOffsets(startOffset, endOffset) {
      if (startOffset <= 0 && endOffset >= this.text.length) {
        return this.getActiveMarks();
      }

      if (startOffset >= endOffset) return Set();
      // For empty text in a paragraph, use getActiveMarks;
      if (this.text === '') return this.getActiveMarks();

      var result = null;
      var leafEnd = 0;

      this.leaves.forEach(function (leaf) {
        var leafStart = leafEnd;
        leafEnd = leafStart + leaf.text.length;

        if (leafEnd <= startOffset) return;
        if (leafStart >= endOffset) return false;

        if (!result) {
          result = leaf.marks;
          return;
        }

        result = result.intersect(leaf.marks);
        if (result && result.size === 0) return false;
        return false;
      });

      return result || Set();
    }

    /**
     * Get all of the active marks on the text
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarks',
    value: function getActiveMarks() {
      var _this3 = this;

      if (this.leaves.size === 0) return Set();

      var result = this.leaves.first().marks;
      if (result.size === 0) return result;

      return result.withMutations(function (x) {
        _this3.leaves.forEach(function (c) {
          x.intersect(c.marks);
          if (x.size === 0) return false;
        });
      });
    }
  }, {
    key: 'getFirstText',
    value: function getFirstText() {
      return this;
    }
  }, {
    key: 'getLastText',
    value: function getLastText() {
      return this;
    }

    /**
     * Get all of the marks on between two offsets
     * Corner Cases:
     *   1. if startOffset is equal or bigger than endOffset, then return Set();
     *   2. If no text is selected between start and end, then return Set()
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getMarksBetweenOffsets',
    value: function getMarksBetweenOffsets(startOffset, endOffset) {
      if (startOffset <= 0 && endOffset >= this.text.length) {
        return this.getMarks();
      }

      if (startOffset >= endOffset) return Set();
      // For empty text in a paragraph, use getActiveMarks;
      if (this.text === '') return this.getActiveMarks();

      var result = null;
      var leafEnd = 0;

      this.leaves.forEach(function (leaf) {
        var leafStart = leafEnd;
        leafEnd = leafStart + leaf.text.length;

        if (leafEnd <= startOffset) return;
        if (leafStart >= endOffset) return false;

        if (!result) {
          result = leaf.marks;
          return;
        }

        result = result.union(leaf.marks);
      });

      return result || Set();
    }

    /**
     * Get all of the marks on the text.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      return new OrderedSet(array);
    }

    /**
     * Get all of the marks on the text as an array
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      if (this.leaves.size === 0) return [];
      var first = this.leaves.first().marks;
      if (this.leaves.size === 1) return first.toArray();

      var result = [];

      this.leaves.forEach(function (leaf) {
        result.push(leaf.marks.toArray());
      });

      return Array.prototype.concat.apply(first.toArray(), result);
    }

    /**
     * Get the marks on the text at `index`.
     * Corner Cases:
     *   1. if no text is before the index, and index !== 0, then return Set()
     *   2. (for insert after split node or mark at range) if index === 0, and text === '', then return the leaf.marks
     *   3. if index === 0, text !== '', return Set()
     *
     *
     * @param {Number} index
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtIndex',
    value: function getMarksAtIndex(index) {
      var _searchLeafAtOffset = this.searchLeafAtOffset(index),
          leaf = _searchLeafAtOffset.leaf;

      if (!leaf) return Set();
      return leaf.marks;
    }

    /**
     * Get a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(key) {
      return this.key == key ? this : null;
    }

    /**
     * Check if the node has a node by `key`, to parallel other nodes.
     *
     * @param {String} key
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(key) {
      return !!this.getNode(key);
    }

    /**
     * Insert `text` at `index`.
     *
     * @param {Numbder} offset
     * @param {String} text
     * @param {Set} marks (optional)
     * @return {Text}
     */

  }, {
    key: 'insertText',
    value: function insertText(offset, text, marks) {
      if (this.text === '') {
        return this.set('leaves', List.of(Leaf.create({ text: text, marks: marks })));
      }

      if (text.length === 0) return this;
      if (!marks) marks = Set();

      var _searchLeafAtOffset2 = this.searchLeafAtOffset(offset),
          startOffset = _searchLeafAtOffset2.startOffset,
          leaf = _searchLeafAtOffset2.leaf,
          index = _searchLeafAtOffset2.index;

      var delta = offset - startOffset;
      var beforeText = leaf.text.slice(0, delta);
      var afterText = leaf.text.slice(delta);
      var leaves = this.leaves;


      if (leaf.marks.equals(marks)) {
        return this.set('leaves', leaves.set(index, leaf.set('text', beforeText + text + afterText)));
      }

      var nextLeaves = leaves.splice(index, 1, leaf.set('text', beforeText), Leaf.create({ text: text, marks: marks }), leaf.set('text', afterText));

      return this.setLeaves(nextLeaves);
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Text}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = KeyUtils.create();
      return this.set('key', key);
    }

    /**
     * Remove a `mark` at `index` and `length`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @return {Text}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(index, length, mark) {
      if (this.text === '' && index === 0 && length === 0) {
        var first = this.leaves.first();
        if (!first) return this;
        var newFirst = first.removeMark(mark);
        if (newFirst === first) return this;
        return this.set('leaves', List.of(newFirst));
      }

      if (length <= 0) return this;
      if (index >= this.text.length) return this;

      var _Leaf$splitLeaves9 = Leaf.splitLeaves(this.leaves, index),
          _Leaf$splitLeaves10 = slicedToArray(_Leaf$splitLeaves9, 2),
          before = _Leaf$splitLeaves10[0],
          bundle = _Leaf$splitLeaves10[1];

      var _Leaf$splitLeaves11 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves12 = slicedToArray(_Leaf$splitLeaves11, 2),
          middle = _Leaf$splitLeaves12[0],
          after = _Leaf$splitLeaves12[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.removeMark(mark);
      }), after);
      return this.setLeaves(leaves);
    }

    /**
     * Remove text from the text node at `start` for `length`.
     *
     * @param {Number} start
     * @param {Number} length
     * @return {Text}
     */

  }, {
    key: 'removeText',
    value: function removeText(start, length) {
      if (length <= 0) return this;
      if (start >= this.text.length) return this;

      // PERF: For simple backspace, we can operate directly on the leaf
      if (length === 1) {
        var _searchLeafAtOffset3 = this.searchLeafAtOffset(start + 1),
            leaf = _searchLeafAtOffset3.leaf,
            index = _searchLeafAtOffset3.index,
            startOffset = _searchLeafAtOffset3.startOffset;

        var offset = start - startOffset;

        if (leaf) {
          if (leaf.text.length === 1) {
            var _leaves2 = this.leaves.remove(index);
            return this.setLeaves(_leaves2);
          }

          var beforeText = leaf.text.slice(0, offset);
          var afterText = leaf.text.slice(offset + length);
          var text = beforeText + afterText;

          if (text.length > 0) {
            return this.set('leaves', this.leaves.set(index, leaf.set('text', text)));
          }
        }
      }

      var _Leaf$splitLeaves13 = Leaf.splitLeaves(this.leaves, start),
          _Leaf$splitLeaves14 = slicedToArray(_Leaf$splitLeaves13, 2),
          before = _Leaf$splitLeaves14[0],
          bundle = _Leaf$splitLeaves14[1];

      var after = Leaf.splitLeaves(bundle, length)[1];
      var leaves = Leaf.createLeaves(before.concat(after));

      if (leaves.size === 1) {
        var first = leaves.first();

        if (first.text === '') {
          return this.set('leaves', List.of(first.set('marks', this.getActiveMarks())));
        }
      }

      return this.set('leaves', leaves);
    }

    /**
     * Return a JSON representation of the text.
     *
     * @param {Object} options
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        leaves: this.getLeaves().toArray().map(function (r) {
          return r.toJSON();
        })
      };

      if (options.preserveKeys) {
        object.key = this.key;
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }

    /**
     * Update a `mark` at `index` and `length` with `properties`.
     *
     * @param {Number} index
     * @param {Number} length
     * @param {Mark} mark
     * @param {Object} properties
     * @return {Text}
     */

  }, {
    key: 'updateMark',
    value: function updateMark(index, length, mark, properties) {
      var newMark = mark.merge(properties);

      if (this.text === '' && length === 0 && index === 0) {
        var _leaves3 = this.leaves;

        var first = _leaves3.first();
        if (!first) return this;
        var newFirst = first.updateMark(mark, newMark);
        if (newFirst === first) return this;
        return this.set('leaves', List.of(newFirst));
      }

      if (length <= 0) return this;
      if (index >= this.text.length) return this;

      var _Leaf$splitLeaves15 = Leaf.splitLeaves(this.leaves, index),
          _Leaf$splitLeaves16 = slicedToArray(_Leaf$splitLeaves15, 2),
          before = _Leaf$splitLeaves16[0],
          bundle = _Leaf$splitLeaves16[1];

      var _Leaf$splitLeaves17 = Leaf.splitLeaves(bundle, length),
          _Leaf$splitLeaves18 = slicedToArray(_Leaf$splitLeaves17, 2),
          middle = _Leaf$splitLeaves18[0],
          after = _Leaf$splitLeaves18[1];

      var leaves = before.concat(middle.map(function (x) {
        return x.updateMark(mark, newMark);
      }), after);

      return this.setLeaves(leaves);
    }

    /**
     * Split this text and return two different texts
     * @param {Number} position
     * @returns {Array<Text>}
     */

  }, {
    key: 'splitText',
    value: function splitText(offset) {
      var splitted = Leaf.splitLeaves(this.leaves, offset);
      var one = this.set('leaves', splitted[0]);
      var two = this.set('leaves', splitted[1]).regenerateKey();
      return [one, two];
    }

    /**
     * merge this text and another text at the end
     * @param {Text} text
     * @returns {Text}
     */

  }, {
    key: 'mergeText',
    value: function mergeText(text) {
      var leaves = this.leaves.concat(text.leaves);
      return this.setLeaves(leaves);
    }

    /**
     * Normalize the text node with a `schema`.
     *
     * @param {Schema} schema
     * @return {Function|Void}
     */

  }, {
    key: 'normalize',
    value: function normalize(schema) {
      return schema.normalizeNode(this);
    }

    /**
     * Validate the text node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Error|Void}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.validateNode(this);
    }

    /**
     * Get the first invalid descendant
     * PERF: Do not cache this method; because it can cause cycle reference
     *
     * @param {Schema} schema
     * @returns {Text|Null}
     */

  }, {
    key: 'getFirstInvalidDescendant',
    value: function getFirstInvalidDescendant(schema) {
      return this.validate(schema) ? this : null;
    }

    /**
     * Set leaves with normalized `leaves`
     *
     * @param {Schema} schema
     * @returns {Text|Null}
     */

  }, {
    key: 'setLeaves',
    value: function setLeaves(leaves) {
      var result = Leaf.createLeaves(leaves);

      if (result.size === 1) {
        var first = result.first();

        if (!first.marks || first.marks.size === 0) {
          if (first.text === '') {
            return this.set('leaves', List());
          }
        }
      }

      return this.set('leaves', Leaf.createLeaves(leaves));
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'text';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Is the node empty?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      return this.text == '';
    }

    /**
     * Get the concatenated text of the node.
     *
     * @return {String}
     */

  }, {
    key: 'text',
    get: function get$$1() {
      return this.getString();
    }
  }, {
    key: 'characters',
    get: function get$$1() {
      return this.leaves.flatMap(function (x) {
        return x.getCharacters();
      });
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Text` with `attrs`.
     *
     * @param {Object|Array|List|String|Text} attrs
     * @return {Text}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (Text.isText(attrs)) {
        return attrs;
      }

      if (typeof attrs == 'string') {
        attrs = { leaves: [{ text: attrs }] };
      }

      if (isPlainObject(attrs)) {
        if (attrs.text) {
          var _attrs = attrs,
              text = _attrs.text,
              marks = _attrs.marks,
              key = _attrs.key;

          attrs = { key: key, leaves: [{ text: text, marks: marks }] };
        }

        return Text.fromJSON(attrs);
      }

      throw new Error('`Text.create` only accepts objects, arrays, strings or texts, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Texts` from `elements`.
     *
     * @param {Array<Text|Object>|List<Text|Object>} elements
     * @return {List<Text>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = new List(elements.map(Text.create));
        return list;
      }

      throw new Error('`Text.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Text` from a JSON `object`.
     *
     * @param {Object|Text} object
     * @return {Text}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Text.isText(object)) {
        return object;
      }

      var _object$key = object.key,
          key = _object$key === undefined ? KeyUtils.create() : _object$key;
      var leaves = object.leaves;


      if (!leaves) {
        if (object.ranges) {
          logger.deprecate('slate@0.27.0', 'The `ranges` property of Slate objects has been renamed to `leaves`.');

          leaves = object.ranges;
        } else {
          leaves = List();
        }
      }

      if (Array.isArray(leaves)) {
        leaves = List(leaves.map(function (x) {
          return Leaf.create(x);
        }));
      } else if (List.isList(leaves)) {
        leaves = leaves.map(function (x) {
          return Leaf.create(x);
        });
      } else {
        throw new Error('leaves must be either Array or Immutable.List');
      }

      var node = new Text({
        leaves: Leaf.createLeaves(leaves),
        key: key
      });

      return node;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `Text`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isTextList',


    /**
     * Check if `any` is a list of texts.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isTextList(any) {
      return List.isList(any) && any.every(function (item) {
        return Text.isText(item);
      });
    }
  }]);
  return Text;
}(Record(DEFAULTS$7));

/**
 * Attach a pseudo-symbol for type checking.
 */

Text.fromJS = Text.fromJSON;
Text.isText = isType.bind(null, 'TEXT');
Text.prototype[MODEL_TYPES.TEXT] = true;

/**
 * Memoize read methods.
 */

memoize(Text.prototype, ['getDecorations', 'getActiveMarks', 'getMarks', 'getMarksAsArray', 'normalize', 'validate', 'getString']);

/**
 * Node.
 *
 * And interface that `Document`, `Block` and `Inline` all implement, to make
 * working with the recursive node tree easier.
 *
 * @type {Node}
 */

var Node = function () {
  function Node() {
    classCallCheck(this, Node);
  }

  createClass(Node, [{
    key: 'addMark',


    /**
     * Add mark to text at `offset` and `length` in node by `path`.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @return {Node}
     */

    value: function addMark(path, offset, length, mark) {
      var node = this.assertDescendant(path);
      path = this.resolvePath(path);
      node = node.addMark(offset, length, mark);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Recursively filter all descendant nodes with `iterator`.
     *
     * @param {Function} iterator
     * @return {List<Node>}
     */

  }, {
    key: 'filterDescendants',
    value: function filterDescendants(iterator) {
      var matches = [];

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) matches.push(node);
      });

      return List(matches);
    }

    /**
     * Recursively find all descendant nodes by `iterator`.
     *
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'findDescendant',
    value: function findDescendant(iterator) {
      var found = null;

      this.forEachDescendant(function (node, i, nodes) {
        if (iterator(node, i, nodes)) {
          found = node;
          return false;
        }
      });

      return found;
    }

    /**
     * Recursively iterate over all descendant nodes with `iterator`. If the
     * iterator returns false it will break the loop.
     *
     * @param {Function} iterator
     */

  }, {
    key: 'forEachDescendant',
    value: function forEachDescendant(iterator) {
      var ret = void 0;

      this.nodes.forEach(function (child, i, nodes) {
        if (iterator(child, i, nodes) === false) {
          ret = false;
          return false;
        }

        if (child.object != 'text') {
          ret = child.forEachDescendant(iterator);
          return ret;
        }
      });

      return ret;
    }

    /**
     * Get a set of the active marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getActiveMarksAtRange',
    value: function getActiveMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return Set();

      if (range.isCollapsed) {
        var _range = range,
            _startKey = _range.startKey,
            _startOffset = _range.startOffset;

        return this.getMarksAtPosition(_startKey, _startOffset).toSet();
      }

      var _range2 = range,
          startKey = _range2.startKey,
          endKey = _range2.endKey,
          startOffset = _range2.startOffset,
          endOffset = _range2.endOffset;

      var startText = this.getDescendant(startKey);

      if (startKey !== endKey) {
        while (startKey !== endKey && endOffset === 0) {
          var _endText = this.getPreviousText(endKey);
          endKey = _endText.key;
          endOffset = _endText.text.length;
        }

        while (startKey !== endKey && startOffset === startText.text.length) {
          startText = this.getNextText(startKey);
          startKey = startText.key;
          startOffset = 0;
        }
      }

      if (startKey === endKey) {
        return startText.getActiveMarksBetweenOffsets(startOffset, endOffset);
      }

      var startMarks = startText.getActiveMarksBetweenOffsets(startOffset, startText.text.length);
      if (startMarks.size === 0) return Set();
      var endText = this.getDescendant(endKey);
      var endMarks = endText.getActiveMarksBetweenOffsets(0, endOffset);
      var marks = startMarks.intersect(endMarks);
      // If marks is already empty, the active marks is empty
      if (marks.size === 0) return marks;

      var text = this.getNextText(startKey);

      while (text.key !== endKey) {
        if (text.text.length !== 0) {
          marks = marks.intersect(text.getActiveMarks());
          if (marks.size === 0) return Set();
        }

        text = this.getNextText(text.key);
      }
      return marks;
    }

    /**
     * Get a list of the ancestors of a descendant.
     *
     * @param {List|String} path
     * @return {List<Node>|Null}
     */

  }, {
    key: 'getAncestors',
    value: function getAncestors(path) {
      var _this = this;

      path = this.resolvePath(path);
      if (!path) return null;

      var ancestors = [];

      path.forEach(function (p, i) {
        var current = path.slice(0, i);
        var parent = _this.getNode(current);
        ancestors.push(parent);
      });

      return List(ancestors);
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocks',
    value: function getBlocks() {
      var array = this.getBlocksAsArray();
      return new List(array);
    }

    /**
     * Get the leaf block descendants of the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAsArray',
    value: function getBlocksAsArray() {
      return this.nodes.reduce(function (array, child) {
        if (child.object != 'block') return array;
        if (!child.isLeafBlock()) return array.concat(child.getBlocksAsArray());
        array.push(child);
        return array;
      }, []);
    }

    /**
     * Get the leaf block descendants in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksAtRange',
    value: function getBlocksAtRange(range) {
      var array = this.getBlocksAtRangeAsArray(range);
      // Eliminate duplicates by converting to an `OrderedSet` first.
      return new List(new OrderedSet(array));
    }

    /**
     * Get the leaf block descendants in a `range` as an array
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getBlocksAtRangeAsArray',
    value: function getBlocksAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];

      var _range3 = range,
          startKey = _range3.startKey,
          endKey = _range3.endKey;

      var startBlock = this.getClosestBlock(startKey);

      // PERF: the most common case is when the range is in a single block node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey === endKey) return [startBlock];

      var endBlock = this.getClosestBlock(endKey);
      var blocks = this.getBlocksAsArray();
      var start = blocks.indexOf(startBlock);
      var end = blocks.indexOf(endBlock);
      return blocks.slice(start, end + 1);
    }

    /**
     * Get all of the leaf blocks that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getBlocksByType',
    value: function getBlocksByType(type) {
      var array = this.getBlocksByTypeAsArray(type);
      return new List(array);
    }

    /**
     * Get all of the leaf blocks that match a `type` as an array
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getBlocksByTypeAsArray',
    value: function getBlocksByTypeAsArray(type) {
      return this.nodes.reduce(function (array, node) {
        if (node.object != 'block') {
          return array;
        } else if (node.isLeafBlock() && node.type == type) {
          array.push(node);
          return array;
        } else {
          return array.concat(node.getBlocksByTypeAsArray(type));
        }
      }, []);
    }

    /**
     * Get all of the characters for every text node.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'getCharacters',
    value: function getCharacters() {
      var characters = this.getTexts().flatMap(function (t) {
        return t.characters;
      });
      return characters;
    }

    /**
     * Get a list of the characters in a `range`.
     *
     * @param {Range} range
     * @return {List<Character>}
     */

  }, {
    key: 'getCharactersAtRange',
    value: function getCharactersAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return List();
      var _range4 = range,
          startKey = _range4.startKey,
          endKey = _range4.endKey,
          startOffset = _range4.startOffset,
          endOffset = _range4.endOffset;


      if (startKey === endKey) {
        var endText = this.getDescendant(endKey);
        return endText.characters.slice(startOffset, endOffset);
      }

      return this.getTextsAtRange(range).flatMap(function (t) {
        if (t.key === startKey) {
          return t.characters.slice(startOffset);
        }

        if (t.key === endKey) {
          return t.characters.slice(0, endOffset);
        }
        return t.characters;
      });
    }

    /**
     * Get a child node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getChild',
    value: function getChild(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      var child = path.size === 1 ? this.nodes.get(path.first()) : null;
      return child;
    }

    /**
     * Get closest parent of node that matches an `iterator`.
     *
     * @param {List|String} path
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getClosest',
    value: function getClosest(path, iterator) {
      var _this2 = this;

      var ancestors = this.getAncestors(path);
      if (!ancestors) return null;

      var closest = ancestors.findLast(function (node) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // We never want to include the top-level node.
        if (node === _this2) return false;
        return iterator.apply(undefined, [node].concat(args));
      });

      return closest || null;
    }

    /**
     * Get the closest block parent of a node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestBlock',
    value: function getClosestBlock(path) {
      var closest = this.getClosest(path, function (n) {
        return n.object === 'block';
      });
      return closest;
    }

    /**
     * Get the closest inline parent of a node by `path`.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestInline',
    value: function getClosestInline(path) {
      var closest = this.getClosest(path, function (n) {
        return n.object === 'inline';
      });
      return closest;
    }

    /**
     * Get the closest void parent of a node by `path`.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getClosestVoid',
    value: function getClosestVoid(path) {
      var closest = this.getClosest(path, function (p) {
        return p.isVoid;
      });
      return closest;
    }

    /**
     * Get the common ancestor of nodes `a` and `b`.
     *
     * @param {List} a
     * @param {List} b
     * @return {Node}
     */

  }, {
    key: 'getCommonAncestor',
    value: function getCommonAncestor(a, b) {
      a = this.resolvePath(a);
      b = this.resolvePath(b);
      if (!a || !b) return null;

      var path = PathUtils.relate(a, b);
      var node = this.getNode(path);
      return node;
    }

    /**
     * Get the decorations for the node from a `stack`.
     *
     * @param {Stack} stack
     * @return {List}
     */

  }, {
    key: 'getDecorations',
    value: function getDecorations(stack) {
      var decorations = stack.find('decorateNode', this);
      var list = Range.createList(decorations || []);
      return list;
    }

    /**
     * Get the depth of a descendant, with optional `startAt`.
     *
     * @param {List|String} path
     * @param {Number} startAt
     * @return {Number|Null}
     */

  }, {
    key: 'getDepth',
    value: function getDepth(path) {
      var startAt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      path = this.resolvePath(path);
      if (!path) return null;

      var node = this.getNode(path);
      var depth = node ? path.size - 1 + startAt : null;
      return depth;
    }

    /**
     * Get a descendant node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getDescendant',
    value: function getDescendant(path) {
      path = this.resolvePath(path);
      if (!path) return null;

      var array = path.toArray();
      var descendant = this;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var index = _step.value;

          if (!descendant) return null;
          if (!descendant.nodes) return null;
          descendant = descendant.nodes.get(index);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return descendant;
    }

    /**
     * Get the first invalid descendant
     *
     * @param {Schema} schema
     * @return {Node|Text|Null}
     */

  }, {
    key: 'getFirstInvalidDescendant',
    value: function getFirstInvalidDescendant(schema) {
      var result = null;

      this.nodes.find(function (n) {
        result = n.validate(schema) ? n : n.getFirstInvalidDescendant(schema);
        return result;
      });

      return result;
    }

    /**
     * Get the first child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getFirstText',
    value: function getFirstText() {
      var descendant = null;

      var found = this.nodes.find(function (node) {
        if (node.object === 'text') return true;
        descendant = node.getFirstText();
        return !!descendant;
      });

      return descendant || found;
    }

    /**
     * Get a fragment of the node at a `range`.
     *
     * @param {Range} range
     * @return {Document}
     */

  }, {
    key: 'getFragmentAtRange',
    value: function getFragmentAtRange(range) {
      range = range.normalize(this);

      if (range.isUnset) {
        return Document.create();
      }

      var _range5 = range,
          startPath = _range5.startPath,
          startOffset = _range5.startOffset,
          endPath = _range5.endPath,
          endOffset = _range5.endOffset;

      var node = this;
      var targetPath = endPath;
      var targetPosition = endOffset;
      var mode = 'end';

      while (targetPath.size) {
        var index = targetPath.last();
        node = node.splitNode(targetPath, targetPosition);
        targetPosition = index + 1;
        targetPath = PathUtils.lift(targetPath);

        if (!targetPath.size && mode === 'end') {
          targetPath = startPath;
          targetPosition = startOffset;
          mode = 'start';
        }
      }

      var startIndex = startPath.first() + 1;
      var endIndex = endPath.first() + 2;
      var nodes = node.nodes.slice(startIndex, endIndex);
      var fragment = Document.create({ nodes: nodes });
      return fragment;
    }

    /**
     * Get the furthest parent of a node that matches an `iterator`.
     *
     * @param {Path} path
     * @param {Function} iterator
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthest',
    value: function getFurthest(path, iterator) {
      var _this3 = this;

      var ancestors = this.getAncestors(path);
      if (!ancestors) return null;

      var furthest = ancestors.find(function (node) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        // We never want to include the top-level node.
        if (node === _this3) return false;
        return iterator.apply(undefined, [node].concat(args));
      });

      return furthest || null;
    }

    /**
     * Get the furthest ancestor of a node.
     *
     * @param {Path} path
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestAncestor',
    value: function getFurthestAncestor(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      var furthest = path.size ? this.nodes.get(path.first()) : null;
      return furthest;
    }

    /**
     * Get the furthest block parent of a node.
     *
     * @param {Path} path
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestBlock',
    value: function getFurthestBlock(path) {
      var furthest = this.getFurthest(path, function (n) {
        return n.object === 'block';
      });
      return furthest;
    }

    /**
     * Get the furthest inline parent of a node.
     *
     * @param {Path} path
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestInline',
    value: function getFurthestInline(path) {
      var furthest = this.getFurthest(path, function (n) {
        return n.object === 'inline';
      });
      return furthest;
    }

    /**
     * Get the furthest ancestor of a node that has only one child.
     *
     * @param {Path} path
     * @return {Node|Null}
     */

  }, {
    key: 'getFurthestOnlyChildAncestor',
    value: function getFurthestOnlyChildAncestor(path) {
      var ancestors = this.getAncestors(path);
      if (!ancestors) return null;

      var furthest = ancestors.rest().reverse().takeUntil(function (p) {
        return p.nodes.size > 1;
      }).last();

      return furthest || null;
    }

    /**
     * Get the closest inline nodes for each text node in the node.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlines',
    value: function getInlines() {
      var array = this.getInlinesAsArray();
      var list = new List(array);
      return list;
    }

    /**
     * Get the closest inline nodes for each text node in the node, as an array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAsArray',
    value: function getInlinesAsArray() {
      var array = [];

      this.nodes.forEach(function (child) {
        if (child.object == 'text') return;

        if (child.isLeafInline()) {
          array.push(child);
        } else {
          array = array.concat(child.getInlinesAsArray());
        }
      });

      return array;
    }

    /**
     * Get the closest inline nodes for each text node in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesAtRange',
    value: function getInlinesAtRange(range) {
      var array = this.getInlinesAtRangeAsArray(range);
      // Remove duplicates by converting it to an `OrderedSet` first.
      var list = new List(new OrderedSet(array));
      return list;
    }

    /**
     * Get the closest inline nodes for each text node in a `range` as an array.
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getInlinesAtRangeAsArray',
    value: function getInlinesAtRangeAsArray(range) {
      var _this4 = this;

      range = range.normalize(this);
      if (range.isUnset) return [];

      var array = this.getTextsAtRangeAsArray(range).map(function (text) {
        return _this4.getClosestInline(text.key);
      }).filter(function (exists) {
        return exists;
      });

      return array;
    }

    /**
     * Get all of the leaf inline nodes that match a `type`.
     *
     * @param {String} type
     * @return {List<Node>}
     */

  }, {
    key: 'getInlinesByType',
    value: function getInlinesByType(type) {
      var array = this.getInlinesByTypeAsArray(type);
      var list = new List(array);
      return list;
    }

    /**
     * Get all of the leaf inline nodes that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getInlinesByTypeAsArray',
    value: function getInlinesByTypeAsArray(type) {
      var array = this.nodes.reduce(function (inlines, node) {
        if (node.object == 'text') {
          return inlines;
        } else if (node.isLeafInline() && node.type == type) {
          inlines.push(node);
          return inlines;
        } else {
          return inlines.concat(node.getInlinesByTypeAsArray(type));
        }
      }, []);

      return array;
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getInsertMarksAtRange',
    value: function getInsertMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return Set();

      if (range.isCollapsed) {
        // PERF: range is not cachable, use key and offset as proxies for cache
        return this.getMarksAtPosition(range.startKey, range.startOffset);
      }

      var _range6 = range,
          startKey = _range6.startKey,
          startOffset = _range6.startOffset;

      var text = this.getDescendant(startKey);
      var marks = text.getMarksAtIndex(startOffset + 1);
      return marks;
    }

    /**
     * Get an object mapping all the keys in the node to their paths.
     *
     * @return {Object}
     */

  }, {
    key: 'getKeysToPathsTable',
    value: function getKeysToPathsTable() {
      var ret = defineProperty({}, this.key, []);

      this.nodes.forEach(function (node, i) {
        ret[node.key] = [i];

        if (node.object !== 'text') {
          var nested = node.getKeysToPathsTable();

          for (var key in nested) {
            var path = nested[key];
            ret[key] = [i].concat(toConsumableArray(path));
          }
        }
      });

      return ret;
    }

    /**
     * Get the last child text node.
     *
     * @return {Node|Null}
     */

  }, {
    key: 'getLastText',
    value: function getLastText() {
      var descendant = null;

      var found = this.nodes.findLast(function (node) {
        if (node.object == 'text') return true;
        descendant = node.getLastText();
        return descendant;
      });

      return descendant || found;
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarks',
    value: function getMarks() {
      var array = this.getMarksAsArray();
      var set$$1 = new Set(array);
      return set$$1;
    }

    /**
     * Get all of the marks as an array.
     *
     * @return {Array}
     */

  }, {
    key: 'getMarksAsArray',
    value: function getMarksAsArray() {
      var _ref;

      var result = [];

      this.nodes.forEach(function (node) {
        result.push(node.getMarksAsArray());
      });

      // PERF: use only one concat rather than multiple for speed.
      var array = (_ref = []).concat.apply(_ref, result);
      return array;
    }

    /**
     * Get a set of marks in a `position`, the equivalent of a collapsed range
     *
     * @param {string} key
     * @param {number} offset
     * @return {Set}
     */

  }, {
    key: 'getMarksAtPosition',
    value: function getMarksAtPosition(key, offset) {
      var text = this.getDescendant(key);
      var currentMarks = text.getMarksAtIndex(offset);
      if (offset !== 0) return currentMarks;
      var closestBlock = this.getClosestBlock(key);

      if (closestBlock.text === '') {
        // insert mark for empty block; the empty block are often created by split node or add marks in a range including empty blocks
        return currentMarks;
      }

      var previous = this.getPreviousText(key);
      if (!previous) return Set();

      if (closestBlock.hasDescendant(previous.key)) {
        return previous.getMarksAtIndex(previous.text.length);
      }

      return currentMarks;
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksAtRange',
    value: function getMarksAtRange(range) {
      var marks = new Set(this.getOrderedMarksAtRange(range));
      return marks;
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {Set<Mark>}
     */

  }, {
    key: 'getMarksByType',
    value: function getMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      var set$$1 = new Set(array);
      return set$$1;
    }

    /**
     * Get all of the marks that match a `type` as an array.
     *
     * @param {String} type
     * @return {Array}
     */

  }, {
    key: 'getMarksByTypeAsArray',
    value: function getMarksByTypeAsArray(type) {
      var array = this.nodes.reduce(function (memo, node) {
        return node.object == 'text' ? memo.concat(node.getMarksAsArray().filter(function (m) {
          return m.type == type;
        })) : memo.concat(node.getMarksByTypeAsArray(type));
      }, []);

      return array;
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getNextBlock',
    value: function getNextBlock(key) {
      var child = this.assertDescendant(key);
      var last = void 0;

      if (child.object == 'block') {
        last = child.getLastText();
      } else {
        var block = this.getClosestBlock(key);
        last = block.getLastText();
      }

      var next = this.getNextText(last.key);
      if (!next) return null;

      var closest = this.getClosestBlock(next.key);
      return closest;
    }

    /**
     * Get the next node in the tree from a node.
     *
     * This will not only check for siblings but instead move up the tree
     * returning the next ancestor if no sibling is found.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNextNode',
    value: function getNextNode(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;

      for (var i = path.size; i > 0; i--) {
        var p = path.slice(0, i);
        var target = PathUtils.increment(p);
        var node = this.getNode(target);
        if (node) return node;
      }

      return null;
    }

    /**
     * Get the next sibling of a node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNextSibling',
    value: function getNextSibling(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;
      var p = PathUtils.increment(path);
      var sibling = this.getNode(p);
      return sibling;
    }

    /**
     * Get the text node after a descendant text node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNextText',
    value: function getNextText(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;
      var next = this.getNextNode(path);
      if (!next) return null;
      var text = next.getFirstText();
      return text;
    }

    /**
     * Get a node in the tree.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getNode',
    value: function getNode(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      var node = path.size ? this.getDescendant(path) : this;
      return node;
    }

    /**
     * Get the offset for a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Number}
     */

  }, {
    key: 'getOffset',
    value: function getOffset(key) {
      this.assertDescendant(key);

      // Calculate the offset of the nodes before the highest child.
      var child = this.getFurthestAncestor(key);
      var offset = this.nodes.takeUntil(function (n) {
        return n == child;
      }).reduce(function (memo, n) {
        return memo + n.text.length;
      }, 0);

      // Recurse if need be.
      var ret = this.hasChild(key) ? offset : offset + child.getOffset(key);
      return ret;
    }

    /**
     * Get the offset from a `range`.
     *
     * @param {Range} range
     * @return {Number}
     */

  }, {
    key: 'getOffsetAtRange',
    value: function getOffsetAtRange(range) {
      range = range.normalize(this);

      if (range.isUnset) {
        throw new Error('The range cannot be unset to calculcate its offset.');
      }

      if (range.isExpanded) {
        throw new Error('The range must be collapsed to calculcate its offset.');
      }

      var _range7 = range,
          startKey = _range7.startKey,
          startOffset = _range7.startOffset;

      var offset = this.getOffset(startKey) + startOffset;
      return offset;
    }

    /**
     * Get all of the marks for all of the characters of every text node.
     *
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarks',
    value: function getOrderedMarks() {
      var array = this.getMarksAsArray();
      var set$$1 = new OrderedSet(array);
      return set$$1;
    }

    /**
     * Get a set of the marks in a `range`.
     *
     * @param {Range} range
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksAtRange',
    value: function getOrderedMarksAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return OrderedSet();

      if (range.isCollapsed) {
        // PERF: range is not cachable, use key and offset as proxies for cache
        return this.getMarksAtPosition(range.startKey, range.startOffset);
      }

      var _range8 = range,
          startKey = _range8.startKey,
          startOffset = _range8.startOffset,
          endKey = _range8.endKey,
          endOffset = _range8.endOffset;

      var marks = this.getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset);

      return marks;
    }

    /**
     * Get a set of the marks in a `range`.
     * PERF: arguments use key and offset for utilizing cache
     *
     * @param {string} startKey
     * @param {number} startOffset
     * @param {string} endKey
     * @param {number} endOffset
     * @returns {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksBetweenPositions',
    value: function getOrderedMarksBetweenPositions(startKey, startOffset, endKey, endOffset) {
      if (startKey === endKey) {
        var startText = this.getDescendant(startKey);
        return startText.getMarksBetweenOffsets(startOffset, endOffset);
      }

      var texts = this.getTextsBetweenPositionsAsArray(startKey, endKey);

      return OrderedSet().withMutations(function (result) {
        texts.forEach(function (text) {
          if (text.key === startKey) {
            result.union(text.getMarksBetweenOffsets(startOffset, text.text.length));
          } else if (text.key === endKey) {
            result.union(text.getMarksBetweenOffsets(0, endOffset));
          } else {
            result.union(text.getMarks());
          }
        });
      });
    }

    /**
     * Get all of the marks that match a `type`.
     *
     * @param {String} type
     * @return {OrderedSet<Mark>}
     */

  }, {
    key: 'getOrderedMarksByType',
    value: function getOrderedMarksByType(type) {
      var array = this.getMarksByTypeAsArray(type);
      var set$$1 = new OrderedSet(array);
      return set$$1;
    }

    /**
     * Get the parent of a descendant node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getParent',
    value: function getParent(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;
      var parentPath = PathUtils.lift(path);
      var parent = this.getNode(parentPath);
      return parent;
    }

    /**
     * Find the path to a node.
     *
     * @param {String|List} key
     * @return {List}
     */

  }, {
    key: 'getPath',
    value: function getPath(key) {
      // Handle the case of passing in a path directly, to match other methods.
      if (List.isList(key)) return key;

      var dict = this.getKeysToPathsTable();
      var path = dict[key];
      return path ? List(path) : null;
    }

    /**
     * Get the block node before a descendant text node by `key`.
     *
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousBlock',
    value: function getPreviousBlock(key) {
      var child = this.assertDescendant(key);
      var first = void 0;

      if (child.object == 'block') {
        first = child.getFirstText();
      } else {
        var block = this.getClosestBlock(key);
        first = block.getFirstText();
      }

      var previous = this.getPreviousText(first.key);
      if (!previous) return null;

      var closest = this.getClosestBlock(previous.key);
      return closest;
    }

    /**
     * Get the previous node from a node in the tree.
     *
     * This will not only check for siblings but instead move up the tree
     * returning the previous ancestor if no sibling is found.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousNode',
    value: function getPreviousNode(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;

      for (var i = path.size; i > 0; i--) {
        var p = path.slice(0, i);
        if (p.last() === 0) continue;

        var target = PathUtils.decrement(p);
        var node = this.getNode(target);
        if (node) return node;
      }

      return null;
    }

    /**
     * Get the previous sibling of a node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousSibling',
    value: function getPreviousSibling(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;
      if (path.last() === 0) return null;
      var p = PathUtils.decrement(path);
      var sibling = this.getNode(p);
      return sibling;
    }

    /**
     * Get the text node after a descendant text node.
     *
     * @param {List|String} path
     * @return {Node|Null}
     */

  }, {
    key: 'getPreviousText',
    value: function getPreviousText(path) {
      path = this.resolvePath(path);
      if (!path) return null;
      if (!path.size) return null;
      var previous = this.getPreviousNode(path);
      if (!previous) return null;
      var text = previous.getLastText();
      return text;
    }

    /**
     * Get the indexes of the selection for a `range`, given an extra flag for
     * whether the node `isSelected`, to determine whether not finding matches
     * means everything is selected or nothing is.
     *
     * @param {Range} range
     * @param {Boolean} isSelected
     * @return {Object|Null}
     */

  }, {
    key: 'getSelectionIndexes',
    value: function getSelectionIndexes(range) {
      var isSelected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var startKey = range.startKey,
          endKey = range.endKey;

      // PERF: if we're not selected, we can exit early.

      if (!isSelected) {
        return null;
      }

      // if we've been given an invalid selection we can exit early.
      if (range.isUnset) {
        return null;
      }

      // PERF: if the start and end keys are the same, just check for the child
      // that contains that single key.
      if (startKey == endKey) {
        var child = this.getFurthestAncestor(startKey);
        var index = child ? this.nodes.indexOf(child) : null;
        return { start: index, end: index + 1 };
      }

      // Otherwise, check all of the children...
      var start = null;
      var end = null;

      this.nodes.forEach(function (child, i) {
        if (child.object == 'text') {
          if (start == null && child.key == startKey) start = i;
          if (end == null && child.key == endKey) end = i + 1;
        } else {
          if (start == null && child.hasDescendant(startKey)) start = i;
          if (end == null && child.hasDescendant(endKey)) end = i + 1;
        }

        // PERF: exit early if both start and end have been found.
        return start == null || end == null;
      });

      if (isSelected && start == null) start = 0;
      if (isSelected && end == null) end = this.nodes.size;
      return start == null ? null : { start: start, end: end };
    }

    /**
     * Get the concatenated text string of all child nodes.
     *
     * @return {String}
     */

  }, {
    key: 'getText',
    value: function getText() {
      var text = this.nodes.reduce(function (string, node) {
        return string + node.text;
      }, '');

      return text;
    }

    /**
     * Get the descendent text node at an `offset`.
     *
     * @param {String} offset
     * @return {Node|Null}
     */

  }, {
    key: 'getTextAtOffset',
    value: function getTextAtOffset(offset) {
      // PERF: Add a few shortcuts for the obvious cases.
      if (offset === 0) return this.getFirstText();
      if (offset === this.text.length) return this.getLastText();
      if (offset < 0 || offset > this.text.length) return null;

      var length = 0;
      var text = this.getTexts().find(function (node, i, nodes) {
        length += node.text.length;
        return length > offset;
      });

      return text;
    }

    /**
     * Get the direction of the node's text.
     *
     * @return {String}
     */

  }, {
    key: 'getTextDirection',
    value: function getTextDirection() {
      var dir = direction(this.text);
      return dir === 'neutral' ? null : dir;
    }

    /**
     * Recursively get all of the child text nodes in order of appearance.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTexts',
    value: function getTexts() {
      var array = this.getTextsAsArray();
      var list = new List(array);
      return list;
    }

    /**
     * Recursively get all the leaf text nodes in order of appearance, as array.
     *
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAsArray',
    value: function getTextsAsArray() {
      var array = [];

      this.nodes.forEach(function (node) {
        if (node.object == 'text') {
          array.push(node);
        } else {
          array = array.concat(node.getTextsAsArray());
        }
      });

      return array;
    }

    /**
     * Get all of the text nodes in a `range`.
     *
     * @param {Range} range
     * @return {List<Node>}
     */

  }, {
    key: 'getTextsAtRange',
    value: function getTextsAtRange(range) {
      range = range.normalize(this);
      if (range.isUnset) return List();
      var _range9 = range,
          startKey = _range9.startKey,
          endKey = _range9.endKey;

      var list = new List(this.getTextsBetweenPositionsAsArray(startKey, endKey));

      return list;
    }

    /**
     * Get all of the text nodes in a `range` as an array.
     *
     * @param {Range} range
     * @return {Array}
     */

  }, {
    key: 'getTextsAtRangeAsArray',
    value: function getTextsAtRangeAsArray(range) {
      range = range.normalize(this);
      if (range.isUnset) return [];
      var _range10 = range,
          startKey = _range10.startKey,
          endKey = _range10.endKey;

      var texts = this.getTextsBetweenPositionsAsArray(startKey, endKey);
      return texts;
    }

    /**
     * Get all of the text nodes in a `range` as an array.
     * PERF: use key in arguments for cache
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Array}
     */

  }, {
    key: 'getTextsBetweenPositionsAsArray',
    value: function getTextsBetweenPositionsAsArray(startKey, endKey) {
      var startText = this.getDescendant(startKey);

      // PERF: the most common case is when the range is in a single text node,
      // where we can avoid a lot of iterating of the tree.
      if (startKey == endKey) return [startText];

      var endText = this.getDescendant(endKey);
      var texts = this.getTextsAsArray();
      var start = texts.indexOf(startText);
      var end = texts.indexOf(endText, start);
      var ret = texts.slice(start, end + 1);
      return ret;
    }

    /**
     * Check if the node has block children.
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasBlockChildren',
    value: function hasBlockChildren() {
      return !!(this.nodes && this.nodes.find(function (n) {
        return n.object === 'block';
      }));
    }

    /**
     * Check if a child node exists.
     *
     * @param {List|String} path
     * @return {Boolean}
     */

  }, {
    key: 'hasChild',
    value: function hasChild(path) {
      var child = this.getChild(path);
      return !!child;
    }

    /**
     * Check if a node has inline children.
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasInlineChildren',
    value: function hasInlineChildren() {
      return !!(this.nodes && this.nodes.find(function (n) {
        return n.object === 'inline' || n.object === 'text';
      }));
    }

    /**
     * Recursively check if a child node exists.
     *
     * @param {List|String} path
     * @return {Boolean}
     */

  }, {
    key: 'hasDescendant',
    value: function hasDescendant(path) {
      var descendant = this.getDescendant(path);
      return !!descendant;
    }

    /**
     * Recursively check if a node exists.
     *
     * @param {List|String} path
     * @return {Boolean}
     */

  }, {
    key: 'hasNode',
    value: function hasNode(path) {
      var node = this.getNode(path);
      return !!node;
    }

    /**
     * Check if a node has a void parent.
     *
     * @param {List|String} path
     * @return {Boolean}
     */

  }, {
    key: 'hasVoidParent',
    value: function hasVoidParent(path) {
      var closest = this.getClosestVoid(path);
      return !!closest;
    }

    /**
     * Insert a `node`.
     *
     * @param {List|String} path
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'insertNode',
    value: function insertNode(path, node) {
      path = this.resolvePath(path);
      var index = path.last();
      var parentPath = PathUtils.lift(path);
      var parent = this.assertNode(parentPath);
      var nodes = parent.nodes.splice(index, 0, node);
      parent = parent.set('nodes', nodes);
      var ret = this.replaceNode(parentPath, parent);
      return ret;
    }

    /**
     * Insert `text` at `offset` in node by `path`.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {String} text
     * @param {Set} marks
     * @return {Node}
     */

  }, {
    key: 'insertText',
    value: function insertText(path, offset, text, marks) {
      var node = this.assertDescendant(path);
      path = this.resolvePath(path);
      node = node.insertText(offset, text, marks);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Check whether the node is a leaf block.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafBlock',
    value: function isLeafBlock() {
      return this.object === 'block' && this.nodes.every(function (n) {
        return n.object !== 'block';
      });
    }

    /**
     * Check whether the node is a leaf inline.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isLeafInline',
    value: function isLeafInline() {
      return this.object === 'inline' && this.nodes.every(function (n) {
        return n.object !== 'inline';
      });
    }

    /**
     * Map all child nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapChildren',
    value: function mapChildren(iterator) {
      var _this5 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, i) {
        var ret = iterator(node, i, _this5.nodes);
        if (ret !== node) nodes = nodes.set(ret.key, ret);
      });

      var ret = this.set('nodes', nodes);
      return ret;
    }

    /**
     * Map all descendant nodes, updating them in their parents. This method is
     * optimized to not return a new node if no changes are made.
     *
     * @param {Function} iterator
     * @return {Node}
     */

  }, {
    key: 'mapDescendants',
    value: function mapDescendants(iterator) {
      var _this6 = this;

      var nodes = this.nodes;


      nodes.forEach(function (node, index) {
        var ret = node;
        if (ret.object !== 'text') ret = ret.mapDescendants(iterator);
        ret = iterator(ret, index, _this6.nodes);
        if (ret === node) return;

        nodes = nodes.set(index, ret);
      });

      var ret = this.set('nodes', nodes);
      return ret;
    }

    /**
     * Merge a node backwards its previous sibling.
     *
     * @param {List|Key} path
     * @return {Node}
     */

  }, {
    key: 'mergeNode',
    value: function mergeNode(path) {
      var b = this.assertNode(path);
      path = this.resolvePath(path);

      if (path.last() === 0) {
        throw new Error('Unable to merge node because it has no previous sibling: ' + b);
      }

      var withPath = PathUtils.decrement(path);
      var a = this.assertNode(withPath);

      if (a.object !== b.object) {
        throw new Error('Unable to merge two different kinds of nodes: ' + a + ' and ' + b);
      }

      var newNode = a.object === 'text' ? a.mergeText(b) : a.set('nodes', a.nodes.concat(b.nodes));

      var ret = this;
      ret = ret.removeNode(path);
      ret = ret.removeNode(withPath);
      ret = ret.insertNode(withPath, newNode);
      return ret;
    }

    /**
     * Move a node by `path` to `newPath`.
     *
     * A `newIndex` can be provided when move nodes by `key`, to account for not
     * being able to have a key for a location in the tree that doesn't exist yet.
     *
     * @param {List|Key} path
     * @param {List|Key} newPath
     * @param {Number} newIndex
     * @return {Node}
     */

  }, {
    key: 'moveNode',
    value: function moveNode(path, newPath) {
      var newIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var node = this.assertNode(path);
      path = this.resolvePath(path);
      newPath = this.resolvePath(newPath, newIndex);

      var newParentPath = PathUtils.lift(newPath);
      this.assertNode(newParentPath);

      var _PathUtils$crop = PathUtils.crop(path, newPath),
          _PathUtils$crop2 = slicedToArray(_PathUtils$crop, 2),
          p = _PathUtils$crop2[0],
          np = _PathUtils$crop2[1];

      var position = PathUtils.compare(p, np);

      // If the old path ends above and before a node in the new path, then
      // removing it will alter the target, so we need to adjust the new path.
      if (path.size < newPath.size && position === -1) {
        newPath = PathUtils.decrement(newPath, 1, p.size - 1);
      }

      var ret = this;
      ret = ret.removeNode(path);
      ret = ret.insertNode(newPath, node);
      return ret;
    }

    /**
     * Attempt to "refind" a node by a previous `path`, falling back to looking
     * it up by `key` again.
     *
     * @param {List|String} path
     * @param {String} key
     * @return {Node|Null}
     */

  }, {
    key: 'refindNode',
    value: function refindNode(path, key) {
      var node = this.getDescendant(path);
      var found = node && node.key === key ? node : this.getDescendant(key);
      return found;
    }

    /**
     * Attempt to "refind" the path to a node by a previous `path`, falling back
     * to looking it up by `key`.
     *
     * @param {List|String} path
     * @param {String} key
     * @return {List|Null}
     */

  }, {
    key: 'refindPath',
    value: function refindPath(path, key) {
      var node = this.getDescendant(path);
      var found = node && node.key === key ? path : this.getPath(key);
      return found;
    }

    /**
     * Regenerate the node's key.
     *
     * @return {Node}
     */

  }, {
    key: 'regenerateKey',
    value: function regenerateKey() {
      var key = KeyUtils.create();
      var node = this.set('key', key);
      return node;
    }

    /**
     * Remove mark from text at `offset` and `length` in node.
     *
     * @param {List} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @return {Node}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(path, offset, length, mark) {
      var node = this.assertDescendant(path);
      path = this.resolvePath(path);
      node = node.removeMark(offset, length, mark);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Remove a node.
     *
     * @param {List|String} path
     * @return {Node}
     */

  }, {
    key: 'removeNode',
    value: function removeNode(path) {
      this.assertDescendant(path);
      path = this.resolvePath(path);
      var deep = path.flatMap(function (x) {
        return List(['nodes', x]);
      });
      var ret = this.deleteIn(deep);
      return ret;
    }

    /**
     * Remove `text` at `offset` in node.
     *
     * @param {List|Key} path
     * @param {Number} offset
     * @param {String} text
     * @return {Node}
     */

  }, {
    key: 'removeText',
    value: function removeText(path, offset, text) {
      var node = this.assertDescendant(path);
      node = node.removeText(offset, text.length);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Replace a `node` in the tree.
     *
     * @param {List|Key} path
     * @param {Node} node
     * @return {Node}
     */

  }, {
    key: 'replaceNode',
    value: function replaceNode(path, node) {
      path = this.resolvePath(path);

      if (!path) {
        throw new Error('Unable to replace a node because it could not be found in the first place: ' + path);
      }

      if (!path.size) return node;
      this.assertNode(path);
      var deep = path.flatMap(function (x) {
        return List(['nodes', x]);
      });
      var ret = this.setIn(deep, node);
      return ret;
    }

    /**
     * Resolve a path from a path list or key string.
     *
     * An `index` can be provided, in which case paths created from a key string
     * will have the index pushed onto them. This is helpful in cases where you
     * want to accept either a `path` or a `key, index` combination for targeting
     * a location in the tree that doesn't exist yet, like when inserting.
     *
     * @param {List|String} value
     * @param {Number} index
     * @return {List}
     */

  }, {
    key: 'resolvePath',
    value: function resolvePath(path, index) {
      if (typeof path === 'string') {
        path = this.getPath(path);

        if (index != null) {
          path = path.concat(index);
        }
      } else {
        path = PathUtils.create(path);
      }

      return path;
    }

    /**
     * Set `properties` on a node.
     *
     * @param {List|String} path
     * @param {Object} properties
     * @return {Node}
     */

  }, {
    key: 'setNode',
    value: function setNode(path, properties) {
      var node = this.assertNode(path);
      node = node.merge(properties);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Set `properties` on `mark` on text at `offset` and `length` in node.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @param {Object} properties
     * @return {Node}
     */

  }, {
    key: 'setMark',
    value: function setMark(path, offset, length, mark, properties) {
      var node = this.assertNode(path);
      node = node.updateMark(offset, length, mark, properties);
      var ret = this.replaceNode(path, node);
      return ret;
    }

    /**
     * Split a node by `path` at `position` with optional `properties` to apply
     * to the newly split node.
     *
     * @param {List|String} path
     * @param {Number} position
     * @param {Object} properties
     * @return {Node}
     */

  }, {
    key: 'splitNode',
    value: function splitNode(path, position, properties) {
      var child = this.assertNode(path);
      path = this.resolvePath(path);
      var a = void 0;
      var b = void 0;

      if (child.object === 'text') {
        
        var _child$splitText = child.splitText(position);

        var _child$splitText2 = slicedToArray(_child$splitText, 2);

        a = _child$splitText2[0];
        b = _child$splitText2[1];
      } else {
        var befores = child.nodes.take(position);
        var afters = child.nodes.skip(position);
        a = child.set('nodes', befores);
        b = child.set('nodes', afters).regenerateKey();
      }

      if (properties && child.object !== 'text') {
        b = b.merge(properties);
      }

      var ret = this;
      ret = ret.removeNode(path);
      ret = ret.insertNode(path, b);
      ret = ret.insertNode(path, a);
      return ret;
    }

    /**
     * Normalize the node with a `schema`.
     *
     * @param {Schema} schema
     * @return {Function|Void}
     */

  }, {
    key: 'normalize',
    value: function normalize(schema) {
      return schema.normalizeNode(this);
    }

    /**
     * Validate the node against a `schema`.
     *
     * @param {Schema} schema
     * @return {Error|Void}
     */

  }, {
    key: 'validate',
    value: function validate(schema) {
      return schema.validateNode(this);
    }

    /**
     * Deprecated.
     */

  }, {
    key: 'getNodeAtPath',
    value: function getNodeAtPath(path) {
      logger.deprecate('0.35.0', 'The `Node.getNodeAtPath` method has been combined into `Node.getNode`.');

      return this.getNode(path);
    }
  }, {
    key: 'getDescendantAtPath',
    value: function getDescendantAtPath(path) {
      logger.deprecate('0.35.0', 'The `Node.getDescendantAtPath` has been combined into `Node.getDescendant`.');

      return this.getDescendant(path);
    }
  }, {
    key: 'getKeys',
    value: function getKeys() {
      logger.deprecate('0.35.0', 'The `Node.getKeys` method is deprecated.');

      var keys = this.getKeysAsArray();
      return new Set(keys);
    }
  }, {
    key: 'getKeysAsArray',
    value: function getKeysAsArray() {
      logger.deprecate('0.35.0', 'The `Node.getKeysAsArray` method is deprecated.');

      var dict = this.getKeysToPathsTable();
      var keys = [];

      for (var key in dict) {
        if (this.key !== key) {
          keys.push(key);
        }
      }

      return keys;
    }
  }, {
    key: 'areDescendantsSorted',
    value: function areDescendantsSorted(first, second) {
      var _this7 = this;

      logger.deprecate('0.35.0', 'The `Node.areDescendantsSorted` method is deprecated. Use the new `PathUtils.compare` helper instead.');

      first = KeyUtils.create(first);
      second = KeyUtils.create(second);

      var keys = this.getKeysAsArray().filter(function (k) {
        return k !== _this7.key;
      });
      var firstIndex = keys.indexOf(first);
      var secondIndex = keys.indexOf(second);
      if (firstIndex == -1 || secondIndex == -1) return null;

      return firstIndex < secondIndex;
    }
  }, {
    key: 'isInRange',
    value: function isInRange(range) {
      logger.deprecate('0.35.0', 'The `Node.isInRange` method is deprecated. Use the new `PathUtils.compare` helper instead.');

      range = range.normalize(this);

      var node = this;
      var _range11 = range,
          startKey = _range11.startKey,
          endKey = _range11.endKey,
          isCollapsed = _range11.isCollapsed;

      // PERF: solve the most common cast where the start or end key are inside
      // the node, for collapsed selections.

      if (node.key == startKey || node.key == endKey || node.hasDescendant(startKey) || node.hasDescendant(endKey)) {
        return true;
      }

      // PERF: if the selection is collapsed and the previous check didn't return
      // true, then it must be false.
      if (isCollapsed) {
        return false;
      }

      // Otherwise, look through all of the leaf text nodes in the range, to see
      // if any of them are inside the node.
      var texts = node.getTextsAtRange(range);
      var memo = false;

      texts.forEach(function (text) {
        if (node.hasDescendant(text.key)) memo = true;
        return memo;
      });

      return memo;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Node` with `attrs`.
     *
     * @param {Object|Node} attrs
     * @return {Node}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Node.isNode(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        var object = attrs.object;


        if (!object && attrs.kind) {
          logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');

          object = attrs.kind;
        }

        switch (object) {
          case 'block':
            return Block.create(attrs);
          case 'document':
            return Document.create(attrs);
          case 'inline':
            return Inline.create(attrs);
          case 'text':
            return Text.create(attrs);

          default:
            {
              throw new Error('`Node.create` requires a `object` string.');
            }
        }
      }

      throw new Error('`Node.create` only accepts objects or nodes but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Nodes` from an array.
     *
     * @param {Array<Object|Node>} elements
     * @return {List<Node>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = List(elements.map(Node.create));
        return list;
      }

      throw new Error('`Node.createList` only accepts lists or arrays, but you passed it: ' + elements);
    }

    /**
     * Create a dictionary of settable node properties from `attrs`.
     *
     * @param {Object|String|Node} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Block.isBlock(attrs) || Inline.isInline(attrs)) {
        return {
          data: attrs.data,
          isVoid: attrs.isVoid,
          type: attrs.type
        };
      }

      if (typeof attrs == 'string') {
        return { type: attrs };
      }

      if (isPlainObject(attrs)) {
        var props = {};
        if ('type' in attrs) props.type = attrs.type;
        if ('data' in attrs) props.data = Data.create(attrs.data);
        if ('isVoid' in attrs) props.isVoid = attrs.isVoid;
        return props;
      }

      throw new Error('`Node.createProperties` only accepts objects, strings, blocks or inlines, but you passed it: ' + attrs);
    }

    /**
     * Create a `Node` from a JSON `value`.
     *
     * @param {Object} value
     * @return {Node}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(value) {
      var object = value.object;


      if (!object && value.kind) {
        logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');

        object = value.kind;
      }

      switch (object) {
        case 'block':
          return Block.fromJSON(value);
        case 'document':
          return Document.fromJSON(value);
        case 'inline':
          return Inline.fromJSON(value);
        case 'text':
          return Text.fromJSON(value);

        default:
          {
            throw new Error('`Node.fromJSON` requires an `object` of either \'block\', \'document\', \'inline\' or \'text\', but you passed: ' + value);
          }
      }
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isNode',


    /**
     * Check if `any` is a `Node`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isNode(any) {
      return !!['BLOCK', 'DOCUMENT', 'INLINE', 'TEXT'].find(function (type) {
        return isType(type, any);
      });
    }

    /**
     * Check if `any` is a list of nodes.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isNodeList',
    value: function isNodeList(any) {
      return List.isList(any) && any.every(function (item) {
        return Node.isNode(item);
      });
    }
  }]);
  return Node;
}();

/**
 * Mix in assertion variants.
 */

Node.fromJS = Node.fromJSON;
var ASSERTS = ['Child', 'Depth', 'Descendant', 'Node', 'Parent', 'Path'];

var _loop = function _loop(method) {
  Node.prototype['assert' + method] = function (path) {
    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var ret = this['get' + method].apply(this, [path].concat(args));

    if (ret == null) {
      throw new Error('`Node.assert' + method + '` could not find node with path or key: ' + path);
    }

    return ret;
  };
};

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  for (var _iterator2 = ASSERTS[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    var method = _step2.value;

    _loop(method);
  }

  /**
   * Memoize read methods.
   */
} catch (err) {
  _didIteratorError2 = true;
  _iteratorError2 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion2 && _iterator2.return) {
      _iterator2.return();
    }
  } finally {
    if (_didIteratorError2) {
      throw _iteratorError2;
    }
  }
}

memoize(Node.prototype, ['getBlocksAsArray', 'getBlocksAtRangeAsArray', 'getBlocksByTypeAsArray', 'getDecorations', 'getFirstInvalidDescendant', 'getFirstText', 'getFragmentAtRange', 'getInlinesAsArray', 'getInlinesAtRangeAsArray', 'getInlinesByTypeAsArray', 'getMarksAsArray', 'getMarksAtPosition', 'getOrderedMarksBetweenPositions', 'getInsertMarksAtRange', 'getKeysToPathsTable', 'getLastText', 'getMarksByTypeAsArray', 'getNextBlock', 'getOffset', 'getOffsetAtRange', 'getPreviousBlock', 'getText', 'getTextAtOffset', 'getTextDirection', 'getTextsAsArray', 'getTextsBetweenPositionsAsArray', 'isLeafBlock', 'isLeafInline', 'normalize', 'validate']);

/**
 * Mix in `Node` methods.
 */

Object.getOwnPropertyNames(Node.prototype).forEach(function (method) {
  if (method === 'constructor') return;
  Block.prototype[method] = Node.prototype[method];
  Inline.prototype[method] = Node.prototype[method];
  Document.prototype[method] = Node.prototype[method];
});

Block.createChildren = Node.createList;
Inline.createChildren = Node.createList;
Document.createChildren = Node.createList;

/**
 * Surrogate pair start and end points.
 *
 * @type {Number}
 */

var SURROGATE_START = 0xd800;
var SURROGATE_END = 0xdfff;

/**
 * A regex to match space characters.
 *
 * @type {RegExp}
 */

var SPACE = /\s/;

/**
 * A regex to match chameleon characters, that count as word characters as long
 * as they are inside of a word.
 *
 * @type {RegExp}
 */

var CHAMELEON = /['\u2018\u2019]/;

/**
 * A regex that matches punctuation.
 *
 * @type {RegExp}
 */

var PUNCTUATION = /[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/;

/**
 * Is a character `code` in a surrogate character.
 *
 * @param {Number} code
 * @return {Boolean}
 */

function isSurrogate(code) {
  return SURROGATE_START <= code && code <= SURROGATE_END;
}

/**
 * Is a character a word character? Needs the `remaining` characters too.
 *
 * @param {String} char
 * @param {String|Void} remaining
 * @return {Boolean}
 */

function isWord(char, remaining) {
  if (SPACE.test(char)) return false;

  // If it's a chameleon character, recurse to see if the next one is or not.
  if (CHAMELEON.test(char)) {
    var next = remaining.charAt(0);
    var length = getCharLength(next);
    next = remaining.slice(0, length);
    var rest = remaining.slice(length);
    if (isWord(next, rest)) return true;
  }

  if (PUNCTUATION.test(char)) return false;
  return true;
}

/**
 * Get the length of a `character`.
 *
 * @param {String} char
 * @return {Number}
 */

function getCharLength(char) {
  return isSurrogate(char.charCodeAt(0)) ? 2 : 1;
}

/**
 * Get the offset to the end of the first character in `text`.
 *
 * @param {String} text
 * @return {Number}
 */

function getCharOffset(text) {
  var char = text.charAt(0);
  return getCharLength(char);
}

/**
 * Get the offset to the end of the character before an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getCharOffsetBackward(text, offset) {
  text = text.slice(0, offset);
  text = reverse(text);
  return getCharOffset(text);
}

/**
 * Get the offset to the end of the character after an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getCharOffsetForward(text, offset) {
  text = text.slice(offset);
  return getCharOffset(text);
}

/**
 * Get the offset to the end of the first word in `text`.
 *
 * @param {String} text
 * @return {Number}
 */

function getWordOffset(text) {
  var length = 0;
  var i = 0;
  var started = false;
  var char = void 0;

  while (char = text.charAt(i)) {
    var l = getCharLength(char);
    char = text.slice(i, i + l);
    var rest = text.slice(i + l);

    if (isWord(char, rest)) {
      started = true;
      length += l;
    } else if (!started) {
      length += l;
    } else {
      break;
    }

    i += l;
  }

  return length;
}

/**
 * Get the offset to the end of the word before an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getWordOffsetBackward(text, offset) {
  text = text.slice(0, offset);
  text = reverse(text);
  var o = getWordOffset(text);
  return o;
}

/**
 * Get the offset to the end of the word after an `offset` in `text`.
 *
 * @param {String} text
 * @param {Number} offset
 * @return {Number}
 */

function getWordOffsetForward(text, offset) {
  text = text.slice(offset);
  var o = getWordOffset(text);
  return o;
}

/**
 * Export.
 *
 * @type {Object}
 */

var TextUtils = {
  getCharLength: getCharLength,
  getCharOffset: getCharOffset,
  getCharOffsetBackward: getCharOffsetBackward,
  getCharOffsetForward: getCharOffsetForward,
  getWordOffset: getWordOffset,
  getWordOffsetBackward: getWordOffsetBackward,
  getWordOffsetForward: getWordOffsetForward,
  isSurrogate: isSurrogate,
  isWord: isWord
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$1 = {};

/**
 * Add a new `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.addMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;

  var texts = document.getTextsAtRange(range);

  texts.forEach(function (node) {
    var key = node.key;

    var index = 0;
    var length = node.text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.addMarkByKey(key, index, length, mark, { normalize: normalize });
  });
};

/**
 * Add a list of `marks` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Array<Mixed>} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.addMarksAtRange = function (change, range, marks) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  marks.forEach(function (mark) {
    return change.addMarkAtRange(range, mark, options);
  });
};

/**
 * Delete everything in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteAtRange = function (change, range) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (range.isCollapsed) return;

  // Snapshot the selection, which creates an extra undo save point, so that
  // when you undo a delete, the expanded selection will be retained.
  change.snapshotSelection();

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;
  var document = value.document;

  var isStartVoid = document.hasVoidParent(startKey);
  var isEndVoid = document.hasVoidParent(endKey);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  var isHanging = startOffset == 0 && endOffset == 0 && isStartVoid == false && startKey == startBlock.getFirstText().key && endKey == endBlock.getFirstText().key;

  // If it's a hanging selection, nudge it back to end in the previous text.
  if (isHanging && isEndVoid) {
    var prevText = document.getPreviousText(endKey);
    endKey = prevText.key;
    endOffset = prevText.text.length;
    isEndVoid = document.hasVoidParent(endKey);
  }

  // If the start node is inside a void node, remove the void node and update
  // the starting point to be right after it, continuously until the start point
  // is not a void, or until the entire range is handled.
  while (isStartVoid) {
    var startVoid = document.getClosestVoid(startKey);
    var nextText = document.getNextText(startKey);
    change.removeNodeByKey(startVoid.key, { normalize: false });

    // If the start and end keys are the same, we're done.
    if (startKey == endKey) return;

    // If there is no next text node, we're done.
    if (!nextText) return;

    // Continue...
    document = change.value.document;
    startKey = nextText.key;
    startOffset = 0;
    isStartVoid = document.hasVoidParent(startKey);
  }

  // If the end node is inside a void node, do the same thing but backwards. But
  // we don't need any aborting checks because if we've gotten this far there
  // must be a non-void node that will exit the loop.
  while (isEndVoid) {
    var endVoid = document.getClosestVoid(endKey);
    var _prevText = document.getPreviousText(endKey);
    change.removeNodeByKey(endVoid.key, { normalize: false });

    // Continue...
    document = change.value.document;
    endKey = _prevText.key;
    endOffset = _prevText.text.length;
    isEndVoid = document.hasVoidParent(endKey);
  }

  // If the start and end key are the same, and it was a hanging selection, we
  // can just remove the entire block.
  if (startKey == endKey && isHanging) {
    change.removeNodeByKey(startBlock.key, { normalize: normalize });
    return;
  } else if (startKey == endKey) {
    // Otherwise, if it wasn't hanging, we're inside a single text node, so we can
    // simply remove the text in the range.
    var index = startOffset;
    var length = endOffset - startOffset;
    change.removeTextByKey(startKey, index, length, { normalize: normalize });
    return;
  } else {
    // Otherwise, we need to recursively remove text and nodes inside the start
    // block after the start offset and inside the end block before the end
    // offset. Then remove any blocks that are in between the start and end
    // blocks. Then finally merge the start and end nodes.
    startBlock = document.getClosestBlock(startKey);
    endBlock = document.getClosestBlock(endKey);
    var startText = document.getNode(startKey);
    var endText = document.getNode(endKey);
    var startLength = startText.text.length - startOffset;
    var endLength = endOffset;

    var ancestor = document.getCommonAncestor(startKey, endKey);
    var startChild = ancestor.getFurthestAncestor(startKey);
    var endChild = ancestor.getFurthestAncestor(endKey);

    var startParent = document.getParent(startBlock.key);
    var startParentIndex = startParent.nodes.indexOf(startBlock);
    var endParentIndex = startParent.nodes.indexOf(endBlock);

    var child = void 0;

    // Iterate through all of the nodes in the tree after the start text node
    // but inside the end child, and remove them.
    child = startText;

    while (child.key != startChild.key) {
      var parent = document.getParent(child.key);
      var _index = parent.nodes.indexOf(child);
      var afters = parent.nodes.slice(_index + 1);

      afters.reverse().forEach(function (node) {
        change.removeNodeByKey(node.key, { normalize: false });
      });

      child = parent;
    }

    // Remove all of the middle children.
    var startChildIndex = ancestor.nodes.indexOf(startChild);
    var endChildIndex = ancestor.nodes.indexOf(endChild);
    var middles = ancestor.nodes.slice(startChildIndex + 1, endChildIndex);

    middles.reverse().forEach(function (node) {
      change.removeNodeByKey(node.key, { normalize: false });
    });

    // Remove the nodes before the end text node in the tree.
    child = endText;

    while (child.key != endChild.key) {
      var _parent = document.getParent(child.key);
      var _index2 = _parent.nodes.indexOf(child);
      var befores = _parent.nodes.slice(0, _index2);

      befores.reverse().forEach(function (node) {
        change.removeNodeByKey(node.key, { normalize: false });
      });

      child = _parent;
    }

    // Remove any overlapping text content from the leaf text nodes.
    if (startLength != 0) {
      change.removeTextByKey(startKey, startOffset, startLength, {
        normalize: false
      });
    }

    if (endLength != 0) {
      change.removeTextByKey(endKey, 0, endOffset, { normalize: false });
    }

    // If the start and end blocks aren't the same, move and merge the end block
    // into the start block.
    if (startBlock.key != endBlock.key) {
      document = change.value.document;
      var lonely = document.getFurthestOnlyChildAncestor(endBlock.key);

      // Move the end block to be right after the start block.
      if (endParentIndex != startParentIndex + 1) {
        change.moveNodeByKey(endBlock.key, startParent.key, startParentIndex + 1, { normalize: false });
      }

      // If the selection is hanging, just remove the start block, otherwise
      // merge the end block into it.
      if (isHanging) {
        change.removeNodeByKey(startBlock.key, { normalize: false });
      } else {
        change.mergeNodeByKey(endBlock.key, { normalize: false });
      }

      // If nested empty blocks are left over above the end block, remove them.
      if (lonely) {
        change.removeNodeByKey(lonely.key, { normalize: false });
      }
    }

    // If we should normalize, do it now after everything.
    if (normalize) {
      change.normalizeNodeByKey(ancestor.key);
    }
  }
};

/**
 * Delete backward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteCharBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = TextUtils.getCharOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteLineBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteBackwardAtRange(range, o, options);
};

/**
 * Delete backward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteWordBackwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = TextUtils.getWordOffsetBackward(text, o);
  change.deleteBackwardAtRange(range, n, options);
};

/**
 * Delete backward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteBackwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (n === 0) return;
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var _range = range,
      startKey = _range.startKey,
      focusOffset = _range.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var voidParent = document.getClosestVoid(startKey);

  // If there is a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);

  // If the closest is not void, but empty, remove it
  if (block && block.isEmpty && document.nodes.size !== 1) {
    change.removeNodeByKey(block.key, { normalize: normalize });
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtStartOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);

  if (range.isAtStartOf(text)) {
    var prev = document.getPreviousText(text.key);
    var prevBlock = document.getClosestBlock(prev.key);
    var prevVoid = document.getClosestVoid(prev.key);

    // If the previous text node has a void parent, remove it.
    if (prevVoid) {
      change.removeNodeByKey(prevVoid.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && prevBlock != block) {
      range = range.merge({
        anchorKey: prev.key,
        anchorOffset: prev.text.length
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the focus offset is farther than the number of characters to delete,
  // just remove the characters backwards inside the current node.
  if (n < focusOffset) {
    range = range.merge({
      focusOffset: focusOffset - n,
      isBackward: true
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes backwards to go.
  var node = text;
  var offset = 0;
  var traversed = focusOffset;

  while (n > traversed) {
    node = document.getPreviousText(node.key);
    var next = traversed + node.text.length;

    if (n <= next) {
      offset = next - n;
      break;
    } else {
      traversed = next;
    }
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset,
    isBackward: true
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Delete forward until the character boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteCharForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = TextUtils.getCharOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward until the line boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteLineForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  change.deleteForwardAtRange(range, startBlock.text.length - o, options);
};

/**
 * Delete forward until the word boundary at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteWordForwardAtRange = function (change, range, options) {
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var offset = startBlock.getOffset(startKey);
  var o = offset + startOffset;
  var text = startBlock.text;

  var n = TextUtils.getWordOffsetForward(text, o);
  change.deleteForwardAtRange(range, n, options);
};

/**
 * Delete forward `n` characters at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} n (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.deleteForwardAtRange = function (change, range) {
  var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (n === 0) return;
  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;
  var _range2 = range,
      startKey = _range2.startKey,
      focusOffset = _range2.focusOffset;

  // If the range is expanded, perform a regular delete instead.

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  var voidParent = document.getClosestVoid(startKey);

  // If the node has a void parent, delete it.
  if (voidParent) {
    change.removeNodeByKey(voidParent.key, { normalize: normalize });
    return;
  }

  var block = document.getClosestBlock(startKey);

  // If the closest is not void, but empty, remove it
  if (block && block.isEmpty && document.nodes.size !== 1) {
    var nextBlock = document.getNextBlock(block.key);
    change.removeNodeByKey(block.key, { normalize: normalize });

    if (nextBlock && nextBlock.key) {
      change.moveToStartOf(nextBlock);
    }
    return;
  }

  // If the range is at the start of the document, abort.
  if (range.isAtEndOf(document)) {
    return;
  }

  // If the range is at the start of the text node, we need to figure out what
  // is behind it to know how to delete...
  var text = document.getDescendant(startKey);

  if (range.isAtEndOf(text)) {
    var next = document.getNextText(text.key);
    var _nextBlock = document.getClosestBlock(next.key);
    var nextVoid = document.getClosestVoid(next.key);

    // If the next text node has a void parent, remove it.
    if (nextVoid) {
      change.removeNodeByKey(nextVoid.key, { normalize: normalize });
      return;
    }

    // If we're deleting by one character and the previous text node is not
    // inside the current block, we need to merge the two blocks together.
    if (n == 1 && _nextBlock != block) {
      range = range.merge({
        focusKey: next.key,
        focusOffset: 0
      });

      change.deleteAtRange(range, { normalize: normalize });
      return;
    }
  }

  // If the remaining characters to the end of the node is greater than or equal
  // to the number of characters to delete, just remove the characters forwards
  // inside the current node.
  if (n <= text.text.length - focusOffset) {
    range = range.merge({
      focusOffset: focusOffset + n
    });

    change.deleteAtRange(range, { normalize: normalize });
    return;
  }

  // Otherwise, we need to see how many nodes forwards to go.
  var node = text;
  var offset = focusOffset;
  var traversed = text.text.length - focusOffset;

  while (n > traversed) {
    node = document.getNextText(node.key);
    var _next = traversed + node.text.length;

    if (n <= _next) {
      offset = n - traversed;
      break;
    } else {
      traversed = _next;
    }
  }

  range = range.merge({
    focusKey: node.key,
    focusOffset: offset
  });

  change.deleteAtRange(range, { normalize: normalize });
};

/**
 * Insert a `block` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|String|Object} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = Block.create(block);
  var normalize = change.getFlag('normalize', options);

  if (range.isExpanded) {
    change.deleteAtRange(range);
    range = range.collapseToStart();
  }

  var value = change.value;
  var document = value.document;
  var _range3 = range,
      startKey = _range3.startKey,
      startOffset = _range3.startOffset;

  var startBlock = document.getClosestBlock(startKey);
  var startInline = document.getClosestInline(startKey);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);

  if (startBlock.isVoid) {
    var extra = range.isAtEndOf(startBlock) ? 1 : 0;
    change.insertNodeByKey(parent.key, index + extra, block, { normalize: normalize });
  } else if (startBlock.isEmpty) {
    change.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  } else if (range.isAtStartOf(startBlock)) {
    change.insertNodeByKey(parent.key, index, block, { normalize: normalize });
  } else if (range.isAtEndOf(startBlock)) {
    change.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  } else {
    if (startInline && startInline.isVoid) {
      var atEnd = range.isAtEndOf(startInline);
      var siblingText = atEnd ? document.getNextText(startKey) : document.getPreviousText(startKey);

      var splitRange = atEnd ? range.moveToStartOf(siblingText) : range.moveToEndOf(siblingText);

      startKey = splitRange.startKey;
      startOffset = splitRange.startOffset;
    }

    change.splitDescendantsByKey(startBlock.key, startKey, startOffset, {
      normalize: false
    });

    change.insertNodeByKey(parent.key, index + 1, block, { normalize: normalize });
  }

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert a `fragment` at a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Document} fragment
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertFragmentAtRange = function (change, range, fragment) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  // If the range is expanded, delete it first.
  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });

    if (change.value.document.getDescendant(range.startKey)) {
      range = range.collapseToStart();
    } else {
      range = range.collapseTo(range.endKey, 0);
    }
  }

  // If the fragment is empty, there's nothing to do after deleting.
  if (!fragment.nodes.size) return;

  // Regenerate the keys for all of the fragments nodes, so that they're
  // guaranteed not to collide with the existing keys in the document. Otherwise
  // they will be rengerated automatically and we won't have an easy way to
  // reference them.
  fragment = fragment.mapDescendants(function (child) {
    return child.regenerateKey();
  });

  // Calculate a few things...
  var _range4 = range,
      startKey = _range4.startKey,
      startOffset = _range4.startOffset;
  var value = change.value;
  var document = value.document;

  var startText = document.getDescendant(startKey);
  var startBlock = document.getClosestBlock(startText.key);
  var startChild = startBlock.getFurthestAncestor(startText.key);
  var isAtStart = range.isAtStartOf(startBlock);
  var parent = document.getParent(startBlock.key);
  var index = parent.nodes.indexOf(startBlock);
  var blocks = fragment.getBlocks();
  var firstChild = fragment.nodes.first();
  var lastChild = fragment.nodes.last();
  var firstBlock = blocks.first();
  var lastBlock = blocks.last();

  // If the fragment only contains a void block, use `insertBlock` instead.
  if (firstBlock == lastBlock && firstBlock.isVoid) {
    change.insertBlockAtRange(range, firstBlock, options);
    return;
  }

  // If the fragment starts or ends with single nested block, (e.g., table),
  // do not merge this fragment with existing blocks.
  if (firstChild.hasBlockChildren() || lastChild.hasBlockChildren()) {
    fragment.nodes.reverse().forEach(function (node) {
      change.insertBlockAtRange(range, node, options);
    });
    return;
  }

  // If the first and last block aren't the same, we need to insert all of the
  // nodes after the fragment's first block at the index.
  if (firstBlock != lastBlock) {
    var lonelyParent = fragment.getFurthest(firstBlock.key, function (p) {
      return p.nodes.size == 1;
    });
    var lonelyChild = lonelyParent || firstBlock;
    var startIndex = parent.nodes.indexOf(startBlock);
    fragment = fragment.removeNode(lonelyChild.key);

    fragment.nodes.forEach(function (node, i) {
      var newIndex = startIndex + i + 1;
      change.insertNodeByKey(parent.key, newIndex, node, { normalize: false });
    });
  }

  // Check if we need to split the node.
  if (startOffset != 0) {
    change.splitDescendantsByKey(startChild.key, startKey, startOffset, {
      normalize: false
    });
  }

  // Update our variables with the new value.
  document = change.value.document;
  startText = document.getDescendant(startKey);
  startBlock = document.getClosestBlock(startKey);
  startChild = startBlock.getFurthestAncestor(startText.key);

  // If the first and last block aren't the same, we need to move any of the
  // starting block's children after the split into the last block of the
  // fragment, which has already been inserted.
  if (firstBlock != lastBlock) {
    var nextChild = isAtStart ? startChild : startBlock.getNextSibling(startChild.key);
    var nextNodes = nextChild ? startBlock.nodes.skipUntil(function (n) {
      return n.key == nextChild.key;
    }) : List();
    var lastIndex = lastBlock.nodes.size;

    nextNodes.forEach(function (node, i) {
      var newIndex = lastIndex + i;

      change.moveNodeByKey(node.key, lastBlock.key, newIndex, {
        normalize: false
      });
    });
  }

  // If the starting block is empty, we replace it entirely with the first block
  // of the fragment, since this leads to a more expected behavior for the user.
  if (startBlock.isEmpty) {
    change.removeNodeByKey(startBlock.key, { normalize: false });
    change.insertNodeByKey(parent.key, index, firstBlock, { normalize: false });
  } else {
    // Otherwise, we maintain the starting block, and insert all of the first
    // block's inline nodes into it at the split point.
    var inlineChild = startBlock.getFurthestAncestor(startText.key);
    var inlineIndex = startBlock.nodes.indexOf(inlineChild);

    firstBlock.nodes.forEach(function (inline, i) {
      var o = startOffset == 0 ? 0 : 1;
      var newIndex = inlineIndex + i + o;

      change.insertNodeByKey(startBlock.key, newIndex, inline, {
        normalize: false
      });
    });
  }

  // Normalize if requested.
  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert an `inline` node at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|String|Object} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  inline = Inline.create(inline);

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });
    range = range.collapseToStart();
  }

  var value = change.value;
  var document = value.document;
  var _range5 = range,
      startKey = _range5.startKey,
      startOffset = _range5.startOffset;

  var parent = document.getParent(startKey);
  var startText = document.assertDescendant(startKey);
  var index = parent.nodes.indexOf(startText);

  if (parent.isVoid) return;

  change.splitNodeByKey(startKey, startOffset, { normalize: false });
  change.insertNodeByKey(parent.key, index + 1, inline, { normalize: false });

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Insert `text` at a `range`, with optional `marks`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.insertTextAtRange = function (change, range, text, marks) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var normalize = options.normalize;
  var value = change.value;
  var document = value.document;
  var startKey = range.startKey,
      startOffset = range.startOffset;

  var key = startKey;
  var offset = startOffset;
  var parent = document.getParent(startKey);

  if (parent.isVoid) return;

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: false });

    // Update range start after delete
    if (change.value.startKey !== key) {
      key = change.value.startKey;
      offset = change.value.startOffset;
    }
  }

  // PERF: Unless specified, don't normalize if only inserting text.
  if (normalize === undefined) {
    normalize = range.isExpanded && marks && marks.size !== 0;
  }

  change.insertTextByKey(key, offset, text, marks, { normalize: false });

  if (normalize) {
    // normalize in the narrowest existing block that originally contains startKey and endKey
    var commonAncestor = document.getCommonAncestor(startKey, range.endKey);
    var ancestors = document.getAncestors(commonAncestor.key).push(commonAncestor);
    var normalizeAncestor = ancestors.findLast(function (n) {
      return change.value.document.getDescendant(n.key);
    });
    // it is possible that normalizeAncestor doesn't return any node
    // on that case fallback to startKey to be normalized
    var normalizeKey = normalizeAncestor ? normalizeAncestor.key : startKey;
    change.normalizeNodeByKey(normalizeKey);
  }
};

/**
 * Remove an existing `mark` to the characters at `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mark|String} mark (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.removeMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var texts = document.getTextsAtRange(range);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  texts.forEach(function (node) {
    var key = node.key;

    var index = 0;
    var length = node.text.length;

    if (key == startKey) index = startOffset;
    if (key == endKey) length = endOffset;
    if (key == startKey && key == endKey) length = endOffset - startOffset;

    change.removeMarkByKey(key, index, length, mark, { normalize: normalize });
  });
};

/**
 * Set the `properties` of block nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.setBlocksAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var blocks = document.getBlocksAtRange(range);

  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset,
      isCollapsed = range.isCollapsed;

  var isStartVoid = document.hasVoidParent(startKey);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);

  // Check if we have a "hanging" selection case where the even though the
  // selection extends into the start of the end node, we actually want to
  // ignore that for UX reasons.
  var isHanging = isCollapsed == false && startOffset == 0 && endOffset == 0 && isStartVoid == false && startKey == startBlock.getFirstText().key && endKey == endBlock.getFirstText().key;

  // If it's a hanging selection, ignore the last block.
  var sets = isHanging ? blocks.slice(0, -1) : blocks;

  sets.forEach(function (block) {
    change.setNodeByKey(block.key, properties, { normalize: normalize });
  });
};

Changes$1.setBlockAtRange = function () {
  logger.deprecate('slate@0.33.0', 'The `setBlockAtRange` method of Slate changes has been renamed to `setBlocksAtRange`.');

  Changes$1.setBlocksAtRange.apply(Changes$1, arguments);
};

/**
 * Set the `properties` of inline nodes in a `range`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Object|String} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.setInlinesAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var inlines = document.getInlinesAtRange(range);

  inlines.forEach(function (inline) {
    change.setNodeByKey(inline.key, properties, { normalize: normalize });
  });
};

Changes$1.setInlineAtRange = function () {
  logger.deprecate('slate@0.33.0', 'The `setInlineAtRange` method of Slate changes has been renamed to `setInlinesAtRange`.');

  Changes$1.setInlinesAtRange.apply(Changes$1, arguments);
};

/**
 * Split the block nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.splitBlockAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  var _range6 = range,
      startKey = _range6.startKey,
      startOffset = _range6.startOffset,
      endOffset = _range6.endOffset,
      endKey = _range6.endKey;
  var value = change.value;
  var document = value.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestBlock(node.key);
  var h = 0;

  while (parent && parent.object == 'block' && h < height) {
    node = parent;
    parent = document.getClosestBlock(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, {
    normalize: normalize && range.isCollapsed
  });

  if (range.isExpanded) {
    if (range.isBackward) range = range.flip();
    var nextBlock = change.value.document.getNextBlock(node.key);
    range = range.moveAnchorToStartOf(nextBlock);

    if (startKey === endKey) {
      range = range.moveFocusTo(range.anchorKey, endOffset - startOffset);
    }

    change.deleteAtRange(range, { normalize: normalize });
  }
};

/**
 * Split the inline nodes at a `range`, to optional `height`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Number} height (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.splitInlineAtRange = function (change, range) {
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var normalize = change.getFlag('normalize', options);

  if (range.isExpanded) {
    change.deleteAtRange(range, { normalize: normalize });
    range = range.collapseToStart();
  }

  var _range7 = range,
      startKey = _range7.startKey,
      startOffset = _range7.startOffset;
  var value = change.value;
  var document = value.document;

  var node = document.assertDescendant(startKey);
  var parent = document.getClosestInline(node.key);
  var h = 0;

  while (parent && parent.object == 'inline' && h < height) {
    node = parent;
    parent = document.getClosestInline(parent.key);
    h++;
  }

  change.splitDescendantsByKey(node.key, startKey, startOffset, { normalize: normalize });
};

/**
 * Add or remove a `mark` from the characters at `range`, depending on whether
 * it's already there.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Mixed} mark
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.toggleMarkAtRange = function (change, range, mark) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (range.isCollapsed) return;

  mark = Mark.create(mark);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var marks = document.getActiveMarksAtRange(range);
  var exists = marks.some(function (m) {
    return m.equals(mark);
  });

  if (exists) {
    change.removeMarkAtRange(range, mark, { normalize: normalize });
  } else {
    change.addMarkAtRange(range, mark, { normalize: normalize });
  }
};

/**
 * Unwrap all of the block nodes in a `range` from a block with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.unwrapBlockAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = Node.createProperties(properties);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var blocks = document.getBlocksAtRange(range);
  var wrappers = blocks.map(function (block) {
    return document.getClosest(block.key, function (parent) {
      if (parent.object != 'block') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  wrappers.forEach(function (block) {
    var first = block.nodes.first();
    var last = block.nodes.last();
    var parent = document.getParent(block.key);
    var index = parent.nodes.indexOf(block);

    var children = block.nodes.filter(function (child) {
      return blocks.some(function (b) {
        return child == b || child.hasDescendant(b.key);
      });
    });

    var firstMatch = children.first();
    var lastMatch = children.last();

    if (first == firstMatch && last == lastMatch) {
      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + i, {
          normalize: false
        });
      });

      change.removeNodeByKey(block.key, { normalize: false });
    } else if (last == lastMatch) {
      block.nodes.skipUntil(function (n) {
        return n == firstMatch;
      }).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + 1 + i, {
          normalize: false
        });
      });
    } else if (first == firstMatch) {
      block.nodes.takeUntil(function (n) {
        return n == lastMatch;
      }).push(lastMatch).forEach(function (child, i) {
        change.moveNodeByKey(child.key, parent.key, index + i, {
          normalize: false
        });
      });
    } else {
      var firstText = firstMatch.getFirstText();

      change.splitDescendantsByKey(block.key, firstText.key, 0, {
        normalize: false
      });

      document = change.value.document;

      children.forEach(function (child, i) {
        if (i == 0) {
          var extra = child;
          child = document.getNextBlock(child.key);
          change.removeNodeByKey(extra.key, { normalize: false });
        }

        change.moveNodeByKey(child.key, parent.key, index + 1 + i, {
          normalize: false
        });
      });
    }
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument();
  }
};

/**
 * Unwrap the inline nodes in a `range` from an inline with `properties`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String|Object} properties
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.unwrapInlineAtRange = function (change, range, properties) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  properties = Node.createProperties(properties);

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;

  var texts = document.getTextsAtRange(range);
  var inlines = texts.map(function (text) {
    return document.getClosest(text.key, function (parent) {
      if (parent.object != 'inline') return false;
      if (properties.type != null && parent.type != properties.type) return false;
      if (properties.isVoid != null && parent.isVoid != properties.isVoid) return false;
      if (properties.data != null && !parent.data.isSuperset(properties.data)) return false;
      return true;
    });
  }).filter(function (exists) {
    return exists;
  }).toOrderedSet().toList();

  inlines.forEach(function (inline) {
    var parent = change.value.document.getParent(inline.key);
    var index = parent.nodes.indexOf(inline);

    inline.nodes.forEach(function (child, i) {
      change.moveNodeByKey(child.key, parent.key, index + i, {
        normalize: false
      });
    });
  });

  // TODO: optmize to only normalize the right block
  if (normalize) {
    change.normalizeDocument();
  }
};

/**
 * Wrap all of the blocks in a `range` in a new `block`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Block|Object|String} block
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapBlockAtRange = function (change, range, block) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  block = Block.create(block);
  block = block.set('nodes', block.nodes.clear());

  var normalize = change.getFlag('normalize', options);
  var value = change.value;
  var document = value.document;


  var blocks = document.getBlocksAtRange(range);
  var firstblock = blocks.first();
  var lastblock = blocks.last();
  var parent = void 0,
      siblings = void 0,
      index = void 0;

  // If there is only one block in the selection then we know the parent and
  // siblings.
  if (blocks.length === 1) {
    parent = document.getParent(firstblock.key);
    siblings = blocks;
  } else {
    // Determine closest shared parent to all blocks in selection.
    parent = document.getClosest(firstblock.key, function (p1) {
      return !!document.getClosest(lastblock.key, function (p2) {
        return p1 == p2;
      });
    });
  }

  // If no shared parent could be found then the parent is the document.
  if (parent == null) parent = document;

  // Create a list of direct children siblings of parent that fall in the
  // selection.
  if (siblings == null) {
    var indexes = parent.nodes.reduce(function (ind, node, i) {
      if (node == firstblock || node.hasDescendant(firstblock.key)) ind[0] = i;
      if (node == lastblock || node.hasDescendant(lastblock.key)) ind[1] = i;
      return ind;
    }, []);

    index = indexes[0];
    siblings = parent.nodes.slice(indexes[0], indexes[1] + 1);
  }

  // Get the index to place the new wrapped node at.
  if (index == null) {
    index = parent.nodes.indexOf(siblings.first());
  }

  // Inject the new block node into the parent.
  change.insertNodeByKey(parent.key, index, block, { normalize: false });

  // Move the sibling nodes into the new block node.
  siblings.forEach(function (node, i) {
    change.moveNodeByKey(node.key, block.key, i, { normalize: false });
  });

  if (normalize) {
    change.normalizeNodeByKey(parent.key);
  }
};

/**
 * Wrap the text and inlines in a `range` in a new `inline`.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {Inline|Object|String} inline
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapInlineAtRange = function (change, range, inline) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var value = change.value;
  var document = value.document;

  var normalize = change.getFlag('normalize', options);
  var startKey = range.startKey,
      startOffset = range.startOffset,
      endKey = range.endKey,
      endOffset = range.endOffset;


  if (range.isCollapsed) {
    // Wrapping an inline void
    var inlineParent = document.getClosestInline(startKey);

    if (!inlineParent.isVoid) {
      return;
    }

    return change.wrapInlineByKey(inlineParent.key, inline, options);
  }

  inline = Inline.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());

  var blocks = document.getBlocksAtRange(range);
  var startBlock = document.getClosestBlock(startKey);
  var endBlock = document.getClosestBlock(endKey);
  var startInline = document.getClosestInline(startKey);
  var endInline = document.getClosestInline(endKey);
  var startChild = startBlock.getFurthestAncestor(startKey);
  var endChild = endBlock.getFurthestAncestor(endKey);

  if (!startInline || startInline != endInline) {
    change.splitDescendantsByKey(endChild.key, endKey, endOffset, {
      normalize: false
    });

    change.splitDescendantsByKey(startChild.key, startKey, startOffset, {
      normalize: false
    });
  }

  document = change.value.document;
  startBlock = document.getDescendant(startBlock.key);
  endBlock = document.getDescendant(endBlock.key);
  startChild = startBlock.getFurthestAncestor(startKey);
  endChild = endBlock.getFurthestAncestor(endKey);
  var startIndex = startBlock.nodes.indexOf(startChild);
  var endIndex = endBlock.nodes.indexOf(endChild);

  if (startInline && startInline == endInline) {
    var text = startBlock.getTextsAtRange(range).get(0).splitText(startOffset)[1].splitText(endOffset - startOffset)[0];
    inline = inline.set('nodes', List([text]));
    Changes$1.insertInlineAtRange(change, range, inline, { normalize: false });
    var inlinekey = inline.getFirstText().key;
    var rng = {
      anchorKey: inlinekey,
      focusKey: inlinekey,
      anchorOffset: 0,
      focusOffset: endOffset - startOffset,
      isFocused: true
    };
    change.select(rng);
  } else if (startBlock == endBlock) {
    document = change.value.document;
    startBlock = document.getClosestBlock(startKey);
    startChild = startBlock.getFurthestAncestor(startKey);

    var startInner = document.getNextSibling(startChild.key);
    var startInnerIndex = startBlock.nodes.indexOf(startInner);
    var endInner = startKey == endKey ? startInner : startBlock.getFurthestAncestor(endKey);
    var inlines = startBlock.nodes.skipUntil(function (n) {
      return n == startInner;
    }).takeUntil(function (n) {
      return n == endInner;
    }).push(endInner);

    var node = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startInnerIndex, node, {
      normalize: false
    });

    inlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, node.key, i, { normalize: false });
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key);
    }
  } else {
    var startInlines = startBlock.nodes.slice(startIndex + 1);
    var endInlines = endBlock.nodes.slice(0, endIndex + 1);
    var startNode = inline.regenerateKey();
    var endNode = inline.regenerateKey();

    change.insertNodeByKey(startBlock.key, startIndex + 1, startNode, {
      normalize: false
    });

    change.insertNodeByKey(endBlock.key, endIndex, endNode, {
      normalize: false
    });

    startInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, startNode.key, i, { normalize: false });
    });

    endInlines.forEach(function (child, i) {
      change.moveNodeByKey(child.key, endNode.key, i, { normalize: false });
    });

    if (normalize) {
      change.normalizeNodeByKey(startBlock.key).normalizeNodeByKey(endBlock.key);
    }

    blocks.slice(1, -1).forEach(function (block) {
      var node = inline.regenerateKey();
      change.insertNodeByKey(block.key, 0, node, { normalize: false });

      block.nodes.forEach(function (child, i) {
        change.moveNodeByKey(child.key, node.key, i, { normalize: false });
      });

      if (normalize) {
        change.normalizeNodeByKey(block.key);
      }
    });
  }
};

/**
 * Wrap the text in a `range` in a prefix/suffix.
 *
 * @param {Change} change
 * @param {Range} range
 * @param {String} prefix
 * @param {String} suffix (optional)
 * @param {Object} options
 *   @property {Boolean} normalize
 */

Changes$1.wrapTextAtRange = function (change, range, prefix) {
  var suffix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : prefix;
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var normalize = change.getFlag('normalize', options);
  var startKey = range.startKey,
      endKey = range.endKey;

  var start = range.collapseToStart();
  var end = range.collapseToEnd();

  if (startKey == endKey) {
    end = end.move(prefix.length);
  }

  change.insertTextAtRange(start, prefix, [], { normalize: normalize });
  change.insertTextAtRange(end, suffix, [], { normalize: normalize });
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$2 = {};

/**
 * Add mark to text at `offset` and `length` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mixed} mark
 * @param {Object} options
 */

Changes$2.addMarkByPath = function (change, path, offset, length, mark, options) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  var leaves = node.getLeaves();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the leaf already has the mark, continue on.
    if (leaf.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'add_mark',
      value: value,
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);
  change.normalizeParentByPath(path, options);
};

/**
 * Insert a `fragment` at `index` in a node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} index
 * @param {Fragment} fragment
 * @param {Object} options
 */

Changes$2.insertFragmentByPath = function (change, path, index, fragment, options) {
  fragment.nodes.forEach(function (node, i) {
    change.insertNodeByPath(path, index + i, node);
  });

  change.normalizeNodeByPath(path, options);
};

/**
 * Insert a `node` at `index` in a node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} index
 * @param {Node} node
 * @param {Object} options
 */

Changes$2.insertNodeByPath = function (change, path, index, node, options) {
  var value = change.value;


  change.applyOperation({
    type: 'insert_node',
    value: value,
    path: path.concat(index),
    node: node
  });

  change.normalizeNodeByPath(path, options);
};

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} offset
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 */

Changes$2.insertTextByPath = function (change, path, offset, text, marks, options) {
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  marks = marks || node.getMarksAtIndex(offset);

  change.applyOperation({
    type: 'insert_text',
    value: value,
    path: path,
    offset: offset,
    text: text,
    marks: marks
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Merge a node by `path` with the previous node.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object} options
 */

Changes$2.mergeNodeByPath = function (change, path, options) {
  var value = change.value;
  var document = value.document;

  var original = document.getDescendant(path);
  var previous = document.getPreviousSibling(path);

  if (!previous) {
    throw new Error('Unable to merge node with path "' + path + '", because it has no previous sibling.');
  }

  var position = previous.object == 'text' ? previous.text.length : previous.nodes.size;

  change.applyOperation({
    type: 'merge_node',
    value: value,
    path: path,
    position: position,
    // for undos to succeed we only need the type and data because
    // these are the only properties that get changed in the merge operation
    properties: {
      type: original.type,
      data: original.data
    },
    target: null
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Move a node by `path` to a new parent by `newPath` and `index`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {String} newPath
 * @param {Number} index
 * @param {Object} options
 */

Changes$2.moveNodeByPath = function (change, path, newPath, newIndex, options) {
  var value = change.value;


  change.applyOperation({
    type: 'move_node',
    value: value,
    path: path,
    newPath: newPath.concat(newIndex)
  });

  var ancestorPath = PathUtils.relate(path, newPath);
  change.normalizeNodeByPath(ancestorPath, options);
};

/**
 * Remove mark from text at `offset` and `length` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 */

Changes$2.removeMarkByPath = function (change, path, offset, length, mark, options) {
  mark = Mark.create(mark);
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  var leaves = node.getLeaves();

  var operations = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the operation, continue on.
    if (ay < bx || by < ax) return;

    // If the leaf already has the mark, continue on.
    if (!leaf.marks.has(mark)) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);

    operations.push({
      type: 'remove_mark',
      value: value,
      path: path,
      offset: start,
      length: end - start,
      mark: mark
    });
  });

  change.applyOperations(operations);
  change.normalizeParentByPath(path, options);
};

/**
 * Remove all `marks` from node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object} options
 */

Changes$2.removeAllMarksByPath = function (change, path, options) {
  var state = change.state;
  var document = state.document;

  var node = document.assertNode(path);
  var texts = node.object === 'text' ? [node] : node.getTextsAsArray();

  texts.forEach(function (text) {
    text.getMarksAsArray().forEach(function (mark) {
      change.removeMarkByKey(text.key, 0, text.text.length, mark, options);
    });
  });
};

/**
 * Remove a node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object} options
 */

Changes$2.removeNodeByPath = function (change, path, options) {
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);

  change.applyOperation({
    type: 'remove_node',
    value: value,
    path: path,
    node: node
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Insert `text` at `offset` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {String} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 */

Changes$2.setTextByPath = function (change, path, text, marks, options) {
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  var end = node.text.length;
  change.replaceTextByPath(path, 0, end, text, marks, options);
};

/**
 * Replace A Length of Text with another string or text
 * @param {Change} change
 * @param {String} key
 * @param {Number} offset
 * @param {Number} length
 * @param {string} text
 * @param {Set<Mark>} marks (optional)
 * @param {Object} options
 *
 */

Changes$2.replaceTextByPath = function (change, path, offset, length, text, marks, options) {
  var document = change.value.document;

  var node = document.assertNode(path);

  if (length + offset > node.text.length) {
    length = node.text.length - offset;
  }

  var range = Range.create({
    anchorPath: path,
    focusPath: path,
    anchorOffset: offset,
    focusOffset: offset + length
  }).normalize(document);

  var activeMarks = document.getActiveMarksAtRange(range);

  change.removeTextByPath(path, offset, length, { normalize: false });

  if (!marks) {
    // Do not use mark at index when marks and activeMarks are both empty
    marks = activeMarks ? activeMarks : [];
  } else if (activeMarks) {
    // Do not use `has` because we may want to reset marks like font-size with an updated data;
    activeMarks = activeMarks.filter(function (activeMark) {
      return !marks.find(function (m) {
        return activeMark.type === m.type;
      });
    });

    marks = activeMarks.merge(marks);
  }

  change.insertTextByPath(path, offset, text, marks, options);
};

/**
 * Remove text at `offset` and `length` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Object} options
 */

Changes$2.removeTextByPath = function (change, path, offset, length, options) {
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  var leaves = node.getLeaves();
  var text = node.text;


  var removals = [];
  var bx = offset;
  var by = offset + length;
  var o = 0;

  leaves.forEach(function (leaf) {
    var ax = o;
    var ay = ax + leaf.text.length;

    o += leaf.text.length;

    // If the leaf doesn't overlap with the removal, continue on.
    if (ay < bx || by < ax) return;

    // Otherwise, determine which offset and characters overlap.
    var start = Math.max(ax, bx);
    var end = Math.min(ay, by);
    var string = text.slice(start, end);

    removals.push({
      type: 'remove_text',
      value: value,
      path: path,
      offset: start,
      text: string,
      marks: leaf.marks
    });
  });

  // Apply in reverse order, so subsequent removals don't impact previous ones.
  change.applyOperations(removals.reverse());

  var block = document.getClosestBlock(node.key);
  change.normalizeNodeByKey(block.key, options);
};

/**
`* Replace a `node` with another `node`
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object|Node} node
 * @param {Object} options
 */

Changes$2.replaceNodeByPath = function (change, path, newNode, options) {
  newNode = Node.create(newNode);
  var index = path.last();
  var parentPath = PathUtils.lift(path);
  change.removeNodeByPath(path, { normalize: false });
  change.insertNodeByPath(parentPath, index, newNode, { normalize: false });
  change.normalizeParentByPath(path, options);
};

/**
 * Set `properties` on mark on text at `offset` and `length` in node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} offset
 * @param {Number} length
 * @param {Mark} mark
 * @param {Object} options
 */

Changes$2.setMarkByPath = function (change, path, offset, length, mark, properties, options) {
  mark = Mark.create(mark);
  properties = Mark.createProperties(properties);
  var value = change.value;


  change.applyOperation({
    type: 'set_mark',
    value: value,
    path: path,
    offset: offset,
    length: length,
    mark: mark,
    properties: properties
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Set `properties` on a node by `path`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object|String} properties
 * @param {Object} options
 */

Changes$2.setNodeByPath = function (change, path, properties, options) {
  properties = Node.createProperties(properties);
  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);

  change.applyOperation({
    type: 'set_node',
    value: value,
    path: path,
    node: node,
    properties: properties
  });

  change.normalizeNodeByPath(path, options);
};

/**
 * Split a node by `path` at `position`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Number} position
 * @param {Object} options
 */

Changes$2.splitNodeByPath = function (change, path, position) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$target = options.target,
      target = _options$target === undefined ? null : _options$target;
  var value = change.value;
  var document = value.document;

  var node = document.getDescendant(path);

  change.applyOperation({
    type: 'split_node',
    value: value,
    path: path,
    position: position,
    properties: {
      type: node.type,
      data: node.data
    },
    target: target
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Split a node deeply down the tree by `path`, `textPath` and `textOffset`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Array} textPath
 * @param {Number} textOffset
 * @param {Object} options
 */

Changes$2.splitDescendantsByPath = function (change, path, textPath, textOffset, options) {
  if (path.equals(textPath)) {
    change.splitNodeByPath(textPath, textOffset, options);
    return;
  }

  var value = change.value;
  var document = value.document;

  var node = document.assertNode(path);
  var text = document.assertNode(textPath);
  var ancestors = document.getAncestors(textPath);
  var nodes = ancestors.skipUntil(function (a) {
    return a.key == node.key;
  }).reverse().unshift(text);

  var previous = void 0;
  var index = void 0;

  nodes.forEach(function (n) {
    var prevIndex = index == null ? null : index;
    index = previous ? n.nodes.indexOf(previous) + 1 : textOffset;
    previous = n;

    change.splitNodeByKey(n.key, index, {
      normalize: false,
      target: prevIndex
    });
  });

  change.normalizeParentByPath(path, options);
};

/**
 * Unwrap content from an inline parent with `properties`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object|String} properties
 * @param {Object} options
 */

Changes$2.unwrapInlineByPath = function (change, path, properties, options) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var node = document.assertNode(path);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapInlineAtRange(range, properties, options);
};

/**
 * Unwrap content from a block parent with `properties`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object|String} properties
 * @param {Object} options
 */

Changes$2.unwrapBlockByPath = function (change, path, properties, options) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var node = document.assertNode(path);
  var first = node.getFirstText();
  var last = node.getLastText();
  var range = selection.moveToRangeOf(first, last);
  change.unwrapBlockAtRange(range, properties, options);
};

/**
 * Unwrap a single node from its parent.
 *
 * If the node is surrounded with siblings, its parent will be
 * split. If the node is the only child, the parent is removed, and
 * simply replaced by the node itself.  Cannot unwrap a root node.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Object} options
 */

Changes$2.unwrapNodeByPath = function (change, path, options) {
  var value = change.value;
  var document = value.document;

  document.assertNode(path);

  var parentPath = PathUtils.lift(path);
  var parent = document.assertNode(parentPath);
  var index = path.last();
  var parentIndex = parentPath.last();
  var grandPath = PathUtils.lift(parentPath);
  var isFirst = index === 0;
  var isLast = index === parent.nodes.size - 1;

  if (parent.nodes.size === 1) {
    change.moveNodeByPath(path, grandPath, parentIndex + 1, {
      normalize: false
    });

    change.removeNodeByPath(parentPath, options);
  } else if (isFirst) {
    change.moveNodeByPath(path, grandPath, parentIndex, options);
  } else if (isLast) {
    change.moveNodeByPath(path, grandPath, parentIndex + 1, options);
  } else {
    change.splitNodeByPath(parentPath, index, { normalize: false });

    var updatedPath = PathUtils.increment(path, 1, parentPath.size - 1);
    updatedPath = updatedPath.set(updatedPath.size - 1, 0);

    change.moveNodeByPath(updatedPath, grandPath, parentIndex + 1, {
      normalize: false
    });

    change.normalizeNodeByPath(grandPath, options);
  }
};

/**
 * Wrap a node in a block with `properties`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Block|Object|String} block
 * @param {Object} options
 */

Changes$2.wrapBlockByPath = function (change, path, block, options) {
  block = Block.create(block);
  block = block.set('nodes', block.nodes.clear());
  var parentPath = PathUtils.lift(path);
  var index = path.last();
  var newPath = PathUtils.increment(path);
  change.insertNodeByPath(parentPath, index, block, { normalize: false });
  change.moveNodeByPath(newPath, path, 0, options);
};

/**
 * Wrap a node in an inline with `properties`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Block|Object|String} inline
 * @param {Object} options
 */

Changes$2.wrapInlineByPath = function (change, path, inline, options) {
  inline = Inline.create(inline);
  inline = inline.set('nodes', inline.nodes.clear());
  var parentPath = PathUtils.lift(path);
  var index = path.last();
  var newPath = PathUtils.increment(path);
  change.insertNodeByPath(parentPath, index, inline, { normalize: false });
  change.moveNodeByPath(newPath, path, 0, options);
};

/**
 * Wrap a node by `path` with `node`.
 *
 * @param {Change} change
 * @param {Array} path
 * @param {Node|Object} node
 * @param {Object} options
 */

Changes$2.wrapNodeByPath = function (change, path, node) {
  node = Node.create(node);

  if (node.object == 'block') {
    change.wrapBlockByPath(path, node);
    return;
  }

  if (node.object == 'inline') {
    change.wrapInlineByPath(path, node);
    return;
  }
};

/**
 * Mix in `*ByKey` variants.
 */

var CHANGES = ['addMark', 'insertFragment', 'insertNode', 'insertText', 'mergeNode', 'removeMark', 'removeAllMarks', 'removeNode', 'setText', 'replaceText', 'removeText', 'replaceNode', 'setMark', 'setNode', 'splitNode', 'unwrapInline', 'unwrapBlock', 'unwrapNode', 'wrapBlock', 'wrapInline', 'wrapNode'];

var _loop$1 = function _loop(method) {
  Changes$2[method + 'ByKey'] = function (change, key) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    var value = change.value;
    var document = value.document;

    var path = document.assertPath(key);
    change[method + 'ByPath'].apply(change, [path].concat(args));
  };
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = CHANGES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var method$1 = _step.value;

    _loop$1(method$1);
  }

  // Moving nodes takes two keys, so it's slightly different.
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

Changes$2.moveNodeByKey = function (change, key, newKey) {
  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    args[_key - 3] = arguments[_key];
  }

  var value = change.value;
  var document = value.document;

  var path = document.assertPath(key);
  var newPath = document.assertPath(newKey);
  change.moveNodeByPath.apply(change, [path, newPath].concat(args));
};

// Splitting descendants takes two keys, so it's slightly different.
Changes$2.splitDescendantsByKey = function (change, key, textKey) {
  for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  var value = change.value;
  var document = value.document;

  var path = document.assertPath(key);
  var textPath = document.assertPath(textKey);
  change.splitDescendantsByPath.apply(change, [path, textPath].concat(args));
};

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = Debug('slate:history');

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$8 = {
  redos: new Stack(),
  undos: new Stack()

  /**
   * History.
   *
   * @type {History}
   */

};
var History = function (_Record) {
  inherits(History, _Record);

  function History() {
    classCallCheck(this, History);
    return possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).apply(this, arguments));
  }

  createClass(History, [{
    key: 'save',


    /**
     * Save an `operation` into the history.
     *
     * @param {Object} operation
     * @param {Object} options
     * @return {History}
     */

    value: function save(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var history = this;
      var _history = history,
          undos = _history.undos,
          redos = _history.redos;
      var merge = options.merge,
          skip = options.skip;

      var prevBatch = undos.peek();
      var prevOperation = prevBatch && prevBatch.last();

      if (skip == null) {
        skip = shouldSkip(operation, prevOperation);
      }

      if (skip) {
        return history;
      }

      if (merge == null) {
        merge = shouldMerge(operation, prevOperation);
      }

      debug('save', { operation: operation, merge: merge });

      // If the `merge` flag is true, add the operation to the previous batch.
      if (merge && prevBatch) {
        var batch = prevBatch.push(operation);
        undos = undos.pop();
        undos = undos.push(batch);
      } else {
        // Otherwise, create a new batch with the operation.
        var _batch = new List([operation]);
        undos = undos.push(_batch);
      }

      // Constrain the history to 100 entries for memory's sake.
      if (undos.size > 100) {
        undos = undos.take(100);
      }

      // Clear the redos and update the history.
      redos = redos.clear();
      history = history.set('undos', undos).set('redos', redos);
      return history;
    }

    /**
     * Return a JSON representation of the history.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        redos: this.redos.toJSON(),
        undos: this.undos.toJSON()
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'history';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `History` with `attrs`.
     *
     * @param {Object|History} attrs
     * @return {History}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (History.isHistory(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return History.fromJSON(attrs);
      }

      throw new Error('`History.create` only accepts objects or histories, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Operations` from `operations`.
     *
     * @param {Array<Object>|List<Object>} operations
     * @return {List<Object>}
     */

  }, {
    key: 'createOperationsList',
    value: function createOperationsList() {
      var operations = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(operations)) {
        return operations;
      }

      if (Array.isArray(operations)) {
        return new List(operations);
      }

      throw new Error('`History.createList` only accepts arrays or lists, but you passed it: ' + operations);
    }

    /**
     * Create a `History` from a JSON `object`.
     *
     * @param {Object} object
     * @return {History}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var _object$redos = object.redos,
          redos = _object$redos === undefined ? [] : _object$redos,
          _object$undos = object.undos,
          undos = _object$undos === undefined ? [] : _object$undos;


      var history = new History({
        redos: new Stack(redos.map(this.createOperationsList)),
        undos: new Stack(undos.map(this.createOperationsList))
      });

      return history;
    }

    /**
     * Alias `fromJS`.
     */

    /**
     * Check if `any` is a `History`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }]);
  return History;
}(Record(DEFAULTS$8));

/**
 * Attach a pseudo-symbol for type checking.
 */

History.fromJS = History.fromJSON;
History.isHistory = isType.bind(null, 'HISTORY');
History.prototype[MODEL_TYPES.HISTORY] = true;

/**
 * Check whether to merge a new operation `o` into the previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldMerge(o, p) {
  if (!p) return false;

  var merge = o.type == 'set_selection' && p.type == 'set_selection' || o.type == 'insert_text' && p.type == 'insert_text' && o.offset == p.offset + p.text.length && isEqual(o.path, p.path) || o.type == 'remove_text' && p.type == 'remove_text' && o.offset + o.text.length == p.offset && isEqual(o.path, p.path);

  return merge;
}

/**
 * Check whether to skip a new operation `o`, given previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldSkip(o, p) {
  if (!p) return false;

  var skip = o.type == 'set_selection' && p.type == 'set_selection';

  return skip;
}

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$9 = {
  plugins: []

  /**
   * Stack.
   *
   * @type {Stack}
   */

};
var Stack$1 = function (_Record) {
  inherits(Stack$$1, _Record);

  function Stack$$1() {
    classCallCheck(this, Stack$$1);
    return possibleConstructorReturn(this, (Stack$$1.__proto__ || Object.getPrototypeOf(Stack$$1)).apply(this, arguments));
  }

  createClass(Stack$$1, [{
    key: 'getPluginsWith',


    /**
     * Get all plugins with `property`.
     *
     * @param {String} property
     * @return {Array}
     */

    value: function getPluginsWith(property) {
      return this.plugins.filter(function (plugin) {
        return plugin[property] != null;
      });
    }

    /**
     * Iterate the plugins with `property`, returning the first non-null value.
     *
     * @param {String} property
     * @param {Any} ...args
     */

  }, {
    key: 'find',
    value: function find(property) {
      var plugins = this.getPluginsWith(property);

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plugin = _step.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) return ret;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Iterate the plugins with `property`, returning all the non-null values.
     *
     * @param {String} property
     * @param {Any} ...args
     * @return {Array}
     */

  }, {
    key: 'map',
    value: function map(property) {
      var plugins = this.getPluginsWith(property);
      var array = [];

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var plugin = _step2.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) array.push(ret);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return array;
    }

    /**
     * Iterate the plugins with `property`, breaking on any a non-null values.
     *
     * @param {String} property
     * @param {Any} ...args
     */

  }, {
    key: 'run',
    value: function run(property) {
      var plugins = this.getPluginsWith(property);

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = plugins[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var plugin = _step3.value;

          var ret = plugin[property].apply(plugin, args);
          if (ret != null) return;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * Iterate the plugins with `property`, reducing to a set of React children.
     *
     * @param {String} property
     * @param {Object} props
     * @param {Any} ...args
     */

  }, {
    key: 'render',
    value: function render(property, props) {
      for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        args[_key4 - 2] = arguments[_key4];
      }

      var plugins = this.getPluginsWith(property);
      return plugins.reduceRight(function (children, plugin) {
        if (!plugin[property]) return children;
        var ret = plugin[property].apply(plugin, [props].concat(args));
        if (ret == null) return children;
        props.children = ret;
        return ret;
      }, props.children === undefined ? null : props.children);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'stack';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Constructor.
     *
     * @param {Object} attrs
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _attrs$plugins = attrs.plugins,
          plugins = _attrs$plugins === undefined ? [] : _attrs$plugins;

      var stack = new Stack$$1({ plugins: plugins });
      return stack;
    }

    /**
     * Check if `any` is a `Stack`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isStack',
    value: function isStack(any) {
      return !!(any && any[MODEL_TYPES.STACK]);
    }
  }]);
  return Stack$$1;
}(Record(DEFAULTS$9));

/**
 * Attach a pseudo-symbol for type checking.
 */

Stack$1.prototype[MODEL_TYPES.STACK] = true;

/**
 * Memoize read methods.
 */

memoize(Stack$1.prototype, ['getPluginsWith']);

/**
 * Define a Slate error.
 *
 * @type {SlateError}
 */

var SlateError = function (_Error) {
  inherits(SlateError, _Error);

  function SlateError(code) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, SlateError);

    var _this = possibleConstructorReturn(this, (SlateError.__proto__ || Object.getPrototypeOf(SlateError)).call(this, code));

    _this.code = code;

    for (var key in attrs) {
      _this[key] = attrs[key];
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(_this, _this.constructor);
    } else {
      _this.stack = new Error().stack;
    }
    return _this;
  }

  return SlateError;
}(Error);

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$1 = Debug('slate:schema');

/**
 * Define the core schema rules, order-sensitive.
 *
 * @type {Array}
 */

var CORE_RULES = [
// Only allow block nodes in documents.
{
  match: { object: 'document' },
  nodes: [{
    match: { object: 'block' }
  }]
},

// Only allow block nodes or inline and text nodes in blocks.
{
  match: {
    object: 'block',
    first: { object: 'block' }
  },
  nodes: [{
    match: { object: 'block' }
  }]
}, {
  match: {
    object: 'block',
    first: [{ object: 'inline' }, { object: 'text' }]
  },
  nodes: [{
    match: [{ object: 'inline' }, { object: 'text' }]
  }]
},

// Only allow inline and text nodes in inlines.
{
  match: { object: 'inline' },
  nodes: [{ match: [{ object: 'inline' }, { object: 'text' }] }]
},

// Ensure that block and inline nodes have at least one text child.
{
  match: [{ object: 'block' }, { object: 'inline' }],
  nodes: [{ min: 1 }],
  normalize: function normalize(change, error) {
    var code = error.code,
        node = error.node;

    if (code !== 'child_required') return;
    change.insertNodeByKey(node.key, 0, Text.create(), { normalize: false });
  }
},

// Ensure that inline non-void nodes are never empty.
{
  match: {
    object: 'inline',
    isVoid: false,
    nodes: [{ match: { object: 'text' } }]
  },
  text: /[\w\W]+/
},

// Ensure that inline void nodes are surrounded by text nodes.
{
  match: { object: 'block' },
  first: [{ object: 'block' }, { object: 'text' }],
  last: [{ object: 'block' }, { object: 'text' }],
  normalize: function normalize(change, error) {
    var code = error.code,
        node = error.node;

    var text = Text.create();
    var i = void 0;

    if (code === 'first_child_object_invalid') {
      i = 0;
    } else if (code === 'last_child_object_invalid') {
      i = node.nodes.size;
    } else {
      return;
    }

    change.insertNodeByKey(node.key, i, text, { normalize: false });
  }
}, {
  match: { object: 'inline' },
  first: [{ object: 'block' }, { object: 'text' }],
  last: [{ object: 'block' }, { object: 'text' }],
  previous: [{ object: 'block' }, { object: 'text' }],
  next: [{ object: 'block' }, { object: 'text' }],
  normalize: function normalize(change, error) {
    var code = error.code,
        node = error.node,
        index = error.index;

    var text = Text.create();
    var i = void 0;

    if (code === 'first_child_object_invalid') {
      i = 0;
    } else if (code === 'last_child_object_invalid') {
      i = node.nodes.size;
    } else if (code === 'previous_sibling_object_invalid') {
      i = index;
    } else if (code === 'next_sibling_object_invalid') {
      i = index + 1;
    } else {
      return;
    }

    change.insertNodeByKey(node.key, i, text, { normalize: false });
  }
},

// Merge adjacent text nodes.
{
  match: { object: 'text' },
  next: [{ object: 'block' }, { object: 'inline' }],
  normalize: function normalize(change, error) {
    var code = error.code,
        next = error.next;

    if (code !== 'next_sibling_object_invalid') return;
    change.mergeNodeByKey(next.key, { normalize: false });
  }
}];

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$10 = {
  stack: Stack$1.create(),
  rules: []

  /**
   * Schema.
   *
   * @type {Schema}
   */

};
var Schema = function (_Record) {
  inherits(Schema, _Record);

  function Schema() {
    classCallCheck(this, Schema);
    return possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).apply(this, arguments));
  }

  createClass(Schema, [{
    key: 'validateNode',


    /**
     * Validate a `node` with the schema, returning an error if it's invalid.
     *
     * @param {Node} node
     * @return {Error|Void}
     */

    value: function validateNode(node) {
      var rules = this.rules.filter(function (r) {
        return testRules(node, r.match);
      });
      var failure = validateRules(node, rules, this.rules, { every: true });
      if (!failure) return;
      var error = new SlateError(failure.code, failure);
      return error;
    }

    /**
     * Test whether a `node` is valid against the schema.
     *
     * @param {Node} node
     * @return {Boolean}
     */

  }, {
    key: 'testNode',
    value: function testNode(node) {
      var error = this.validateNode(node);
      return !error;
    }

    /**
     * Assert that a `node` is valid against the schema.
     *
     * @param {Node} node
     * @throws
     */

  }, {
    key: 'assertNode',
    value: function assertNode(node) {
      var error = this.validateNode(node);
      if (error) throw error;
    }

    /**
     * Normalize a `node` with the schema, returning a function that will fix the
     * invalid node, or void if the node is valid.
     *
     * @param {Node} node
     * @return {Function|Void}
     */

  }, {
    key: 'normalizeNode',
    value: function normalizeNode(node) {
      var ret = this.stack.find('normalizeNode', node);
      if (ret) return ret;
      if (node.object == 'text') return;

      var error = this.validateNode(node);
      if (!error) return;

      return function (change) {
        debug$1('normalizing', { error: error });
        var rule = error.rule;
        var size = change.operations.size;

        // First run the user-provided `normalize` function if one exists...

        if (rule.normalize) {
          rule.normalize(change, error);
        }

        // If the `normalize` function did not add any operations to the change
        // object, it can't have normalized, so run the default one.
        if (change.operations.size === size) {
          defaultNormalize(change, error);
        }
      };
    }

    /**
     * Return a JSON representation of the schema.
     *
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var object = {
        object: this.object,
        rules: this.rules
      };

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS() {
      return this.toJSON();
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'schema';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Schema` with `attrs`.
     *
     * @param {Object|Schema} attrs
     * @return {Schema}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Schema.isSchema(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Schema.fromJSON(attrs);
      }

      throw new Error('`Schema.create` only accepts objects or schemas, but you passed it: ' + attrs);
    }

    /**
     * Create a `Schema` from a JSON `object`.
     *
     * @param {Object} object
     * @return {Schema}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Schema.isSchema(object)) {
        return object;
      }

      var plugins = object.plugins ? object.plugins : [{ schema: object }];
      var rules = [].concat(CORE_RULES);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plugin = _step.value;
          var _plugin$schema = plugin.schema,
              schema = _plugin$schema === undefined ? {} : _plugin$schema;
          var _schema$blocks = schema.blocks,
              blocks = _schema$blocks === undefined ? {} : _schema$blocks,
              _schema$inlines = schema.inlines,
              inlines = _schema$inlines === undefined ? {} : _schema$inlines;


          if (schema.rules) {
            rules = rules.concat(schema.rules);
          }

          if (schema.document) {
            rules.push(_extends({
              match: [{ object: 'document' }]
            }, schema.document));
          }

          for (var key in blocks) {
            rules.push(_extends({
              match: [{ object: 'block', type: key }]
            }, blocks[key]));
          }

          for (var _key in inlines) {
            rules.push(_extends({
              match: [{ object: 'inline', type: _key }]
            }, inlines[_key]));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var stack = Stack$1.create({ plugins: plugins });
      var ret = new Schema({ stack: stack, rules: rules });
      return ret;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isSchema',


    /**
     * Check if `any` is a `Schema`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isSchema(any) {
      return !!(any && any[MODEL_TYPES.SCHEMA]);
    }
  }]);
  return Schema;
}(Record(DEFAULTS$10));

/**
 * Normalize an invalid value with `error` with default remedies.
 *
 * @param {Change} change
 * @param {SlateError} error
 */

Schema.fromJS = Schema.fromJSON;
function defaultNormalize(change, error) {
  switch (error.code) {
    case CHILD_OBJECT_INVALID:
    case CHILD_TYPE_INVALID:
    case CHILD_UNKNOWN:
    case FIRST_CHILD_OBJECT_INVALID:
    case FIRST_CHILD_TYPE_INVALID:
    case LAST_CHILD_OBJECT_INVALID:
    case LAST_CHILD_TYPE_INVALID:
      {
        var child = error.child,
            node = error.node;

        return child.object == 'text' && node.object == 'block' && node.nodes.size == 1 ? change.removeNodeByKey(node.key) : change.removeNodeByKey(child.key);
      }

    case CHILD_REQUIRED:
    case NODE_TEXT_INVALID:
    case PARENT_OBJECT_INVALID:
    case PARENT_TYPE_INVALID:
      {
        var _node = error.node;

        return _node.object == 'document' ? _node.nodes.forEach(function (child) {
          return change.removeNodeByKey(child.key);
        }) : change.removeNodeByKey(_node.key);
      }

    case NODE_DATA_INVALID:
      {
        var _node2 = error.node,
            key = error.key;

        return _node2.data.get(key) === undefined && _node2.object != 'document' ? change.removeNodeByKey(_node2.key) : change.setNodeByKey(_node2.key, { data: _node2.data.delete(key) });
      }

    case NODE_IS_VOID_INVALID:
      {
        var _node3 = error.node;

        return change.setNodeByKey(_node3.key, { isVoid: !_node3.isVoid });
      }

    case NODE_MARK_INVALID:
      {
        var _node4 = error.node,
            mark = error.mark;

        return _node4.getTexts().forEach(function (t) {
          return change.removeMarkByKey(t.key, 0, t.text.length, mark);
        });
      }

    default:
      {
        var _node5 = error.node;

        return change.removeNodeByKey(_node5.key);
      }
  }
}

/**
 * Check that a `node` matches one of a set of `rules`.
 *
 * @param {Node} node
 * @param {Object|Array} rules
 * @return {Boolean}
 */

function testRules(node, rules) {
  var error = validateRules(node, rules);
  return !error;
}

/**
 * Validate that a `node` matches a `rule` object or array.
 *
 * @param {Node} node
 * @param {Object|Array} rule
 * @param {Array|Void} rules
 * @return {Error|Void}
 */

function validateRules(node, rule, rules) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$every = options.every,
      every = _options$every === undefined ? false : _options$every;


  if (Array.isArray(rule)) {
    var array = rule.length ? rule : [{}];
    var first = void 0;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var r = _step2.value;

        var _error = validateRules(node, r, rules);
        first = first || _error;
        if (every && _error) return _error;
        if (!every && !_error) return;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    return first;
  }

  var error = validateObject(node, rule) || validateType(node, rule) || validateIsVoid(node, rule) || validateData(node, rule) || validateMarks(node, rule) || validateText(node, rule) || validateFirst(node, rule) || validateLast(node, rule) || validateNodes(node, rule, rules);

  return error;
}

function validateObject(node, rule) {
  if (rule.objects) {
    logger.warn('The `objects` schema validation rule was changed. Please use the new `match` syntax with `object`.');
  }

  if (rule.object == null) return;
  if (rule.object === node.object) return;
  return fail(NODE_OBJECT_INVALID, { rule: rule, node: node });
}

function validateType(node, rule) {
  if (rule.types) {
    logger.warn('The `types` schema validation rule was changed. Please use the new `match` syntax with `type`.');
  }

  if (rule.type == null) return;
  if (rule.type === node.type) return;
  return fail(NODE_TYPE_INVALID, { rule: rule, node: node });
}

function validateIsVoid(node, rule) {
  if (rule.isVoid == null) return;
  if (rule.isVoid === node.isVoid) return;
  return fail(NODE_IS_VOID_INVALID, { rule: rule, node: node });
}

function validateData(node, rule) {
  if (rule.data == null) return;
  if (node.data == null) return;

  for (var key in rule.data) {
    var fn = rule.data[key];
    var value = node.data && node.data.get(key);
    var valid = typeof fn === 'function' ? fn(value) : fn === value;
    if (valid) continue;
    return fail(NODE_DATA_INVALID, { rule: rule, node: node, key: key, value: value });
  }
}

function validateMarks(node, rule) {
  if (rule.marks == null) return;
  var marks = node.getMarks().toArray();

  var _loop = function _loop(mark) {
    var valid = rule.marks.some(function (def) {
      return def.type === mark.type;
    });
    if (valid) return 'continue';
    return {
      v: fail(NODE_MARK_INVALID, { rule: rule, node: node, mark: mark })
    };
  };

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = marks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var mark = _step3.value;

      var _ret = _loop(mark);

      switch (_ret) {
        case 'continue':
          continue;

        default:
          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function validateText(node, rule) {
  if (rule.text == null) return;
  var text = node.text;

  var valid = rule.text.test(text);
  if (valid) return;
  return fail(NODE_TEXT_INVALID, { rule: rule, node: node, text: text });
}

function validateFirst(node, rule) {
  if (rule.first == null) return;
  var first = node.nodes.first();
  if (!first) return;
  var error = validateRules(first, rule.first);
  if (!error) return;
  error.rule = rule;
  error.node = node;
  error.child = first;
  error.code = error.code.replace('node_', 'first_child_');
  return error;
}

function validateLast(node, rule) {
  if (rule.last == null) return;
  var last = node.nodes.last();
  if (!last) return;
  var error = validateRules(last, rule.last);
  if (!error) return;
  error.rule = rule;
  error.node = node;
  error.child = last;
  error.code = error.code.replace('node_', 'last_child_');
  return error;
}

function validateNodes(node, rule) {
  var rules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  if (node.nodes == null) return;

  var children = node.nodes.toArray();
  var defs = rule.nodes != null ? rule.nodes.slice() : [];
  var offset = void 0;
  var min = void 0;
  var index = void 0;
  var def = void 0;
  var max = void 0;
  var child = void 0;
  var previous = void 0;
  var next = void 0;

  function nextDef() {
    offset = offset == null ? null : 0;
    def = defs.shift();
    min = def && def.min;
    max = def && def.max;
    return !!def;
  }

  function nextChild() {
    index = index == null ? 0 : index + 1;
    offset = offset == null ? 0 : offset + 1;
    previous = child;
    child = children[index];
    next = children[index + 1];
    if (max != null && offset == max) nextDef();
    return !!child;
  }

  function rewind() {
    offset -= 1;
    index -= 1;
  }

  if (rule.nodes != null) {
    nextDef();
  }

  while (nextChild()) {
    var err = validateParent(node, child, rules) || validatePrevious(node, child, previous, index, rules) || validateNext(node, child, next, index, rules);

    if (err) return err;

    if (rule.nodes != null) {
      if (!def) {
        return fail(CHILD_UNKNOWN, { rule: rule, node: node, child: child, index: index });
      }

      if (def) {
        if (def.objects) {
          logger.warn('The `objects` schema validation rule was changed. Please use the new `match` syntax with `object`.');
        }

        if (def.types) {
          logger.warn('The `types` schema validation rule was changed. Please use the new `match` syntax with `type`.');
        }
      }

      if (def.match) {
        var error = validateRules(child, def.match);

        if (error && offset >= min && nextDef()) {
          rewind();
          continue;
        }

        if (error) {
          error.rule = rule;
          error.node = node;
          error.child = child;
          error.index = index;
          error.code = error.code.replace('node_', 'child_');
          return error;
        }
      }
    }
  }

  if (rule.nodes != null) {
    while (min != null) {
      if (offset < min) {
        return fail(CHILD_REQUIRED, { rule: rule, node: node, index: index });
      }

      nextDef();
    }
  }
}

function validateParent(node, child, rules) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = rules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var rule = _step4.value;

      if (rule.parent == null) continue;
      if (!testRules(child, rule.match)) continue;

      var error = validateRules(node, rule.parent);
      if (!error) continue;

      error.rule = rule;
      error.parent = node;
      error.node = child;
      error.code = error.code.replace('node_', 'parent_');
      return error;
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }
}

function validatePrevious(node, child, previous, index, rules) {
  if (!previous) return;

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = rules[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var rule = _step5.value;

      if (rule.previous == null) continue;
      if (!testRules(child, rule.match)) continue;

      var error = validateRules(previous, rule.previous);
      if (!error) continue;

      error.rule = rule;
      error.node = node;
      error.child = child;
      error.index = index;
      error.previous = previous;
      error.code = error.code.replace('node_', 'previous_sibling_');
      return error;
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }
}

function validateNext(node, child, next, index, rules) {
  if (!next) return;

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = rules[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var rule = _step6.value;

      if (rule.next == null) continue;
      if (!testRules(child, rule.match)) continue;

      var error = validateRules(next, rule.next);
      if (!error) continue;

      error.rule = rule;
      error.node = node;
      error.child = child;
      error.index = index;
      error.next = next;
      error.code = error.code.replace('node_', 'next_sibling_');
      return error;
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}

/**
 * Create an interim failure object with `code` and `attrs`.
 *
 * @param {String} code
 * @param {Object} attrs
 * @return {Object}
 */

function fail(code, attrs) {
  return _extends({ code: code }, attrs);
}

/**
 * Attach a pseudo-symbol for type checking.
 */

Schema.prototype[MODEL_TYPES.SCHEMA] = true;

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS$11 = {
  data: new Map$1(),
  decorations: null,
  document: Document.create(),
  history: History.create(),
  schema: Schema.create(),
  selection: Range.create()

  /**
   * Value.
   *
   * @type {Value}
   */

};
var Value = function (_Record) {
  inherits(Value, _Record);

  function Value() {
    classCallCheck(this, Value);
    return possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
  }

  createClass(Value, [{
    key: 'change',


    /**
     * Create a new `Change` with the current value as a starting point.
     *
     * @param {Object} attrs
     * @return {Change}
     */

    value: function change() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Change(_extends({}, attrs, { value: this }));
    }

    /**
     * Add mark to text at `offset` and `length` in node by `path`.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @return {Value}
     */

  }, {
    key: 'addMark',
    value: function addMark(path, offset, length, mark) {
      var value = this;
      var _value = value,
          document = _value.document;

      document = document.addMark(path, offset, length, mark);
      value = this.set('document', document);
      return value;
    }

    /**
     * Insert a `node`.
     *
     * @param {List|String} path
     * @param {Node} node
     * @return {Value}
     */

  }, {
    key: 'insertNode',
    value: function insertNode(path, node) {
      var value = this;
      var _value2 = value,
          document = _value2.document;

      document = document.insertNode(path, node);
      value = value.set('document', document);

      value = value.mapRanges(function (range) {
        return range.merge({ anchorPath: null, focusPath: null });
      });

      return value;
    }

    /**
     * Insert `text` at `offset` in node by `path`.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {String} text
     * @param {Set} marks
     * @return {Value}
     */

  }, {
    key: 'insertText',
    value: function insertText(path, offset, text, marks) {
      var value = this;
      var _value3 = value,
          document = _value3.document;

      document = document.insertText(path, offset, text, marks);
      value = value.set('document', document);

      // Update any ranges that were affected.
      var node = document.assertNode(path);
      value = value.clearAtomicRanges(node.key, offset);

      value = value.mapRanges(function (range) {
        var anchorKey = range.anchorKey,
            anchorOffset = range.anchorOffset,
            isBackward = range.isBackward,
            isAtomic = range.isAtomic;


        if (anchorKey === node.key && (anchorOffset > offset || anchorOffset === offset && (!isAtomic || !isBackward))) {
          return range.moveAnchor(text.length);
        }

        return range;
      });

      value = value.mapRanges(function (range) {
        var focusKey = range.focusKey,
            focusOffset = range.focusOffset,
            isBackward = range.isBackward,
            isAtomic = range.isAtomic;


        if (focusKey === node.key && (focusOffset > offset || focusOffset == offset && (!isAtomic || isBackward))) {
          return range.moveFocus(text.length);
        }

        return range;
      });

      return value;
    }

    /**
     * Merge a node backwards its previous sibling.
     *
     * @param {List|Key} path
     * @return {Value}
     */

  }, {
    key: 'mergeNode',
    value: function mergeNode(path) {
      var value = this;
      var _value4 = value,
          document = _value4.document;

      var newDocument = document.mergeNode(path);
      path = document.resolvePath(path);
      var withPath = PathUtils.decrement(path);
      var one = document.getNode(withPath);
      var two = document.getNode(path);
      value = value.set('document', newDocument);

      value = value.mapRanges(function (range) {
        if (two.object === 'text') {
          var max = one.text.length;

          if (range.anchorKey === two.key) {
            range = range.moveAnchorTo(one.key, max + range.anchorOffset);
          }

          if (range.focusKey === two.key) {
            range = range.moveFocusTo(one.key, max + range.focusOffset);
          }
        }

        range = range.merge({ anchorPath: null, focusPath: null });
        return range;
      });

      return value;
    }

    /**
     * Move a node by `path` to `newPath`.
     *
     * A `newIndex` can be provided when move nodes by `key`, to account for not
     * being able to have a key for a location in the tree that doesn't exist yet.
     *
     * @param {List|Key} path
     * @param {List|Key} newPath
     * @param {Number} newIndex
     * @return {Value}
     */

  }, {
    key: 'moveNode',
    value: function moveNode(path, newPath) {
      var newIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      var value = this;
      var _value5 = value,
          document = _value5.document;

      document = document.moveNode(path, newPath, newIndex);
      value = value.set('document', document);

      value = value.mapRanges(function (range) {
        return range.merge({ anchorPath: null, focusPath: null });
      });

      return value;
    }

    /**
     * Remove mark from text at `offset` and `length` in node.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @return {Value}
     */

  }, {
    key: 'removeMark',
    value: function removeMark(path, offset, length, mark) {
      var value = this;
      var _value6 = value,
          document = _value6.document;

      document = document.removeMark(path, offset, length, mark);
      value = this.set('document', document);
      return value;
    }

    /**
     * Remove a node by `path`.
     *
     * @param {List|String} path
     * @return {Value}
     */

  }, {
    key: 'removeNode',
    value: function removeNode(path) {
      var value = this;
      var _value7 = value,
          document = _value7.document;

      var node = document.assertNode(path);
      var first = node.object == 'text' ? node : node.getFirstText() || node;
      var last = node.object == 'text' ? node : node.getLastText() || node;
      var prev = document.getPreviousText(first.key);
      var next = document.getNextText(last.key);

      document = document.removeNode(path);
      value = value.set('document', document);

      value = value.mapRanges(function (range) {
        var _range = range,
            startKey = _range.startKey,
            endKey = _range.endKey;


        if (node.hasNode(startKey)) {
          range = prev ? range.moveStartTo(prev.key, prev.text.length) : next ? range.moveStartTo(next.key, 0) : range.deselect();
        }

        if (node.hasNode(endKey)) {
          range = prev ? range.moveEndTo(prev.key, prev.text.length) : next ? range.moveEndTo(next.key, 0) : range.deselect();
        }

        range = range.merge({ anchorPath: null, focusPath: null });
        return range;
      });

      return value;
    }

    /**
     * Remove `text` at `offset` in node by `path`.
     *
     * @param {List|Key} path
     * @param {Number} offset
     * @param {String} text
     * @return {Value}
     */

  }, {
    key: 'removeText',
    value: function removeText(path, offset, text) {
      var value = this;
      var _value8 = value,
          document = _value8.document;

      document = document.removeText(path, offset, text);
      value = value.set('document', document);

      var node = document.assertNode(path);
      var length = text.length;

      var rangeOffset = offset + length;
      value = value.clearAtomicRanges(node.key, offset, offset + length);

      value = value.mapRanges(function (range) {
        var anchorKey = range.anchorKey;


        if (anchorKey === node.key) {
          return range.anchorOffset >= rangeOffset ? range.moveAnchor(-length) : range.anchorOffset > offset ? range.moveAnchorTo(range.anchorKey, offset) : range;
        }

        return range;
      });

      value = value.mapRanges(function (range) {
        var focusKey = range.focusKey;


        if (focusKey === node.key) {
          return range.focusOffset >= rangeOffset ? range.moveFocus(-length) : range.focusOffset > offset ? range.moveFocusTo(range.focusKey, offset) : range;
        }

        return range;
      });

      return value;
    }

    /**
     * Set `properties` on a node.
     *
     * @param {List|String} path
     * @param {Object} properties
     * @return {Value}
     */

  }, {
    key: 'setNode',
    value: function setNode(path, properties) {
      var value = this;
      var _value9 = value,
          document = _value9.document;

      document = document.setNode(path, properties);
      value = value.set('document', document);
      return value;
    }

    /**
     * Set `properties` on `mark` on text at `offset` and `length` in node.
     *
     * @param {List|String} path
     * @param {Number} offset
     * @param {Number} length
     * @param {Mark} mark
     * @param {Object} properties
     * @return {Value}
     */

  }, {
    key: 'setMark',
    value: function setMark(path, offset, length, mark, properties) {
      var value = this;
      var _value10 = value,
          document = _value10.document;

      document = document.setMark(path, offset, length, mark, properties);
      value = value.set('document', document);
      return value;
    }

    /**
     * Set `properties` on the selection.
     *
     * @param {Value} value
     * @param {Operation} operation
     * @return {Value}
     */

  }, {
    key: 'setSelection',
    value: function setSelection(properties) {
      var value = this;
      var _value11 = value,
          document = _value11.document,
          selection = _value11.selection;

      selection = selection.merge(properties);
      selection = selection.normalize(document);
      value = value.set('selection', selection);
      return value;
    }

    /**
     * Split a node by `path` at `position` with optional `properties` to apply
     * to the newly split node.
     *
     * @param {List|String} path
     * @param {Number} position
     * @param {Object} properties
     * @return {Value}
     */

  }, {
    key: 'splitNode',
    value: function splitNode(path, position, properties) {
      var value = this;
      var _value12 = value,
          document = _value12.document;

      var newDocument = document.splitNode(path, position, properties);
      var node = document.assertNode(path);
      value = value.set('document', newDocument);

      value = value.mapRanges(function (range) {
        var next = newDocument.getNextText(node.key);
        var _range2 = range,
            startKey = _range2.startKey,
            startOffset = _range2.startOffset,
            endKey = _range2.endKey,
            endOffset = _range2.endOffset;

        // If the start was after the split, move it to the next node.

        if (node.key === startKey && position <= startOffset) {
          range = range.moveStartTo(next.key, startOffset - position);
        }

        // If the end was after the split, move it to the next node.
        if (node.key === endKey && position <= endOffset) {
          range = range.moveEndTo(next.key, endOffset - position);
        }

        range = range.merge({ anchorPath: null, focusPath: null });
        return range;
      });

      return value;
    }

    /**
     * Map all range objects to apply adjustments with an `iterator`.
     *
     * @param {Function} iterator
     * @return {Value}
     */

  }, {
    key: 'mapRanges',
    value: function mapRanges(iterator) {
      var value = this;
      var _value13 = value,
          document = _value13.document,
          selection = _value13.selection,
          decorations = _value13.decorations;


      if (selection) {
        var next = selection.isSet ? iterator(selection) : selection;
        if (!next) next = selection.deselect();
        if (next !== selection) next = next.normalize(document);
        value = value.set('selection', next);
      }

      if (decorations) {
        var _next = decorations.map(function (decoration) {
          var n = decoration.isSet ? iterator(decoration) : decoration;
          if (n && n !== decoration) n = n.normalize(document);
          return n;
        });

        _next = _next.filter(function (decoration) {
          return !!decoration;
        });
        _next = _next.size ? _next : null;
        value = value.set('decorations', _next);
      }

      return value;
    }

    /**
     * Remove any atomic ranges inside a `key`, `offset` and `length`.
     *
     * @param {String} key
     * @param {Number} start
     * @param {Number?} end
     * @return {Value}
     */

  }, {
    key: 'clearAtomicRanges',
    value: function clearAtomicRanges(key, start) {
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return this.mapRanges(function (range) {
        var isAtomic = range.isAtomic,
            startKey = range.startKey,
            startOffset = range.startOffset,
            endKey = range.endKey,
            endOffset = range.endOffset;

        if (!isAtomic) return range;
        if (startKey !== key) return range;

        if (startOffset < start && (endKey !== key || endOffset > start)) {
          return null;
        }

        if (end != null && startOffset < end && (endKey !== key || endOffset > end)) {
          return null;
        }

        return range;
      });
    }

    /**
     * Return a JSON representation of the value.
     *
     * @param {Object} options
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var object = {
        object: this.object,
        document: this.document.toJSON(options)
      };

      if (options.preserveData) {
        object.data = this.data.toJSON(options);
      }

      if (options.preserveDecorations) {
        object.decorations = this.decorations ? this.decorations.toArray().map(function (d) {
          return d.toJSON(options);
        }) : null;
      }

      if (options.preserveHistory) {
        object.history = this.history.toJSON(options);
      }

      if (options.preserveSelection) {
        object.selection = this.selection.toJSON(options);
      }

      if (options.preserveSchema) {
        object.schema = this.schema.toJSON(options);
      }

      return object;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'value';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }

    /**
     * Are there undoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasUndos',
    get: function get$$1() {
      return this.history.undos.size > 0;
    }

    /**
     * Are there redoable events?
     *
     * @return {Boolean}
     */

  }, {
    key: 'hasRedos',
    get: function get$$1() {
      return this.history.redos.size > 0;
    }

    /**
     * Is the current selection blurred?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isBlurred',
    get: function get$$1() {
      return this.selection.isBlurred;
    }

    /**
     * Is the current selection focused?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isFocused',
    get: function get$$1() {
      return this.selection.isFocused;
    }

    /**
     * Is the current selection collapsed?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isCollapsed',
    get: function get$$1() {
      return this.selection.isCollapsed;
    }

    /**
     * Is the current selection expanded?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isExpanded',
    get: function get$$1() {
      return this.selection.isExpanded;
    }

    /**
     * Is the current selection backward?
     *
     * @return {Boolean} isBackward
     */

  }, {
    key: 'isBackward',
    get: function get$$1() {
      return this.selection.isBackward;
    }

    /**
     * Is the current selection forward?
     *
     * @return {Boolean}
     */

  }, {
    key: 'isForward',
    get: function get$$1() {
      return this.selection.isForward;
    }

    /**
     * Get the current start key.
     *
     * @return {String}
     */

  }, {
    key: 'startKey',
    get: function get$$1() {
      return this.selection.startKey;
    }

    /**
     * Get the current end key.
     *
     * @return {String}
     */

  }, {
    key: 'endKey',
    get: function get$$1() {
      return this.selection.endKey;
    }

    /**
     * Get the current start path.
     *
     * @return {String}
     */

  }, {
    key: 'startPath',
    get: function get$$1() {
      return this.selection.startPath;
    }

    /**
     * Get the current end path.
     *
     * @return {String}
     */

  }, {
    key: 'endPath',
    get: function get$$1() {
      return this.selection.endPath;
    }

    /**
     * Get the current start offset.
     *
     * @return {String}
     */

  }, {
    key: 'startOffset',
    get: function get$$1() {
      return this.selection.startOffset;
    }

    /**
     * Get the current end offset.
     *
     * @return {String}
     */

  }, {
    key: 'endOffset',
    get: function get$$1() {
      return this.selection.endOffset;
    }

    /**
     * Get the current anchor key.
     *
     * @return {String}
     */

  }, {
    key: 'anchorKey',
    get: function get$$1() {
      return this.selection.anchorKey;
    }

    /**
     * Get the current focus key.
     *
     * @return {String}
     */

  }, {
    key: 'focusKey',
    get: function get$$1() {
      return this.selection.focusKey;
    }

    /**
     * Get the current anchor path.
     *
     * @return {String}
     */

  }, {
    key: 'anchorPath',
    get: function get$$1() {
      return this.selection.anchorPath;
    }

    /**
     * Get the current focus path.
     *
     * @return {String}
     */

  }, {
    key: 'focusPath',
    get: function get$$1() {
      return this.selection.focusPath;
    }

    /**
     * Get the current anchor offset.
     *
     * @return {String}
     */

  }, {
    key: 'anchorOffset',
    get: function get$$1() {
      return this.selection.anchorOffset;
    }

    /**
     * Get the current focus offset.
     *
     * @return {String}
     */

  }, {
    key: 'focusOffset',
    get: function get$$1() {
      return this.selection.focusOffset;
    }

    /**
     * Get the current start text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'startBlock',
    get: function get$$1() {
      return this.startKey && this.document.getClosestBlock(this.startKey);
    }

    /**
     * Get the current end text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'endBlock',
    get: function get$$1() {
      return this.endKey && this.document.getClosestBlock(this.endKey);
    }

    /**
     * Get the current anchor text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'anchorBlock',
    get: function get$$1() {
      return this.anchorKey && this.document.getClosestBlock(this.anchorKey);
    }

    /**
     * Get the current focus text node's closest block parent.
     *
     * @return {Block}
     */

  }, {
    key: 'focusBlock',
    get: function get$$1() {
      return this.focusKey && this.document.getClosestBlock(this.focusKey);
    }

    /**
     * Get the current start text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'startInline',
    get: function get$$1() {
      return this.startKey && this.document.getClosestInline(this.startKey);
    }

    /**
     * Get the current end text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'endInline',
    get: function get$$1() {
      return this.endKey && this.document.getClosestInline(this.endKey);
    }

    /**
     * Get the current anchor text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'anchorInline',
    get: function get$$1() {
      return this.anchorKey && this.document.getClosestInline(this.anchorKey);
    }

    /**
     * Get the current focus text node's closest inline parent.
     *
     * @return {Inline}
     */

  }, {
    key: 'focusInline',
    get: function get$$1() {
      return this.focusKey && this.document.getClosestInline(this.focusKey);
    }

    /**
     * Get the current start text node.
     *
     * @return {Text}
     */

  }, {
    key: 'startText',
    get: function get$$1() {
      return this.startKey && this.document.getDescendant(this.startKey);
    }

    /**
     * Get the current end node.
     *
     * @return {Text}
     */

  }, {
    key: 'endText',
    get: function get$$1() {
      return this.endKey && this.document.getDescendant(this.endKey);
    }

    /**
     * Get the current anchor node.
     *
     * @return {Text}
     */

  }, {
    key: 'anchorText',
    get: function get$$1() {
      return this.anchorKey && this.document.getDescendant(this.anchorKey);
    }

    /**
     * Get the current focus node.
     *
     * @return {Text}
     */

  }, {
    key: 'focusText',
    get: function get$$1() {
      return this.focusKey && this.document.getDescendant(this.focusKey);
    }

    /**
     * Get the next block node.
     *
     * @return {Block}
     */

  }, {
    key: 'nextBlock',
    get: function get$$1() {
      return this.endKey && this.document.getNextBlock(this.endKey);
    }

    /**
     * Get the previous block node.
     *
     * @return {Block}
     */

  }, {
    key: 'previousBlock',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousBlock(this.startKey);
    }

    /**
     * Get the next inline node.
     *
     * @return {Inline}
     */

  }, {
    key: 'nextInline',
    get: function get$$1() {
      return this.endKey && this.document.getNextInline(this.endKey);
    }

    /**
     * Get the previous inline node.
     *
     * @return {Inline}
     */

  }, {
    key: 'previousInline',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousInline(this.startKey);
    }

    /**
     * Get the next text node.
     *
     * @return {Text}
     */

  }, {
    key: 'nextText',
    get: function get$$1() {
      return this.endKey && this.document.getNextText(this.endKey);
    }

    /**
     * Get the previous text node.
     *
     * @return {Text}
     */

  }, {
    key: 'previousText',
    get: function get$$1() {
      return this.startKey && this.document.getPreviousText(this.startKey);
    }

    /**
     * Get the characters in the current selection.
     *
     * @return {List<Character>}
     */

  }, {
    key: 'characters',
    get: function get$$1() {
      return this.selection.isUnset ? new List() : this.document.getCharactersAtRange(this.selection);
    }

    /**
     * Get the marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'marks',
    get: function get$$1() {
      return this.selection.isUnset ? new Set() : this.selection.marks || this.document.getMarksAtRange(this.selection);
    }

    /**
     * Get the active marks of the current selection.
     *
     * @return {Set<Mark>}
     */

  }, {
    key: 'activeMarks',
    get: function get$$1() {
      return this.selection.isUnset ? new Set() : this.selection.marks || this.document.getActiveMarksAtRange(this.selection);
    }

    /**
     * Get the block nodes in the current selection.
     *
     * @return {List<Block>}
     */

  }, {
    key: 'blocks',
    get: function get$$1() {
      return this.selection.isUnset ? new List() : this.document.getBlocksAtRange(this.selection);
    }

    /**
     * Get the fragment of the current selection.
     *
     * @return {Document}
     */

  }, {
    key: 'fragment',
    get: function get$$1() {
      return this.selection.isUnset ? Document.create() : this.document.getFragmentAtRange(this.selection);
    }

    /**
     * Get the inline nodes in the current selection.
     *
     * @return {List<Inline>}
     */

  }, {
    key: 'inlines',
    get: function get$$1() {
      return this.selection.isUnset ? new List() : this.document.getInlinesAtRange(this.selection);
    }

    /**
     * Get the text nodes in the current selection.
     *
     * @return {List<Text>}
     */

  }, {
    key: 'texts',
    get: function get$$1() {
      return this.selection.isUnset ? new List() : this.document.getTextsAtRange(this.selection);
    }

    /**
     * Check whether the selection is empty.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isEmpty',
    get: function get$$1() {
      if (this.isCollapsed) return true;
      if (this.endOffset != 0 && this.startOffset != 0) return false;
      return this.fragment.isEmpty;
    }

    /**
     * Check whether the selection is collapsed in a void node.
     *
     * @return {Boolean}
     */

  }, {
    key: 'isInVoid',
    get: function get$$1() {
      if (this.isExpanded) return false;
      return this.document.hasVoidParent(this.startKey);
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Value` with `attrs`.
     *
     * @param {Object|Value} attrs
     * @param {Object} options
     * @return {Value}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (Value.isValue(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Value.fromJSON(attrs, options);
      }

      throw new Error('`Value.create` only accepts objects or values, but you passed it: ' + attrs);
    }

    /**
     * Create a dictionary of settable value properties from `attrs`.
     *
     * @param {Object|Value} attrs
     * @return {Object}
     */

  }, {
    key: 'createProperties',
    value: function createProperties() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Value.isValue(a)) {
        return {
          data: a.data,
          decorations: a.decorations,
          schema: a.schema
        };
      }

      if (isPlainObject(a)) {
        var p = {};
        if ('data' in a) p.data = Data.create(a.data);
        if ('decorations' in a) p.decorations = Range.createList(a.decorations);
        if ('schema' in a) p.schema = Schema.create(a.schema);
        return p;
      }

      throw new Error('`Value.createProperties` only accepts objects or values, but you passed it: ' + a);
    }

    /**
     * Create a `Value` from a JSON `object`.
     *
     * @param {Object} object
     * @param {Object} options
     *   @property {Boolean} normalize
     *   @property {Array} plugins
     * @return {Value}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _object$document = object.document,
          document = _object$document === undefined ? {} : _object$document,
          _object$selection = object.selection,
          selection = _object$selection === undefined ? {} : _object$selection,
          _object$schema = object.schema,
          schema = _object$schema === undefined ? {} : _object$schema,
          _object$history = object.history,
          history = _object$history === undefined ? {} : _object$history;

      var data = new Map$1();
      document = Document.fromJSON(document);
      selection = Range.fromJSON(selection);
      schema = Schema.fromJSON(schema);
      history = History.fromJSON(history);

      // Allow plugins to set a default value for `data`.
      if (options.plugins) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = options.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var plugin = _step.value;

            if (plugin.data) data = data.merge(plugin.data);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      // Then merge in the `data` provided.
      if ('data' in object) {
        data = data.merge(object.data);
      }

      if (selection.isUnset) {
        var text = document.getFirstText();
        if (text) selection = selection.collapseToStartOf(text);
      }

      selection = selection.normalize(document);

      var value = new Value({
        data: data,
        document: document,
        selection: selection,
        schema: schema,
        history: history
      });

      if (options.normalize !== false) {
        value = value.change({ save: false }).normalize().value;
      }

      return value;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isValue',


    /**
     * Check if a `value` is a `Value`.
     *
     * @param {Any} value
     * @return {Boolean}
     */

    value: function isValue(value) {
      return !!(value && value[MODEL_TYPES.VALUE]);
    }
  }]);
  return Value;
}(Record(DEFAULTS$11));

/**
 * Attach a pseudo-symbol for type checking.
 */

Value.fromJS = Value.fromJSON;
Value.prototype[MODEL_TYPES.VALUE] = true;

/**
 * Operation attributes.
 *
 * @type {Array}
 */

var OPERATION_ATTRIBUTES = {
  add_mark: ['value', 'path', 'offset', 'length', 'mark'],
  insert_node: ['value', 'path', 'node'],
  insert_text: ['value', 'path', 'offset', 'text', 'marks'],
  merge_node: ['value', 'path', 'position', 'properties', 'target'],
  move_node: ['value', 'path', 'newPath'],
  remove_mark: ['value', 'path', 'offset', 'length', 'mark'],
  remove_node: ['value', 'path', 'node'],
  remove_text: ['value', 'path', 'offset', 'text', 'marks'],
  set_mark: ['value', 'path', 'offset', 'length', 'mark', 'properties'],
  set_node: ['value', 'path', 'node', 'properties'],
  set_selection: ['value', 'selection', 'properties'],
  set_value: ['value', 'properties'],
  split_node: ['value', 'path', 'position', 'properties', 'target']

  /**
   * Default properties.
   *
   * @type {Object}
   */

};var DEFAULTS$12 = {
  length: undefined,
  mark: undefined,
  marks: undefined,
  newPath: undefined,
  node: undefined,
  offset: undefined,
  path: undefined,
  position: undefined,
  properties: undefined,
  selection: undefined,
  target: undefined,
  text: undefined,
  type: undefined,
  value: undefined

  /**
   * Operation.
   *
   * @type {Operation}
   */

};
var Operation = function (_Record) {
  inherits(Operation, _Record);

  function Operation() {
    classCallCheck(this, Operation);
    return possibleConstructorReturn(this, (Operation.__proto__ || Object.getPrototypeOf(Operation)).apply(this, arguments));
  }

  createClass(Operation, [{
    key: 'toJSON',


    /**
     * Return a JSON representation of the operation.
     *
     * @param {Object} options
     * @return {Object}
     */

    value: function toJSON() {
      var object = this.object,
          type = this.type;

      var json = { object: object, type: type };
      var ATTRIBUTES = OPERATION_ATTRIBUTES[type];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = ATTRIBUTES[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var value = this[key];

          // Skip keys for objects that should not be serialized, and are only used
          // for providing the local-only invert behavior for the history stack.
          if (key == 'document') continue;
          if (key == 'selection') continue;
          if (key == 'value') continue;
          if (key == 'node' && type != 'insert_node') continue;

          if (key == 'mark' || key == 'marks' || key == 'node') {
            value = value.toJSON();
          }

          if (key == 'properties' && type == 'merge_node') {
            var v = {};
            if ('data' in value) v.data = value.data.toJS();
            if ('type' in value) v.type = value.type;
            value = v;
          }

          if (key == 'properties' && type == 'set_mark') {
            var _v = {};
            if ('data' in value) _v.data = value.data.toJS();
            if ('type' in value) _v.type = value.type;
            value = _v;
          }

          if (key == 'properties' && type == 'set_node') {
            var _v2 = {};
            if ('data' in value) _v2.data = value.data.toJS();
            if ('isVoid' in value) _v2.isVoid = value.isVoid;
            if ('type' in value) _v2.type = value.type;
            value = _v2;
          }

          if (key == 'properties' && type == 'set_selection') {
            var _v3 = {};
            if ('anchorOffset' in value) _v3.anchorOffset = value.anchorOffset;
            if ('anchorPath' in value) _v3.anchorPath = value.anchorPath && value.anchorPath.toJSON();
            if ('focusOffset' in value) _v3.focusOffset = value.focusOffset;
            if ('focusPath' in value) _v3.focusPath = value.focusPath && value.focusPath.toJSON();
            if ('isBackward' in value) _v3.isBackward = value.isBackward;
            if ('isFocused' in value) _v3.isFocused = value.isFocused;
            if ('marks' in value) _v3.marks = value.marks && value.marks.toJSON();
            value = _v3;
          }

          if (key == 'properties' && type == 'set_value') {
            var _v4 = {};
            if ('data' in value) _v4.data = value.data.toJS();
            if ('decorations' in value) _v4.decorations = value.decorations.toJS();
            if ('schema' in value) _v4.schema = value.schema.toJS();
            value = _v4;
          }

          if (key == 'properties' && type == 'split_node') {
            var _v5 = {};
            if ('data' in value) _v5.data = value.data.toJS();
            if ('type' in value) _v5.type = value.type;
            value = _v5;
          }

          json[key] = value;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return json;
    }

    /**
     * Alias `toJS`.
     */

  }, {
    key: 'toJS',
    value: function toJS(options) {
      return this.toJSON(options);
    }
  }, {
    key: 'object',


    /**
     * Object.
     *
     * @return {String}
     */

    get: function get$$1() {
      return 'operation';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }], [{
    key: 'create',

    /**
     * Create a new `Operation` with `attrs`.
     *
     * @param {Object|Array|List|String|Operation} attrs
     * @return {Operation}
     */

    value: function create() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (Operation.isOperation(attrs)) {
        return attrs;
      }

      if (isPlainObject(attrs)) {
        return Operation.fromJSON(attrs);
      }

      throw new Error('`Operation.create` only accepts objects or operations, but you passed it: ' + attrs);
    }

    /**
     * Create a list of `Operations` from `elements`.
     *
     * @param {Array<Operation|Object>|List<Operation|Object>} elements
     * @return {List<Operation>}
     */

  }, {
    key: 'createList',
    value: function createList() {
      var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (List.isList(elements) || Array.isArray(elements)) {
        var list = new List(elements.map(Operation.create));
        return list;
      }

      throw new Error('`Operation.createList` only accepts arrays or lists, but you passed it: ' + elements);
    }

    /**
     * Create a `Operation` from a JSON `object`.
     *
     * @param {Object|Operation} object
     * @return {Operation}
     */

  }, {
    key: 'fromJSON',
    value: function fromJSON(object) {
      if (Operation.isOperation(object)) {
        return object;
      }

      var type = object.type;

      var ATTRIBUTES = OPERATION_ATTRIBUTES[type];
      var attrs = { type: type };

      if (!ATTRIBUTES) {
        throw new Error('`Operation.fromJSON` was passed an unrecognized operation type: "' + type + '"');
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ATTRIBUTES[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          var v = object[key];

          if (v === undefined) {
            // Skip keys for objects that should not be serialized, and are only used
            // for providing the local-only invert behavior for the history stack.
            if (key == 'document') continue;
            if (key == 'selection') continue;
            if (key == 'value') continue;
            if (key == 'node' && type != 'insert_node') continue;

            throw new Error('`Operation.fromJSON` was passed a "' + type + '" operation without the required "' + key + '" attribute.');
          }

          if (key === 'path' || key === 'newPath') {
            v = PathUtils.create(v);
          }

          if (key === 'mark') {
            v = Mark.create(v);
          }

          if (key === 'marks' && v != null) {
            v = Mark.createSet(v);
          }

          if (key === 'node') {
            v = Node.create(v);
          }

          if (key === 'selection') {
            v = Range.create(v);
          }

          if (key === 'value') {
            v = Value.create(v);
          }

          if (key === 'properties' && type === 'merge_node') {
            v = Node.createProperties(v);
          }

          if (key === 'properties' && type === 'set_mark') {
            v = Mark.createProperties(v);
          }

          if (key === 'properties' && type === 'set_node') {
            v = Node.createProperties(v);
          }

          if (key === 'properties' && type === 'set_selection') {
            v = Range.createProperties(v);
          }

          if (key === 'properties' && type === 'set_value') {
            v = Value.createProperties(v);
          }

          if (key === 'properties' && type === 'split_node') {
            v = Node.createProperties(v);
          }

          attrs[key] = v;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var node = new Operation(attrs);
      return node;
    }

    /**
     * Alias `fromJS`.
     */

  }, {
    key: 'isOperation',


    /**
     * Check if `any` is a `Operation`.
     *
     * @param {Any} any
     * @return {Boolean}
     */

    value: function isOperation(any) {
      return !!(any && any[MODEL_TYPES.OPERATION]);
    }

    /**
     * Check if `any` is a list of operations.
     *
     * @param {Any} any
     * @return {Boolean}
     */

  }, {
    key: 'isOperationList',
    value: function isOperationList(any) {
      return List.isList(any) && any.every(function (item) {
        return Operation.isOperation(item);
      });
    }
  }]);
  return Operation;
}(Record(DEFAULTS$12));

/**
 * Attach a pseudo-symbol for type checking.
 */

Operation.fromJS = Operation.fromJSON;
Operation.prototype[MODEL_TYPES.OPERATION] = true;

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$2 = Debug('slate:operation:invert');

/**
 * Invert an `op`.
 *
 * @param {Object} op
 * @return {Object}
 */

function invertOperation(op) {
  op = Operation.create(op);
  var _op = op,
      type = _op.type;

  debug$2(type, op);

  switch (type) {
    case 'insert_node':
      {
        var inverse = op.set('type', 'remove_node');
        return inverse;
      }

    case 'remove_node':
      {
        var _inverse = op.set('type', 'insert_node');
        return _inverse;
      }

    case 'move_node':
      {
        var _op2 = op,
            newPath = _op2.newPath,
            path = _op2.path;

        var inversePath = newPath;
        var inverseNewPath = path;

        var pathLast = path.size - 1;
        var newPathLast = newPath.size - 1;

        // If the node's old position was a left sibling of an ancestor of
        // its new position, we need to adjust part of the path by -1.
        if (path.size < inversePath.size && path.slice(0, pathLast).every(function (e, i) {
          return e == inversePath.get(i);
        }) && path.last() < inversePath.get(pathLast)) {
          inversePath = inversePath.slice(0, pathLast).concat(inversePath.get(pathLast) - 1).concat(inversePath.slice(pathLast + 1, inversePath.size));
        }

        // If the node's new position is an ancestor of the old position,
        // or a left sibling of an ancestor of its old position, we need
        // to adjust part of the path by 1.
        if (newPath.size < inverseNewPath.size && newPath.slice(0, newPathLast).every(function (e, i) {
          return e == inverseNewPath.get(i);
        }) && newPath.last() <= inverseNewPath.get(newPathLast)) {
          inverseNewPath = inverseNewPath.slice(0, newPathLast).concat(inverseNewPath.get(newPathLast) + 1).concat(inverseNewPath.slice(newPathLast + 1, inverseNewPath.size));
        }

        var _inverse2 = op.set('path', inversePath).set('newPath', inverseNewPath);
        return _inverse2;
      }

    case 'merge_node':
      {
        var _op3 = op,
            _path = _op3.path;

        var _inversePath = PathUtils.decrement(_path);
        var _inverse3 = op.set('type', 'split_node').set('path', _inversePath);
        return _inverse3;
      }

    case 'split_node':
      {
        var _op4 = op,
            _path2 = _op4.path;

        var _inversePath2 = PathUtils.increment(_path2);
        var _inverse4 = op.set('type', 'merge_node').set('path', _inversePath2);
        return _inverse4;
      }

    case 'set_node':
      {
        var _op5 = op,
            properties = _op5.properties,
            node = _op5.node;

        var inverseNode = node.merge(properties);
        var inverseProperties = pick(node, Object.keys(properties));
        var _inverse5 = op.set('node', inverseNode).set('properties', inverseProperties);
        return _inverse5;
      }

    case 'insert_text':
      {
        var _inverse6 = op.set('type', 'remove_text');
        return _inverse6;
      }

    case 'remove_text':
      {
        var _inverse7 = op.set('type', 'insert_text');
        return _inverse7;
      }

    case 'add_mark':
      {
        var _inverse8 = op.set('type', 'remove_mark');
        return _inverse8;
      }

    case 'remove_mark':
      {
        var _inverse9 = op.set('type', 'add_mark');
        return _inverse9;
      }

    case 'set_mark':
      {
        var _op6 = op,
            _properties = _op6.properties,
            mark = _op6.mark;

        var inverseMark = mark.merge(_properties);
        var _inverseProperties = pick(mark, Object.keys(_properties));
        var _inverse10 = op.set('mark', inverseMark).set('properties', _inverseProperties);
        return _inverse10;
      }

    case 'set_selection':
      {
        var _op7 = op,
            _properties2 = _op7.properties,
            selection = _op7.selection;

        var inverseSelection = selection.merge(_properties2);
        var inverseProps = pick(selection, Object.keys(_properties2));
        var _inverse11 = op.set('selection', inverseSelection).set('properties', inverseProps);
        return _inverse11;
      }

    case 'set_value':
      {
        var _op8 = op,
            _properties3 = _op8.properties,
            value = _op8.value;

        var inverseValue = value.merge(_properties3);
        var _inverseProperties2 = pick(value, Object.keys(_properties3));
        var _inverse12 = op.set('value', inverseValue).set('properties', _inverseProperties2);
        return _inverse12;
      }

    default:
      {
        throw new Error('Unknown operation type: "' + type + '".');
      }
  }
}

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$3 = {};

/**
 * Redo to the next value in the history.
 *
 * @param {Change} change
 */

Changes$3.redo = function (change) {
  var value = change.value;
  var _value = value,
      history = _value.history;

  if (!history) return;

  var _history = history,
      undos = _history.undos,
      redos = _history.redos;

  var next = redos.peek();
  if (!next) return;

  // Shift the next value into the undo stack.
  redos = redos.pop();
  undos = undos.push(next);

  // Replay the next operations.
  next.forEach(function (op) {
    var _op = op,
        type = _op.type,
        properties = _op.properties;

    // When the operation mutates the selection, omit its `isFocused` value to
    // prevent the editor focus from changing during redoing.

    if (type == 'set_selection') {
      op = op.set('properties', omit(properties, 'isFocused'));
    }

    change.applyOperation(op, { save: false });
  });

  // Update the history.
  value = change.value;
  history = history.set('undos', undos).set('redos', redos);
  value = value.set('history', history);
  change.value = value;
};

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes$3.undo = function (change) {
  var value = change.value;
  var _value2 = value,
      history = _value2.history;

  if (!history) return;

  var _history2 = history,
      undos = _history2.undos,
      redos = _history2.redos;

  var previous = undos.peek();
  if (!previous) return;

  // Shift the previous operations into the redo stack.
  undos = undos.pop();
  redos = redos.push(previous);

  // Replay the inverse of the previous operations.
  previous.slice().reverse().map(invertOperation).forEach(function (inverse) {
    var _inverse = inverse,
        type = _inverse.type,
        properties = _inverse.properties;

    // When the operation mutates the selection, omit its `isFocused` value to
    // prevent the editor focus from changing during undoing.

    if (type == 'set_selection') {
      inverse = inverse.set('properties', omit(properties, 'isFocused'));
    }

    change.applyOperation(inverse, { save: false });
  });

  // Update the history.
  value = change.value;
  history = history.set('undos', undos).set('redos', redos);
  value = value.set('history', history);
  change.value = value;
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$4 = {};

/**
 * Set `properties` on the selection.
 *
 * @param {Change} change
 * @param {Object} properties
 */

Changes$4.select = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = Range.createProperties(properties);

  var _options$snapshot = options.snapshot,
      snapshot = _options$snapshot === undefined ? false : _options$snapshot;
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var props = {};
  var sel = selection.toJSON();
  var next = selection.merge(properties).normalize(document);
  properties = pick(next, Object.keys(properties));

  // Remove any properties that are already equal to the current selection. And
  // create a dictionary of the previous values for all of the properties that
  // are being changed, for the inverse operation.
  for (var k in properties) {
    if (snapshot == false && properties[k] == sel[k]) continue;
    props[k] = properties[k];
  }

  // If the selection moves, clear any marks, unless the new selection
  // properties change the marks in some way.
  var moved = ['anchorKey', 'anchorOffset', 'focusKey', 'focusOffset'].some(function (p) {
    return props.hasOwnProperty(p);
  });

  if (sel.marks && properties.marks == sel.marks && moved) {
    props.marks = null;
  }

  // If there are no new properties to set, abort.
  if (isEmpty(props)) {
    return;
  }

  // Apply the operation.
  change.applyOperation({
    type: 'set_selection',
    value: value,
    properties: props,
    selection: sel
  }, snapshot ? { skip: false, merge: false } : {});
};

/**
 * Select the whole document.
 *
 * @param {Change} change
 */

Changes$4.selectAll = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection;

  var next = selection.moveToRangeOf(document);
  change.select(next);
};

/**
 * Snapshot the current selection.
 *
 * @param {Change} change
 */

Changes$4.snapshotSelection = function (change) {
  var value = change.value;
  var selection = value.selection;

  change.select(selection, { snapshot: true });
};

/**
 * Move the anchor point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes$4.moveAnchorCharBackward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      anchorText = value.anchorText,
      anchorBlock = value.anchorBlock;
  var anchorOffset = selection.anchorOffset;

  var previousText = document.getPreviousText(anchorText.key);
  var isInVoid = document.hasVoidParent(anchorText.key);
  var isPreviousInVoid = previousText && document.hasVoidParent(previousText.key);

  if (!isInVoid && anchorOffset > 0) {
    change.moveAnchor(-1);
    return;
  }

  if (!previousText) {
    return;
  }

  change.moveAnchorToEndOf(previousText);

  if (!isInVoid && !isPreviousInVoid && anchorBlock.hasNode(previousText.key)) {
    change.moveAnchor(-1);
  }
};

/**
 * Move the anchor point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes$4.moveAnchorCharForward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      anchorText = value.anchorText,
      anchorBlock = value.anchorBlock;
  var anchorOffset = selection.anchorOffset;

  var nextText = document.getNextText(anchorText.key);
  var isInVoid = document.hasVoidParent(anchorText.key);
  var isNextInVoid = nextText && document.hasVoidParent(nextText.key);

  if (!isInVoid && anchorOffset < anchorText.text.length) {
    change.moveAnchor(1);
    return;
  }

  if (!nextText) {
    return;
  }

  change.moveAnchorToStartOf(nextText);

  if (!isInVoid && !isNextInVoid && anchorBlock.hasNode(nextText.key)) {
    change.moveAnchor(1);
  }
};

/**
 * Move the focus point backward, accounting for being at the start of a block.
 *
 * @param {Change} change
 */

Changes$4.moveFocusCharBackward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      focusText = value.focusText,
      focusBlock = value.focusBlock;
  var focusOffset = selection.focusOffset;

  var previousText = document.getPreviousText(focusText.key);
  var isInVoid = document.hasVoidParent(focusText.key);
  var isPreviousInVoid = previousText && document.hasVoidParent(previousText.key);

  if (!isInVoid && focusOffset > 0) {
    change.moveFocus(-1);
    return;
  }

  if (!previousText) {
    return;
  }

  change.moveFocusToEndOf(previousText);

  if (!isInVoid && !isPreviousInVoid && focusBlock.hasNode(previousText.key)) {
    change.moveFocus(-1);
  }
};

/**
 * Move the focus point forward, accounting for being at the end of a block.
 *
 * @param {Change} change
 */

Changes$4.moveFocusCharForward = function (change) {
  var value = change.value;
  var document = value.document,
      selection = value.selection,
      focusText = value.focusText,
      focusBlock = value.focusBlock;
  var focusOffset = selection.focusOffset;

  var nextText = document.getNextText(focusText.key);
  var isInVoid = document.hasVoidParent(focusText.key);
  var isNextInVoid = nextText && document.hasVoidParent(nextText.key);

  if (!isInVoid && focusOffset < focusText.text.length) {
    change.moveFocus(1);
    return;
  }

  if (!nextText) {
    return;
  }

  change.moveFocusToStartOf(nextText);

  if (!isInVoid && !isNextInVoid && focusBlock.hasNode(nextText.key)) {
    change.moveFocus(1);
  }
};

/**
 * Mix in move methods.
 */

var MOVE_DIRECTIONS = ['Forward', 'Backward'];

MOVE_DIRECTIONS.forEach(function (direction$$1) {
  var anchor = 'moveAnchorChar' + direction$$1;
  var focus = 'moveFocusChar' + direction$$1;

  Changes$4['moveChar' + direction$$1] = function (change) {
    change[anchor]()[focus]();
  };

  Changes$4['moveStartChar' + direction$$1] = function (change) {
    if (change.value.isBackward) {
      change[focus]();
    } else {
      change[anchor]();
    }
  };

  Changes$4['moveEndChar' + direction$$1] = function (change) {
    if (change.value.isBackward) {
      change[anchor]();
    } else {
      change[focus]();
    }
  };

  Changes$4['extendChar' + direction$$1] = function (change) {
    change['moveFocusChar' + direction$$1]();
  };

  Changes$4['collapseChar' + direction$$1] = function (change) {
    var collapse = direction$$1 == 'Forward' ? 'collapseToEnd' : 'collapseToStart';
    change[collapse]()['moveChar' + direction$$1]();
  };
});

/**
 * Mix in alias methods.
 */

var ALIAS_METHODS$1 = [['collapseLineBackward', 'collapseToStartOfBlock'], ['collapseLineForward', 'collapseToEndOfBlock'], ['extendLineBackward', 'extendToStartOfBlock'], ['extendLineForward', 'extendToEndOfBlock']];

ALIAS_METHODS$1.forEach(function (_ref) {
  var _ref2 = slicedToArray(_ref, 2),
      alias = _ref2[0],
      method = _ref2[1];

  Changes$4[alias] = function (change) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    change[method].apply(change, [change].concat(args));
  };
});

/**
 * Mix in selection changes that are just a proxy for the selection method.
 */

var PROXY_TRANSFORMS$1 = ['blur', 'collapseTo', 'collapseToAnchor', 'collapseToEnd', 'collapseToEndOf', 'collapseToFocus', 'collapseToStart', 'collapseToStartOf', 'extend', 'extendTo', 'extendToEndOf', 'extendToStartOf', 'flip', 'focus', 'move', 'moveAnchor', 'moveAnchorOffsetTo', 'moveAnchorTo', 'moveAnchorToEndOf', 'moveAnchorToStartOf', 'moveEnd', 'moveEndOffsetTo', 'moveEndTo', 'moveFocus', 'moveFocusOffsetTo', 'moveFocusTo', 'moveFocusToEndOf', 'moveFocusToStartOf', 'moveOffsetsTo', 'moveStart', 'moveStartOffsetTo', 'moveStartTo', 'moveTo', 'moveToEnd', 'moveToEndOf', 'moveToRangeOf', 'moveToStart', 'moveToStartOf', 'deselect'];

PROXY_TRANSFORMS$1.forEach(function (method) {
  Changes$4[method] = function (change) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var normalize = method != 'deselect';
    var value = change.value;
    var document = value.document,
        selection = value.selection;

    var next = selection[method].apply(selection, args);
    if (normalize) next = next.normalize(document);
    change.select(next);
  };
});

/**
 * Mix in node-related changes.
 */

var PREFIXES = ['moveTo', 'moveAnchorTo', 'moveFocusTo', 'moveStartTo', 'moveEndTo', 'collapseTo', 'extendTo'];

var DIRECTIONS = ['Next', 'Previous'];

var OBJECTS = ['Block', 'Inline', 'Text'];

PREFIXES.forEach(function (prefix) {
  var edges = ['Start', 'End'];

  if (prefix == 'moveTo') {
    edges.push('Range');
  }

  edges.forEach(function (edge) {
    var method = '' + prefix + edge + 'Of';

    OBJECTS.forEach(function (object) {
      var getNode = object == 'Text' ? 'getNode' : 'getClosest' + object;

      Changes$4['' + method + object] = function (change) {
        var value = change.value;
        var document = value.document,
            selection = value.selection;

        var node = document[getNode](selection.startKey);
        if (!node) return;
        change[method](node);
      };

      DIRECTIONS.forEach(function (direction$$1) {
        var getDirectionNode = 'get' + direction$$1 + object;
        var directionKey = direction$$1 == 'Next' ? 'startKey' : 'endKey';

        Changes$4['' + method + direction$$1 + object] = function (change) {
          var value = change.value;
          var document = value.document,
              selection = value.selection;

          var node = document[getNode](selection[directionKey]);
          if (!node) return;
          var target = document[getDirectionNode](node.key);
          if (!target) return;
          change[method](target);
        };
      });
    });
  });
});

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$5 = {};

/**
 * Set `properties` on the value.
 *
 * @param {Change} change
 * @param {Object|Value} properties
 * @param {Object} options
 */

Changes$5.setValue = function (change, properties) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  properties = Value.createProperties(properties);
  var value = change.value;


  change.applyOperation({
    type: 'set_value',
    properties: properties,
    value: value
  }, options);
};

/**
 * Changes.
 *
 * @type {Object}
 */

var Changes$6 = {};

/**
 * Normalize the value with its schema.
 *
 * @param {Change} change
 */

Changes$6.normalize = function (change, options) {
  change.normalizeDocument(options);
};

/**
 * Normalize the document with the value's schema.
 *
 * @param {Change} change
 */

Changes$6.normalizeDocument = function (change, options) {
  var value = change.value;
  var document = value.document;

  change.normalizeNodeByKey(document.key, options);
};

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Node|String} key
 */

Changes$6.normalizeNodeByKey = function (change, key) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var normalize = change.getFlag('normalize', options);
  if (!normalize) return;

  var value = change.value;
  var document = value.document,
      schema = value.schema;

  var node = document.assertNode(key);

  normalizeNodeAndChildren(change, node, schema);

  change.normalizeAncestorsByKey(key);
};

/**
 * Normalize a node's ancestors by `key`.
 *
 * @param {Change} change
 * @param {String} key
 */

Changes$6.normalizeAncestorsByKey = function (change, key) {
  var value = change.value;
  var document = value.document,
      schema = value.schema;

  var ancestors = document.getAncestors(key);
  if (!ancestors) return;

  ancestors.forEach(function (ancestor) {
    if (change.value.document.getDescendant(ancestor.key)) {
      normalizeNode(change, ancestor, schema);
    }
  });
};

Changes$6.normalizeParentByKey = function (change, key, options) {
  var value = change.value;
  var document = value.document;

  var parent = document.getParent(key);
  change.normalizeNodeByKey(parent.key, options);
};

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Array} path
 */

Changes$6.normalizeNodeByPath = function (change, path) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var normalize = change.getFlag('normalize', options);
  if (!normalize) return;

  var value = change.value;
  var document = value.document,
      schema = value.schema;

  var node = document.assertNode(path);

  normalizeNodeAndChildren(change, node, schema);

  document = change.value.document;
  var ancestors = document.getAncestors(path);
  if (!ancestors) return;

  ancestors.forEach(function (ancestor) {
    if (change.value.document.getDescendant(ancestor.key)) {
      normalizeNode(change, ancestor, schema);
    }
  });
};

Changes$6.normalizeParentByPath = function (change, path, options) {
  var p = PathUtils.lift(path);
  change.normalizeNodeByPath(p, options);
};

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(change, node, schema) {
  if (node.object == 'text') {
    normalizeNode(change, node, schema);
    return;
  }

  var child = node.getFirstInvalidDescendant(schema);
  var path = change.value.document.getPath(node.key);

  while (node && child) {
    normalizeNodeAndChildren(change, child, schema);
    node = change.value.document.refindNode(path, node.key);

    if (!node) {
      path = [];
      child = null;
    } else {
      path = change.value.document.refindPath(path, node.key);
      child = node.getFirstInvalidDescendant(schema);
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(change, node, schema);
  }
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(change, node, schema) {
  var max = schema.stack.plugins.length + schema.rules.length + 1;
  var iterations = 0;

  function iterate(c, n) {
    var normalize = n.normalize(schema);
    if (!normalize) return;

    // Run the `normalize` function to fix the node.
    var path = c.value.document.getPath(n.key);
    normalize(c);

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = c.value.document.refindNode(path, n.key);
    if (!n) return;

    path = c.value.document.refindPath(path, n.key);

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `normalize`
    // function of a schema rule to be written incorrectly and for an infinite
    // invalid loop to occur.
    iterations++;

    if (iterations > max) {
      throw new Error('A schema rule could not be normalized after sufficient iterations. This is usually due to a `rule.normalize` or `plugin.normalizeNode` function of a schema being incorrectly written, causing an infinite loop.');
    }

    // Otherwise, iterate again.
    iterate(c, n);
  }

  iterate(change, node);
}

/**
 * Export.
 *
 * @type {Object}
 */

var Changes$7 = _extends({}, Changes, Changes$1, Changes$2, Changes$3, Changes$4, Changes$5, Changes$6);

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$3 = Debug('slate:operation:apply');

/**
 * Apply an `op` to a `value`.
 *
 * @param {Value} value
 * @param {Object|Operation} op
 * @return {Value} value
 */

function applyOperation(value, op) {
  op = Operation.create(op);
  var _op = op,
      type = _op.type;

  debug$3(type, op);

  switch (type) {
    case 'add_mark':
      {
        var _op2 = op,
            path = _op2.path,
            offset = _op2.offset,
            length = _op2.length,
            mark = _op2.mark;

        var next = value.addMark(path, offset, length, mark);
        return next;
      }

    case 'insert_node':
      {
        var _op3 = op,
            _path = _op3.path,
            node = _op3.node;

        var _next = value.insertNode(_path, node);
        return _next;
      }

    case 'insert_text':
      {
        var _op4 = op,
            _path2 = _op4.path,
            _offset = _op4.offset,
            text = _op4.text,
            marks = _op4.marks;

        var _next2 = value.insertText(_path2, _offset, text, marks);
        return _next2;
      }

    case 'merge_node':
      {
        var _op5 = op,
            _path3 = _op5.path;

        var _next3 = value.mergeNode(_path3);
        return _next3;
      }

    case 'move_node':
      {
        var _op6 = op,
            _path4 = _op6.path,
            newPath = _op6.newPath;

        var _next4 = value.moveNode(_path4, newPath);
        return _next4;
      }

    case 'remove_mark':
      {
        var _op7 = op,
            _path5 = _op7.path,
            _offset2 = _op7.offset,
            _length = _op7.length,
            _mark = _op7.mark;

        var _next5 = value.removeMark(_path5, _offset2, _length, _mark);
        return _next5;
      }

    case 'remove_node':
      {
        var _op8 = op,
            _path6 = _op8.path;

        var _next6 = value.removeNode(_path6);
        return _next6;
      }

    case 'remove_text':
      {
        var _op9 = op,
            _path7 = _op9.path,
            _offset3 = _op9.offset,
            _text = _op9.text;

        var _next7 = value.removeText(_path7, _offset3, _text);
        return _next7;
      }

    case 'set_mark':
      {
        var _op10 = op,
            _path8 = _op10.path,
            _offset4 = _op10.offset,
            _length2 = _op10.length,
            _mark2 = _op10.mark,
            properties = _op10.properties;

        var _next8 = value.setMark(_path8, _offset4, _length2, _mark2, properties);
        return _next8;
      }

    case 'set_node':
      {
        var _op11 = op,
            _path9 = _op11.path,
            _properties = _op11.properties;

        var _next9 = value.setNode(_path9, _properties);
        return _next9;
      }

    case 'set_selection':
      {
        var _op12 = op,
            _properties2 = _op12.properties;

        var _next10 = value.setSelection(_properties2);
        return _next10;
      }

    case 'set_value':
      {
        var _op13 = op,
            _properties3 = _op13.properties;

        var _next11 = value.merge(_properties3);
        return _next11;
      }

    case 'split_node':
      {
        var _op14 = op,
            _path10 = _op14.path,
            position = _op14.position,
            _properties4 = _op14.properties;

        var _next12 = value.splitNode(_path10, position, _properties4);
        return _next12;
      }

    default:
      {
        throw new Error('Unknown operation type: "' + type + '".');
      }
  }
}

/**
 * Debug.
 *
 * @type {Function}
 */

var debug$4 = Debug('slate:change');

/**
 * Change.
 *
 * @type {Change}
 */

var Change = function () {

  /**
   * Create a new `Change` with `attrs`.
   *
   * @param {Object} attrs
   *   @property {Value} value
   */

  function Change(attrs) {
    classCallCheck(this, Change);
    var value = attrs.value;

    this.value = value;
    this.operations = new List();

    this.flags = _extends({
      normalize: true
    }, pick(attrs, ['merge', 'save', 'normalize']));
  }

  /**
   * Object.
   *
   * @return {String}
   */

  /**
   * Check if `any` is a `Change`.
   *
   * @param {Any} any
   * @return {Boolean}
   */

  createClass(Change, [{
    key: 'applyOperation',


    /**
     * Apply an `operation` to the current value, saving the operation to the
     * history if needed.
     *
     * @param {Operation|Object} operation
     * @param {Object} options
     * @return {Change}
     */

    value: function applyOperation$$1(operation) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var operations = this.operations,
          flags = this.flags;
      var value = this.value;
      var _value = value,
          history = _value.history;

      // Add in the current `value` in case the operation was serialized.

      if (isPlainObject(operation)) {
        operation = _extends({}, operation, { value: value });
      }

      operation = Operation.create(operation);

      // Default options to the change-level flags, this allows for setting
      // specific options for all of the operations of a given change.
      options = _extends({}, flags, options);

      // Derive the default option values.
      var _options = options,
          _options$merge = _options.merge,
          merge = _options$merge === undefined ? operations.size == 0 ? null : true : _options$merge,
          _options$save = _options.save,
          save = _options$save === undefined ? true : _options$save,
          _options$skip = _options.skip,
          skip = _options$skip === undefined ? null : _options$skip;

      // Apply the operation to the value.

      debug$4('apply', { operation: operation, save: save, merge: merge });
      value = applyOperation(value, operation);

      // If needed, save the operation to the history.
      if (history && save) {
        history = history.save(operation, { merge: merge, skip: skip });
        value = value.set('history', history);
      }

      // Update the mutable change object.
      this.value = value;
      this.operations = operations.push(operation);
      return this;
    }

    /**
     * Apply a series of `operations` to the current value.
     *
     * @param {Array|List} operations
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'applyOperations',
    value: function applyOperations(operations, options) {
      var _this = this;

      operations.forEach(function (op) {
        return _this.applyOperation(op, options);
      });
      return this;
    }

    /**
     * Call a change `fn` with arguments.
     *
     * @param {Function} fn
     * @param {Mixed} ...args
     * @return {Change}
     */

  }, {
    key: 'call',
    value: function call(fn) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      fn.apply(undefined, [this].concat(args));
      return this;
    }

    /**
     * Applies a series of change mutations, deferring normalization to the end.
     *
     * @param {Function} fn
     * @return {Change}
     */

  }, {
    key: 'withoutNormalization',
    value: function withoutNormalization(fn) {
      var original = this.flags.normalize;
      this.setOperationFlag('normalize', false);
      fn(this);
      this.setOperationFlag('normalize', original);
      this.normalizeDocument();
      return this;
    }

    /**
     * Set an operation flag by `key` to `value`.
     *
     * @param {String} key
     * @param {Any} value
     * @return {Change}
     */

  }, {
    key: 'setOperationFlag',
    value: function setOperationFlag(key, value) {
      this.flags[key] = value;
      return this;
    }

    /**
     * Get the `value` of the specified flag by its `key`. Optionally accepts an `options`
     * object with override flags.
     *
     * @param {String} key
     * @param {Object} options
     * @return {Change}
     */

  }, {
    key: 'getFlag',
    value: function getFlag(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return options[key] !== undefined ? options[key] : this.flags[key];
    }

    /**
     * Unset an operation flag by `key`.
     *
     * @param {String} key
     * @return {Change}
     */

  }, {
    key: 'unsetOperationFlag',
    value: function unsetOperationFlag(key) {
      delete this.flags[key];
      return this;
    }
  }, {
    key: 'object',
    get: function get$$1() {
      return 'change';
    }
  }, {
    key: 'kind',
    get: function get$$1() {
      logger.deprecate('slate@0.32.0', 'The `kind` property of Slate objects has been renamed to `object`.');
      return this.object;
    }
  }]);
  return Change;
}();

/**
 * Attach a pseudo-symbol for type checking.
 */

Change.isChange = isType.bind(null, 'CHANGE');
Change.prototype[MODEL_TYPES.CHANGE] = true;

/**
 * Add a change method for each of the changes.
 */

Object.keys(Changes$7).forEach(function (type) {
  Change.prototype[type] = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    debug$4(type, { args: args });
    this.call.apply(this, [Changes$7[type]].concat(args));
    return this;
  };
});

/**
 * Export.
 *
 * @type {Object}
 */

var Operations = {
  apply: applyOperation,
  invert: invertOperation
};

function setKeyGenerator(fn) {
  logger.deprecate('0.35.0', 'The `setKeyGenerator()` util is deprecrated. Use the `KeyUtils.setGenerator()` helper instead.');

  return KeyUtils.setGenerator(fn);
}

function resetKeyGenerator() {
  logger.deprecate('0.35.0', 'The `resetKeyGenerator()` util is deprecrated. Use the `KeyUtils.resetGenerator()` helper instead.');

  return KeyUtils.resetGenerator();
}

var index = {
  Block: Block,
  Changes: Changes$7,
  Character: Character,
  Data: Data,
  Document: Document,
  History: History,
  Inline: Inline,
  KeyUtils: KeyUtils,
  Leaf: Leaf,
  Mark: Mark,
  Node: Node,
  Operation: Operation,
  Operations: Operations,
  PathUtils: PathUtils,
  Range: Range,
  resetKeyGenerator: resetKeyGenerator,
  resetMemoization: resetMemoization,
  Schema: Schema,
  setKeyGenerator: setKeyGenerator,
  Stack: Stack$1,
  Text: Text,
  TextUtils: TextUtils,
  useMemoization: useMemoization,
  Value: Value
};

export default index;
export { Block, Change, Changes$7 as Changes, Character, Data, Document, History, Inline, KeyUtils, Leaf, Mark, Node, Operation, Operations, PathUtils, Range, resetKeyGenerator, resetMemoization, Schema, setKeyGenerator, Stack$1 as Stack, Text, TextUtils, useMemoization, Value };
//# sourceMappingURL=slate.es.js.map
