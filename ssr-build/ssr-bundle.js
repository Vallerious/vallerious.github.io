module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "JkW7");
/******/ })
/************************************************************************/
/******/ ({

/***/ "/f1z":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = __webpack_require__("ZsiJ");

/***/ }),

/***/ "DFDv":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_whatwg_fetch__ = __webpack_require__("rplX");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_whatwg_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_whatwg_fetch__);


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
var setTimeoutFunc = setTimeout;

function noop() {}

// Polyfill for Function.prototype.bind
function bind(fn, thisArg) {
  return function () {
    fn.apply(thisArg, arguments);
  };
}

function Promise(fn) {
  if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  this._state = 0;
  this._handled = false;
  this._value = undefined;
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function () {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function () {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return;
      done = true;
      resolve(self, value);
    }, function (reason) {
      if (done) return;
      done = true;
      reject(self, reason);
    });
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function (onFulfilled, onRejected) {
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = function (callback) {
  var constructor = this.constructor;
  return this.then(function (value) {
    return constructor.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    return constructor.resolve(callback()).then(function () {
      return constructor.reject(reason);
    });
  });
};

Promise.all = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then;
          if (typeof then === 'function') {
            then.call(val, function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function (value) {
  if (value && typeof value === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function (resolve) {
    resolve(value);
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    for (var i = 0, len = values.length; i < len; i++) {
      values[i].then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
  setImmediate(fn);
} || function (fn) {
  setTimeoutFunc(fn, 0);
};

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

var globalNS = function () {
  // the only reliable means to get the global object is
  // `Function('return this')()`
  // However, this causes CSP violations in Chrome apps.
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
}();

if (!globalNS.Promise) {
  globalNS.Promise = Promise;
}

function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.5.5' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _isObject = function _isObject(it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function _anObject(it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function _fails(exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

var document = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document) && _isObject(document.createElement);
var _domCreate = function _domCreate(it) {
  return is ? document.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function _toPrimitive(it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
  f: f
};

var _propertyDesc = function _propertyDesc(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function _has(it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function _uid(key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
  var SRC = _uid('src');
  var TO_STRING = 'toString';
  var $toString = Function[TO_STRING];
  var TPL = ('' + $toString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === _global) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      _hide(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      _hide(O, key, val);
    }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
});

var _aFunction = function _aFunction(it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function _ctx(fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function $export(type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1; // forced
$export.G = 2; // global
$export.S = 4; // static
$export.P = 8; // proto
$export.B = 16; // bind
$export.W = 32; // wrap
$export.U = 64; // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

var toString = {}.toString;

var _cof = function _cof(it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function _defined(it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// 7.1.13 ToObject(argument)

var _toObject = function _toObject(it) {
  return Object(_defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function _toInteger(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function _toLength(it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

// 7.2.2 IsArray(argument)

var _isArray = Array.isArray || function isArray(arg) {
  return _cof(arg) == 'Array';
};

var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});
var _shared = function _shared(key) {
  return store[key] || (store[key] = {});
};

var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] = USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
});

var SPECIES = _wks('species');

var _arraySpeciesConstructor = function _arraySpeciesConstructor(original) {
  var C;
  if (_isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
    if (_isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  }return C === undefined ? Array : C;
};

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


var _arraySpeciesCreate = function _arraySpeciesCreate(original, length) {
  return new (_arraySpeciesConstructor(original))(length);
};

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex


var _arrayMethods = function _arrayMethods(TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || _arraySpeciesCreate;
  return function ($this, callbackfn, that) {
    var O = _toObject($this);
    var self = _iobject(O);
    var f = _ctx(callbackfn, that, 3);
    var length = _toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (; length > index; index++) {
      if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res; // map
          else if (res) switch (TYPE) {
              case 3:
                return true; // some
              case 5:
                return val; // find
              case 6:
                return index; // findIndex
              case 2:
                result.push(val); // filter
            } else if (IS_EVERY) return false; // every
        }
      }
    }return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function _addToUnscopables(key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

var $find = _arrayMethods(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () {
  forced = false;
});
_export(_export.P + _export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY);

var find = _core.Array.find;

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)

var $find$1 = _arrayMethods(6);
var KEY$1 = 'findIndex';
var forced$1 = true;
// Shouldn't skip holes
if (KEY$1 in []) Array(1)[KEY$1](function () {
  forced$1 = false;
});
_export(_export.P + _export.F * forced$1, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
_addToUnscopables(KEY$1);

var findIndex = _core.Array.findIndex;

// 7.2.8 IsRegExp(argument)


var MATCH = _wks('match');
var _isRegexp = function _isRegexp(it) {
  var isRegExp;
  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
};

// helper for String#{startsWith, endsWith, includes}


var _stringContext = function _stringContext(that, searchString, NAME) {
  if (_isRegexp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(_defined(that));
};

var MATCH$1 = _wks('match');
var _failsIsRegexp = function _failsIsRegexp(KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH$1] = false;
      return !'/./'[KEY](re);
    } catch (f) {/* empty */}
  }return true;
};

var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

_export(_export.P + _export.F * _failsIsRegexp(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = _stringContext(this, searchString, STARTS_WITH);
    var index = _toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith ? $startsWith.call(that, search, index) : that.slice(index, index + search.length) === search;
  }
});

var startsWith = _core.String.startsWith;

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/***/ }),

/***/ "EBst":
/***/ (function(module, exports, __webpack_require__) {

!function () {
  "use strict";
  function e() {}function t(t, n) {
    var o,
        r,
        i,
        l,
        a = E;for (l = arguments.length; l-- > 2;) {
      W.push(arguments[l]);
    }n && null != n.children && (W.length || W.push(n.children), delete n.children);while (W.length) {
      if ((r = W.pop()) && void 0 !== r.pop) for (l = r.length; l--;) {
        W.push(r[l]);
      } else "boolean" == typeof r && (r = null), (i = "function" != typeof t) && (null == r ? r = "" : "number" == typeof r ? r += "" : "string" != typeof r && (i = !1)), i && o ? a[a.length - 1] += r : a === E ? a = [r] : a.push(r), o = i;
    }var u = new e();return u.nodeName = t, u.children = a, u.attributes = null == n ? void 0 : n, u.key = null == n ? void 0 : n.key, void 0 !== S.vnode && S.vnode(u), u;
  }function n(e, t) {
    for (var n in t) {
      e[n] = t[n];
    }return e;
  }function o(e, o) {
    return t(e.nodeName, n(n({}, e.attributes), o), arguments.length > 2 ? [].slice.call(arguments, 2) : e.children);
  }function r(e) {
    !e.__d && (e.__d = !0) && 1 == A.push(e) && (S.debounceRendering || P)(i);
  }function i() {
    var e,
        t = A;A = [];while (e = t.pop()) {
      e.__d && k(e);
    }
  }function l(e, t, n) {
    return "string" == typeof t || "number" == typeof t ? void 0 !== e.splitText : "string" == typeof t.nodeName ? !e._componentConstructor && a(e, t.nodeName) : n || e._componentConstructor === t.nodeName;
  }function a(e, t) {
    return e.__n === t || e.nodeName.toLowerCase() === t.toLowerCase();
  }function u(e) {
    var t = n({}, e.attributes);t.children = e.children;var o = e.nodeName.defaultProps;if (void 0 !== o) for (var r in o) {
      void 0 === t[r] && (t[r] = o[r]);
    }return t;
  }function _(e, t) {
    var n = t ? document.createElementNS("http://www.w3.org/2000/svg", e) : document.createElement(e);return n.__n = e, n;
  }function p(e) {
    var t = e.parentNode;t && t.removeChild(e);
  }function c(e, t, n, o, r) {
    if ("className" === t && (t = "class"), "key" === t) ;else if ("ref" === t) n && n(null), o && o(e);else if ("class" !== t || r) {
      if ("style" === t) {
        if (o && "string" != typeof o && "string" != typeof n || (e.style.cssText = o || ""), o && "object" == typeof o) {
          if ("string" != typeof n) for (var i in n) {
            i in o || (e.style[i] = "");
          }for (var i in o) {
            e.style[i] = "number" == typeof o[i] && !1 === V.test(i) ? o[i] + "px" : o[i];
          }
        }
      } else if ("dangerouslySetInnerHTML" === t) o && (e.innerHTML = o.__html || "");else if ("o" == t[0] && "n" == t[1]) {
        var l = t !== (t = t.replace(/Capture$/, ""));t = t.toLowerCase().substring(2), o ? n || e.addEventListener(t, f, l) : e.removeEventListener(t, f, l), (e.__l || (e.__l = {}))[t] = o;
      } else if ("list" !== t && "type" !== t && !r && t in e) s(e, t, null == o ? "" : o), null != o && !1 !== o || e.removeAttribute(t);else {
        var a = r && t !== (t = t.replace(/^xlink\:?/, ""));null == o || !1 === o ? a ? e.removeAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase()) : e.removeAttribute(t) : "function" != typeof o && (a ? e.setAttributeNS("http://www.w3.org/1999/xlink", t.toLowerCase(), o) : e.setAttribute(t, o));
      }
    } else e.className = o || "";
  }function s(e, t, n) {
    try {
      e[t] = n;
    } catch (e) {}
  }function f(e) {
    return this.__l[e.type](S.event && S.event(e) || e);
  }function d() {
    var e;while (e = D.pop()) {
      S.afterMount && S.afterMount(e), e.componentDidMount && e.componentDidMount();
    }
  }function h(e, t, n, o, r, i) {
    H++ || (R = null != r && void 0 !== r.ownerSVGElement, j = null != e && !("__preactattr_" in e));var l = m(e, t, n, o, i);return r && l.parentNode !== r && r.appendChild(l), --H || (j = !1, i || d()), l;
  }function m(e, t, n, o, r) {
    var i = e,
        l = R;if (null != t && "boolean" != typeof t || (t = ""), "string" == typeof t || "number" == typeof t) return e && void 0 !== e.splitText && e.parentNode && (!e._component || r) ? e.nodeValue != t && (e.nodeValue = t) : (i = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(i, e), b(e, !0))), i.__preactattr_ = !0, i;var u = t.nodeName;if ("function" == typeof u) return U(e, t, n, o);if (R = "svg" === u || "foreignObject" !== u && R, u += "", (!e || !a(e, u)) && (i = _(u, R), e)) {
      while (e.firstChild) {
        i.appendChild(e.firstChild);
      }e.parentNode && e.parentNode.replaceChild(i, e), b(e, !0);
    }var p = i.firstChild,
        c = i.__preactattr_,
        s = t.children;if (null == c) {
      c = i.__preactattr_ = {};for (var f = i.attributes, d = f.length; d--;) {
        c[f[d].name] = f[d].value;
      }
    }return !j && s && 1 === s.length && "string" == typeof s[0] && null != p && void 0 !== p.splitText && null == p.nextSibling ? p.nodeValue != s[0] && (p.nodeValue = s[0]) : (s && s.length || null != p) && v(i, s, n, o, j || null != c.dangerouslySetInnerHTML), g(i, t.attributes, c), R = l, i;
  }function v(e, t, n, o, r) {
    var i,
        a,
        u,
        _,
        c,
        s = e.childNodes,
        f = [],
        d = {},
        h = 0,
        v = 0,
        y = s.length,
        g = 0,
        w = t ? t.length : 0;if (0 !== y) for (var C = 0; C < y; C++) {
      var x = s[C],
          N = x.__preactattr_,
          k = w && N ? x._component ? x._component.__k : N.key : null;null != k ? (h++, d[k] = x) : (N || (void 0 !== x.splitText ? !r || x.nodeValue.trim() : r)) && (f[g++] = x);
    }if (0 !== w) for (var C = 0; C < w; C++) {
      _ = t[C], c = null;var k = _.key;if (null != k) h && void 0 !== d[k] && (c = d[k], d[k] = void 0, h--);else if (!c && v < g) for (i = v; i < g; i++) {
        if (void 0 !== f[i] && l(a = f[i], _, r)) {
          c = a, f[i] = void 0, i === g - 1 && g--, i === v && v++;break;
        }
      }c = m(c, _, n, o), u = s[C], c && c !== e && c !== u && (null == u ? e.appendChild(c) : c === u.nextSibling ? p(u) : e.insertBefore(c, u));
    }if (h) for (var C in d) {
      void 0 !== d[C] && b(d[C], !1);
    }while (v <= g) {
      void 0 !== (c = f[g--]) && b(c, !1);
    }
  }function b(e, t) {
    var n = e._component;n ? L(n) : (null != e.__preactattr_ && e.__preactattr_.ref && e.__preactattr_.ref(null), !1 !== t && null != e.__preactattr_ || p(e), y(e));
  }function y(e) {
    e = e.lastChild;while (e) {
      var t = e.previousSibling;b(e, !0), e = t;
    }
  }function g(e, t, n) {
    var o;for (o in n) {
      t && null != t[o] || null == n[o] || c(e, o, n[o], n[o] = void 0, R);
    }for (o in t) {
      "children" === o || "innerHTML" === o || o in n && t[o] === ("value" === o || "checked" === o ? e[o] : n[o]) || c(e, o, n[o], n[o] = t[o], R);
    }
  }function w(e) {
    var t = e.constructor.name;(I[t] || (I[t] = [])).push(e);
  }function C(e, t, n) {
    var o,
        r = I[e.name];if (e.prototype && e.prototype.render ? (o = new e(t, n), T.call(o, t, n)) : (o = new T(t, n), o.constructor = e, o.render = x), r) for (var i = r.length; i--;) {
      if (r[i].constructor === e) {
        o.__b = r[i].__b, r.splice(i, 1);break;
      }
    }return o;
  }function x(e, t, n) {
    return this.constructor(e, n);
  }function N(e, t, n, o, i) {
    e.__x || (e.__x = !0, (e.__r = t.ref) && delete t.ref, (e.__k = t.key) && delete t.key, !e.base || i ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, o), o && o !== e.context && (e.__c || (e.__c = e.context), e.context = o), e.__p || (e.__p = e.props), e.props = t, e.__x = !1, 0 !== n && (1 !== n && !1 === S.syncComponentUpdates && e.base ? r(e) : k(e, 1, i)), e.__r && e.__r(e));
  }function k(e, t, o, r) {
    if (!e.__x) {
      var i,
          l,
          a,
          _ = e.props,
          p = e.state,
          c = e.context,
          s = e.__p || _,
          f = e.__s || p,
          m = e.__c || c,
          v = e.base,
          y = e.__b,
          g = v || y,
          w = e._component,
          x = !1;if (v && (e.props = s, e.state = f, e.context = m, 2 !== t && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(_, p, c) ? x = !0 : e.componentWillUpdate && e.componentWillUpdate(_, p, c), e.props = _, e.state = p, e.context = c), e.__p = e.__s = e.__c = e.__b = null, e.__d = !1, !x) {
        i = e.render(_, p, c), e.getChildContext && (c = n(n({}, c), e.getChildContext()));var U,
            T,
            M = i && i.nodeName;if ("function" == typeof M) {
          var W = u(i);l = w, l && l.constructor === M && W.key == l.__k ? N(l, W, 1, c, !1) : (U = l, e._component = l = C(M, W, c), l.__b = l.__b || y, l.__u = e, N(l, W, 0, c, !1), k(l, 1, o, !0)), T = l.base;
        } else a = g, U = w, U && (a = e._component = null), (g || 1 === t) && (a && (a._component = null), T = h(a, i, c, o || !v, g && g.parentNode, !0));if (g && T !== g && l !== w) {
          var E = g.parentNode;E && T !== E && (E.replaceChild(T, g), U || (g._component = null, b(g, !1)));
        }if (U && L(U), e.base = T, T && !r) {
          var P = e,
              V = e;while (V = V.__u) {
            (P = V).base = T;
          }T._component = P, T._componentConstructor = P.constructor;
        }
      }if (!v || o ? D.unshift(e) : x || (e.componentDidUpdate && e.componentDidUpdate(s, f, m), S.afterUpdate && S.afterUpdate(e)), null != e.__h) while (e.__h.length) {
        e.__h.pop().call(e);
      }H || r || d();
    }
  }function U(e, t, n, o) {
    var r = e && e._component,
        i = r,
        l = e,
        a = r && e._componentConstructor === t.nodeName,
        _ = a,
        p = u(t);while (r && !_ && (r = r.__u)) {
      _ = r.constructor === t.nodeName;
    }return r && _ && (!o || r._component) ? (N(r, p, 3, n, o), e = r.base) : (i && !a && (L(i), e = l = null), r = C(t.nodeName, p, n), e && !r.__b && (r.__b = e, l = null), N(r, p, 1, n, o), e = r.base, l && e !== l && (l._component = null, b(l, !1))), e;
  }function L(e) {
    S.beforeUnmount && S.beforeUnmount(e);var t = e.base;e.__x = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null;var n = e._component;n ? L(n) : t && (t.__preactattr_ && t.__preactattr_.ref && t.__preactattr_.ref(null), e.__b = t, p(t), w(e), y(t)), e.__r && e.__r(null);
  }function T(e, t) {
    this.__d = !0, this.context = t, this.props = e, this.state = this.state || {};
  }function M(e, t, n) {
    return h(n, e, {}, !1, t, !1);
  }var S = {},
      W = [],
      E = [],
      P = "function" == typeof Promise ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout,
      V = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
      A = [],
      D = [],
      H = 0,
      R = !1,
      j = !1,
      I = {};n(T.prototype, { setState: function setState(e, t) {
      var o = this.state;this.__s || (this.__s = n({}, o)), n(o, "function" == typeof e ? e(o, this.props) : e), t && (this.__h = this.__h || []).push(t), r(this);
    }, forceUpdate: function forceUpdate(e) {
      e && (this.__h = this.__h || []).push(e), k(this, 2);
    }, render: function render() {} });var $ = { h: t, createElement: t, cloneElement: o, Component: T, render: M, rerender: i, options: S }; true ? module.exports = $ : self.preact = $;
}();
//# sourceMappingURL=preact.min.js.map

/***/ }),

/***/ "FWi5":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "GKGO":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var firebase = __webpack_require__("SHXD").default;
__webpack_require__("YtIj");
__webpack_require__("/f1z");
__webpack_require__("DFDv");

var Storage = __webpack_require__("gBMY");
var XMLHttpRequest = __webpack_require__("l1Vk").XMLHttpRequest;

firebase.INTERNAL.extendNamespace({
  INTERNAL: {
    node: {
      localStorage: new Storage(null, { strict: true }),
      sessionStorage: new Storage(null, { strict: true }),
      XMLHttpRequest: XMLHttpRequest
    }
  }
});

module.exports = firebase;

/***/ }),

/***/ "JkW7":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/preact/dist/preact.min.js
var preact_min = __webpack_require__("EBst");
var preact_min_default = /*#__PURE__*/__webpack_require__.n(preact_min);

// EXTERNAL MODULE: ./style.css
var style_0 = __webpack_require__("FWi5");
var style_default = /*#__PURE__*/__webpack_require__.n(style_0);

// CONCATENATED MODULE: ./cmpts/Board.jsx


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var styles = {
	table: {
		margin: '0 auto',
		minWidth: 261
	},
	snake: {
		background: 'green'
	},
	apple: {
		background: 'red'
	}
};

var Board_Board = function (_Component) {
	_inherits(Board, _Component);

	function Board(props) {
		_classCallCheck(this, Board);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_this.state = {};
		return _this;
	}

	Board.prototype.renderRows = function renderRows(r, c, points, apple) {
		var rows = [];

		var _loop = function _loop(rowIdx) {
			var row = [];

			var _loop2 = function _loop2(colIdx) {
				var pointExistsInSnake = points.some(function (p) {
					return p.x === colIdx && p.y === rowIdx;
				}); // O(n3) :/ 
				var appleStyles = apple.x === colIdx && apple.y === rowIdx ? styles.apple : {};

				row.push(Object(preact_min["h"])('td', { key: colIdx, style: pointExistsInSnake ? styles.snake : appleStyles }));
			};

			for (var colIdx = 0; colIdx < c; colIdx++) {
				_loop2(colIdx);
			}

			rows.push(Object(preact_min["h"])(
				'tr',
				{ key: rowIdx },
				row
			));
		};

		for (var rowIdx = 0; rowIdx < r; rowIdx++) {
			_loop(rowIdx);
		}

		return rows;
	};

	Board.prototype.render = function render() {
		var _props = this.props,
		    rows = _props.rows,
		    cols = _props.cols,
		    snake = _props.snake,
		    apple = _props.apple;


		return Object(preact_min["h"])(
			'table',
			{ style: styles.table },
			Object(preact_min["h"])(
				'tbody',
				null,
				this.renderRows(rows, cols, snake.points, apple)
			)
		);
	};

	return Board;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./models/Point.js
function Point__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function Point(x, y) {
	Point__classCallCheck(this, Point);

	this.x = x;
	this.y = y;
};


// CONCATENATED MODULE: ./models/Snake.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function Snake__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Snake_Snake = function () {
	function Snake(points) {
		Snake__classCallCheck(this, Snake);

		this.points = points;
	}

	Snake.prototype.moveSnake = function moveSnake(_ref, apple) {
		var x = _ref.x,
		    y = _ref.y;

		// We can delete the last dot and add the new one at the start.
		this.points.splice(-1, 1);
		this.points.unshift(new Point(this.points[0].x + x, this.points[0].y + y));

		var snakeHead = this.points[0];

		if (snakeHead.x === apple.x && snakeHead.y === apple.y) {
			return true;
		}

		return false;
	};

	Snake.prototype.grow = function grow() {
		var lastEl = _extends({}, this.points[this.points.length - 1]);

		this.points.push(lastEl);
	};

	Snake.prototype.isMoveInBorders = function isMoveInBorders(nextDirection, rows, cols) {
		var snakeHead = this.points[0];

		if (snakeHead.x + nextDirection.x >= cols || snakeHead.x + nextDirection.x < 0 || snakeHead.y + nextDirection.y >= rows || snakeHead.y + nextDirection.y < 0) {
			return false;
		}
		return true;
	};

	Snake.prototype.checkIfCrashingInSelf = function checkIfCrashingInSelf(nextDirection) {
		var isCrashing = false;
		var snakeHead = this.points[0];

		for (var i = 0; i < this.points.length; i++) {
			var currPoint = this.points[i];
			if (snakeHead.x + nextDirection.x === currPoint.x && snakeHead.y + nextDirection.y === currPoint.y) {
				isCrashing = true;
				break;
			}
		}

		return isCrashing;
	};

	return Snake;
}();


// EXTERNAL MODULE: ./node_modules/firebase/index.node.js
var index_node = __webpack_require__("GKGO");
var index_node_default = /*#__PURE__*/__webpack_require__.n(index_node);

// CONCATENATED MODULE: ./firebaseSetup.js


// do not use this to do any harm... :(
var config = {
	apiKey: "AIzaSyA6K9x7ji3pTmYR6sReIzSm8gkr_3lbZUs",
	authDomain: "snake-cv.firebaseapp.com",
	databaseURL: "https://snake-cv.firebaseio.com",
	projectId: "snake-cv",
	storageBucket: "",
	messagingSenderId: "367448488328"
};
index_node_default.a.initializeApp(config);

/* harmony default export */ var firebaseSetup = (index_node_default.a);
// CONCATENATED MODULE: ./cmpts/Highscores.jsx


function Highscores__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Highscores__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Highscores__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Highscores_Highscores = function (_Component) {
  Highscores__inherits(Highscores, _Component);

  function Highscores(props) {
    Highscores__classCallCheck(this, Highscores);

    var _this = Highscores__possibleConstructorReturn(this, _Component.call(this, props));

    _this.renderHighscores = function (highScores) {
      var lis = [];

      for (var i = 0; i < highScores.length; i++) {
        lis.push(Object(preact_min["h"])(
          'li',
          { key: i },
          highScores[i].name,
          ' - ',
          highScores[i].score
        ));
      }

      return lis;
    };

    _this.state = {};
    return _this;
  }

  Highscores.prototype.render = function render() {
    var highScores = this.props.highScores;

    return Object(preact_min["h"])(
      'div',
      null,
      Object(preact_min["h"])(
        'ol',
        null,
        this.renderHighscores(highScores)
      )
    );
  };

  return Highscores;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./cmpts/HighscoreForm.jsx


function HighscoreForm__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function HighscoreForm__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function HighscoreForm__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var HighscoreForm__ref = Object(preact_min["h"])(
  'span',
  null,
  'Game over!'
);

var _ref2 = Object(preact_min["h"])('br', null);

var _ref3 = Object(preact_min["h"])(
  'span',
  null,
  'Enter your name:'
);

var _ref4 = Object(preact_min["h"])('br', null);

var HighscoreForm_HighscoreForm = function (_Component) {
  HighscoreForm__inherits(HighscoreForm, _Component);

  function HighscoreForm(props) {
    HighscoreForm__classCallCheck(this, HighscoreForm);

    var _this = HighscoreForm__possibleConstructorReturn(this, _Component.call(this, props));

    _this.onSave = function () {
      if (!_this.state.name) return;
      _this.props.saveHighscore(_this.state.name);
      _this.setState({ name: '' });
    };

    _this.state = {
      name: ''
    };
    return _this;
  }

  HighscoreForm.prototype.render = function render() {
    var _this2 = this;

    return Object(preact_min["h"])(
      'div',
      null,
      HighscoreForm__ref,
      _ref2,
      _ref3,
      _ref4,
      Object(preact_min["h"])('input', { type: 'text', onInput: function onInput(e) {
          return _this2.setState({ name: e.target.value });
        }, value: this.state.name }),
      Object(preact_min["h"])(
        'button',
        { onClick: this.onSave },
        'Save'
      )
    );
  };

  return HighscoreForm;
}(preact_min["Component"]);


// EXTERNAL MODULE: ./valeri-hristov-career-data.json
var valeri_hristov_career_data = __webpack_require__("Mug4");
var valeri_hristov_career_data_default = /*#__PURE__*/__webpack_require__.n(valeri_hristov_career_data);

// CONCATENATED MODULE: ./cmpts/Summary.jsx


function Summary__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Summary__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function Summary__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var Summary__ref = Object(preact_min["h"])(
  'div',
  { className: 'col-3' },
  Object(preact_min["h"])('img', { src: './assets/me.jpg', className: 'img-fluid img-thumbnail my-pic' })
);

var Summary__ref2 = Object(preact_min["h"])(
  'h4',
  null,
  'About me'
);

var Summary__ref3 = Object(preact_min["h"])(
  'h4',
  null,
  'Other interests'
);

var Summary__ref4 = Object(preact_min["h"])(
  'h4',
  null,
  'Knowledge areas'
);

var _ref5 = Object(preact_min["h"])(
  'h4',
  null,
  'Technologies'
);

var _ref6 = Object(preact_min["h"])(
  'h4',
  null,
  'Frameworks used'
);

var _ref7 = Object(preact_min["h"])(
  'h4',
  null,
  'Development environments'
);

var _ref8 = Object(preact_min["h"])(
  'h4',
  null,
  'Education'
);

var _ref9 = Object(preact_min["h"])(
  'h4',
  null,
  'Work Experience'
);

var _ref10 = Object(preact_min["h"])(
  'p',
  { 'class': 'lead mt-5 text-center pb-5' },
  'Thank you for reviewing my work, if you would like to work together, please contact me! :)'
);

var Summary_Summary = function (_Component) {
  Summary__inherits(Summary, _Component);

  function Summary(props) {
    Summary__classCallCheck(this, Summary);

    return Summary__possibleConstructorReturn(this, _Component.call(this, props));
  }

  Summary.prototype.render = function render() {
    return Object(preact_min["h"])(
      'div',
      { className: 'container pb-5' },
      Object(preact_min["h"])(
        'div',
        { className: 'row p-4' },
        Summary__ref,
        Object(preact_min["h"])(
          'div',
          { className: 'col-9' },
          Object(preact_min["h"])(
            'ul',
            { 'class': 'list-group' },
            Object(preact_min["h"])(
              'li',
              { 'class': 'list-group-item' },
              valeri_hristov_career_data_default.a.name
            ),
            Object(preact_min["h"])(
              'li',
              { 'class': 'list-group-item' },
              valeri_hristov_career_data_default.a.position
            ),
            Object(preact_min["h"])(
              'li',
              { 'class': 'list-group-item' },
              valeri_hristov_career_data_default.a.email
            ),
            Object(preact_min["h"])(
              'li',
              { 'class': 'list-group-item' },
              valeri_hristov_career_data_default.a.phone
            ),
            Object(preact_min["h"])(
              'li',
              { 'class': 'list-group-item' },
              valeri_hristov_career_data_default.a.location
            )
          )
        )
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-3' },
        Summary__ref2,
        Object(preact_min["h"])(
          'p',
          { 'class': 'lead' },
          valeri_hristov_career_data_default.a.summary
        )
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-3' },
        Summary__ref3,
        Object(preact_min["h"])(
          'p',
          { 'class': 'lead' },
          valeri_hristov_career_data_default.a.aboutMyPersonality
        )
      ),
      Object(preact_min["h"])(
        'div',
        null,
        Summary__ref4,
        valeri_hristov_career_data_default.a.knowledgeAreas.sort(function (a, b) {
          return b.level - a.level;
        }).map(function (ka) {
          var style = 'width: ' + ka.level / 10 * 100 + '%';
          return Object(preact_min["h"])(
            'div',
            { className: 'mb-2' },
            Object(preact_min["h"])(
              'h6',
              null,
              ka.name
            ),
            Object(preact_min["h"])(
              'div',
              { 'class': 'progress' },
              Object(preact_min["h"])('div', { 'class': 'progress-bar', role: 'progressbar', 'aria-valuenow': '5', style: style, 'aria-valuemin': '0', 'aria-valuemax': '10' })
            )
          );
        })
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-5' },
        _ref5,
        valeri_hristov_career_data_default.a.technologies.sort(function (a, b) {
          return b.level - a.level;
        }).map(function (ka) {
          var style = 'width: ' + ka.level / 10 * 100 + '%';
          return Object(preact_min["h"])(
            'div',
            { className: 'mb-2' },
            Object(preact_min["h"])(
              'h6',
              null,
              ka.name
            ),
            Object(preact_min["h"])(
              'div',
              { 'class': 'progress' },
              Object(preact_min["h"])('div', { 'class': 'progress-bar', role: 'progressbar', 'aria-valuenow': '5', style: style, 'aria-valuemin': '0', 'aria-valuemax': '10' })
            )
          );
        })
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-5' },
        _ref6,
        Object(preact_min["h"])(
          'ul',
          null,
          valeri_hristov_career_data_default.a.usedFrameworks.map(function (f, i) {
            return Object(preact_min["h"])(
              'li',
              { key: i },
              f
            );
          })
        )
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-5' },
        _ref7,
        Object(preact_min["h"])(
          'ul',
          null,
          valeri_hristov_career_data_default.a.devEnvironments.map(function (f, i) {
            return Object(preact_min["h"])(
              'li',
              { key: i },
              f
            );
          })
        )
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-5' },
        _ref8,
        Object(preact_min["h"])(
          'div',
          { className: 'row' },
          valeri_hristov_career_data_default.a.education.map(function (e) {
            return Object(preact_min["h"])(
              'div',
              { className: 'card col-3 mr-3' },
              Object(preact_min["h"])('img', { 'class': 'card-img-top', src: e.img, alt: 'Card image cap' }),
              Object(preact_min["h"])(
                'div',
                { 'class': 'card-body' },
                Object(preact_min["h"])(
                  'h5',
                  { 'class': 'card-title' },
                  e.name
                ),
                Object(preact_min["h"])(
                  'p',
                  { 'class': 'card-text' },
                  e.duration
                )
              )
            );
          })
        )
      ),
      Object(preact_min["h"])(
        'div',
        { className: 'mt-5' },
        _ref9,
        Object(preact_min["h"])(
          'div',
          { className: 'row' },
          valeri_hristov_career_data_default.a.workExperience.map(function (w) {
            return Object(preact_min["h"])(
              'div',
              { className: 'card col-8 mb-3' },
              Object(preact_min["h"])(
                'div',
                { 'class': 'card-body' },
                Object(preact_min["h"])(
                  'h5',
                  { 'class': 'card-title' },
                  Object(preact_min["h"])(
                    'strong',
                    null,
                    w.position
                  )
                ),
                Object(preact_min["h"])(
                  'p',
                  { 'class': 'card-text' },
                  w.duration
                ),
                Object(preact_min["h"])(
                  'p',
                  { 'class': 'card-text' },
                  Object(preact_min["h"])(
                    'strong',
                    null,
                    w.company
                  )
                ),
                Object(preact_min["h"])(
                  'p',
                  { 'class': 'card-text' },
                  w.summary
                ),
                Object(preact_min["h"])(
                  'ul',
                  null,
                  w.technologies.map(function (t) {
                    return Object(preact_min["h"])(
                      'li',
                      null,
                      t
                    );
                  })
                )
              )
            );
          })
        )
      ),
      _ref10
    );
  };

  return Summary;
}(preact_min["Component"]);


// CONCATENATED MODULE: ./index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return index_App; });
var index__extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



function index__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function index__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function index__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }











var index_rows = 30;
var index_cols = 20;
var defaultSnakeElements = [new Point(12, 10), new Point(11, 10), new Point(10, 10)];
var getRandomInt = function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
var index_int = void 0;

var index__ref2 = Object(preact_min["h"])(
	'h1',
	{ className: 'text-center mb-5' },
	'Snake'
);

var index__ref3 = Object(preact_min["h"])(
	'strong',
	{ className: 'label' },
	'Score:'
);

var index__ref4 = Object(preact_min["h"])(
	'strong',
	{ className: 'label' },
	'Lives:'
);

var index__ref5 = Object(preact_min["h"])(
	'div',
	{ 'class': 'float-right' },
	Object(preact_min["h"])(
		'a',
		{ href: 'https://github.com/Vallerious', target: '_blank' },
		Object(preact_min["h"])('div', { className: 'snake-link-icon git mr-3' })
	),
	Object(preact_min["h"])(
		'a',
		{ href: 'https://www.linkedin.com/in/valeri-hristov-57988311a/', target: '_blank' },
		Object(preact_min["h"])('div', { className: 'snake-link-icon in' })
	)
);

var index__ref6 = Object(preact_min["h"])('div', { className: 'clearfix mb-4' });

var index__ref7 = Object(preact_min["h"])(
	'div',
	null,
	Object(preact_min["h"])(
		'em',
		null,
		'*Press enter to start/pause game.'
	)
);

var index__ref8 = Object(preact_min["h"])(
	'div',
	{ className: 'mb-3' },
	Object(preact_min["h"])(
		'em',
		null,
		'*Press space to exchange 1000 points for 1 life.'
	)
);

var index__ref9 = Object(preact_min["h"])(Summary_Summary, null);

var index_App = function (_Component) {
	index__inherits(App, _Component);

	function App(props) {
		index__classCallCheck(this, App);

		var _this = index__possibleConstructorReturn(this, _Component.call(this, props));

		_this.componentWillMount = function () {
			// Initialize the starting point of the snake
			_this.setState({ snake: new Snake_Snake(index__extends([], defaultSnakeElements)) });
			_this.setState({ apple: _this.generateApple(_this.state.snake) });
		};

		_this.componentDidMount = function () {
			_this.attachKeyboardListeners();
			_this.getHighScores();
		};

		_this.componentWillUnmount = function () {
			window.document.removeEventListener('keydown', _this.onKeyPress);
		};

		_this.getHighScores = function () {
			firebaseSetup.database().ref('/').once('value').then(function (snapshop) {
				var hiscores = snapshop.val();
				var bestScoresArray = Object.keys(hiscores).map(function (k) {
					return { name: k, score: hiscores[k] };
				});
				bestScoresArray.sort(function (a, v) {
					return v.score - a.score;
				});
				_this.setState({ highScores: bestScoresArray.slice(0, 10) });
			});
		};

		_this.onKeyPress = function (_ref) {
			var keyCode = _ref.keyCode;
			var _this$state = _this.state,
			    score = _this$state.score,
			    status = _this$state.status,
			    lives = _this$state.lives,
			    direction = _this$state.direction;


			if (keyCode === 32 && score >= 1000) {
				_this.setState({ score: score - 1000, lives: lives + 1 });
				return;
			}

			if (keyCode === 13) {
				if (status === 'pause') {
					_this.setState({ gameOver: false });
					_this.initializeMovement();
				} else {
					clearInterval(index_int);
				}

				_this.setState({ status: status === 'start' ? 'pause' : 'start' });
				return;
			}

			var dir = direction;
			var keyMap = {
				37: 4,
				38: 3,
				39: 2,
				40: 1
			};

			if (keyMap[keyCode] === 1 && dir === 3 || keyMap[keyCode] === 3 && dir === 1 || keyMap[keyCode] === 2 && dir === 4 || keyMap[keyCode] === 4 && dir === 2) {
				return;
			}

			_this.setState({ direction: keyMap[keyCode] || dir });
		};

		_this.initializeMovement = function () {
			var movement = {
				1: { x: 0, y: 1 },
				2: { x: 1, y: 0 },
				3: { x: 0, y: -1 },
				4: { x: -1, y: 0 }
			};

			index_int = setInterval(function () {
				var _this$state2 = _this.state,
				    direction = _this$state2.direction,
				    snake = _this$state2.snake,
				    score = _this$state2.score,
				    lives = _this$state2.lives,
				    apple = _this$state2.apple;

				var currentDirection = movement[direction];

				// Limit the movement of the snake to the walls of the board. Later we will kill the snake if it hits a wall.
				if (!snake.isMoveInBorders(currentDirection, index_rows, index_cols) || snake.checkIfCrashingInSelf(currentDirection)) {
					var currentLifePoints = lives - 1;

					if (currentLifePoints <= 0) {
						_this.setState({ lastHighScore: score, status: 'pause', lives: 3, gameOver: true, score: 0, snake: new Snake_Snake(index__extends([], defaultSnakeElements)) });
						clearInterval(index_int);
					} else {
						_this.setState({ lives: currentLifePoints, snake: new Snake_Snake(index__extends([], defaultSnakeElements)), direction: 1 });
					}
					return;
				}

				// change the coordinates of the snake so it moves
				var hasCauthApple = snake.moveSnake(currentDirection, apple);

				if (hasCauthApple) {
					snake.grow();
					_this.setState({ score: score + 100, apple: _this.generateApple(snake) });
				}

				_this.setState({ snake: snake });
			}, _this.state.speed);
		};

		_this.saveHighscore = function (name) {
			// lets send it to backend
			var updates = {};

			updates[name] = _this.state.lastHighScore;
			firebaseSetup.database().ref().update(updates).then(function () {
				_this.getHighScores();
			});

			_this.setState({ lastHighScore: 0, gameOver: false });
		};

		_this.togglePage = function (e) {
			e.preventDefault();

			_this.setState({ currentPage: _this.state.currentPage === 'snake' ? 'cv' : 'snake' });
		};

		_this.state = {
			score: 0,
			snake: null,
			direction: 1, // 1: up, 2: right, 3: down, 4: left,
			lives: 3,
			apple: null,
			speed: 150,
			status: 'pause', // start or pause,
			highScores: [],
			gameOver: false,
			name: '',
			lastHighScore: 0,
			currentPage: 'snake'
		};
		return _this;
	}

	App.prototype.generateApple = function generateApple(snake) {
		var points = snake.points;


		var randomX = void 0,
		    randomY = void 0;

		while (true) {
			randomX = getRandomInt(0, index_cols - 1);
			randomY = getRandomInt(0, index_rows - 1);
			var doesExists = false;

			for (var i = 0; i < points.length; i++) {
				var currentPoint = points[i];

				if (currentPoint.x === randomX && currentPoint.y === randomY) {
					doesExists = true;
					break;
				}
			}

			if (!doesExists) {
				break;
			}
		}

		return new Point(randomX, randomY);
	};

	App.prototype.attachKeyboardListeners = function attachKeyboardListeners() {
		window.document.addEventListener('keydown', this.onKeyPress);
	};

	App.prototype.render = function render() {
		var _state = this.state,
		    snake = _state.snake,
		    apple = _state.apple,
		    status = _state.status,
		    highScores = _state.highScores,
		    gameOver = _state.gameOver,
		    currentPage = _state.currentPage;


		return Object(preact_min["h"])(
			'div',
			null,
			Object(preact_min["h"])(
				'header',
				null,
				Object(preact_min["h"])(
					'a',
					{ href: '#', onClick: this.togglePage },
					currentPage === 'snake' ? 'About Me' : 'Snake Game'
				)
			),
			currentPage === 'snake' ? Object(preact_min["h"])(
				'div',
				null,
				index__ref2,
				Object(preact_min["h"])(
					'div',
					{ className: 'row mr-0 ml-0' },
					Object(preact_min["h"])(
						'div',
						{ className: 'col-4 p-10 text-right' },
						Object(preact_min["h"])(
							'div',
							null,
							index__ref3,
							' ',
							this.state.score
						),
						Object(preact_min["h"])(
							'div',
							null,
							index__ref4,
							' ',
							this.state.lives
						)
					),
					Object(preact_min["h"])(
						'div',
						{ className: 'col-4' },
						Object(preact_min["h"])(
							'div',
							null,
							Object(preact_min["h"])(Board_Board, { rows: index_rows, cols: index_cols, snake: snake, apple: apple })
						)
					),
					Object(preact_min["h"])(
						'div',
						{ className: 'col-3' },
						index__ref5,
						index__ref6,
						index__ref7,
						index__ref8,
						Object(preact_min["h"])(Highscores_Highscores, { highScores: highScores }),
						gameOver ? Object(preact_min["h"])(HighscoreForm_HighscoreForm, { saveHighscore: this.saveHighscore }) : null
					)
				)
			) : index__ref9
		);
	};

	return App;
}(preact_min["Component"]);



/***/ }),

/***/ "Mug4":
/***/ (function(module, exports) {

module.exports = {"name":"Valeri Hristov","location":"Sofia, Bulgaria","phone":"+359878115789","email":"valericfbg@gmail.com","picture":"","position":"Software Developer","knowledgeAreas":[{"name":"Web Development","level":8},{"name":"Algorithms & Data Structures","level":6},{"name":"Databases","level":7},{"name":"OOP","level":6}],"technologies":[{"name":"Javascript/NodeJS","level":8},{"name":"MongoDB","level":7},{"name":"PostgreSQL","level":6},{"name":"Java","level":6,"status":"learning at the moment..."},{"name":"Bash scripting","level":3}],"usedFrameworks":["ReactJS","Angular","node-organic","Preact","AngularJS","AdonisJS","Lodash","Bootstrap","Mocha","Jasmine","RxJS"],"devEnvironments":["Linux","Windows","MacOS"],"education":[{"name":"Bachelors degree in Economics","duration":"2009 - 2013","img":"assets/vins.jpg"},{"name":"Software University","duration":"6 months until I got a job","img":"assets/softuni-2.0.jpg"},{"name":"Self taught + online/onsite courses occasionally","duration":"2013 - end of life","img":"assets/me.jpg"}],"workExperience":[{"company":"SoftServe","duration":"2016 - until now","position":"Frontend Developer","summary":"Currently I am working on a big healthcare project that will be started from scratch. My job is to create reusable components that will be used across angular modules and to setup the initial architecture of the frontend, choose UI libraries. My previous project at the company was on the frontend for a client which specializes in security analitycs. My job was to create reusable components and I was really proud of my work because my components were used by other developers and I was given credit for that.","technologies":["ReactJS","AngularJS","Angular","Bootstrap"]},{"company":"Camplight","duration":"2017-2018","position":"Fullstack developer (remote)","summary":"Camplight is an organization with flat structure (bossless). We had a guy that finds the clients, but all other management/development, even sometimes, design work was done by any one of us. I was communicating directly with the client, organizing the sprints and developing the backend and frontend. It was a great experience - I loved the 'no bullshit' flow of work, things were happening faster and the way I wanted them. I learned to use TDD and to thoroughly test my UI before I commit. It was fun working on the remote server via ssh and interact directly with the DB. I worked both in SoftServe and in Camplight for some period of time, then I went 3 months fulltime at Camplight. I worked on two apps here, Volontime - a social network for people doing charity and social work, and Mama-App - mobile application for pregnant women.","technologies":["NodeJS","Angular","ReactNative","PostgreSQL","MongoDB","Nginx","Mocha","Bootstrap"],"projects":["Volontime","Mama App"]},{"company":"Software Group","duration":"2014-2016","position":"Fullstack Developer","summary":"Started here as an intern and quickly started taking on more responsibilities. I liked that my senior colleagues were exposing me to databases, backend and frontend problems and I got an idea how the whole thing glues together. We were developing banking solutions for third world countries.","technologies":["NodeJS","SQL Server","AngularJS","Bootstrap"]}],"summary":"Well..I am an enthusiastic fellow, driven by my goals and curiosity. Programming is something that I can do every day, without feeling daunted. I do get burnt-out from time to time, but that is normal :). I enjoy the complex problems and focusing on the details in the code, in the architecture and performance. My desire to learn it all has pushed me to expore different technologies and dimensions of programming. Currently I am learning Java in my spare time, focusing on OOP and Algorithms and Data Structures. I still have a lot of work ahead and I regularly attend online coding competitions also enrolled in an Algorithms course and I can see that my understanding and skills are moving forward. I feel that I have a firm grasp (not an expert) on the frontend technologies and that it is time to expand my horisons.","aboutMyPersonality":"Besides that I have a few hobbies which are on the sideline from quite some time because I am focusing on programming. I do running or strength training at least 3 times a week, I play guitar and I read books, mostly fiction."}

/***/ }),

/***/ "SHXD":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "firebase", function() { return firebase; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__firebase_util__ = __webpack_require__("xaOn");


/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var contains = function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
var DEFAULT_ENTRY_NAME = '[DEFAULT]';
// An array to capture listeners before the true auth functions
// exist
var tokenListeners = [];
/**
 * Global context object for a collection of services using
 * a shared authentication state.
 */
var FirebaseAppImpl = /** @class */function () {
    function FirebaseAppImpl(options, config, firebase_) {
        this.firebase_ = firebase_;
        this.isDeleted_ = false;
        this.services_ = {};
        this.name_ = config.name;
        this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled || false;
        this.options_ = Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["l" /* deepCopy */])(options);
        this.INTERNAL = {
            getUid: function getUid() {
                return null;
            },
            getToken: function getToken() {
                return Promise.resolve(null);
            },
            addAuthTokenListener: function addAuthTokenListener(callback) {
                tokenListeners.push(callback);
                // Make sure callback is called, asynchronously, in the absence of the auth module
                setTimeout(function () {
                    return callback(null);
                }, 0);
            },
            removeAuthTokenListener: function removeAuthTokenListener(callback) {
                tokenListeners = tokenListeners.filter(function (listener) {
                    return listener !== callback;
                });
            }
        };
    }
    Object.defineProperty(FirebaseAppImpl.prototype, "automaticDataCollectionEnabled", {
        get: function get() {
            this.checkDestroyed_();
            return this._automaticDataCollectionEnabled;
        },
        set: function set(val) {
            this.checkDestroyed_();
            this._automaticDataCollectionEnabled = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseAppImpl.prototype, "name", {
        get: function get() {
            this.checkDestroyed_();
            return this.name_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseAppImpl.prototype, "options", {
        get: function get() {
            this.checkDestroyed_();
            return this.options_;
        },
        enumerable: true,
        configurable: true
    });
    FirebaseAppImpl.prototype.delete = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.checkDestroyed_();
            resolve();
        }).then(function () {
            _this.firebase_.INTERNAL.removeApp(_this.name_);
            var services = [];
            Object.keys(_this.services_).forEach(function (serviceKey) {
                Object.keys(_this.services_[serviceKey]).forEach(function (instanceKey) {
                    services.push(_this.services_[serviceKey][instanceKey]);
                });
            });
            return Promise.all(services.map(function (service) {
                return service.INTERNAL.delete();
            }));
        }).then(function () {
            _this.isDeleted_ = true;
            _this.services_ = {};
        });
    };
    /**
     * Return a service instance associated with this app (creating it
     * on demand), identified by the passed instanceIdentifier.
     *
     * NOTE: Currently storage is the only one that is leveraging this
     * functionality. They invoke it by calling:
     *
     * ```javascript
     * firebase.app().storage('STORAGE BUCKET ID')
     * ```
     *
     * The service name is passed to this already
     * @internal
     */
    FirebaseAppImpl.prototype._getService = function (name, instanceIdentifier) {
        if (instanceIdentifier === void 0) {
            instanceIdentifier = DEFAULT_ENTRY_NAME;
        }
        this.checkDestroyed_();
        if (!this.services_[name]) {
            this.services_[name] = {};
        }
        if (!this.services_[name][instanceIdentifier]) {
            /**
             * If a custom instance has been defined (i.e. not '[DEFAULT]')
             * then we will pass that instance on, otherwise we pass `null`
             */
            var instanceSpecifier = instanceIdentifier !== DEFAULT_ENTRY_NAME ? instanceIdentifier : undefined;
            var service = this.firebase_.INTERNAL.factories[name](this, this.extendApp.bind(this), instanceSpecifier);
            this.services_[name][instanceIdentifier] = service;
        }
        return this.services_[name][instanceIdentifier];
    };
    /**
     * Callback function used to extend an App instance at the time
     * of service instance creation.
     */
    FirebaseAppImpl.prototype.extendApp = function (props) {
        var _this = this;
        // Copy the object onto the FirebaseAppImpl prototype
        Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["m" /* deepExtend */])(this, props);
        /**
         * If the app has overwritten the addAuthTokenListener stub, forward
         * the active token listeners on to the true fxn.
         *
         * TODO: This function is required due to our current module
         * structure. Once we are able to rely strictly upon a single module
         * implementation, this code should be refactored and Auth should
         * provide these stubs and the upgrade logic
         */
        if (props.INTERNAL && props.INTERNAL.addAuthTokenListener) {
            tokenListeners.forEach(function (listener) {
                _this.INTERNAL.addAuthTokenListener(listener);
            });
            tokenListeners = [];
        }
    };
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    FirebaseAppImpl.prototype.checkDestroyed_ = function () {
        if (this.isDeleted_) {
            error('app-deleted', { name: this.name_ });
        }
    };
    return FirebaseAppImpl;
}();
// Prevent dead-code elimination of these methods w/o invalid property
// copying.
FirebaseAppImpl.prototype.name && FirebaseAppImpl.prototype.options || FirebaseAppImpl.prototype.delete || console.log('dc');
/**
 * Return a firebase namespace object.
 *
 * In production, this will be called exactly once and the result
 * assigned to the 'firebase' global.  It may be called multiple times
 * in unit tests.
 */
function createFirebaseNamespace() {
    var apps_ = {};
    var factories = {};
    var appHooks = {};
    // A namespace is a plain JavaScript Object.
    var namespace = {
        // Hack to prevent Babel from modifying the object returned
        // as the firebase namespace.
        __esModule: true,
        initializeApp: initializeApp,
        app: app,
        apps: null,
        Promise: Promise,
        SDK_VERSION: '4.13.0',
        INTERNAL: {
            registerService: registerService,
            createFirebaseNamespace: createFirebaseNamespace,
            extendNamespace: extendNamespace,
            createSubscribe: __WEBPACK_IMPORTED_MODULE_0__firebase_util__["k" /* createSubscribe */],
            ErrorFactory: __WEBPACK_IMPORTED_MODULE_0__firebase_util__["c" /* ErrorFactory */],
            removeApp: removeApp,
            factories: factories,
            useAsService: useAsService,
            Promise: Promise,
            deepExtend: __WEBPACK_IMPORTED_MODULE_0__firebase_util__["m" /* deepExtend */]
        }
    };
    // Inject a circular default export to allow Babel users who were previously
    // using:
    //
    //   import firebase from 'firebase';
    //   which becomes: var firebase = require('firebase').default;
    //
    // instead of
    //
    //   import * as firebase from 'firebase';
    //   which becomes: var firebase = require('firebase');
    Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["D" /* patchProperty */])(namespace, 'default', namespace);
    // firebase.apps is a read-only getter.
    Object.defineProperty(namespace, 'apps', {
        get: getApps
    });
    /**
     * Called by App.delete() - but before any services associated with the App
     * are deleted.
     */
    function removeApp(name) {
        var app = apps_[name];
        callAppHooks(app, 'delete');
        delete apps_[name];
    }
    /**
     * Get the App object for a given name (or DEFAULT).
     */
    function app(name) {
        name = name || DEFAULT_ENTRY_NAME;
        if (!contains(apps_, name)) {
            error('no-app', { name: name });
        }
        return apps_[name];
    }
    Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["D" /* patchProperty */])(app, 'App', FirebaseAppImpl);
    function initializeApp(options, rawConfig) {
        if (rawConfig === void 0) {
            rawConfig = {};
        }
        if (typeof rawConfig !== 'object' || rawConfig === null) {
            var name_1 = rawConfig;
            rawConfig = { name: name_1 };
        }
        var config = rawConfig;
        if (config.name === undefined) {
            config.name = DEFAULT_ENTRY_NAME;
        }
        var name = config.name;
        if (typeof name !== 'string' || !name) {
            error('bad-app-name', { name: name + '' });
        }
        if (contains(apps_, name)) {
            error('duplicate-app', { name: name });
        }
        var app = new FirebaseAppImpl(options, config, namespace);
        apps_[name] = app;
        callAppHooks(app, 'create');
        return app;
    }
    /*
     * Return an array of all the non-deleted FirebaseApps.
     */
    function getApps() {
        // Make a copy so caller cannot mutate the apps list.
        return Object.keys(apps_).map(function (name) {
            return apps_[name];
        });
    }
    /*
     * Register a Firebase Service.
     *
     * firebase.INTERNAL.registerService()
     *
     * TODO: Implement serviceProperties.
     */
    function registerService(name, createService, serviceProperties, appHook, allowMultipleInstances) {
        // Cannot re-register a service that already exists
        if (factories[name]) {
            error('duplicate-service', { name: name });
        }
        // Capture the service factory for later service instantiation
        factories[name] = createService;
        // Capture the appHook, if passed
        if (appHook) {
            appHooks[name] = appHook;
            // Run the **new** app hook on all existing apps
            getApps().forEach(function (app) {
                appHook('create', app);
            });
        }
        // The Service namespace is an accessor function ...
        var serviceNamespace = function serviceNamespace(appArg) {
            if (appArg === void 0) {
                appArg = app();
            }
            if (typeof appArg[name] !== 'function') {
                // Invalid argument.
                // This happens in the following case: firebase.storage('gs:/')
                error('invalid-app-argument', { name: name });
            }
            // Forward service instance lookup to the FirebaseApp.
            return appArg[name]();
        };
        // ... and a container for service-level properties.
        if (serviceProperties !== undefined) {
            Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["m" /* deepExtend */])(serviceNamespace, serviceProperties);
        }
        // Monkey-patch the serviceNamespace onto the firebase namespace
        namespace[name] = serviceNamespace;
        // Patch the FirebaseAppImpl prototype
        FirebaseAppImpl.prototype[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var serviceFxn = this._getService.bind(this, name);
            return serviceFxn.apply(this, allowMultipleInstances ? args : []);
        };
        return serviceNamespace;
    }
    /**
     * Patch the top-level firebase namespace with additional properties.
     *
     * firebase.INTERNAL.extendNamespace()
     */
    function extendNamespace(props) {
        Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["m" /* deepExtend */])(namespace, props);
    }
    function callAppHooks(app, eventName) {
        Object.keys(factories).forEach(function (serviceName) {
            // Ignore virtual services
            var factoryName = useAsService(app, serviceName);
            if (factoryName === null) {
                return;
            }
            if (appHooks[factoryName]) {
                appHooks[factoryName](eventName, app);
            }
        });
    }
    // Map the requested service to a registered service name
    // (used to map auth to serverAuth service when needed).
    function useAsService(app, name) {
        if (name === 'serverAuth') {
            return null;
        }
        var useService = name;
        var options = app.options;
        return useService;
    }
    return namespace;
}
function error(code, args) {
    throw appErrors.create(code, args);
}
// TypeScript does not support non-string indexes!
// let errors: {[code: AppError: string} = {
var errors = {
    'no-app': "No Firebase App '{$name}' has been created - " + 'call Firebase App.initializeApp()',
    'bad-app-name': "Illegal App name: '{$name}",
    'duplicate-app': "Firebase App named '{$name}' already exists",
    'app-deleted': "Firebase App named '{$name}' already deleted",
    'duplicate-service': "Firebase service named '{$name}' already registered",
    'sa-not-supported': 'Initializing the Firebase SDK with a service ' + 'account is only allowed in a Node.js environment. On client ' + 'devices, you should instead initialize the SDK with an api key and ' + 'auth domain',
    'invalid-app-argument': 'firebase.{$name}() takes either no argument or a ' + 'Firebase App instance.'
};
var appErrors = new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["c" /* ErrorFactory */]('app', 'Firebase', errors);

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var firebase = createFirebaseNamespace();

/* harmony default export */ __webpack_exports__["default"] = (firebase);


/***/ }),

/***/ "TToO":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = __extends;
/* unused harmony export __assign */
/* unused harmony export __rest */
/* unused harmony export __decorate */
/* unused harmony export __param */
/* unused harmony export __metadata */
/* harmony export (immutable) */ __webpack_exports__["a"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["c"] = __generator;
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
    d.__proto__ = b;
} || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};

function __rest(s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator],
        i = 0;
    if (m) return m.call(o);
    return {
        next: function next() {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
            ar.push(r.value);
        }
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++) {
        ar = ar.concat(__read(arguments[i]));
    }return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
        i,
        q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
    }, i;
    function verb(n) {
        if (g[n]) i[n] = function (v) {
            return new Promise(function (a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function () {
        return this;
    }, i;
    function verb(n, f) {
        if (o[n]) i[n] = function (v) {
            return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v;
        };
    }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
    } else {
        cooked.raw = raw;
    }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result.default = mod;
    return result;
}

function __importDefault(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
}

/***/ }),

/***/ "VuKk":
/***/ (function(module, exports, __webpack_require__) {

(function () {
  var firebase = __webpack_require__("SHXD").default;
  var g,
      aa = aa || {},
      k = this;function l(a) {
    return "string" == typeof a;
  }function ba(a) {
    return "boolean" == typeof a;
  }function ca() {}
  function da(a) {
    var b = typeof a;if ("object" == b) {
      if (a) {
        if (a instanceof Array) return "array";if (a instanceof Object) return b;var c = Object.prototype.toString.call(a);if ("[object Window]" == c) return "object";if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function";
      } else return "null";
    } else if ("function" == b && "undefined" == typeof a.call) return "object";return b;
  }function ea(a) {
    return null === a;
  }function fa(a) {
    return "array" == da(a);
  }function ha(a) {
    var b = da(a);return "array" == b || "object" == b && "number" == typeof a.length;
  }function n(a) {
    return "function" == da(a);
  }function q(a) {
    var b = typeof a;return "object" == b && null != a || "function" == b;
  }var ia = "closure_uid_" + (1E9 * Math.random() >>> 0),
      ja = 0;function ka(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function la(a, b, c) {
    if (!a) throw Error();if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);return function () {
        var c = Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c, d);return a.apply(b, c);
      };
    }return function () {
      return a.apply(b, arguments);
    };
  }function r(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? r = ka : r = la;return r.apply(null, arguments);
  }
  function ma(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);return function () {
      var b = c.slice();b.push.apply(b, arguments);return a.apply(this, b);
    };
  }var na = Date.now || function () {
    return +new Date();
  };function t(a, b) {
    function c() {}c.prototype = b.prototype;a.lb = b.prototype;a.prototype = new c();a.prototype.constructor = a;a.ad = function (a, c, f) {
      for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) {
        d[e - 2] = arguments[e];
      }return b.prototype[c].apply(a, d);
    };
  };function oa(a) {
    a.prototype.then = a.prototype.then;a.prototype.$goog_Thenable = !0;
  }function pa(a) {
    if (!a) return !1;try {
      return !!a.$goog_Thenable;
    } catch (b) {
      return !1;
    }
  };function u(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, u);else {
      var b = Error().stack;b && (this.stack = b);
    }a && (this.message = String(a));
  }t(u, Error);u.prototype.name = "CustomError";function qa(a, b) {
    a = a.split("%s");for (var c = "", d = a.length - 1, e = 0; e < d; e++) {
      c += a[e] + (e < b.length ? b[e] : "%s");
    }u.call(this, c + a[d]);
  }t(qa, u);qa.prototype.name = "AssertionError";function ra(a, b) {
    throw new qa("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  };function sa(a, b) {
    this.c = a;this.f = b;this.b = 0;this.a = null;
  }sa.prototype.get = function () {
    if (0 < this.b) {
      this.b--;var a = this.a;this.a = a.next;a.next = null;
    } else a = this.c();return a;
  };function ta(a, b) {
    a.f(b);100 > a.b && (a.b++, b.next = a.a, a.a = b);
  };function ua() {
    this.b = this.a = null;
  }var wa = new sa(function () {
    return new va();
  }, function (a) {
    a.reset();
  });ua.prototype.add = function (a, b) {
    var c = wa.get();c.set(a, b);this.b ? this.b.next = c : this.a = c;this.b = c;
  };function xa() {
    var a = ya,
        b = null;a.a && (b = a.a, a.a = a.a.next, a.a || (a.b = null), b.next = null);return b;
  }function va() {
    this.next = this.b = this.a = null;
  }va.prototype.set = function (a, b) {
    this.a = a;this.b = b;this.next = null;
  };va.prototype.reset = function () {
    this.next = this.b = this.a = null;
  };var za = Array.prototype.indexOf ? function (a, b) {
    return Array.prototype.indexOf.call(a, b, void 0);
  } : function (a, b) {
    if (l(a)) return l(b) && 1 == b.length ? a.indexOf(b, 0) : -1;for (var c = 0; c < a.length; c++) {
      if (c in a && a[c] === b) return c;
    }return -1;
  },
      v = Array.prototype.forEach ? function (a, b, c) {
    Array.prototype.forEach.call(a, b, c);
  } : function (a, b, c) {
    for (var d = a.length, e = l(a) ? a.split("") : a, f = 0; f < d; f++) {
      f in e && b.call(c, e[f], f, a);
    }
  };
  function Aa(a, b) {
    var c = a.length,
        d = l(a) ? a.split("") : a;for (--c; 0 <= c; --c) {
      c in d && b.call(void 0, d[c], c, a);
    }
  }
  var Ba = Array.prototype.map ? function (a, b) {
    return Array.prototype.map.call(a, b, void 0);
  } : function (a, b) {
    for (var c = a.length, d = Array(c), e = l(a) ? a.split("") : a, f = 0; f < c; f++) {
      f in e && (d[f] = b.call(void 0, e[f], f, a));
    }return d;
  },
      Ca = Array.prototype.some ? function (a, b) {
    return Array.prototype.some.call(a, b, void 0);
  } : function (a, b) {
    for (var c = a.length, d = l(a) ? a.split("") : a, e = 0; e < c; e++) {
      if (e in d && b.call(void 0, d[e], e, a)) return !0;
    }return !1;
  };
  function Da(a) {
    a: {
      var b = Ea;for (var c = a.length, d = l(a) ? a.split("") : a, e = 0; e < c; e++) {
        if (e in d && b.call(void 0, d[e], e, a)) {
          b = e;break a;
        }
      }b = -1;
    }return 0 > b ? null : l(a) ? a.charAt(b) : a[b];
  }function Fa(a, b) {
    return 0 <= za(a, b);
  }function Ga(a, b) {
    b = za(a, b);var c;(c = 0 <= b) && Array.prototype.splice.call(a, b, 1);return c;
  }function w(a, b) {
    var c = 0;Aa(a, function (d, e) {
      b.call(void 0, d, e, a) && 1 == Array.prototype.splice.call(a, e, 1).length && c++;
    });
  }function Ha(a) {
    return Array.prototype.concat.apply([], arguments);
  }
  function Ia(a) {
    var b = a.length;if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) {
        c[d] = a[d];
      }return c;
    }return [];
  };function Ja(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) {
      d += c.shift() + e.shift();
    }return d + c.join("%s");
  }var Ka = String.prototype.trim ? function (a) {
    return a.trim();
  } : function (a) {
    return (/^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
    );
  };
  function La(a) {
    if (!Ma.test(a)) return a;-1 != a.indexOf("&") && (a = a.replace(Na, "&amp;"));-1 != a.indexOf("<") && (a = a.replace(Oa, "&lt;"));-1 != a.indexOf(">") && (a = a.replace(Pa, "&gt;"));-1 != a.indexOf('"') && (a = a.replace(Qa, "&quot;"));-1 != a.indexOf("'") && (a = a.replace(Ra, "&#39;"));-1 != a.indexOf("\x00") && (a = a.replace(Sa, "&#0;"));return a;
  }var Na = /&/g,
      Oa = /</g,
      Pa = />/g,
      Qa = /"/g,
      Ra = /'/g,
      Sa = /\x00/g,
      Ma = /[\x00&<>"']/;function x(a, b) {
    return -1 != a.indexOf(b);
  }function Ta(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  };var Ua;a: {
    var Va = k.navigator;if (Va) {
      var Wa = Va.userAgent;if (Wa) {
        Ua = Wa;break a;
      }
    }Ua = "";
  }function y(a) {
    return x(Ua, a);
  };function Xa(a, b) {
    for (var c in a) {
      b.call(void 0, a[c], c, a);
    }
  }function Ya(a) {
    for (var b in a) {
      return !1;
    }return !0;
  }function Za(a) {
    var b = {},
        c;for (c in a) {
      b[c] = a[c];
    }return b;
  }var $a = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ab(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];for (c in d) {
        a[c] = d[c];
      }for (var f = 0; f < $a.length; f++) {
        c = $a[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
      }
    }
  };function bb(a) {
    k.setTimeout(function () {
      throw a;
    }, 0);
  }var cb;
  function db() {
    var a = k.MessageChannel;"undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !y("Presto") && (a = function a() {
      var a = document.createElement("IFRAME");a.style.display = "none";a.src = "";document.documentElement.appendChild(a);var b = a.contentWindow;a = b.document;a.open();a.write("");a.close();var c = "callImmediate" + Math.random(),
          d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host;a = r(function (a) {
        if (("*" == d || a.origin == d) && a.data == c) this.port1.onmessage();
      }, this);b.addEventListener("message", a, !1);this.port1 = {};this.port2 = { postMessage: function postMessage() {
          b.postMessage(c, d);
        } };
    });if ("undefined" !== typeof a && !y("Trident") && !y("MSIE")) {
      var b = new a(),
          c = {},
          d = c;b.port1.onmessage = function () {
        if (void 0 !== c.next) {
          c = c.next;var a = c.rb;c.rb = null;a();
        }
      };return function (a) {
        d.next = { rb: a };d = d.next;b.port2.postMessage(0);
      };
    }return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (a) {
      var b = document.createElement("SCRIPT");
      b.onreadystatechange = function () {
        b.onreadystatechange = null;b.parentNode.removeChild(b);b = null;a();a = null;
      };document.documentElement.appendChild(b);
    } : function (a) {
      k.setTimeout(a, 0);
    };
  };function eb(a, b) {
    fb || gb();hb || (fb(), hb = !0);ya.add(a, b);
  }var fb;function gb() {
    if (k.Promise && k.Promise.resolve) {
      var a = k.Promise.resolve(void 0);fb = function fb() {
        a.then(ib);
      };
    } else fb = function fb() {
      var a = ib;!n(k.setImmediate) || k.Window && k.Window.prototype && !y("Edge") && k.Window.prototype.setImmediate == k.setImmediate ? (cb || (cb = db()), cb(a)) : k.setImmediate(a);
    };
  }var hb = !1,
      ya = new ua();function ib() {
    for (var a; a = xa();) {
      try {
        a.a.call(a.b);
      } catch (b) {
        bb(b);
      }ta(wa, a);
    }hb = !1;
  };function z(a, b) {
    this.a = jb;this.j = void 0;this.f = this.b = this.c = null;this.g = this.h = !1;if (a != ca) try {
      var c = this;a.call(b, function (a) {
        kb(c, lb, a);
      }, function (a) {
        if (!(a instanceof mb)) try {
          if (a instanceof Error) throw a;throw Error("Promise rejected.");
        } catch (e) {}kb(c, nb, a);
      });
    } catch (d) {
      kb(this, nb, d);
    }
  }var jb = 0,
      lb = 2,
      nb = 3;function ob() {
    this.next = this.f = this.b = this.g = this.a = null;this.c = !1;
  }ob.prototype.reset = function () {
    this.f = this.b = this.g = this.a = null;this.c = !1;
  };var pb = new sa(function () {
    return new ob();
  }, function (a) {
    a.reset();
  });
  function qb(a, b, c) {
    var d = pb.get();d.g = a;d.b = b;d.f = c;return d;
  }function A(a) {
    if (a instanceof z) return a;var b = new z(ca);kb(b, lb, a);return b;
  }function B(a) {
    return new z(function (b, c) {
      c(a);
    });
  }function rb(a, b, c) {
    sb(a, b, c, null) || eb(ma(b, a));
  }function tb(a) {
    return new z(function (b, c) {
      var d = a.length,
          e = [];if (d) for (var f = function f(a, c) {
        d--;e[a] = c;0 == d && b(e);
      }, h = function h(a) {
        c(a);
      }, m = 0, p; m < a.length; m++) {
        p = a[m], rb(p, ma(f, m), h);
      } else b(e);
    });
  }
  function ub(a) {
    return new z(function (b) {
      var c = a.length,
          d = [];if (c) for (var e = function e(a, _e, f) {
        c--;d[a] = _e ? { Zb: !0, value: f } : { Zb: !1, reason: f };0 == c && b(d);
      }, f = 0, h; f < a.length; f++) {
        h = a[f], rb(h, ma(e, f, !0), ma(e, f, !1));
      } else b(d);
    });
  }z.prototype.then = function (a, b, c) {
    return vb(this, n(a) ? a : null, n(b) ? b : null, c);
  };oa(z);g = z.prototype;g.ha = function (a, b) {
    a = qb(a, a, b);a.c = !0;wb(this, a);return this;
  };g.m = function (a, b) {
    return vb(this, null, a, b);
  };g.cancel = function (a) {
    this.a == jb && eb(function () {
      var b = new mb(a);xb(this, b);
    }, this);
  };
  function xb(a, b) {
    if (a.a == jb) if (a.c) {
      var c = a.c;if (c.b) {
        for (var d = 0, e = null, f = null, h = c.b; h && (h.c || (d++, h.a == a && (e = h), !(e && 1 < d))); h = h.next) {
          e || (f = h);
        }e && (c.a == jb && 1 == d ? xb(c, b) : (f ? (d = f, d.next == c.f && (c.f = d), d.next = d.next.next) : yb(c), zb(c, e, nb, b)));
      }a.c = null;
    } else kb(a, nb, b);
  }function wb(a, b) {
    a.b || a.a != lb && a.a != nb || Ab(a);a.f ? a.f.next = b : a.b = b;a.f = b;
  }
  function vb(a, b, c, d) {
    var e = qb(null, null, null);e.a = new z(function (a, h) {
      e.g = b ? function (c) {
        try {
          var e = b.call(d, c);a(e);
        } catch (E) {
          h(E);
        }
      } : a;e.b = c ? function (b) {
        try {
          var e = c.call(d, b);void 0 === e && b instanceof mb ? h(b) : a(e);
        } catch (E) {
          h(E);
        }
      } : h;
    });e.a.c = a;wb(a, e);return e.a;
  }g.Kc = function (a) {
    this.a = jb;kb(this, lb, a);
  };g.Lc = function (a) {
    this.a = jb;kb(this, nb, a);
  };
  function kb(a, b, c) {
    a.a == jb && (a === c && (b = nb, c = new TypeError("Promise cannot resolve to itself")), a.a = 1, sb(c, a.Kc, a.Lc, a) || (a.j = c, a.a = b, a.c = null, Ab(a), b != nb || c instanceof mb || Bb(a, c)));
  }function sb(a, b, c, d) {
    if (a instanceof z) return wb(a, qb(b || ca, c || null, d)), !0;if (pa(a)) return a.then(b, c, d), !0;if (q(a)) try {
      var e = a.then;if (n(e)) return Cb(a, e, b, c, d), !0;
    } catch (f) {
      return c.call(d, f), !0;
    }return !1;
  }
  function Cb(a, b, c, d, e) {
    function f(a) {
      m || (m = !0, d.call(e, a));
    }function h(a) {
      m || (m = !0, c.call(e, a));
    }var m = !1;try {
      b.call(a, h, f);
    } catch (p) {
      f(p);
    }
  }function Ab(a) {
    a.h || (a.h = !0, eb(a.Ub, a));
  }function yb(a) {
    var b = null;a.b && (b = a.b, a.b = b.next, b.next = null);a.b || (a.f = null);return b;
  }g.Ub = function () {
    for (var a; a = yb(this);) {
      zb(this, a, this.a, this.j);
    }this.h = !1;
  };
  function zb(a, b, c, d) {
    if (c == nb && b.b && !b.c) for (; a && a.g; a = a.c) {
      a.g = !1;
    }if (b.a) b.a.c = null, Db(b, c, d);else try {
      b.c ? b.g.call(b.f) : Db(b, c, d);
    } catch (e) {
      Eb.call(null, e);
    }ta(pb, b);
  }function Db(a, b, c) {
    b == lb ? a.g.call(a.f, c) : a.b && a.b.call(a.f, c);
  }function Bb(a, b) {
    a.g = !0;eb(function () {
      a.g && Eb.call(null, b);
    });
  }var Eb = bb;function mb(a) {
    u.call(this, a);
  }t(mb, u);mb.prototype.name = "cancel";function Fb() {
    0 != Gb && (Hb[this[ia] || (this[ia] = ++ja)] = this);this.pa = this.pa;this.oa = this.oa;
  }var Gb = 0,
      Hb = {};Fb.prototype.pa = !1;function Ib(a) {
    if (!a.pa && (a.pa = !0, a.ua(), 0 != Gb)) {
      var b = a[ia] || (a[ia] = ++ja);if (0 != Gb && a.oa && 0 < a.oa.length) throw Error(a + " did not empty its onDisposeCallbacks queue. This probably means it overrode dispose() or disposeInternal() without calling the superclass' method.");delete Hb[b];
    }
  }Fb.prototype.ua = function () {
    if (this.oa) for (; this.oa.length;) {
      this.oa.shift()();
    }
  };function Jb(a) {
    Jb[" "](a);return a;
  }Jb[" "] = ca;function Kb(a, b) {
    var c = Lb;return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a);
  };var Mb = y("Opera"),
      C = y("Trident") || y("MSIE"),
      Nb = y("Edge"),
      Ob = Nb || C,
      Pb = y("Gecko") && !(x(Ua.toLowerCase(), "webkit") && !y("Edge")) && !(y("Trident") || y("MSIE")) && !y("Edge"),
      Qb = x(Ua.toLowerCase(), "webkit") && !y("Edge");function Rb() {
    var a = k.document;return a ? a.documentMode : void 0;
  }var Sb;
  a: {
    var Tb = "",
        Ub = function () {
      var a = Ua;if (Pb) return (/rv:([^\);]+)(\)|;)/.exec(a)
      );if (Nb) return (/Edge\/([\d\.]+)/.exec(a)
      );if (C) return (/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a)
      );if (Qb) return (/WebKit\/(\S+)/.exec(a)
      );if (Mb) return (/(?:Version)[ \/]?(\S+)/.exec(a)
      );
    }();Ub && (Tb = Ub ? Ub[1] : "");if (C) {
      var Vb = Rb();if (null != Vb && Vb > parseFloat(Tb)) {
        Sb = String(Vb);break a;
      }
    }Sb = Tb;
  }var Lb = {};
  function Wb(a) {
    return Kb(a, function () {
      for (var b = 0, c = Ka(String(Sb)).split("."), d = Ka(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
        var h = c[f] || "",
            m = d[f] || "";do {
          h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];m = /(\d*)(\D*)(.*)/.exec(m) || ["", "", "", ""];if (0 == h[0].length && 0 == m[0].length) break;b = Ta(0 == h[1].length ? 0 : parseInt(h[1], 10), 0 == m[1].length ? 0 : parseInt(m[1], 10)) || Ta(0 == h[2].length, 0 == m[2].length) || Ta(h[2], m[2]);h = h[3];m = m[3];
        } while (0 == b);
      }return 0 <= b;
    });
  }var Xb;var Yb = k.document;
  Xb = Yb && C ? Rb() || ("CSS1Compat" == Yb.compatMode ? parseInt(Sb, 10) : 5) : void 0;var Zb = Object.freeze || function (a) {
    return a;
  };var $b = !C || 9 <= Number(Xb),
      ac = C && !Wb("9"),
      bc = function () {
    if (!k.addEventListener || !Object.defineProperty) return !1;var a = !1,
        b = Object.defineProperty({}, "passive", { get: function get() {
        a = !0;
      } });k.addEventListener("test", ca, b);k.removeEventListener("test", ca, b);return a;
  }();function D(a, b) {
    this.type = a;this.b = this.target = b;this.Eb = !0;
  }D.prototype.preventDefault = function () {
    this.Eb = !1;
  };function cc(a, b) {
    D.call(this, a ? a.type : "");this.relatedTarget = this.b = this.target = null;this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;this.key = "";this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;this.pointerId = 0;this.pointerType = "";this.a = null;if (a) {
      var c = this.type = a.type,
          d = a.changedTouches ? a.changedTouches[0] : null;this.target = a.target || a.srcElement;this.b = b;if (b = a.relatedTarget) {
        if (Pb) {
          a: {
            try {
              Jb(b.nodeName);var e = !0;break a;
            } catch (f) {}e = !1;
          }e || (b = null);
        }
      } else "mouseover" == c ? b = a.fromElement : "mouseout" == c && (b = a.toElement);this.relatedTarget = b;null === d ? (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);this.button = a.button;this.key = a.key || "";this.ctrlKey = a.ctrlKey;this.altKey = a.altKey;this.shiftKey = a.shiftKey;this.metaKey = a.metaKey;this.pointerId = a.pointerId || 0;this.pointerType = l(a.pointerType) ? a.pointerType : dc[a.pointerType] || "";this.a = a;a.defaultPrevented && this.preventDefault();
    }
  }t(cc, D);var dc = Zb({ 2: "touch", 3: "pen", 4: "mouse" });cc.prototype.preventDefault = function () {
    cc.lb.preventDefault.call(this);var a = this.a;if (a.preventDefault) a.preventDefault();else if (a.returnValue = !1, ac) try {
      if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1;
    } catch (b) {}
  };cc.prototype.f = function () {
    return this.a;
  };var ec = "closure_listenable_" + (1E6 * Math.random() | 0),
      fc = 0;function gc(a, b, c, d, e) {
    this.listener = a;this.proxy = null;this.src = b;this.type = c;this.capture = !!d;this.La = e;this.key = ++fc;this.ma = this.Ha = !1;
  }function hc(a) {
    a.ma = !0;a.listener = null;a.proxy = null;a.src = null;a.La = null;
  };function jc(a) {
    this.src = a;this.a = {};this.b = 0;
  }jc.prototype.add = function (a, b, c, d, e) {
    var f = a.toString();a = this.a[f];a || (a = this.a[f] = [], this.b++);var h = kc(a, b, d, e);-1 < h ? (b = a[h], c || (b.Ha = !1)) : (b = new gc(b, this.src, f, !!d, e), b.Ha = c, a.push(b));return b;
  };function lc(a, b) {
    var c = b.type;c in a.a && Ga(a.a[c], b) && (hc(b), 0 == a.a[c].length && (delete a.a[c], a.b--));
  }function kc(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];if (!f.ma && f.listener == b && f.capture == !!c && f.La == d) return e;
    }return -1;
  };var mc = "closure_lm_" + (1E6 * Math.random() | 0),
      nc = {},
      oc = 0;function pc(a, b, c, d, e) {
    if (d && d.once) qc(a, b, c, d, e);else if (fa(b)) for (var f = 0; f < b.length; f++) {
      pc(a, b[f], c, d, e);
    } else c = rc(c), a && a[ec] ? sc(a, b, c, q(d) ? !!d.capture : !!d, e) : tc(a, b, c, !1, d, e);
  }
  function tc(a, b, c, d, e, f) {
    if (!b) throw Error("Invalid event type");var h = q(e) ? !!e.capture : !!e,
        m = uc(a);m || (a[mc] = m = new jc(a));c = m.add(b, c, d, h, f);if (!c.proxy) {
      d = vc();c.proxy = d;d.src = a;d.listener = c;if (a.addEventListener) bc || (e = h), void 0 === e && (e = !1), a.addEventListener(b.toString(), d, e);else if (a.attachEvent) a.attachEvent(wc(b.toString()), d);else if (a.addListener && a.removeListener) a.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");oc++;
    }
  }
  function vc() {
    var a = xc,
        b = $b ? function (c) {
      return a.call(b.src, b.listener, c);
    } : function (c) {
      c = a.call(b.src, b.listener, c);if (!c) return c;
    };return b;
  }function qc(a, b, c, d, e) {
    if (fa(b)) for (var f = 0; f < b.length; f++) {
      qc(a, b[f], c, d, e);
    } else c = rc(c), a && a[ec] ? yc(a, b, c, q(d) ? !!d.capture : !!d, e) : tc(a, b, c, !0, d, e);
  }
  function F(a, b, c, d, e) {
    if (fa(b)) for (var f = 0; f < b.length; f++) {
      F(a, b[f], c, d, e);
    } else (d = q(d) ? !!d.capture : !!d, c = rc(c), a && a[ec]) ? (a = a.u, b = String(b).toString(), b in a.a && (f = a.a[b], c = kc(f, c, d, e), -1 < c && (hc(f[c]), Array.prototype.splice.call(f, c, 1), 0 == f.length && (delete a.a[b], a.b--)))) : a && (a = uc(a)) && (b = a.a[b.toString()], a = -1, b && (a = kc(b, c, d, e)), (c = -1 < a ? b[a] : null) && zc(c));
  }
  function zc(a) {
    if ("number" != typeof a && a && !a.ma) {
      var b = a.src;if (b && b[ec]) lc(b.u, a);else {
        var c = a.type,
            d = a.proxy;b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(wc(c), d) : b.addListener && b.removeListener && b.removeListener(d);oc--;(c = uc(b)) ? (lc(c, a), 0 == c.b && (c.src = null, b[mc] = null)) : hc(a);
      }
    }
  }function wc(a) {
    return a in nc ? nc[a] : nc[a] = "on" + a;
  }
  function Ac(a, b, c, d) {
    var e = !0;if (a = uc(a)) if (b = a.a[b.toString()]) for (b = b.concat(), a = 0; a < b.length; a++) {
      var f = b[a];f && f.capture == c && !f.ma && (f = Bc(f, d), e = e && !1 !== f);
    }return e;
  }function Bc(a, b) {
    var c = a.listener,
        d = a.La || a.src;a.Ha && zc(a);return c.call(d, b);
  }
  function xc(a, b) {
    if (a.ma) return !0;if (!$b) {
      if (!b) a: {
        b = ["window", "event"];for (var c = k, d = 0; d < b.length; d++) {
          if (c = c[b[d]], null == c) {
            b = null;break a;
          }
        }b = c;
      }d = b;b = new cc(d, this);c = !0;if (!(0 > d.keyCode || void 0 != d.returnValue)) {
        a: {
          var e = !1;if (0 == d.keyCode) try {
            d.keyCode = -1;break a;
          } catch (h) {
            e = !0;
          }if (e || void 0 == d.returnValue) d.returnValue = !0;
        }d = [];for (e = b.b; e; e = e.parentNode) {
          d.push(e);
        }a = a.type;for (e = d.length - 1; 0 <= e; e--) {
          b.b = d[e];var f = Ac(d[e], a, !0, b);c = c && f;
        }for (e = 0; e < d.length; e++) {
          b.b = d[e], f = Ac(d[e], a, !1, b), c = c && f;
        }
      }return c;
    }return Bc(a, new cc(b, this));
  }function uc(a) {
    a = a[mc];return a instanceof jc ? a : null;
  }var Cc = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);function rc(a) {
    if (n(a)) return a;a[Cc] || (a[Cc] = function (b) {
      return a.handleEvent(b);
    });return a[Cc];
  };function G() {
    Fb.call(this);this.u = new jc(this);this.Mb = this;this.Ta = null;
  }t(G, Fb);G.prototype[ec] = !0;G.prototype.addEventListener = function (a, b, c, d) {
    pc(this, a, b, c, d);
  };G.prototype.removeEventListener = function (a, b, c, d) {
    F(this, a, b, c, d);
  };
  G.prototype.dispatchEvent = function (a) {
    var b,
        c = this.Ta;if (c) for (b = []; c; c = c.Ta) {
      b.push(c);
    }c = this.Mb;var d = a.type || a;if (l(a)) a = new D(a, c);else if (a instanceof D) a.target = a.target || c;else {
      var e = a;a = new D(d, c);ab(a, e);
    }e = !0;if (b) for (var f = b.length - 1; 0 <= f; f--) {
      var h = a.b = b[f];e = Dc(h, d, !0, a) && e;
    }h = a.b = c;e = Dc(h, d, !0, a) && e;e = Dc(h, d, !1, a) && e;if (b) for (f = 0; f < b.length; f++) {
      h = a.b = b[f], e = Dc(h, d, !1, a) && e;
    }return e;
  };
  G.prototype.ua = function () {
    G.lb.ua.call(this);if (this.u) {
      var a = this.u,
          b = 0,
          c;for (c in a.a) {
        for (var d = a.a[c], e = 0; e < d.length; e++) {
          ++b, hc(d[e]);
        }delete a.a[c];a.b--;
      }
    }this.Ta = null;
  };function sc(a, b, c, d, e) {
    a.u.add(String(b), c, !1, d, e);
  }function yc(a, b, c, d, e) {
    a.u.add(String(b), c, !0, d, e);
  }
  function Dc(a, b, c, d) {
    b = a.u.a[String(b)];if (!b) return !0;b = b.concat();for (var e = !0, f = 0; f < b.length; ++f) {
      var h = b[f];if (h && !h.ma && h.capture == c) {
        var m = h.listener,
            p = h.La || h.src;h.Ha && lc(a.u, h);e = !1 !== m.call(p, d) && e;
      }
    }return e && 0 != d.Eb;
  };function Ec(a, b, c) {
    if (n(a)) c && (a = r(a, c));else if (a && "function" == typeof a.handleEvent) a = r(a.handleEvent, a);else throw Error("Invalid listener argument");return 2147483647 < Number(b) ? -1 : k.setTimeout(a, b || 0);
  }function Fc(a) {
    var b = null;return new z(function (c, d) {
      b = Ec(function () {
        c(void 0);
      }, a);-1 == b && d(Error("Failed to schedule timer."));
    }).m(function (a) {
      k.clearTimeout(b);throw a;
    });
  };function Gc(a) {
    if (a.S && "function" == typeof a.S) return a.S();if (l(a)) return a.split("");if (ha(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++) {
        b.push(a[d]);
      }return b;
    }b = [];c = 0;for (d in a) {
      b[c++] = a[d];
    }return b;
  }function Hc(a) {
    if (a.U && "function" == typeof a.U) return a.U();if (!a.S || "function" != typeof a.S) {
      if (ha(a) || l(a)) {
        var b = [];a = a.length;for (var c = 0; c < a; c++) {
          b.push(c);
        }return b;
      }b = [];c = 0;for (var d in a) {
        b[c++] = d;
      }return b;
    }
  }
  function Ic(a, b) {
    if (a.forEach && "function" == typeof a.forEach) a.forEach(b, void 0);else if (ha(a) || l(a)) v(a, b, void 0);else for (var c = Hc(a), d = Gc(a), e = d.length, f = 0; f < e; f++) {
      b.call(void 0, d[f], c && c[f], a);
    }
  };function Kc(a, b) {
    this.b = {};this.a = [];this.c = 0;var c = arguments.length;if (1 < c) {
      if (c % 2) throw Error("Uneven number of arguments");for (var d = 0; d < c; d += 2) {
        this.set(arguments[d], arguments[d + 1]);
      }
    } else if (a) if (a instanceof Kc) for (c = a.U(), d = 0; d < c.length; d++) {
      this.set(c[d], a.get(c[d]));
    } else for (d in a) {
      this.set(d, a[d]);
    }
  }g = Kc.prototype;g.S = function () {
    Lc(this);for (var a = [], b = 0; b < this.a.length; b++) {
      a.push(this.b[this.a[b]]);
    }return a;
  };g.U = function () {
    Lc(this);return this.a.concat();
  };
  g.clear = function () {
    this.b = {};this.c = this.a.length = 0;
  };function Lc(a) {
    if (a.c != a.a.length) {
      for (var b = 0, c = 0; b < a.a.length;) {
        var d = a.a[b];Mc(a.b, d) && (a.a[c++] = d);b++;
      }a.a.length = c;
    }if (a.c != a.a.length) {
      var e = {};for (c = b = 0; b < a.a.length;) {
        d = a.a[b], Mc(e, d) || (a.a[c++] = d, e[d] = 1), b++;
      }a.a.length = c;
    }
  }g.get = function (a, b) {
    return Mc(this.b, a) ? this.b[a] : b;
  };g.set = function (a, b) {
    Mc(this.b, a) || (this.c++, this.a.push(a));this.b[a] = b;
  };
  g.forEach = function (a, b) {
    for (var c = this.U(), d = 0; d < c.length; d++) {
      var e = c[d],
          f = this.get(e);a.call(b, f, e, this);
    }
  };function Mc(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  };var Nc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;function Oc(a, b) {
    if (a) {
      a = a.split("&");for (var c = 0; c < a.length; c++) {
        var d = a[c].indexOf("="),
            e = null;if (0 <= d) {
          var f = a[c].substring(0, d);e = a[c].substring(d + 1);
        } else f = a[c];b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
      }
    }
  };function Pc(a, b) {
    this.b = this.l = this.c = "";this.j = null;this.h = this.g = "";this.f = !1;if (a instanceof Pc) {
      this.f = void 0 !== b ? b : a.f;Qc(this, a.c);this.l = a.l;this.b = a.b;Rc(this, a.j);this.g = a.g;b = a.a;var c = new Sc();c.c = b.c;b.a && (c.a = new Kc(b.a), c.b = b.b);Tc(this, c);this.h = a.h;
    } else a && (c = String(a).match(Nc)) ? (this.f = !!b, Qc(this, c[1] || "", !0), this.l = Uc(c[2] || ""), this.b = Uc(c[3] || "", !0), Rc(this, c[4]), this.g = Uc(c[5] || "", !0), Tc(this, c[6] || "", !0), this.h = Uc(c[7] || "")) : (this.f = !!b, this.a = new Sc(null, this.f));
  }
  Pc.prototype.toString = function () {
    var a = [],
        b = this.c;b && a.push(Vc(b, Wc, !0), ":");var c = this.b;if (c || "file" == b) a.push("//"), (b = this.l) && a.push(Vc(b, Wc, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.j, null != c && a.push(":", String(c));if (c = this.g) this.b && "/" != c.charAt(0) && a.push("/"), a.push(Vc(c, "/" == c.charAt(0) ? Xc : Yc, !0));(c = this.a.toString()) && a.push("?", c);(c = this.h) && a.push("#", Vc(c, Zc));return a.join("");
  };
  function Qc(a, b, c) {
    a.c = c ? Uc(b, !0) : b;a.c && (a.c = a.c.replace(/:$/, ""));
  }function Rc(a, b) {
    if (b) {
      b = Number(b);if (isNaN(b) || 0 > b) throw Error("Bad port number " + b);a.j = b;
    } else a.j = null;
  }function Tc(a, b, c) {
    b instanceof Sc ? (a.a = b, $c(a.a, a.f)) : (c || (b = Vc(b, ad)), a.a = new Sc(b, a.f));
  }function H(a, b, c) {
    a.a.set(b, c);
  }function bd(a, b) {
    return a.a.get(b);
  }function cd(a) {
    return a instanceof Pc ? new Pc(a) : new Pc(a, void 0);
  }function dd(a, b) {
    var c = new Pc(null, void 0);Qc(c, "https");a && (c.b = a);b && (c.g = b);return c;
  }
  function Uc(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }function Vc(a, b, c) {
    return l(a) ? (a = encodeURI(a).replace(b, ed), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }function ed(a) {
    a = a.charCodeAt(0);return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }var Wc = /[#\/\?@]/g,
      Yc = /[#\?:]/g,
      Xc = /[#\?]/g,
      ad = /[#\?@]/g,
      Zc = /#/g;function Sc(a, b) {
    this.b = this.a = null;this.c = a || null;this.f = !!b;
  }
  function fd(a) {
    a.a || (a.a = new Kc(), a.b = 0, a.c && Oc(a.c, function (b, c) {
      a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
  }function gd(a) {
    var b = Hc(a);if ("undefined" == typeof b) throw Error("Keys are undefined");var c = new Sc(null, void 0);a = Gc(a);for (var d = 0; d < b.length; d++) {
      var e = b[d],
          f = a[d];fa(f) ? hd(c, e, f) : c.add(e, f);
    }return c;
  }g = Sc.prototype;g.add = function (a, b) {
    fd(this);this.c = null;a = id(this, a);var c = this.a.get(a);c || this.a.set(a, c = []);c.push(b);this.b += 1;return this;
  };
  function jd(a, b) {
    fd(a);b = id(a, b);Mc(a.a.b, b) && (a.c = null, a.b -= a.a.get(b).length, a = a.a, Mc(a.b, b) && (delete a.b[b], a.c--, a.a.length > 2 * a.c && Lc(a)));
  }g.clear = function () {
    this.a = this.c = null;this.b = 0;
  };function kd(a, b) {
    fd(a);b = id(a, b);return Mc(a.a.b, b);
  }g.forEach = function (a, b) {
    fd(this);this.a.forEach(function (c, d) {
      v(c, function (c) {
        a.call(b, c, d, this);
      }, this);
    }, this);
  };g.U = function () {
    fd(this);for (var a = this.a.S(), b = this.a.U(), c = [], d = 0; d < b.length; d++) {
      for (var e = a[d], f = 0; f < e.length; f++) {
        c.push(b[d]);
      }
    }return c;
  };
  g.S = function (a) {
    fd(this);var b = [];if (l(a)) kd(this, a) && (b = Ha(b, this.a.get(id(this, a))));else {
      a = this.a.S();for (var c = 0; c < a.length; c++) {
        b = Ha(b, a[c]);
      }
    }return b;
  };g.set = function (a, b) {
    fd(this);this.c = null;a = id(this, a);kd(this, a) && (this.b -= this.a.get(a).length);this.a.set(a, [b]);this.b += 1;return this;
  };g.get = function (a, b) {
    a = a ? this.S(a) : [];return 0 < a.length ? String(a[0]) : b;
  };function hd(a, b, c) {
    jd(a, b);0 < c.length && (a.c = null, a.a.set(id(a, b), Ia(c)), a.b += c.length);
  }
  g.toString = function () {
    if (this.c) return this.c;if (!this.a) return "";for (var a = [], b = this.a.U(), c = 0; c < b.length; c++) {
      var d = b[c],
          e = encodeURIComponent(String(d));d = this.S(d);for (var f = 0; f < d.length; f++) {
        var h = e;"" !== d[f] && (h += "=" + encodeURIComponent(String(d[f])));a.push(h);
      }
    }return this.c = a.join("&");
  };function id(a, b) {
    b = String(b);a.f && (b = b.toLowerCase());return b;
  }function $c(a, b) {
    b && !a.f && (fd(a), a.c = null, a.a.forEach(function (a, b) {
      var c = b.toLowerCase();b != c && (jd(this, b), hd(this, c, a));
    }, a));a.f = b;
  };var ld = !C || 9 <= Number(Xb);function md() {
    this.a = "";this.b = nd;
  }md.prototype.la = !0;md.prototype.ja = function () {
    return this.a;
  };md.prototype.toString = function () {
    return "Const{" + this.a + "}";
  };function od(a) {
    if (a instanceof md && a.constructor === md && a.b === nd) return a.a;ra("expected object of type Const, got '" + a + "'");return "type_error:Const";
  }var nd = {};function pd(a) {
    var b = new md();b.a = a;return b;
  }pd("");function qd() {
    this.a = "";this.b = rd;
  }qd.prototype.la = !0;qd.prototype.ja = function () {
    return this.a;
  };qd.prototype.toString = function () {
    return "TrustedResourceUrl{" + this.a + "}";
  };function sd(a) {
    if (a instanceof qd && a.constructor === qd && a.b === rd) return a.a;ra("expected object of type TrustedResourceUrl, got '" + a + "' of type " + da(a));return "type_error:TrustedResourceUrl";
  }
  function td(a, b) {
    var c = od(a);if (!ud.test(c)) throw Error("Invalid TrustedResourceUrl format: " + c);a = c.replace(vd, function (a, e) {
      if (!Object.prototype.hasOwnProperty.call(b, e)) throw Error('Found marker, "' + e + '", in format string, "' + c + '", but no valid label mapping found in args: ' + JSON.stringify(b));a = b[e];return a instanceof md ? od(a) : encodeURIComponent(String(a));
    });return wd(a);
  }var vd = /%{(\w+)}/g,
      ud = /^(?:https:)?\/\/[0-9a-z.:[\]-]+\/|^\/[^\/\\]|^about:blank#/i,
      rd = {};
  function wd(a) {
    var b = new qd();b.a = a;return b;
  };function xd() {
    this.a = "";this.b = yd;
  }xd.prototype.la = !0;xd.prototype.ja = function () {
    return this.a;
  };xd.prototype.toString = function () {
    return "SafeUrl{" + this.a + "}";
  };function zd(a) {
    if (a instanceof xd && a.constructor === xd && a.b === yd) return a.a;ra("expected object of type SafeUrl, got '" + a + "' of type " + da(a));return "type_error:SafeUrl";
  }var Ad = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;
  function Bd(a) {
    if (a instanceof xd) return a;a = a.la ? a.ja() : String(a);Ad.test(a) || (a = "about:invalid#zClosurez");return Cd(a);
  }var yd = {};function Cd(a) {
    var b = new xd();b.a = a;return b;
  }Cd("about:blank");function Dd() {
    this.a = "";this.b = Ed;
  }Dd.prototype.la = !0;Dd.prototype.ja = function () {
    return this.a;
  };Dd.prototype.toString = function () {
    return "SafeHtml{" + this.a + "}";
  };function Fd(a) {
    if (a instanceof Dd && a.constructor === Dd && a.b === Ed) return a.a;ra("expected object of type SafeHtml, got '" + a + "' of type " + da(a));return "type_error:SafeHtml";
  }var Ed = {};function Gd(a) {
    var b = new Dd();b.a = a;return b;
  }Gd("<!DOCTYPE html>");Gd("");Gd("<br>");function Hd(a) {
    var b = document;return l(a) ? b.getElementById(a) : a;
  }function Id(a, b) {
    Xa(b, function (b, d) {
      b && b.la && (b = b.ja());"style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : Jd.hasOwnProperty(d) ? a.setAttribute(Jd[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b;
    });
  }
  var Jd = { cellpadding: "cellPadding", cellspacing: "cellSpacing", colspan: "colSpan", frameborder: "frameBorder", height: "height", maxlength: "maxLength", nonce: "nonce", role: "role", rowspan: "rowSpan", type: "type", usemap: "useMap", valign: "vAlign", width: "width" };
  function Kd(a, b, c) {
    var d = arguments,
        e = document,
        f = String(d[0]),
        h = d[1];if (!ld && h && (h.name || h.type)) {
      f = ["<", f];h.name && f.push(' name="', La(h.name), '"');if (h.type) {
        f.push(' type="', La(h.type), '"');var m = {};ab(m, h);delete m.type;h = m;
      }f.push(">");f = f.join("");
    }f = e.createElement(f);h && (l(h) ? f.className = h : fa(h) ? f.className = h.join(" ") : Id(f, h));2 < d.length && Ld(e, f, d);return f;
  }
  function Ld(a, b, c) {
    function d(c) {
      c && b.appendChild(l(c) ? a.createTextNode(c) : c);
    }for (var e = 2; e < c.length; e++) {
      var f = c[e];!ha(f) || q(f) && 0 < f.nodeType ? d(f) : v(Md(f) ? Ia(f) : f, d);
    }
  }function Md(a) {
    if (a && "number" == typeof a.length) {
      if (q(a)) return "function" == typeof a.item || "string" == typeof a.item;if (n(a)) return "function" == typeof a.item;
    }return !1;
  };function Nd(a) {
    var b = [];Od(new Pd(), a, b);return b.join("");
  }function Pd() {}
  function Od(a, b, c) {
    if (null == b) c.push("null");else {
      if ("object" == typeof b) {
        if (fa(b)) {
          var d = b;b = d.length;c.push("[");for (var e = "", f = 0; f < b; f++) {
            c.push(e), Od(a, d[f], c), e = ",";
          }c.push("]");return;
        }if (b instanceof String || b instanceof Number || b instanceof Boolean) b = b.valueOf();else {
          c.push("{");e = "";for (d in b) {
            Object.prototype.hasOwnProperty.call(b, d) && (f = b[d], "function" != typeof f && (c.push(e), Qd(d, c), c.push(":"), Od(a, f, c), e = ","));
          }c.push("}");return;
        }
      }switch (typeof b) {case "string":
          Qd(b, c);break;case "number":
          c.push(isFinite(b) && !isNaN(b) ? String(b) : "null");break;case "boolean":
          c.push(String(b));break;case "function":
          c.push("null");break;default:
          throw Error("Unknown type: " + typeof b);}
    }
  }var Rd = { '"': '\\"', "\\": "\\\\", "/": "\\/", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t", "\x0B": "\\u000b" },
      Sd = /\uffff/.test("\uFFFF") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;
  function Qd(a, b) {
    b.push('"', a.replace(Sd, function (a) {
      var b = Rd[a];b || (b = "\\u" + (a.charCodeAt(0) | 65536).toString(16).substr(1), Rd[a] = b);return b;
    }), '"');
  };function Td() {
    var a = I();return C && !!Xb && 11 == Xb || /Edge\/\d+/.test(a);
  }function Ud() {
    return k.window && k.window.location.href || self && self.location && self.location.href || "";
  }function Vd(a, b) {
    b = b || k.window;var c = "about:blank";a && (c = zd(Bd(a)));b.location.href = c;
  }
  function Wd(a, b) {
    var c = [],
        d;for (d in a) {
      if (d in b) {
        if (typeof a[d] != typeof b[d]) c.push(d);else if (fa(a[d])) {
          a: {
            var e = void 0;var f = a[d],
                h = b[d];for (e in f) {
              if (!(e in h) || f[e] !== h[e]) {
                e = !1;break a;
              }
            }for (e in h) {
              if (!(e in f)) {
                e = !1;break a;
              }
            }e = !0;
          }e || c.push(d);
        } else "object" == typeof a[d] && null != a[d] && null != b[d] ? 0 < Wd(a[d], b[d]).length && c.push(d) : a[d] !== b[d] && c.push(d);
      } else c.push(d);
    }for (d in b) {
      d in a || c.push(d);
    }return c;
  }
  function Xd() {
    var a = I();a = Yd(a) != Zd ? null : (a = a.match(/\sChrome\/(\d+)/i)) && 2 == a.length ? parseInt(a[1], 10) : null;return a && 30 > a ? !1 : !C || !Xb || 9 < Xb;
  }function $d(a) {
    a = (a || I()).toLowerCase();return a.match(/android/) || a.match(/webos/) || a.match(/iphone|ipad|ipod/) || a.match(/blackberry/) || a.match(/windows phone/) || a.match(/iemobile/) ? !0 : !1;
  }function ae(a) {
    a = a || k.window;try {
      a.close();
    } catch (b) {}
  }
  function be(a, b, c) {
    var d = Math.floor(1E9 * Math.random()).toString();b = b || 500;c = c || 600;var e = (window.screen.availHeight - c) / 2,
        f = (window.screen.availWidth - b) / 2;b = { width: b, height: c, top: 0 < e ? e : 0, left: 0 < f ? f : 0, location: !0, resizable: !0, statusbar: !0, toolbar: !1 };c = I().toLowerCase();d && (b.target = d, x(c, "crios/") && (b.target = "_blank"));Yd(I()) == ce && (a = a || "http://localhost", b.scrollbars = !0);c = a || "";(a = b) || (a = {});d = window;b = c instanceof xd ? c : Bd("undefined" != typeof c.href ? c.href : String(c));c = a.target || c.target;e = [];
    for (h in a) {
      switch (h) {case "width":case "height":case "top":case "left":
          e.push(h + "=" + a[h]);break;case "target":case "noopener":case "noreferrer":
          break;default:
          e.push(h + "=" + (a[h] ? 1 : 0));}
    }var h = e.join(",");(y("iPhone") && !y("iPod") && !y("iPad") || y("iPad") || y("iPod")) && d.navigator && d.navigator.standalone && c && "_self" != c ? (h = d.document.createElement("A"), b instanceof xd || b instanceof xd || (b = b.la ? b.ja() : String(b), Ad.test(b) || (b = "about:invalid#zClosurez"), b = Cd(b)), h.href = zd(b), h.setAttribute("target", c), a.noreferrer && h.setAttribute("rel", "noreferrer"), a = document.createEvent("MouseEvent"), a.initMouseEvent("click", !0, !0, d, 1), h.dispatchEvent(a), h = {}) : a.noreferrer ? (h = d.open("", c, h), a = zd(b), h && (Ob && x(a, ";") && (a = "'" + a.replace(/'/g, "%27") + "'"), h.opener = null, pd("b/12014412, meta tag with sanitized URL"), a = '<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url=' + La(a) + '">', a = Gd(a), h.document.write(Fd(a)), h.document.close())) : (h = d.open(zd(b), c, h)) && a.noopener && (h.opener = null);if (h) try {
      h.focus();
    } catch (m) {}return h;
  }
  function de(a) {
    return new z(function (b) {
      function c() {
        Fc(2E3).then(function () {
          if (!a || a.closed) b();else return c();
        });
      }return c();
    });
  }var ee = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;function fe() {
    var a = null;return new z(function (b) {
      "complete" == k.document.readyState ? b() : (a = function a() {
        b();
      }, qc(window, "load", a));
    }).m(function (b) {
      F(window, "load", a);throw b;
    });
  }
  function ge() {
    return he(void 0) ? fe().then(function () {
      return new z(function (a, b) {
        var c = k.document,
            d = setTimeout(function () {
          b(Error("Cordova framework is not ready."));
        }, 1E3);c.addEventListener("deviceready", function () {
          clearTimeout(d);a();
        }, !1);
      });
    }) : B(Error("Cordova must run in an Android or iOS file scheme."));
  }function he(a) {
    a = a || I();return !("file:" !== ie() || !a.toLowerCase().match(/iphone|ipad|ipod|android/));
  }function je() {
    var a = k.window;try {
      return !(!a || a == a.top);
    } catch (b) {
      return !1;
    }
  }
  function ke() {
    return "object" !== typeof k.window && "function" === typeof k.importScripts;
  }function le() {
    return firebase.INTERNAL.hasOwnProperty("reactNative") ? "ReactNative" : firebase.INTERNAL.hasOwnProperty("node") ? "Node" : ke() ? "Worker" : "Browser";
  }function me() {
    var a = le();return "ReactNative" === a || "Node" === a;
  }var ce = "Firefox",
      Zd = "Chrome";
  function Yd(a) {
    var b = a.toLowerCase();if (x(b, "opera/") || x(b, "opr/") || x(b, "opios/")) return "Opera";if (x(b, "iemobile")) return "IEMobile";if (x(b, "msie") || x(b, "trident/")) return "IE";if (x(b, "edge/")) return "Edge";if (x(b, "firefox/")) return ce;if (x(b, "silk/")) return "Silk";if (x(b, "blackberry")) return "Blackberry";if (x(b, "webos")) return "Webos";if (!x(b, "safari/") || x(b, "chrome/") || x(b, "crios/") || x(b, "android")) {
      if (!x(b, "chrome/") && !x(b, "crios/") || x(b, "edge/")) {
        if (x(b, "android")) return "Android";if ((a = a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/)) && 2 == a.length) return a[1];
      } else return Zd;
    } else return "Safari";return "Other";
  }var ne = { Qc: "FirebaseCore-web", Sc: "FirebaseUI-web" };function oe(a, b) {
    b = b || [];var c = [],
        d = {},
        e;for (e in ne) {
      d[ne[e]] = !0;
    }for (e = 0; e < b.length; e++) {
      "undefined" !== typeof d[b[e]] && (delete d[b[e]], c.push(b[e]));
    }c.sort();b = c;b.length || (b = ["FirebaseCore-web"]);c = le();"Browser" === c ? (d = I(), c = Yd(d)) : "Worker" === c && (d = I(), c = Yd(d) + "-" + c);return c + "/JsCore/" + a + "/" + b.join(",");
  }function I() {
    return k.navigator && k.navigator.userAgent || "";
  }
  function J(a, b) {
    a = a.split(".");b = b || k;for (var c = 0; c < a.length && "object" == typeof b && null != b; c++) {
      b = b[a[c]];
    }c != a.length && (b = void 0);return b;
  }function pe() {
    try {
      var a = k.localStorage,
          b = qe();if (a) return a.setItem(b, "1"), a.removeItem(b), Td() ? !!k.indexedDB : !0;
    } catch (c) {
      return ke() && !!k.indexedDB;
    }return !1;
  }function re() {
    return (se() || "chrome-extension:" === ie() || he()) && !me() && pe() && !ke();
  }function se() {
    return "http:" === ie() || "https:" === ie();
  }function ie() {
    return k.location && k.location.protocol || null;
  }
  function te(a) {
    a = a || I();return $d(a) || Yd(a) == ce ? !1 : !0;
  }function ue(a) {
    return "undefined" === typeof a ? null : Nd(a);
  }function ve(a) {
    var b = {},
        c;for (c in a) {
      a.hasOwnProperty(c) && null !== a[c] && void 0 !== a[c] && (b[c] = a[c]);
    }return b;
  }function we(a) {
    if (null !== a) return JSON.parse(a);
  }function qe(a) {
    return a ? a : Math.floor(1E9 * Math.random()).toString();
  }function xe(a) {
    a = a || I();return "Safari" == Yd(a) || a.toLowerCase().match(/iphone|ipad|ipod/) ? !1 : !0;
  }
  function ye() {
    var a = k.___jsl;if (a && a.H) for (var b in a.H) {
      if (a.H[b].r = a.H[b].r || [], a.H[b].L = a.H[b].L || [], a.H[b].r = a.H[b].L.concat(), a.CP) for (var c = 0; c < a.CP.length; c++) {
        a.CP[c] = null;
      }
    }
  }function ze(a, b) {
    if (a > b) throw Error("Short delay should be less than long delay!");this.a = a;this.c = b;a = I();b = le();this.b = $d(a) || "ReactNative" === b;
  }
  ze.prototype.get = function () {
    var a = k.navigator;return (a && "boolean" === typeof a.onLine && (se() || "chrome-extension:" === ie() || "undefined" !== typeof a.connection) ? a.onLine : 1) ? this.b ? this.c : this.a : Math.min(5E3, this.a);
  };function Ae() {
    var a = k.document;return a && "undefined" !== typeof a.visibilityState ? "visible" == a.visibilityState : !0;
  }
  function Be() {
    var a = k.document,
        _b = null;return Ae() || !a ? A() : new z(function (c) {
      _b = function b() {
        Ae() && (a.removeEventListener("visibilitychange", _b, !1), c());
      };a.addEventListener("visibilitychange", _b, !1);
    }).m(function (c) {
      a.removeEventListener("visibilitychange", _b, !1);throw c;
    });
  }function Ce(a) {
    try {
      var b = new Date(parseInt(a, 10));if (!isNaN(b.getTime()) && !/[^0-9]/.test(a)) return b.toUTCString();
    } catch (c) {}return null;
  }function De() {
    return !(!J("fireauth.oauthhelper", k) && !J("fireauth.iframe", k));
  };var Ee = {};var Fe;try {
    var Ge = {};Object.defineProperty(Ge, "abcd", { configurable: !0, enumerable: !0, value: 1 });Object.defineProperty(Ge, "abcd", { configurable: !0, enumerable: !0, value: 2 });Fe = 2 == Ge.abcd;
  } catch (a) {
    Fe = !1;
  }function K(a, b, c) {
    Fe ? Object.defineProperty(a, b, { configurable: !0, enumerable: !0, value: c }) : a[b] = c;
  }function L(a, b) {
    if (b) for (var c in b) {
      b.hasOwnProperty(c) && K(a, c, b[c]);
    }
  }function He(a) {
    var b = {};L(b, a);return b;
  }function Ie(a) {
    var b = {},
        c;for (c in a) {
      a.hasOwnProperty(c) && (b[c] = a[c]);
    }return b;
  }
  function Je(a, b) {
    if (!b || !b.length) return !0;if (!a) return !1;for (var c = 0; c < b.length; c++) {
      var d = a[b[c]];if (void 0 === d || null === d || "" === d) return !1;
    }return !0;
  }function Ke(a) {
    var b = a;if ("object" == typeof a && null != a) {
      b = "length" in a ? [] : {};for (var c in a) {
        K(b, c, Ke(a[c]));
      }
    }return b;
  };function Le(a) {
    var b = {},
        c = a[Me],
        d = a[Ne];a = a[Oe];if (!a || a != Pe && !c) throw Error("Invalid provider user info!");b[Qe] = d || null;b[Re] = c || null;K(this, Se, a);K(this, Te, Ke(b));
  }var Pe = "EMAIL_SIGNIN",
      Me = "email",
      Ne = "newEmail",
      Oe = "requestType",
      Re = "email",
      Qe = "fromEmail",
      Te = "data",
      Se = "operation";function M(a, b) {
    this.code = Ue + a;this.message = b || Ve[a] || "";
  }t(M, Error);M.prototype.C = function () {
    return { code: this.code, message: this.message };
  };M.prototype.toJSON = function () {
    return this.C();
  };function We(a) {
    var b = a && a.code;return b ? new M(b.substring(Ue.length), a.message) : null;
  }
  var Ue = "auth/",
      Ve = { "argument-error": "", "app-not-authorized": "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.", "app-not-installed": "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.", "captcha-check-failed": "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
    "code-expired": "The SMS code has expired. Please re-send the verification code to try again.", "cordova-not-ready": "Cordova framework is not ready.", "cors-unsupported": "This browser is not supported.", "credential-already-in-use": "This credential is already associated with a different user account.", "custom-token-mismatch": "The custom token corresponds to a different audience.", "requires-recent-login": "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
    "dynamic-link-not-activated": "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.", "email-already-in-use": "The email address is already in use by another account.", "expired-action-code": "The action code has expired. ", "cancelled-popup-request": "This operation has been cancelled due to another conflicting popup being opened.", "internal-error": "An internal error has occurred.", "invalid-app-credential": "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
    "invalid-app-id": "The mobile app identifier is not registed for the current project.", "invalid-user-token": "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.", "invalid-auth-event": "An internal error has occurred.", "invalid-verification-code": "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.",
    "invalid-continue-uri": "The continue URL provided in the request is invalid.", "invalid-cordova-configuration": "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.", "invalid-custom-token": "The custom token format is incorrect. Please check the documentation.", "invalid-email": "The email address is badly formatted.", "invalid-api-key": "Your API key is invalid, please check you have copied it correctly.",
    "invalid-cert-hash": "The SHA-1 certificate hash provided is invalid.", "invalid-credential": "The supplied auth credential is malformed or has expired.", "invalid-persistence-type": "The specified persistence type is invalid. It can only be local, session or none.", "invalid-message-payload": "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.", "invalid-oauth-provider": "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
    "invalid-oauth-client-id": "The OAuth client ID provided is either invalid or does not match the specified API key.", "unauthorized-domain": "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.", "invalid-action-code": "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.", "wrong-password": "The password is invalid or the user does not have a password.", "invalid-phone-number": "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
    "invalid-recipient-email": "The email corresponding to this action failed to send as the provided recipient email address is invalid.", "invalid-sender": "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.", "invalid-verification-id": "The verification ID used to create the phone auth credential is invalid.", "missing-android-pkg-name": "An Android Package Name must be provided if the Android App is required to be installed.",
    "auth-domain-config-required": "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.", "missing-app-credential": "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.", "missing-verification-code": "The phone auth credential was created with an empty SMS verification code.", "missing-continue-uri": "A continue URL must be provided in the request.", "missing-iframe-start": "An internal error has occurred.",
    "missing-ios-bundle-id": "An iOS Bundle ID must be provided if an App Store ID is provided.", "missing-phone-number": "To send verification codes, provide a phone number for the recipient.", "missing-verification-id": "The phone auth credential was created with an empty verification ID.", "app-deleted": "This instance of FirebaseApp has been deleted.", "account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
    "network-request-failed": "A network error (such as timeout, interrupted connection or unreachable host) has occurred.", "no-auth-event": "An internal error has occurred.", "no-such-provider": "User was not linked to an account with the given provider.", "operation-not-allowed": "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.", "operation-not-supported-in-this-environment": 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
    "popup-blocked": "Unable to establish a connection with the popup. It may have been blocked by the browser.", "popup-closed-by-user": "The popup has been closed by the user before finalizing the operation.", "provider-already-linked": "User can only be linked to one identity for the given provider.", "quota-exceeded": "The project's quota for this operation has been exceeded.", "redirect-cancelled-by-user": "The redirect operation has been cancelled by the user before finalizing.", "redirect-operation-pending": "A redirect sign-in operation is already pending.",
    timeout: "The operation has timed out.", "user-token-expired": "The user's credential is no longer valid. The user must sign in again.", "too-many-requests": "We have blocked all requests from this device due to unusual activity. Try again later.", "unauthorized-continue-uri": "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.", "unsupported-persistence-type": "The current environment does not support the specified persistence type.", "user-cancelled": "User did not grant your application the permissions it requested.",
    "user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.", "user-disabled": "The user account has been disabled by an administrator.", "user-mismatch": "The supplied credentials do not correspond to the previously signed in user.", "user-signed-out": "", "weak-password": "The password must be 6 characters long or more.", "web-storage-unsupported": "This browser is not supported or 3rd party cookies and data may be disabled." };function Xe(a) {
    var b = a[Ye];if ("undefined" === typeof b) throw new M("missing-continue-uri");if ("string" !== typeof b || "string" === typeof b && !b.length) throw new M("invalid-continue-uri");this.h = b;this.b = this.a = null;this.g = !1;var c = a[Ze];if (c && "object" === typeof c) {
      b = c[$e];var d = c[af];c = c[bf];if ("string" === typeof b && b.length) {
        this.a = b;if ("undefined" !== typeof d && "boolean" !== typeof d) throw new M("argument-error", af + " property must be a boolean when specified.");this.g = !!d;if ("undefined" !== typeof c && ("string" !== typeof c || "string" === typeof c && !c.length)) throw new M("argument-error", bf + " property must be a non empty string when specified.");this.b = c || null;
      } else {
        if ("undefined" !== typeof b) throw new M("argument-error", $e + " property must be a non empty string when specified.");if ("undefined" !== typeof d || "undefined" !== typeof c) throw new M("missing-android-pkg-name");
      }
    } else if ("undefined" !== typeof c) throw new M("argument-error", Ze + " property must be a non null object when specified.");this.f = null;if ((b = a[cf]) && "object" === typeof b) {
      if (b = b[df], "string" === typeof b && b.length) this.f = b;else {
        if ("undefined" !== typeof b) throw new M("argument-error", df + " property must be a non empty string when specified.");
      }
    } else if ("undefined" !== typeof b) throw new M("argument-error", cf + " property must be a non null object when specified.");a = a[ef];if ("undefined" !== typeof a && "boolean" !== typeof a) throw new M("argument-error", ef + " property must be a boolean when specified.");this.c = !!a;
  }
  var Ze = "android",
      ef = "handleCodeInApp",
      cf = "iOS",
      Ye = "url",
      af = "installApp",
      bf = "minimumVersion",
      $e = "packageName",
      df = "bundleId";function ff(a) {
    var b = {};b.continueUrl = a.h;b.canHandleCodeInApp = a.c;if (b.androidPackageName = a.a) b.androidMinimumVersion = a.b, b.androidInstallApp = a.g;b.iOSBundleId = a.f;for (var c in b) {
      null === b[c] && delete b[c];
    }return b;
  };function gf(a) {
    return Ba(a, function (a) {
      a = a.toString(16);return 1 < a.length ? a : "0" + a;
    }).join("");
  };var hf = null,
      jf = null;function kf(a) {
    var b = "";lf(a, function (a) {
      b += String.fromCharCode(a);
    });return b;
  }function lf(a, b) {
    function c(b) {
      for (; d < a.length;) {
        var c = a.charAt(d++),
            e = jf[c];if (null != e) return e;if (!/^[\s\xa0]*$/.test(c)) throw Error("Unknown base64 encoding at char: " + c);
      }return b;
    }mf();for (var d = 0;;) {
      var e = c(-1),
          f = c(0),
          h = c(64),
          m = c(64);if (64 === m && -1 === e) break;b(e << 2 | f >> 4);64 != h && (b(f << 4 & 240 | h >> 2), 64 != m && b(h << 6 & 192 | m));
    }
  }
  function mf() {
    if (!hf) {
      hf = {};jf = {};for (var a = 0; 65 > a; a++) {
        hf[a] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a), jf[hf[a]] = a, 62 <= a && (jf["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)] = a);
      }
    }
  };function nf(a) {
    this.c = a.sub;na();this.a = a.provider_id || a.firebase && a.firebase.sign_in_provider || null;this.b = !!a.is_anonymous || "anonymous" == this.a;
  }nf.prototype.f = function () {
    return this.b;
  };function of(a) {
    return (a = pf(a)) && a.sub && a.iss && a.aud && a.exp ? new nf(a) : null;
  }function pf(a) {
    if (!a) return null;a = a.split(".");if (3 != a.length) return null;a = a[1];for (var b = (4 - a.length % 4) % 4, c = 0; c < b; c++) {
      a += ".";
    }try {
      return JSON.parse(kf(a));
    } catch (d) {}return null;
  };var qf = "oauth_consumer_key oauth_nonce oauth_signature oauth_signature_method oauth_timestamp oauth_token oauth_version".split(" "),
      rf = ["client_id", "response_type", "scope", "redirect_uri", "state"],
      sf = { Rc: { Ma: "locale", Aa: 500, za: 600, Na: "facebook.com", cb: rf }, Tc: { Ma: null, Aa: 500, za: 620, Na: "github.com", cb: rf }, Uc: { Ma: "hl", Aa: 515, za: 680, Na: "google.com", cb: rf }, $c: { Ma: "lang", Aa: 485, za: 705, Na: "twitter.com", cb: qf } };function tf(a) {
    for (var b in sf) {
      if (sf[b].Na == a) return sf[b];
    }return null;
  };function uf(a) {
    var b = {};b["facebook.com"] = vf;b["google.com"] = wf;b["github.com"] = xf;b["twitter.com"] = yf;var c = a && a[zf];try {
      if (c) return b[c] ? new b[c](a) : new Af(a);if ("undefined" !== typeof a[Bf]) return new Cf(a);
    } catch (d) {}return null;
  }var Bf = "idToken",
      zf = "providerId";
  function Cf(a) {
    var b = a[zf];if (!b && a[Bf]) {
      var c = of(a[Bf]);c && c.a && (b = c.a);
    }if (!b) throw Error("Invalid additional user info!");if ("anonymous" == b || "custom" == b) b = null;c = !1;"undefined" !== typeof a.isNewUser ? c = !!a.isNewUser : "identitytoolkit#SignupNewUserResponse" === a.kind && (c = !0);K(this, "providerId", b);K(this, "isNewUser", c);
  }function Af(a) {
    Cf.call(this, a);a = we(a.rawUserInfo || "{}");K(this, "profile", Ke(a || {}));
  }t(Af, Cf);
  function vf(a) {
    Af.call(this, a);if ("facebook.com" != this.providerId) throw Error("Invalid provider ID!");
  }t(vf, Af);function xf(a) {
    Af.call(this, a);if ("github.com" != this.providerId) throw Error("Invalid provider ID!");K(this, "username", this.profile && this.profile.login || null);
  }t(xf, Af);function wf(a) {
    Af.call(this, a);if ("google.com" != this.providerId) throw Error("Invalid provider ID!");
  }t(wf, Af);
  function yf(a) {
    Af.call(this, a);if ("twitter.com" != this.providerId) throw Error("Invalid provider ID!");K(this, "username", a.screenName || null);
  }t(yf, Af);function Df(a) {
    this.a = cd(a);
  };function Ef(a) {
    var b = cd(a),
        c = bd(b, "link"),
        d = bd(cd(c), "link");b = bd(b, "deep_link_id");return bd(cd(b), "link") || b || d || c || a;
  };function Ff(a, b) {
    return a.then(function (a) {
      if (a[Gf]) {
        var c = of(a[Gf]);if (!c || b != c.c) throw new M("user-mismatch");return a;
      }throw new M("user-mismatch");
    }).m(function (a) {
      throw a && a.code && a.code == Ue + "user-not-found" ? new M("user-mismatch") : a;
    });
  }
  function Hf(a, b, c) {
    if (b.idToken || b.accessToken) b.idToken && K(this, "idToken", b.idToken), b.accessToken && K(this, "accessToken", b.accessToken);else if (b.oauthToken && b.oauthTokenSecret) K(this, "accessToken", b.oauthToken), K(this, "secret", b.oauthTokenSecret);else throw new M("internal-error", "failed to construct a credential");K(this, "providerId", a);K(this, "signInMethod", c);
  }Hf.prototype.xa = function (a) {
    return If(a, Jf(this));
  };Hf.prototype.c = function (a, b) {
    var c = Jf(this);c.idToken = b;return Kf(a, c);
  };
  Hf.prototype.f = function (a, b) {
    var c = Jf(this);return Ff(Lf(a, c), b);
  };function Jf(a) {
    var b = {};a.idToken && (b.id_token = a.idToken);a.accessToken && (b.access_token = a.accessToken);a.secret && (b.oauth_token_secret = a.secret);b.providerId = a.providerId;return { postBody: gd(b).toString(), requestUri: "http://localhost" };
  }
  Hf.prototype.C = function () {
    var a = { providerId: this.providerId, signInMethod: this.signInMethod };this.idToken && (a.oauthIdToken = this.idToken);this.accessToken && (a.oauthAccessToken = this.accessToken);this.secret && (a.oauthTokenSecret = this.secret);return a;
  };function Mf(a, b) {
    this.Ac = b || [];L(this, { providerId: a, isOAuthProvider: !0 });this.tb = {};this.Za = (tf(a) || {}).Ma || null;this.Xa = null;
  }Mf.prototype.Ca = function (a) {
    this.tb = Za(a);return this;
  };function N(a) {
    Mf.call(this, a, rf);this.a = [];
  }t(N, Mf);
  N.prototype.ta = function (a) {
    Fa(this.a, a) || this.a.push(a);return this;
  };N.prototype.yb = function () {
    return Ia(this.a);
  };N.prototype.credential = function (a, b) {
    if (!a && !b) throw new M("argument-error", "credential failed: must provide the ID token and/or the access token.");return new Hf(this.providerId, { idToken: a || null, accessToken: b || null }, this.providerId);
  };function Nf() {
    N.call(this, "facebook.com");
  }t(Nf, N);K(Nf, "PROVIDER_ID", "facebook.com");K(Nf, "FACEBOOK_SIGN_IN_METHOD", "facebook.com");
  function Of(a) {
    if (!a) throw new M("argument-error", "credential failed: expected 1 argument (the OAuth access token).");var b = a;q(a) && (b = a.accessToken);return new Nf().credential(null, b);
  }function Pf() {
    N.call(this, "github.com");
  }t(Pf, N);K(Pf, "PROVIDER_ID", "github.com");K(Pf, "GITHUB_SIGN_IN_METHOD", "github.com");function Qf(a) {
    if (!a) throw new M("argument-error", "credential failed: expected 1 argument (the OAuth access token).");var b = a;q(a) && (b = a.accessToken);return new Pf().credential(null, b);
  }
  function Rf() {
    N.call(this, "google.com");this.ta("profile");
  }t(Rf, N);K(Rf, "PROVIDER_ID", "google.com");K(Rf, "GOOGLE_SIGN_IN_METHOD", "google.com");function Sf(a, b) {
    var c = a;q(a) && (c = a.idToken, b = a.accessToken);return new Rf().credential(c, b);
  }function Tf() {
    Mf.call(this, "twitter.com", qf);
  }t(Tf, Mf);K(Tf, "PROVIDER_ID", "twitter.com");K(Tf, "TWITTER_SIGN_IN_METHOD", "twitter.com");
  function Uf(a, b) {
    var c = a;q(c) || (c = { oauthToken: a, oauthTokenSecret: b });if (!c.oauthToken || !c.oauthTokenSecret) throw new M("argument-error", "credential failed: expected 2 arguments (the OAuth access token and secret).");return new Hf("twitter.com", c, "twitter.com");
  }function Vf(a, b, c) {
    this.a = a;this.b = b;K(this, "providerId", "password");K(this, "signInMethod", c === O.EMAIL_LINK_SIGN_IN_METHOD ? O.EMAIL_LINK_SIGN_IN_METHOD : O.EMAIL_PASSWORD_SIGN_IN_METHOD);
  }
  Vf.prototype.xa = function (a) {
    return this.signInMethod == O.EMAIL_LINK_SIGN_IN_METHOD ? P(a, Wf, { email: this.a, oobCode: this.b }) : P(a, Xf, { email: this.a, password: this.b });
  };Vf.prototype.c = function (a, b) {
    return this.signInMethod == O.EMAIL_LINK_SIGN_IN_METHOD ? P(a, Yf, { idToken: b, email: this.a, oobCode: this.b }) : P(a, Zf, { idToken: b, email: this.a, password: this.b });
  };Vf.prototype.f = function (a, b) {
    return Ff(this.xa(a), b);
  };Vf.prototype.C = function () {
    return { email: this.a, password: this.b, signInMethod: this.signInMethod };
  };
  function O() {
    L(this, { providerId: "password", isOAuthProvider: !1 });
  }function $f(a, b) {
    b = ag(b);if (!b) throw new M("argument-error", "Invalid email link!");return new Vf(a, b, O.EMAIL_LINK_SIGN_IN_METHOD);
  }function ag(a) {
    a = Ef(a);a = new Df(a);var b = bd(a.a, "oobCode") || null;return "signIn" === (bd(a.a, "mode") || null) && b ? b : null;
  }L(O, { PROVIDER_ID: "password" });L(O, { EMAIL_LINK_SIGN_IN_METHOD: "emailLink" });L(O, { EMAIL_PASSWORD_SIGN_IN_METHOD: "password" });
  function bg(a) {
    if (!(a.Ra && a.Qa || a.Ea && a.Z)) throw new M("internal-error");this.a = a;K(this, "providerId", "phone");K(this, "signInMethod", "phone");
  }bg.prototype.xa = function (a) {
    return a.Sa(cg(this));
  };bg.prototype.c = function (a, b) {
    var c = cg(this);c.idToken = b;return P(a, dg, c);
  };bg.prototype.f = function (a, b) {
    var c = cg(this);c.operation = "REAUTH";a = P(a, eg, c);return Ff(a, b);
  };
  bg.prototype.C = function () {
    var a = { providerId: "phone" };this.a.Ra && (a.verificationId = this.a.Ra);this.a.Qa && (a.verificationCode = this.a.Qa);this.a.Ea && (a.temporaryProof = this.a.Ea);this.a.Z && (a.phoneNumber = this.a.Z);return a;
  };function cg(a) {
    return a.a.Ea && a.a.Z ? { temporaryProof: a.a.Ea, phoneNumber: a.a.Z } : { sessionInfo: a.a.Ra, code: a.a.Qa };
  }
  function fg(a) {
    try {
      this.a = a || firebase.auth();
    } catch (b) {
      throw new M("argument-error", "Either an instance of firebase.auth.Auth must be passed as an argument to the firebase.auth.PhoneAuthProvider constructor, or the default firebase App instance must be initialized via firebase.initializeApp().");
    }L(this, { providerId: "phone", isOAuthProvider: !1 });
  }
  fg.prototype.Sa = function (a, b) {
    var c = this.a.b;return A(b.verify()).then(function (d) {
      if (!l(d)) throw new M("argument-error", "An implementation of firebase.auth.ApplicationVerifier.prototype.verify() must return a firebase.Promise that resolves with a string.");switch (b.type) {case "recaptcha":
          return gg(c, { phoneNumber: a, recaptchaToken: d }).then(function (a) {
            "function" === typeof b.reset && b.reset();return a;
          }, function (a) {
            "function" === typeof b.reset && b.reset();throw a;
          });default:
          throw new M("argument-error", 'Only firebase.auth.ApplicationVerifiers with type="recaptcha" are currently supported.');}
    });
  };function hg(a, b) {
    if (!a) throw new M("missing-verification-id");if (!b) throw new M("missing-verification-code");return new bg({ Ra: a, Qa: b });
  }L(fg, { PROVIDER_ID: "phone" });L(fg, { PHONE_SIGN_IN_METHOD: "phone" });
  function ig(a) {
    if (a.temporaryProof && a.phoneNumber) return new bg({ Ea: a.temporaryProof, Z: a.phoneNumber });var b = a && a.providerId;if (!b || "password" === b) return null;var c = a && a.oauthAccessToken,
        d = a && a.oauthTokenSecret;a = a && a.oauthIdToken;try {
      switch (b) {case "google.com":
          return Sf(a, c);case "facebook.com":
          return Of(c);case "github.com":
          return Qf(c);case "twitter.com":
          return Uf(c, d);default:
          return new N(b).credential(a, c);}
    } catch (e) {
      return null;
    }
  }
  function jg(a) {
    if (!a.isOAuthProvider) throw new M("invalid-oauth-provider");
  };function kg(a, b, c, d, e) {
    this.b = a;this.c = b || null;this.f = c || null;this.g = d || null;this.a = e || null;if (this.f || this.a) {
      if (this.f && this.a) throw new M("invalid-auth-event");if (this.f && !this.g) throw new M("invalid-auth-event");
    } else throw new M("invalid-auth-event");
  }kg.prototype.C = function () {
    return { type: this.b, eventId: this.c, urlResponse: this.f, sessionId: this.g, error: this.a && this.a.C() };
  };function lg(a) {
    a = a || {};return a.type ? new kg(a.type, a.eventId, a.urlResponse, a.sessionId, a.error && We(a.error)) : null;
  };function mg() {
    this.b = null;this.a = [];
  }var ng = null;mg.prototype.subscribe = function (a) {
    var b = this;this.a.push(a);this.b || (this.b = function (a) {
      for (var c = 0; c < b.a.length; c++) {
        b.a[c](a);
      }
    }, a = J("universalLinks.subscribe", k), "function" === typeof a && a(null, this.b));
  };mg.prototype.unsubscribe = function (a) {
    w(this.a, function (b) {
      return b == a;
    });
  };function og(a) {
    var b = "unauthorized-domain",
        c = void 0,
        d = cd(a);a = d.b;d = d.c;"chrome-extension" == d ? c = Ja("This chrome extension ID (chrome-extension://%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.", a) : "http" == d || "https" == d ? c = Ja("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.", a) : b = "operation-not-supported-in-this-environment";
    M.call(this, b, c);
  }t(og, M);function pg(a, b, c) {
    M.call(this, a, c);a = b || {};a.ub && K(this, "email", a.ub);a.Z && K(this, "phoneNumber", a.Z);a.credential && K(this, "credential", a.credential);
  }t(pg, M);pg.prototype.C = function () {
    var a = { code: this.code, message: this.message };this.email && (a.email = this.email);this.phoneNumber && (a.phoneNumber = this.phoneNumber);var b = this.credential && this.credential.C();b && ab(a, b);return a;
  };pg.prototype.toJSON = function () {
    return this.C();
  };
  function qg(a) {
    if (a.code) {
      var b = a.code || "";0 == b.indexOf(Ue) && (b = b.substring(Ue.length));var c = { credential: ig(a) };if (a.email) c.ub = a.email;else if (a.phoneNumber) c.Z = a.phoneNumber;else return new M(b, a.message || void 0);return new pg(b, c, a.message);
    }return null;
  };var rg = /^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;function sg() {}sg.prototype.c = null;function tg(a) {
    return a.c || (a.c = a.b());
  };var ug;function vg() {}t(vg, sg);vg.prototype.a = function () {
    var a = wg(this);return a ? new ActiveXObject(a) : new XMLHttpRequest();
  };vg.prototype.b = function () {
    var a = {};wg(this) && (a[0] = !0, a[1] = !0);return a;
  };
  function wg(a) {
    if (!a.f && "undefined" == typeof XMLHttpRequest && "undefined" != typeof ActiveXObject) {
      for (var b = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], c = 0; c < b.length; c++) {
        var d = b[c];try {
          return new ActiveXObject(d), a.f = d;
        } catch (e) {}
      }throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");
    }return a.f;
  }ug = new vg();function xg() {}t(xg, sg);xg.prototype.a = function () {
    var a = new XMLHttpRequest();if ("withCredentials" in a) return a;if ("undefined" != typeof XDomainRequest) return new yg();throw Error("Unsupported browser");
  };xg.prototype.b = function () {
    return {};
  };
  function yg() {
    this.a = new XDomainRequest();this.readyState = 0;this.onreadystatechange = null;this.responseText = "";this.status = -1;this.statusText = "";this.a.onload = r(this.bc, this);this.a.onerror = r(this.zb, this);this.a.onprogress = r(this.cc, this);this.a.ontimeout = r(this.fc, this);
  }g = yg.prototype;g.open = function (a, b, c) {
    if (null != c && !c) throw Error("Only async requests are supported.");this.a.open(a, b);
  };
  g.send = function (a) {
    if (a) {
      if ("string" == typeof a) this.a.send(a);else throw Error("Only string data is supported");
    } else this.a.send();
  };g.abort = function () {
    this.a.abort();
  };g.setRequestHeader = function () {};g.getResponseHeader = function (a) {
    return "content-type" == a.toLowerCase() ? this.a.contentType : "";
  };g.bc = function () {
    this.status = 200;this.responseText = this.a.responseText;zg(this, 4);
  };g.zb = function () {
    this.status = 500;this.responseText = "";zg(this, 4);
  };g.fc = function () {
    this.zb();
  };
  g.cc = function () {
    this.status = 200;zg(this, 1);
  };function zg(a, b) {
    a.readyState = b;if (a.onreadystatechange) a.onreadystatechange();
  }g.getAllResponseHeaders = function () {
    return "content-type: " + this.a.contentType;
  };function Ag(a, b, c) {
    this.reset(a, b, c, void 0, void 0);
  }Ag.prototype.a = null;var Bg = 0;Ag.prototype.reset = function (a, b, c, d, e) {
    "number" == typeof e || Bg++;d || na();delete this.a;
  };function Cg(a) {
    this.f = a;this.b = this.c = this.a = null;
  }function Dg(a, b) {
    this.name = a;this.value = b;
  }Dg.prototype.toString = function () {
    return this.name;
  };var Eg = new Dg("SEVERE", 1E3),
      Fg = new Dg("WARNING", 900),
      Gg = new Dg("CONFIG", 700),
      Hg = new Dg("FINE", 500);function Ig(a) {
    if (a.c) return a.c;if (a.a) return Ig(a.a);ra("Root logger has no level set.");return null;
  }Cg.prototype.log = function (a, b, c) {
    if (a.value >= Ig(this).value) for (n(b) && (b = b()), a = new Ag(a, String(b), this.f), c && (a.a = c), c = this; c;) {
      c = c.a;
    }
  };var Jg = {},
      Kg = null;
  function Lg(a) {
    Kg || (Kg = new Cg(""), Jg[""] = Kg, Kg.c = Gg);var b;if (!(b = Jg[a])) {
      b = new Cg(a);var c = a.lastIndexOf("."),
          d = a.substr(c + 1);c = Lg(a.substr(0, c));c.b || (c.b = {});c.b[d] = b;b.a = c;Jg[a] = b;
    }return b;
  };function Q(a, b) {
    a && a.log(Hg, b, void 0);
  };function Mg(a) {
    this.f = a;
  }t(Mg, sg);Mg.prototype.a = function () {
    return new Ng(this.f);
  };Mg.prototype.b = function (a) {
    return function () {
      return a;
    };
  }({});function Ng(a) {
    G.call(this);this.j = a;this.readyState = Og;this.status = 0;this.responseText = this.statusText = "";this.onreadystatechange = null;this.g = new Headers();this.b = null;this.h = "GET";this.c = "";this.a = !1;this.f = Lg("goog.net.FetchXmlHttp");
  }t(Ng, G);var Og = 0;g = Ng.prototype;
  g.open = function (a, b) {
    if (this.readyState != Og) throw this.abort(), Error("Error reopening a connection");this.h = a;this.c = b;this.readyState = 1;Pg(this);
  };g.send = function (a) {
    if (1 != this.readyState) throw this.abort(), Error("need to call open() first. ");this.a = !0;var b = { headers: this.g, method: this.h, credentials: void 0, cache: void 0 };a && (b.body = a);this.j.fetch(new Request(this.c, b)).then(this.ec.bind(this), this.Ab.bind(this));
  };
  g.abort = function () {
    this.responseText = "";this.g = new Headers();this.status = 0;1 <= this.readyState && this.a && 4 != this.readyState && (this.readyState = 4, this.a = !1, Pg(this));this.readyState = Og;
  };g.ec = function (a) {
    this.a && (this.b || (this.b = a.headers, this.readyState = 2, Pg(this)), this.a && (this.readyState = 3, Pg(this), this.a && a.text().then(this.dc.bind(this, a), this.Ab.bind(this))));
  };g.dc = function (a, b) {
    this.a && (this.status = a.status, this.statusText = a.statusText, this.responseText = b, this.readyState = 4, Pg(this));
  };
  g.Ab = function (a) {
    var b = this.f;b && b.log(Fg, "Failed to fetch url " + this.c, a instanceof Error ? a : Error(a));this.a && (this.readyState = 4, Pg(this));
  };g.setRequestHeader = function (a, b) {
    this.g.append(a, b);
  };g.getResponseHeader = function (a) {
    return this.b ? this.b.get(a.toLowerCase()) || "" : ((a = this.f) && a.log(Fg, "Attempting to get response header but no headers have been received for url: " + this.c, void 0), "");
  };
  g.getAllResponseHeaders = function () {
    if (!this.b) {
      var a = this.f;a && a.log(Fg, "Attempting to get all response headers but no headers have been received for url: " + this.c, void 0);return "";
    }a = [];for (var b = this.b.entries(), c = b.next(); !c.done;) {
      c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
    }return a.join("\r\n");
  };function Pg(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  };function Qg(a) {
    G.call(this);this.headers = new Kc();this.D = a || null;this.c = !1;this.B = this.a = null;this.h = this.N = this.l = "";this.f = this.I = this.j = this.G = !1;this.g = 0;this.s = null;this.o = Rg;this.v = this.O = !1;
  }t(Qg, G);var Rg = "";Qg.prototype.b = Lg("goog.net.XhrIo");var Sg = /^https?$/i,
      Tg = ["POST", "PUT"];
  function Ug(a, b, c, d, e) {
    if (a.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + a.l + "; newUri=" + b);c = c ? c.toUpperCase() : "GET";a.l = b;a.h = "";a.N = c;a.G = !1;a.c = !0;a.a = a.D ? a.D.a() : ug.a();a.B = a.D ? tg(a.D) : tg(ug);a.a.onreadystatechange = r(a.Db, a);try {
      Q(a.b, Vg(a, "Opening Xhr")), a.I = !0, a.a.open(c, String(b), !0), a.I = !1;
    } catch (h) {
      Q(a.b, Vg(a, "Error opening Xhr: " + h.message));Wg(a, h);return;
    }b = d || "";var f = new Kc(a.headers);e && Ic(e, function (a, b) {
      f.set(b, a);
    });e = Da(f.U());d = k.FormData && b instanceof k.FormData;!Fa(Tg, c) || e || d || f.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");f.forEach(function (a, b) {
      this.a.setRequestHeader(b, a);
    }, a);a.o && (a.a.responseType = a.o);"withCredentials" in a.a && a.a.withCredentials !== a.O && (a.a.withCredentials = a.O);try {
      Xg(a), 0 < a.g && (a.v = Yg(a.a), Q(a.b, Vg(a, "Will abort after " + a.g + "ms if incomplete, xhr2 " + a.v)), a.v ? (a.a.timeout = a.g, a.a.ontimeout = r(a.Fa, a)) : a.s = Ec(a.Fa, a.g, a)), Q(a.b, Vg(a, "Sending request")), a.j = !0, a.a.send(b), a.j = !1;
    } catch (h) {
      Q(a.b, Vg(a, "Send error: " + h.message)), Wg(a, h);
    }
  }function Yg(a) {
    return C && Wb(9) && "number" == typeof a.timeout && void 0 !== a.ontimeout;
  }function Ea(a) {
    return "content-type" == a.toLowerCase();
  }g = Qg.prototype;g.Fa = function () {
    "undefined" != typeof aa && this.a && (this.h = "Timed out after " + this.g + "ms, aborting", Q(this.b, Vg(this, this.h)), this.dispatchEvent("timeout"), this.abort(8));
  };function Wg(a, b) {
    a.c = !1;a.a && (a.f = !0, a.a.abort(), a.f = !1);a.h = b;Zg(a);$g(a);
  }
  function Zg(a) {
    a.G || (a.G = !0, a.dispatchEvent("complete"), a.dispatchEvent("error"));
  }g.abort = function () {
    this.a && this.c && (Q(this.b, Vg(this, "Aborting")), this.c = !1, this.f = !0, this.a.abort(), this.f = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), $g(this));
  };g.ua = function () {
    this.a && (this.c && (this.c = !1, this.f = !0, this.a.abort(), this.f = !1), $g(this, !0));Qg.lb.ua.call(this);
  };g.Db = function () {
    this.pa || (this.I || this.j || this.f ? ah(this) : this.tc());
  };g.tc = function () {
    ah(this);
  };
  function ah(a) {
    if (a.c && "undefined" != typeof aa) if (a.B[1] && 4 == bh(a) && 2 == ch(a)) Q(a.b, Vg(a, "Local request error detected and ignored"));else if (a.j && 4 == bh(a)) Ec(a.Db, 0, a);else if (a.dispatchEvent("readystatechange"), 4 == bh(a)) {
      Q(a.b, Vg(a, "Request complete"));a.c = !1;try {
        var b = ch(a);a: switch (b) {case 200:case 201:case 202:case 204:case 206:case 304:case 1223:
            var c = !0;break a;default:
            c = !1;}var d;if (!(d = c)) {
          var e;if (e = 0 === b) {
            var f = String(a.l).match(Nc)[1] || null;if (!f && k.self && k.self.location) {
              var h = k.self.location.protocol;
              f = h.substr(0, h.length - 1);
            }e = !Sg.test(f ? f.toLowerCase() : "");
          }d = e;
        }if (d) a.dispatchEvent("complete"), a.dispatchEvent("success");else {
          try {
            var m = 2 < bh(a) ? a.a.statusText : "";
          } catch (p) {
            Q(a.b, "Can not get status: " + p.message), m = "";
          }a.h = m + " [" + ch(a) + "]";Zg(a);
        }
      } finally {
        $g(a);
      }
    }
  }function $g(a, b) {
    if (a.a) {
      Xg(a);var c = a.a,
          d = a.B[0] ? ca : null;a.a = null;a.B = null;b || a.dispatchEvent("ready");try {
        c.onreadystatechange = d;
      } catch (e) {
        (a = a.b) && a.log(Eg, "Problem encountered resetting onreadystatechange: " + e.message, void 0);
      }
    }
  }
  function Xg(a) {
    a.a && a.v && (a.a.ontimeout = null);a.s && (k.clearTimeout(a.s), a.s = null);
  }function bh(a) {
    return a.a ? a.a.readyState : 0;
  }function ch(a) {
    try {
      return 2 < bh(a) ? a.a.status : -1;
    } catch (b) {
      return -1;
    }
  }function dh(a) {
    try {
      return a.a ? a.a.responseText : "";
    } catch (b) {
      return Q(a.b, "Can not get responseText: " + b.message), "";
    }
  }
  g.getResponse = function () {
    try {
      if (!this.a) return null;if ("response" in this.a) return this.a.response;switch (this.o) {case Rg:case "text":
          return this.a.responseText;case "arraybuffer":
          if ("mozResponseArrayBuffer" in this.a) return this.a.mozResponseArrayBuffer;}var a = this.b;a && a.log(Eg, "Response type " + this.o + " is not supported on this browser", void 0);return null;
    } catch (b) {
      return Q(this.b, "Can not get response: " + b.message), null;
    }
  };function Vg(a, b) {
    return b + " [" + a.N + " " + a.l + " " + ch(a) + "]";
  }; /*
     Portions of this code are from MochiKit, received by
     The Closure Authors under the MIT license. All other code is Copyright
     2005-2009 The Closure Authors. All Rights Reserved.
     */
  function eh(a, b) {
    this.g = [];this.v = a;this.s = b || null;this.f = this.a = !1;this.c = void 0;this.u = this.B = this.j = !1;this.h = 0;this.b = null;this.l = 0;
  }eh.prototype.cancel = function (a) {
    if (this.a) this.c instanceof eh && this.c.cancel();else {
      if (this.b) {
        var b = this.b;delete this.b;a ? b.cancel(a) : (b.l--, 0 >= b.l && b.cancel());
      }this.v ? this.v.call(this.s, this) : this.u = !0;this.a || (a = new fh(this), gh(this), hh(this, !1, a));
    }
  };eh.prototype.o = function (a, b) {
    this.j = !1;hh(this, a, b);
  };function hh(a, b, c) {
    a.a = !0;a.c = c;a.f = !b;ih(a);
  }
  function gh(a) {
    if (a.a) {
      if (!a.u) throw new jh(a);a.u = !1;
    }
  }eh.prototype.D = function () {
    gh(this);hh(this, !0, null);
  };function kh(a, b) {
    lh(a, null, b, void 0);
  }function lh(a, b, c, d) {
    a.g.push([b, c, d]);a.a && ih(a);
  }eh.prototype.then = function (a, b, c) {
    var d,
        e,
        f = new z(function (a, b) {
      d = a;e = b;
    });lh(this, d, function (a) {
      a instanceof fh ? f.cancel() : e(a);
    });return f.then(a, b, c);
  };oa(eh);function mh(a) {
    return Ca(a.g, function (a) {
      return n(a[1]);
    });
  }
  function ih(a) {
    if (a.h && a.a && mh(a)) {
      var b = a.h,
          c = nh[b];c && (k.clearTimeout(c.a), delete nh[b]);a.h = 0;
    }a.b && (a.b.l--, delete a.b);b = a.c;for (var d = c = !1; a.g.length && !a.j;) {
      var e = a.g.shift(),
          f = e[0],
          h = e[1];e = e[2];if (f = a.f ? h : f) try {
        var m = f.call(e || a.s, b);void 0 !== m && (a.f = a.f && (m == b || m instanceof Error), a.c = b = m);if (pa(b) || "function" === typeof k.Promise && b instanceof k.Promise) d = !0, a.j = !0;
      } catch (p) {
        b = p, a.f = !0, mh(a) || (c = !0);
      }
    }a.c = b;d && (m = r(a.o, a, !0), d = r(a.o, a, !1), b instanceof eh ? (lh(b, m, d), b.B = !0) : b.then(m, d));c && (b = new oh(b), nh[b.a] = b, a.h = b.a);
  }function jh() {
    u.call(this);
  }t(jh, u);jh.prototype.message = "Deferred has already fired";jh.prototype.name = "AlreadyCalledError";function fh() {
    u.call(this);
  }t(fh, u);fh.prototype.message = "Deferred was canceled";fh.prototype.name = "CanceledError";function oh(a) {
    this.a = k.setTimeout(r(this.c, this), 0);this.b = a;
  }oh.prototype.c = function () {
    delete nh[this.a];throw this.b;
  };var nh = {};function ph(a) {
    var b = {},
        c = b.document || document,
        d = sd(a),
        e = document.createElement("SCRIPT"),
        f = { Fb: e, Fa: void 0 },
        h = new eh(qh, f),
        m = null,
        p = null != b.timeout ? b.timeout : 5E3;0 < p && (m = window.setTimeout(function () {
      rh(e, !0);var a = new sh(th, "Timeout reached for loading script " + d);gh(h);hh(h, !1, a);
    }, p), f.Fa = m);e.onload = e.onreadystatechange = function () {
      e.readyState && "loaded" != e.readyState && "complete" != e.readyState || (rh(e, b.bd || !1, m), h.D());
    };e.onerror = function () {
      rh(e, !0, m);var a = new sh(uh, "Error while loading script " + d);gh(h);hh(h, !1, a);
    };f = b.attributes || {};ab(f, { type: "text/javascript", charset: "UTF-8" });Id(e, f);e.src = sd(a);vh(c).appendChild(e);return h;
  }function vh(a) {
    var b;return (b = (a || document).getElementsByTagName("HEAD")) && 0 != b.length ? b[0] : a.documentElement;
  }function qh() {
    if (this && this.Fb) {
      var a = this.Fb;a && "SCRIPT" == a.tagName && rh(a, !0, this.Fa);
    }
  }
  function rh(a, b, c) {
    null != c && k.clearTimeout(c);a.onload = ca;a.onerror = ca;a.onreadystatechange = ca;b && window.setTimeout(function () {
      a && a.parentNode && a.parentNode.removeChild(a);
    }, 0);
  }var uh = 0,
      th = 1;function sh(a, b) {
    var c = "Jsloader error (code #" + a + ")";b && (c += ": " + b);u.call(this, c);this.code = a;
  }t(sh, u);function wh(a) {
    this.f = a;
  }t(wh, sg);wh.prototype.a = function () {
    return new this.f();
  };wh.prototype.b = function () {
    return {};
  };
  function xh(a, b, c) {
    this.b = a;a = b || {};this.j = a.secureTokenEndpoint || "https://securetoken.googleapis.com/v1/token";this.l = a.secureTokenTimeout || yh;this.f = Za(a.secureTokenHeaders || zh);this.g = a.firebaseEndpoint || "https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.h = a.firebaseTimeout || Ah;this.a = Za(a.firebaseHeaders || Bh);c && (this.a["X-Client-Version"] = c, this.f["X-Client-Version"] = c);c = "Node" == le();c = k.XMLHttpRequest || c && firebase.INTERNAL.node && firebase.INTERNAL.node.XMLHttpRequest;if (!c && !ke()) throw new M("internal-error", "The XMLHttpRequest compatibility library was not found.");this.c = void 0;ke() ? this.c = new Mg(self) : me() ? this.c = new wh(c) : this.c = new xg();
  }var Ch,
      Gf = "idToken",
      yh = new ze(3E4, 6E4),
      zh = { "Content-Type": "application/x-www-form-urlencoded" },
      Ah = new ze(3E4, 6E4),
      Bh = { "Content-Type": "application/json" };function Dh(a, b) {
    b ? a.a["X-Firebase-Locale"] = b : delete a.a["X-Firebase-Locale"];
  }
  function Eh(a, b) {
    b ? (a.a["X-Client-Version"] = b, a.f["X-Client-Version"] = b) : (delete a.a["X-Client-Version"], delete a.f["X-Client-Version"]);
  }function Fh(a, b, c, d, e, f, h) {
    Xd() || ke() ? a = r(a.o, a) : (Ch || (Ch = new z(function (a, b) {
      Gh(a, b);
    })), a = r(a.u, a));a(b, c, d, e, f, h);
  }
  xh.prototype.o = function (a, b, c, d, e, f) {
    if (ke() && ("undefined" === typeof k.fetch || "undefined" === typeof k.Headers || "undefined" === typeof k.Request)) throw new M("operation-not-supported-in-this-environment", "fetch, Headers and Request native APIs or equivalent Polyfills must be available to support HTTP requests from a Worker environment.");var h = new Qg(this.c);if (f) {
      h.g = Math.max(0, f);var m = setTimeout(function () {
        h.dispatchEvent("timeout");
      }, f);
    }sc(h, "complete", function () {
      m && clearTimeout(m);var a = null;try {
        a = JSON.parse(dh(this)) || null;
      } catch (E) {
        a = null;
      }b && b(a);
    });yc(h, "ready", function () {
      m && clearTimeout(m);Ib(this);
    });yc(h, "timeout", function () {
      m && clearTimeout(m);Ib(this);b && b(null);
    });Ug(h, a, c, d, e);
  };var Hh = pd("https://apis.google.com/js/client.js?onload=%{onload}"),
      Ih = "__fcb" + Math.floor(1E6 * Math.random()).toString();
  function Gh(a, b) {
    if (((window.gapi || {}).client || {}).request) a();else {
      k[Ih] = function () {
        ((window.gapi || {}).client || {}).request ? a() : b(Error("CORS_UNSUPPORTED"));
      };var c = td(Hh, { onload: Ih });kh(ph(c), function () {
        b(Error("CORS_UNSUPPORTED"));
      });
    }
  }
  xh.prototype.u = function (a, b, c, d, e) {
    var f = this;Ch.then(function () {
      window.gapi.client.setApiKey(f.b);var h = window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({ path: a, method: c, body: d, headers: e, authType: "none", callback: function callback(a) {
          window.gapi.auth.setToken(h);b && b(a);
        } });
    }).m(function (a) {
      b && b({ error: { message: a && a.message || "CORS_UNSUPPORTED" } });
    });
  };
  function Jh(a, b) {
    return new z(function (c, d) {
      "refresh_token" == b.grant_type && b.refresh_token || "authorization_code" == b.grant_type && b.code ? Fh(a, a.j + "?key=" + encodeURIComponent(a.b), function (a) {
        a ? a.error ? d(Kh(a)) : a.access_token && a.refresh_token ? c(a) : d(new M("internal-error")) : d(new M("network-request-failed"));
      }, "POST", gd(b).toString(), a.f, a.l.get()) : d(new M("internal-error"));
    });
  }
  function Lh(a, b, c, d, e, f) {
    var h = cd(a.g + b);H(h, "key", a.b);f && H(h, "cb", na().toString());var m = "GET" == c;if (m) for (var p in d) {
      d.hasOwnProperty(p) && H(h, p, d[p]);
    }return new z(function (b, f) {
      Fh(a, h.toString(), function (a) {
        a ? a.error ? f(Kh(a, e || {})) : b(a) : f(new M("network-request-failed"));
      }, c, m ? void 0 : Nd(ve(d)), a.a, a.h.get());
    });
  }function Mh(a) {
    if (!rg.test(a.email)) throw new M("invalid-email");
  }function Nh(a) {
    "email" in a && Mh(a);
  }
  function Oh(a, b) {
    return P(a, Ph, { identifier: b, continueUri: se() ? Ud() : "http://localhost" }).then(function (a) {
      return a.allProviders || [];
    });
  }function Qh(a, b) {
    return P(a, Ph, { identifier: b, continueUri: se() ? Ud() : "http://localhost" }).then(function (a) {
      return a.signinMethods || [];
    });
  }function Rh(a) {
    return P(a, Sh, {}).then(function (a) {
      return a.authorizedDomains || [];
    });
  }function Th(a) {
    if (!a[Gf]) throw new M("internal-error");
  }
  function Uh(a) {
    if (a.phoneNumber || a.temporaryProof) {
      if (!a.phoneNumber || !a.temporaryProof) throw new M("internal-error");
    } else {
      if (!a.sessionInfo) throw new M("missing-verification-id");if (!a.code) throw new M("missing-verification-code");
    }
  }xh.prototype.jb = function () {
    return P(this, Vh, {});
  };xh.prototype.mb = function (a, b) {
    return P(this, Wh, { idToken: a, email: b });
  };xh.prototype.nb = function (a, b) {
    return P(this, Zf, { idToken: a, password: b });
  };var Xh = { displayName: "DISPLAY_NAME", photoUrl: "PHOTO_URL" };g = xh.prototype;
  g.ob = function (a, b) {
    var c = { idToken: a },
        d = [];Xa(Xh, function (a, f) {
      var e = b[f];null === e ? d.push(a) : f in b && (c[f] = e);
    });d.length && (c.deleteAttribute = d);return P(this, Wh, c);
  };g.gb = function (a, b) {
    a = { requestType: "PASSWORD_RESET", email: a };ab(a, b);return P(this, Yh, a);
  };g.hb = function (a, b) {
    a = { requestType: "EMAIL_SIGNIN", email: a };ab(a, b);return P(this, Zh, a);
  };g.fb = function (a, b) {
    a = { requestType: "VERIFY_EMAIL", idToken: a };ab(a, b);return P(this, $h, a);
  };function gg(a, b) {
    return P(a, ai, b);
  }g.Sa = function (a) {
    return P(this, bi, a);
  };
  function ci(a, b, c) {
    return P(a, di, { idToken: b, deleteProvider: c });
  }function ei(a) {
    if (!a.requestUri || !a.sessionId && !a.postBody) throw new M("internal-error");
  }
  function fi(a) {
    var b = null;a.needConfirmation ? (a.code = "account-exists-with-different-credential", b = qg(a)) : "FEDERATED_USER_ID_ALREADY_LINKED" == a.errorMessage ? (a.code = "credential-already-in-use", b = qg(a)) : "EMAIL_EXISTS" == a.errorMessage ? (a.code = "email-already-in-use", b = qg(a)) : a.errorMessage && (b = gi(a.errorMessage));if (b) throw b;if (!a[Gf]) throw new M("internal-error");
  }function If(a, b) {
    b.returnIdpCredential = !0;return P(a, hi, b);
  }function Kf(a, b) {
    b.returnIdpCredential = !0;return P(a, ii, b);
  }
  function Lf(a, b) {
    b.returnIdpCredential = !0;b.autoCreate = !1;return P(a, ji, b);
  }function ki(a) {
    if (!a.oobCode) throw new M("invalid-action-code");
  }g.Wa = function (a, b) {
    return P(this, li, { oobCode: a, newPassword: b });
  };g.Ia = function (a) {
    return P(this, mi, { oobCode: a });
  };g.Ua = function (a) {
    return P(this, ni, { oobCode: a });
  };
  var ni = { endpoint: "setAccountInfo", A: ki, ba: "email" },
      mi = { endpoint: "resetPassword", A: ki, J: function J(a) {
      var b = a.requestType;if (!b || !a.email && "EMAIL_SIGNIN" != b) throw new M("internal-error");
    } },
      oi = { endpoint: "signupNewUser", A: function A(a) {
      Mh(a);if (!a.password) throw new M("weak-password");
    }, J: Th, R: !0 },
      Ph = { endpoint: "createAuthUri" },
      pi = { endpoint: "deleteAccount", T: ["idToken"] },
      di = { endpoint: "setAccountInfo", T: ["idToken", "deleteProvider"], A: function A(a) {
      if (!fa(a.deleteProvider)) throw new M("internal-error");
    } },
      Wf = { endpoint: "emailLinkSignin", T: ["email", "oobCode"], A: Mh, J: Th, R: !0 },
      Yf = { endpoint: "emailLinkSignin", T: ["idToken", "email", "oobCode"], A: Mh, J: Th, R: !0 },
      qi = { endpoint: "getAccountInfo" },
      Zh = { endpoint: "getOobConfirmationCode", T: ["requestType"], A: function A(a) {
      if ("EMAIL_SIGNIN" != a.requestType) throw new M("internal-error");Mh(a);
    }, ba: "email" },
      $h = { endpoint: "getOobConfirmationCode", T: ["idToken", "requestType"], A: function A(a) {
      if ("VERIFY_EMAIL" != a.requestType) throw new M("internal-error");
    }, ba: "email" },
      Yh = { endpoint: "getOobConfirmationCode",
    T: ["requestType"], A: function A(a) {
      if ("PASSWORD_RESET" != a.requestType) throw new M("internal-error");Mh(a);
    }, ba: "email" },
      Sh = { pb: !0, endpoint: "getProjectConfig", Cb: "GET" },
      ri = { pb: !0, endpoint: "getRecaptchaParam", Cb: "GET", J: function J(a) {
      if (!a.recaptchaSiteKey) throw new M("internal-error");
    } },
      li = { endpoint: "resetPassword", A: ki, ba: "email" },
      ai = { endpoint: "sendVerificationCode", T: ["phoneNumber", "recaptchaToken"], ba: "sessionInfo" },
      Wh = { endpoint: "setAccountInfo", T: ["idToken"], A: Nh, R: !0 },
      Zf = { endpoint: "setAccountInfo",
    T: ["idToken"], A: function A(a) {
      Nh(a);if (!a.password) throw new M("weak-password");
    }, J: Th, R: !0 },
      Vh = { endpoint: "signupNewUser", J: Th, R: !0 },
      hi = { endpoint: "verifyAssertion", A: ei, J: fi, R: !0 },
      ji = { endpoint: "verifyAssertion", A: ei, J: function J(a) {
      if (a.errorMessage && "USER_NOT_FOUND" == a.errorMessage) throw new M("user-not-found");if (a.errorMessage) throw gi(a.errorMessage);if (!a[Gf]) throw new M("internal-error");
    }, R: !0 },
      ii = { endpoint: "verifyAssertion", A: function A(a) {
      ei(a);if (!a.idToken) throw new M("internal-error");
    }, J: fi,
    R: !0 },
      si = { endpoint: "verifyCustomToken", A: function A(a) {
      if (!a.token) throw new M("invalid-custom-token");
    }, J: Th, R: !0 },
      Xf = { endpoint: "verifyPassword", A: function A(a) {
      Mh(a);if (!a.password) throw new M("wrong-password");
    }, J: Th, R: !0 },
      bi = { endpoint: "verifyPhoneNumber", A: Uh, J: Th },
      dg = { endpoint: "verifyPhoneNumber", A: function A(a) {
      if (!a.idToken) throw new M("internal-error");Uh(a);
    }, J: function J(a) {
      if (a.temporaryProof) throw a.code = "credential-already-in-use", qg(a);Th(a);
    } },
      eg = { Tb: { USER_NOT_FOUND: "user-not-found" }, endpoint: "verifyPhoneNumber",
    A: Uh, J: Th };function P(a, b, c) {
    if (!Je(c, b.T)) return B(new M("internal-error"));var d = b.Cb || "POST",
        e;return A(c).then(b.A).then(function () {
      b.R && (c.returnSecureToken = !0);return Lh(a, b.endpoint, d, c, b.Tb, b.pb || !1);
    }).then(function (a) {
      return e = a;
    }).then(b.J).then(function () {
      if (!b.ba) return e;if (!(b.ba in e)) throw new M("internal-error");return e[b.ba];
    });
  }function gi(a) {
    return Kh({ error: { errors: [{ message: a }], code: 400, message: a } });
  }
  function Kh(a, b) {
    var c = (a.error && a.error.errors && a.error.errors[0] || {}).reason || "";var d = { keyInvalid: "invalid-api-key", ipRefererBlocked: "app-not-authorized" };if (c = d[c] ? new M(d[c]) : null) return c;c = a.error && a.error.message || "";d = { INVALID_CUSTOM_TOKEN: "invalid-custom-token", CREDENTIAL_MISMATCH: "custom-token-mismatch", MISSING_CUSTOM_TOKEN: "internal-error", INVALID_IDENTIFIER: "invalid-email", MISSING_CONTINUE_URI: "internal-error", INVALID_EMAIL: "invalid-email", INVALID_PASSWORD: "wrong-password", USER_DISABLED: "user-disabled",
      MISSING_PASSWORD: "internal-error", EMAIL_EXISTS: "email-already-in-use", PASSWORD_LOGIN_DISABLED: "operation-not-allowed", INVALID_IDP_RESPONSE: "invalid-credential", FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use", INVALID_MESSAGE_PAYLOAD: "invalid-message-payload", INVALID_RECIPIENT_EMAIL: "invalid-recipient-email", INVALID_SENDER: "invalid-sender", EMAIL_NOT_FOUND: "user-not-found", EXPIRED_OOB_CODE: "expired-action-code", INVALID_OOB_CODE: "invalid-action-code", MISSING_OOB_CODE: "internal-error", CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
      INVALID_ID_TOKEN: "invalid-user-token", TOKEN_EXPIRED: "user-token-expired", USER_NOT_FOUND: "user-token-expired", CORS_UNSUPPORTED: "cors-unsupported", DYNAMIC_LINK_NOT_ACTIVATED: "dynamic-link-not-activated", INVALID_APP_ID: "invalid-app-id", TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests", WEAK_PASSWORD: "weak-password", OPERATION_NOT_ALLOWED: "operation-not-allowed", USER_CANCELLED: "user-cancelled", CAPTCHA_CHECK_FAILED: "captcha-check-failed", INVALID_APP_CREDENTIAL: "invalid-app-credential", INVALID_CODE: "invalid-verification-code",
      INVALID_PHONE_NUMBER: "invalid-phone-number", INVALID_SESSION_INFO: "invalid-verification-id", INVALID_TEMPORARY_PROOF: "invalid-credential", MISSING_APP_CREDENTIAL: "missing-app-credential", MISSING_CODE: "missing-verification-code", MISSING_PHONE_NUMBER: "missing-phone-number", MISSING_SESSION_INFO: "missing-verification-id", QUOTA_EXCEEDED: "quota-exceeded", SESSION_EXPIRED: "code-expired", INVALID_CONTINUE_URI: "invalid-continue-uri", MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name", MISSING_IOS_BUNDLE_ID: "missing-ios-bundle-id",
      UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri", INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id", INVALID_CERT_HASH: "invalid-cert-hash" };ab(d, b || {});b = (b = c.match(/^[^\s]+\s*:\s*(.*)$/)) && 1 < b.length ? b[1] : void 0;for (var e in d) {
      if (0 === c.indexOf(e)) return new M(d[e], b);
    }!b && a && (b = ue(a));return new M("internal-error", b);
  };var ti = { Wc: { Ya: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/", eb: "https://securetoken.googleapis.com/v1/token", id: "p" }, Yc: { Ya: "https://staging-www.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/", eb: "https://staging-securetoken.sandbox.googleapis.com/v1/token", id: "s" }, Zc: { Ya: "https://www-googleapis-test.sandbox.google.com/identitytoolkit/v3/relyingparty/", eb: "https://test-securetoken.sandbox.googleapis.com/v1/token", id: "t" } };
  function ui(a) {
    for (var b in ti) {
      if (ti[b].id === a) return a = ti[b], { firebaseEndpoint: a.Ya, secureTokenEndpoint: a.eb };
    }return null;
  }var vi;vi = ui("__EID__") ? "__EID__" : void 0;function wi(a) {
    this.b = a;this.a = null;this.ab = xi(this);
  }
  function xi(a) {
    return yi().then(function () {
      return new z(function (b, c) {
        J("gapi.iframes.getContext")().open({ where: document.body, url: a.b, messageHandlersFilter: J("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"), attributes: { style: { position: "absolute", top: "-100px", width: "1px", height: "1px" } }, dontclear: !0 }, function (d) {
          function e() {
            clearTimeout(f);b();
          }a.a = d;a.a.restyle({ setHideOnLeave: !1 });var f = setTimeout(function () {
            c(Error("Network Error"));
          }, zi.get());d.ping(e).then(e, function () {
            c(Error("Network Error"));
          });
        });
      });
    });
  }
  function Ai(a, b) {
    return a.ab.then(function () {
      return new z(function (c) {
        a.a.send(b.type, b, c, J("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));
      });
    });
  }function Bi(a, b) {
    a.ab.then(function () {
      a.a.register("authEvent", b, J("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));
    });
  }var Ci = pd("https://apis.google.com/js/api.js?onload=%{onload}"),
      Di = new ze(3E4, 6E4),
      zi = new ze(5E3, 15E3),
      Ei = null;
  function yi() {
    return Ei ? Ei : Ei = new z(function (a, b) {
      function c() {
        ye();J("gapi.load")("gapi.iframes", { callback: a, ontimeout: function ontimeout() {
            ye();b(Error("Network Error"));
          }, timeout: Di.get() });
      }if (J("gapi.iframes.Iframe")) a();else if (J("gapi.load")) c();else {
        var d = "__iframefcb" + Math.floor(1E6 * Math.random()).toString();k[d] = function () {
          J("gapi.load") ? c() : b(Error("Network Error"));
        };d = td(Ci, { onload: d });A(ph(d)).m(function () {
          b(Error("Network Error"));
        });
      }
    }).m(function (a) {
      Ei = null;throw a;
    });
  };function Fi(a, b, c) {
    this.j = a;this.g = b;this.h = c;this.f = null;this.a = dd(this.j, "/__/auth/iframe");H(this.a, "apiKey", this.g);H(this.a, "appName", this.h);this.b = null;this.c = [];
  }Fi.prototype.toString = function () {
    this.f ? H(this.a, "v", this.f) : jd(this.a.a, "v");this.b ? H(this.a, "eid", this.b) : jd(this.a.a, "eid");this.c.length ? H(this.a, "fw", this.c.join(",")) : jd(this.a.a, "fw");return this.a.toString();
  };function Gi(a, b, c, d, e) {
    this.o = a;this.u = b;this.c = c;this.l = d;this.h = this.g = this.j = null;this.a = e;this.f = null;
  }
  Gi.prototype.toString = function () {
    var a = dd(this.o, "/__/auth/handler");H(a, "apiKey", this.u);H(a, "appName", this.c);H(a, "authType", this.l);if (this.a.isOAuthProvider) {
      var b = this.a;try {
        var c = firebase.app(this.c).auth().ca();
      } catch (m) {
        c = null;
      }b.Xa = c;H(a, "providerId", this.a.providerId);b = this.a;c = ve(b.tb);for (var d in c) {
        c[d] = c[d].toString();
      }d = b.Ac;c = Za(c);for (var e = 0; e < d.length; e++) {
        var f = d[e];f in c && delete c[f];
      }b.Za && b.Xa && !c[b.Za] && (c[b.Za] = b.Xa);Ya(c) || H(a, "customParameters", ue(c));
    }"function" === typeof this.a.yb && (b = this.a.yb(), b.length && H(a, "scopes", b.join(",")));this.j ? H(a, "redirectUrl", this.j) : jd(a.a, "redirectUrl");this.g ? H(a, "eventId", this.g) : jd(a.a, "eventId");this.h ? H(a, "v", this.h) : jd(a.a, "v");if (this.b) for (var h in this.b) {
      this.b.hasOwnProperty(h) && !bd(a, h) && H(a, h, this.b[h]);
    }this.f ? H(a, "eid", this.f) : jd(a.a, "eid");h = Hi(this.c);h.length && H(a, "fw", h.join(","));return a.toString();
  };function Hi(a) {
    try {
      return firebase.app(a).auth().Ka();
    } catch (b) {
      return [];
    }
  }
  function Ii(a, b, c, d, e) {
    this.u = a;this.f = b;this.b = c;this.c = d || null;this.h = e || null;this.o = this.s = this.v = null;this.g = [];this.l = this.a = null;
  }
  function Ji(a) {
    var b = Ud();return Rh(a).then(function (a) {
      a: {
        var c = cd(b),
            e = c.c;c = c.b;for (var f = 0; f < a.length; f++) {
          var h = a[f];var m = c;var p = e;0 == h.indexOf("chrome-extension://") ? m = cd(h).b == m && "chrome-extension" == p : "http" != p && "https" != p ? m = !1 : ee.test(h) ? m = m == h : (h = h.split(".").join("\\."), m = new RegExp("^(.+\\." + h + "|" + h + ")$", "i").test(m));if (m) {
            a = !0;break a;
          }
        }a = !1;
      }if (!a) throw new og(Ud());
    });
  }
  function Ki(a) {
    if (a.l) return a.l;a.l = fe().then(function () {
      if (!a.s) {
        var b = a.c,
            c = a.h,
            d = Hi(a.b),
            e = new Fi(a.u, a.f, a.b);e.f = b;e.b = c;e.c = Ia(d || []);a.s = e.toString();
      }a.j = new wi(a.s);Li(a);
    });return a.l;
  }g = Ii.prototype;g.Da = function (a, b, c) {
    var d = new M("popup-closed-by-user"),
        e = new M("web-storage-unsupported"),
        f = this,
        h = !1;return this.ea().then(function () {
      Mi(f).then(function (c) {
        c || (a && ae(a), b(e), h = !0);
      });
    }).m(function () {}).then(function () {
      if (!h) return de(a);
    }).then(function () {
      if (!h) return Fc(c).then(function () {
        b(d);
      });
    });
  };
  g.Gb = function () {
    var a = I();return !te(a) && !xe(a);
  };g.Bb = function () {
    return !1;
  };
  g.xb = function (a, b, c, d, e, f, h) {
    if (!a) return B(new M("popup-blocked"));if (h && !te()) return this.ea().m(function (b) {
      ae(a);e(b);
    }), d(), A();this.a || (this.a = Ji(Ni(this)));var m = this;return this.a.then(function () {
      var b = m.ea().m(function (b) {
        ae(a);e(b);throw b;
      });d();return b;
    }).then(function () {
      jg(c);if (!h) {
        var d = Oi(m.u, m.f, m.b, b, c, null, f, m.c, void 0, m.h);Vd(d, a);
      }
    }).m(function (a) {
      "auth/network-request-failed" == a.code && (m.a = null);throw a;
    });
  };
  function Ni(a) {
    a.o || (a.v = a.c ? oe(a.c, Hi(a.b)) : null, a.o = new xh(a.f, ui(a.h), a.v));return a.o;
  }g.Ba = function (a, b, c) {
    this.a || (this.a = Ji(Ni(this)));var d = this;return this.a.then(function () {
      jg(b);var e = Oi(d.u, d.f, d.b, a, b, Ud(), c, d.c, void 0, d.h);Vd(e);
    }).m(function (a) {
      "auth/network-request-failed" == a.code && (d.a = null);throw a;
    });
  };g.ea = function () {
    var a = this;return Ki(this).then(function () {
      return a.j.ab;
    }).m(function () {
      a.a = null;throw new M("network-request-failed");
    });
  };g.Lb = function () {
    return !0;
  };
  function Oi(a, b, c, d, e, f, h, m, p, E) {
    a = new Gi(a, b, c, d, e);a.j = f;a.g = h;a.h = m;a.b = Za(p || null);a.f = E;return a.toString();
  }function Li(a) {
    if (!a.j) throw Error("IfcHandler must be initialized!");Bi(a.j, function (b) {
      var c = {};if (b && b.authEvent) {
        var d = !1;b = lg(b.authEvent);for (c = 0; c < a.g.length; c++) {
          d = a.g[c](b) || d;
        }c = {};c.status = d ? "ACK" : "ERROR";return A(c);
      }c.status = "ERROR";return A(c);
    });
  }
  function Mi(a) {
    var b = { type: "webStorageSupport" };return Ki(a).then(function () {
      return Ai(a.j, b);
    }).then(function (a) {
      if (a && a.length && "undefined" !== typeof a[0].webStorageSupport) return a[0].webStorageSupport;throw Error();
    });
  }g.va = function (a) {
    this.g.push(a);
  };g.Ja = function (a) {
    w(this.g, function (b) {
      return b == a;
    });
  };function Pi(a) {
    this.a = a || firebase.INTERNAL.reactNative && firebase.INTERNAL.reactNative.AsyncStorage;if (!this.a) throw new M("internal-error", "The React Native compatibility library was not found.");this.type = "asyncStorage";
  }g = Pi.prototype;g.get = function (a) {
    return A(this.a.getItem(a)).then(function (a) {
      return a && we(a);
    });
  };g.set = function (a, b) {
    return A(this.a.setItem(a, ue(b)));
  };g.P = function (a) {
    return A(this.a.removeItem(a));
  };g.Y = function () {};g.aa = function () {};function Qi() {
    if (!Ri()) throw new M("web-storage-unsupported");this.f = {};this.a = [];this.b = 0;this.g = k.indexedDB;this.type = "indexedDB";
  }var Si;function Ti(a) {
    return new z(function (b, c) {
      var d = a.g.deleteDatabase("firebaseLocalStorageDb");d.onsuccess = function () {
        b();
      };d.onerror = function (a) {
        c(Error(a.target.error));
      };
    });
  }
  function Ui(a) {
    return new z(function (b, c) {
      var d = a.g.open("firebaseLocalStorageDb", 1);d.onerror = function (a) {
        try {
          a.preventDefault();
        } catch (f) {}c(Error(a.target.error));
      };d.onupgradeneeded = function (a) {
        a = a.target.result;try {
          a.createObjectStore("firebaseLocalStorage", { keyPath: "fbase_key" });
        } catch (f) {
          c(f);
        }
      };d.onsuccess = function (d) {
        d = d.target.result;d.objectStoreNames.contains("firebaseLocalStorage") ? b(d) : Ti(a).then(function () {
          return Ui(a);
        }).then(function (a) {
          b(a);
        }).m(function (a) {
          c(a);
        });
      };
    });
  }
  function Vi(a) {
    a.h || (a.h = Ui(a));return a.h;
  }function Ri() {
    try {
      return !!k.indexedDB;
    } catch (a) {
      return !1;
    }
  }function Wi(a) {
    return a.objectStore("firebaseLocalStorage");
  }function Xi(a, b) {
    return a.transaction(["firebaseLocalStorage"], b ? "readwrite" : "readonly");
  }function Yi(a) {
    return new z(function (b, c) {
      a.onsuccess = function (a) {
        a && a.target ? b(a.target.result) : b();
      };a.onerror = function (a) {
        c(Error(a.target.errorCode));
      };
    });
  }g = Qi.prototype;
  g.set = function (a, b) {
    var c = !1,
        d,
        e = this;return Vi(this).then(function (b) {
      d = b;b = Wi(Xi(d, !0));return Yi(b.get(a));
    }).then(function (f) {
      var h = Wi(Xi(d, !0));if (f) return f.value = b, Yi(h.put(f));e.b++;c = !0;f = {};f.fbase_key = a;f.value = b;return Yi(h.add(f));
    }).then(function () {
      e.f[a] = b;
    }).ha(function () {
      c && e.b--;
    });
  };g.get = function (a) {
    return Vi(this).then(function (b) {
      return Yi(Wi(Xi(b, !1)).get(a));
    }).then(function (a) {
      return a && a.value;
    });
  };
  g.P = function (a) {
    var b = !1,
        c = this;return Vi(this).then(function (d) {
      b = !0;c.b++;return Yi(Wi(Xi(d, !0))["delete"](a));
    }).then(function () {
      delete c.f[a];
    }).ha(function () {
      b && c.b--;
    });
  };
  g.Jc = function () {
    var a = this;return Vi(this).then(function (a) {
      var b = Wi(Xi(a, !1));return b.getAll ? Yi(b.getAll()) : new z(function (a, c) {
        var d = [],
            e = b.openCursor();e.onsuccess = function (b) {
          (b = b.target.result) ? (d.push(b.value), b["continue"]()) : a(d);
        };e.onerror = function (a) {
          c(Error(a.target.errorCode));
        };
      });
    }).then(function (b) {
      var c = {},
          d = [];if (0 == a.b) {
        for (d = 0; d < b.length; d++) {
          c[b[d].fbase_key] = b[d].value;
        }d = Wd(a.f, c);a.f = c;
      }return d;
    });
  };g.Y = function (a) {
    0 == this.a.length && Zi(this);this.a.push(a);
  };
  g.aa = function (a) {
    w(this.a, function (b) {
      return b == a;
    });0 == this.a.length && this.c && this.c.cancel("STOP_EVENT");
  };function Zi(a) {
    function b() {
      a.c = Fc(800).then(r(a.Jc, a)).then(function (b) {
        0 < b.length && v(a.a, function (a) {
          a(b);
        });
      }).then(b).m(function (a) {
        "STOP_EVENT" != a.message && b();
      });return a.c;
    }a.c && a.c.cancel("STOP_EVENT");b();
  };function $i(a) {
    var b = this,
        c = null;this.a = [];this.type = "indexedDB";this.c = a;this.b = A().then(function () {
      return Ri() ? (Si || (Si = new Qi()), c = Si, c.set("__sak", "!").then(function () {
        return c.get("__sak");
      }).then(function (a) {
        if ("!" !== a) throw Error("indexedDB not supported!");return c.P("__sak");
      }).then(function () {
        return c;
      }).m(function () {
        return b.c;
      })) : b.c;
    }).then(function (a) {
      b.type = a.type;a.Y(function (a) {
        v(b.a, function (b) {
          b(a);
        });
      });return a;
    });
  }g = $i.prototype;g.get = function (a) {
    return this.b.then(function (b) {
      return b.get(a);
    });
  };
  g.set = function (a, b) {
    return this.b.then(function (c) {
      return c.set(a, b);
    });
  };g.P = function (a) {
    return this.b.then(function (b) {
      return b.P(a);
    });
  };g.Y = function (a) {
    this.a.push(a);
  };g.aa = function (a) {
    w(this.a, function (b) {
      return b == a;
    });
  };function aj() {
    this.a = {};this.type = "inMemory";
  }g = aj.prototype;g.get = function (a) {
    return A(this.a[a]);
  };g.set = function (a, b) {
    this.a[a] = b;return A();
  };g.P = function (a) {
    delete this.a[a];return A();
  };g.Y = function () {};g.aa = function () {};function bj() {
    if (!cj()) {
      if ("Node" == le()) throw new M("internal-error", "The LocalStorage compatibility library was not found.");throw new M("web-storage-unsupported");
    }this.a = dj() || firebase.INTERNAL.node.localStorage;this.type = "localStorage";
  }function dj() {
    try {
      var a = k.localStorage,
          b = qe();a && (a.setItem(b, "1"), a.removeItem(b));return a;
    } catch (c) {
      return null;
    }
  }
  function cj() {
    var a = "Node" == le();a = dj() || a && firebase.INTERNAL.node && firebase.INTERNAL.node.localStorage;if (!a) return !1;try {
      return a.setItem("__sak", "1"), a.removeItem("__sak"), !0;
    } catch (b) {
      return !1;
    }
  }g = bj.prototype;g.get = function (a) {
    var b = this;return A().then(function () {
      var c = b.a.getItem(a);return we(c);
    });
  };g.set = function (a, b) {
    var c = this;return A().then(function () {
      var d = ue(b);null === d ? c.P(a) : c.a.setItem(a, d);
    });
  };g.P = function (a) {
    var b = this;return A().then(function () {
      b.a.removeItem(a);
    });
  };
  g.Y = function (a) {
    k.window && pc(k.window, "storage", a);
  };g.aa = function (a) {
    k.window && F(k.window, "storage", a);
  };function ej() {
    this.type = "nullStorage";
  }g = ej.prototype;g.get = function () {
    return A(null);
  };g.set = function () {
    return A();
  };g.P = function () {
    return A();
  };g.Y = function () {};g.aa = function () {};function fj() {
    if (!gj()) {
      if ("Node" == le()) throw new M("internal-error", "The SessionStorage compatibility library was not found.");throw new M("web-storage-unsupported");
    }this.a = hj() || firebase.INTERNAL.node.sessionStorage;this.type = "sessionStorage";
  }function hj() {
    try {
      var a = k.sessionStorage,
          b = qe();a && (a.setItem(b, "1"), a.removeItem(b));return a;
    } catch (c) {
      return null;
    }
  }
  function gj() {
    var a = "Node" == le();a = hj() || a && firebase.INTERNAL.node && firebase.INTERNAL.node.sessionStorage;if (!a) return !1;try {
      return a.setItem("__sak", "1"), a.removeItem("__sak"), !0;
    } catch (b) {
      return !1;
    }
  }g = fj.prototype;g.get = function (a) {
    var b = this;return A().then(function () {
      var c = b.a.getItem(a);return we(c);
    });
  };g.set = function (a, b) {
    var c = this;return A().then(function () {
      var d = ue(b);null === d ? c.P(a) : c.a.setItem(a, d);
    });
  };g.P = function (a) {
    var b = this;return A().then(function () {
      b.a.removeItem(a);
    });
  };g.Y = function () {};
  g.aa = function () {};function ij() {
    var a = {};a.Browser = jj;a.Node = kj;a.ReactNative = lj;a.Worker = mj;this.a = a[le()];
  }var nj,
      jj = { w: bj, Pa: fj },
      kj = { w: bj, Pa: fj },
      lj = { w: Pi, Pa: ej },
      mj = { w: bj, Pa: ej };var oj = { Vc: "local", NONE: "none", Xc: "session" };function pj(a) {
    var b = new M("invalid-persistence-type"),
        c = new M("unsupported-persistence-type");a: {
      for (d in oj) {
        if (oj[d] == a) {
          var d = !0;break a;
        }
      }d = !1;
    }if (!d || "string" !== typeof a) throw b;switch (le()) {case "ReactNative":
        if ("session" === a) throw c;break;case "Node":
        if ("none" !== a) throw c;break;default:
        if (!pe() && "none" !== a) throw c;}
  }
  function qj() {
    var a = !xe(I()) && je() ? !0 : !1,
        b = te(),
        c = pe();this.o = a;this.h = b;this.l = c;this.a = {};nj || (nj = new ij());a = nj;try {
      this.g = !Td() && De() || !k.indexedDB ? new a.a.w() : new $i(ke() ? new aj() : new a.a.w());
    } catch (d) {
      this.g = new aj(), this.h = !0;
    }try {
      this.j = new a.a.Pa();
    } catch (d) {
      this.j = new aj();
    }this.u = new aj();this.f = r(this.Kb, this);this.b = {};
  }var rj;function sj() {
    rj || (rj = new qj());return rj;
  }function tj(a, b) {
    switch (b) {case "session":
        return a.j;case "none":
        return a.u;default:
        return a.g;}
  }
  function uj(a, b) {
    return "firebase:" + a.name + (b ? ":" + b : "");
  }function vj(a, b, c) {
    var d = uj(b, c),
        e = tj(a, b.w);return a.get(b, c).then(function (f) {
      var h = null;try {
        h = we(k.localStorage.getItem(d));
      } catch (m) {}if (h && !f) return k.localStorage.removeItem(d), a.set(b, h, c);h && f && "localStorage" != e.type && k.localStorage.removeItem(d);
    });
  }g = qj.prototype;g.get = function (a, b) {
    return tj(this, a.w).get(uj(a, b));
  };function wj(a, b, c) {
    c = uj(b, c);"local" == b.w && (a.b[c] = null);return tj(a, b.w).P(c);
  }
  g.set = function (a, b, c) {
    var d = uj(a, c),
        e = this,
        f = tj(this, a.w);return f.set(d, b).then(function () {
      return f.get(d);
    }).then(function (b) {
      "local" == a.w && (e.b[d] = b);
    });
  };g.addListener = function (a, b, c) {
    a = uj(a, b);this.l && (this.b[a] = k.localStorage.getItem(a));Ya(this.a) && (tj(this, "local").Y(this.f), this.h || (Td() || !De()) && k.indexedDB || !this.l || xj(this));this.a[a] || (this.a[a] = []);this.a[a].push(c);
  };
  g.removeListener = function (a, b, c) {
    a = uj(a, b);this.a[a] && (w(this.a[a], function (a) {
      return a == c;
    }), 0 == this.a[a].length && delete this.a[a]);Ya(this.a) && (tj(this, "local").aa(this.f), yj(this));
  };function xj(a) {
    yj(a);a.c = setInterval(function () {
      for (var b in a.a) {
        var c = k.localStorage.getItem(b),
            d = a.b[b];c != d && (a.b[b] = c, c = new cc({ type: "storage", key: b, target: window, oldValue: d, newValue: c, a: !0 }), a.Kb(c));
      }
    }, 1E3);
  }function yj(a) {
    a.c && (clearInterval(a.c), a.c = null);
  }
  g.Kb = function (a) {
    if (a && a.f) {
      var b = a.a.key;if (null == b) for (var c in this.a) {
        var d = this.b[c];"undefined" === typeof d && (d = null);var e = k.localStorage.getItem(c);e !== d && (this.b[c] = e, this.Va(c));
      } else if (0 == b.indexOf("firebase:") && this.a[b]) {
        "undefined" !== typeof a.a.a ? tj(this, "local").aa(this.f) : yj(this);if (this.o) if (c = k.localStorage.getItem(b), d = a.a.newValue, d !== c) null !== d ? k.localStorage.setItem(b, d) : k.localStorage.removeItem(b);else if (this.b[b] === d && "undefined" === typeof a.a.a) return;var f = this;c = function c() {
          if ("undefined" !== typeof a.a.a || f.b[b] !== k.localStorage.getItem(b)) f.b[b] = k.localStorage.getItem(b), f.Va(b);
        };C && Xb && 10 == Xb && k.localStorage.getItem(b) !== a.a.newValue && a.a.newValue !== a.a.oldValue ? setTimeout(c, 10) : c();
      }
    } else v(a, r(this.Va, this));
  };g.Va = function (a) {
    this.a[a] && v(this.a[a], function (a) {
      a();
    });
  };function zj(a) {
    this.a = a;this.b = sj();
  }var Aj = { name: "authEvent", w: "local" };function Bj(a) {
    return a.b.get(Aj, a.a).then(function (a) {
      return lg(a);
    });
  };function Cj() {
    this.a = sj();
  };function Dj() {
    this.b = -1;
  };function Ej(a, b) {
    this.b = -1;this.b = Fj;this.f = k.Uint8Array ? new Uint8Array(this.b) : Array(this.b);this.g = this.c = 0;this.a = [];this.j = a;this.h = b;this.l = k.Int32Array ? new Int32Array(64) : Array(64);void 0 !== Gj || (k.Int32Array ? Gj = new Int32Array(Hj) : Gj = Hj);this.reset();
  }var Gj;t(Ej, Dj);for (var Fj = 64, Ij = Fj - 1, Jj = [], Kj = 0; Kj < Ij; Kj++) {
    Jj[Kj] = 0;
  }var Lj = Ha(128, Jj);Ej.prototype.reset = function () {
    this.g = this.c = 0;this.a = k.Int32Array ? new Int32Array(this.h) : Ia(this.h);
  };
  function Mj(a) {
    for (var b = a.f, c = a.l, d = 0, e = 0; e < b.length;) {
      c[d++] = b[e] << 24 | b[e + 1] << 16 | b[e + 2] << 8 | b[e + 3], e = 4 * d;
    }for (b = 16; 64 > b; b++) {
      e = c[b - 15] | 0;d = c[b - 2] | 0;var f = (c[b - 16] | 0) + ((e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3) | 0,
          h = (c[b - 7] | 0) + ((d >>> 17 | d << 15) ^ (d >>> 19 | d << 13) ^ d >>> 10) | 0;c[b] = f + h | 0;
    }d = a.a[0] | 0;e = a.a[1] | 0;var m = a.a[2] | 0,
        p = a.a[3] | 0,
        E = a.a[4] | 0,
        ic = a.a[5] | 0,
        Jc = a.a[6] | 0;f = a.a[7] | 0;for (b = 0; 64 > b; b++) {
      var El = ((d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10)) + (d & e ^ d & m ^ e & m) | 0;h = E & ic ^ ~E & Jc;f = f + ((E >>> 6 | E << 26) ^ (E >>> 11 | E << 21) ^ (E >>> 25 | E << 7)) | 0;h = h + (Gj[b] | 0) | 0;h = f + (h + (c[b] | 0) | 0) | 0;f = Jc;Jc = ic;ic = E;E = p + h | 0;p = m;m = e;e = d;d = h + El | 0;
    }a.a[0] = a.a[0] + d | 0;a.a[1] = a.a[1] + e | 0;a.a[2] = a.a[2] + m | 0;a.a[3] = a.a[3] + p | 0;a.a[4] = a.a[4] + E | 0;a.a[5] = a.a[5] + ic | 0;a.a[6] = a.a[6] + Jc | 0;a.a[7] = a.a[7] + f | 0;
  }
  function Nj(a, b, c) {
    void 0 === c && (c = b.length);var d = 0,
        e = a.c;if (l(b)) for (; d < c;) {
      a.f[e++] = b.charCodeAt(d++), e == a.b && (Mj(a), e = 0);
    } else if (ha(b)) for (; d < c;) {
      var f = b[d++];if (!("number" == typeof f && 0 <= f && 255 >= f && f == (f | 0))) throw Error("message must be a byte array");a.f[e++] = f;e == a.b && (Mj(a), e = 0);
    } else throw Error("message must be string or array");a.c = e;a.g += c;
  }
  var Hj = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];function Oj() {
    Ej.call(this, 8, Pj);
  }t(Oj, Ej);var Pj = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];function Qj(a, b, c, d, e) {
    this.u = a;this.j = b;this.l = c;this.o = d || null;this.s = e || null;this.h = b + ":" + c;this.v = new Cj();this.g = new zj(this.h);this.f = null;this.b = [];this.a = this.c = null;
  }function Rj(a) {
    return new M("invalid-cordova-configuration", a);
  }g = Qj.prototype;
  g.ea = function () {
    return this.ya ? this.ya : this.ya = ge().then(function () {
      if ("function" !== typeof J("universalLinks.subscribe", k)) throw Rj("cordova-universal-links-plugin is not installed");if ("undefined" === typeof J("BuildInfo.packageName", k)) throw Rj("cordova-plugin-buildinfo is not installed");if ("function" !== typeof J("cordova.plugins.browsertab.openUrl", k)) throw Rj("cordova-plugin-browsertab is not installed");if ("function" !== typeof J("cordova.InAppBrowser.open", k)) throw Rj("cordova-plugin-inappbrowser is not installed");
    }, function () {
      throw new M("cordova-not-ready");
    });
  };function Sj() {
    for (var a = 20, b = []; 0 < a;) {
      b.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62 * Math.random()))), a--;
    }return b.join("");
  }function Tj(a) {
    var b = new Oj();Nj(b, a);a = [];var c = 8 * b.g;56 > b.c ? Nj(b, Lj, 56 - b.c) : Nj(b, Lj, b.b - (b.c - 56));for (var d = 63; 56 <= d; d--) {
      b.f[d] = c & 255, c /= 256;
    }Mj(b);for (d = c = 0; d < b.j; d++) {
      for (var e = 24; 0 <= e; e -= 8) {
        a[c++] = b.a[d] >> e & 255;
      }
    }return gf(a);
  }
  g.Da = function (a, b) {
    b(new M("operation-not-supported-in-this-environment"));return A();
  };g.xb = function () {
    return B(new M("operation-not-supported-in-this-environment"));
  };g.Lb = function () {
    return !1;
  };g.Gb = function () {
    return !0;
  };g.Bb = function () {
    return !0;
  };
  g.Ba = function (a, b, c) {
    if (this.c) return B(new M("redirect-operation-pending"));var d = this,
        e = k.document,
        f = null,
        h = null,
        m = null,
        p = null;return this.c = A().then(function () {
      jg(b);return Uj(d);
    }).then(function () {
      return Vj(d, a, b, c);
    }).then(function () {
      return new z(function (a, b) {
        h = function h() {
          var b = J("cordova.plugins.browsertab.close", k);a();"function" === typeof b && b();d.a && "function" === typeof d.a.close && (d.a.close(), d.a = null);return !1;
        };d.va(h);m = function m() {
          f || (f = Fc(2E3).then(function () {
            b(new M("redirect-cancelled-by-user"));
          }));
        };
        p = function p() {
          Ae() && m();
        };e.addEventListener("resume", m, !1);I().toLowerCase().match(/android/) || e.addEventListener("visibilitychange", p, !1);
      }).m(function (a) {
        return Wj(d).then(function () {
          throw a;
        });
      });
    }).ha(function () {
      m && e.removeEventListener("resume", m, !1);p && e.removeEventListener("visibilitychange", p, !1);f && f.cancel();h && d.Ja(h);d.c = null;
    });
  };
  function Vj(a, b, c, d) {
    var e = Sj(),
        f = new kg(b, d, null, e, new M("no-auth-event")),
        h = J("BuildInfo.packageName", k);if ("string" !== typeof h) throw new M("invalid-cordova-configuration");var m = J("BuildInfo.displayName", k),
        p = {};if (I().toLowerCase().match(/iphone|ipad|ipod/)) p.ibi = h;else if (I().toLowerCase().match(/android/)) p.apn = h;else return B(new M("operation-not-supported-in-this-environment"));m && (p.appDisplayName = m);e = Tj(e);p.sessionId = e;var E = Oi(a.u, a.j, a.l, b, c, null, d, a.o, p, a.s);return a.ea().then(function () {
      var b = a.h;return a.v.a.set(Aj, f.C(), b);
    }).then(function () {
      var b = J("cordova.plugins.browsertab.isAvailable", k);if ("function" !== typeof b) throw new M("invalid-cordova-configuration");var c = null;b(function (b) {
        if (b) {
          c = J("cordova.plugins.browsertab.openUrl", k);if ("function" !== typeof c) throw new M("invalid-cordova-configuration");c(E);
        } else {
          c = J("cordova.InAppBrowser.open", k);if ("function" !== typeof c) throw new M("invalid-cordova-configuration");b = I();b = !(!b.match(/(iPad|iPhone|iPod).*OS 7_\d/i) && !b.match(/(iPad|iPhone|iPod).*OS 8_\d/i));
          a.a = c(E, b ? "_blank" : "_system", "location=yes");
        }
      });
    });
  }function Xj(a, b) {
    for (var c = 0; c < a.b.length; c++) {
      try {
        a.b[c](b);
      } catch (d) {}
    }
  }function Uj(a) {
    a.f || (a.f = a.ea().then(function () {
      return new z(function (b) {
        function c(d) {
          b(d);a.Ja(c);return !1;
        }a.va(c);Yj(a);
      });
    }));return a.f;
  }function Wj(a) {
    var b = null;return Bj(a.g).then(function (c) {
      b = c;c = a.g;return wj(c.b, Aj, c.a);
    }).then(function () {
      return b;
    });
  }
  function Yj(a) {
    function b(b) {
      d = !0;e && e.cancel();Wj(a).then(function (d) {
        var e = c;if (d && b && b.url) {
          var f = null;e = Ef(b.url);-1 != e.indexOf("/__/auth/callback") && (f = cd(e), f = we(bd(f, "firebaseError") || null), f = (f = "object" === typeof f ? We(f) : null) ? new kg(d.b, d.c, null, null, f) : new kg(d.b, d.c, e, d.g));e = f || c;
        }Xj(a, e);
      });
    }var c = new kg("unknown", null, null, null, new M("no-auth-event")),
        d = !1,
        e = Fc(500).then(function () {
      return Wj(a).then(function () {
        d || Xj(a, c);
      });
    }),
        f = k.handleOpenURL;k.handleOpenURL = function (a) {
      0 == a.toLowerCase().indexOf(J("BuildInfo.packageName", k).toLowerCase() + "://") && b({ url: a });if ("function" === typeof f) try {
        f(a);
      } catch (m) {
        console.error(m);
      }
    };ng || (ng = new mg());ng.subscribe(b);
  }g.va = function (a) {
    this.b.push(a);Uj(this).m(function (b) {
      "auth/invalid-cordova-configuration" === b.code && (b = new kg("unknown", null, null, null, new M("no-auth-event")), a(b));
    });
  };g.Ja = function (a) {
    w(this.b, function (b) {
      return b == a;
    });
  };function Zj(a) {
    this.a = a;this.b = sj();
  }var ak = { name: "pendingRedirect", w: "session" };function bk(a) {
    return a.b.set(ak, "pending", a.a);
  }function ck(a) {
    return wj(a.b, ak, a.a);
  }function dk(a) {
    return a.b.get(ak, a.a).then(function (a) {
      return "pending" == a;
    });
  };function ek(a, b, c) {
    this.v = a;this.l = b;this.u = c;this.h = [];this.f = !1;this.j = r(this.o, this);this.c = new fk();this.s = new gk();this.g = new Zj(this.l + ":" + this.u);this.b = {};this.b.unknown = this.c;this.b.signInViaRedirect = this.c;this.b.linkViaRedirect = this.c;this.b.reauthViaRedirect = this.c;this.b.signInViaPopup = this.s;this.b.linkViaPopup = this.s;this.b.reauthViaPopup = this.s;this.a = hk(this.v, this.l, this.u, vi);
  }function hk(a, b, c, d) {
    var e = firebase.SDK_VERSION || null;return he() ? new Qj(a, b, c, e, d) : new Ii(a, b, c, e, d);
  }
  ek.prototype.reset = function () {
    this.f = !1;this.a.Ja(this.j);this.a = hk(this.v, this.l, this.u);
  };function ik(a) {
    a.f || (a.f = !0, a.a.va(a.j));var b = a.a;return a.a.ea().m(function (c) {
      a.a == b && a.reset();throw c;
    });
  }function jk(a) {
    a.a.Gb() && ik(a).m(function (b) {
      var c = new kg("unknown", null, null, null, new M("operation-not-supported-in-this-environment"));kk(b) && a.o(c);
    });a.a.Bb() || lk(a.c);
  }
  ek.prototype.subscribe = function (a) {
    Fa(this.h, a) || this.h.push(a);if (!this.f) {
      var b = this;dk(this.g).then(function (a) {
        a ? ck(b.g).then(function () {
          ik(b).m(function (a) {
            var c = new kg("unknown", null, null, null, new M("operation-not-supported-in-this-environment"));kk(a) && b.o(c);
          });
        }) : jk(b);
      }).m(function () {
        jk(b);
      });
    }
  };ek.prototype.unsubscribe = function (a) {
    w(this.h, function (b) {
      return b == a;
    });
  };
  ek.prototype.o = function (a) {
    if (!a) throw new M("invalid-auth-event");for (var b = !1, c = 0; c < this.h.length; c++) {
      var d = this.h[c];if (d.qb(a.b, a.c)) {
        (b = this.b[a.b]) && b.h(a, d);b = !0;break;
      }
    }lk(this.c);return b;
  };var mk = new ze(2E3, 1E4),
      nk = new ze(3E4, 6E4);ek.prototype.da = function () {
    return this.c.da();
  };function ok(a, b, c, d, e, f) {
    return a.a.xb(b, c, d, function () {
      a.f || (a.f = !0, a.a.va(a.j));
    }, function () {
      a.reset();
    }, e, f);
  }function kk(a) {
    return a && "auth/cordova-not-ready" == a.code ? !0 : !1;
  }
  ek.prototype.Ba = function (a, b, c) {
    var d = this,
        e;return bk(this.g).then(function () {
      return d.a.Ba(a, b, c).m(function (a) {
        if (kk(a)) throw new M("operation-not-supported-in-this-environment");e = a;return ck(d.g).then(function () {
          throw e;
        });
      }).then(function () {
        return d.a.Lb() ? new z(function () {}) : ck(d.g).then(function () {
          return d.da();
        }).then(function () {}).m(function () {});
      });
    });
  };ek.prototype.Da = function (a, b, c, d) {
    return this.a.Da(c, function (c) {
      a.ga(b, null, c, d);
    }, mk.get());
  };var pk = {};
  function qk(a, b, c) {
    var d = b + ":" + c;pk[d] || (pk[d] = new ek(a, b, c));return pk[d];
  }function fk() {
    this.b = null;this.f = [];this.c = [];this.a = null;this.g = !1;
  }fk.prototype.reset = function () {
    this.b = null;this.a && (this.a.cancel(), this.a = null);
  };
  fk.prototype.h = function (a, b) {
    if (a) {
      this.reset();this.g = !0;var c = a.b,
          d = a.c,
          e = a.a && "auth/web-storage-unsupported" == a.a.code,
          f = a.a && "auth/operation-not-supported-in-this-environment" == a.a.code;"unknown" != c || e || f ? a.a ? (rk(this, !0, null, a.a), A()) : b.wa(c, d) ? sk(this, a, b) : B(new M("invalid-auth-event")) : (rk(this, !1, null, null), A());
    } else B(new M("invalid-auth-event"));
  };function lk(a) {
    a.g || (a.g = !0, rk(a, !1, null, null));
  }
  function sk(a, b, c) {
    c = c.wa(b.b, b.c);var d = b.f,
        e = b.g,
        f = !!b.b.match(/Redirect$/);c(d, e).then(function (b) {
      rk(a, f, b, null);
    }).m(function (b) {
      rk(a, f, null, b);
    });
  }function tk(a, b) {
    a.b = function () {
      return B(b);
    };if (a.c.length) for (var c = 0; c < a.c.length; c++) {
      a.c[c](b);
    }
  }function uk(a, b) {
    a.b = function () {
      return A(b);
    };if (a.f.length) for (var c = 0; c < a.f.length; c++) {
      a.f[c](b);
    }
  }function rk(a, b, c, d) {
    b ? d ? tk(a, d) : uk(a, c) : uk(a, { user: null });a.f = [];a.c = [];
  }
  fk.prototype.da = function () {
    var a = this;return new z(function (b, c) {
      a.b ? a.b().then(b, c) : (a.f.push(b), a.c.push(c), vk(a));
    });
  };function vk(a) {
    var b = new M("timeout");a.a && a.a.cancel();a.a = Fc(nk.get()).then(function () {
      a.b || rk(a, !0, null, b);
    });
  }function gk() {}gk.prototype.h = function (a, b) {
    if (a) {
      var c = a.b,
          d = a.c;a.a ? (b.ga(a.b, null, a.a, a.c), A()) : b.wa(c, d) ? wk(a, b) : B(new M("invalid-auth-event"));
    } else B(new M("invalid-auth-event"));
  };
  function wk(a, b) {
    var c = a.c,
        d = a.b;b.wa(d, c)(a.f, a.g).then(function (a) {
      b.ga(d, a, null, c);
    }).m(function (a) {
      b.ga(d, null, a, c);
    });
  };function xk(a, b) {
    this.a = b;K(this, "verificationId", a);
  }xk.prototype.confirm = function (a) {
    a = hg(this.verificationId, a);return this.a(a);
  };function yk(a, b, c, d) {
    return new fg(a).Sa(b, c).then(function (a) {
      return new xk(a, d);
    });
  };function zk(a) {
    var b = pf(a);if (!(b && b.exp && b.auth_time && b.iat)) throw new M("internal-error", "An internal error occurred. The token obtained by Firebase appears to be malformed. Please retry the operation.");L(this, { token: a, expirationTime: Ce(1E3 * b.exp), authTime: Ce(1E3 * b.auth_time), issuedAtTime: Ce(1E3 * b.iat), signInProvider: b.firebase && b.firebase.sign_in_provider ? b.firebase.sign_in_provider : null, claims: b });
  };function Ak(a, b, c) {
    this.h = a;this.j = b;this.g = c;this.c = 3E4;this.f = 96E4;this.b = null;this.a = this.c;if (this.f < this.c) throw Error("Proactive refresh lower bound greater than upper bound!");
  }Ak.prototype.start = function () {
    this.a = this.c;Bk(this, !0);
  };function Ck(a, b) {
    if (b) return a.a = a.c, a.g();b = a.a;a.a *= 2;a.a > a.f && (a.a = a.f);return b;
  }function Bk(a, b) {
    a.stop();a.b = Fc(Ck(a, b)).then(function () {
      return Be();
    }).then(function () {
      return a.h();
    }).then(function () {
      Bk(a, !0);
    }).m(function (b) {
      a.j(b) && Bk(a, !1);
    });
  }
  Ak.prototype.stop = function () {
    this.b && (this.b.cancel(), this.b = null);
  };function Dk(a) {
    this.f = a;this.b = this.a = null;this.c = 0;
  }Dk.prototype.C = function () {
    return { apiKey: this.f.b, refreshToken: this.a, accessToken: this.b, expirationTime: this.c };
  };function Ek(a, b) {
    var c = b[Gf],
        d = b.refreshToken;b = Fk(b.expiresIn);a.b = c;a.c = b;a.a = d;
  }function Fk(a) {
    return na() + 1E3 * parseInt(a, 10);
  }
  function Gk(a, b) {
    return Jh(a.f, b).then(function (b) {
      a.b = b.access_token;a.c = Fk(b.expires_in);a.a = b.refresh_token;return { accessToken: a.b, expirationTime: a.c, refreshToken: a.a };
    }).m(function (b) {
      "auth/user-token-expired" == b.code && (a.a = null);throw b;
    });
  }Dk.prototype.getToken = function (a) {
    a = !!a;return this.b && !this.a ? B(new M("user-token-expired")) : a || !this.b || na() > this.c - 3E4 ? this.a ? Gk(this, { grant_type: "refresh_token", refresh_token: this.a }) : A(null) : A({ accessToken: this.b, expirationTime: this.c, refreshToken: this.a });
  };function Hk(a, b) {
    this.a = a || null;this.b = b || null;L(this, { lastSignInTime: Ce(b || null), creationTime: Ce(a || null) });
  }function Ik(a) {
    return new Hk(a.a, a.b);
  }Hk.prototype.C = function () {
    return { lastLoginAt: this.b, createdAt: this.a };
  };function Jk(a, b, c, d, e, f) {
    L(this, { uid: a, displayName: d || null, photoURL: e || null, email: c || null, phoneNumber: f || null, providerId: b });
  }function Kk(a, b) {
    D.call(this, a);for (var c in b) {
      this[c] = b[c];
    }
  }t(Kk, D);
  function Lk(a, b, c) {
    this.D = [];this.G = a.apiKey;this.s = a.appName;this.B = a.authDomain || null;a = firebase.SDK_VERSION ? oe(firebase.SDK_VERSION) : null;this.b = new xh(this.G, ui(vi), a);this.h = new Dk(this.b);Mk(this, b[Gf]);Ek(this.h, b);K(this, "refreshToken", this.h.a);Nk(this, c || {});G.call(this);this.I = !1;this.B && re() && (this.a = qk(this.B, this.G, this.s));this.N = [];this.j = null;this.l = Ok(this);this.V = r(this.Ga, this);var d = this;this.ia = null;this.sa = function (a) {
      d.na(a.g);
    };this.X = null;this.O = [];this.ra = function (a) {
      Pk(d, a.c);
    };this.W = null;
  }t(Lk, G);Lk.prototype.na = function (a) {
    this.ia = a;Dh(this.b, a);
  };Lk.prototype.ca = function () {
    return this.ia;
  };function Qk(a, b) {
    a.X && F(a.X, "languageCodeChanged", a.sa);(a.X = b) && pc(b, "languageCodeChanged", a.sa);
  }function Pk(a, b) {
    a.O = b;Eh(a.b, firebase.SDK_VERSION ? oe(firebase.SDK_VERSION, a.O) : null);
  }Lk.prototype.Ka = function () {
    return Ia(this.O);
  };function Rk(a, b) {
    a.W && F(a.W, "frameworkChanged", a.ra);(a.W = b) && pc(b, "frameworkChanged", a.ra);
  }Lk.prototype.Ga = function () {
    this.l.b && (this.l.stop(), this.l.start());
  };
  function Sk(a) {
    try {
      return firebase.app(a.s).auth();
    } catch (b) {
      throw new M("internal-error", "No firebase.auth.Auth instance is available for the Firebase App '" + a.s + "'!");
    }
  }function Ok(a) {
    return new Ak(function () {
      return a.F(!0);
    }, function (a) {
      return a && "auth/network-request-failed" == a.code ? !0 : !1;
    }, function () {
      var b = a.h.c - na() - 3E5;return 0 < b ? b : 0;
    });
  }function Tk(a) {
    a.o || a.l.b || (a.l.start(), F(a, "tokenChanged", a.V), pc(a, "tokenChanged", a.V));
  }function Uk(a) {
    F(a, "tokenChanged", a.V);a.l.stop();
  }
  function Mk(a, b) {
    a.qa = b;K(a, "_lat", b);
  }function Vk(a, b) {
    w(a.N, function (a) {
      return a == b;
    });
  }function Wk(a) {
    for (var b = [], c = 0; c < a.N.length; c++) {
      b.push(a.N[c](a));
    }return ub(b).then(function () {
      return a;
    });
  }function Xk(a) {
    a.a && !a.I && (a.I = !0, a.a.subscribe(a));
  }
  function Nk(a, b) {
    L(a, { uid: b.uid, displayName: b.displayName || null, photoURL: b.photoURL || null, email: b.email || null, emailVerified: b.emailVerified || !1, phoneNumber: b.phoneNumber || null, isAnonymous: b.isAnonymous || !1, metadata: new Hk(b.createdAt, b.lastLoginAt), providerData: [] });
  }K(Lk.prototype, "providerId", "firebase");function Yk() {}function Zk(a) {
    return A().then(function () {
      if (a.o) throw new M("app-deleted");
    });
  }function $k(a) {
    return Ba(a.providerData, function (a) {
      return a.providerId;
    });
  }
  function al(a, b) {
    b && (bl(a, b.providerId), a.providerData.push(b));
  }function bl(a, b) {
    w(a.providerData, function (a) {
      return a.providerId == b;
    });
  }function cl(a, b, c) {
    ("uid" != b || c) && a.hasOwnProperty(b) && K(a, b, c);
  }
  function dl(a, b) {
    a != b && (L(a, { uid: b.uid, displayName: b.displayName, photoURL: b.photoURL, email: b.email, emailVerified: b.emailVerified, phoneNumber: b.phoneNumber, isAnonymous: b.isAnonymous, providerData: [] }), b.metadata ? K(a, "metadata", Ik(b.metadata)) : K(a, "metadata", new Hk()), v(b.providerData, function (b) {
      al(a, b);
    }), a.h = b.h, K(a, "refreshToken", a.h.a));
  }g = Lk.prototype;g.reload = function () {
    var a = this;return R(this, Zk(this).then(function () {
      return el(a).then(function () {
        return Wk(a);
      }).then(Yk);
    }));
  };
  function el(a) {
    return a.F().then(function (b) {
      var c = a.isAnonymous;return fl(a, b).then(function () {
        c || cl(a, "isAnonymous", !1);return b;
      });
    });
  }g.ac = function (a) {
    return this.F(a).then(function (a) {
      return new zk(a);
    });
  };g.F = function (a) {
    var b = this;return R(this, Zk(this).then(function () {
      return b.h.getToken(a);
    }).then(function (a) {
      if (!a) throw new M("internal-error");a.accessToken != b.qa && (Mk(b, a.accessToken), b.dispatchEvent(new Kk("tokenChanged")));cl(b, "refreshToken", a.refreshToken);return a.accessToken;
    }));
  };
  g.getToken = function (a) {
    Ee["firebase.User.prototype.getToken is deprecated. Please use firebase.User.prototype.getIdToken instead."] || (Ee["firebase.User.prototype.getToken is deprecated. Please use firebase.User.prototype.getIdToken instead."] = !0, "undefined" !== typeof console && "function" === typeof console.warn && console.warn("firebase.User.prototype.getToken is deprecated. Please use firebase.User.prototype.getIdToken instead."));return this.F(a);
  };
  function gl(a, b) {
    b[Gf] && a.qa != b[Gf] && (Ek(a.h, b), a.dispatchEvent(new Kk("tokenChanged")), Mk(a, b[Gf]), cl(a, "refreshToken", a.h.a));
  }function fl(a, b) {
    return P(a.b, qi, { idToken: b }).then(r(a.uc, a));
  }
  g.uc = function (a) {
    a = a.users;if (!a || !a.length) throw new M("internal-error");a = a[0];Nk(this, { uid: a.localId, displayName: a.displayName, photoURL: a.photoUrl, email: a.email, emailVerified: !!a.emailVerified, phoneNumber: a.phoneNumber, lastLoginAt: a.lastLoginAt, createdAt: a.createdAt });for (var b = hl(a), c = 0; c < b.length; c++) {
      al(this, b[c]);
    }cl(this, "isAnonymous", !(this.email && a.passwordHash) && !(this.providerData && this.providerData.length));
  };
  function hl(a) {
    return (a = a.providerUserInfo) && a.length ? Ba(a, function (a) {
      return new Jk(a.rawId, a.providerId, a.email, a.displayName, a.photoUrl, a.phoneNumber);
    }) : [];
  }g.bb = function (a) {
    var b = this,
        c = null;return R(this, a.f(this.b, this.uid).then(function (a) {
      gl(b, a);c = il(b, a, "reauthenticate");b.j = null;return b.reload();
    }).then(function () {
      return c;
    }), !0);
  };g.vc = function (a) {
    return this.bb(a).then(function () {});
  };
  function jl(a, b) {
    return el(a).then(function () {
      if (Fa($k(a), b)) return Wk(a).then(function () {
        throw new M("provider-already-linked");
      });
    });
  }g.$a = function (a) {
    var b = this,
        c = null;return R(this, jl(this, a.providerId).then(function () {
      return b.F();
    }).then(function (c) {
      return a.c(b.b, c);
    }).then(function (a) {
      c = il(b, a, "link");return kl(b, a);
    }).then(function () {
      return c;
    }));
  };g.mc = function (a) {
    return this.$a(a).then(function (a) {
      return a.user;
    });
  };
  g.nc = function (a, b) {
    var c = this;return R(this, jl(this, "phone").then(function () {
      return yk(Sk(c), a, b, r(c.$a, c));
    }));
  };g.wc = function (a, b) {
    var c = this;return R(this, A().then(function () {
      return yk(Sk(c), a, b, r(c.bb, c));
    }), !0);
  };function il(a, b, c) {
    var d = ig(b);b = uf(b);return He({ user: a, credential: d, additionalUserInfo: b, operationType: c });
  }function kl(a, b) {
    gl(a, b);return a.reload().then(function () {
      return a;
    });
  }
  g.mb = function (a) {
    var b = this;return R(this, this.F().then(function (c) {
      return b.b.mb(c, a);
    }).then(function (a) {
      gl(b, a);return b.reload();
    }));
  };g.Nc = function (a) {
    var b = this;return R(this, this.F().then(function (c) {
      return a.c(b.b, c);
    }).then(function (a) {
      gl(b, a);return b.reload();
    }));
  };g.nb = function (a) {
    var b = this;return R(this, this.F().then(function (c) {
      return b.b.nb(c, a);
    }).then(function (a) {
      gl(b, a);return b.reload();
    }));
  };
  g.ob = function (a) {
    if (void 0 === a.displayName && void 0 === a.photoURL) return Zk(this);var b = this;return R(this, this.F().then(function (c) {
      return b.b.ob(c, { displayName: a.displayName, photoUrl: a.photoURL });
    }).then(function (a) {
      gl(b, a);cl(b, "displayName", a.displayName || null);cl(b, "photoURL", a.photoUrl || null);v(b.providerData, function (a) {
        "password" === a.providerId && (K(a, "displayName", b.displayName), K(a, "photoURL", b.photoURL));
      });return Wk(b);
    }).then(Yk));
  };
  g.Mc = function (a) {
    var b = this;return R(this, el(this).then(function (c) {
      return Fa($k(b), a) ? ci(b.b, c, [a]).then(function (a) {
        var c = {};v(a.providerUserInfo || [], function (a) {
          c[a.providerId] = !0;
        });v($k(b), function (a) {
          c[a] || bl(b, a);
        });c[fg.PROVIDER_ID] || K(b, "phoneNumber", null);return Wk(b);
      }) : Wk(b).then(function () {
        throw new M("no-such-provider");
      });
    }));
  };
  g.delete = function () {
    var a = this;return R(this, this.F().then(function (b) {
      return P(a.b, pi, { idToken: b });
    }).then(function () {
      a.dispatchEvent(new Kk("userDeleted"));
    })).then(function () {
      for (var b = 0; b < a.D.length; b++) {
        a.D[b].cancel("app-deleted");
      }Qk(a, null);Rk(a, null);a.D = [];a.o = !0;Uk(a);K(a, "refreshToken", null);a.a && a.a.unsubscribe(a);
    });
  };
  g.qb = function (a, b) {
    return "linkViaPopup" == a && (this.g || null) == b && this.f || "reauthViaPopup" == a && (this.g || null) == b && this.f || "linkViaRedirect" == a && (this.$ || null) == b || "reauthViaRedirect" == a && (this.$ || null) == b ? !0 : !1;
  };g.ga = function (a, b, c, d) {
    "linkViaPopup" != a && "reauthViaPopup" != a || d != (this.g || null) || (c && this.v ? this.v(c) : b && !c && this.f && this.f(b), this.c && (this.c.cancel(), this.c = null), delete this.f, delete this.v);
  };
  g.wa = function (a, b) {
    return "linkViaPopup" == a && b == (this.g || null) ? r(this.vb, this) : "reauthViaPopup" == a && b == (this.g || null) ? r(this.wb, this) : "linkViaRedirect" == a && (this.$ || null) == b ? r(this.vb, this) : "reauthViaRedirect" == a && (this.$ || null) == b ? r(this.wb, this) : null;
  };g.oc = function (a) {
    var b = this;return ll(this, "linkViaPopup", a, function () {
      return jl(b, a.providerId).then(function () {
        return Wk(b);
      });
    }, !1);
  };g.xc = function (a) {
    return ll(this, "reauthViaPopup", a, function () {
      return A();
    }, !0);
  };
  function ll(a, b, c, d, e) {
    if (!re()) return B(new M("operation-not-supported-in-this-environment"));if (a.j && !e) return B(a.j);var f = tf(c.providerId),
        h = qe(a.uid + ":::"),
        m = null;(!te() || je()) && a.B && c.isOAuthProvider && (m = Oi(a.B, a.G, a.s, b, c, null, h, firebase.SDK_VERSION || null));var p = be(m, f && f.Aa, f && f.za);d = d().then(function () {
      ml(a);if (!e) return a.F().then(function () {});
    }).then(function () {
      return ok(a.a, p, b, c, h, !!m);
    }).then(function () {
      return new z(function (c, d) {
        a.ga(b, null, new M("cancelled-popup-request"), a.g || null);
        a.f = c;a.v = d;a.g = h;a.c = a.a.Da(a, b, p, h);
      });
    }).then(function (a) {
      p && ae(p);return a ? He(a) : null;
    }).m(function (a) {
      p && ae(p);throw a;
    });return R(a, d, e);
  }g.pc = function (a) {
    var b = this;return nl(this, "linkViaRedirect", a, function () {
      return jl(b, a.providerId);
    }, !1);
  };g.yc = function (a) {
    return nl(this, "reauthViaRedirect", a, function () {
      return A();
    }, !0);
  };
  function nl(a, b, c, d, e) {
    if (!re()) return B(new M("operation-not-supported-in-this-environment"));if (a.j && !e) return B(a.j);var f = null,
        h = qe(a.uid + ":::");d = d().then(function () {
      ml(a);if (!e) return a.F().then(function () {});
    }).then(function () {
      a.$ = h;return Wk(a);
    }).then(function (b) {
      a.fa && (b = a.fa, b = b.b.set(ol, a.C(), b.a));return b;
    }).then(function () {
      return a.a.Ba(b, c, h);
    }).m(function (b) {
      f = b;if (a.fa) return pl(a.fa);throw f;
    }).then(function () {
      if (f) throw f;
    });return R(a, d, e);
  }
  function ml(a) {
    if (!a.a || !a.I) {
      if (a.a && !a.I) throw new M("internal-error");throw new M("auth-domain-config-required");
    }
  }g.vb = function (a, b) {
    var c = this;this.c && (this.c.cancel(), this.c = null);var d = null,
        e = this.F().then(function (d) {
      return Kf(c.b, { requestUri: a, sessionId: b, idToken: d });
    }).then(function (a) {
      d = il(c, a, "link");return kl(c, a);
    }).then(function () {
      return d;
    });return R(this, e);
  };
  g.wb = function (a, b) {
    var c = this;this.c && (this.c.cancel(), this.c = null);var d = null,
        e = A().then(function () {
      return Ff(Lf(c.b, { requestUri: a, sessionId: b }), c.uid);
    }).then(function (a) {
      d = il(c, a, "reauthenticate");gl(c, a);c.j = null;return c.reload();
    }).then(function () {
      return d;
    });return R(this, e, !0);
  };g.fb = function (a) {
    var b = this,
        c = null;return R(this, this.F().then(function (b) {
      c = b;return "undefined" === typeof a || Ya(a) ? {} : ff(new Xe(a));
    }).then(function (a) {
      return b.b.fb(c, a);
    }).then(function (a) {
      if (b.email != a) return b.reload();
    }).then(function () {}));
  };
  function R(a, b, c) {
    var d = ql(a, b, c);a.D.push(d);d.ha(function () {
      Ga(a.D, d);
    });return d;
  }function ql(a, b, c) {
    return a.j && !c ? (b.cancel(), B(a.j)) : b.m(function (b) {
      !b || "auth/user-disabled" != b.code && "auth/user-token-expired" != b.code || (a.j || a.dispatchEvent(new Kk("userInvalidated")), a.j = b);throw b;
    });
  }g.toJSON = function () {
    return this.C();
  };
  g.C = function () {
    var a = { uid: this.uid, displayName: this.displayName, photoURL: this.photoURL, email: this.email, emailVerified: this.emailVerified, phoneNumber: this.phoneNumber, isAnonymous: this.isAnonymous, providerData: [], apiKey: this.G, appName: this.s, authDomain: this.B, stsTokenManager: this.h.C(), redirectEventId: this.$ || null };this.metadata && ab(a, this.metadata.C());v(this.providerData, function (b) {
      a.providerData.push(Ie(b));
    });return a;
  };
  function rl(a) {
    if (!a.apiKey) return null;var b = { apiKey: a.apiKey, authDomain: a.authDomain, appName: a.appName },
        c = {};if (a.stsTokenManager && a.stsTokenManager.accessToken && a.stsTokenManager.expirationTime) c[Gf] = a.stsTokenManager.accessToken, c.refreshToken = a.stsTokenManager.refreshToken || null, c.expiresIn = (a.stsTokenManager.expirationTime - na()) / 1E3;else return null;var d = new Lk(b, c, a);a.providerData && v(a.providerData, function (a) {
      a && al(d, He(a));
    });a.redirectEventId && (d.$ = a.redirectEventId);return d;
  }
  function sl(a, b, c, d) {
    var e = new Lk(a, b);c && (e.fa = c);d && Pk(e, d);return e.reload().then(function () {
      return e;
    });
  };function tl(a) {
    this.a = a;this.b = sj();
  }var ol = { name: "redirectUser", w: "session" };function pl(a) {
    return wj(a.b, ol, a.a);
  }function ul(a, b) {
    return a.b.get(ol, a.a).then(function (a) {
      a && b && (a.authDomain = b);return rl(a || {});
    });
  };function vl(a) {
    this.a = a;this.b = sj();this.c = null;this.f = wl(this);this.b.addListener(xl("local"), this.a, r(this.g, this));
  }vl.prototype.g = function () {
    var a = this,
        b = xl("local");yl(this, function () {
      return A().then(function () {
        return a.c && "local" != a.c.w ? a.b.get(b, a.a) : null;
      }).then(function (c) {
        if (c) return zl(a, "local").then(function () {
          a.c = b;
        });
      });
    });
  };function zl(a, b) {
    var c = [],
        d;for (d in oj) {
      oj[d] !== b && c.push(wj(a.b, xl(oj[d]), a.a));
    }c.push(wj(a.b, Al, a.a));return tb(c);
  }
  function wl(a) {
    var b = xl("local"),
        c = xl("session"),
        d = xl("none");return vj(a.b, b, a.a).then(function () {
      return a.b.get(c, a.a);
    }).then(function (e) {
      return e ? c : a.b.get(d, a.a).then(function (c) {
        return c ? d : a.b.get(b, a.a).then(function (c) {
          return c ? b : a.b.get(Al, a.a).then(function (a) {
            return a ? xl(a) : b;
          });
        });
      });
    }).then(function (b) {
      a.c = b;return zl(a, b.w);
    }).m(function () {
      a.c || (a.c = b);
    });
  }var Al = { name: "persistence", w: "session" };function xl(a) {
    return { name: "authUser", w: a };
  }
  vl.prototype.ib = function (a) {
    var b = null,
        c = this;pj(a);return yl(this, function () {
      return a != c.c.w ? c.b.get(c.c, c.a).then(function (d) {
        b = d;return zl(c, a);
      }).then(function () {
        c.c = xl(a);if (b) return c.b.set(c.c, b, c.a);
      }) : A();
    });
  };function Bl(a) {
    return yl(a, function () {
      return a.b.set(Al, a.c.w, a.a);
    });
  }function Cl(a, b) {
    return yl(a, function () {
      return a.b.set(a.c, b.C(), a.a);
    });
  }function Dl(a) {
    return yl(a, function () {
      return wj(a.b, a.c, a.a);
    });
  }
  function Fl(a, b) {
    return yl(a, function () {
      return a.b.get(a.c, a.a).then(function (a) {
        a && b && (a.authDomain = b);return rl(a || {});
      });
    });
  }function yl(a, b) {
    a.f = a.f.then(b, b);return a.f;
  };function Gl(a) {
    this.l = !1;K(this, "app", a);if (S(this).options && S(this).options.apiKey) a = firebase.SDK_VERSION ? oe(firebase.SDK_VERSION) : null, this.b = new xh(S(this).options && S(this).options.apiKey, ui(vi), a);else throw new M("invalid-api-key");this.N = [];this.o = [];this.I = [];this.Ob = firebase.INTERNAL.createSubscribe(r(this.ic, this));this.O = void 0;this.Pb = firebase.INTERNAL.createSubscribe(r(this.jc, this));Hl(this, null);this.h = new vl(S(this).options.apiKey + ":" + S(this).name);this.G = new tl(S(this).options.apiKey + ":" + S(this).name);this.V = T(this, Il(this));this.j = T(this, Jl(this));this.X = !1;this.ia = r(this.Ic, this);this.Ga = r(this.ka, this);this.qa = r(this.Yb, this);this.ra = r(this.gc, this);this.sa = r(this.hc, this);Kl(this);this.INTERNAL = {};this.INTERNAL["delete"] = r(this.delete, this);this.INTERNAL.logFramework = r(this.qc, this);this.s = 0;G.call(this);Ll(this);this.D = [];
  }t(Gl, G);function Ml(a) {
    D.call(this, "languageCodeChanged");this.g = a;
  }t(Ml, D);function Nl(a) {
    D.call(this, "frameworkChanged");this.c = a;
  }t(Nl, D);g = Gl.prototype;
  g.ib = function (a) {
    a = this.h.ib(a);return T(this, a);
  };g.na = function (a) {
    this.W === a || this.l || (this.W = a, Dh(this.b, this.W), this.dispatchEvent(new Ml(this.ca())));
  };g.ca = function () {
    return this.W;
  };g.Oc = function () {
    var a = k.navigator;this.na(a ? a.languages && a.languages[0] || a.language || a.userLanguage || null : null);
  };g.qc = function (a) {
    this.D.push(a);Eh(this.b, firebase.SDK_VERSION ? oe(firebase.SDK_VERSION, this.D) : null);this.dispatchEvent(new Nl(this.D));
  };g.Ka = function () {
    return Ia(this.D);
  };
  function Ll(a) {
    Object.defineProperty(a, "lc", { get: function get() {
        return this.ca();
      }, set: function set(a) {
        this.na(a);
      }, enumerable: !1 });a.W = null;
  }g.toJSON = function () {
    return { apiKey: S(this).options.apiKey, authDomain: S(this).options.authDomain, appName: S(this).name, currentUser: U(this) && U(this).C() };
  };function Ol(a) {
    return a.Nb || B(new M("auth-domain-config-required"));
  }
  function Kl(a) {
    var b = S(a).options.authDomain,
        c = S(a).options.apiKey;b && re() && (a.Nb = a.V.then(function () {
      if (!a.l) {
        a.a = qk(b, c, S(a).name);a.a.subscribe(a);U(a) && Xk(U(a));if (a.B) {
          Xk(a.B);var d = a.B;d.na(a.ca());Qk(d, a);d = a.B;Pk(d, a.D);Rk(d, a);a.B = null;
        }return a.a;
      }
    }));
  }g.qb = function (a, b) {
    switch (a) {case "unknown":case "signInViaRedirect":
        return !0;case "signInViaPopup":
        return this.g == b && !!this.f;default:
        return !1;}
  };
  g.ga = function (a, b, c, d) {
    "signInViaPopup" == a && this.g == d && (c && this.v ? this.v(c) : b && !c && this.f && this.f(b), this.c && (this.c.cancel(), this.c = null), delete this.f, delete this.v);
  };g.wa = function (a, b) {
    return "signInViaRedirect" == a || "signInViaPopup" == a && this.g == b && this.f ? r(this.Xb, this) : null;
  };
  g.Xb = function (a, b) {
    var c = this;a = { requestUri: a, sessionId: b };this.c && (this.c.cancel(), this.c = null);var d = null,
        e = null,
        f = If(c.b, a).then(function (a) {
      d = ig(a);e = uf(a);return a;
    });a = c.V.then(function () {
      return f;
    }).then(function (a) {
      return Pl(c, a);
    }).then(function () {
      return He({ user: U(c), credential: d, additionalUserInfo: e, operationType: "signIn" });
    });return T(this, a);
  };
  g.Gc = function (a) {
    if (!re()) return B(new M("operation-not-supported-in-this-environment"));var b = this,
        c = tf(a.providerId),
        d = qe(),
        e = null;(!te() || je()) && S(this).options.authDomain && a.isOAuthProvider && (e = Oi(S(this).options.authDomain, S(this).options.apiKey, S(this).name, "signInViaPopup", a, null, d, firebase.SDK_VERSION || null));var f = be(e, c && c.Aa, c && c.za);c = Ol(this).then(function (b) {
      return ok(b, f, "signInViaPopup", a, d, !!e);
    }).then(function () {
      return new z(function (a, c) {
        b.ga("signInViaPopup", null, new M("cancelled-popup-request"), b.g);b.f = a;b.v = c;b.g = d;b.c = b.a.Da(b, "signInViaPopup", f, d);
      });
    }).then(function (a) {
      f && ae(f);return a ? He(a) : null;
    }).m(function (a) {
      f && ae(f);throw a;
    });return T(this, c);
  };g.Hc = function (a) {
    if (!re()) return B(new M("operation-not-supported-in-this-environment"));var b = this,
        c = Ol(this).then(function () {
      return Bl(b.h);
    }).then(function () {
      return b.a.Ba("signInViaRedirect", a);
    });return T(this, c);
  };
  g.da = function () {
    if (!re()) return B(new M("operation-not-supported-in-this-environment"));var a = this,
        b = Ol(this).then(function () {
      return a.a.da();
    }).then(function (a) {
      return a ? He(a) : null;
    });return T(this, b);
  };function Pl(a, b) {
    var c = {};c.apiKey = S(a).options.apiKey;c.authDomain = S(a).options.authDomain;c.appName = S(a).name;return a.V.then(function () {
      return sl(c, b, a.G, a.Ka());
    }).then(function (b) {
      if (U(a) && b.uid == U(a).uid) return dl(U(a), b), a.ka(b);Hl(a, b);Xk(b);return a.ka(b);
    }).then(function () {
      Ql(a);
    });
  }
  function Hl(a, b) {
    U(a) && (Vk(U(a), a.Ga), F(U(a), "tokenChanged", a.qa), F(U(a), "userDeleted", a.ra), F(U(a), "userInvalidated", a.sa), Uk(U(a)));b && (b.N.push(a.Ga), pc(b, "tokenChanged", a.qa), pc(b, "userDeleted", a.ra), pc(b, "userInvalidated", a.sa), 0 < a.s && Tk(b));K(a, "currentUser", b);b && (b.na(a.ca()), Qk(b, a), Pk(b, a.D), Rk(b, a));
  }g.kb = function () {
    var a = this,
        b = this.j.then(function () {
      if (!U(a)) return A();Hl(a, null);return Dl(a.h).then(function () {
        Ql(a);
      });
    });return T(this, b);
  };
  function Rl(a) {
    var b = ul(a.G, S(a).options.authDomain).then(function (b) {
      if (a.B = b) b.fa = a.G;return pl(a.G);
    });return T(a, b);
  }function Il(a) {
    var b = S(a).options.authDomain,
        c = Rl(a).then(function () {
      return Fl(a.h, b);
    }).then(function (b) {
      return b ? (b.fa = a.G, a.B && (a.B.$ || null) == (b.$ || null) ? b : b.reload().then(function () {
        return Cl(a.h, b).then(function () {
          return b;
        });
      }).m(function (c) {
        return "auth/network-request-failed" == c.code ? b : Dl(a.h);
      })) : null;
    }).then(function (b) {
      Hl(a, b || null);
    });return T(a, c);
  }
  function Jl(a) {
    return a.V.then(function () {
      return a.da();
    }).m(function () {}).then(function () {
      if (!a.l) return a.ia();
    }).m(function () {}).then(function () {
      if (!a.l) {
        a.X = !0;var b = a.h;b.b.addListener(xl("local"), b.a, a.ia);
      }
    });
  }
  g.Ic = function () {
    var a = this;return Fl(this.h, S(this).options.authDomain).then(function (b) {
      if (!a.l) {
        var c;if (c = U(a) && b) {
          c = U(a).uid;var d = b.uid;c = void 0 === c || null === c || "" === c || void 0 === d || null === d || "" === d ? !1 : c == d;
        }if (c) return dl(U(a), b), U(a).F();if (U(a) || b) Hl(a, b), b && (Xk(b), b.fa = a.G), a.a && a.a.subscribe(a), Ql(a);
      }
    });
  };g.ka = function (a) {
    return Cl(this.h, a);
  };g.Yb = function () {
    Ql(this);this.ka(U(this));
  };g.gc = function () {
    this.kb();
  };g.hc = function () {
    this.kb();
  };
  function Sl(a, b) {
    var c = null,
        d = null;return T(a, b.then(function (b) {
      c = ig(b);d = uf(b);return Pl(a, b);
    }).then(function () {
      return He({ user: U(a), credential: c, additionalUserInfo: d, operationType: "signIn" });
    }));
  }g.ic = function (a) {
    var b = this;this.addAuthTokenListener(function () {
      a.next(U(b));
    });
  };g.jc = function (a) {
    var b = this;Tl(this, function () {
      a.next(U(b));
    });
  };g.sc = function (a, b, c) {
    var d = this;this.X && firebase.Promise.resolve().then(function () {
      n(a) ? a(U(d)) : n(a.next) && a.next(U(d));
    });return this.Ob(a, b, c);
  };
  g.rc = function (a, b, c) {
    var d = this;this.X && firebase.Promise.resolve().then(function () {
      d.O = d.getUid();n(a) ? a(U(d)) : n(a.next) && a.next(U(d));
    });return this.Pb(a, b, c);
  };g.$b = function (a) {
    var b = this,
        c = this.j.then(function () {
      return U(b) ? U(b).F(a).then(function (a) {
        return { accessToken: a };
      }) : null;
    });return T(this, c);
  };g.Cc = function (a) {
    return this.Hb(a).then(function (a) {
      return a.user;
    });
  };
  g.Hb = function (a) {
    var b = this;return this.j.then(function () {
      return Sl(b, P(b.b, si, { token: a }));
    }).then(function (a) {
      var c = a.user;cl(c, "isAnonymous", !1);b.ka(c);return a;
    });
  };g.Ib = function (a, b) {
    var c = this;return this.j.then(function () {
      return Sl(c, P(c.b, Xf, { email: a, password: b }));
    });
  };g.Dc = function (a, b) {
    return this.Ib(a, b).then(function (a) {
      return a.user;
    });
  };g.Sb = function (a, b) {
    return this.sb(a, b).then(function (a) {
      return a.user;
    });
  };
  g.sb = function (a, b) {
    var c = this;return this.j.then(function () {
      return Sl(c, P(c.b, oi, { email: a, password: b }));
    });
  };g.Bc = function (a) {
    return this.Oa(a).then(function (a) {
      return a.user;
    });
  };g.Oa = function (a) {
    var b = this;return this.j.then(function () {
      return Sl(b, a.xa(b.b));
    });
  };g.jb = function () {
    return this.Jb().then(function (a) {
      return a.user;
    });
  };
  g.Jb = function () {
    var a = this;return this.j.then(function () {
      var b = U(a);if (b && b.isAnonymous) {
        var c = He({ providerId: null, isNewUser: !1 });return He({ user: b, credential: null, additionalUserInfo: c, operationType: "signIn" });
      }return Sl(a, a.b.jb()).then(function (b) {
        var c = b.user;cl(c, "isAnonymous", !0);a.ka(c);return b;
      });
    });
  };function S(a) {
    return a.app;
  }function U(a) {
    return a.currentUser;
  }g.getUid = function () {
    return U(this) && U(this).uid || null;
  };function Ul(a) {
    return U(a) && U(a)._lat || null;
  }
  function Ql(a) {
    if (a.X) {
      for (var b = 0; b < a.o.length; b++) {
        if (a.o[b]) a.o[b](Ul(a));
      }if (a.O !== a.getUid() && a.I.length) for (a.O = a.getUid(), b = 0; b < a.I.length; b++) {
        if (a.I[b]) a.I[b](Ul(a));
      }
    }
  }g.Qb = function (a) {
    this.addAuthTokenListener(a);this.s++;0 < this.s && U(this) && Tk(U(this));
  };g.zc = function (a) {
    var b = this;v(this.o, function (c) {
      c == a && b.s--;
    });0 > this.s && (this.s = 0);0 == this.s && U(this) && Uk(U(this));this.removeAuthTokenListener(a);
  };
  g.addAuthTokenListener = function (a) {
    var b = this;this.o.push(a);T(this, this.j.then(function () {
      b.l || Fa(b.o, a) && a(Ul(b));
    }));
  };g.removeAuthTokenListener = function (a) {
    w(this.o, function (b) {
      return b == a;
    });
  };function Tl(a, b) {
    a.I.push(b);T(a, a.j.then(function () {
      !a.l && Fa(a.I, b) && a.O !== a.getUid() && (a.O = a.getUid(), b(Ul(a)));
    }));
  }
  g.delete = function () {
    this.l = !0;for (var a = 0; a < this.N.length; a++) {
      this.N[a].cancel("app-deleted");
    }this.N = [];this.h && (a = this.h, a.b.removeListener(xl("local"), a.a, this.ia));this.a && this.a.unsubscribe(this);return firebase.Promise.resolve();
  };function T(a, b) {
    a.N.push(b);b.ha(function () {
      Ga(a.N, b);
    });return b;
  }g.Vb = function (a) {
    return T(this, Oh(this.b, a));
  };g.Wb = function (a) {
    return T(this, Qh(this.b, a));
  };g.kc = function (a) {
    return !!ag(a);
  };
  g.hb = function (a, b) {
    var c = this;return T(this, A().then(function () {
      var a = new Xe(b);if (!a.c) throw new M("argument-error", ef + " must be true when sending sign in link to email");return ff(a);
    }).then(function (b) {
      return c.b.hb(a, b);
    }).then(function () {}));
  };g.Pc = function (a) {
    return this.Ia(a).then(function (a) {
      return a.data.email;
    });
  };g.Wa = function (a, b) {
    return T(this, this.b.Wa(a, b).then(function () {}));
  };g.Ia = function (a) {
    return T(this, this.b.Ia(a).then(function (a) {
      return new Le(a);
    }));
  };
  g.Ua = function (a) {
    return T(this, this.b.Ua(a).then(function () {}));
  };g.gb = function (a, b) {
    var c = this;return T(this, A().then(function () {
      return "undefined" === typeof b || Ya(b) ? {} : ff(new Xe(b));
    }).then(function (b) {
      return c.b.gb(a, b);
    }).then(function () {}));
  };g.Fc = function (a, b) {
    return T(this, yk(this, a, b, r(this.Oa, this)));
  };g.Ec = function (a, b) {
    var c = this;return T(this, A().then(function () {
      var d = $f(a, b || Ud());return c.Oa(d);
    }));
  };function Vl(a, b, c, d, e, f) {
    K(this, "type", "recaptcha");this.b = this.c = null;this.o = !1;this.l = b;this.a = c || { theme: "light", type: "image" };this.g = [];if (this.a[Wl]) throw new M("argument-error", "sitekey should not be provided for reCAPTCHA as one is automatically provisioned for the current project.");this.h = "invisible" === this.a[Xl];if (!k.document) throw new M("operation-not-supported-in-this-environment", "RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment with DOM support.");if (!Hd(b) || !this.h && Hd(b).hasChildNodes()) throw new M("argument-error", "reCAPTCHA container is either not found or already contains inner elements!");this.u = new xh(a, f || null, e || null);this.s = d || function () {
      return null;
    };var h = this;this.j = [];var m = this.a[Yl];this.a[Yl] = function (a) {
      Zl(h, a);if ("function" === typeof m) m(a);else if ("string" === typeof m) {
        var b = J(m, k);"function" === typeof b && b(a);
      }
    };var p = this.a[$l];this.a[$l] = function () {
      Zl(h, null);if ("function" === typeof p) p();else if ("string" === typeof p) {
        var a = J(p, k);"function" === typeof a && a();
      }
    };
  }var Yl = "callback",
      $l = "expired-callback",
      Wl = "sitekey",
      Xl = "size";function Zl(a, b) {
    for (var c = 0; c < a.j.length; c++) {
      try {
        a.j[c](b);
      } catch (d) {}
    }
  }function am(a, b) {
    w(a.j, function (a) {
      return a == b;
    });
  }function bm(a, b) {
    a.g.push(b);b.ha(function () {
      Ga(a.g, b);
    });return b;
  }g = Vl.prototype;
  g.ya = function () {
    var a = this;return this.c ? this.c : this.c = bm(this, A().then(function () {
      if (se() && !ke()) return fe();throw new M("operation-not-supported-in-this-environment", "RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment.");
    }).then(function () {
      return cm(dm(), a.s());
    }).then(function () {
      return P(a.u, ri, {});
    }).then(function (b) {
      a.a[Wl] = b.recaptchaSiteKey;
    }).m(function (b) {
      a.c = null;throw b;
    }));
  };
  g.render = function () {
    em(this);var a = this;return bm(this, this.ya().then(function () {
      if (null === a.b) {
        var b = a.l;if (!a.h) {
          var c = Hd(b);b = Kd("DIV");c.appendChild(b);
        }a.b = grecaptcha.render(b, a.a);
      }return a.b;
    }));
  };g.verify = function () {
    em(this);var a = this;return bm(this, this.render().then(function (b) {
      return new z(function (c) {
        var d = grecaptcha.getResponse(b);if (d) c(d);else {
          var e = function e(b) {
            b && (am(a, e), c(b));
          };a.j.push(e);a.h && grecaptcha.execute(a.b);
        }
      });
    }));
  };g.reset = function () {
    em(this);null !== this.b && grecaptcha.reset(this.b);
  };
  function em(a) {
    if (a.o) throw new M("internal-error", "RecaptchaVerifier instance has been destroyed.");
  }g.clear = function () {
    em(this);this.o = !0;dm().b--;for (var a = 0; a < this.g.length; a++) {
      this.g[a].cancel("RecaptchaVerifier instance has been destroyed.");
    }if (!this.h) {
      a = Hd(this.l);for (var b; b = a.firstChild;) {
        a.removeChild(b);
      }
    }
  };var fm = pd("https://www.google.com/recaptcha/api.js?onload=%{onload}&render=explicit&hl=%{hl}");
  function gm() {
    this.b = k.grecaptcha ? Infinity : 0;this.c = null;this.a = "__rcb" + Math.floor(1E6 * Math.random()).toString();
  }var hm = new ze(3E4, 6E4);
  function cm(a, b) {
    return new z(function (c, d) {
      var e = setTimeout(function () {
        d(new M("network-request-failed"));
      }, hm.get());if (!k.grecaptcha || b !== a.c && !a.b) {
        k[a.a] = function () {
          if (k.grecaptcha) {
            a.c = b;var f = k.grecaptcha.render;k.grecaptcha.render = function (b, c) {
              b = f(b, c);a.b++;return b;
            };clearTimeout(e);c();
          } else clearTimeout(e), d(new M("internal-error"));delete k[a.a];
        };var f = td(fm, { onload: a.a, hl: b || "" });A(ph(f)).m(function () {
          clearTimeout(e);d(new M("internal-error", "Unable to load external reCAPTCHA dependencies!"));
        });
      } else clearTimeout(e), c();
    });
  }var im = null;function dm() {
    im || (im = new gm());return im;
  }
  function jm(a, b, c) {
    try {
      this.f = c || firebase.app();
    } catch (f) {
      throw new M("argument-error", "No firebase.app.App instance is currently initialized.");
    }if (this.f.options && this.f.options.apiKey) c = this.f.options.apiKey;else throw new M("invalid-api-key");var d = this,
        e = null;try {
      e = this.f.auth().Ka();
    } catch (f) {}e = firebase.SDK_VERSION ? oe(firebase.SDK_VERSION, e) : null;Vl.call(this, c, a, b, function () {
      try {
        var a = d.f.auth().ca();
      } catch (h) {
        a = null;
      }return a;
    }, e, ui(vi));
  }t(jm, Vl);function km(a, b, c, d) {
    a: {
      c = Array.prototype.slice.call(c);var e = 0;for (var f = !1, h = 0; h < b.length; h++) {
        if (b[h].optional) f = !0;else {
          if (f) throw new M("internal-error", "Argument validator encountered a required argument after an optional argument.");e++;
        }
      }f = b.length;if (c.length < e || f < c.length) d = "Expected " + (e == f ? 1 == e ? "1 argument" : e + " arguments" : e + "-" + f + " arguments") + " but got " + c.length + ".";else {
        for (e = 0; e < c.length; e++) {
          if (f = b[e].optional && void 0 === c[e], !b[e].M(c[e]) && !f) {
            b = b[e];if (0 > e || e >= lm.length) throw new M("internal-error", "Argument validator received an unsupported number of arguments.");c = lm[e];d = (d ? "" : c + " argument ") + (b.name ? '"' + b.name + '" ' : "") + "must be " + b.K + ".";break a;
          }
        }d = null;
      }
    }if (d) throw new M("argument-error", a + " failed: " + d);
  }var lm = "First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" ");function V(a, b) {
    return { name: a || "", K: "a valid string", optional: !!b, M: l };
  }function mm() {
    return { name: "opt_forceRefresh", K: "a boolean", optional: !0, M: ba };
  }
  function W(a, b) {
    return { name: a || "", K: "a valid object", optional: !!b, M: q };
  }function nm(a, b) {
    return { name: a || "", K: "a function", optional: !!b, M: n };
  }function om(a, b) {
    return { name: a || "", K: "null", optional: !!b, M: ea };
  }function pm() {
    return { name: "", K: "an HTML element", optional: !1, M: function M(a) {
        return !!(a && a instanceof Element);
      } };
  }function qm() {
    return { name: "auth", K: "an instance of Firebase Auth", optional: !0, M: function M(a) {
        return !!(a && a instanceof Gl);
      } };
  }
  function rm() {
    return { name: "app", K: "an instance of Firebase App", optional: !0, M: function M(a) {
        return !!(a && a instanceof firebase.app.App);
      } };
  }function sm(a) {
    return { name: a ? a + "Credential" : "credential", K: a ? "a valid " + a + " credential" : "a valid credential", optional: !1, M: function M(b) {
        if (!b) return !1;var c = !a || b.providerId === a;return !(!b.xa || !c);
      } };
  }
  function tm() {
    return { name: "authProvider", K: "a valid Auth provider", optional: !1, M: function M(a) {
        return !!(a && a.providerId && a.hasOwnProperty && a.hasOwnProperty("isOAuthProvider"));
      } };
  }function um() {
    return { name: "applicationVerifier", K: "an implementation of firebase.auth.ApplicationVerifier", optional: !1, M: function M(a) {
        return !!(a && l(a.type) && n(a.verify));
      } };
  }function X(a, b, c, d) {
    return { name: c || "", K: a.K + " or " + b.K, optional: !!d, M: function M(c) {
        return a.M(c) || b.M(c);
      } };
  };function Y(a, b) {
    for (var c in b) {
      var d = b[c].name;a[d] = vm(d, a[c], b[c].i);
    }
  }function Z(a, b, c, d) {
    a[b] = vm(b, c, d);
  }function vm(a, b, c) {
    function d() {
      var a = Array.prototype.slice.call(arguments);km(e, c, a);return b.apply(this, a);
    }if (!c) return b;var e = wm(a),
        f;for (f in b) {
      d[f] = b[f];
    }for (f in b.prototype) {
      d.prototype[f] = b.prototype[f];
    }return d;
  }function wm(a) {
    a = a.split(".");return a[a.length - 1];
  };Y(Gl.prototype, { Ua: { name: "applyActionCode", i: [V("code")] }, Ia: { name: "checkActionCode", i: [V("code")] }, Wa: { name: "confirmPasswordReset", i: [V("code"), V("newPassword")] }, Sb: { name: "createUserWithEmailAndPassword", i: [V("email"), V("password")] }, sb: { name: "createUserAndRetrieveDataWithEmailAndPassword", i: [V("email"), V("password")] }, Vb: { name: "fetchProvidersForEmail", i: [V("email")] }, Wb: { name: "fetchSignInMethodsForEmail", i: [V("email")] }, da: { name: "getRedirectResult", i: [] }, kc: { name: "isSignInWithEmailLink", i: [V("emailLink")] },
    rc: { name: "onAuthStateChanged", i: [X(W(), nm(), "nextOrObserver"), nm("opt_error", !0), nm("opt_completed", !0)] }, sc: { name: "onIdTokenChanged", i: [X(W(), nm(), "nextOrObserver"), nm("opt_error", !0), nm("opt_completed", !0)] }, gb: { name: "sendPasswordResetEmail", i: [V("email"), X(W("opt_actionCodeSettings", !0), om(null, !0), "opt_actionCodeSettings", !0)] }, hb: { name: "sendSignInLinkToEmail", i: [V("email"), W("actionCodeSettings")] }, ib: { name: "setPersistence", i: [V("persistence")] }, Oa: { name: "signInAndRetrieveDataWithCredential",
      i: [sm()] }, jb: { name: "signInAnonymously", i: [] }, Jb: { name: "signInAnonymouslyAndRetrieveData", i: [] }, Bc: { name: "signInWithCredential", i: [sm()] }, Cc: { name: "signInWithCustomToken", i: [V("token")] }, Hb: { name: "signInAndRetrieveDataWithCustomToken", i: [V("token")] }, Dc: { name: "signInWithEmailAndPassword", i: [V("email"), V("password")] }, Ec: { name: "signInWithEmailLink", i: [V("email"), V("emailLink", !0)] }, Ib: { name: "signInAndRetrieveDataWithEmailAndPassword", i: [V("email"), V("password")] }, Fc: { name: "signInWithPhoneNumber", i: [V("phoneNumber"), um()] }, Gc: { name: "signInWithPopup", i: [tm()] }, Hc: { name: "signInWithRedirect", i: [tm()] }, kb: { name: "signOut", i: [] }, toJSON: { name: "toJSON", i: [V(null, !0)] }, Oc: { name: "useDeviceLanguage", i: [] }, Pc: { name: "verifyPasswordResetCode", i: [V("code")] } });(function (a, b) {
    for (var c in b) {
      var d = b[c].name;if (d !== c) {
        var e = b[c].Rb;Object.defineProperty(a, d, { get: function get() {
            return this[c];
          }, set: function set(a) {
            km(d, [e], [a], !0);this[c] = a;
          }, enumerable: !0 });
      }
    }
  })(Gl.prototype, { lc: { name: "languageCode", Rb: X(V(), om(), "languageCode") } });
  Gl.Persistence = oj;Gl.Persistence.LOCAL = "local";Gl.Persistence.SESSION = "session";Gl.Persistence.NONE = "none";
  Y(Lk.prototype, { "delete": { name: "delete", i: [] }, ac: { name: "getIdTokenResult", i: [mm()] }, F: { name: "getIdToken", i: [mm()] }, getToken: { name: "getToken", i: [mm()] }, $a: { name: "linkAndRetrieveDataWithCredential", i: [sm()] }, mc: { name: "linkWithCredential", i: [sm()] }, nc: { name: "linkWithPhoneNumber", i: [V("phoneNumber"), um()] }, oc: { name: "linkWithPopup", i: [tm()] }, pc: { name: "linkWithRedirect", i: [tm()] }, bb: { name: "reauthenticateAndRetrieveDataWithCredential", i: [sm()] }, vc: { name: "reauthenticateWithCredential", i: [sm()] }, wc: { name: "reauthenticateWithPhoneNumber",
      i: [V("phoneNumber"), um()] }, xc: { name: "reauthenticateWithPopup", i: [tm()] }, yc: { name: "reauthenticateWithRedirect", i: [tm()] }, reload: { name: "reload", i: [] }, fb: { name: "sendEmailVerification", i: [X(W("opt_actionCodeSettings", !0), om(null, !0), "opt_actionCodeSettings", !0)] }, toJSON: { name: "toJSON", i: [V(null, !0)] }, Mc: { name: "unlink", i: [V("provider")] }, mb: { name: "updateEmail", i: [V("email")] }, nb: { name: "updatePassword", i: [V("password")] }, Nc: { name: "updatePhoneNumber", i: [sm("phone")] }, ob: { name: "updateProfile", i: [W("profile")] } });
  Y(z.prototype, { ha: { name: "finally" }, m: { name: "catch" }, then: { name: "then" } });Y(xk.prototype, { confirm: { name: "confirm", i: [V("verificationCode")] } });Z(O, "credential", function (a, b) {
    return new Vf(a, b);
  }, [V("email"), V("password")]);Y(Nf.prototype, { ta: { name: "addScope", i: [V("scope")] }, Ca: { name: "setCustomParameters", i: [W("customOAuthParameters")] } });Z(Nf, "credential", Of, [X(V(), W(), "token")]);Z(O, "credentialWithLink", $f, [V("email"), V("emailLink")]);
  Y(Pf.prototype, { ta: { name: "addScope", i: [V("scope")] }, Ca: { name: "setCustomParameters", i: [W("customOAuthParameters")] } });Z(Pf, "credential", Qf, [X(V(), W(), "token")]);Y(Rf.prototype, { ta: { name: "addScope", i: [V("scope")] }, Ca: { name: "setCustomParameters", i: [W("customOAuthParameters")] } });Z(Rf, "credential", Sf, [X(V(), X(W(), om()), "idToken"), X(V(), om(), "accessToken", !0)]);Y(Tf.prototype, { Ca: { name: "setCustomParameters", i: [W("customOAuthParameters")] } });Z(Tf, "credential", Uf, [X(V(), W(), "token"), V("secret", !0)]);
  Y(N.prototype, { ta: { name: "addScope", i: [V("scope")] }, credential: { name: "credential", i: [X(V(), om(), "idToken", !0), X(V(), om(), "accessToken", !0)] }, Ca: { name: "setCustomParameters", i: [W("customOAuthParameters")] } });Z(fg, "credential", hg, [V("verificationId"), V("verificationCode")]);Y(fg.prototype, { Sa: { name: "verifyPhoneNumber", i: [V("phoneNumber"), um()] } });Y(M.prototype, { toJSON: { name: "toJSON", i: [V(null, !0)] } });Y(pg.prototype, { toJSON: { name: "toJSON", i: [V(null, !0)] } });
  Y(og.prototype, { toJSON: { name: "toJSON", i: [V(null, !0)] } });Y(jm.prototype, { clear: { name: "clear", i: [] }, render: { name: "render", i: [] }, verify: { name: "verify", i: [] } });
  (function () {
    if ("undefined" !== typeof firebase && firebase.INTERNAL && firebase.INTERNAL.registerService) {
      var a = { Auth: Gl, Error: M };Z(a, "EmailAuthProvider", O, []);Z(a, "FacebookAuthProvider", Nf, []);Z(a, "GithubAuthProvider", Pf, []);Z(a, "GoogleAuthProvider", Rf, []);Z(a, "TwitterAuthProvider", Tf, []);Z(a, "OAuthProvider", N, [V("providerId")]);Z(a, "PhoneAuthProvider", fg, [qm()]);Z(a, "RecaptchaVerifier", jm, [X(V(), pm(), "recaptchaContainer"), W("recaptchaParameters", !0), rm()]);firebase.INTERNAL.registerService("auth", function (a, c) {
        a = new Gl(a);c({ INTERNAL: { getUid: r(a.getUid, a), getToken: r(a.$b, a), addAuthTokenListener: r(a.Qb, a), removeAuthTokenListener: r(a.zc, a) } });return a;
      }, a, function (a, c) {
        if ("create" === a) try {
          c.auth();
        } catch (d) {}
      });firebase.INTERNAL.extendNamespace({ User: Lk });
    } else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");
  })();
}).call(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});

/***/ }),

/***/ "Vy1O":
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "XgVs":
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "YtIj":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

__webpack_require__("VuKk");

/***/ }),

/***/ "ZsiJ":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerDatabase", function() { return registerDatabase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Database", function() { return Database; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Query", function() { return Query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Reference", function() { return Reference; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enableLogging", function() { return enableLogging; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerValue", function() { return ServerValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataSnapshot", function() { return DataSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnDisconnect", function() { return OnDisconnect; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__firebase_util__ = __webpack_require__("xaOn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__firebase_logger__ = __webpack_require__("fjI4");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tslib__ = __webpack_require__("TToO");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__firebase_app__ = __webpack_require__("SHXD");
/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Wraps a DOM Storage object and:
 * - automatically encode objects as JSON strings before storing them to allow us to store arbitrary types.
 * - prefixes names with "firebase:" to avoid collisions with app data.
 *
 * We automatically (see storage.js) create two such wrappers, one for sessionStorage,
 * and one for localStorage.
 *
 * @constructor
 */var DOMStorageWrapper=/** @class */function(){/**
     * @param {Storage} domStorage_ The underlying storage object (e.g. localStorage or sessionStorage)
     */function DOMStorageWrapper(domStorage_){this.domStorage_=domStorage_;// Use a prefix to avoid collisions with other stuff saved by the app.
this.prefix_='firebase:';}/**
     * @param {string} key The key to save the value under
     * @param {?Object} value The value being stored, or null to remove the key.
     */DOMStorageWrapper.prototype.set=function(key,value){if(value==null){this.domStorage_.removeItem(this.prefixedName_(key));}else{this.domStorage_.setItem(this.prefixedName_(key),Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(value));}};/**
     * @param {string} key
     * @return {*} The value that was stored under this key, or null
     */DOMStorageWrapper.prototype.get=function(key){var storedVal=this.domStorage_.getItem(this.prefixedName_(key));if(storedVal==null){return null;}else{return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["B" /* jsonEval */])(storedVal);}};/**
     * @param {string} key
     */DOMStorageWrapper.prototype.remove=function(key){this.domStorage_.removeItem(this.prefixedName_(key));};/**
     * @param {string} name
     * @return {string}
     */DOMStorageWrapper.prototype.prefixedName_=function(name){return this.prefix_+name;};DOMStorageWrapper.prototype.toString=function(){return this.domStorage_.toString();};return DOMStorageWrapper;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An in-memory storage implementation that matches the API of DOMStorageWrapper
 * (TODO: create interface for both to implement).
 *
 * @constructor
 */var MemoryStorage=/** @class */function(){function MemoryStorage(){this.cache_={};this.isInMemoryStorage=true;}MemoryStorage.prototype.set=function(key,value){if(value==null){delete this.cache_[key];}else{this.cache_[key]=value;}};MemoryStorage.prototype.get=function(key){if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.cache_,key)){return this.cache_[key];}return null;};MemoryStorage.prototype.remove=function(key){delete this.cache_[key];};return MemoryStorage;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Helper to create a DOMStorageWrapper or else fall back to MemoryStorage.
 * TODO: Once MemoryStorage and DOMStorageWrapper have a shared interface this method annotation should change
 * to reflect this type
 *
 * @param {string} domStorageName Name of the underlying storage object
 *   (e.g. 'localStorage' or 'sessionStorage').
 * @return {?} Turning off type information until a common interface is defined.
 */var createStoragefor=function createStoragefor(domStorageName){try{// NOTE: just accessing "localStorage" or "window['localStorage']" may throw a security exception,
// so it must be inside the try/catch.
if(typeof window!=='undefined'&&typeof window[domStorageName]!=='undefined'){// Need to test cache. Just because it's here doesn't mean it works
var domStorage=window[domStorageName];domStorage.setItem('firebase:sentinel','cache');domStorage.removeItem('firebase:sentinel');return new DOMStorageWrapper(domStorage);}}catch(e){}// Failed to create wrapper.  Just return in-memory storage.
// TODO: log?
return new MemoryStorage();};/** A storage object that lasts across sessions */var PersistentStorage=createStoragefor('localStorage');/** A storage object that only lasts one session */var SessionStorage=createStoragefor('sessionStorage');/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var logClient=new __WEBPACK_IMPORTED_MODULE_1__firebase_logger__["b" /* Logger */]('@firebase/database');/**
 * Returns a locally-unique ID (generated by just incrementing up from 0 each time its called).
 * @type {function(): number} Generated ID.
 */var LUIDGenerator=function(){var id=1;return function(){return id++;};}();/**
 * Sha1 hash of the input string
 * @param {!string} str The string to hash
 * @return {!string} The resulting hash
 */var sha1=function sha1(str){var utf8Bytes=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["H" /* stringToByteArray */])(str);var sha1=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["d" /* Sha1 */]();sha1.update(utf8Bytes);var sha1Bytes=sha1.digest();return __WEBPACK_IMPORTED_MODULE_0__firebase_util__["g" /* base64 */].encodeByteArray(sha1Bytes);};/**
 * @param {...*} var_args
 * @return {string}
 * @private
 */var buildLogMessage_=function buildLogMessage_(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}var message='';for(var i=0;i<var_args.length;i++){if(Array.isArray(var_args[i])||var_args[i]&&typeof var_args[i]==='object'&&typeof var_args[i].length==='number'){message+=buildLogMessage_.apply(null,var_args[i]);}else if(typeof var_args[i]==='object'){message+=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(var_args[i]);}else{message+=var_args[i];}message+=' ';}return message;};/**
 * Use this for all debug messages in Firebase.
 * @type {?function(string)}
 */var logger=null;/**
 * Flag to check for log availability on first log message
 * @type {boolean}
 * @private
 */var firstLog_=true;/**
 * The implementation of Firebase.enableLogging (defined here to break dependencies)
 * @param {boolean|?function(string)} logger_ A flag to turn on logging, or a custom logger
 * @param {boolean=} persistent Whether or not to persist logging settings across refreshes
 */var enableLogging=function enableLogging(logger_,persistent){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!persistent||logger_===true||logger_===false,"Can't turn on custom loggers persistently.");if(logger_===true){logClient.logLevel=__WEBPACK_IMPORTED_MODULE_1__firebase_logger__["a" /* LogLevel */].VERBOSE;logger=logClient.log.bind(logClient);if(persistent)SessionStorage.set('logging_enabled',true);}else if(typeof logger_==='function'){logger=logger_;}else{logger=null;SessionStorage.remove('logging_enabled');}};/**
 *
 * @param {...(string|Arguments)} var_args
 */var log=function log(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}if(firstLog_===true){firstLog_=false;if(logger===null&&SessionStorage.get('logging_enabled')===true)enableLogging(true);}if(logger){var message=buildLogMessage_.apply(null,var_args);logger(message);}};/**
 * @param {!string} prefix
 * @return {function(...[*])}
 */var logWrapper=function logWrapper(prefix){return function(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}log.apply(void 0,[prefix].concat(var_args));};};/**
 * @param {...string} var_args
 */var error=function error(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}var message='FIREBASE INTERNAL ERROR: '+buildLogMessage_.apply(void 0,var_args);logClient.error(message);};/**
 * @param {...string} var_args
 */var fatal=function fatal(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}var message="FIREBASE FATAL ERROR: "+buildLogMessage_.apply(void 0,var_args);logClient.error(message);throw new Error(message);};/**
 * @param {...*} var_args
 */var warn=function warn(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}var message='FIREBASE WARNING: '+buildLogMessage_.apply(void 0,var_args);logClient.warn(message);};/**
 * Logs a warning if the containing page uses https. Called when a call to new Firebase
 * does not use https.
 */var warnIfPageIsSecure=function warnIfPageIsSecure(){// Be very careful accessing browser globals. Who knows what may or may not exist.
if(typeof window!=='undefined'&&window.location&&window.location.protocol&&window.location.protocol.indexOf('https:')!==-1){warn('Insecure Firebase access from a secure page. '+'Please use https in calls to new Firebase().');}};/**
 * Returns true if data is NaN, or +/- Infinity.
 * @param {*} data
 * @return {boolean}
 */var isInvalidJSONNumber=function isInvalidJSONNumber(data){return typeof data==='number'&&(data!=data||// NaN
data==Number.POSITIVE_INFINITY||data==Number.NEGATIVE_INFINITY);};/**
 * @param {function()} fn
 */var executeWhenDOMReady=function executeWhenDOMReady(fn){if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()||document.readyState==='complete'){fn();}else{// Modeled after jQuery. Try DOMContentLoaded and onreadystatechange (which
// fire before onload), but fall back to onload.
var called_1=false;var wrappedFn_1=function wrappedFn_1(){if(!document.body){setTimeout(wrappedFn_1,Math.floor(10));return;}if(!called_1){called_1=true;fn();}};if(document.addEventListener){document.addEventListener('DOMContentLoaded',wrappedFn_1,false);// fallback to onload.
window.addEventListener('load',wrappedFn_1,false);}else if(document.attachEvent){// IE.
document.attachEvent('onreadystatechange',function(){if(document.readyState==='complete')wrappedFn_1();});// fallback to onload.
window.attachEvent('onload',wrappedFn_1);// jQuery has an extra hack for IE that we could employ (based on
// http://javascript.nwbox.com/IEContentLoaded/) But it looks really old.
// I'm hoping we don't need it.
}}};/**
 * Minimum key name. Invalid for actual data, used as a marker to sort before any valid names
 * @type {!string}
 */var MIN_NAME='[MIN_NAME]';/**
 * Maximum key name. Invalid for actual data, used as a marker to sort above any valid names
 * @type {!string}
 */var MAX_NAME='[MAX_NAME]';/**
 * Compares valid Firebase key names, plus min and max name
 * @param {!string} a
 * @param {!string} b
 * @return {!number}
 */var nameCompare=function nameCompare(a,b){if(a===b){return 0;}else if(a===MIN_NAME||b===MAX_NAME){return-1;}else if(b===MIN_NAME||a===MAX_NAME){return 1;}else{var aAsInt=tryParseInt(a),bAsInt=tryParseInt(b);if(aAsInt!==null){if(bAsInt!==null){return aAsInt-bAsInt==0?a.length-b.length:aAsInt-bAsInt;}else{return-1;}}else if(bAsInt!==null){return 1;}else{return a<b?-1:1;}}};/**
 * @param {!string} a
 * @param {!string} b
 * @return {!number} comparison result.
 */var stringCompare=function stringCompare(a,b){if(a===b){return 0;}else if(a<b){return-1;}else{return 1;}};/**
 * @param {string} key
 * @param {Object} obj
 * @return {*}
 */var requireKey=function requireKey(key,obj){if(obj&&key in obj){return obj[key];}else{throw new Error('Missing required key ('+key+') in object: '+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(obj));}};/**
 * @param {*} obj
 * @return {string}
 */var ObjectToUniqueKey=function ObjectToUniqueKey(obj){if(typeof obj!=='object'||obj===null)return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(obj);var keys=[];for(var k in obj){keys.push(k);}// Export as json, but with the keys sorted.
keys.sort();var key='{';for(var i=0;i<keys.length;i++){if(i!==0)key+=',';key+=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(keys[i]);key+=':';key+=ObjectToUniqueKey(obj[keys[i]]);}key+='}';return key;};/**
 * Splits a string into a number of smaller segments of maximum size
 * @param {!string} str The string
 * @param {!number} segsize The maximum number of chars in the string.
 * @return {Array.<string>} The string, split into appropriately-sized chunks
 */var splitStringBySize=function splitStringBySize(str,segsize){var len=str.length;if(len<=segsize){return[str];}var dataSegs=[];for(var c=0;c<len;c+=segsize){if(c+segsize>len){dataSegs.push(str.substring(c,len));}else{dataSegs.push(str.substring(c,c+segsize));}}return dataSegs;};/**
 * Apply a function to each (key, value) pair in an object or
 * apply a function to each (index, value) pair in an array
 * @param {!(Object|Array)} obj The object or array to iterate over
 * @param {function(?, ?)} fn The function to apply
 */var each=function each(obj,fn){if(Array.isArray(obj)){for(var i=0;i<obj.length;++i){fn(i,obj[i]);}}else{/**
         * in the conversion of code we removed the goog.object.forEach
         * function which did a value,key callback. We standardized on
         * a single impl that does a key, value callback. So we invert
         * to not have to touch the `each` code points
         */Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(obj,function(key,val){return fn(val,key);});}};/**
 * Borrowed from http://hg.secondlife.com/llsd/src/tip/js/typedarray.js (MIT License)
 * I made one modification at the end and removed the NaN / Infinity
 * handling (since it seemed broken [caused an overflow] and we don't need it).  See MJL comments.
 * @param {!number} v A double
 * @return {string}
 */var doubleToIEEE754String=function doubleToIEEE754String(v){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!isInvalidJSONNumber(v),'Invalid JSON number');// MJL
var ebits=11,fbits=52;var bias=(1<<ebits-1)-1,s,e,f,ln,i,bits,str;// Compute sign, exponent, fraction
// Skip NaN / Infinity handling --MJL.
if(v===0){e=0;f=0;s=1/v===-Infinity?1:0;}else{s=v<0;v=Math.abs(v);if(v>=Math.pow(2,1-bias)){// Normalized
ln=Math.min(Math.floor(Math.log(v)/Math.LN2),bias);e=ln+bias;f=Math.round(v*Math.pow(2,fbits-ln)-Math.pow(2,fbits));}else{// Denormalized
e=0;f=Math.round(v/Math.pow(2,1-bias-fbits));}}// Pack sign, exponent, fraction
bits=[];for(i=fbits;i;i-=1){bits.push(f%2?1:0);f=Math.floor(f/2);}for(i=ebits;i;i-=1){bits.push(e%2?1:0);e=Math.floor(e/2);}bits.push(s?1:0);bits.reverse();str=bits.join('');// Return the data as a hex string. --MJL
var hexByteString='';for(i=0;i<64;i+=8){var hexByte=parseInt(str.substr(i,8),2).toString(16);if(hexByte.length===1)hexByte='0'+hexByte;hexByteString=hexByteString+hexByte;}return hexByteString.toLowerCase();};/**
 * Used to detect if we're in a Chrome content script (which executes in an
 * isolated environment where long-polling doesn't work).
 * @return {boolean}
 */var isChromeExtensionContentScript=function isChromeExtensionContentScript(){return!!(typeof window==='object'&&window['chrome']&&window['chrome']['extension']&&!/^chrome/.test(window.location.href));};/**
 * Used to detect if we're in a Windows 8 Store app.
 * @return {boolean}
 */var isWindowsStoreApp=function isWindowsStoreApp(){// Check for the presence of a couple WinRT globals
return typeof Windows==='object'&&typeof Windows.UI==='object';};/**
 * Converts a server error code to a Javascript Error
 * @param {!string} code
 * @param {!Query} query
 * @return {Error}
 */var errorForServerCode=function errorForServerCode(code,query){var reason='Unknown Error';if(code==='too_big'){reason='The data requested exceeds the maximum size '+'that can be accessed with a single request.';}else if(code=='permission_denied'){reason="Client doesn't have permission to access the desired data.";}else if(code=='unavailable'){reason='The service is unavailable';}var error=new Error(code+' at '+query.path.toString()+': '+reason);error.code=code.toUpperCase();return error;};/**
 * Used to test for integer-looking strings
 * @type {RegExp}
 * @private
 */var INTEGER_REGEXP_=new RegExp('^-?\\d{1,10}$');/**
 * If the string contains a 32-bit integer, return it.  Else return null.
 * @param {!string} str
 * @return {?number}
 */var tryParseInt=function tryParseInt(str){if(INTEGER_REGEXP_.test(str)){var intVal=Number(str);if(intVal>=-2147483648&&intVal<=2147483647){return intVal;}}return null;};/**
 * Helper to run some code but catch any exceptions and re-throw them later.
 * Useful for preventing user callbacks from breaking internal code.
 *
 * Re-throwing the exception from a setTimeout is a little evil, but it's very
 * convenient (we don't have to try to figure out when is a safe point to
 * re-throw it), and the behavior seems reasonable:
 *
 * * If you aren't pausing on exceptions, you get an error in the console with
 *   the correct stack trace.
 * * If you're pausing on all exceptions, the debugger will pause on your
 *   exception and then again when we rethrow it.
 * * If you're only pausing on uncaught exceptions, the debugger will only pause
 *   on us re-throwing it.
 *
 * @param {!function()} fn The code to guard.
 */var exceptionGuard=function exceptionGuard(fn){try{fn();}catch(e){// Re-throw exception when it's safe.
setTimeout(function(){// It used to be that "throw e" would result in a good console error with
// relevant context, but as of Chrome 39, you just get the firebase.js
// file/line number where we re-throw it, which is useless. So we log
// e.stack explicitly.
var stack=e.stack||'';warn('Exception was thrown by user callback.',stack);throw e;},Math.floor(0));}};/**
 * @return {boolean} true if we think we're currently being crawled.
 */var beingCrawled=function beingCrawled(){var userAgent=typeof window==='object'&&window['navigator']&&window['navigator']['userAgent']||'';// For now we whitelist the most popular crawlers.  We should refine this to be the set of crawlers we
// believe to support JavaScript/AJAX rendering.
// NOTE: Google Webmaster Tools doesn't really belong, but their "This is how a visitor to your website
// would have seen the page" is flaky if we don't treat it as a crawler.
return userAgent.search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0;};/**
 * Same as setTimeout() except on Node.JS it will /not/ prevent the process from exiting.
 *
 * It is removed with clearTimeout() as normal.
 *
 * @param {Function} fn Function to run.
 * @param {number} time Milliseconds to wait before running.
 * @return {number|Object} The setTimeout() return value.
 */var setTimeoutNonBlocking=function setTimeoutNonBlocking(fn,time){var timeout=setTimeout(fn,time);if(typeof timeout==='object'&&timeout['unref']){timeout['unref']();}return timeout;};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An immutable object representing a parsed path.  It's immutable so that you
 * can pass them around to other functions without worrying about them changing
 * it.
 */var Path=/** @class */function(){/**
     * @param {string|Array.<string>} pathOrString Path string to parse,
     *      or another path, or the raw tokens array
     * @param {number=} pieceNum
     */function Path(pathOrString,pieceNum){if(pieceNum===void 0){this.pieces_=pathOrString.split('/');// Remove empty pieces.
var copyTo=0;for(var i=0;i<this.pieces_.length;i++){if(this.pieces_[i].length>0){this.pieces_[copyTo]=this.pieces_[i];copyTo++;}}this.pieces_.length=copyTo;this.pieceNum_=0;}else{this.pieces_=pathOrString;this.pieceNum_=pieceNum;}}Object.defineProperty(Path,"Empty",{/**
         * Singleton to represent an empty path
         *
         * @const
         */get:function get(){return new Path('');},enumerable:true,configurable:true});Path.prototype.getFront=function(){if(this.pieceNum_>=this.pieces_.length)return null;return this.pieces_[this.pieceNum_];};/**
     * @return {number} The number of segments in this path
     */Path.prototype.getLength=function(){return this.pieces_.length-this.pieceNum_;};/**
     * @return {!Path}
     */Path.prototype.popFront=function(){var pieceNum=this.pieceNum_;if(pieceNum<this.pieces_.length){pieceNum++;}return new Path(this.pieces_,pieceNum);};/**
     * @return {?string}
     */Path.prototype.getBack=function(){if(this.pieceNum_<this.pieces_.length)return this.pieces_[this.pieces_.length-1];return null;};Path.prototype.toString=function(){var pathString='';for(var i=this.pieceNum_;i<this.pieces_.length;i++){if(this.pieces_[i]!=='')pathString+='/'+this.pieces_[i];}return pathString||'/';};Path.prototype.toUrlEncodedString=function(){var pathString='';for(var i=this.pieceNum_;i<this.pieces_.length;i++){if(this.pieces_[i]!=='')pathString+='/'+encodeURIComponent(String(this.pieces_[i]));}return pathString||'/';};/**
     * Shallow copy of the parts of the path.
     *
     * @param {number=} begin
     * @return {!Array<string>}
     */Path.prototype.slice=function(begin){if(begin===void 0){begin=0;}return this.pieces_.slice(this.pieceNum_+begin);};/**
     * @return {?Path}
     */Path.prototype.parent=function(){if(this.pieceNum_>=this.pieces_.length)return null;var pieces=[];for(var i=this.pieceNum_;i<this.pieces_.length-1;i++){pieces.push(this.pieces_[i]);}return new Path(pieces,0);};/**
     * @param {string|!Path} childPathObj
     * @return {!Path}
     */Path.prototype.child=function(childPathObj){var pieces=[];for(var i=this.pieceNum_;i<this.pieces_.length;i++){pieces.push(this.pieces_[i]);}if(childPathObj instanceof Path){for(var i=childPathObj.pieceNum_;i<childPathObj.pieces_.length;i++){pieces.push(childPathObj.pieces_[i]);}}else{var childPieces=childPathObj.split('/');for(var i=0;i<childPieces.length;i++){if(childPieces[i].length>0)pieces.push(childPieces[i]);}}return new Path(pieces,0);};/**
     * @return {boolean} True if there are no segments in this path
     */Path.prototype.isEmpty=function(){return this.pieceNum_>=this.pieces_.length;};/**
     * @param {!Path} outerPath
     * @param {!Path} innerPath
     * @return {!Path} The path from outerPath to innerPath
     */Path.relativePath=function(outerPath,innerPath){var outer=outerPath.getFront(),inner=innerPath.getFront();if(outer===null){return innerPath;}else if(outer===inner){return Path.relativePath(outerPath.popFront(),innerPath.popFront());}else{throw new Error('INTERNAL ERROR: innerPath ('+innerPath+') is not within '+'outerPath ('+outerPath+')');}};/**
     * @param {!Path} left
     * @param {!Path} right
     * @return {number} -1, 0, 1 if left is less, equal, or greater than the right.
     */Path.comparePaths=function(left,right){var leftKeys=left.slice();var rightKeys=right.slice();for(var i=0;i<leftKeys.length&&i<rightKeys.length;i++){var cmp=nameCompare(leftKeys[i],rightKeys[i]);if(cmp!==0)return cmp;}if(leftKeys.length===rightKeys.length)return 0;return leftKeys.length<rightKeys.length?-1:1;};/**
     *
     * @param {Path} other
     * @return {boolean} true if paths are the same.
     */Path.prototype.equals=function(other){if(this.getLength()!==other.getLength()){return false;}for(var i=this.pieceNum_,j=other.pieceNum_;i<=this.pieces_.length;i++,j++){if(this.pieces_[i]!==other.pieces_[j]){return false;}}return true;};/**
     *
     * @param {!Path} other
     * @return {boolean} True if this path is a parent (or the same as) other
     */Path.prototype.contains=function(other){var i=this.pieceNum_;var j=other.pieceNum_;if(this.getLength()>other.getLength()){return false;}while(i<this.pieces_.length){if(this.pieces_[i]!==other.pieces_[j]){return false;}++i;++j;}return true;};return Path;}();// end Path
/**
 * Dynamic (mutable) path used to count path lengths.
 *
 * This class is used to efficiently check paths for valid
 * length (in UTF8 bytes) and depth (used in path validation).
 *
 * Throws Error exception if path is ever invalid.
 *
 * The definition of a path always begins with '/'.
 */var ValidationPath=/** @class */function(){/**
     * @param {!Path} path Initial Path.
     * @param {string} errorPrefix_ Prefix for any error messages.
     */function ValidationPath(path,errorPrefix_){this.errorPrefix_=errorPrefix_;/** @type {!Array<string>} */this.parts_=path.slice();/** @type {number} Initialize to number of '/' chars needed in path. */this.byteLength_=Math.max(1,this.parts_.length);for(var i=0;i<this.parts_.length;i++){this.byteLength_+=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["G" /* stringLength */])(this.parts_[i]);}this.checkValid_();}Object.defineProperty(ValidationPath,"MAX_PATH_DEPTH",{/** @const {number} Maximum key depth. */get:function get(){return 32;},enumerable:true,configurable:true});Object.defineProperty(ValidationPath,"MAX_PATH_LENGTH_BYTES",{/** @const {number} Maximum number of (UTF8) bytes in a Firebase path. */get:function get(){return 768;},enumerable:true,configurable:true});/** @param {string} child */ValidationPath.prototype.push=function(child){// Count the needed '/'
if(this.parts_.length>0){this.byteLength_+=1;}this.parts_.push(child);this.byteLength_+=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["G" /* stringLength */])(child);this.checkValid_();};ValidationPath.prototype.pop=function(){var last=this.parts_.pop();this.byteLength_-=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["G" /* stringLength */])(last);// Un-count the previous '/'
if(this.parts_.length>0){this.byteLength_-=1;}};ValidationPath.prototype.checkValid_=function(){if(this.byteLength_>ValidationPath.MAX_PATH_LENGTH_BYTES){throw new Error(this.errorPrefix_+'has a key path longer than '+ValidationPath.MAX_PATH_LENGTH_BYTES+' bytes ('+this.byteLength_+').');}if(this.parts_.length>ValidationPath.MAX_PATH_DEPTH){throw new Error(this.errorPrefix_+'path specified exceeds the maximum depth that can be written ('+ValidationPath.MAX_PATH_DEPTH+') or object contains a cycle '+this.toErrorString());}};/**
     * String for use in error messages - uses '.' notation for path.
     *
     * @return {string}
     */ValidationPath.prototype.toErrorString=function(){if(this.parts_.length==0){return'';}return"in property '"+this.parts_.join('.')+"'";};return ValidationPath;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var PROTOCOL_VERSION='5';var VERSION_PARAM='v';var TRANSPORT_SESSION_PARAM='s';var REFERER_PARAM='r';var FORGE_REF='f';var FORGE_DOMAIN='firebaseio.com';var LAST_SESSION_PARAM='ls';var WEBSOCKET='websocket';var LONG_POLLING='long_polling';/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * A class that holds metadata about a Repo object
 *
 * @constructor
 */var RepoInfo=/** @class */function(){/**
     * @param {string} host Hostname portion of the url for the repo
     * @param {boolean} secure Whether or not this repo is accessed over ssl
     * @param {string} namespace The namespace represented by the repo
     * @param {boolean} webSocketOnly Whether to prefer websockets over all other transports (used by Nest).
     * @param {string=} persistenceKey Override the default session persistence storage key
     */function RepoInfo(host,secure,namespace,webSocketOnly,persistenceKey){if(persistenceKey===void 0){persistenceKey='';}this.secure=secure;this.namespace=namespace;this.webSocketOnly=webSocketOnly;this.persistenceKey=persistenceKey;this.host=host.toLowerCase();this.domain=this.host.substr(this.host.indexOf('.')+1);this.internalHost=PersistentStorage.get('host:'+host)||this.host;}RepoInfo.prototype.needsQueryParam=function(){return this.host!==this.internalHost||this.isCustomHost();};RepoInfo.prototype.isCacheableHost=function(){return this.internalHost.substr(0,2)==='s-';};RepoInfo.prototype.isDemoHost=function(){return this.domain==='firebaseio-demo.com';};RepoInfo.prototype.isCustomHost=function(){return this.domain!=='firebaseio.com'&&this.domain!=='firebaseio-demo.com';};RepoInfo.prototype.updateHost=function(newHost){if(newHost!==this.internalHost){this.internalHost=newHost;if(this.isCacheableHost()){PersistentStorage.set('host:'+this.host,this.internalHost);}}};/**
     * Returns the websocket URL for this repo
     * @param {string} type of connection
     * @param {Object} params list
     * @return {string} The URL for this repo
     */RepoInfo.prototype.connectionURL=function(type,params){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(typeof type==='string','typeof type must == string');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(typeof params==='object','typeof params must == object');var connURL;if(type===WEBSOCKET){connURL=(this.secure?'wss://':'ws://')+this.internalHost+'/.ws?';}else if(type===LONG_POLLING){connURL=(this.secure?'https://':'http://')+this.internalHost+'/.lp?';}else{throw new Error('Unknown connection type: '+type);}if(this.needsQueryParam()){params['ns']=this.namespace;}var pairs=[];Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(params,function(key,value){pairs.push(key+'='+value);});return connURL+pairs.join('&');};/** @return {string} */RepoInfo.prototype.toString=function(){var str=this.toURLString();if(this.persistenceKey){str+='<'+this.persistenceKey+'>';}return str;};/** @return {string} */RepoInfo.prototype.toURLString=function(){return(this.secure?'https://':'http://')+this.host;};return RepoInfo;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @param {!string} pathString
 * @return {string}
 */function decodePath(pathString){var pathStringDecoded='';var pieces=pathString.split('/');for(var i=0;i<pieces.length;i++){if(pieces[i].length>0){var piece=pieces[i];try{piece=decodeURIComponent(piece.replace(/\+/g,' '));}catch(e){}pathStringDecoded+='/'+piece;}}return pathStringDecoded;}/**
 * @param {!string} queryString
 * @return {!{[key:string]:string}} key value hash
 */function decodeQuery(queryString){var results={};if(queryString.startsWith('?')){queryString=queryString.substring(1);}for(var _i=0,_a=queryString.split('&');_i<_a.length;_i++){var segment=_a[_i];if(segment.length===0){continue;}var kv=segment.split('=');if(kv.length===2){results[decodeURIComponent(kv[0])]=decodeURIComponent(kv[1]);}else{warn("Invalid query segment '"+segment+"' in query '"+queryString+"'");}}return results;}/**
 *
 * @param {!string} dataURL
 * @return {{repoInfo: !RepoInfo, path: !Path}}
 */var parseRepoInfo=function parseRepoInfo(dataURL){var parsedUrl=parseURL(dataURL),namespace=parsedUrl.subdomain;if(parsedUrl.domain==='firebase'){fatal(parsedUrl.host+' is no longer supported. '+'Please use <YOUR FIREBASE>.firebaseio.com instead');}// Catch common error of uninitialized namespace value.
if((!namespace||namespace=='undefined')&&parsedUrl.domain!=='localhost'){fatal('Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com');}if(!parsedUrl.secure){warnIfPageIsSecure();}var webSocketOnly=parsedUrl.scheme==='ws'||parsedUrl.scheme==='wss';return{repoInfo:new RepoInfo(parsedUrl.host,parsedUrl.secure,namespace,webSocketOnly),path:new Path(parsedUrl.pathString)};};/**
 *
 * @param {!string} dataURL
 * @return {{host: string, port: number, domain: string, subdomain: string, secure: boolean, scheme: string, pathString: string}}
 */var parseURL=function parseURL(dataURL){// Default to empty strings in the event of a malformed string.
var host='',domain='',subdomain='',pathString='';// Always default to SSL, unless otherwise specified.
var secure=true,scheme='https',port=443;// Don't do any validation here. The caller is responsible for validating the result of parsing.
if(typeof dataURL==='string'){// Parse scheme.
var colonInd=dataURL.indexOf('//');if(colonInd>=0){scheme=dataURL.substring(0,colonInd-1);dataURL=dataURL.substring(colonInd+2);}// Parse host, path, and query string.
var slashInd=dataURL.indexOf('/');if(slashInd===-1){slashInd=dataURL.length;}var questionMarkInd=dataURL.indexOf('?');if(questionMarkInd===-1){questionMarkInd=dataURL.length;}host=dataURL.substring(0,Math.min(slashInd,questionMarkInd));if(slashInd<questionMarkInd){// For pathString, questionMarkInd will always come after slashInd
pathString=decodePath(dataURL.substring(slashInd,questionMarkInd));}var queryParams=decodeQuery(dataURL.substring(Math.min(dataURL.length,questionMarkInd)));// If we have a port, use scheme for determining if it's secure.
colonInd=host.indexOf(':');if(colonInd>=0){secure=scheme==='https'||scheme==='wss';port=parseInt(host.substring(colonInd+1),10);}else{colonInd=dataURL.length;}var parts=host.split('.');if(parts.length===3){// Normalize namespaces to lowercase to share storage / connection.
domain=parts[1];subdomain=parts[0].toLowerCase();}else if(parts.length===2){domain=parts[0];}else if(parts[0].slice(0,colonInd).toLowerCase()==='localhost'){domain='localhost';}// Support `ns` query param if subdomain not already set
if(subdomain===''&&'ns'in queryParams){subdomain=queryParams['ns'];}}return{host:host,port:port,domain:domain,subdomain:subdomain,secure:secure,scheme:scheme,pathString:pathString};};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * True for invalid Firebase keys
 * @type {RegExp}
 * @private
 */var INVALID_KEY_REGEX_=/[\[\].#$\/\u0000-\u001F\u007F]/;/**
 * True for invalid Firebase paths.
 * Allows '/' in paths.
 * @type {RegExp}
 * @private
 */var INVALID_PATH_REGEX_=/[\[\].#$\u0000-\u001F\u007F]/;/**
 * Maximum number of characters to allow in leaf value
 * @type {number}
 * @private
 */var MAX_LEAF_SIZE_=10*1024*1024;/**
 * @param {*} key
 * @return {boolean}
 */var isValidKey=function isValidKey(key){return typeof key==='string'&&key.length!==0&&!INVALID_KEY_REGEX_.test(key);};/**
 * @param {string} pathString
 * @return {boolean}
 */var isValidPathString=function isValidPathString(pathString){return typeof pathString==='string'&&pathString.length!==0&&!INVALID_PATH_REGEX_.test(pathString);};/**
 * @param {string} pathString
 * @return {boolean}
 */var isValidRootPathString=function isValidRootPathString(pathString){if(pathString){// Allow '/.info/' at the beginning.
pathString=pathString.replace(/^\/*\.info(\/|$)/,'/');}return isValidPathString(pathString);};/**
 * @param {*} priority
 * @return {boolean}
 */var isValidPriority=function isValidPriority(priority){return priority===null||typeof priority==='string'||typeof priority==='number'&&!isInvalidJSONNumber(priority)||priority&&typeof priority==='object'&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(priority,'.sv');};/**
 * Pre-validate a datum passed as an argument to Firebase function.
 *
 * @param {string} fnName
 * @param {number} argumentNumber
 * @param {*} data
 * @param {!Path} path
 * @param {boolean} optional
 */var validateFirebaseDataArg=function validateFirebaseDataArg(fnName,argumentNumber,data,path,optional){if(optional&&data===undefined)return;validateFirebaseData(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional),data,path);};/**
 * Validate a data object client-side before sending to server.
 *
 * @param {string} errorPrefix
 * @param {*} data
 * @param {!Path|!ValidationPath} path_
 */var validateFirebaseData=function validateFirebaseData(errorPrefix$$1,data,path_){var path=path_ instanceof Path?new ValidationPath(path_,errorPrefix$$1):path_;if(data===undefined){throw new Error(errorPrefix$$1+'contains undefined '+path.toErrorString());}if(typeof data==='function'){throw new Error(errorPrefix$$1+'contains a function '+path.toErrorString()+' with contents = '+data.toString());}if(isInvalidJSONNumber(data)){throw new Error(errorPrefix$$1+'contains '+data.toString()+' '+path.toErrorString());}// Check max leaf size, but try to avoid the utf8 conversion if we can.
if(typeof data==='string'&&data.length>MAX_LEAF_SIZE_/3&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["G" /* stringLength */])(data)>MAX_LEAF_SIZE_){throw new Error(errorPrefix$$1+'contains a string greater than '+MAX_LEAF_SIZE_+' utf8 bytes '+path.toErrorString()+" ('"+data.substring(0,50)+"...')");}// TODO = Perf = Consider combining the recursive validation of keys into NodeFromJSON
// to save extra walking of large objects.
if(data&&typeof data==='object'){var hasDotValue_1=false,hasActualChild_1=false;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(data,function(key,value){if(key==='.value'){hasDotValue_1=true;}else if(key!=='.priority'&&key!=='.sv'){hasActualChild_1=true;if(!isValidKey(key)){throw new Error(errorPrefix$$1+' contains an invalid key ('+key+') '+path.toErrorString()+'.  Keys must be non-empty strings '+'and can\'t contain ".", "#", "$", "/", "[", or "]"');}}path.push(key);validateFirebaseData(errorPrefix$$1,value,path);path.pop();});if(hasDotValue_1&&hasActualChild_1){throw new Error(errorPrefix$$1+' contains ".value" child '+path.toErrorString()+' in addition to actual children.');}}};/**
 * Pre-validate paths passed in the firebase function.
 *
 * @param {string} errorPrefix
 * @param {Array<!Path>} mergePaths
 */var validateFirebaseMergePaths=function validateFirebaseMergePaths(errorPrefix$$1,mergePaths){var i,curPath;for(i=0;i<mergePaths.length;i++){curPath=mergePaths[i];var keys=curPath.slice();for(var j=0;j<keys.length;j++){if(keys[j]==='.priority'&&j===keys.length-1){// .priority is OK
}else if(!isValidKey(keys[j])){throw new Error(errorPrefix$$1+'contains an invalid key ('+keys[j]+') in path '+curPath.toString()+'. Keys must be non-empty strings '+'and can\'t contain ".", "#", "$", "/", "[", or "]"');}}}// Check that update keys are not descendants of each other.
// We rely on the property that sorting guarantees that ancestors come
// right before descendants.
mergePaths.sort(Path.comparePaths);var prevPath=null;for(i=0;i<mergePaths.length;i++){curPath=mergePaths[i];if(prevPath!==null&&prevPath.contains(curPath)){throw new Error(errorPrefix$$1+'contains a path '+prevPath.toString()+' that is ancestor of another path '+curPath.toString());}prevPath=curPath;}};/**
 * pre-validate an object passed as an argument to firebase function (
 * must be an object - e.g. for firebase.update()).
 *
 * @param {string} fnName
 * @param {number} argumentNumber
 * @param {*} data
 * @param {!Path} path
 * @param {boolean} optional
 */var validateFirebaseMergeDataArg=function validateFirebaseMergeDataArg(fnName,argumentNumber,data,path,optional){if(optional&&data===undefined)return;var errorPrefix$$1=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional);if(!(data&&typeof data==='object')||Array.isArray(data)){throw new Error(errorPrefix$$1+' must be an object containing the children to replace.');}var mergePaths=[];Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(data,function(key,value){var curPath=new Path(key);validateFirebaseData(errorPrefix$$1,value,path.child(curPath));if(curPath.getBack()==='.priority'){if(!isValidPriority(value)){throw new Error(errorPrefix$$1+"contains an invalid value for '"+curPath.toString()+"', which must be a valid "+'Firebase priority (a string, finite number, server value, or null).');}}mergePaths.push(curPath);});validateFirebaseMergePaths(errorPrefix$$1,mergePaths);};var validatePriority=function validatePriority(fnName,argumentNumber,priority,optional){if(optional&&priority===undefined)return;if(isInvalidJSONNumber(priority))throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'is '+priority.toString()+', but must be a valid Firebase priority (a string, finite number, '+'server value, or null).');// Special case to allow importing data with a .sv.
if(!isValidPriority(priority))throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'must be a valid Firebase priority '+'(a string, finite number, server value, or null).');};var validateEventType=function validateEventType(fnName,argumentNumber,eventType,optional){if(optional&&eventType===undefined)return;switch(eventType){case'value':case'child_added':case'child_removed':case'child_changed':case'child_moved':break;default:throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'must be a valid event type = "value", "child_added", "child_removed", '+'"child_changed", or "child_moved".');}};var validateKey=function validateKey(fnName,argumentNumber,key,optional){if(optional&&key===undefined)return;if(!isValidKey(key))throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'was an invalid key = "'+key+'".  Firebase keys must be non-empty strings and '+'can\'t contain ".", "#", "$", "/", "[", or "]").');};var validatePathString=function validatePathString(fnName,argumentNumber,pathString,optional){if(optional&&pathString===undefined)return;if(!isValidPathString(pathString))throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'was an invalid path = "'+pathString+'". Paths must be non-empty strings and '+'can\'t contain ".", "#", "$", "[", or "]"');};var validateRootPathString=function validateRootPathString(fnName,argumentNumber,pathString,optional){if(pathString){// Allow '/.info/' at the beginning.
pathString=pathString.replace(/^\/*\.info(\/|$)/,'/');}validatePathString(fnName,argumentNumber,pathString,optional);};var validateWritablePath=function validateWritablePath(fnName,path){if(path.getFront()==='.info'){throw new Error(fnName+" failed = Can't modify data under /.info/");}};var validateUrl=function validateUrl(fnName,argumentNumber,parsedUrl){// TODO = Validate server better.
var pathString=parsedUrl.path.toString();if(!(typeof parsedUrl.repoInfo.host==='string')||parsedUrl.repoInfo.host.length===0||!isValidKey(parsedUrl.repoInfo.namespace)&&parsedUrl.repoInfo.host.split(':')[0]!=='localhost'||pathString.length!==0&&!isValidRootPathString(pathString)){throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,false)+'must be a valid firebase URL and '+'the path can\'t contain ".", "#", "$", "[", or "]".');}};var validateBoolean=function validateBoolean(fnName,argumentNumber,bool,optional){if(optional&&bool===undefined)return;if(typeof bool!=='boolean')throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,argumentNumber,optional)+'must be a boolean.');};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @constructor
 */var OnDisconnect=/** @class */function(){/**
     * @param {!Repo} repo_
     * @param {!Path} path_
     */function OnDisconnect(repo_,path_){this.repo_=repo_;this.path_=path_;}/**
     * @param {function(?Error)=} onComplete
     * @return {!firebase.Promise}
     */OnDisconnect.prototype.cancel=function(onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('OnDisconnect.cancel',0,1,arguments.length);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('OnDisconnect.cancel',1,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo_.onDisconnectCancel(this.path_,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {function(?Error)=} onComplete
     * @return {!firebase.Promise}
     */OnDisconnect.prototype.remove=function(onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('OnDisconnect.remove',0,1,arguments.length);validateWritablePath('OnDisconnect.remove',this.path_);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('OnDisconnect.remove',1,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo_.onDisconnectSet(this.path_,null,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {*} value
     * @param {function(?Error)=} onComplete
     * @return {!firebase.Promise}
     */OnDisconnect.prototype.set=function(value,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('OnDisconnect.set',1,2,arguments.length);validateWritablePath('OnDisconnect.set',this.path_);validateFirebaseDataArg('OnDisconnect.set',1,value,this.path_,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('OnDisconnect.set',2,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo_.onDisconnectSet(this.path_,value,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {*} value
     * @param {number|string|null} priority
     * @param {function(?Error)=} onComplete
     * @return {!firebase.Promise}
     */OnDisconnect.prototype.setWithPriority=function(value,priority,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('OnDisconnect.setWithPriority',2,3,arguments.length);validateWritablePath('OnDisconnect.setWithPriority',this.path_);validateFirebaseDataArg('OnDisconnect.setWithPriority',1,value,this.path_,false);validatePriority('OnDisconnect.setWithPriority',2,priority,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('OnDisconnect.setWithPriority',3,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo_.onDisconnectSetWithPriority(this.path_,value,priority,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {!Object} objectToMerge
     * @param {function(?Error)=} onComplete
     * @return {!firebase.Promise}
     */OnDisconnect.prototype.update=function(objectToMerge,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('OnDisconnect.update',1,2,arguments.length);validateWritablePath('OnDisconnect.update',this.path_);if(Array.isArray(objectToMerge)){var newObjectToMerge={};for(var i=0;i<objectToMerge.length;++i){newObjectToMerge[''+i]=objectToMerge[i];}objectToMerge=newObjectToMerge;warn('Passing an Array to firebase.database.onDisconnect().update() is deprecated. Use set() if you want to overwrite the '+'existing data, or an Object with integer keys if you really do want to only update some of the children.');}validateFirebaseMergeDataArg('OnDisconnect.update',1,objectToMerge,this.path_,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('OnDisconnect.update',2,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo_.onDisconnectUpdate(this.path_,objectToMerge,deferred.wrapCallback(onComplete));return deferred.promise;};return OnDisconnect;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var TransactionResult=/** @class */function(){/**
     * A type for the resolve value of Firebase.transaction.
     * @constructor
     * @dict
     * @param {boolean} committed
     * @param {DataSnapshot} snapshot
     */function TransactionResult(committed,snapshot){this.committed=committed;this.snapshot=snapshot;}// Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
// for end-users
TransactionResult.prototype.toJSON=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('TransactionResult.toJSON',0,1,arguments.length);return{committed:this.committed,snapshot:this.snapshot.toJSON()};};return TransactionResult;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Fancy ID generator that creates 20-character string identifiers with the
 * following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't
 *    collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters
 *    that will sort properly).
 * 4. They're monotonically increasing. Even if you generate more than one in
 *    the same timestamp, the latter ones will sort after the former ones. We do
 *    this by using the previous random bits but "incrementing" them by 1 (only
 *    in the case of a timestamp collision).
 */var nextPushId=function(){// Modeled after base64 web-safe chars, but ordered by ASCII.
var PUSH_CHARS='-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';// Timestamp of last push, used to prevent local collisions if you push twice
// in one ms.
var lastPushTime=0;// We generate 72-bits of randomness which get turned into 12 characters and
// appended to the timestamp to prevent collisions with other clients. We
// store the last characters we generated because in the event of a collision,
// we'll use those same characters except "incremented" by one.
var lastRandChars=[];return function(now){var duplicateTime=now===lastPushTime;lastPushTime=now;var i;var timeStampChars=new Array(8);for(i=7;i>=0;i--){timeStampChars[i]=PUSH_CHARS.charAt(now%64);// NOTE: Can't use << here because javascript will convert to int and lose
// the upper bits.
now=Math.floor(now/64);}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(now===0,'Cannot push at time == 0');var id=timeStampChars.join('');if(!duplicateTime){for(i=0;i<12;i++){lastRandChars[i]=Math.floor(Math.random()*64);}}else{// If the timestamp hasn't changed since last push, use the same random
// number, except incremented by 1.
for(i=11;i>=0&&lastRandChars[i]===63;i--){lastRandChars[i]=0;}lastRandChars[i]++;}for(i=0;i<12;i++){id+=PUSH_CHARS.charAt(lastRandChars[i]);}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(id.length===20,'nextPushId: Length should be 20.');return id;};}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 *
 * @param {!string} name
 * @param {!Node} node
 * @constructor
 * @struct
 */var NamedNode=/** @class */function(){function NamedNode(name,node){this.name=name;this.node=node;}/**
     *
     * @param {!string} name
     * @param {!Node} node
     * @return {NamedNode}
     */NamedNode.Wrap=function(name,node){return new NamedNode(name,node);};return NamedNode;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 *
 * @constructor
 */var Index=/** @class */function(){function Index(){}/**
     * @return {function(!NamedNode, !NamedNode):number} A standalone comparison function for
     * this index
     */Index.prototype.getCompare=function(){return this.compare.bind(this);};/**
     * Given a before and after value for a node, determine if the indexed value has changed. Even if they are different,
     * it's possible that the changes are isolated to parts of the snapshot that are not indexed.
     *
     * @param {!Node} oldNode
     * @param {!Node} newNode
     * @return {boolean} True if the portion of the snapshot being indexed changed between oldNode and newNode
     */Index.prototype.indexedValueChanged=function(oldNode,newNode){var oldWrapped=new NamedNode(MIN_NAME,oldNode);var newWrapped=new NamedNode(MIN_NAME,newNode);return this.compare(oldWrapped,newWrapped)!==0;};/**
     * @return {!NamedNode} a node wrapper that will sort equal to or less than
     * any other node wrapper, using this index
     */Index.prototype.minPost=function(){return NamedNode.MIN;};return Index;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var __EMPTY_NODE;var KeyIndex=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(KeyIndex,_super);function KeyIndex(){return _super!==null&&_super.apply(this,arguments)||this;}Object.defineProperty(KeyIndex,"__EMPTY_NODE",{get:function get(){return __EMPTY_NODE;},set:function set(val){__EMPTY_NODE=val;},enumerable:true,configurable:true});/**
     * @inheritDoc
     */KeyIndex.prototype.compare=function(a,b){return nameCompare(a.name,b.name);};/**
     * @inheritDoc
     */KeyIndex.prototype.isDefinedOn=function(node){// We could probably return true here (since every node has a key), but it's never called
// so just leaving unimplemented for now.
throw Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["f" /* assertionError */])('KeyIndex.isDefinedOn not expected to be called.');};/**
     * @inheritDoc
     */KeyIndex.prototype.indexedValueChanged=function(oldNode,newNode){return false;// The key for a node never changes.
};/**
     * @inheritDoc
     */KeyIndex.prototype.minPost=function(){return NamedNode.MIN;};/**
     * @inheritDoc
     */KeyIndex.prototype.maxPost=function(){// TODO: This should really be created once and cached in a static property, but
// NamedNode isn't defined yet, so I can't use it in a static.  Bleh.
return new NamedNode(MAX_NAME,__EMPTY_NODE);};/**
     * @param {*} indexValue
     * @param {string} name
     * @return {!NamedNode}
     */KeyIndex.prototype.makePost=function(indexValue,name){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(typeof indexValue==='string','KeyIndex indexValue must always be a string.');// We just use empty node, but it'll never be compared, since our comparator only looks at name.
return new NamedNode(indexValue,__EMPTY_NODE);};/**
     * @return {!string} String representation for inclusion in a query spec
     */KeyIndex.prototype.toString=function(){return'.key';};return KeyIndex;}(Index);var KEY_INDEX=new KeyIndex();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var MAX_NODE;function setMaxNode(val){MAX_NODE=val;}/**
 * @param {(!string|!number)} priority
 * @return {!string}
 */var priorityHashText=function priorityHashText(priority){if(typeof priority==='number')return'number:'+doubleToIEEE754String(priority);else return'string:'+priority;};/**
 * Validates that a priority snapshot Node is valid.
 *
 * @param {!Node} priorityNode
 */var validatePriorityNode=function validatePriorityNode(priorityNode){if(priorityNode.isLeafNode()){var val=priorityNode.val();Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(typeof val==='string'||typeof val==='number'||typeof val==='object'&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(val,'.sv'),'Priority must be a string or number.');}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(priorityNode===MAX_NODE||priorityNode.isEmpty(),'priority of unexpected type.');}// Don't call getPriority() on MAX_NODE to avoid hitting assertion.
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(priorityNode===MAX_NODE||priorityNode.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.");};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var __childrenNodeConstructor;/**
 * LeafNode is a class for storing leaf nodes in a DataSnapshot.  It
 * implements Node and stores the value of the node (a string,
 * number, or boolean) accessible via getValue().
 */var LeafNode=/** @class */function(){/**
     * @implements {Node}
     * @param {!(string|number|boolean|Object)} value_ The value to store in this leaf node.
     *                                         The object type is possible in the event of a deferred value
     * @param {!Node=} priorityNode_ The priority of this node.
     */function LeafNode(value_,priorityNode_){if(priorityNode_===void 0){priorityNode_=LeafNode.__childrenNodeConstructor.EMPTY_NODE;}this.value_=value_;this.priorityNode_=priorityNode_;this.lazyHash_=null;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.value_!==undefined&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value.");validatePriorityNode(this.priorityNode_);}Object.defineProperty(LeafNode,"__childrenNodeConstructor",{get:function get(){return __childrenNodeConstructor;},set:function set(val){__childrenNodeConstructor=val;},enumerable:true,configurable:true});/** @inheritDoc */LeafNode.prototype.isLeafNode=function(){return true;};/** @inheritDoc */LeafNode.prototype.getPriority=function(){return this.priorityNode_;};/** @inheritDoc */LeafNode.prototype.updatePriority=function(newPriorityNode){return new LeafNode(this.value_,newPriorityNode);};/** @inheritDoc */LeafNode.prototype.getImmediateChild=function(childName){// Hack to treat priority as a regular child
if(childName==='.priority'){return this.priorityNode_;}else{return LeafNode.__childrenNodeConstructor.EMPTY_NODE;}};/** @inheritDoc */LeafNode.prototype.getChild=function(path){if(path.isEmpty()){return this;}else if(path.getFront()==='.priority'){return this.priorityNode_;}else{return LeafNode.__childrenNodeConstructor.EMPTY_NODE;}};/**
     * @inheritDoc
     */LeafNode.prototype.hasChild=function(){return false;};/** @inheritDoc */LeafNode.prototype.getPredecessorChildName=function(childName,childNode){return null;};/** @inheritDoc */LeafNode.prototype.updateImmediateChild=function(childName,newChildNode){if(childName==='.priority'){return this.updatePriority(newChildNode);}else if(newChildNode.isEmpty()&&childName!=='.priority'){return this;}else{return LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(childName,newChildNode).updatePriority(this.priorityNode_);}};/** @inheritDoc */LeafNode.prototype.updateChild=function(path,newChildNode){var front=path.getFront();if(front===null){return newChildNode;}else if(newChildNode.isEmpty()&&front!=='.priority'){return this;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(front!=='.priority'||path.getLength()===1,'.priority must be the last token in a path');return this.updateImmediateChild(front,LeafNode.__childrenNodeConstructor.EMPTY_NODE.updateChild(path.popFront(),newChildNode));}};/** @inheritDoc */LeafNode.prototype.isEmpty=function(){return false;};/** @inheritDoc */LeafNode.prototype.numChildren=function(){return 0;};/** @inheritDoc */LeafNode.prototype.forEachChild=function(index,action){return false;};/**
     * @inheritDoc
     */LeafNode.prototype.val=function(exportFormat){if(exportFormat&&!this.getPriority().isEmpty())return{'.value':this.getValue(),'.priority':this.getPriority().val()};else return this.getValue();};/** @inheritDoc */LeafNode.prototype.hash=function(){if(this.lazyHash_===null){var toHash='';if(!this.priorityNode_.isEmpty())toHash+='priority:'+priorityHashText(this.priorityNode_.val())+':';var type=typeof this.value_;toHash+=type+':';if(type==='number'){toHash+=doubleToIEEE754String(this.value_);}else{toHash+=this.value_;}this.lazyHash_=sha1(toHash);}return this.lazyHash_;};/**
     * Returns the value of the leaf node.
     * @return {Object|string|number|boolean} The value of the node.
     */LeafNode.prototype.getValue=function(){return this.value_;};/**
     * @inheritDoc
     */LeafNode.prototype.compareTo=function(other){if(other===LeafNode.__childrenNodeConstructor.EMPTY_NODE){return 1;}else if(other instanceof LeafNode.__childrenNodeConstructor){return-1;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(other.isLeafNode(),'Unknown node type');return this.compareToLeafNode_(other);}};/**
     * Comparison specifically for two leaf nodes
     * @param {!LeafNode} otherLeaf
     * @return {!number}
     * @private
     */LeafNode.prototype.compareToLeafNode_=function(otherLeaf){var otherLeafType=typeof otherLeaf.value_;var thisLeafType=typeof this.value_;var otherIndex=LeafNode.VALUE_TYPE_ORDER.indexOf(otherLeafType);var thisIndex=LeafNode.VALUE_TYPE_ORDER.indexOf(thisLeafType);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(otherIndex>=0,'Unknown leaf type: '+otherLeafType);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(thisIndex>=0,'Unknown leaf type: '+thisLeafType);if(otherIndex===thisIndex){// Same type, compare values
if(thisLeafType==='object'){// Deferred value nodes are all equal, but we should also never get to this point...
return 0;}else{// Note that this works because true > false, all others are number or string comparisons
if(this.value_<otherLeaf.value_){return-1;}else if(this.value_===otherLeaf.value_){return 0;}else{return 1;}}}else{return thisIndex-otherIndex;}};/**
     * @inheritDoc
     */LeafNode.prototype.withIndex=function(){return this;};/**
     * @inheritDoc
     */LeafNode.prototype.isIndexed=function(){return true;};/**
     * @inheritDoc
     */LeafNode.prototype.equals=function(other){/**
         * @inheritDoc
         */if(other===this){return true;}else if(other.isLeafNode()){var otherLeaf=other;return this.value_===otherLeaf.value_&&this.priorityNode_.equals(otherLeaf.priorityNode_);}else{return false;}};/**
     * The sort order for comparing leaf nodes of different types. If two leaf nodes have
     * the same type, the comparison falls back to their value
     * @type {Array.<!string>}
     * @const
     */LeafNode.VALUE_TYPE_ORDER=['object','boolean','number','string'];return LeafNode;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nodeFromJSON;var MAX_NODE$1;function setNodeFromJSON(val){nodeFromJSON=val;}function setMaxNode$1(val){MAX_NODE$1=val;}/**
 * @constructor
 * @extends {Index}
 * @private
 */var PriorityIndex=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(PriorityIndex,_super);function PriorityIndex(){return _super!==null&&_super.apply(this,arguments)||this;}/**
     * @inheritDoc
     */PriorityIndex.prototype.compare=function(a,b){var aPriority=a.node.getPriority();var bPriority=b.node.getPriority();var indexCmp=aPriority.compareTo(bPriority);if(indexCmp===0){return nameCompare(a.name,b.name);}else{return indexCmp;}};/**
     * @inheritDoc
     */PriorityIndex.prototype.isDefinedOn=function(node){return!node.getPriority().isEmpty();};/**
     * @inheritDoc
     */PriorityIndex.prototype.indexedValueChanged=function(oldNode,newNode){return!oldNode.getPriority().equals(newNode.getPriority());};/**
     * @inheritDoc
     */PriorityIndex.prototype.minPost=function(){return NamedNode.MIN;};/**
     * @inheritDoc
     */PriorityIndex.prototype.maxPost=function(){return new NamedNode(MAX_NAME,new LeafNode('[PRIORITY-POST]',MAX_NODE$1));};/**
     * @param {*} indexValue
     * @param {string} name
     * @return {!NamedNode}
     */PriorityIndex.prototype.makePost=function(indexValue,name){var priorityNode=nodeFromJSON(indexValue);return new NamedNode(name,new LeafNode('[PRIORITY-POST]',priorityNode));};/**
     * @return {!string} String representation for inclusion in a query spec
     */PriorityIndex.prototype.toString=function(){return'.priority';};return PriorityIndex;}(Index);var PRIORITY_INDEX=new PriorityIndex();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An iterator over an LLRBNode.
 */var SortedMapIterator=/** @class */function(){/**
     * @template K, V, T
     * @param {LLRBNode|LLRBEmptyNode} node Node to iterate.
     * @param {?K} startKey
     * @param {function(K, K): number} comparator
     * @param {boolean} isReverse_ Whether or not to iterate in reverse
     * @param {(function(K, V):T)=} resultGenerator_
     */function SortedMapIterator(node,startKey,comparator,isReverse_,resultGenerator_){if(resultGenerator_===void 0){resultGenerator_=null;}this.isReverse_=isReverse_;this.resultGenerator_=resultGenerator_;/** @private
         * @type {Array.<!LLRBNode>}
         */this.nodeStack_=[];var cmp=1;while(!node.isEmpty()){node=node;cmp=startKey?comparator(node.key,startKey):1;// flip the comparison if we're going in reverse
if(isReverse_)cmp*=-1;if(cmp<0){// This node is less than our start key. ignore it
if(this.isReverse_){node=node.left;}else{node=node.right;}}else if(cmp===0){// This node is exactly equal to our start key. Push it on the stack, but stop iterating;
this.nodeStack_.push(node);break;}else{// This node is greater than our start key, add it to the stack and move to the next one
this.nodeStack_.push(node);if(this.isReverse_){node=node.right;}else{node=node.left;}}}}SortedMapIterator.prototype.getNext=function(){if(this.nodeStack_.length===0)return null;var node=this.nodeStack_.pop();var result;if(this.resultGenerator_)result=this.resultGenerator_(node.key,node.value);else result={key:node.key,value:node.value};if(this.isReverse_){node=node.left;while(!node.isEmpty()){this.nodeStack_.push(node);node=node.right;}}else{node=node.right;while(!node.isEmpty()){this.nodeStack_.push(node);node=node.left;}}return result;};SortedMapIterator.prototype.hasNext=function(){return this.nodeStack_.length>0;};SortedMapIterator.prototype.peek=function(){if(this.nodeStack_.length===0)return null;var node=this.nodeStack_[this.nodeStack_.length-1];if(this.resultGenerator_){return this.resultGenerator_(node.key,node.value);}else{return{key:node.key,value:node.value};}};return SortedMapIterator;}();/**
 * Represents a node in a Left-leaning Red-Black tree.
 */var LLRBNode=/** @class */function(){/**
     * @template K, V
     * @param {!K} key Key associated with this node.
     * @param {!V} value Value associated with this node.
     * @param {?boolean} color Whether this node is red.
     * @param {?(LLRBNode|LLRBEmptyNode)=} left Left child.
     * @param {?(LLRBNode|LLRBEmptyNode)=} right Right child.
     */function LLRBNode(key,value,color,left,right){this.key=key;this.value=value;this.color=color!=null?color:LLRBNode.RED;this.left=left!=null?left:SortedMap.EMPTY_NODE;this.right=right!=null?right:SortedMap.EMPTY_NODE;}/**
     * Returns a copy of the current node, optionally replacing pieces of it.
     *
     * @param {?K} key New key for the node, or null.
     * @param {?V} value New value for the node, or null.
     * @param {?boolean} color New color for the node, or null.
     * @param {?LLRBNode|LLRBEmptyNode} left New left child for the node, or null.
     * @param {?LLRBNode|LLRBEmptyNode} right New right child for the node, or null.
     * @return {!LLRBNode} The node copy.
     */LLRBNode.prototype.copy=function(key,value,color,left,right){return new LLRBNode(key!=null?key:this.key,value!=null?value:this.value,color!=null?color:this.color,left!=null?left:this.left,right!=null?right:this.right);};/**
     * @return {number} The total number of nodes in the tree.
     */LLRBNode.prototype.count=function(){return this.left.count()+1+this.right.count();};/**
     * @return {boolean} True if the tree is empty.
     */LLRBNode.prototype.isEmpty=function(){return false;};/**
     * Traverses the tree in key order and calls the specified action function
     * for each node.
     *
     * @param {function(!K, !V):*} action Callback function to be called for each
     *   node.  If it returns true, traversal is aborted.
     * @return {*} The first truthy value returned by action, or the last falsey
     *   value returned by action
     */LLRBNode.prototype.inorderTraversal=function(action){return this.left.inorderTraversal(action)||action(this.key,this.value)||this.right.inorderTraversal(action);};/**
     * Traverses the tree in reverse key order and calls the specified action function
     * for each node.
     *
     * @param {function(!Object, !Object)} action Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @return {*} True if traversal was aborted.
     */LLRBNode.prototype.reverseTraversal=function(action){return this.right.reverseTraversal(action)||action(this.key,this.value)||this.left.reverseTraversal(action);};/**
     * @return {!Object} The minimum node in the tree.
     * @private
     */LLRBNode.prototype.min_=function(){if(this.left.isEmpty()){return this;}else{return this.left.min_();}};/**
     * @return {!K} The maximum key in the tree.
     */LLRBNode.prototype.minKey=function(){return this.min_().key;};/**
     * @return {!K} The maximum key in the tree.
     */LLRBNode.prototype.maxKey=function(){if(this.right.isEmpty()){return this.key;}else{return this.right.maxKey();}};/**
     *
     * @param {!Object} key Key to insert.
     * @param {!Object} value Value to insert.
     * @param {Comparator} comparator Comparator.
     * @return {!LLRBNode} New tree, with the key/value added.
     */LLRBNode.prototype.insert=function(key,value,comparator){var cmp,n;n=this;cmp=comparator(key,n.key);if(cmp<0){n=n.copy(null,null,null,n.left.insert(key,value,comparator),null);}else if(cmp===0){n=n.copy(null,value,null,null,null);}else{n=n.copy(null,null,null,null,n.right.insert(key,value,comparator));}return n.fixUp_();};/**
     * @private
     * @return {!LLRBNode|LLRBEmptyNode} New tree, with the minimum key removed.
     */LLRBNode.prototype.removeMin_=function(){if(this.left.isEmpty()){return SortedMap.EMPTY_NODE;}var n=this;if(!n.left.isRed_()&&!n.left.left.isRed_())n=n.moveRedLeft_();n=n.copy(null,null,null,n.left.removeMin_(),null);return n.fixUp_();};/**
     * @param {!Object} key The key of the item to remove.
     * @param {Comparator} comparator Comparator.
     * @return {!LLRBNode|LLRBEmptyNode} New tree, with the specified item removed.
     */LLRBNode.prototype.remove=function(key,comparator){var n,smallest;n=this;if(comparator(key,n.key)<0){if(!n.left.isEmpty()&&!n.left.isRed_()&&!n.left.left.isRed_()){n=n.moveRedLeft_();}n=n.copy(null,null,null,n.left.remove(key,comparator),null);}else{if(n.left.isRed_())n=n.rotateRight_();if(!n.right.isEmpty()&&!n.right.isRed_()&&!n.right.left.isRed_()){n=n.moveRedRight_();}if(comparator(key,n.key)===0){if(n.right.isEmpty()){return SortedMap.EMPTY_NODE;}else{smallest=n.right.min_();n=n.copy(smallest.key,smallest.value,null,null,n.right.removeMin_());}}n=n.copy(null,null,null,null,n.right.remove(key,comparator));}return n.fixUp_();};/**
     * @private
     * @return {boolean} Whether this is a RED node.
     */LLRBNode.prototype.isRed_=function(){return this.color;};/**
     * @private
     * @return {!LLRBNode} New tree after performing any needed rotations.
     */LLRBNode.prototype.fixUp_=function(){var n=this;if(n.right.isRed_()&&!n.left.isRed_())n=n.rotateLeft_();if(n.left.isRed_()&&n.left.left.isRed_())n=n.rotateRight_();if(n.left.isRed_()&&n.right.isRed_())n=n.colorFlip_();return n;};/**
     * @private
     * @return {!LLRBNode} New tree, after moveRedLeft.
     */LLRBNode.prototype.moveRedLeft_=function(){var n=this.colorFlip_();if(n.right.left.isRed_()){n=n.copy(null,null,null,null,n.right.rotateRight_());n=n.rotateLeft_();n=n.colorFlip_();}return n;};/**
     * @private
     * @return {!LLRBNode} New tree, after moveRedRight.
     */LLRBNode.prototype.moveRedRight_=function(){var n=this.colorFlip_();if(n.left.left.isRed_()){n=n.rotateRight_();n=n.colorFlip_();}return n;};/**
     * @private
     * @return {!LLRBNode} New tree, after rotateLeft.
     */LLRBNode.prototype.rotateLeft_=function(){var nl=this.copy(null,null,LLRBNode.RED,null,this.right.left);return this.right.copy(null,null,this.color,nl,null);};/**
     * @private
     * @return {!LLRBNode} New tree, after rotateRight.
     */LLRBNode.prototype.rotateRight_=function(){var nr=this.copy(null,null,LLRBNode.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,nr);};/**
     * @private
     * @return {!LLRBNode} New tree, after colorFlip.
     */LLRBNode.prototype.colorFlip_=function(){var left=this.left.copy(null,null,!this.left.color,null,null);var right=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,left,right);};/**
     * For testing.
     *
     * @private
     * @return {boolean} True if all is well.
     */LLRBNode.prototype.checkMaxDepth_=function(){var blackDepth=this.check_();return Math.pow(2.0,blackDepth)<=this.count()+1;};/**
     * @private
     * @return {number} Not sure what this returns exactly. :-).
     */LLRBNode.prototype.check_=function(){var blackDepth;if(this.isRed_()&&this.left.isRed_()){throw new Error('Red node has red child('+this.key+','+this.value+')');}if(this.right.isRed_()){throw new Error('Right child of ('+this.key+','+this.value+') is red');}blackDepth=this.left.check_();if(blackDepth!==this.right.check_()){throw new Error('Black depths differ');}else{return blackDepth+(this.isRed_()?0:1);}};LLRBNode.RED=true;LLRBNode.BLACK=false;return LLRBNode;}();/**
 * Represents an empty node (a leaf node in the Red-Black Tree).
 */var LLRBEmptyNode=/** @class */function(){function LLRBEmptyNode(){}/**
     * Returns a copy of the current node.
     *
     * @return {!LLRBEmptyNode} The node copy.
     */LLRBEmptyNode.prototype.copy=function(key,value,color,left,right){return this;};/**
     * Returns a copy of the tree, with the specified key/value added.
     *
     * @param {!K} key Key to be added.
     * @param {!V} value Value to be added.
     * @param {Comparator} comparator Comparator.
     * @return {!LLRBNode} New tree, with item added.
     */LLRBEmptyNode.prototype.insert=function(key,value,comparator){return new LLRBNode(key,value,null);};/**
     * Returns a copy of the tree, with the specified key removed.
     *
     * @param {!K} key The key to remove.
     * @param {Comparator} comparator Comparator.
     * @return {!LLRBEmptyNode} New tree, with item removed.
     */LLRBEmptyNode.prototype.remove=function(key,comparator){return this;};/**
     * @return {number} The total number of nodes in the tree.
     */LLRBEmptyNode.prototype.count=function(){return 0;};/**
     * @return {boolean} True if the tree is empty.
     */LLRBEmptyNode.prototype.isEmpty=function(){return true;};/**
     * Traverses the tree in key order and calls the specified action function
     * for each node.
     *
     * @param {function(!K, !V):*} action Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @return {boolean} True if traversal was aborted.
     */LLRBEmptyNode.prototype.inorderTraversal=function(action){return false;};/**
     * Traverses the tree in reverse key order and calls the specified action function
     * for each node.
     *
     * @param {function(!K, !V)} action Callback function to be called for each
     * node.  If it returns true, traversal is aborted.
     * @return {boolean} True if traversal was aborted.
     */LLRBEmptyNode.prototype.reverseTraversal=function(action){return false;};/**
     * @return {null}
     */LLRBEmptyNode.prototype.minKey=function(){return null;};/**
     * @return {null}
     */LLRBEmptyNode.prototype.maxKey=function(){return null;};/**
     * @private
     * @return {number} Not sure what this returns exactly. :-).
     */LLRBEmptyNode.prototype.check_=function(){return 0;};/**
     * @private
     * @return {boolean} Whether this node is red.
     */LLRBEmptyNode.prototype.isRed_=function(){return false;};return LLRBEmptyNode;}();/**
 * An immutable sorted map implementation, based on a Left-leaning Red-Black
 * tree.
 */var SortedMap=/** @class */function(){/**
     * @template K, V
     * @param {function(K, K):number} comparator_ Key comparator.
     * @param {LLRBNode=} root_ (Optional) Root node for the map.
     */function SortedMap(comparator_,root_){if(root_===void 0){root_=SortedMap.EMPTY_NODE;}this.comparator_=comparator_;this.root_=root_;}/**
     * Returns a copy of the map, with the specified key/value added or replaced.
     * (TODO: We should perhaps rename this method to 'put')
     *
     * @param {!K} key Key to be added.
     * @param {!V} value Value to be added.
     * @return {!SortedMap.<K, V>} New map, with item added.
     */SortedMap.prototype.insert=function(key,value){return new SortedMap(this.comparator_,this.root_.insert(key,value,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null));};/**
     * Returns a copy of the map, with the specified key removed.
     *
     * @param {!K} key The key to remove.
     * @return {!SortedMap.<K, V>} New map, with item removed.
     */SortedMap.prototype.remove=function(key){return new SortedMap(this.comparator_,this.root_.remove(key,this.comparator_).copy(null,null,LLRBNode.BLACK,null,null));};/**
     * Returns the value of the node with the given key, or null.
     *
     * @param {!K} key The key to look up.
     * @return {?V} The value of the node with the given key, or null if the
     * key doesn't exist.
     */SortedMap.prototype.get=function(key){var cmp;var node=this.root_;while(!node.isEmpty()){cmp=this.comparator_(key,node.key);if(cmp===0){return node.value;}else if(cmp<0){node=node.left;}else if(cmp>0){node=node.right;}}return null;};/**
     * Returns the key of the item *before* the specified key, or null if key is the first item.
     * @param {K} key The key to find the predecessor of
     * @return {?K} The predecessor key.
     */SortedMap.prototype.getPredecessorKey=function(key){var cmp,node=this.root_,rightParent=null;while(!node.isEmpty()){cmp=this.comparator_(key,node.key);if(cmp===0){if(!node.left.isEmpty()){node=node.left;while(!node.right.isEmpty()){node=node.right;}return node.key;}else if(rightParent){return rightParent.key;}else{return null;// first item.
}}else if(cmp<0){node=node.left;}else if(cmp>0){rightParent=node;node=node.right;}}throw new Error('Attempted to find predecessor key for a nonexistent key.  What gives?');};/**
     * @return {boolean} True if the map is empty.
     */SortedMap.prototype.isEmpty=function(){return this.root_.isEmpty();};/**
     * @return {number} The total number of nodes in the map.
     */SortedMap.prototype.count=function(){return this.root_.count();};/**
     * @return {?K} The minimum key in the map.
     */SortedMap.prototype.minKey=function(){return this.root_.minKey();};/**
     * @return {?K} The maximum key in the map.
     */SortedMap.prototype.maxKey=function(){return this.root_.maxKey();};/**
     * Traverses the map in key order and calls the specified action function
     * for each key/value pair.
     *
     * @param {function(!K, !V):*} action Callback function to be called
     * for each key/value pair.  If action returns true, traversal is aborted.
     * @return {*} The first truthy value returned by action, or the last falsey
     *   value returned by action
     */SortedMap.prototype.inorderTraversal=function(action){return this.root_.inorderTraversal(action);};/**
     * Traverses the map in reverse key order and calls the specified action function
     * for each key/value pair.
     *
     * @param {function(!Object, !Object)} action Callback function to be called
     * for each key/value pair.  If action returns true, traversal is aborted.
     * @return {*} True if the traversal was aborted.
     */SortedMap.prototype.reverseTraversal=function(action){return this.root_.reverseTraversal(action);};/**
     * Returns an iterator over the SortedMap.
     * @template T
     * @param {(function(K, V):T)=} resultGenerator
     * @return {SortedMapIterator.<K, V, T>} The iterator.
     */SortedMap.prototype.getIterator=function(resultGenerator){return new SortedMapIterator(this.root_,null,this.comparator_,false,resultGenerator);};SortedMap.prototype.getIteratorFrom=function(key,resultGenerator){return new SortedMapIterator(this.root_,key,this.comparator_,false,resultGenerator);};SortedMap.prototype.getReverseIteratorFrom=function(key,resultGenerator){return new SortedMapIterator(this.root_,key,this.comparator_,true,resultGenerator);};SortedMap.prototype.getReverseIterator=function(resultGenerator){return new SortedMapIterator(this.root_,null,this.comparator_,true,resultGenerator);};/**
     * Always use the same empty node, to reduce memory.
     * @const
     */SortedMap.EMPTY_NODE=new LLRBEmptyNode();return SortedMap;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var LOG_2=Math.log(2);/**
 * @constructor
 */var Base12Num=/** @class */function(){/**
     * @param {number} length
     */function Base12Num(length){var logBase2=function logBase2(num){return parseInt(Math.log(num)/LOG_2,10);};var bitMask=function bitMask(bits){return parseInt(Array(bits+1).join('1'),2);};this.count=logBase2(length+1);this.current_=this.count-1;var mask=bitMask(this.count);this.bits_=length+1&mask;}/**
     * @return {boolean}
     */Base12Num.prototype.nextBitIsOne=function(){//noinspection JSBitwiseOperatorUsage
var result=!(this.bits_&0x1<<this.current_);this.current_--;return result;};return Base12Num;}();/**
 * Takes a list of child nodes and constructs a SortedSet using the given comparison
 * function
 *
 * Uses the algorithm described in the paper linked here:
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.46.1458
 *
 * @template K, V
 * @param {Array.<!NamedNode>} childList Unsorted list of children
 * @param {function(!NamedNode, !NamedNode):number} cmp The comparison method to be used
 * @param {(function(NamedNode):K)=} keyFn An optional function to extract K from a node wrapper, if K's
 *                                                        type is not NamedNode
 * @param {(function(K, K):number)=} mapSortFn An optional override for comparator used by the generated sorted map
 * @return {SortedMap.<K, V>}
 */var buildChildSet=function buildChildSet(childList,cmp,keyFn,mapSortFn){childList.sort(cmp);var buildBalancedTree=function buildBalancedTree(low,high){var length=high-low;var namedNode;var key;if(length==0){return null;}else if(length==1){namedNode=childList[low];key=keyFn?keyFn(namedNode):namedNode;return new LLRBNode(key,namedNode.node,LLRBNode.BLACK,null,null);}else{var middle=parseInt(length/2,10)+low;var left=buildBalancedTree(low,middle);var right=buildBalancedTree(middle+1,high);namedNode=childList[middle];key=keyFn?keyFn(namedNode):namedNode;return new LLRBNode(key,namedNode.node,LLRBNode.BLACK,left,right);}};var buildFrom12Array=function buildFrom12Array(base12){var node=null;var root=null;var index=childList.length;var buildPennant=function buildPennant(chunkSize,color){var low=index-chunkSize;var high=index;index-=chunkSize;var childTree=buildBalancedTree(low+1,high);var namedNode=childList[low];var key=keyFn?keyFn(namedNode):namedNode;attachPennant(new LLRBNode(key,namedNode.node,color,null,childTree));};var attachPennant=function attachPennant(pennant){if(node){node.left=pennant;node=pennant;}else{root=pennant;node=pennant;}};for(var i=0;i<base12.count;++i){var isOne=base12.nextBitIsOne();// The number of nodes taken in each slice is 2^(arr.length - (i + 1))
var chunkSize=Math.pow(2,base12.count-(i+1));if(isOne){buildPennant(chunkSize,LLRBNode.BLACK);}else{// current == 2
buildPennant(chunkSize,LLRBNode.BLACK);buildPennant(chunkSize,LLRBNode.RED);}}return root;};var base12=new Base12Num(childList.length);var root=buildFrom12Array(base12);return new SortedMap(mapSortFn||cmp,root);};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _defaultIndexMap;var fallbackObject={};/**
 *
 * @param {Object.<string, FallbackType|SortedMap.<NamedNode, Node>>} indexes
 * @param {Object.<string, Index>} indexSet
 * @constructor
 */var IndexMap=/** @class */function(){function IndexMap(indexes_,indexSet_){this.indexes_=indexes_;this.indexSet_=indexSet_;}Object.defineProperty(IndexMap,"Default",{/**
         * The default IndexMap for nodes without a priority
         * @type {!IndexMap}
         * @const
         */get:function get(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(fallbackObject&&PRIORITY_INDEX,'ChildrenNode.ts has not been loaded');_defaultIndexMap=_defaultIndexMap||new IndexMap({'.priority':fallbackObject},{'.priority':PRIORITY_INDEX});return _defaultIndexMap;},enumerable:true,configurable:true});/**
     *
     * @param {!string} indexKey
     * @return {?SortedMap.<NamedNode, Node>}
     */IndexMap.prototype.get=function(indexKey){var sortedMap=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.indexes_,indexKey);if(!sortedMap)throw new Error('No index defined for '+indexKey);if(sortedMap===fallbackObject){// The index exists, but it falls back to just name comparison. Return null so that the calling code uses the
// regular child map
return null;}else{return sortedMap;}};/**
     * @param {!Index} indexDefinition
     * @return {boolean}
     */IndexMap.prototype.hasIndex=function(indexDefinition){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.indexSet_,indexDefinition.toString());};/**
     * @param {!Index} indexDefinition
     * @param {!SortedMap.<string, !Node>} existingChildren
     * @return {!IndexMap}
     */IndexMap.prototype.addIndex=function(indexDefinition,existingChildren){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(indexDefinition!==KEY_INDEX,"KeyIndex always exists and isn't meant to be added to the IndexMap.");var childList=[];var sawIndexedValue=false;var iter=existingChildren.getIterator(NamedNode.Wrap);var next=iter.getNext();while(next){sawIndexedValue=sawIndexedValue||indexDefinition.isDefinedOn(next.node);childList.push(next);next=iter.getNext();}var newIndex;if(sawIndexedValue){newIndex=buildChildSet(childList,indexDefinition.getCompare());}else{newIndex=fallbackObject;}var indexName=indexDefinition.toString();var newIndexSet=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["i" /* clone */])(this.indexSet_);newIndexSet[indexName]=indexDefinition;var newIndexes=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["i" /* clone */])(this.indexes_);newIndexes[indexName]=newIndex;return new IndexMap(newIndexes,newIndexSet);};/**
     * Ensure that this node is properly tracked in any indexes that we're maintaining
     * @param {!NamedNode} namedNode
     * @param {!SortedMap.<string, !Node>} existingChildren
     * @return {!IndexMap}
     */IndexMap.prototype.addToIndexes=function(namedNode,existingChildren){var _this=this;var newIndexes=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["C" /* map */])(this.indexes_,function(indexedChildren,indexName){var index=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(_this.indexSet_,indexName);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(index,'Missing index implementation for '+indexName);if(indexedChildren===fallbackObject){// Check to see if we need to index everything
if(index.isDefinedOn(namedNode.node)){// We need to build this index
var childList=[];var iter=existingChildren.getIterator(NamedNode.Wrap);var next=iter.getNext();while(next){if(next.name!=namedNode.name){childList.push(next);}next=iter.getNext();}childList.push(namedNode);return buildChildSet(childList,index.getCompare());}else{// No change, this remains a fallback
return fallbackObject;}}else{var existingSnap=existingChildren.get(namedNode.name);var newChildren=indexedChildren;if(existingSnap){newChildren=newChildren.remove(new NamedNode(namedNode.name,existingSnap));}return newChildren.insert(namedNode,namedNode.node);}});return new IndexMap(newIndexes,this.indexSet_);};/**
     * Create a new IndexMap instance with the given value removed
     * @param {!NamedNode} namedNode
     * @param {!SortedMap.<string, !Node>} existingChildren
     * @return {!IndexMap}
     */IndexMap.prototype.removeFromIndexes=function(namedNode,existingChildren){var newIndexes=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["C" /* map */])(this.indexes_,function(indexedChildren){if(indexedChildren===fallbackObject){// This is the fallback. Just return it, nothing to do in this case
return indexedChildren;}else{var existingSnap=existingChildren.get(namedNode.name);if(existingSnap){return indexedChildren.remove(new NamedNode(namedNode.name,existingSnap));}else{// No record of this child
return indexedChildren;}}});return new IndexMap(newIndexes,this.indexSet_);};return IndexMap;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NAME_ONLY_COMPARATOR(left,right){return nameCompare(left.name,right.name);}function NAME_COMPARATOR(left,right){return nameCompare(left,right);}/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// TODO: For memory savings, don't store priorityNode_ if it's empty.
var EMPTY_NODE;/**
 * ChildrenNode is a class for storing internal nodes in a DataSnapshot
 * (i.e. nodes with children).  It implements Node and stores the
 * list of children in the children property, sorted by child name.
 *
 * @constructor
 * @implements {Node}
 */var ChildrenNode=/** @class */function(){/**
     *
     * @param {!SortedMap.<string, !Node>} children_ List of children
     * of this node..
     * @param {?Node} priorityNode_ The priority of this node (as a snapshot node).
     * @param {!IndexMap} indexMap_
     */function ChildrenNode(children_,priorityNode_,indexMap_){this.children_=children_;this.priorityNode_=priorityNode_;this.indexMap_=indexMap_;this.lazyHash_=null;/**
         * Note: The only reason we allow null priority is for EMPTY_NODE, since we can't use
         * EMPTY_NODE as the priority of EMPTY_NODE.  We might want to consider making EMPTY_NODE its own
         * class instead of an empty ChildrenNode.
         */if(this.priorityNode_){validatePriorityNode(this.priorityNode_);}if(this.children_.isEmpty()){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!this.priorityNode_||this.priorityNode_.isEmpty(),'An empty node cannot have a priority');}}Object.defineProperty(ChildrenNode,"EMPTY_NODE",{get:function get(){return EMPTY_NODE||(EMPTY_NODE=new ChildrenNode(new SortedMap(NAME_COMPARATOR),null,IndexMap.Default));},enumerable:true,configurable:true});/** @inheritDoc */ChildrenNode.prototype.isLeafNode=function(){return false;};/** @inheritDoc */ChildrenNode.prototype.getPriority=function(){return this.priorityNode_||EMPTY_NODE;};/** @inheritDoc */ChildrenNode.prototype.updatePriority=function(newPriorityNode){if(this.children_.isEmpty()){// Don't allow priorities on empty nodes
return this;}else{return new ChildrenNode(this.children_,newPriorityNode,this.indexMap_);}};/** @inheritDoc */ChildrenNode.prototype.getImmediateChild=function(childName){// Hack to treat priority as a regular child
if(childName==='.priority'){return this.getPriority();}else{var child=this.children_.get(childName);return child===null?EMPTY_NODE:child;}};/** @inheritDoc */ChildrenNode.prototype.getChild=function(path){var front=path.getFront();if(front===null)return this;return this.getImmediateChild(front).getChild(path.popFront());};/** @inheritDoc */ChildrenNode.prototype.hasChild=function(childName){return this.children_.get(childName)!==null;};/** @inheritDoc */ChildrenNode.prototype.updateImmediateChild=function(childName,newChildNode){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(newChildNode,'We should always be passing snapshot nodes');if(childName==='.priority'){return this.updatePriority(newChildNode);}else{var namedNode=new NamedNode(childName,newChildNode);var newChildren=void 0,newIndexMap=void 0,newPriority=void 0;if(newChildNode.isEmpty()){newChildren=this.children_.remove(childName);newIndexMap=this.indexMap_.removeFromIndexes(namedNode,this.children_);}else{newChildren=this.children_.insert(childName,newChildNode);newIndexMap=this.indexMap_.addToIndexes(namedNode,this.children_);}newPriority=newChildren.isEmpty()?EMPTY_NODE:this.priorityNode_;return new ChildrenNode(newChildren,newPriority,newIndexMap);}};/** @inheritDoc */ChildrenNode.prototype.updateChild=function(path,newChildNode){var front=path.getFront();if(front===null){return newChildNode;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(path.getFront()!=='.priority'||path.getLength()===1,'.priority must be the last token in a path');var newImmediateChild=this.getImmediateChild(front).updateChild(path.popFront(),newChildNode);return this.updateImmediateChild(front,newImmediateChild);}};/** @inheritDoc */ChildrenNode.prototype.isEmpty=function(){return this.children_.isEmpty();};/** @inheritDoc */ChildrenNode.prototype.numChildren=function(){return this.children_.count();};/** @inheritDoc */ChildrenNode.prototype.val=function(exportFormat){if(this.isEmpty())return null;var obj={};var numKeys=0,maxKey=0,allIntegerKeys=true;this.forEachChild(PRIORITY_INDEX,function(key,childNode){obj[key]=childNode.val(exportFormat);numKeys++;if(allIntegerKeys&&ChildrenNode.INTEGER_REGEXP_.test(key)){maxKey=Math.max(maxKey,Number(key));}else{allIntegerKeys=false;}});if(!exportFormat&&allIntegerKeys&&maxKey<2*numKeys){// convert to array.
var array=[];for(var key in obj){array[key]=obj[key];}return array;}else{if(exportFormat&&!this.getPriority().isEmpty()){obj['.priority']=this.getPriority().val();}return obj;}};/** @inheritDoc */ChildrenNode.prototype.hash=function(){if(this.lazyHash_===null){var toHash_1='';if(!this.getPriority().isEmpty())toHash_1+='priority:'+priorityHashText(this.getPriority().val())+':';this.forEachChild(PRIORITY_INDEX,function(key,childNode){var childHash=childNode.hash();if(childHash!=='')toHash_1+=':'+key+':'+childHash;});this.lazyHash_=toHash_1===''?'':sha1(toHash_1);}return this.lazyHash_;};/** @inheritDoc */ChildrenNode.prototype.getPredecessorChildName=function(childName,childNode,index){var idx=this.resolveIndex_(index);if(idx){var predecessor=idx.getPredecessorKey(new NamedNode(childName,childNode));return predecessor?predecessor.name:null;}else{return this.children_.getPredecessorKey(childName);}};/**
     * @param {!Index} indexDefinition
     * @return {?string}
     */ChildrenNode.prototype.getFirstChildName=function(indexDefinition){var idx=this.resolveIndex_(indexDefinition);if(idx){var minKey=idx.minKey();return minKey&&minKey.name;}else{return this.children_.minKey();}};/**
     * @param {!Index} indexDefinition
     * @return {?NamedNode}
     */ChildrenNode.prototype.getFirstChild=function(indexDefinition){var minKey=this.getFirstChildName(indexDefinition);if(minKey){return new NamedNode(minKey,this.children_.get(minKey));}else{return null;}};/**
     * Given an index, return the key name of the largest value we have, according to that index
     * @param {!Index} indexDefinition
     * @return {?string}
     */ChildrenNode.prototype.getLastChildName=function(indexDefinition){var idx=this.resolveIndex_(indexDefinition);if(idx){var maxKey=idx.maxKey();return maxKey&&maxKey.name;}else{return this.children_.maxKey();}};/**
     * @param {!Index} indexDefinition
     * @return {?NamedNode}
     */ChildrenNode.prototype.getLastChild=function(indexDefinition){var maxKey=this.getLastChildName(indexDefinition);if(maxKey){return new NamedNode(maxKey,this.children_.get(maxKey));}else{return null;}};/**
     * @inheritDoc
     */ChildrenNode.prototype.forEachChild=function(index,action){var idx=this.resolveIndex_(index);if(idx){return idx.inorderTraversal(function(wrappedNode){return action(wrappedNode.name,wrappedNode.node);});}else{return this.children_.inorderTraversal(action);}};/**
     * @param {!Index} indexDefinition
     * @return {SortedMapIterator}
     */ChildrenNode.prototype.getIterator=function(indexDefinition){return this.getIteratorFrom(indexDefinition.minPost(),indexDefinition);};/**
     *
     * @param {!NamedNode} startPost
     * @param {!Index} indexDefinition
     * @return {!SortedMapIterator}
     */ChildrenNode.prototype.getIteratorFrom=function(startPost,indexDefinition){var idx=this.resolveIndex_(indexDefinition);if(idx){return idx.getIteratorFrom(startPost,function(key){return key;});}else{var iterator=this.children_.getIteratorFrom(startPost.name,NamedNode.Wrap);var next=iterator.peek();while(next!=null&&indexDefinition.compare(next,startPost)<0){iterator.getNext();next=iterator.peek();}return iterator;}};/**
     * @param {!Index} indexDefinition
     * @return {!SortedMapIterator}
     */ChildrenNode.prototype.getReverseIterator=function(indexDefinition){return this.getReverseIteratorFrom(indexDefinition.maxPost(),indexDefinition);};/**
     * @param {!NamedNode} endPost
     * @param {!Index} indexDefinition
     * @return {!SortedMapIterator}
     */ChildrenNode.prototype.getReverseIteratorFrom=function(endPost,indexDefinition){var idx=this.resolveIndex_(indexDefinition);if(idx){return idx.getReverseIteratorFrom(endPost,function(key){return key;});}else{var iterator=this.children_.getReverseIteratorFrom(endPost.name,NamedNode.Wrap);var next=iterator.peek();while(next!=null&&indexDefinition.compare(next,endPost)>0){iterator.getNext();next=iterator.peek();}return iterator;}};/**
     * @inheritDoc
     */ChildrenNode.prototype.compareTo=function(other){if(this.isEmpty()){if(other.isEmpty()){return 0;}else{return-1;}}else if(other.isLeafNode()||other.isEmpty()){return 1;}else if(other===MAX_NODE$2){return-1;}else{// Must be another node with children.
return 0;}};/**
     * @inheritDoc
     */ChildrenNode.prototype.withIndex=function(indexDefinition){if(indexDefinition===KEY_INDEX||this.indexMap_.hasIndex(indexDefinition)){return this;}else{var newIndexMap=this.indexMap_.addIndex(indexDefinition,this.children_);return new ChildrenNode(this.children_,this.priorityNode_,newIndexMap);}};/**
     * @inheritDoc
     */ChildrenNode.prototype.isIndexed=function(index){return index===KEY_INDEX||this.indexMap_.hasIndex(index);};/**
     * @inheritDoc
     */ChildrenNode.prototype.equals=function(other){if(other===this){return true;}else if(other.isLeafNode()){return false;}else{var otherChildrenNode=other;if(!this.getPriority().equals(otherChildrenNode.getPriority())){return false;}else if(this.children_.count()===otherChildrenNode.children_.count()){var thisIter=this.getIterator(PRIORITY_INDEX);var otherIter=otherChildrenNode.getIterator(PRIORITY_INDEX);var thisCurrent=thisIter.getNext();var otherCurrent=otherIter.getNext();while(thisCurrent&&otherCurrent){if(thisCurrent.name!==otherCurrent.name||!thisCurrent.node.equals(otherCurrent.node)){return false;}thisCurrent=thisIter.getNext();otherCurrent=otherIter.getNext();}return thisCurrent===null&&otherCurrent===null;}else{return false;}}};/**
     * Returns a SortedMap ordered by index, or null if the default (by-key) ordering can be used
     * instead.
     *
     * @private
     * @param {!Index} indexDefinition
     * @return {?SortedMap.<NamedNode, Node>}
     */ChildrenNode.prototype.resolveIndex_=function(indexDefinition){if(indexDefinition===KEY_INDEX){return null;}else{return this.indexMap_.get(indexDefinition.toString());}};/**
     * @private
     * @type {RegExp}
     */ChildrenNode.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;return ChildrenNode;}();/**
 * @constructor
 * @extends {ChildrenNode}
 * @private
 */var MaxNode=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(MaxNode,_super);function MaxNode(){return _super.call(this,new SortedMap(NAME_COMPARATOR),ChildrenNode.EMPTY_NODE,IndexMap.Default)||this;}MaxNode.prototype.compareTo=function(other){if(other===this){return 0;}else{return 1;}};MaxNode.prototype.equals=function(other){// Not that we every compare it, but MAX_NODE is only ever equal to itself
return other===this;};MaxNode.prototype.getPriority=function(){return this;};MaxNode.prototype.getImmediateChild=function(childName){return ChildrenNode.EMPTY_NODE;};MaxNode.prototype.isEmpty=function(){return false;};return MaxNode;}(ChildrenNode);/**
 * Marker that will sort higher than any other snapshot.
 * @type {!MAX_NODE}
 * @const
 */var MAX_NODE$2=new MaxNode();Object.defineProperties(NamedNode,{MIN:{value:new NamedNode(MIN_NAME,ChildrenNode.EMPTY_NODE)},MAX:{value:new NamedNode(MAX_NAME,MAX_NODE$2)}});/**
 * Reference Extensions
 */KeyIndex.__EMPTY_NODE=ChildrenNode.EMPTY_NODE;LeafNode.__childrenNodeConstructor=ChildrenNode;setMaxNode(MAX_NODE$2);setMaxNode$1(MAX_NODE$2);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var USE_HINZE=true;/**
 * Constructs a snapshot node representing the passed JSON and returns it.
 * @param {*} json JSON to create a node for.
 * @param {?string|?number=} priority Optional priority to use.  This will be ignored if the
 * passed JSON contains a .priority property.
 * @return {!Node}
 */function nodeFromJSON$1(json,priority){if(priority===void 0){priority=null;}if(json===null){return ChildrenNode.EMPTY_NODE;}if(typeof json==='object'&&'.priority'in json){priority=json['.priority'];}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(priority===null||typeof priority==='string'||typeof priority==='number'||typeof priority==='object'&&'.sv'in priority,'Invalid priority type found: '+typeof priority);if(typeof json==='object'&&'.value'in json&&json['.value']!==null){json=json['.value'];}// Valid leaf nodes include non-objects or server-value wrapper objects
if(typeof json!=='object'||'.sv'in json){var jsonLeaf=json;return new LeafNode(jsonLeaf,nodeFromJSON$1(priority));}if(!(json instanceof Array)&&USE_HINZE){var children_1=[];var childrenHavePriority_1=false;var hinzeJsonObj_1=json;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(hinzeJsonObj_1,function(key,child){if(typeof key!=='string'||key.substring(0,1)!=='.'){// Ignore metadata nodes
var childNode=nodeFromJSON$1(hinzeJsonObj_1[key]);if(!childNode.isEmpty()){childrenHavePriority_1=childrenHavePriority_1||!childNode.getPriority().isEmpty();children_1.push(new NamedNode(key,childNode));}}});if(children_1.length==0){return ChildrenNode.EMPTY_NODE;}var childSet=buildChildSet(children_1,NAME_ONLY_COMPARATOR,function(namedNode){return namedNode.name;},NAME_COMPARATOR);if(childrenHavePriority_1){var sortedChildSet=buildChildSet(children_1,PRIORITY_INDEX.getCompare());return new ChildrenNode(childSet,nodeFromJSON$1(priority),new IndexMap({'.priority':sortedChildSet},{'.priority':PRIORITY_INDEX}));}else{return new ChildrenNode(childSet,nodeFromJSON$1(priority),IndexMap.Default);}}else{var node_1=ChildrenNode.EMPTY_NODE;var jsonObj_1=json;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(jsonObj_1,function(key,childData){if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(jsonObj_1,key)){if(key.substring(0,1)!=='.'){// ignore metadata nodes.
var childNode=nodeFromJSON$1(childData);if(childNode.isLeafNode()||!childNode.isEmpty())node_1=node_1.updateImmediateChild(key,childNode);}}});return node_1.updatePriority(nodeFromJSON$1(priority));}}setNodeFromJSON(nodeFromJSON$1);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @constructor
 * @extends {Index}
 * @private
 */var ValueIndex=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(ValueIndex,_super);function ValueIndex(){return _super!==null&&_super.apply(this,arguments)||this;}/**
     * @inheritDoc
     */ValueIndex.prototype.compare=function(a,b){var indexCmp=a.node.compareTo(b.node);if(indexCmp===0){return nameCompare(a.name,b.name);}else{return indexCmp;}};/**
     * @inheritDoc
     */ValueIndex.prototype.isDefinedOn=function(node){return true;};/**
     * @inheritDoc
     */ValueIndex.prototype.indexedValueChanged=function(oldNode,newNode){return!oldNode.equals(newNode);};/**
     * @inheritDoc
     */ValueIndex.prototype.minPost=function(){return NamedNode.MIN;};/**
     * @inheritDoc
     */ValueIndex.prototype.maxPost=function(){return NamedNode.MAX;};/**
     * @param {*} indexValue
     * @param {string} name
     * @return {!NamedNode}
     */ValueIndex.prototype.makePost=function(indexValue,name){var valueNode=nodeFromJSON$1(indexValue);return new NamedNode(name,valueNode);};/**
     * @return {!string} String representation for inclusion in a query spec
     */ValueIndex.prototype.toString=function(){return'.value';};return ValueIndex;}(Index);var VALUE_INDEX=new ValueIndex();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @param {!Path} indexPath
 * @constructor
 * @extends {Index}
 */var PathIndex=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(PathIndex,_super);function PathIndex(indexPath_){var _this=_super.call(this)||this;_this.indexPath_=indexPath_;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!indexPath_.isEmpty()&&indexPath_.getFront()!=='.priority',"Can't create PathIndex with empty path or .priority key");return _this;}/**
     * @param {!Node} snap
     * @return {!Node}
     * @protected
     */PathIndex.prototype.extractChild=function(snap){return snap.getChild(this.indexPath_);};/**
     * @inheritDoc
     */PathIndex.prototype.isDefinedOn=function(node){return!node.getChild(this.indexPath_).isEmpty();};/**
     * @inheritDoc
     */PathIndex.prototype.compare=function(a,b){var aChild=this.extractChild(a.node);var bChild=this.extractChild(b.node);var indexCmp=aChild.compareTo(bChild);if(indexCmp===0){return nameCompare(a.name,b.name);}else{return indexCmp;}};/**
     * @inheritDoc
     */PathIndex.prototype.makePost=function(indexValue,name){var valueNode=nodeFromJSON$1(indexValue);var node=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,valueNode);return new NamedNode(name,node);};/**
     * @inheritDoc
     */PathIndex.prototype.maxPost=function(){var node=ChildrenNode.EMPTY_NODE.updateChild(this.indexPath_,MAX_NODE$2);return new NamedNode(MAX_NAME,node);};/**
     * @inheritDoc
     */PathIndex.prototype.toString=function(){return this.indexPath_.slice().join('/');};return PathIndex;}(Index);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Class representing a firebase data snapshot.  It wraps a SnapshotNode and
 * surfaces the public methods (val, forEach, etc.) we want to expose.
 */var DataSnapshot=/** @class */function(){/**
     * @param {!Node} node_ A SnapshotNode to wrap.
     * @param {!Reference} ref_ The ref of the location this snapshot came from.
     * @param {!Index} index_ The iteration order for this snapshot
     */function DataSnapshot(node_,ref_,index_){this.node_=node_;this.ref_=ref_;this.index_=index_;}/**
     * Retrieves the snapshot contents as JSON.  Returns null if the snapshot is
     * empty.
     *
     * @return {*} JSON representation of the DataSnapshot contents, or null if empty.
     */DataSnapshot.prototype.val=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.val',0,0,arguments.length);return this.node_.val();};/**
     * Returns the snapshot contents as JSON, including priorities of node.  Suitable for exporting
     * the entire node contents.
     * @return {*} JSON representation of the DataSnapshot contents, or null if empty.
     */DataSnapshot.prototype.exportVal=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.exportVal',0,0,arguments.length);return this.node_.val(true);};// Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
// for end-users
DataSnapshot.prototype.toJSON=function(){// Optional spacer argument is unnecessary because we're depending on recursion rather than stringifying the content
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.toJSON',0,1,arguments.length);return this.exportVal();};/**
     * Returns whether the snapshot contains a non-null value.
     *
     * @return {boolean} Whether the snapshot contains a non-null value, or is empty.
     */DataSnapshot.prototype.exists=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.exists',0,0,arguments.length);return!this.node_.isEmpty();};/**
     * Returns a DataSnapshot of the specified child node's contents.
     *
     * @param {!string} childPathString Path to a child.
     * @return {!DataSnapshot} DataSnapshot for child node.
     */DataSnapshot.prototype.child=function(childPathString){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.child',0,1,arguments.length);// Ensure the childPath is a string (can be a number)
childPathString=String(childPathString);validatePathString('DataSnapshot.child',1,childPathString,false);var childPath=new Path(childPathString);var childRef=this.ref_.child(childPath);return new DataSnapshot(this.node_.getChild(childPath),childRef,PRIORITY_INDEX);};/**
     * Returns whether the snapshot contains a child at the specified path.
     *
     * @param {!string} childPathString Path to a child.
     * @return {boolean} Whether the child exists.
     */DataSnapshot.prototype.hasChild=function(childPathString){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.hasChild',1,1,arguments.length);validatePathString('DataSnapshot.hasChild',1,childPathString,false);var childPath=new Path(childPathString);return!this.node_.getChild(childPath).isEmpty();};/**
     * Returns the priority of the object, or null if no priority was set.
     *
     * @return {string|number|null} The priority.
     */DataSnapshot.prototype.getPriority=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.getPriority',0,0,arguments.length);// typecast here because we never return deferred values or internal priorities (MAX_PRIORITY)
return this.node_.getPriority().val();};/**
     * Iterates through child nodes and calls the specified action for each one.
     *
     * @param {function(!DataSnapshot)} action Callback function to be called
     * for each child.
     * @return {boolean} True if forEach was canceled by action returning true for
     * one of the child nodes.
     */DataSnapshot.prototype.forEach=function(action){var _this=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.forEach',1,1,arguments.length);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('DataSnapshot.forEach',1,action,false);if(this.node_.isLeafNode())return false;var childrenNode=this.node_;// Sanitize the return value to a boolean. ChildrenNode.forEachChild has a weird return type...
return!!childrenNode.forEachChild(this.index_,function(key,node){return action(new DataSnapshot(node,_this.ref_.child(key),PRIORITY_INDEX));});};/**
     * Returns whether this DataSnapshot has children.
     * @return {boolean} True if the DataSnapshot contains 1 or more child nodes.
     */DataSnapshot.prototype.hasChildren=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.hasChildren',0,0,arguments.length);if(this.node_.isLeafNode())return false;else return!this.node_.isEmpty();};Object.defineProperty(DataSnapshot.prototype,"key",{get:function get(){return this.ref_.getKey();},enumerable:true,configurable:true});/**
     * Returns the number of children for this DataSnapshot.
     * @return {number} The number of children that this DataSnapshot contains.
     */DataSnapshot.prototype.numChildren=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.numChildren',0,0,arguments.length);return this.node_.numChildren();};/**
     * @return {Reference} The Firebase reference for the location this snapshot's data came from.
     */DataSnapshot.prototype.getRef=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('DataSnapshot.ref',0,0,arguments.length);return this.ref_;};Object.defineProperty(DataSnapshot.prototype,"ref",{get:function get(){return this.getRef();},enumerable:true,configurable:true});return DataSnapshot;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Encapsulates the data needed to raise an event
 * @implements {Event}
 */var DataEvent=/** @class */function(){/**
     * @param {!string} eventType One of: value, child_added, child_changed, child_moved, child_removed
     * @param {!EventRegistration} eventRegistration The function to call to with the event data. User provided
     * @param {!DataSnapshot} snapshot The data backing the event
     * @param {?string=} prevName Optional, the name of the previous child for child_* events.
     */function DataEvent(eventType,eventRegistration,snapshot,prevName){this.eventType=eventType;this.eventRegistration=eventRegistration;this.snapshot=snapshot;this.prevName=prevName;}/**
     * @inheritDoc
     */DataEvent.prototype.getPath=function(){var ref=this.snapshot.getRef();if(this.eventType==='value'){return ref.path;}else{return ref.getParent().path;}};/**
     * @inheritDoc
     */DataEvent.prototype.getEventType=function(){return this.eventType;};/**
     * @inheritDoc
     */DataEvent.prototype.getEventRunner=function(){return this.eventRegistration.getEventRunner(this);};/**
     * @inheritDoc
     */DataEvent.prototype.toString=function(){return this.getPath().toString()+':'+this.eventType+':'+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(this.snapshot.exportVal());};return DataEvent;}();var CancelEvent=/** @class */function(){/**
     * @param {EventRegistration} eventRegistration
     * @param {Error} error
     * @param {!Path} path
     */function CancelEvent(eventRegistration,error,path){this.eventRegistration=eventRegistration;this.error=error;this.path=path;}/**
     * @inheritDoc
     */CancelEvent.prototype.getPath=function(){return this.path;};/**
     * @inheritDoc
     */CancelEvent.prototype.getEventType=function(){return'cancel';};/**
     * @inheritDoc
     */CancelEvent.prototype.getEventRunner=function(){return this.eventRegistration.getEventRunner(this);};/**
     * @inheritDoc
     */CancelEvent.prototype.toString=function(){return this.path.toString()+':cancel';};return CancelEvent;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Represents registration for 'value' events.
 */var ValueEventRegistration=/** @class */function(){/**
     * @param {?function(!DataSnapshot)} callback_
     * @param {?function(Error)} cancelCallback_
     * @param {?Object} context_
     */function ValueEventRegistration(callback_,cancelCallback_,context_){this.callback_=callback_;this.cancelCallback_=cancelCallback_;this.context_=context_;}/**
     * @inheritDoc
     */ValueEventRegistration.prototype.respondsTo=function(eventType){return eventType==='value';};/**
     * @inheritDoc
     */ValueEventRegistration.prototype.createEvent=function(change,query){var index=query.getQueryParams().getIndex();return new DataEvent('value',this,new DataSnapshot(change.snapshotNode,query.getRef(),index));};/**
     * @inheritDoc
     */ValueEventRegistration.prototype.getEventRunner=function(eventData){var ctx=this.context_;if(eventData.getEventType()==='cancel'){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.cancelCallback_,'Raising a cancel event on a listener with no cancel callback');var cancelCB_1=this.cancelCallback_;return function(){// We know that error exists, we checked above that this is a cancel event
cancelCB_1.call(ctx,eventData.error);};}else{var cb_1=this.callback_;return function(){cb_1.call(ctx,eventData.snapshot);};}};/**
     * @inheritDoc
     */ValueEventRegistration.prototype.createCancelEvent=function(error,path){if(this.cancelCallback_){return new CancelEvent(this,error,path);}else{return null;}};/**
     * @inheritDoc
     */ValueEventRegistration.prototype.matches=function(other){if(!(other instanceof ValueEventRegistration)){return false;}else if(!other.callback_||!this.callback_){// If no callback specified, we consider it to match any callback.
return true;}else{return other.callback_===this.callback_&&other.context_===this.context_;}};/**
     * @inheritDoc
     */ValueEventRegistration.prototype.hasAnyCallback=function(){return this.callback_!==null;};return ValueEventRegistration;}();/**
 * Represents the registration of 1 or more child_xxx events.
 *
 * Currently, it is always exactly 1 child_xxx event, but the idea is we might let you
 * register a group of callbacks together in the future.
 *
 * @constructor
 * @implements {EventRegistration}
 */var ChildEventRegistration=/** @class */function(){/**
     * @param {?Object.<string, function(!DataSnapshot, ?string=)>} callbacks_
     * @param {?function(Error)} cancelCallback_
     * @param {Object=} context_
     */function ChildEventRegistration(callbacks_,cancelCallback_,context_){this.callbacks_=callbacks_;this.cancelCallback_=cancelCallback_;this.context_=context_;}/**
     * @inheritDoc
     */ChildEventRegistration.prototype.respondsTo=function(eventType){var eventToCheck=eventType==='children_added'?'child_added':eventType;eventToCheck=eventToCheck==='children_removed'?'child_removed':eventToCheck;return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.callbacks_,eventToCheck);};/**
     * @inheritDoc
     */ChildEventRegistration.prototype.createCancelEvent=function(error,path){if(this.cancelCallback_){return new CancelEvent(this,error,path);}else{return null;}};/**
     * @inheritDoc
     */ChildEventRegistration.prototype.createEvent=function(change,query){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(change.childName!=null,'Child events should have a childName.');var ref=query.getRef().child(/** @type {!string} */change.childName);var index=query.getQueryParams().getIndex();return new DataEvent(change.type,this,new DataSnapshot(change.snapshotNode,ref,index),change.prevName);};/**
     * @inheritDoc
     */ChildEventRegistration.prototype.getEventRunner=function(eventData){var ctx=this.context_;if(eventData.getEventType()==='cancel'){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.cancelCallback_,'Raising a cancel event on a listener with no cancel callback');var cancelCB_2=this.cancelCallback_;return function(){// We know that error exists, we checked above that this is a cancel event
cancelCB_2.call(ctx,eventData.error);};}else{var cb_2=this.callbacks_[eventData.eventType];return function(){cb_2.call(ctx,eventData.snapshot,eventData.prevName);};}};/**
     * @inheritDoc
     */ChildEventRegistration.prototype.matches=function(other){if(other instanceof ChildEventRegistration){if(!this.callbacks_||!other.callbacks_){return true;}else if(this.context_===other.context_){var otherCount=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["t" /* getCount */])(other.callbacks_);var thisCount=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["t" /* getCount */])(this.callbacks_);if(otherCount===thisCount){// If count is 1, do an exact match on eventType, if either is defined but null, it's a match.
//  If event types don't match, not a match
// If count is not 1, exact match across all
if(otherCount===1){var otherKey/** @type {!string} */=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["s" /* getAnyKey */])(other.callbacks_);var thisKey/** @type {!string} */=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["s" /* getAnyKey */])(this.callbacks_);return thisKey===otherKey&&(!other.callbacks_[otherKey]||!this.callbacks_[thisKey]||other.callbacks_[otherKey]===this.callbacks_[thisKey]);}else{// Exact match on each key.
return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["o" /* every */])(this.callbacks_,function(eventType,cb){return other.callbacks_[eventType]===cb;});}}}}return false;};/**
     * @inheritDoc
     */ChildEventRegistration.prototype.hasAnyCallback=function(){return this.callbacks_!==null;};return ChildEventRegistration;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var __referenceConstructor;/**
 * A Query represents a filter to be applied to a firebase location.  This object purely represents the
 * query expression (and exposes our public API to build the query).  The actual query logic is in ViewBase.js.
 *
 * Since every Firebase reference is a query, Firebase inherits from this object.
 */var Query=/** @class */function(){function Query(repo,path,queryParams_,orderByCalled_){this.repo=repo;this.path=path;this.queryParams_=queryParams_;this.orderByCalled_=orderByCalled_;}Object.defineProperty(Query,"__referenceConstructor",{get:function get(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(__referenceConstructor,'Reference.ts has not been loaded');return __referenceConstructor;},set:function set(val){__referenceConstructor=val;},enumerable:true,configurable:true});/**
     * Validates start/end values for queries.
     * @param {!QueryParams} params
     * @private
     */Query.validateQueryEndpoints_=function(params){var startNode=null;var endNode=null;if(params.hasStart()){startNode=params.getIndexStartValue();}if(params.hasEnd()){endNode=params.getIndexEndValue();}if(params.getIndex()===KEY_INDEX){var tooManyArgsError='Query: When ordering by key, you may only pass one argument to '+'startAt(), endAt(), or equalTo().';var wrongArgTypeError='Query: When ordering by key, the argument passed to startAt(), endAt(),'+'or equalTo() must be a string.';if(params.hasStart()){var startName=params.getIndexStartName();if(startName!=MIN_NAME){throw new Error(tooManyArgsError);}else if(typeof startNode!=='string'){throw new Error(wrongArgTypeError);}}if(params.hasEnd()){var endName=params.getIndexEndName();if(endName!=MAX_NAME){throw new Error(tooManyArgsError);}else if(typeof endNode!=='string'){throw new Error(wrongArgTypeError);}}}else if(params.getIndex()===PRIORITY_INDEX){if(startNode!=null&&!isValidPriority(startNode)||endNode!=null&&!isValidPriority(endNode)){throw new Error('Query: When ordering by priority, the first argument passed to startAt(), '+'endAt(), or equalTo() must be a valid priority value (null, a number, or a string).');}}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(params.getIndex()instanceof PathIndex||params.getIndex()===VALUE_INDEX,'unknown index type.');if(startNode!=null&&typeof startNode==='object'||endNode!=null&&typeof endNode==='object'){throw new Error('Query: First argument passed to startAt(), endAt(), or equalTo() cannot be '+'an object.');}}};/**
     * Validates that limit* has been called with the correct combination of parameters
     * @param {!QueryParams} params
     * @private
     */Query.validateLimit_=function(params){if(params.hasStart()&&params.hasEnd()&&params.hasLimit()&&!params.hasAnchoredLimit()){throw new Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}};/**
     * Validates that no other order by call has been made
     * @param {!string} fnName
     * @private
     */Query.prototype.validateNoPreviousOrderByCall_=function(fnName){if(this.orderByCalled_===true){throw new Error(fnName+": You can't combine multiple orderBy calls.");}};/**
     * @return {!QueryParams}
     */Query.prototype.getQueryParams=function(){return this.queryParams_;};/**
     * @return {!Reference}
     */Query.prototype.getRef=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.ref',0,0,arguments.length);// This is a slight hack. We cannot goog.require('fb.api.Firebase'), since Firebase requires fb.api.Query.
// However, we will always export 'Firebase' to the global namespace, so it's guaranteed to exist by the time this
// method gets called.
return new Query.__referenceConstructor(this.repo,this.path);};/**
     * @param {!string} eventType
     * @param {!function(DataSnapshot, string=)} callback
     * @param {(function(Error)|Object)=} cancelCallbackOrContext
     * @param {Object=} context
     * @return {!function(DataSnapshot, string=)}
     */Query.prototype.on=function(eventType,callback,cancelCallbackOrContext,context){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.on',2,4,arguments.length);validateEventType('Query.on',1,eventType,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Query.on',2,callback,false);var ret=Query.getCancelAndContextArgs_('Query.on',cancelCallbackOrContext,context);if(eventType==='value'){this.onValueEvent(callback,ret.cancel,ret.context);}else{var callbacks={};callbacks[eventType]=callback;this.onChildEvent(callbacks,ret.cancel,ret.context);}return callback;};/**
     * @param {!function(!DataSnapshot)} callback
     * @param {?function(Error)} cancelCallback
     * @param {?Object} context
     * @protected
     */Query.prototype.onValueEvent=function(callback,cancelCallback,context){var container=new ValueEventRegistration(callback,cancelCallback||null,context||null);this.repo.addEventCallbackForQuery(this,container);};/**
     * @param {!Object.<string, !function(!DataSnapshot, ?string)>} callbacks
     * @param {?function(Error)} cancelCallback
     * @param {?Object} context
     * @protected
     */Query.prototype.onChildEvent=function(callbacks,cancelCallback,context){var container=new ChildEventRegistration(callbacks,cancelCallback,context);this.repo.addEventCallbackForQuery(this,container);};/**
     * @param {string=} eventType
     * @param {(function(!DataSnapshot, ?string=))=} callback
     * @param {Object=} context
     */Query.prototype.off=function(eventType,callback,context){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.off',0,3,arguments.length);validateEventType('Query.off',1,eventType,true);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Query.off',2,callback,true);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["L" /* validateContextObject */])('Query.off',3,context,true);var container=null;var callbacks=null;if(eventType==='value'){var valueCallback=callback||null;container=new ValueEventRegistration(valueCallback,null,context||null);}else if(eventType){if(callback){callbacks={};callbacks[eventType]=callback;}container=new ChildEventRegistration(callbacks,null,context||null);}this.repo.removeEventCallbackForQuery(this,container);};/**
     * Attaches a listener, waits for the first event, and then removes the listener
     * @param {!string} eventType
     * @param {!function(!DataSnapshot, string=)} userCallback
     * @param cancelOrContext
     * @param context
     * @return {!firebase.Promise}
     */Query.prototype.once=function(eventType,userCallback,cancelOrContext,context){var _this=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.once',1,4,arguments.length);validateEventType('Query.once',1,eventType,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Query.once',2,userCallback,true);var ret=Query.getCancelAndContextArgs_('Query.once',cancelOrContext,context);// TODO: Implement this more efficiently (in particular, use 'get' wire protocol for 'value' event)
// TODO: consider actually wiring the callbacks into the promise. We cannot do this without a breaking change
// because the API currently expects callbacks will be called synchronously if the data is cached, but this is
// against the Promise specification.
var firstCall=true;var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();// A dummy error handler in case a user wasn't expecting promises
deferred.promise.catch(function(){});var onceCallback=function onceCallback(snapshot){// NOTE: Even though we unsubscribe, we may get called multiple times if a single action (e.g. set() with JSON)
// triggers multiple events (e.g. child_added or child_changed).
if(firstCall){firstCall=false;_this.off(eventType,onceCallback);if(userCallback){userCallback.bind(ret.context)(snapshot);}deferred.resolve(snapshot);}};this.on(eventType,onceCallback,/*cancel=*/function(err){_this.off(eventType,onceCallback);if(ret.cancel)ret.cancel.bind(ret.context)(err);deferred.reject(err);});return deferred.promise;};/**
     * Set a limit and anchor it to the start of the window.
     * @param {!number} limit
     * @return {!Query}
     */Query.prototype.limitToFirst=function(limit){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.limitToFirst',1,1,arguments.length);if(typeof limit!=='number'||Math.floor(limit)!==limit||limit<=0){throw new Error('Query.limitToFirst: First argument must be a positive integer.');}if(this.queryParams_.hasLimit()){throw new Error('Query.limitToFirst: Limit was already set (by another call to limit, '+'limitToFirst, or limitToLast).');}return new Query(this.repo,this.path,this.queryParams_.limitToFirst(limit),this.orderByCalled_);};/**
     * Set a limit and anchor it to the end of the window.
     * @param {!number} limit
     * @return {!Query}
     */Query.prototype.limitToLast=function(limit){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.limitToLast',1,1,arguments.length);if(typeof limit!=='number'||Math.floor(limit)!==limit||limit<=0){throw new Error('Query.limitToLast: First argument must be a positive integer.');}if(this.queryParams_.hasLimit()){throw new Error('Query.limitToLast: Limit was already set (by another call to limit, '+'limitToFirst, or limitToLast).');}return new Query(this.repo,this.path,this.queryParams_.limitToLast(limit),this.orderByCalled_);};/**
     * Given a child path, return a new query ordered by the specified grandchild path.
     * @param {!string} path
     * @return {!Query}
     */Query.prototype.orderByChild=function(path){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.orderByChild',1,1,arguments.length);if(path==='$key'){throw new Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');}else if(path==='$priority'){throw new Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');}else if(path==='$value'){throw new Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');}validatePathString('Query.orderByChild',1,path,false);this.validateNoPreviousOrderByCall_('Query.orderByChild');var parsedPath=new Path(path);if(parsedPath.isEmpty()){throw new Error('Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.');}var index=new PathIndex(parsedPath);var newParams=this.queryParams_.orderBy(index);Query.validateQueryEndpoints_(newParams);return new Query(this.repo,this.path,newParams,/*orderByCalled=*/true);};/**
     * Return a new query ordered by the KeyIndex
     * @return {!Query}
     */Query.prototype.orderByKey=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.orderByKey',0,0,arguments.length);this.validateNoPreviousOrderByCall_('Query.orderByKey');var newParams=this.queryParams_.orderBy(KEY_INDEX);Query.validateQueryEndpoints_(newParams);return new Query(this.repo,this.path,newParams,/*orderByCalled=*/true);};/**
     * Return a new query ordered by the PriorityIndex
     * @return {!Query}
     */Query.prototype.orderByPriority=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.orderByPriority',0,0,arguments.length);this.validateNoPreviousOrderByCall_('Query.orderByPriority');var newParams=this.queryParams_.orderBy(PRIORITY_INDEX);Query.validateQueryEndpoints_(newParams);return new Query(this.repo,this.path,newParams,/*orderByCalled=*/true);};/**
     * Return a new query ordered by the ValueIndex
     * @return {!Query}
     */Query.prototype.orderByValue=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.orderByValue',0,0,arguments.length);this.validateNoPreviousOrderByCall_('Query.orderByValue');var newParams=this.queryParams_.orderBy(VALUE_INDEX);Query.validateQueryEndpoints_(newParams);return new Query(this.repo,this.path,newParams,/*orderByCalled=*/true);};/**
     * @param {number|string|boolean|null} value
     * @param {?string=} name
     * @return {!Query}
     */Query.prototype.startAt=function(value,name){if(value===void 0){value=null;}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.startAt',0,2,arguments.length);validateFirebaseDataArg('Query.startAt',1,value,this.path,true);validateKey('Query.startAt',2,name,true);var newParams=this.queryParams_.startAt(value,name);Query.validateLimit_(newParams);Query.validateQueryEndpoints_(newParams);if(this.queryParams_.hasStart()){throw new Error('Query.startAt: Starting point was already set (by another call to startAt '+'or equalTo).');}// Calling with no params tells us to start at the beginning.
if(value===undefined){value=null;name=null;}return new Query(this.repo,this.path,newParams,this.orderByCalled_);};/**
     * @param {number|string|boolean|null} value
     * @param {?string=} name
     * @return {!Query}
     */Query.prototype.endAt=function(value,name){if(value===void 0){value=null;}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.endAt',0,2,arguments.length);validateFirebaseDataArg('Query.endAt',1,value,this.path,true);validateKey('Query.endAt',2,name,true);var newParams=this.queryParams_.endAt(value,name);Query.validateLimit_(newParams);Query.validateQueryEndpoints_(newParams);if(this.queryParams_.hasEnd()){throw new Error('Query.endAt: Ending point was already set (by another call to endAt or '+'equalTo).');}return new Query(this.repo,this.path,newParams,this.orderByCalled_);};/**
     * Load the selection of children with exactly the specified value, and, optionally,
     * the specified name.
     * @param {number|string|boolean|null} value
     * @param {string=} name
     * @return {!Query}
     */Query.prototype.equalTo=function(value,name){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.equalTo',1,2,arguments.length);validateFirebaseDataArg('Query.equalTo',1,value,this.path,false);validateKey('Query.equalTo',2,name,true);if(this.queryParams_.hasStart()){throw new Error('Query.equalTo: Starting point was already set (by another call to startAt or '+'equalTo).');}if(this.queryParams_.hasEnd()){throw new Error('Query.equalTo: Ending point was already set (by another call to endAt or '+'equalTo).');}return this.startAt(value,name).endAt(value,name);};/**
     * @return {!string} URL for this location.
     */Query.prototype.toString=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.toString',0,0,arguments.length);return this.repo.toString()+this.path.toUrlEncodedString();};// Do not create public documentation. This is intended to make JSON serialization work but is otherwise unnecessary
// for end-users.
Query.prototype.toJSON=function(){// An optional spacer argument is unnecessary for a string.
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.toJSON',0,1,arguments.length);return this.toString();};/**
     * An object representation of the query parameters used by this Query.
     * @return {!Object}
     */Query.prototype.queryObject=function(){return this.queryParams_.getQueryObject();};/**
     * @return {!string}
     */Query.prototype.queryIdentifier=function(){var obj=this.queryObject();var id=ObjectToUniqueKey(obj);return id==='{}'?'default':id;};/**
     * Return true if this query and the provided query are equivalent; otherwise, return false.
     * @param {Query} other
     * @return {boolean}
     */Query.prototype.isEqual=function(other){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Query.isEqual',1,1,arguments.length);if(!(other instanceof Query)){var error$$1='Query.isEqual failed: First argument must be an instance of firebase.database.Query.';throw new Error(error$$1);}var sameRepo=this.repo===other.repo;var samePath=this.path.equals(other.path);var sameQueryIdentifier=this.queryIdentifier()===other.queryIdentifier();return sameRepo&&samePath&&sameQueryIdentifier;};/**
     * Helper used by .on and .once to extract the context and or cancel arguments.
     * @param {!string} fnName The function name (on or once)
     * @param {(function(Error)|Object)=} cancelOrContext
     * @param {Object=} context
     * @return {{cancel: ?function(Error), context: ?Object}}
     * @private
     */Query.getCancelAndContextArgs_=function(fnName,cancelOrContext,context){var ret={cancel:null,context:null};if(cancelOrContext&&context){ret.cancel=cancelOrContext;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])(fnName,3,ret.cancel,true);ret.context=context;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["L" /* validateContextObject */])(fnName,4,ret.context,true);}else if(cancelOrContext){// we have either a cancel callback or a context.
if(typeof cancelOrContext==='object'&&cancelOrContext!==null){// it's a context!
ret.context=cancelOrContext;}else if(typeof cancelOrContext==='function'){ret.cancel=cancelOrContext;}else{throw new Error(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["n" /* errorPrefix */])(fnName,3,true)+' must either be a cancel callback or a context object.');}}return ret;};Object.defineProperty(Query.prototype,"ref",{get:function get(){return this.getRef();},enumerable:true,configurable:true});return Query;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Implements a set with a count of elements.
 *
 * @template K, V
 */var CountedSet=/** @class */function(){function CountedSet(){this.set={};}/**
     * @param {!K} item
     * @param {V} val
     */CountedSet.prototype.add=function(item,val){this.set[item]=val!==null?val:true;};/**
     * @param {!K} key
     * @return {boolean}
     */CountedSet.prototype.contains=function(key){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.set,key);};/**
     * @param {!K} item
     * @return {V}
     */CountedSet.prototype.get=function(item){return this.contains(item)?this.set[item]:undefined;};/**
     * @param {!K} item
     */CountedSet.prototype.remove=function(item){delete this.set[item];};/**
     * Deletes everything in the set
     */CountedSet.prototype.clear=function(){this.set={};};/**
     * True if there's nothing in the set
     * @return {boolean}
     */CountedSet.prototype.isEmpty=function(){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["w" /* isEmpty */])(this.set);};/**
     * @return {number} The number of items in the set
     */CountedSet.prototype.count=function(){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["t" /* getCount */])(this.set);};/**
     * Run a function on each k,v pair in the set
     * @param {function(K, V)} fn
     */CountedSet.prototype.each=function(fn){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.set,function(k,v){return fn(k,v);});};/**
     * Mostly for debugging
     * @return {Array.<K>} The keys present in this CountedSet
     */CountedSet.prototype.keys=function(){var keys=[];Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.set,function(k){keys.push(k);});return keys;};return CountedSet;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Helper class to store a sparse set of snapshots.
 *
 * @constructor
 */var SparseSnapshotTree=/** @class */function(){function SparseSnapshotTree(){/**
         * @private
         * @type {Node}
         */this.value_=null;/**
         * @private
         * @type {CountedSet}
         */this.children_=null;}/**
     * Gets the node stored at the given path if one exists.
     *
     * @param {!Path} path Path to look up snapshot for.
     * @return {?Node} The retrieved node, or null.
     */SparseSnapshotTree.prototype.find=function(path){if(this.value_!=null){return this.value_.getChild(path);}else if(!path.isEmpty()&&this.children_!=null){var childKey=path.getFront();path=path.popFront();if(this.children_.contains(childKey)){var childTree=this.children_.get(childKey);return childTree.find(path);}else{return null;}}else{return null;}};/**
     * Stores the given node at the specified path. If there is already a node
     * at a shallower path, it merges the new data into that snapshot node.
     *
     * @param {!Path} path Path to look up snapshot for.
     * @param {!Node} data The new data, or null.
     */SparseSnapshotTree.prototype.remember=function(path,data){if(path.isEmpty()){this.value_=data;this.children_=null;}else if(this.value_!==null){this.value_=this.value_.updateChild(path,data);}else{if(this.children_==null){this.children_=new CountedSet();}var childKey=path.getFront();if(!this.children_.contains(childKey)){this.children_.add(childKey,new SparseSnapshotTree());}var child=this.children_.get(childKey);path=path.popFront();child.remember(path,data);}};/**
     * Purge the data at path from the cache.
     *
     * @param {!Path} path Path to look up snapshot for.
     * @return {boolean} True if this node should now be removed.
     */SparseSnapshotTree.prototype.forget=function(path){if(path.isEmpty()){this.value_=null;this.children_=null;return true;}else{if(this.value_!==null){if(this.value_.isLeafNode()){// We're trying to forget a node that doesn't exist
return false;}else{var value=this.value_;this.value_=null;var self_1=this;value.forEachChild(PRIORITY_INDEX,function(key,tree){self_1.remember(new Path(key),tree);});return this.forget(path);}}else if(this.children_!==null){var childKey=path.getFront();path=path.popFront();if(this.children_.contains(childKey)){var safeToRemove=this.children_.get(childKey).forget(path);if(safeToRemove){this.children_.remove(childKey);}}if(this.children_.isEmpty()){this.children_=null;return true;}else{return false;}}else{return true;}}};/**
     * Recursively iterates through all of the stored tree and calls the
     * callback on each one.
     *
     * @param {!Path} prefixPath Path to look up node for.
     * @param {!Function} func The function to invoke for each tree.
     */SparseSnapshotTree.prototype.forEachTree=function(prefixPath,func){if(this.value_!==null){func(prefixPath,this.value_);}else{this.forEachChild(function(key,tree){var path=new Path(prefixPath.toString()+'/'+key);tree.forEachTree(path,func);});}};/**
     * Iterates through each immediate child and triggers the callback.
     *
     * @param {!Function} func The function to invoke for each child.
     */SparseSnapshotTree.prototype.forEachChild=function(func){if(this.children_!==null){this.children_.each(function(key,tree){func(key,tree);});}};return SparseSnapshotTree;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Generate placeholders for deferred values.
 * @param {?Object} values
 * @return {!Object}
 */var generateWithValues=function generateWithValues(values){values=values||{};values['timestamp']=values['timestamp']||new Date().getTime();return values;};/**
 * Value to use when firing local events. When writing server values, fire
 * local events with an approximate value, otherwise return value as-is.
 * @param {(Object|string|number|boolean)} value
 * @param {!Object} serverValues
 * @return {!(string|number|boolean)}
 */var resolveDeferredValue=function resolveDeferredValue(value,serverValues){if(!value||typeof value!=='object'){return value;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])('.sv'in value,'Unexpected leaf node or priority contents');return serverValues[value['.sv']];}};/**
 * Recursively replace all deferred values and priorities in the tree with the
 * specified generated replacement values.
 * @param {!SparseSnapshotTree} tree
 * @param {!Object} serverValues
 * @return {!SparseSnapshotTree}
 */var resolveDeferredValueTree=function resolveDeferredValueTree(tree,serverValues){var resolvedTree=new SparseSnapshotTree();tree.forEachTree(new Path(''),function(path,node){resolvedTree.remember(path,resolveDeferredValueSnapshot(node,serverValues));});return resolvedTree;};/**
 * Recursively replace all deferred values and priorities in the node with the
 * specified generated replacement values.  If there are no server values in the node,
 * it'll be returned as-is.
 * @param {!Node} node
 * @param {!Object} serverValues
 * @return {!Node}
 */var resolveDeferredValueSnapshot=function resolveDeferredValueSnapshot(node,serverValues){var rawPri=node.getPriority().val();var priority=resolveDeferredValue(rawPri,serverValues);var newNode;if(node.isLeafNode()){var leafNode=node;var value=resolveDeferredValue(leafNode.getValue(),serverValues);if(value!==leafNode.getValue()||priority!==leafNode.getPriority().val()){return new LeafNode(value,nodeFromJSON$1(priority));}else{return node;}}else{var childrenNode=node;newNode=childrenNode;if(priority!==childrenNode.getPriority().val()){newNode=newNode.updatePriority(new LeafNode(priority));}childrenNode.forEachChild(PRIORITY_INDEX,function(childName,childNode){var newChildNode=resolveDeferredValueSnapshot(childNode,serverValues);if(newChildNode!==childNode){newNode=newNode.updateImmediateChild(childName,newChildNode);}});return newNode;}};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 *
 * @enum
 */var OperationType;(function(OperationType){OperationType[OperationType["OVERWRITE"]=0]="OVERWRITE";OperationType[OperationType["MERGE"]=1]="MERGE";OperationType[OperationType["ACK_USER_WRITE"]=2]="ACK_USER_WRITE";OperationType[OperationType["LISTEN_COMPLETE"]=3]="LISTEN_COMPLETE";})(OperationType||(OperationType={}));/**
 * @param {boolean} fromUser
 * @param {boolean} fromServer
 * @param {?string} queryId
 * @param {boolean} tagged
 * @constructor
 */var OperationSource=/** @class */function(){function OperationSource(fromUser,fromServer,queryId,tagged){this.fromUser=fromUser;this.fromServer=fromServer;this.queryId=queryId;this.tagged=tagged;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!tagged||fromServer,'Tagged queries must be from server.');}/**
     * @const
     * @type {!OperationSource}
     */OperationSource.User=new OperationSource(/*fromUser=*/true,false,null,/*tagged=*/false);/**
     * @const
     * @type {!OperationSource}
     */OperationSource.Server=new OperationSource(false,/*fromServer=*/true,null,/*tagged=*/false);/**
     * @param {string} queryId
     * @return {!OperationSource}
     */OperationSource.forServerTaggedQuery=function(queryId){return new OperationSource(false,/*fromServer=*/true,queryId,/*tagged=*/true);};return OperationSource;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var AckUserWrite=/** @class */function(){/**
     *
     * @param {!Path} path
     * @param {!ImmutableTree<!boolean>} affectedTree A tree containing true for each affected path. Affected paths can't overlap.
     * @param {!boolean} revert
     */function AckUserWrite(/**@inheritDoc */path,/**@inheritDoc */affectedTree,/**@inheritDoc */revert){this.path=path;this.affectedTree=affectedTree;this.revert=revert;/** @inheritDoc */this.type=OperationType.ACK_USER_WRITE;/** @inheritDoc */this.source=OperationSource.User;}/**
     * @inheritDoc
     */AckUserWrite.prototype.operationForChild=function(childName){if(!this.path.isEmpty()){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.path.getFront()===childName,'operationForChild called for unrelated child.');return new AckUserWrite(this.path.popFront(),this.affectedTree,this.revert);}else if(this.affectedTree.value!=null){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.affectedTree.children.isEmpty(),'affectedTree should not have overlapping affected paths.');// All child locations are affected as well; just return same operation.
return this;}else{var childTree=this.affectedTree.subtree(new Path(childName));return new AckUserWrite(Path.Empty,childTree,this.revert);}};return AckUserWrite;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var emptyChildrenSingleton;/**
 * Singleton empty children collection.
 *
 * @const
 * @type {!SortedMap.<string, !ImmutableTree.<?>>}
 */var EmptyChildren=function EmptyChildren(){if(!emptyChildrenSingleton){emptyChildrenSingleton=new SortedMap(stringCompare);}return emptyChildrenSingleton;};/**
 * A tree with immutable elements.
 */var ImmutableTree=/** @class */function(){/**
     * @template T
     * @param {?T} value
     * @param {SortedMap.<string, !ImmutableTree.<T>>=} children
     */function ImmutableTree(value,children){if(children===void 0){children=EmptyChildren();}this.value=value;this.children=children;}/**
     * @template T
     * @param {!Object.<string, !T>} obj
     * @return {!ImmutableTree.<!T>}
     */ImmutableTree.fromObject=function(obj){var tree=ImmutableTree.Empty;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(obj,function(childPath,childSnap){tree=tree.set(new Path(childPath),childSnap);});return tree;};/**
     * True if the value is empty and there are no children
     * @return {boolean}
     */ImmutableTree.prototype.isEmpty=function(){return this.value===null&&this.children.isEmpty();};/**
     * Given a path and predicate, return the first node and the path to that node
     * where the predicate returns true.
     *
     * TODO Do a perf test -- If we're creating a bunch of {path: value:} objects
     * on the way back out, it may be better to pass down a pathSoFar obj.
     *
     * @param {!Path} relativePath The remainder of the path
     * @param {function(T):boolean} predicate The predicate to satisfy to return a
     *   node
     * @return {?{path:!Path, value:!T}}
     */ImmutableTree.prototype.findRootMostMatchingPathAndValue=function(relativePath,predicate){if(this.value!=null&&predicate(this.value)){return{path:Path.Empty,value:this.value};}else{if(relativePath.isEmpty()){return null;}else{var front=relativePath.getFront();var child=this.children.get(front);if(child!==null){var childExistingPathAndValue=child.findRootMostMatchingPathAndValue(relativePath.popFront(),predicate);if(childExistingPathAndValue!=null){var fullPath=new Path(front).child(childExistingPathAndValue.path);return{path:fullPath,value:childExistingPathAndValue.value};}else{return null;}}else{return null;}}}};/**
     * Find, if it exists, the shortest subpath of the given path that points a defined
     * value in the tree
     * @param {!Path} relativePath
     * @return {?{path: !Path, value: !T}}
     */ImmutableTree.prototype.findRootMostValueAndPath=function(relativePath){return this.findRootMostMatchingPathAndValue(relativePath,function(){return true;});};/**
     * @param {!Path} relativePath
     * @return {!ImmutableTree.<T>} The subtree at the given path
     */ImmutableTree.prototype.subtree=function(relativePath){if(relativePath.isEmpty()){return this;}else{var front=relativePath.getFront();var childTree=this.children.get(front);if(childTree!==null){return childTree.subtree(relativePath.popFront());}else{return ImmutableTree.Empty;}}};/**
     * Sets a value at the specified path.
     *
     * @param {!Path} relativePath Path to set value at.
     * @param {?T} toSet Value to set.
     * @return {!ImmutableTree.<T>} Resulting tree.
     */ImmutableTree.prototype.set=function(relativePath,toSet){if(relativePath.isEmpty()){return new ImmutableTree(toSet,this.children);}else{var front=relativePath.getFront();var child=this.children.get(front)||ImmutableTree.Empty;var newChild=child.set(relativePath.popFront(),toSet);var newChildren=this.children.insert(front,newChild);return new ImmutableTree(this.value,newChildren);}};/**
     * Removes the value at the specified path.
     *
     * @param {!Path} relativePath Path to value to remove.
     * @return {!ImmutableTree.<T>} Resulting tree.
     */ImmutableTree.prototype.remove=function(relativePath){if(relativePath.isEmpty()){if(this.children.isEmpty()){return ImmutableTree.Empty;}else{return new ImmutableTree(null,this.children);}}else{var front=relativePath.getFront();var child=this.children.get(front);if(child){var newChild=child.remove(relativePath.popFront());var newChildren=void 0;if(newChild.isEmpty()){newChildren=this.children.remove(front);}else{newChildren=this.children.insert(front,newChild);}if(this.value===null&&newChildren.isEmpty()){return ImmutableTree.Empty;}else{return new ImmutableTree(this.value,newChildren);}}else{return this;}}};/**
     * Gets a value from the tree.
     *
     * @param {!Path} relativePath Path to get value for.
     * @return {?T} Value at path, or null.
     */ImmutableTree.prototype.get=function(relativePath){if(relativePath.isEmpty()){return this.value;}else{var front=relativePath.getFront();var child=this.children.get(front);if(child){return child.get(relativePath.popFront());}else{return null;}}};/**
     * Replace the subtree at the specified path with the given new tree.
     *
     * @param {!Path} relativePath Path to replace subtree for.
     * @param {!ImmutableTree} newTree New tree.
     * @return {!ImmutableTree} Resulting tree.
     */ImmutableTree.prototype.setTree=function(relativePath,newTree){if(relativePath.isEmpty()){return newTree;}else{var front=relativePath.getFront();var child=this.children.get(front)||ImmutableTree.Empty;var newChild=child.setTree(relativePath.popFront(),newTree);var newChildren=void 0;if(newChild.isEmpty()){newChildren=this.children.remove(front);}else{newChildren=this.children.insert(front,newChild);}return new ImmutableTree(this.value,newChildren);}};/**
     * Performs a depth first fold on this tree. Transforms a tree into a single
     * value, given a function that operates on the path to a node, an optional
     * current value, and a map of child names to folded subtrees
     * @template V
     * @param {function(Path, ?T, Object.<string, V>):V} fn
     * @return {V}
     */ImmutableTree.prototype.fold=function(fn){return this.fold_(Path.Empty,fn);};/**
     * Recursive helper for public-facing fold() method
     * @template V
     * @param {!Path} pathSoFar
     * @param {function(Path, ?T, Object.<string, V>):V} fn
     * @return {V}
     * @private
     */ImmutableTree.prototype.fold_=function(pathSoFar,fn){var accum={};this.children.inorderTraversal(function(childKey,childTree){accum[childKey]=childTree.fold_(pathSoFar.child(childKey),fn);});return fn(pathSoFar,this.value,accum);};/**
     * Find the first matching value on the given path. Return the result of applying f to it.
     * @template V
     * @param {!Path} path
     * @param {!function(!Path, !T):?V} f
     * @return {?V}
     */ImmutableTree.prototype.findOnPath=function(path,f){return this.findOnPath_(path,Path.Empty,f);};ImmutableTree.prototype.findOnPath_=function(pathToFollow,pathSoFar,f){var result=this.value?f(pathSoFar,this.value):false;if(result){return result;}else{if(pathToFollow.isEmpty()){return null;}else{var front=pathToFollow.getFront();var nextChild=this.children.get(front);if(nextChild){return nextChild.findOnPath_(pathToFollow.popFront(),pathSoFar.child(front),f);}else{return null;}}}};/**
     *
     * @param {!Path} path
     * @param {!function(!Path, !T)} f
     * @returns {!ImmutableTree.<T>}
     */ImmutableTree.prototype.foreachOnPath=function(path,f){return this.foreachOnPath_(path,Path.Empty,f);};ImmutableTree.prototype.foreachOnPath_=function(pathToFollow,currentRelativePath,f){if(pathToFollow.isEmpty()){return this;}else{if(this.value){f(currentRelativePath,this.value);}var front=pathToFollow.getFront();var nextChild=this.children.get(front);if(nextChild){return nextChild.foreachOnPath_(pathToFollow.popFront(),currentRelativePath.child(front),f);}else{return ImmutableTree.Empty;}}};/**
     * Calls the given function for each node in the tree that has a value.
     *
     * @param {function(!Path, !T)} f A function to be called with
     *   the path from the root of the tree to a node, and the value at that node.
     *   Called in depth-first order.
     */ImmutableTree.prototype.foreach=function(f){this.foreach_(Path.Empty,f);};ImmutableTree.prototype.foreach_=function(currentRelativePath,f){this.children.inorderTraversal(function(childName,childTree){childTree.foreach_(currentRelativePath.child(childName),f);});if(this.value){f(currentRelativePath,this.value);}};/**
     *
     * @param {function(string, !T)} f
     */ImmutableTree.prototype.foreachChild=function(f){this.children.inorderTraversal(function(childName,childTree){if(childTree.value){f(childName,childTree.value);}});};ImmutableTree.Empty=new ImmutableTree(null);return ImmutableTree;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @param {!OperationSource} source
 * @param {!Path} path
 * @constructor
 * @implements {Operation}
 */var ListenComplete=/** @class */function(){function ListenComplete(source,path){this.source=source;this.path=path;/** @inheritDoc */this.type=OperationType.LISTEN_COMPLETE;}ListenComplete.prototype.operationForChild=function(childName){if(this.path.isEmpty()){return new ListenComplete(this.source,Path.Empty);}else{return new ListenComplete(this.source,this.path.popFront());}};return ListenComplete;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @param {!OperationSource} source
 * @param {!Path} path
 * @param {!Node} snap
 * @constructor
 * @implements {Operation}
 */var Overwrite=/** @class */function(){function Overwrite(source,path,snap){this.source=source;this.path=path;this.snap=snap;/** @inheritDoc */this.type=OperationType.OVERWRITE;}Overwrite.prototype.operationForChild=function(childName){if(this.path.isEmpty()){return new Overwrite(this.source,Path.Empty,this.snap.getImmediateChild(childName));}else{return new Overwrite(this.source,this.path.popFront(),this.snap);}};return Overwrite;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @param {!OperationSource} source
 * @param {!Path} path
 * @param {!ImmutableTree.<!Node>} children
 * @constructor
 * @implements {Operation}
 */var Merge=/** @class */function(){function Merge(/**@inheritDoc */source,/**@inheritDoc */path,/**@inheritDoc */children){this.source=source;this.path=path;this.children=children;/** @inheritDoc */this.type=OperationType.MERGE;}/**
     * @inheritDoc
     */Merge.prototype.operationForChild=function(childName){if(this.path.isEmpty()){var childTree=this.children.subtree(new Path(childName));if(childTree.isEmpty()){// This child is unaffected
return null;}else if(childTree.value){// We have a snapshot for the child in question.  This becomes an overwrite of the child.
return new Overwrite(this.source,Path.Empty,childTree.value);}else{// This is a merge at a deeper level
return new Merge(this.source,Path.Empty,childTree);}}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.path.getFront()===childName,"Can't get a merge for a child not on the path of the operation");return new Merge(this.source,this.path.popFront(),this.children);}};/**
     * @inheritDoc
     */Merge.prototype.toString=function(){return'Operation('+this.path+': '+this.source.toString()+' merge: '+this.children.toString()+')';};return Merge;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * A cache node only stores complete children. Additionally it holds a flag whether the node can be considered fully
 * initialized in the sense that we know at one point in time this represented a valid state of the world, e.g.
 * initialized with data from the server, or a complete overwrite by the client. The filtered flag also tracks
 * whether a node potentially had children removed due to a filter.
 */var CacheNode=/** @class */function(){/**
     * @param {!Node} node_
     * @param {boolean} fullyInitialized_
     * @param {boolean} filtered_
     */function CacheNode(node_,fullyInitialized_,filtered_){this.node_=node_;this.fullyInitialized_=fullyInitialized_;this.filtered_=filtered_;}/**
     * Returns whether this node was fully initialized with either server data or a complete overwrite by the client
     * @return {boolean}
     */CacheNode.prototype.isFullyInitialized=function(){return this.fullyInitialized_;};/**
     * Returns whether this node is potentially missing children due to a filter applied to the node
     * @return {boolean}
     */CacheNode.prototype.isFiltered=function(){return this.filtered_;};/**
     * @param {!Path} path
     * @return {boolean}
     */CacheNode.prototype.isCompleteForPath=function(path){if(path.isEmpty()){return this.isFullyInitialized()&&!this.filtered_;}var childKey=path.getFront();return this.isCompleteForChild(childKey);};/**
     * @param {!string} key
     * @return {boolean}
     */CacheNode.prototype.isCompleteForChild=function(key){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(key);};/**
     * @return {!Node}
     */CacheNode.prototype.getNode=function(){return this.node_;};return CacheNode;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Stores the data we have cached for a view.
 *
 * serverSnap is the cached server data, eventSnap is the cached event data (server data plus any local writes).
 *
 * @constructor
 */var ViewCache=/** @class */function(){/**
     *
     * @param {!CacheNode} eventCache_
     * @param {!CacheNode} serverCache_
     */function ViewCache(eventCache_,serverCache_){this.eventCache_=eventCache_;this.serverCache_=serverCache_;}/**
     * @param {!Node} eventSnap
     * @param {boolean} complete
     * @param {boolean} filtered
     * @return {!ViewCache}
     */ViewCache.prototype.updateEventSnap=function(eventSnap,complete,filtered){return new ViewCache(new CacheNode(eventSnap,complete,filtered),this.serverCache_);};/**
     * @param {!Node} serverSnap
     * @param {boolean} complete
     * @param {boolean} filtered
     * @return {!ViewCache}
     */ViewCache.prototype.updateServerSnap=function(serverSnap,complete,filtered){return new ViewCache(this.eventCache_,new CacheNode(serverSnap,complete,filtered));};/**
     * @return {!CacheNode}
     */ViewCache.prototype.getEventCache=function(){return this.eventCache_;};/**
     * @return {?Node}
     */ViewCache.prototype.getCompleteEventSnap=function(){return this.eventCache_.isFullyInitialized()?this.eventCache_.getNode():null;};/**
     * @return {!CacheNode}
     */ViewCache.prototype.getServerCache=function(){return this.serverCache_;};/**
     * @return {?Node}
     */ViewCache.prototype.getCompleteServerSnap=function(){return this.serverCache_.isFullyInitialized()?this.serverCache_.getNode():null;};/**
     * @const
     * @type {ViewCache}
     */ViewCache.Empty=new ViewCache(new CacheNode(ChildrenNode.EMPTY_NODE,/*fullyInitialized=*/false,/*filtered=*/false),new CacheNode(ChildrenNode.EMPTY_NODE,/*fullyInitialized=*/false,/*filtered=*/false));return ViewCache;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @constructor
 * @struct
 * @param {!string} type The event type
 * @param {!Node} snapshotNode The data
 * @param {string=} childName The name for this child, if it's a child event
 * @param {Node=} oldSnap Used for intermediate processing of child changed events
 * @param {string=} prevName The name for the previous child, if applicable
 */var Change=/** @class */function(){function Change(type,snapshotNode,childName,oldSnap,prevName){this.type=type;this.snapshotNode=snapshotNode;this.childName=childName;this.oldSnap=oldSnap;this.prevName=prevName;}/**
     * @param {!Node} snapshot
     * @return {!Change}
     */Change.valueChange=function(snapshot){return new Change(Change.VALUE,snapshot);};/**
     * @param {string} childKey
     * @param {!Node} snapshot
     * @return {!Change}
     */Change.childAddedChange=function(childKey,snapshot){return new Change(Change.CHILD_ADDED,snapshot,childKey);};/**
     * @param {string} childKey
     * @param {!Node} snapshot
     * @return {!Change}
     */Change.childRemovedChange=function(childKey,snapshot){return new Change(Change.CHILD_REMOVED,snapshot,childKey);};/**
     * @param {string} childKey
     * @param {!Node} newSnapshot
     * @param {!Node} oldSnapshot
     * @return {!Change}
     */Change.childChangedChange=function(childKey,newSnapshot,oldSnapshot){return new Change(Change.CHILD_CHANGED,newSnapshot,childKey,oldSnapshot);};/**
     * @param {string} childKey
     * @param {!Node} snapshot
     * @return {!Change}
     */Change.childMovedChange=function(childKey,snapshot){return new Change(Change.CHILD_MOVED,snapshot,childKey);};//event types
/** Event type for a child added */Change.CHILD_ADDED='child_added';/** Event type for a child removed */Change.CHILD_REMOVED='child_removed';/** Event type for a child changed */Change.CHILD_CHANGED='child_changed';/** Event type for a child moved */Change.CHILD_MOVED='child_moved';/** Event type for a value change */Change.VALUE='value';return Change;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Doesn't really filter nodes but applies an index to the node and keeps track of any changes
 *
 * @constructor
 * @implements {NodeFilter}
 * @param {!Index} index
 */var IndexedFilter=/** @class */function(){function IndexedFilter(index_){this.index_=index_;}IndexedFilter.prototype.updateChild=function(snap,key,newChild,affectedPath,source,optChangeAccumulator){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(snap.isIndexed(this.index_),'A node must be indexed if only a child is updated');var oldChild=snap.getImmediateChild(key);// Check if anything actually changed.
if(oldChild.getChild(affectedPath).equals(newChild.getChild(affectedPath))){// There's an edge case where a child can enter or leave the view because affectedPath was set to null.
// In this case, affectedPath will appear null in both the old and new snapshots.  So we need
// to avoid treating these cases as "nothing changed."
if(oldChild.isEmpty()==newChild.isEmpty()){// Nothing changed.
// This assert should be valid, but it's expensive (can dominate perf testing) so don't actually do it.
//assert(oldChild.equals(newChild), 'Old and new snapshots should be equal.');
return snap;}}if(optChangeAccumulator!=null){if(newChild.isEmpty()){if(snap.hasChild(key)){optChangeAccumulator.trackChildChange(Change.childRemovedChange(key,oldChild));}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(snap.isLeafNode(),'A child remove without an old child only makes sense on a leaf node');}}else if(oldChild.isEmpty()){optChangeAccumulator.trackChildChange(Change.childAddedChange(key,newChild));}else{optChangeAccumulator.trackChildChange(Change.childChangedChange(key,newChild,oldChild));}}if(snap.isLeafNode()&&newChild.isEmpty()){return snap;}else{// Make sure the node is indexed
return snap.updateImmediateChild(key,newChild).withIndex(this.index_);}};/**
     * @inheritDoc
     */IndexedFilter.prototype.updateFullNode=function(oldSnap,newSnap,optChangeAccumulator){if(optChangeAccumulator!=null){if(!oldSnap.isLeafNode()){oldSnap.forEachChild(PRIORITY_INDEX,function(key,childNode){if(!newSnap.hasChild(key)){optChangeAccumulator.trackChildChange(Change.childRemovedChange(key,childNode));}});}if(!newSnap.isLeafNode()){newSnap.forEachChild(PRIORITY_INDEX,function(key,childNode){if(oldSnap.hasChild(key)){var oldChild=oldSnap.getImmediateChild(key);if(!oldChild.equals(childNode)){optChangeAccumulator.trackChildChange(Change.childChangedChange(key,childNode,oldChild));}}else{optChangeAccumulator.trackChildChange(Change.childAddedChange(key,childNode));}});}}return newSnap.withIndex(this.index_);};/**
     * @inheritDoc
     */IndexedFilter.prototype.updatePriority=function(oldSnap,newPriority){if(oldSnap.isEmpty()){return ChildrenNode.EMPTY_NODE;}else{return oldSnap.updatePriority(newPriority);}};/**
     * @inheritDoc
     */IndexedFilter.prototype.filtersNodes=function(){return false;};/**
     * @inheritDoc
     */IndexedFilter.prototype.getIndexedFilter=function(){return this;};/**
     * @inheritDoc
     */IndexedFilter.prototype.getIndex=function(){return this.index_;};return IndexedFilter;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @constructor
 */var ChildChangeAccumulator=/** @class */function(){function ChildChangeAccumulator(){this.changeMap_={};}/**
     * @param {!Change} change
     */ChildChangeAccumulator.prototype.trackChildChange=function(change){var type=change.type;var childKey/** @type {!string} */=change.childName;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(type==Change.CHILD_ADDED||type==Change.CHILD_CHANGED||type==Change.CHILD_REMOVED,'Only child changes supported for tracking');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(childKey!=='.priority','Only non-priority child changes can be tracked.');var oldChange=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.changeMap_,childKey);if(oldChange){var oldType=oldChange.type;if(type==Change.CHILD_ADDED&&oldType==Change.CHILD_REMOVED){this.changeMap_[childKey]=Change.childChangedChange(childKey,change.snapshotNode,oldChange.snapshotNode);}else if(type==Change.CHILD_REMOVED&&oldType==Change.CHILD_ADDED){delete this.changeMap_[childKey];}else if(type==Change.CHILD_REMOVED&&oldType==Change.CHILD_CHANGED){this.changeMap_[childKey]=Change.childRemovedChange(childKey,oldChange.oldSnap);}else if(type==Change.CHILD_CHANGED&&oldType==Change.CHILD_ADDED){this.changeMap_[childKey]=Change.childAddedChange(childKey,change.snapshotNode);}else if(type==Change.CHILD_CHANGED&&oldType==Change.CHILD_CHANGED){this.changeMap_[childKey]=Change.childChangedChange(childKey,change.snapshotNode,oldChange.oldSnap);}else{throw Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["f" /* assertionError */])('Illegal combination of changes: '+change+' occurred after '+oldChange);}}else{this.changeMap_[childKey]=change;}};/**
     * @return {!Array.<!Change>}
     */ChildChangeAccumulator.prototype.getChanges=function(){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["u" /* getValues */])(this.changeMap_);};return ChildChangeAccumulator;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An implementation of CompleteChildSource that never returns any additional children
 *
 * @private
 * @constructor
 * @implements CompleteChildSource
 */var NoCompleteChildSource_=/** @class */function(){function NoCompleteChildSource_(){}/**
     * @inheritDoc
     */NoCompleteChildSource_.prototype.getCompleteChild=function(childKey){return null;};/**
     * @inheritDoc
     */NoCompleteChildSource_.prototype.getChildAfterChild=function(index,child,reverse){return null;};return NoCompleteChildSource_;}();/**
 * Singleton instance.
 * @const
 * @type {!CompleteChildSource}
 */var NO_COMPLETE_CHILD_SOURCE=new NoCompleteChildSource_();/**
 * An implementation of CompleteChildSource that uses a WriteTree in addition to any other server data or
 * old event caches available to calculate complete children.
 *
 *
 * @implements CompleteChildSource
 */var WriteTreeCompleteChildSource=/** @class */function(){/**
     * @param {!WriteTreeRef} writes_
     * @param {!ViewCache} viewCache_
     * @param {?Node} optCompleteServerCache_
     */function WriteTreeCompleteChildSource(writes_,viewCache_,optCompleteServerCache_){if(optCompleteServerCache_===void 0){optCompleteServerCache_=null;}this.writes_=writes_;this.viewCache_=viewCache_;this.optCompleteServerCache_=optCompleteServerCache_;}/**
     * @inheritDoc
     */WriteTreeCompleteChildSource.prototype.getCompleteChild=function(childKey){var node=this.viewCache_.getEventCache();if(node.isCompleteForChild(childKey)){return node.getNode().getImmediateChild(childKey);}else{var serverNode=this.optCompleteServerCache_!=null?new CacheNode(this.optCompleteServerCache_,true,false):this.viewCache_.getServerCache();return this.writes_.calcCompleteChild(childKey,serverNode);}};/**
     * @inheritDoc
     */WriteTreeCompleteChildSource.prototype.getChildAfterChild=function(index,child,reverse){var completeServerData=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:this.viewCache_.getCompleteServerSnap();var nodes=this.writes_.calcIndexedSlice(completeServerData,child,1,reverse,index);if(nodes.length===0){return null;}else{return nodes[0];}};return WriteTreeCompleteChildSource;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @constructor
 * @struct
 */var ProcessorResult=/** @class */function(){/**
     * @param {!ViewCache} viewCache
     * @param {!Array.<!Change>} changes
     */function ProcessorResult(viewCache,changes){this.viewCache=viewCache;this.changes=changes;}return ProcessorResult;}();/**
 * @constructor
 */var ViewProcessor=/** @class */function(){/**
     * @param {!NodeFilter} filter_
     */function ViewProcessor(filter_){this.filter_=filter_;}/**
     * @param {!ViewCache} viewCache
     */ViewProcessor.prototype.assertIndexed=function(viewCache){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(viewCache.getEventCache().getNode().isIndexed(this.filter_.getIndex()),'Event snap not indexed');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(viewCache.getServerCache().getNode().isIndexed(this.filter_.getIndex()),'Server snap not indexed');};/**
     * @param {!ViewCache} oldViewCache
     * @param {!Operation} operation
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeCache
     * @return {!ProcessorResult}
     */ViewProcessor.prototype.applyOperation=function(oldViewCache,operation,writesCache,completeCache){var accumulator=new ChildChangeAccumulator();var newViewCache,filterServerNode;if(operation.type===OperationType.OVERWRITE){var overwrite=operation;if(overwrite.source.fromUser){newViewCache=this.applyUserOverwrite_(oldViewCache,overwrite.path,overwrite.snap,writesCache,completeCache,accumulator);}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(overwrite.source.fromServer,'Unknown source.');// We filter the node if it's a tagged update or the node has been previously filtered  and the
// update is not at the root in which case it is ok (and necessary) to mark the node unfiltered
// again
filterServerNode=overwrite.source.tagged||oldViewCache.getServerCache().isFiltered()&&!overwrite.path.isEmpty();newViewCache=this.applyServerOverwrite_(oldViewCache,overwrite.path,overwrite.snap,writesCache,completeCache,filterServerNode,accumulator);}}else if(operation.type===OperationType.MERGE){var merge=operation;if(merge.source.fromUser){newViewCache=this.applyUserMerge_(oldViewCache,merge.path,merge.children,writesCache,completeCache,accumulator);}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(merge.source.fromServer,'Unknown source.');// We filter the node if it's a tagged update or the node has been previously filtered
filterServerNode=merge.source.tagged||oldViewCache.getServerCache().isFiltered();newViewCache=this.applyServerMerge_(oldViewCache,merge.path,merge.children,writesCache,completeCache,filterServerNode,accumulator);}}else if(operation.type===OperationType.ACK_USER_WRITE){var ackUserWrite=operation;if(!ackUserWrite.revert){newViewCache=this.ackUserWrite_(oldViewCache,ackUserWrite.path,ackUserWrite.affectedTree,writesCache,completeCache,accumulator);}else{newViewCache=this.revertUserWrite_(oldViewCache,ackUserWrite.path,writesCache,completeCache,accumulator);}}else if(operation.type===OperationType.LISTEN_COMPLETE){newViewCache=this.listenComplete_(oldViewCache,operation.path,writesCache,accumulator);}else{throw Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["f" /* assertionError */])('Unknown operation type: '+operation.type);}var changes=accumulator.getChanges();ViewProcessor.maybeAddValueEvent_(oldViewCache,newViewCache,changes);return new ProcessorResult(newViewCache,changes);};/**
     * @param {!ViewCache} oldViewCache
     * @param {!ViewCache} newViewCache
     * @param {!Array.<!Change>} accumulator
     * @private
     */ViewProcessor.maybeAddValueEvent_=function(oldViewCache,newViewCache,accumulator){var eventSnap=newViewCache.getEventCache();if(eventSnap.isFullyInitialized()){var isLeafOrEmpty=eventSnap.getNode().isLeafNode()||eventSnap.getNode().isEmpty();var oldCompleteSnap=oldViewCache.getCompleteEventSnap();if(accumulator.length>0||!oldViewCache.getEventCache().isFullyInitialized()||isLeafOrEmpty&&!eventSnap.getNode().equals(/** @type {!Node} */oldCompleteSnap)||!eventSnap.getNode().getPriority().equals(oldCompleteSnap.getPriority())){accumulator.push(Change.valueChange(/** @type {!Node} */newViewCache.getCompleteEventSnap()));}}};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} changePath
     * @param {!WriteTreeRef} writesCache
     * @param {!CompleteChildSource} source
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.generateEventCacheAfterServerEvent_=function(viewCache,changePath,writesCache,source,accumulator){var oldEventSnap=viewCache.getEventCache();if(writesCache.shadowingWrite(changePath)!=null){// we have a shadowing write, ignore changes
return viewCache;}else{var newEventCache=void 0,serverNode=void 0;if(changePath.isEmpty()){// TODO: figure out how this plays with "sliding ack windows"
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(viewCache.getServerCache().isFullyInitialized(),'If change path is empty, we must have complete server data');if(viewCache.getServerCache().isFiltered()){// We need to special case this, because we need to only apply writes to complete children, or
// we might end up raising events for incomplete children. If the server data is filtered deep
// writes cannot be guaranteed to be complete
var serverCache=viewCache.getCompleteServerSnap();var completeChildren=serverCache instanceof ChildrenNode?serverCache:ChildrenNode.EMPTY_NODE;var completeEventChildren=writesCache.calcCompleteEventChildren(completeChildren);newEventCache=this.filter_.updateFullNode(viewCache.getEventCache().getNode(),completeEventChildren,accumulator);}else{var completeNode=writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap());newEventCache=this.filter_.updateFullNode(viewCache.getEventCache().getNode(),completeNode,accumulator);}}else{var childKey=changePath.getFront();if(childKey=='.priority'){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(changePath.getLength()==1,"Can't have a priority with additional path components");var oldEventNode=oldEventSnap.getNode();serverNode=viewCache.getServerCache().getNode();// we might have overwrites for this priority
var updatedPriority=writesCache.calcEventCacheAfterServerOverwrite(changePath,oldEventNode,serverNode);if(updatedPriority!=null){newEventCache=this.filter_.updatePriority(oldEventNode,updatedPriority);}else{// priority didn't change, keep old node
newEventCache=oldEventSnap.getNode();}}else{var childChangePath=changePath.popFront();// update child
var newEventChild=void 0;if(oldEventSnap.isCompleteForChild(childKey)){serverNode=viewCache.getServerCache().getNode();var eventChildUpdate=writesCache.calcEventCacheAfterServerOverwrite(changePath,oldEventSnap.getNode(),serverNode);if(eventChildUpdate!=null){newEventChild=oldEventSnap.getNode().getImmediateChild(childKey).updateChild(childChangePath,eventChildUpdate);}else{// Nothing changed, just keep the old child
newEventChild=oldEventSnap.getNode().getImmediateChild(childKey);}}else{newEventChild=writesCache.calcCompleteChild(childKey,viewCache.getServerCache());}if(newEventChild!=null){newEventCache=this.filter_.updateChild(oldEventSnap.getNode(),childKey,newEventChild,childChangePath,source,accumulator);}else{// no complete child available or no change
newEventCache=oldEventSnap.getNode();}}}return viewCache.updateEventSnap(newEventCache,oldEventSnap.isFullyInitialized()||changePath.isEmpty(),this.filter_.filtersNodes());}};/**
     * @param {!ViewCache} oldViewCache
     * @param {!Path} changePath
     * @param {!Node} changedSnap
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeCache
     * @param {boolean} filterServerNode
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.applyServerOverwrite_=function(oldViewCache,changePath,changedSnap,writesCache,completeCache,filterServerNode,accumulator){var oldServerSnap=oldViewCache.getServerCache();var newServerCache;var serverFilter=filterServerNode?this.filter_:this.filter_.getIndexedFilter();if(changePath.isEmpty()){newServerCache=serverFilter.updateFullNode(oldServerSnap.getNode(),changedSnap,null);}else if(serverFilter.filtersNodes()&&!oldServerSnap.isFiltered()){// we want to filter the server node, but we didn't filter the server node yet, so simulate a full update
var newServerNode=oldServerSnap.getNode().updateChild(changePath,changedSnap);newServerCache=serverFilter.updateFullNode(oldServerSnap.getNode(),newServerNode,null);}else{var childKey=changePath.getFront();if(!oldServerSnap.isCompleteForPath(changePath)&&changePath.getLength()>1){// We don't update incomplete nodes with updates intended for other listeners
return oldViewCache;}var childChangePath=changePath.popFront();var childNode=oldServerSnap.getNode().getImmediateChild(childKey);var newChildNode=childNode.updateChild(childChangePath,changedSnap);if(childKey=='.priority'){newServerCache=serverFilter.updatePriority(oldServerSnap.getNode(),newChildNode);}else{newServerCache=serverFilter.updateChild(oldServerSnap.getNode(),childKey,newChildNode,childChangePath,NO_COMPLETE_CHILD_SOURCE,null);}}var newViewCache=oldViewCache.updateServerSnap(newServerCache,oldServerSnap.isFullyInitialized()||changePath.isEmpty(),serverFilter.filtersNodes());var source=new WriteTreeCompleteChildSource(writesCache,newViewCache,completeCache);return this.generateEventCacheAfterServerEvent_(newViewCache,changePath,writesCache,source,accumulator);};/**
     * @param {!ViewCache} oldViewCache
     * @param {!Path} changePath
     * @param {!Node} changedSnap
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeCache
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.applyUserOverwrite_=function(oldViewCache,changePath,changedSnap,writesCache,completeCache,accumulator){var oldEventSnap=oldViewCache.getEventCache();var newViewCache,newEventCache;var source=new WriteTreeCompleteChildSource(writesCache,oldViewCache,completeCache);if(changePath.isEmpty()){newEventCache=this.filter_.updateFullNode(oldViewCache.getEventCache().getNode(),changedSnap,accumulator);newViewCache=oldViewCache.updateEventSnap(newEventCache,true,this.filter_.filtersNodes());}else{var childKey=changePath.getFront();if(childKey==='.priority'){newEventCache=this.filter_.updatePriority(oldViewCache.getEventCache().getNode(),changedSnap);newViewCache=oldViewCache.updateEventSnap(newEventCache,oldEventSnap.isFullyInitialized(),oldEventSnap.isFiltered());}else{var childChangePath=changePath.popFront();var oldChild=oldEventSnap.getNode().getImmediateChild(childKey);var newChild=void 0;if(childChangePath.isEmpty()){// Child overwrite, we can replace the child
newChild=changedSnap;}else{var childNode=source.getCompleteChild(childKey);if(childNode!=null){if(childChangePath.getBack()==='.priority'&&childNode.getChild(childChangePath.parent()).isEmpty()){// This is a priority update on an empty node. If this node exists on the server, the
// server will send down the priority in the update, so ignore for now
newChild=childNode;}else{newChild=childNode.updateChild(childChangePath,changedSnap);}}else{// There is no complete child node available
newChild=ChildrenNode.EMPTY_NODE;}}if(!oldChild.equals(newChild)){var newEventSnap=this.filter_.updateChild(oldEventSnap.getNode(),childKey,newChild,childChangePath,source,accumulator);newViewCache=oldViewCache.updateEventSnap(newEventSnap,oldEventSnap.isFullyInitialized(),this.filter_.filtersNodes());}else{newViewCache=oldViewCache;}}}return newViewCache;};/**
     * @param {!ViewCache} viewCache
     * @param {string} childKey
     * @return {boolean}
     * @private
     */ViewProcessor.cacheHasChild_=function(viewCache,childKey){return viewCache.getEventCache().isCompleteForChild(childKey);};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} path
     * @param {ImmutableTree.<!Node>} changedChildren
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} serverCache
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.applyUserMerge_=function(viewCache,path,changedChildren,writesCache,serverCache,accumulator){var _this=this;// HACK: In the case of a limit query, there may be some changes that bump things out of the
// window leaving room for new items.  It's important we process these changes first, so we
// iterate the changes twice, first processing any that affect items currently in view.
// TODO: I consider an item "in view" if cacheHasChild is true, which checks both the server
// and event snap.  I'm not sure if this will result in edge cases when a child is in one but
// not the other.
var curViewCache=viewCache;changedChildren.foreach(function(relativePath,childNode){var writePath=path.child(relativePath);if(ViewProcessor.cacheHasChild_(viewCache,writePath.getFront())){curViewCache=_this.applyUserOverwrite_(curViewCache,writePath,childNode,writesCache,serverCache,accumulator);}});changedChildren.foreach(function(relativePath,childNode){var writePath=path.child(relativePath);if(!ViewProcessor.cacheHasChild_(viewCache,writePath.getFront())){curViewCache=_this.applyUserOverwrite_(curViewCache,writePath,childNode,writesCache,serverCache,accumulator);}});return curViewCache;};/**
     * @param {!Node} node
     * @param {ImmutableTree.<!Node>} merge
     * @return {!Node}
     * @private
     */ViewProcessor.prototype.applyMerge_=function(node,merge){merge.foreach(function(relativePath,childNode){node=node.updateChild(relativePath,childNode);});return node;};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} path
     * @param {!ImmutableTree.<!Node>} changedChildren
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} serverCache
     * @param {boolean} filterServerNode
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.applyServerMerge_=function(viewCache,path,changedChildren,writesCache,serverCache,filterServerNode,accumulator){var _this=this;// If we don't have a cache yet, this merge was intended for a previously listen in the same location. Ignore it and
// wait for the complete data update coming soon.
if(viewCache.getServerCache().getNode().isEmpty()&&!viewCache.getServerCache().isFullyInitialized()){return viewCache;}// HACK: In the case of a limit query, there may be some changes that bump things out of the
// window leaving room for new items.  It's important we process these changes first, so we
// iterate the changes twice, first processing any that affect items currently in view.
// TODO: I consider an item "in view" if cacheHasChild is true, which checks both the server
// and event snap.  I'm not sure if this will result in edge cases when a child is in one but
// not the other.
var curViewCache=viewCache;var viewMergeTree;if(path.isEmpty()){viewMergeTree=changedChildren;}else{viewMergeTree=ImmutableTree.Empty.setTree(path,changedChildren);}var serverNode=viewCache.getServerCache().getNode();viewMergeTree.children.inorderTraversal(function(childKey,childTree){if(serverNode.hasChild(childKey)){var serverChild=viewCache.getServerCache().getNode().getImmediateChild(childKey);var newChild=_this.applyMerge_(serverChild,childTree);curViewCache=_this.applyServerOverwrite_(curViewCache,new Path(childKey),newChild,writesCache,serverCache,filterServerNode,accumulator);}});viewMergeTree.children.inorderTraversal(function(childKey,childMergeTree){var isUnknownDeepMerge=!viewCache.getServerCache().isCompleteForChild(childKey)&&childMergeTree.value==null;if(!serverNode.hasChild(childKey)&&!isUnknownDeepMerge){var serverChild=viewCache.getServerCache().getNode().getImmediateChild(childKey);var newChild=_this.applyMerge_(serverChild,childMergeTree);curViewCache=_this.applyServerOverwrite_(curViewCache,new Path(childKey),newChild,writesCache,serverCache,filterServerNode,accumulator);}});return curViewCache;};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} ackPath
     * @param {!ImmutableTree<!boolean>} affectedTree
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeCache
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.ackUserWrite_=function(viewCache,ackPath,affectedTree,writesCache,completeCache,accumulator){if(writesCache.shadowingWrite(ackPath)!=null){return viewCache;}// Only filter server node if it is currently filtered
var filterServerNode=viewCache.getServerCache().isFiltered();// Essentially we'll just get our existing server cache for the affected paths and re-apply it as a server update
// now that it won't be shadowed.
var serverCache=viewCache.getServerCache();if(affectedTree.value!=null){// This is an overwrite.
if(ackPath.isEmpty()&&serverCache.isFullyInitialized()||serverCache.isCompleteForPath(ackPath)){return this.applyServerOverwrite_(viewCache,ackPath,serverCache.getNode().getChild(ackPath),writesCache,completeCache,filterServerNode,accumulator);}else if(ackPath.isEmpty()){// This is a goofy edge case where we are acking data at this location but don't have full data.  We
// should just re-apply whatever we have in our cache as a merge.
var changedChildren_1=ImmutableTree.Empty;serverCache.getNode().forEachChild(KEY_INDEX,function(name,node){changedChildren_1=changedChildren_1.set(new Path(name),node);});return this.applyServerMerge_(viewCache,ackPath,changedChildren_1,writesCache,completeCache,filterServerNode,accumulator);}else{return viewCache;}}else{// This is a merge.
var changedChildren_2=ImmutableTree.Empty;affectedTree.foreach(function(mergePath,value){var serverCachePath=ackPath.child(mergePath);if(serverCache.isCompleteForPath(serverCachePath)){changedChildren_2=changedChildren_2.set(mergePath,serverCache.getNode().getChild(serverCachePath));}});return this.applyServerMerge_(viewCache,ackPath,changedChildren_2,writesCache,completeCache,filterServerNode,accumulator);}};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} path
     * @param {!WriteTreeRef} writesCache
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.listenComplete_=function(viewCache,path,writesCache,accumulator){var oldServerNode=viewCache.getServerCache();var newViewCache=viewCache.updateServerSnap(oldServerNode.getNode(),oldServerNode.isFullyInitialized()||path.isEmpty(),oldServerNode.isFiltered());return this.generateEventCacheAfterServerEvent_(newViewCache,path,writesCache,NO_COMPLETE_CHILD_SOURCE,accumulator);};/**
     * @param {!ViewCache} viewCache
     * @param {!Path} path
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeServerCache
     * @param {!ChildChangeAccumulator} accumulator
     * @return {!ViewCache}
     * @private
     */ViewProcessor.prototype.revertUserWrite_=function(viewCache,path,writesCache,completeServerCache,accumulator){var complete;if(writesCache.shadowingWrite(path)!=null){return viewCache;}else{var source=new WriteTreeCompleteChildSource(writesCache,viewCache,completeServerCache);var oldEventCache=viewCache.getEventCache().getNode();var newEventCache=void 0;if(path.isEmpty()||path.getFront()==='.priority'){var newNode=void 0;if(viewCache.getServerCache().isFullyInitialized()){newNode=writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap());}else{var serverChildren=viewCache.getServerCache().getNode();Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(serverChildren instanceof ChildrenNode,'serverChildren would be complete if leaf node');newNode=writesCache.calcCompleteEventChildren(serverChildren);}newNode=newNode;newEventCache=this.filter_.updateFullNode(oldEventCache,newNode,accumulator);}else{var childKey=path.getFront();var newChild=writesCache.calcCompleteChild(childKey,viewCache.getServerCache());if(newChild==null&&viewCache.getServerCache().isCompleteForChild(childKey)){newChild=oldEventCache.getImmediateChild(childKey);}if(newChild!=null){newEventCache=this.filter_.updateChild(oldEventCache,childKey,newChild,path.popFront(),source,accumulator);}else if(viewCache.getEventCache().getNode().hasChild(childKey)){// No complete child available, delete the existing one, if any
newEventCache=this.filter_.updateChild(oldEventCache,childKey,ChildrenNode.EMPTY_NODE,path.popFront(),source,accumulator);}else{newEventCache=oldEventCache;}if(newEventCache.isEmpty()&&viewCache.getServerCache().isFullyInitialized()){// We might have reverted all child writes. Maybe the old event was a leaf node
complete=writesCache.calcCompleteEventCache(viewCache.getCompleteServerSnap());if(complete.isLeafNode()){newEventCache=this.filter_.updateFullNode(newEventCache,complete,accumulator);}}}complete=viewCache.getServerCache().isFullyInitialized()||writesCache.shadowingWrite(Path.Empty)!=null;return viewCache.updateEventSnap(newEventCache,complete,this.filter_.filtersNodes());}};return ViewProcessor;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An EventGenerator is used to convert "raw" changes (Change) as computed by the
 * CacheDiffer into actual events (Event) that can be raised.  See generateEventsForChanges()
 * for details.
 *
 * @constructor
 */var EventGenerator=/** @class */function(){/**
     *
     * @param {!Query} query_
     */function EventGenerator(query_){this.query_=query_;/**
         * @private
         * @type {!Index}
         */this.index_=this.query_.getQueryParams().getIndex();}/**
     * Given a set of raw changes (no moved events and prevName not specified yet), and a set of
     * EventRegistrations that should be notified of these changes, generate the actual events to be raised.
     *
     * Notes:
     *  - child_moved events will be synthesized at this time for any child_changed events that affect
     *    our index.
     *  - prevName will be calculated based on the index ordering.
     *
     * @param {!Array.<!Change>} changes
     * @param {!Node} eventCache
     * @param {!Array.<!EventRegistration>} eventRegistrations
     * @return {!Array.<!Event>}
     */EventGenerator.prototype.generateEventsForChanges=function(changes,eventCache,eventRegistrations){var _this=this;var events=[];var moves=[];changes.forEach(function(change){if(change.type===Change.CHILD_CHANGED&&_this.index_.indexedValueChanged(change.oldSnap,change.snapshotNode)){moves.push(Change.childMovedChange(change.childName,change.snapshotNode));}});this.generateEventsForType_(events,Change.CHILD_REMOVED,changes,eventRegistrations,eventCache);this.generateEventsForType_(events,Change.CHILD_ADDED,changes,eventRegistrations,eventCache);this.generateEventsForType_(events,Change.CHILD_MOVED,moves,eventRegistrations,eventCache);this.generateEventsForType_(events,Change.CHILD_CHANGED,changes,eventRegistrations,eventCache);this.generateEventsForType_(events,Change.VALUE,changes,eventRegistrations,eventCache);return events;};/**
     * Given changes of a single change type, generate the corresponding events.
     *
     * @param {!Array.<!Event>} events
     * @param {!string} eventType
     * @param {!Array.<!Change>} changes
     * @param {!Array.<!EventRegistration>} registrations
     * @param {!Node} eventCache
     * @private
     */EventGenerator.prototype.generateEventsForType_=function(events,eventType,changes,registrations,eventCache){var _this=this;var filteredChanges=changes.filter(function(change){return change.type===eventType;});filteredChanges.sort(this.compareChanges_.bind(this));filteredChanges.forEach(function(change){var materializedChange=_this.materializeSingleChange_(change,eventCache);registrations.forEach(function(registration){if(registration.respondsTo(change.type)){events.push(registration.createEvent(materializedChange,_this.query_));}});});};/**
     * @param {!Change} change
     * @param {!Node} eventCache
     * @return {!Change}
     * @private
     */EventGenerator.prototype.materializeSingleChange_=function(change,eventCache){if(change.type==='value'||change.type==='child_removed'){return change;}else{change.prevName=eventCache.getPredecessorChildName(/** @type {!string} */change.childName,change.snapshotNode,this.index_);return change;}};/**
     * @param {!Change} a
     * @param {!Change} b
     * @return {number}
     * @private
     */EventGenerator.prototype.compareChanges_=function(a,b){if(a.childName==null||b.childName==null){throw Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["f" /* assertionError */])('Should only compare child_ events.');}var aWrapped=new NamedNode(a.childName,a.snapshotNode);var bWrapped=new NamedNode(b.childName,b.snapshotNode);return this.index_.compare(aWrapped,bWrapped);};return EventGenerator;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * A view represents a specific location and query that has 1 or more event registrations.
 *
 * It does several things:
 *  - Maintains the list of event registrations for this location/query.
 *  - Maintains a cache of the data visible for this location/query.
 *  - Applies new operations (via applyOperation), updates the cache, and based on the event
 *    registrations returns the set of events to be raised.
 * @constructor
 */var View=/** @class */function(){/**
     *
     * @param {!Query} query_
     * @param {!ViewCache} initialViewCache
     */function View(query_,initialViewCache){this.query_=query_;this.eventRegistrations_=[];var params=this.query_.getQueryParams();var indexFilter=new IndexedFilter(params.getIndex());var filter=params.getNodeFilter();/**
         * @type {ViewProcessor}
         * @private
         */this.processor_=new ViewProcessor(filter);var initialServerCache=initialViewCache.getServerCache();var initialEventCache=initialViewCache.getEventCache();// Don't filter server node with other filter than index, wait for tagged listen
var serverSnap=indexFilter.updateFullNode(ChildrenNode.EMPTY_NODE,initialServerCache.getNode(),null);var eventSnap=filter.updateFullNode(ChildrenNode.EMPTY_NODE,initialEventCache.getNode(),null);var newServerCache=new CacheNode(serverSnap,initialServerCache.isFullyInitialized(),indexFilter.filtersNodes());var newEventCache=new CacheNode(eventSnap,initialEventCache.isFullyInitialized(),filter.filtersNodes());/**
         * @type {!ViewCache}
         * @private
         */this.viewCache_=new ViewCache(newEventCache,newServerCache);/**
         * @type {!EventGenerator}
         * @private
         */this.eventGenerator_=new EventGenerator(this.query_);}/**
     * @return {!Query}
     */View.prototype.getQuery=function(){return this.query_;};/**
     * @return {?Node}
     */View.prototype.getServerCache=function(){return this.viewCache_.getServerCache().getNode();};/**
     * @param {!Path} path
     * @return {?Node}
     */View.prototype.getCompleteServerCache=function(path){var cache=this.viewCache_.getCompleteServerSnap();if(cache){// If this isn't a "loadsAllData" view, then cache isn't actually a complete cache and
// we need to see if it contains the child we're interested in.
if(this.query_.getQueryParams().loadsAllData()||!path.isEmpty()&&!cache.getImmediateChild(path.getFront()).isEmpty()){return cache.getChild(path);}}return null;};/**
     * @return {boolean}
     */View.prototype.isEmpty=function(){return this.eventRegistrations_.length===0;};/**
     * @param {!EventRegistration} eventRegistration
     */View.prototype.addEventRegistration=function(eventRegistration){this.eventRegistrations_.push(eventRegistration);};/**
     * @param {?EventRegistration} eventRegistration If null, remove all callbacks.
     * @param {Error=} cancelError If a cancelError is provided, appropriate cancel events will be returned.
     * @return {!Array.<!Event>} Cancel events, if cancelError was provided.
     */View.prototype.removeEventRegistration=function(eventRegistration,cancelError){var cancelEvents=[];if(cancelError){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(eventRegistration==null,'A cancel should cancel all event registrations.');var path_1=this.query_.path;this.eventRegistrations_.forEach(function(registration){cancelError/** @type {!Error} */=cancelError;var maybeEvent=registration.createCancelEvent(cancelError,path_1);if(maybeEvent){cancelEvents.push(maybeEvent);}});}if(eventRegistration){var remaining=[];for(var i=0;i<this.eventRegistrations_.length;++i){var existing=this.eventRegistrations_[i];if(!existing.matches(eventRegistration)){remaining.push(existing);}else if(eventRegistration.hasAnyCallback()){// We're removing just this one
remaining=remaining.concat(this.eventRegistrations_.slice(i+1));break;}}this.eventRegistrations_=remaining;}else{this.eventRegistrations_=[];}return cancelEvents;};/**
     * Applies the given Operation, updates our cache, and returns the appropriate events.
     *
     * @param {!Operation} operation
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} completeServerCache
     * @return {!Array.<!Event>}
     */View.prototype.applyOperation=function(operation,writesCache,completeServerCache){if(operation.type===OperationType.MERGE&&operation.source.queryId!==null){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.viewCache_.getCompleteServerSnap(),'We should always have a full cache before handling merges');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.viewCache_.getCompleteEventSnap(),'Missing event cache, even though we have a server cache');}var oldViewCache=this.viewCache_;var result=this.processor_.applyOperation(oldViewCache,operation,writesCache,completeServerCache);this.processor_.assertIndexed(result.viewCache);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(result.viewCache.getServerCache().isFullyInitialized()||!oldViewCache.getServerCache().isFullyInitialized(),'Once a server snap is complete, it should never go back');this.viewCache_=result.viewCache;return this.generateEventsForChanges_(result.changes,result.viewCache.getEventCache().getNode(),null);};/**
     * @param {!EventRegistration} registration
     * @return {!Array.<!Event>}
     */View.prototype.getInitialEvents=function(registration){var eventSnap=this.viewCache_.getEventCache();var initialChanges=[];if(!eventSnap.getNode().isLeafNode()){var eventNode=eventSnap.getNode();eventNode.forEachChild(PRIORITY_INDEX,function(key,childNode){initialChanges.push(Change.childAddedChange(key,childNode));});}if(eventSnap.isFullyInitialized()){initialChanges.push(Change.valueChange(eventSnap.getNode()));}return this.generateEventsForChanges_(initialChanges,eventSnap.getNode(),registration);};/**
     * @private
     * @param {!Array.<!Change>} changes
     * @param {!Node} eventCache
     * @param {EventRegistration=} eventRegistration
     * @return {!Array.<!Event>}
     */View.prototype.generateEventsForChanges_=function(changes,eventCache,eventRegistration){var registrations=eventRegistration?[eventRegistration]:this.eventRegistrations_;return this.eventGenerator_.generateEventsForChanges(changes,eventCache,registrations);};return View;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var __referenceConstructor$1;/**
 * SyncPoint represents a single location in a SyncTree with 1 or more event registrations, meaning we need to
 * maintain 1 or more Views at this location to cache server data and raise appropriate events for server changes
 * and user writes (set, transaction, update).
 *
 * It's responsible for:
 *  - Maintaining the set of 1 or more views necessary at this location (a SyncPoint with 0 views should be removed).
 *  - Proxying user / server operations to the views as appropriate (i.e. applyServerOverwrite,
 *    applyUserOverwrite, etc.)
 */var SyncPoint=/** @class */function(){function SyncPoint(){/**
         * The Views being tracked at this location in the tree, stored as a map where the key is a
         * queryId and the value is the View for that query.
         *
         * NOTE: This list will be quite small (usually 1, but perhaps 2 or 3; any more is an odd use case).
         *
         * @type {!Object.<!string, !View>}
         * @private
         */this.views_={};}Object.defineProperty(SyncPoint,"__referenceConstructor",{get:function get(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(__referenceConstructor$1,'Reference.ts has not been loaded');return __referenceConstructor$1;},set:function set(val){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!__referenceConstructor$1,'__referenceConstructor has already been defined');__referenceConstructor$1=val;},enumerable:true,configurable:true});/**
     * @return {boolean}
     */SyncPoint.prototype.isEmpty=function(){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["w" /* isEmpty */])(this.views_);};/**
     *
     * @param {!Operation} operation
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} optCompleteServerCache
     * @return {!Array.<!Event>}
     */SyncPoint.prototype.applyOperation=function(operation,writesCache,optCompleteServerCache){var queryId=operation.source.queryId;if(queryId!==null){var view=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.views_,queryId);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(view!=null,'SyncTree gave us an op for an invalid query.');return view.applyOperation(operation,writesCache,optCompleteServerCache);}else{var events_1=[];Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.views_,function(key,view){events_1=events_1.concat(view.applyOperation(operation,writesCache,optCompleteServerCache));});return events_1;}};/**
     * Add an event callback for the specified query.
     *
     * @param {!Query} query
     * @param {!EventRegistration} eventRegistration
     * @param {!WriteTreeRef} writesCache
     * @param {?Node} serverCache Complete server cache, if we have it.
     * @param {boolean} serverCacheComplete
     * @return {!Array.<!Event>} Events to raise.
     */SyncPoint.prototype.addEventRegistration=function(query,eventRegistration,writesCache,serverCache,serverCacheComplete){var queryId=query.queryIdentifier();var view=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.views_,queryId);if(!view){// TODO: make writesCache take flag for complete server node
var eventCache=writesCache.calcCompleteEventCache(serverCacheComplete?serverCache:null);var eventCacheComplete=false;if(eventCache){eventCacheComplete=true;}else if(serverCache instanceof ChildrenNode){eventCache=writesCache.calcCompleteEventChildren(serverCache);eventCacheComplete=false;}else{eventCache=ChildrenNode.EMPTY_NODE;eventCacheComplete=false;}var viewCache=new ViewCache(new CacheNode(/** @type {!Node} */eventCache,eventCacheComplete,false),new CacheNode(/** @type {!Node} */serverCache,serverCacheComplete,false));view=new View(query,viewCache);this.views_[queryId]=view;}// This is guaranteed to exist now, we just created anything that was missing
view.addEventRegistration(eventRegistration);return view.getInitialEvents(eventRegistration);};/**
     * Remove event callback(s).  Return cancelEvents if a cancelError is specified.
     *
     * If query is the default query, we'll check all views for the specified eventRegistration.
     * If eventRegistration is null, we'll remove all callbacks for the specified view(s).
     *
     * @param {!Query} query
     * @param {?EventRegistration} eventRegistration If null, remove all callbacks.
     * @param {Error=} cancelError If a cancelError is provided, appropriate cancel events will be returned.
     * @return {{removed:!Array.<!Query>, events:!Array.<!Event>}} removed queries and any cancel events
     */SyncPoint.prototype.removeEventRegistration=function(query,eventRegistration,cancelError){var queryId=query.queryIdentifier();var removed=[];var cancelEvents=[];var hadCompleteView=this.hasCompleteView();if(queryId==='default'){// When you do ref.off(...), we search all views for the registration to remove.
var self_1=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.views_,function(viewQueryId,view){cancelEvents=cancelEvents.concat(view.removeEventRegistration(eventRegistration,cancelError));if(view.isEmpty()){delete self_1.views_[viewQueryId];// We'll deal with complete views later.
if(!view.getQuery().getQueryParams().loadsAllData()){removed.push(view.getQuery());}}});}else{// remove the callback from the specific view.
var view=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.views_,queryId);if(view){cancelEvents=cancelEvents.concat(view.removeEventRegistration(eventRegistration,cancelError));if(view.isEmpty()){delete this.views_[queryId];// We'll deal with complete views later.
if(!view.getQuery().getQueryParams().loadsAllData()){removed.push(view.getQuery());}}}}if(hadCompleteView&&!this.hasCompleteView()){// We removed our last complete view.
removed.push(new SyncPoint.__referenceConstructor(query.repo,query.path));}return{removed:removed,events:cancelEvents};};/**
     * @return {!Array.<!View>}
     */SyncPoint.prototype.getQueryViews=function(){var _this=this;var values=Object.keys(this.views_).map(function(key){return _this.views_[key];});return values.filter(function(view){return!view.getQuery().getQueryParams().loadsAllData();});};/**
     *
     * @param {!Path} path The path to the desired complete snapshot
     * @return {?Node} A complete cache, if it exists
     */SyncPoint.prototype.getCompleteServerCache=function(path){var serverCache=null;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.views_,function(key,view){serverCache=serverCache||view.getCompleteServerCache(path);});return serverCache;};/**
     * @param {!Query} query
     * @return {?View}
     */SyncPoint.prototype.viewForQuery=function(query){var params=query.getQueryParams();if(params.loadsAllData()){return this.getCompleteView();}else{var queryId=query.queryIdentifier();return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.views_,queryId);}};/**
     * @param {!Query} query
     * @return {boolean}
     */SyncPoint.prototype.viewExistsForQuery=function(query){return this.viewForQuery(query)!=null;};/**
     * @return {boolean}
     */SyncPoint.prototype.hasCompleteView=function(){return this.getCompleteView()!=null;};/**
     * @return {?View}
     */SyncPoint.prototype.getCompleteView=function(){var completeView=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["q" /* findValue */])(this.views_,function(view){return view.getQuery().getQueryParams().loadsAllData();});return completeView||null;};return SyncPoint;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * This class holds a collection of writes that can be applied to nodes in unison. It abstracts away the logic with
 * dealing with priority writes and multiple nested writes. At any given path there is only allowed to be one write
 * modifying that path. Any write to an existing path or shadowing an existing path will modify that existing write
 * to reflect the write added.
 *
 * @constructor
 * @param {!ImmutableTree.<!Node>} writeTree
 */var CompoundWrite=/** @class */function(){function CompoundWrite(writeTree_){this.writeTree_=writeTree_;}/**
     * @param {!Path} path
     * @param {!Node} node
     * @return {!CompoundWrite}
     */CompoundWrite.prototype.addWrite=function(path,node){if(path.isEmpty()){return new CompoundWrite(new ImmutableTree(node));}else{var rootmost=this.writeTree_.findRootMostValueAndPath(path);if(rootmost!=null){var rootMostPath=rootmost.path;var value=rootmost.value;var relativePath=Path.relativePath(rootMostPath,path);value=value.updateChild(relativePath,node);return new CompoundWrite(this.writeTree_.set(rootMostPath,value));}else{var subtree=new ImmutableTree(node);var newWriteTree=this.writeTree_.setTree(path,subtree);return new CompoundWrite(newWriteTree);}}};/**
     * @param {!Path} path
     * @param {!Object.<string, !Node>} updates
     * @return {!CompoundWrite}
     */CompoundWrite.prototype.addWrites=function(path,updates){var newWrite=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(updates,function(childKey,node){newWrite=newWrite.addWrite(path.child(childKey),node);});return newWrite;};/**
     * Will remove a write at the given path and deeper paths. This will <em>not</em> modify a write at a higher
     * location, which must be removed by calling this method with that path.
     *
     * @param {!Path} path The path at which a write and all deeper writes should be removed
     * @return {!CompoundWrite} The new CompoundWrite with the removed path
     */CompoundWrite.prototype.removeWrite=function(path){if(path.isEmpty()){return CompoundWrite.Empty;}else{var newWriteTree=this.writeTree_.setTree(path,ImmutableTree.Empty);return new CompoundWrite(newWriteTree);}};/**
     * Returns whether this CompoundWrite will fully overwrite a node at a given location and can therefore be
     * considered "complete".
     *
     * @param {!Path} path The path to check for
     * @return {boolean} Whether there is a complete write at that path
     */CompoundWrite.prototype.hasCompleteWrite=function(path){return this.getCompleteNode(path)!=null;};/**
     * Returns a node for a path if and only if the node is a "complete" overwrite at that path. This will not aggregate
     * writes from deeper paths, but will return child nodes from a more shallow path.
     *
     * @param {!Path} path The path to get a complete write
     * @return {?Node} The node if complete at that path, or null otherwise.
     */CompoundWrite.prototype.getCompleteNode=function(path){var rootmost=this.writeTree_.findRootMostValueAndPath(path);if(rootmost!=null){return this.writeTree_.get(rootmost.path).getChild(Path.relativePath(rootmost.path,path));}else{return null;}};/**
     * Returns all children that are guaranteed to be a complete overwrite.
     *
     * @return {!Array.<NamedNode>} A list of all complete children.
     */CompoundWrite.prototype.getCompleteChildren=function(){var children=[];var node=this.writeTree_.value;if(node!=null){// If it's a leaf node, it has no children; so nothing to do.
if(!node.isLeafNode()){node.forEachChild(PRIORITY_INDEX,function(childName,childNode){children.push(new NamedNode(childName,childNode));});}}else{this.writeTree_.children.inorderTraversal(function(childName,childTree){if(childTree.value!=null){children.push(new NamedNode(childName,childTree.value));}});}return children;};/**
     * @param {!Path} path
     * @return {!CompoundWrite}
     */CompoundWrite.prototype.childCompoundWrite=function(path){if(path.isEmpty()){return this;}else{var shadowingNode=this.getCompleteNode(path);if(shadowingNode!=null){return new CompoundWrite(new ImmutableTree(shadowingNode));}else{return new CompoundWrite(this.writeTree_.subtree(path));}}};/**
     * Returns true if this CompoundWrite is empty and therefore does not modify any nodes.
     * @return {boolean} Whether this CompoundWrite is empty
     */CompoundWrite.prototype.isEmpty=function(){return this.writeTree_.isEmpty();};/**
     * Applies this CompoundWrite to a node. The node is returned with all writes from this CompoundWrite applied to the
     * node
     * @param {!Node} node The node to apply this CompoundWrite to
     * @return {!Node} The node with all writes applied
     */CompoundWrite.prototype.apply=function(node){return CompoundWrite.applySubtreeWrite_(Path.Empty,this.writeTree_,node);};/**
     * @type {!CompoundWrite}
     */CompoundWrite.Empty=new CompoundWrite(new ImmutableTree(null));/**
     * @param {!Path} relativePath
     * @param {!ImmutableTree.<!Node>} writeTree
     * @param {!Node} node
     * @return {!Node}
     * @private
     */CompoundWrite.applySubtreeWrite_=function(relativePath,writeTree,node){if(writeTree.value!=null){// Since there a write is always a leaf, we're done here
return node.updateChild(relativePath,writeTree.value);}else{var priorityWrite_1=null;writeTree.children.inorderTraversal(function(childKey,childTree){if(childKey==='.priority'){// Apply priorities at the end so we don't update priorities for either empty nodes or forget
// to apply priorities to empty nodes that are later filled
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(childTree.value!==null,'Priority writes must always be leaf nodes');priorityWrite_1=childTree.value;}else{node=CompoundWrite.applySubtreeWrite_(relativePath.child(childKey),childTree,node);}});// If there was a priority write, we only apply it if the node is not empty
if(!node.getChild(relativePath).isEmpty()&&priorityWrite_1!==null){node=node.updateChild(relativePath.child('.priority'),priorityWrite_1);}return node;}};return CompoundWrite;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * WriteTree tracks all pending user-initiated writes and has methods to calculate the result of merging them
 * with underlying server data (to create "event cache" data).  Pending writes are added with addOverwrite()
 * and addMerge(), and removed with removeWrite().
 *
 * @constructor
 */var WriteTree=/** @class */function(){function WriteTree(){/**
         * A tree tracking the result of applying all visible writes.  This does not include transactions with
         * applyLocally=false or writes that are completely shadowed by other writes.
         *
         * @type {!CompoundWrite}
         * @private
         */this.visibleWrites_=CompoundWrite.Empty;/**
         * A list of all pending writes, regardless of visibility and shadowed-ness.  Used to calculate arbitrary
         * sets of the changed data, such as hidden writes (from transactions) or changes with certain writes excluded (also
         * used by transactions).
         *
         * @type {!Array.<!WriteRecord>}
         * @private
         */this.allWrites_=[];this.lastWriteId_=-1;}/**
     * Create a new WriteTreeRef for the given path. For use with a new sync point at the given path.
     *
     * @param {!Path} path
     * @return {!WriteTreeRef}
     */WriteTree.prototype.childWrites=function(path){return new WriteTreeRef(path,this);};/**
     * Record a new overwrite from user code.
     *
     * @param {!Path} path
     * @param {!Node} snap
     * @param {!number} writeId
     * @param {boolean=} visible This is set to false by some transactions. It should be excluded from event caches
     */WriteTree.prototype.addOverwrite=function(path,snap,writeId,visible){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(writeId>this.lastWriteId_,'Stacking an older write on top of newer ones');if(visible===undefined){visible=true;}this.allWrites_.push({path:path,snap:snap,writeId:writeId,visible:visible});if(visible){this.visibleWrites_=this.visibleWrites_.addWrite(path,snap);}this.lastWriteId_=writeId;};/**
     * Record a new merge from user code.
     *
     * @param {!Path} path
     * @param {!Object.<string, !Node>} changedChildren
     * @param {!number} writeId
     */WriteTree.prototype.addMerge=function(path,changedChildren,writeId){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(writeId>this.lastWriteId_,'Stacking an older merge on top of newer ones');this.allWrites_.push({path:path,children:changedChildren,writeId:writeId,visible:true});this.visibleWrites_=this.visibleWrites_.addWrites(path,changedChildren);this.lastWriteId_=writeId;};/**
     * @param {!number} writeId
     * @return {?WriteRecord}
     */WriteTree.prototype.getWrite=function(writeId){for(var i=0;i<this.allWrites_.length;i++){var record=this.allWrites_[i];if(record.writeId===writeId){return record;}}return null;};/**
     * Remove a write (either an overwrite or merge) that has been successfully acknowledge by the server. Recalculates
     * the tree if necessary.  We return true if it may have been visible, meaning views need to reevaluate.
     *
     * @param {!number} writeId
     * @return {boolean} true if the write may have been visible (meaning we'll need to reevaluate / raise
     * events as a result).
     */WriteTree.prototype.removeWrite=function(writeId){// Note: disabling this check. It could be a transaction that preempted another transaction, and thus was applied
// out of order.
//const validClear = revert || this.allWrites_.length === 0 || writeId <= this.allWrites_[0].writeId;
//assert(validClear, "Either we don't have this write, or it's the first one in the queue");
var _this=this;var idx=this.allWrites_.findIndex(function(s){return s.writeId===writeId;});Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(idx>=0,'removeWrite called with nonexistent writeId.');var writeToRemove=this.allWrites_[idx];this.allWrites_.splice(idx,1);var removedWriteWasVisible=writeToRemove.visible;var removedWriteOverlapsWithOtherWrites=false;var i=this.allWrites_.length-1;while(removedWriteWasVisible&&i>=0){var currentWrite=this.allWrites_[i];if(currentWrite.visible){if(i>=idx&&this.recordContainsPath_(currentWrite,writeToRemove.path)){// The removed write was completely shadowed by a subsequent write.
removedWriteWasVisible=false;}else if(writeToRemove.path.contains(currentWrite.path)){// Either we're covering some writes or they're covering part of us (depending on which came first).
removedWriteOverlapsWithOtherWrites=true;}}i--;}if(!removedWriteWasVisible){return false;}else if(removedWriteOverlapsWithOtherWrites){// There's some shadowing going on. Just rebuild the visible writes from scratch.
this.resetTree_();return true;}else{// There's no shadowing.  We can safely just remove the write(s) from visibleWrites.
if(writeToRemove.snap){this.visibleWrites_=this.visibleWrites_.removeWrite(writeToRemove.path);}else{var children=writeToRemove.children;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(children,function(childName){_this.visibleWrites_=_this.visibleWrites_.removeWrite(writeToRemove.path.child(childName));});}return true;}};/**
     * Return a complete snapshot for the given path if there's visible write data at that path, else null.
     * No server data is considered.
     *
     * @param {!Path} path
     * @return {?Node}
     */WriteTree.prototype.getCompleteWriteData=function(path){return this.visibleWrites_.getCompleteNode(path);};/**
     * Given optional, underlying server data, and an optional set of constraints (exclude some sets, include hidden
     * writes), attempt to calculate a complete snapshot for the given path
     *
     * @param {!Path} treePath
     * @param {?Node} completeServerCache
     * @param {Array.<number>=} writeIdsToExclude An optional set to be excluded
     * @param {boolean=} includeHiddenWrites Defaults to false, whether or not to layer on writes with visible set to false
     * @return {?Node}
     */WriteTree.prototype.calcCompleteEventCache=function(treePath,completeServerCache,writeIdsToExclude,includeHiddenWrites){if(!writeIdsToExclude&&!includeHiddenWrites){var shadowingNode=this.visibleWrites_.getCompleteNode(treePath);if(shadowingNode!=null){return shadowingNode;}else{var subMerge=this.visibleWrites_.childCompoundWrite(treePath);if(subMerge.isEmpty()){return completeServerCache;}else if(completeServerCache==null&&!subMerge.hasCompleteWrite(Path.Empty)){// We wouldn't have a complete snapshot, since there's no underlying data and no complete shadow
return null;}else{var layeredCache=completeServerCache||ChildrenNode.EMPTY_NODE;return subMerge.apply(layeredCache);}}}else{var merge=this.visibleWrites_.childCompoundWrite(treePath);if(!includeHiddenWrites&&merge.isEmpty()){return completeServerCache;}else{// If the server cache is null, and we don't have a complete cache, we need to return null
if(!includeHiddenWrites&&completeServerCache==null&&!merge.hasCompleteWrite(Path.Empty)){return null;}else{var filter=function filter(write){return(write.visible||includeHiddenWrites)&&(!writeIdsToExclude||!~writeIdsToExclude.indexOf(write.writeId))&&(write.path.contains(treePath)||treePath.contains(write.path));};var mergeAtPath=WriteTree.layerTree_(this.allWrites_,filter,treePath);var layeredCache=completeServerCache||ChildrenNode.EMPTY_NODE;return mergeAtPath.apply(layeredCache);}}}};/**
     * With optional, underlying server data, attempt to return a children node of children that we have complete data for.
     * Used when creating new views, to pre-fill their complete event children snapshot.
     *
     * @param {!Path} treePath
     * @param {?ChildrenNode} completeServerChildren
     * @return {!ChildrenNode}
     */WriteTree.prototype.calcCompleteEventChildren=function(treePath,completeServerChildren){var completeChildren=ChildrenNode.EMPTY_NODE;var topLevelSet=this.visibleWrites_.getCompleteNode(treePath);if(topLevelSet){if(!topLevelSet.isLeafNode()){// we're shadowing everything. Return the children.
topLevelSet.forEachChild(PRIORITY_INDEX,function(childName,childSnap){completeChildren=completeChildren.updateImmediateChild(childName,childSnap);});}return completeChildren;}else if(completeServerChildren){// Layer any children we have on top of this
// We know we don't have a top-level set, so just enumerate existing children
var merge_1=this.visibleWrites_.childCompoundWrite(treePath);completeServerChildren.forEachChild(PRIORITY_INDEX,function(childName,childNode){var node=merge_1.childCompoundWrite(new Path(childName)).apply(childNode);completeChildren=completeChildren.updateImmediateChild(childName,node);});// Add any complete children we have from the set
merge_1.getCompleteChildren().forEach(function(namedNode){completeChildren=completeChildren.updateImmediateChild(namedNode.name,namedNode.node);});return completeChildren;}else{// We don't have anything to layer on top of. Layer on any children we have
// Note that we can return an empty snap if we have a defined delete
var merge=this.visibleWrites_.childCompoundWrite(treePath);merge.getCompleteChildren().forEach(function(namedNode){completeChildren=completeChildren.updateImmediateChild(namedNode.name,namedNode.node);});return completeChildren;}};/**
     * Given that the underlying server data has updated, determine what, if anything, needs to be
     * applied to the event cache.
     *
     * Possibilities:
     *
     * 1. No writes are shadowing. Events should be raised, the snap to be applied comes from the server data
     *
     * 2. Some write is completely shadowing. No events to be raised
     *
     * 3. Is partially shadowed. Events
     *
     * Either existingEventSnap or existingServerSnap must exist
     *
     * @param {!Path} treePath
     * @param {!Path} childPath
     * @param {?Node} existingEventSnap
     * @param {?Node} existingServerSnap
     * @return {?Node}
     */WriteTree.prototype.calcEventCacheAfterServerOverwrite=function(treePath,childPath,existingEventSnap,existingServerSnap){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(existingEventSnap||existingServerSnap,'Either existingEventSnap or existingServerSnap must exist');var path=treePath.child(childPath);if(this.visibleWrites_.hasCompleteWrite(path)){// At this point we can probably guarantee that we're in case 2, meaning no events
// May need to check visibility while doing the findRootMostValueAndPath call
return null;}else{// No complete shadowing. We're either partially shadowing or not shadowing at all.
var childMerge=this.visibleWrites_.childCompoundWrite(path);if(childMerge.isEmpty()){// We're not shadowing at all. Case 1
return existingServerSnap.getChild(childPath);}else{// This could be more efficient if the serverNode + updates doesn't change the eventSnap
// However this is tricky to find out, since user updates don't necessary change the server
// snap, e.g. priority updates on empty nodes, or deep deletes. Another special case is if the server
// adds nodes, but doesn't change any existing writes. It is therefore not enough to
// only check if the updates change the serverNode.
// Maybe check if the merge tree contains these special cases and only do a full overwrite in that case?
return childMerge.apply(existingServerSnap.getChild(childPath));}}};/**
     * Returns a complete child for a given server snap after applying all user writes or null if there is no
     * complete child for this ChildKey.
     *
     * @param {!Path} treePath
     * @param {!string} childKey
     * @param {!CacheNode} existingServerSnap
     * @return {?Node}
     */WriteTree.prototype.calcCompleteChild=function(treePath,childKey,existingServerSnap){var path=treePath.child(childKey);var shadowingNode=this.visibleWrites_.getCompleteNode(path);if(shadowingNode!=null){return shadowingNode;}else{if(existingServerSnap.isCompleteForChild(childKey)){var childMerge=this.visibleWrites_.childCompoundWrite(path);return childMerge.apply(existingServerSnap.getNode().getImmediateChild(childKey));}else{return null;}}};/**
     * Returns a node if there is a complete overwrite for this path. More specifically, if there is a write at
     * a higher path, this will return the child of that write relative to the write and this path.
     * Returns null if there is no write at this path.
     *
     * @param {!Path} path
     * @return {?Node}
     */WriteTree.prototype.shadowingWrite=function(path){return this.visibleWrites_.getCompleteNode(path);};/**
     * This method is used when processing child remove events on a query. If we can, we pull in children that were outside
     * the window, but may now be in the window.
     *
     * @param {!Path} treePath
     * @param {?Node} completeServerData
     * @param {!NamedNode} startPost
     * @param {!number} count
     * @param {boolean} reverse
     * @param {!Index} index
     * @return {!Array.<!NamedNode>}
     */WriteTree.prototype.calcIndexedSlice=function(treePath,completeServerData,startPost,count,reverse,index){var toIterate;var merge=this.visibleWrites_.childCompoundWrite(treePath);var shadowingNode=merge.getCompleteNode(Path.Empty);if(shadowingNode!=null){toIterate=shadowingNode;}else if(completeServerData!=null){toIterate=merge.apply(completeServerData);}else{// no children to iterate on
return[];}toIterate=toIterate.withIndex(index);if(!toIterate.isEmpty()&&!toIterate.isLeafNode()){var nodes=[];var cmp=index.getCompare();var iter=reverse?toIterate.getReverseIteratorFrom(startPost,index):toIterate.getIteratorFrom(startPost,index);var next=iter.getNext();while(next&&nodes.length<count){if(cmp(next,startPost)!==0){nodes.push(next);}next=iter.getNext();}return nodes;}else{return[];}};/**
     * @param {!WriteRecord} writeRecord
     * @param {!Path} path
     * @return {boolean}
     * @private
     */WriteTree.prototype.recordContainsPath_=function(writeRecord,path){if(writeRecord.snap){return writeRecord.path.contains(path);}else{// findKey can return undefined, so use !! to coerce to boolean
return!!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["p" /* findKey */])(writeRecord.children,function(childSnap,childName){return writeRecord.path.child(childName).contains(path);});}};/**
     * Re-layer the writes and merges into a tree so we can efficiently calculate event snapshots
     * @private
     */WriteTree.prototype.resetTree_=function(){this.visibleWrites_=WriteTree.layerTree_(this.allWrites_,WriteTree.DefaultFilter_,Path.Empty);if(this.allWrites_.length>0){this.lastWriteId_=this.allWrites_[this.allWrites_.length-1].writeId;}else{this.lastWriteId_=-1;}};/**
     * The default filter used when constructing the tree. Keep everything that's visible.
     *
     * @param {!WriteRecord} write
     * @return {boolean}
     * @private
     */WriteTree.DefaultFilter_=function(write){return write.visible;};/**
     * Static method. Given an array of WriteRecords, a filter for which ones to include, and a path, construct the tree of
     * event data at that path.
     *
     * @param {!Array.<!WriteRecord>} writes
     * @param {!function(!WriteRecord):boolean} filter
     * @param {!Path} treeRoot
     * @return {!CompoundWrite}
     * @private
     */WriteTree.layerTree_=function(writes,filter,treeRoot){var compoundWrite=CompoundWrite.Empty;for(var i=0;i<writes.length;++i){var write=writes[i];// Theory, a later set will either:
// a) abort a relevant transaction, so no need to worry about excluding it from calculating that transaction
// b) not be relevant to a transaction (separate branch), so again will not affect the data for that transaction
if(filter(write)){var writePath=write.path;var relativePath=void 0;if(write.snap){if(treeRoot.contains(writePath)){relativePath=Path.relativePath(treeRoot,writePath);compoundWrite=compoundWrite.addWrite(relativePath,write.snap);}else if(writePath.contains(treeRoot)){relativePath=Path.relativePath(writePath,treeRoot);compoundWrite=compoundWrite.addWrite(Path.Empty,write.snap.getChild(relativePath));}else{// There is no overlap between root path and write path, ignore write
}}else if(write.children){if(treeRoot.contains(writePath)){relativePath=Path.relativePath(treeRoot,writePath);compoundWrite=compoundWrite.addWrites(relativePath,write.children);}else if(writePath.contains(treeRoot)){relativePath=Path.relativePath(writePath,treeRoot);if(relativePath.isEmpty()){compoundWrite=compoundWrite.addWrites(Path.Empty,write.children);}else{var child=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(write.children,relativePath.getFront());if(child){// There exists a child in this node that matches the root path
var deepNode=child.getChild(relativePath.popFront());compoundWrite=compoundWrite.addWrite(Path.Empty,deepNode);}}}else{// There is no overlap between root path and write path, ignore write
}}else{throw Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["f" /* assertionError */])('WriteRecord should have .snap or .children');}}}return compoundWrite;};return WriteTree;}();/**
 * A WriteTreeRef wraps a WriteTree and a path, for convenient access to a particular subtree.  All of the methods
 * just proxy to the underlying WriteTree.
 *
 * @constructor
 */var WriteTreeRef=/** @class */function(){/**
     * @param {!Path} path
     * @param {!WriteTree} writeTree
     */function WriteTreeRef(path,writeTree){this.treePath_=path;this.writeTree_=writeTree;}/**
     * If possible, returns a complete event cache, using the underlying server data if possible. In addition, can be used
     * to get a cache that includes hidden writes, and excludes arbitrary writes. Note that customizing the returned node
     * can lead to a more expensive calculation.
     *
     * @param {?Node} completeServerCache
     * @param {Array.<number>=} writeIdsToExclude Optional writes to exclude.
     * @param {boolean=} includeHiddenWrites Defaults to false, whether or not to layer on writes with visible set to false
     * @return {?Node}
     */WriteTreeRef.prototype.calcCompleteEventCache=function(completeServerCache,writeIdsToExclude,includeHiddenWrites){return this.writeTree_.calcCompleteEventCache(this.treePath_,completeServerCache,writeIdsToExclude,includeHiddenWrites);};/**
     * If possible, returns a children node containing all of the complete children we have data for. The returned data is a
     * mix of the given server data and write data.
     *
     * @param {?ChildrenNode} completeServerChildren
     * @return {!ChildrenNode}
     */WriteTreeRef.prototype.calcCompleteEventChildren=function(completeServerChildren){return this.writeTree_.calcCompleteEventChildren(this.treePath_,completeServerChildren);};/**
     * Given that either the underlying server data has updated or the outstanding writes have updated, determine what,
     * if anything, needs to be applied to the event cache.
     *
     * Possibilities:
     *
     * 1. No writes are shadowing. Events should be raised, the snap to be applied comes from the server data
     *
     * 2. Some write is completely shadowing. No events to be raised
     *
     * 3. Is partially shadowed. Events should be raised
     *
     * Either existingEventSnap or existingServerSnap must exist, this is validated via an assert
     *
     * @param {!Path} path
     * @param {?Node} existingEventSnap
     * @param {?Node} existingServerSnap
     * @return {?Node}
     */WriteTreeRef.prototype.calcEventCacheAfterServerOverwrite=function(path,existingEventSnap,existingServerSnap){return this.writeTree_.calcEventCacheAfterServerOverwrite(this.treePath_,path,existingEventSnap,existingServerSnap);};/**
     * Returns a node if there is a complete overwrite for this path. More specifically, if there is a write at
     * a higher path, this will return the child of that write relative to the write and this path.
     * Returns null if there is no write at this path.
     *
     * @param {!Path} path
     * @return {?Node}
     */WriteTreeRef.prototype.shadowingWrite=function(path){return this.writeTree_.shadowingWrite(this.treePath_.child(path));};/**
     * This method is used when processing child remove events on a query. If we can, we pull in children that were outside
     * the window, but may now be in the window
     *
     * @param {?Node} completeServerData
     * @param {!NamedNode} startPost
     * @param {!number} count
     * @param {boolean} reverse
     * @param {!Index} index
     * @return {!Array.<!NamedNode>}
     */WriteTreeRef.prototype.calcIndexedSlice=function(completeServerData,startPost,count,reverse,index){return this.writeTree_.calcIndexedSlice(this.treePath_,completeServerData,startPost,count,reverse,index);};/**
     * Returns a complete child for a given server snap after applying all user writes or null if there is no
     * complete child for this ChildKey.
     *
     * @param {!string} childKey
     * @param {!CacheNode} existingServerCache
     * @return {?Node}
     */WriteTreeRef.prototype.calcCompleteChild=function(childKey,existingServerCache){return this.writeTree_.calcCompleteChild(this.treePath_,childKey,existingServerCache);};/**
     * Return a WriteTreeRef for a child.
     *
     * @param {string} childName
     * @return {!WriteTreeRef}
     */WriteTreeRef.prototype.child=function(childName){return new WriteTreeRef(this.treePath_.child(childName),this.writeTree_);};return WriteTreeRef;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * SyncTree is the central class for managing event callback registration, data caching, views
 * (query processing), and event generation.  There are typically two SyncTree instances for
 * each Repo, one for the normal Firebase data, and one for the .info data.
 *
 * It has a number of responsibilities, including:
 *  - Tracking all user event callbacks (registered via addEventRegistration() and removeEventRegistration()).
 *  - Applying and caching data changes for user set(), transaction(), and update() calls
 *    (applyUserOverwrite(), applyUserMerge()).
 *  - Applying and caching data changes for server data changes (applyServerOverwrite(),
 *    applyServerMerge()).
 *  - Generating user-facing events for server and user changes (all of the apply* methods
 *    return the set of events that need to be raised as a result).
 *  - Maintaining the appropriate set of server listens to ensure we are always subscribed
 *    to the correct set of paths and queries to satisfy the current set of user event
 *    callbacks (listens are started/stopped using the provided listenProvider).
 *
 * NOTE: Although SyncTree tracks event callbacks and calculates events to raise, the actual
 * events are returned to the caller rather than raised synchronously.
 *
 * @constructor
 */var SyncTree=/** @class */function(){/**
     * @param {!ListenProvider} listenProvider_ Used by SyncTree to start / stop listening
     *   to server data.
     */function SyncTree(listenProvider_){this.listenProvider_=listenProvider_;/**
         * Tree of SyncPoints.  There's a SyncPoint at any location that has 1 or more views.
         * @type {!ImmutableTree.<!SyncPoint>}
         * @private
         */this.syncPointTree_=ImmutableTree.Empty;/**
         * A tree of all pending user writes (user-initiated set()'s, transaction()'s, update()'s, etc.).
         * @type {!WriteTree}
         * @private
         */this.pendingWriteTree_=new WriteTree();this.tagToQueryMap_={};this.queryToTagMap_={};}/**
     * Apply the data changes for a user-generated set() or transaction() call.
     *
     * @param {!Path} path
     * @param {!Node} newData
     * @param {number} writeId
     * @param {boolean=} visible
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyUserOverwrite=function(path,newData,writeId,visible){// Record pending write.
this.pendingWriteTree_.addOverwrite(path,newData,writeId,visible);if(!visible){return[];}else{return this.applyOperationToSyncPoints_(new Overwrite(OperationSource.User,path,newData));}};/**
     * Apply the data from a user-generated update() call
     *
     * @param {!Path} path
     * @param {!Object.<string, !Node>} changedChildren
     * @param {!number} writeId
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyUserMerge=function(path,changedChildren,writeId){// Record pending merge.
this.pendingWriteTree_.addMerge(path,changedChildren,writeId);var changeTree=ImmutableTree.fromObject(changedChildren);return this.applyOperationToSyncPoints_(new Merge(OperationSource.User,path,changeTree));};/**
     * Acknowledge a pending user write that was previously registered with applyUserOverwrite() or applyUserMerge().
     *
     * @param {!number} writeId
     * @param {boolean=} revert True if the given write failed and needs to be reverted
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.ackUserWrite=function(writeId,revert){if(revert===void 0){revert=false;}var write=this.pendingWriteTree_.getWrite(writeId);var needToReevaluate=this.pendingWriteTree_.removeWrite(writeId);if(!needToReevaluate){return[];}else{var affectedTree_1=ImmutableTree.Empty;if(write.snap!=null){// overwrite
affectedTree_1=affectedTree_1.set(Path.Empty,true);}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(write.children,function(pathString,node){affectedTree_1=affectedTree_1.set(new Path(pathString),node);});}return this.applyOperationToSyncPoints_(new AckUserWrite(write.path,affectedTree_1,revert));}};/**
     * Apply new server data for the specified path..
     *
     * @param {!Path} path
     * @param {!Node} newData
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyServerOverwrite=function(path,newData){return this.applyOperationToSyncPoints_(new Overwrite(OperationSource.Server,path,newData));};/**
     * Apply new server data to be merged in at the specified path.
     *
     * @param {!Path} path
     * @param {!Object.<string, !Node>} changedChildren
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyServerMerge=function(path,changedChildren){var changeTree=ImmutableTree.fromObject(changedChildren);return this.applyOperationToSyncPoints_(new Merge(OperationSource.Server,path,changeTree));};/**
     * Apply a listen complete for a query
     *
     * @param {!Path} path
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyListenComplete=function(path){return this.applyOperationToSyncPoints_(new ListenComplete(OperationSource.Server,path));};/**
     * Apply new server data for the specified tagged query.
     *
     * @param {!Path} path
     * @param {!Node} snap
     * @param {!number} tag
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyTaggedQueryOverwrite=function(path,snap,tag){var queryKey=this.queryKeyForTag_(tag);if(queryKey!=null){var r=SyncTree.parseQueryKey_(queryKey);var queryPath=r.path,queryId=r.queryId;var relativePath=Path.relativePath(queryPath,path);var op=new Overwrite(OperationSource.forServerTaggedQuery(queryId),relativePath,snap);return this.applyTaggedOperation_(queryPath,op);}else{// Query must have been removed already
return[];}};/**
     * Apply server data to be merged in for the specified tagged query.
     *
     * @param {!Path} path
     * @param {!Object.<string, !Node>} changedChildren
     * @param {!number} tag
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyTaggedQueryMerge=function(path,changedChildren,tag){var queryKey=this.queryKeyForTag_(tag);if(queryKey){var r=SyncTree.parseQueryKey_(queryKey);var queryPath=r.path,queryId=r.queryId;var relativePath=Path.relativePath(queryPath,path);var changeTree=ImmutableTree.fromObject(changedChildren);var op=new Merge(OperationSource.forServerTaggedQuery(queryId),relativePath,changeTree);return this.applyTaggedOperation_(queryPath,op);}else{// We've already removed the query. No big deal, ignore the update
return[];}};/**
     * Apply a listen complete for a tagged query
     *
     * @param {!Path} path
     * @param {!number} tag
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.applyTaggedListenComplete=function(path,tag){var queryKey=this.queryKeyForTag_(tag);if(queryKey){var r=SyncTree.parseQueryKey_(queryKey);var queryPath=r.path,queryId=r.queryId;var relativePath=Path.relativePath(queryPath,path);var op=new ListenComplete(OperationSource.forServerTaggedQuery(queryId),relativePath);return this.applyTaggedOperation_(queryPath,op);}else{// We've already removed the query. No big deal, ignore the update
return[];}};/**
     * Add an event callback for the specified query.
     *
     * @param {!Query} query
     * @param {!EventRegistration} eventRegistration
     * @return {!Array.<!Event>} Events to raise.
     */SyncTree.prototype.addEventRegistration=function(query,eventRegistration){var path=query.path;var serverCache=null;var foundAncestorDefaultView=false;// Any covering writes will necessarily be at the root, so really all we need to find is the server cache.
// Consider optimizing this once there's a better understanding of what actual behavior will be.
this.syncPointTree_.foreachOnPath(path,function(pathToSyncPoint,sp){var relativePath=Path.relativePath(pathToSyncPoint,path);serverCache=serverCache||sp.getCompleteServerCache(relativePath);foundAncestorDefaultView=foundAncestorDefaultView||sp.hasCompleteView();});var syncPoint=this.syncPointTree_.get(path);if(!syncPoint){syncPoint=new SyncPoint();this.syncPointTree_=this.syncPointTree_.set(path,syncPoint);}else{foundAncestorDefaultView=foundAncestorDefaultView||syncPoint.hasCompleteView();serverCache=serverCache||syncPoint.getCompleteServerCache(Path.Empty);}var serverCacheComplete;if(serverCache!=null){serverCacheComplete=true;}else{serverCacheComplete=false;serverCache=ChildrenNode.EMPTY_NODE;var subtree=this.syncPointTree_.subtree(path);subtree.foreachChild(function(childName,childSyncPoint){var completeCache=childSyncPoint.getCompleteServerCache(Path.Empty);if(completeCache){serverCache=serverCache.updateImmediateChild(childName,completeCache);}});}var viewAlreadyExists=syncPoint.viewExistsForQuery(query);if(!viewAlreadyExists&&!query.getQueryParams().loadsAllData()){// We need to track a tag for this query
var queryKey=SyncTree.makeQueryKey_(query);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!(queryKey in this.queryToTagMap_),'View does not exist, but we have a tag');var tag=SyncTree.getNextQueryTag_();this.queryToTagMap_[queryKey]=tag;// Coerce to string to avoid sparse arrays.
this.tagToQueryMap_['_'+tag]=queryKey;}var writesCache=this.pendingWriteTree_.childWrites(path);var events=syncPoint.addEventRegistration(query,eventRegistration,writesCache,serverCache,serverCacheComplete);if(!viewAlreadyExists&&!foundAncestorDefaultView){var view/** @type !View */=syncPoint.viewForQuery(query);events=events.concat(this.setupListener_(query,view));}return events;};/**
     * Remove event callback(s).
     *
     * If query is the default query, we'll check all queries for the specified eventRegistration.
     * If eventRegistration is null, we'll remove all callbacks for the specified query/queries.
     *
     * @param {!Query} query
     * @param {?EventRegistration} eventRegistration If null, all callbacks are removed.
     * @param {Error=} cancelError If a cancelError is provided, appropriate cancel events will be returned.
     * @return {!Array.<!Event>} Cancel events, if cancelError was provided.
     */SyncTree.prototype.removeEventRegistration=function(query,eventRegistration,cancelError){var _this=this;// Find the syncPoint first. Then deal with whether or not it has matching listeners
var path=query.path;var maybeSyncPoint=this.syncPointTree_.get(path);var cancelEvents=[];// A removal on a default query affects all queries at that location. A removal on an indexed query, even one without
// other query constraints, does *not* affect all queries at that location. So this check must be for 'default', and
// not loadsAllData().
if(maybeSyncPoint&&(query.queryIdentifier()==='default'||maybeSyncPoint.viewExistsForQuery(query))){/**
             * @type {{removed: !Array.<!Query>, events: !Array.<!Event>}}
             */var removedAndEvents=maybeSyncPoint.removeEventRegistration(query,eventRegistration,cancelError);if(maybeSyncPoint.isEmpty()){this.syncPointTree_=this.syncPointTree_.remove(path);}var removed=removedAndEvents.removed;cancelEvents=removedAndEvents.events;// We may have just removed one of many listeners and can short-circuit this whole process
// We may also not have removed a default listener, in which case all of the descendant listeners should already be
// properly set up.
//
// Since indexed queries can shadow if they don't have other query constraints, check for loadsAllData(), instead of
// queryId === 'default'
var removingDefault=-1!==removed.findIndex(function(query){return query.getQueryParams().loadsAllData();});var covered=this.syncPointTree_.findOnPath(path,function(relativePath,parentSyncPoint){return parentSyncPoint.hasCompleteView();});if(removingDefault&&!covered){var subtree=this.syncPointTree_.subtree(path);// There are potentially child listeners. Determine what if any listens we need to send before executing the
// removal
if(!subtree.isEmpty()){// We need to fold over our subtree and collect the listeners to send
var newViews=this.collectDistinctViewsForSubTree_(subtree);// Ok, we've collected all the listens we need. Set them up.
for(var i=0;i<newViews.length;++i){var view=newViews[i],newQuery=view.getQuery();var listener=this.createListenerForView_(view);this.listenProvider_.startListening(SyncTree.queryForListening_(newQuery),this.tagForQuery_(newQuery),listener.hashFn,listener.onComplete);}}else{// There's nothing below us, so nothing we need to start listening on
}}// If we removed anything and we're not covered by a higher up listen, we need to stop listening on this query
// The above block has us covered in terms of making sure we're set up on listens lower in the tree.
// Also, note that if we have a cancelError, it's already been removed at the provider level.
if(!covered&&removed.length>0&&!cancelError){// If we removed a default, then we weren't listening on any of the other queries here. Just cancel the one
// default. Otherwise, we need to iterate through and cancel each individual query
if(removingDefault){// We don't tag default listeners
var defaultTag=null;this.listenProvider_.stopListening(SyncTree.queryForListening_(query),defaultTag);}else{removed.forEach(function(queryToRemove){var tagToRemove=_this.queryToTagMap_[SyncTree.makeQueryKey_(queryToRemove)];_this.listenProvider_.stopListening(SyncTree.queryForListening_(queryToRemove),tagToRemove);});}}// Now, clear all of the tags we're tracking for the removed listens
this.removeTags_(removed);}else{// No-op, this listener must've been already removed
}return cancelEvents;};/**
     * Returns a complete cache, if we have one, of the data at a particular path. The location must have a listener above
     * it, but as this is only used by transaction code, that should always be the case anyways.
     *
     * Note: this method will *include* hidden writes from transaction with applyLocally set to false.
     * @param {!Path} path The path to the data we want
     * @param {Array.<number>=} writeIdsToExclude A specific set to be excluded
     * @return {?Node}
     */SyncTree.prototype.calcCompleteEventCache=function(path,writeIdsToExclude){var includeHiddenSets=true;var writeTree=this.pendingWriteTree_;var serverCache=this.syncPointTree_.findOnPath(path,function(pathSoFar,syncPoint){var relativePath=Path.relativePath(pathSoFar,path);var serverCache=syncPoint.getCompleteServerCache(relativePath);if(serverCache){return serverCache;}});return writeTree.calcCompleteEventCache(path,serverCache,writeIdsToExclude,includeHiddenSets);};/**
     * This collapses multiple unfiltered views into a single view, since we only need a single
     * listener for them.
     *
     * @param {!ImmutableTree.<!SyncPoint>} subtree
     * @return {!Array.<!View>}
     * @private
     */SyncTree.prototype.collectDistinctViewsForSubTree_=function(subtree){return subtree.fold(function(relativePath,maybeChildSyncPoint,childMap){if(maybeChildSyncPoint&&maybeChildSyncPoint.hasCompleteView()){var completeView=maybeChildSyncPoint.getCompleteView();return[completeView];}else{// No complete view here, flatten any deeper listens into an array
var views_1=[];if(maybeChildSyncPoint){views_1=maybeChildSyncPoint.getQueryViews();}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(childMap,function(key,childViews){views_1=views_1.concat(childViews);});return views_1;}});};/**
     * @param {!Array.<!Query>} queries
     * @private
     */SyncTree.prototype.removeTags_=function(queries){for(var j=0;j<queries.length;++j){var removedQuery=queries[j];if(!removedQuery.getQueryParams().loadsAllData()){// We should have a tag for this
var removedQueryKey=SyncTree.makeQueryKey_(removedQuery);var removedQueryTag=this.queryToTagMap_[removedQueryKey];delete this.queryToTagMap_[removedQueryKey];delete this.tagToQueryMap_['_'+removedQueryTag];}}};/**
     * Normalizes a query to a query we send the server for listening
     * @param {!Query} query
     * @return {!Query} The normalized query
     * @private
     */SyncTree.queryForListening_=function(query){if(query.getQueryParams().loadsAllData()&&!query.getQueryParams().isDefault()){// We treat queries that load all data as default queries
// Cast is necessary because ref() technically returns Firebase which is actually fb.api.Firebase which inherits
// from Query
return(/** @type {!Query} */query.getRef());}else{return query;}};/**
     * For a given new listen, manage the de-duplication of outstanding subscriptions.
     *
     * @param {!Query} query
     * @param {!View} view
     * @return {!Array.<!Event>} This method can return events to support synchronous data sources
     * @private
     */SyncTree.prototype.setupListener_=function(query,view){var path=query.path;var tag=this.tagForQuery_(query);var listener=this.createListenerForView_(view);var events=this.listenProvider_.startListening(SyncTree.queryForListening_(query),tag,listener.hashFn,listener.onComplete);var subtree=this.syncPointTree_.subtree(path);// The root of this subtree has our query. We're here because we definitely need to send a listen for that, but we
// may need to shadow other listens as well.
if(tag){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!subtree.value.hasCompleteView(),"If we're adding a query, it shouldn't be shadowed");}else{// Shadow everything at or below this location, this is a default listener.
var queriesToStop=subtree.fold(function(relativePath,maybeChildSyncPoint,childMap){if(!relativePath.isEmpty()&&maybeChildSyncPoint&&maybeChildSyncPoint.hasCompleteView()){return[maybeChildSyncPoint.getCompleteView().getQuery()];}else{// No default listener here, flatten any deeper queries into an array
var queries_1=[];if(maybeChildSyncPoint){queries_1=queries_1.concat(maybeChildSyncPoint.getQueryViews().map(function(view){return view.getQuery();}));}Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(childMap,function(key,childQueries){queries_1=queries_1.concat(childQueries);});return queries_1;}});for(var i=0;i<queriesToStop.length;++i){var queryToStop=queriesToStop[i];this.listenProvider_.stopListening(SyncTree.queryForListening_(queryToStop),this.tagForQuery_(queryToStop));}}return events;};/**
     *
     * @param {!View} view
     * @return {{hashFn: function(), onComplete: function(!string, *)}}
     * @private
     */SyncTree.prototype.createListenerForView_=function(view){var _this=this;var query=view.getQuery();var tag=this.tagForQuery_(query);return{hashFn:function hashFn(){var cache=view.getServerCache()||ChildrenNode.EMPTY_NODE;return cache.hash();},onComplete:function onComplete(status){if(status==='ok'){if(tag){return _this.applyTaggedListenComplete(query.path,tag);}else{return _this.applyListenComplete(query.path);}}else{// If a listen failed, kill all of the listeners here, not just the one that triggered the error.
// Note that this may need to be scoped to just this listener if we change permissions on filtered children
var error$$1=errorForServerCode(status,query);return _this.removeEventRegistration(query,/*eventRegistration*/null,error$$1);}}};};/**
     * Given a query, computes a "queryKey" suitable for use in our queryToTagMap_.
     * @private
     * @param {!Query} query
     * @return {string}
     */SyncTree.makeQueryKey_=function(query){return query.path.toString()+'$'+query.queryIdentifier();};/**
     * Given a queryKey (created by makeQueryKey), parse it back into a path and queryId.
     * @private
     * @param {!string} queryKey
     * @return {{queryId: !string, path: !Path}}
     */SyncTree.parseQueryKey_=function(queryKey){var splitIndex=queryKey.indexOf('$');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(splitIndex!==-1&&splitIndex<queryKey.length-1,'Bad queryKey.');return{queryId:queryKey.substr(splitIndex+1),path:new Path(queryKey.substr(0,splitIndex))};};/**
     * Return the query associated with the given tag, if we have one
     * @param {!number} tag
     * @return {?string}
     * @private
     */SyncTree.prototype.queryKeyForTag_=function(tag){return this.tagToQueryMap_['_'+tag];};/**
     * Return the tag associated with the given query.
     * @param {!Query} query
     * @return {?number}
     * @private
     */SyncTree.prototype.tagForQuery_=function(query){var queryKey=SyncTree.makeQueryKey_(query);return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.queryToTagMap_,queryKey);};/**
     * Static accessor for query tags.
     * @return {number}
     * @private
     */SyncTree.getNextQueryTag_=function(){return SyncTree.nextQueryTag_++;};/**
     * A helper method to apply tagged operations
     *
     * @param {!Path} queryPath
     * @param {!Operation} operation
     * @return {!Array.<!Event>}
     * @private
     */SyncTree.prototype.applyTaggedOperation_=function(queryPath,operation){var syncPoint=this.syncPointTree_.get(queryPath);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(syncPoint,"Missing sync point for query tag that we're tracking");var writesCache=this.pendingWriteTree_.childWrites(queryPath);return syncPoint.applyOperation(operation,writesCache,/*serverCache=*/null);};/**
     * A helper method that visits all descendant and ancestor SyncPoints, applying the operation.
     *
     * NOTES:
     * - Descendant SyncPoints will be visited first (since we raise events depth-first).
  
     * - We call applyOperation() on each SyncPoint passing three things:
     *   1. A version of the Operation that has been made relative to the SyncPoint location.
     *   2. A WriteTreeRef of any writes we have cached at the SyncPoint location.
     *   3. A snapshot Node with cached server data, if we have it.
  
     * - We concatenate all of the events returned by each SyncPoint and return the result.
     *
     * @param {!Operation} operation
     * @return {!Array.<!Event>}
     * @private
     */SyncTree.prototype.applyOperationToSyncPoints_=function(operation){return this.applyOperationHelper_(operation,this.syncPointTree_,/*serverCache=*/null,this.pendingWriteTree_.childWrites(Path.Empty));};/**
     * Recursive helper for applyOperationToSyncPoints_
     *
     * @private
     * @param {!Operation} operation
     * @param {ImmutableTree.<!SyncPoint>} syncPointTree
     * @param {?Node} serverCache
     * @param {!WriteTreeRef} writesCache
     * @return {!Array.<!Event>}
     */SyncTree.prototype.applyOperationHelper_=function(operation,syncPointTree,serverCache,writesCache){if(operation.path.isEmpty()){return this.applyOperationDescendantsHelper_(operation,syncPointTree,serverCache,writesCache);}else{var syncPoint=syncPointTree.get(Path.Empty);// If we don't have cached server data, see if we can get it from this SyncPoint.
if(serverCache==null&&syncPoint!=null){serverCache=syncPoint.getCompleteServerCache(Path.Empty);}var events=[];var childName=operation.path.getFront();var childOperation=operation.operationForChild(childName);var childTree=syncPointTree.children.get(childName);if(childTree&&childOperation){var childServerCache=serverCache?serverCache.getImmediateChild(childName):null;var childWritesCache=writesCache.child(childName);events=events.concat(this.applyOperationHelper_(childOperation,childTree,childServerCache,childWritesCache));}if(syncPoint){events=events.concat(syncPoint.applyOperation(operation,writesCache,serverCache));}return events;}};/**
     * Recursive helper for applyOperationToSyncPoints_
     *
     * @private
     * @param {!Operation} operation
     * @param {ImmutableTree.<!SyncPoint>} syncPointTree
     * @param {?Node} serverCache
     * @param {!WriteTreeRef} writesCache
     * @return {!Array.<!Event>}
     */SyncTree.prototype.applyOperationDescendantsHelper_=function(operation,syncPointTree,serverCache,writesCache){var _this=this;var syncPoint=syncPointTree.get(Path.Empty);// If we don't have cached server data, see if we can get it from this SyncPoint.
if(serverCache==null&&syncPoint!=null){serverCache=syncPoint.getCompleteServerCache(Path.Empty);}var events=[];syncPointTree.children.inorderTraversal(function(childName,childTree){var childServerCache=serverCache?serverCache.getImmediateChild(childName):null;var childWritesCache=writesCache.child(childName);var childOperation=operation.operationForChild(childName);if(childOperation){events=events.concat(_this.applyOperationDescendantsHelper_(childOperation,childTree,childServerCache,childWritesCache));}});if(syncPoint){events=events.concat(syncPoint.applyOperation(operation,writesCache,serverCache));}return events;};/**
     * Static tracker for next query tag.
     * @type {number}
     * @private
     */SyncTree.nextQueryTag_=1;return SyncTree;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Mutable object which basically just stores a reference to the "latest" immutable snapshot.
 *
 * @constructor
 */var SnapshotHolder=/** @class */function(){function SnapshotHolder(){this.rootNode_=ChildrenNode.EMPTY_NODE;}SnapshotHolder.prototype.getNode=function(path){return this.rootNode_.getChild(path);};SnapshotHolder.prototype.updateSnapshot=function(path,newSnapshotNode){this.rootNode_=this.rootNode_.updateChild(path,newSnapshotNode);};return SnapshotHolder;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Abstraction around FirebaseApp's token fetching capabilities.
 */var AuthTokenProvider=/** @class */function(){/**
     * @param {!FirebaseApp} app_
     */function AuthTokenProvider(app_){this.app_=app_;}/**
     * @param {boolean} forceRefresh
     * @return {!Promise<FirebaseAuthTokenData>}
     */AuthTokenProvider.prototype.getToken=function(forceRefresh){return this.app_['INTERNAL']['getToken'](forceRefresh).then(null,// .catch
function(error$$1){// TODO: Need to figure out all the cases this is raised and whether
// this makes sense.
if(error$$1&&error$$1.code==='auth/token-not-initialized'){log('Got auth/token-not-initialized error.  Treating as null token.');return null;}else{return Promise.reject(error$$1);}});};AuthTokenProvider.prototype.addTokenChangeListener=function(listener){// TODO: We might want to wrap the listener and call it with no args to
// avoid a leaky abstraction, but that makes removing the listener harder.
this.app_['INTERNAL']['addAuthTokenListener'](listener);};AuthTokenProvider.prototype.removeTokenChangeListener=function(listener){this.app_['INTERNAL']['removeAuthTokenListener'](listener);};AuthTokenProvider.prototype.notifyForInvalidToken=function(){var errorMessage='Provided authentication credentials for the app named "'+this.app_.name+'" are invalid. This usually indicates your app was not '+'initialized correctly. ';if('credential'in this.app_.options){errorMessage+='Make sure the "credential" property provided to initializeApp() '+'is authorized to access the specified "databaseURL" and is from the correct '+'project.';}else if('serviceAccount'in this.app_.options){errorMessage+='Make sure the "serviceAccount" property provided to initializeApp() '+'is authorized to access the specified "databaseURL" and is from the correct '+'project.';}else{errorMessage+='Make sure the "apiKey" and "databaseURL" properties provided to '+'initializeApp() match the values provided for your app at '+'https://console.firebase.google.com/.';}warn(errorMessage);};return AuthTokenProvider;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Tracks a collection of stats.
 *
 * @constructor
 */var StatsCollection=/** @class */function(){function StatsCollection(){this.counters_={};}StatsCollection.prototype.incrementCounter=function(name,amount){if(amount===void 0){amount=1;}if(!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.counters_,name))this.counters_[name]=0;this.counters_[name]+=amount;};StatsCollection.prototype.get=function(){return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["l" /* deepCopy */])(this.counters_);};return StatsCollection;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var StatsManager=/** @class */function(){function StatsManager(){}StatsManager.getCollection=function(repoInfo){var hashString=repoInfo.toString();if(!this.collections_[hashString]){this.collections_[hashString]=new StatsCollection();}return this.collections_[hashString];};StatsManager.getOrCreateReporter=function(repoInfo,creatorFunction){var hashString=repoInfo.toString();if(!this.reporters_[hashString]){this.reporters_[hashString]=creatorFunction();}return this.reporters_[hashString];};StatsManager.collections_={};StatsManager.reporters_={};return StatsManager;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Returns the delta from the previous call to get stats.
 *
 * @param collection_ The collection to "listen" to.
 * @constructor
 */var StatsListener=/** @class */function(){function StatsListener(collection_){this.collection_=collection_;this.last_=null;}StatsListener.prototype.get=function(){var newStats=this.collection_.get();var delta=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["i" /* clone */])(newStats);if(this.last_){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.last_,function(stat,value){delta[stat]=delta[stat]-value;});}this.last_=newStats;return delta;};return StatsListener;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// Assuming some apps may have a short amount of time on page, and a bulk of firebase operations probably
// happen on page load, we try to report our first set of stats pretty quickly, but we wait at least 10
// seconds to try to ensure the Firebase connection is established / settled.
var FIRST_STATS_MIN_TIME=10*1000;var FIRST_STATS_MAX_TIME=30*1000;// We'll continue to report stats on average every 5 minutes.
var REPORT_STATS_INTERVAL=5*60*1000;/**
 * @constructor
 */var StatsReporter=/** @class */function(){/**
     * @param collection
     * @param server_
     */function StatsReporter(collection,server_){this.server_=server_;this.statsToReport_={};this.statsListener_=new StatsListener(collection);var timeout=FIRST_STATS_MIN_TIME+(FIRST_STATS_MAX_TIME-FIRST_STATS_MIN_TIME)*Math.random();setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(timeout));}StatsReporter.prototype.includeStat=function(stat){this.statsToReport_[stat]=true;};StatsReporter.prototype.reportStats_=function(){var _this=this;var stats=this.statsListener_.get();var reportedStats={};var haveStatsToReport=false;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(stats,function(stat,value){if(value>0&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(_this.statsToReport_,stat)){reportedStats[stat]=value;haveStatsToReport=true;}});if(haveStatsToReport){this.server_.reportStats(reportedStats);}// queue our next run.
setTimeoutNonBlocking(this.reportStats_.bind(this),Math.floor(Math.random()*2*REPORT_STATS_INTERVAL));};return StatsReporter;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * The event queue serves a few purposes:
 * 1. It ensures we maintain event order in the face of event callbacks doing operations that result in more
 *    events being queued.
 * 2. raiseQueuedEvents() handles being called reentrantly nicely.  That is, if in the course of raising events,
 *    raiseQueuedEvents() is called again, the "inner" call will pick up raising events where the "outer" call
 *    left off, ensuring that the events are still raised synchronously and in order.
 * 3. You can use raiseEventsAtPath and raiseEventsForChangedPath to ensure only relevant previously-queued
 *    events are raised synchronously.
 *
 * NOTE: This can all go away if/when we move to async events.
 *
 * @constructor
 */var EventQueue=/** @class */function(){function EventQueue(){/**
         * @private
         * @type {!Array.<EventList>}
         */this.eventLists_=[];/**
         * Tracks recursion depth of raiseQueuedEvents_, for debugging purposes.
         * @private
         * @type {!number}
         */this.recursionDepth_=0;}/**
     * @param {!Array.<Event>} eventDataList The new events to queue.
     */EventQueue.prototype.queueEvents=function(eventDataList){// We group events by path, storing them in a single EventList, to make it easier to skip over them quickly.
var currList=null;for(var i=0;i<eventDataList.length;i++){var eventData=eventDataList[i];var eventPath=eventData.getPath();if(currList!==null&&!eventPath.equals(currList.getPath())){this.eventLists_.push(currList);currList=null;}if(currList===null){currList=new EventList(eventPath);}currList.add(eventData);}if(currList){this.eventLists_.push(currList);}};/**
     * Queues the specified events and synchronously raises all events (including previously queued ones)
     * for the specified path.
     *
     * It is assumed that the new events are all for the specified path.
     *
     * @param {!Path} path The path to raise events for.
     * @param {!Array.<Event>} eventDataList The new events to raise.
     */EventQueue.prototype.raiseEventsAtPath=function(path,eventDataList){this.queueEvents(eventDataList);this.raiseQueuedEventsMatchingPredicate_(function(eventPath){return eventPath.equals(path);});};/**
     * Queues the specified events and synchronously raises all events (including previously queued ones) for
     * locations related to the specified change path (i.e. all ancestors and descendants).
     *
     * It is assumed that the new events are all related (ancestor or descendant) to the specified path.
     *
     * @param {!Path} changedPath The path to raise events for.
     * @param {!Array.<!Event>} eventDataList The events to raise
     */EventQueue.prototype.raiseEventsForChangedPath=function(changedPath,eventDataList){this.queueEvents(eventDataList);this.raiseQueuedEventsMatchingPredicate_(function(eventPath){return eventPath.contains(changedPath)||changedPath.contains(eventPath);});};/**
     * @param {!function(!Path):boolean} predicate
     * @private
     */EventQueue.prototype.raiseQueuedEventsMatchingPredicate_=function(predicate){this.recursionDepth_++;var sentAll=true;for(var i=0;i<this.eventLists_.length;i++){var eventList=this.eventLists_[i];if(eventList){var eventPath=eventList.getPath();if(predicate(eventPath)){this.eventLists_[i].raise();this.eventLists_[i]=null;}else{sentAll=false;}}}if(sentAll){this.eventLists_=[];}this.recursionDepth_--;};return EventQueue;}();/**
 * @param {!Path} path
 * @constructor
 */var EventList=/** @class */function(){function EventList(path_){this.path_=path_;/**
         * @type {!Array.<Event>}
         * @private
         */this.events_=[];}/**
     * @param {!Event} eventData
     */EventList.prototype.add=function(eventData){this.events_.push(eventData);};/**
     * Iterates through the list and raises each event
     */EventList.prototype.raise=function(){for(var i=0;i<this.events_.length;i++){var eventData=this.events_[i];if(eventData!==null){this.events_[i]=null;var eventFn=eventData.getEventRunner();if(logger){log('event: '+eventData.toString());}exceptionGuard(eventFn);}}};/**
     * @return {!Path}
     */EventList.prototype.getPath=function(){return this.path_;};return EventList;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Base class to be used if you want to emit events. Call the constructor with
 * the set of allowed event names.
 */var EventEmitter=/** @class */function(){/**
     * @param {!Array.<string>} allowedEvents_
     */function EventEmitter(allowedEvents_){this.allowedEvents_=allowedEvents_;this.listeners_={};Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(Array.isArray(allowedEvents_)&&allowedEvents_.length>0,'Requires a non-empty array');}/**
     * To be called by derived classes to trigger events.
     * @param {!string} eventType
     * @param {...*} var_args
     */EventEmitter.prototype.trigger=function(eventType){var var_args=[];for(var _i=1;_i<arguments.length;_i++){var_args[_i-1]=arguments[_i];}if(Array.isArray(this.listeners_[eventType])){// Clone the list, since callbacks could add/remove listeners.
var listeners=this.listeners_[eventType].slice();for(var i=0;i<listeners.length;i++){listeners[i].callback.apply(listeners[i].context,var_args);}}};EventEmitter.prototype.on=function(eventType,callback,context){this.validateEventType_(eventType);this.listeners_[eventType]=this.listeners_[eventType]||[];this.listeners_[eventType].push({callback:callback,context:context});var eventData=this.getInitialEvent(eventType);if(eventData){callback.apply(context,eventData);}};EventEmitter.prototype.off=function(eventType,callback,context){this.validateEventType_(eventType);var listeners=this.listeners_[eventType]||[];for(var i=0;i<listeners.length;i++){if(listeners[i].callback===callback&&(!context||context===listeners[i].context)){listeners.splice(i,1);return;}}};EventEmitter.prototype.validateEventType_=function(eventType){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.allowedEvents_.find(function(et){return et===eventType;}),'Unknown event: '+eventType);};return EventEmitter;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @extends {EventEmitter}
 */var VisibilityMonitor=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(VisibilityMonitor,_super);function VisibilityMonitor(){var _this=_super.call(this,['visible'])||this;var hidden;var visibilityChange;if(typeof document!=='undefined'&&typeof document.addEventListener!=='undefined'){if(typeof document['hidden']!=='undefined'){// Opera 12.10 and Firefox 18 and later support
visibilityChange='visibilitychange';hidden='hidden';}else if(typeof document['mozHidden']!=='undefined'){visibilityChange='mozvisibilitychange';hidden='mozHidden';}else if(typeof document['msHidden']!=='undefined'){visibilityChange='msvisibilitychange';hidden='msHidden';}else if(typeof document['webkitHidden']!=='undefined'){visibilityChange='webkitvisibilitychange';hidden='webkitHidden';}}// Initially, we always assume we are visible. This ensures that in browsers
// without page visibility support or in cases where we are never visible
// (e.g. chrome extension), we act as if we are visible, i.e. don't delay
// reconnects
_this.visible_=true;if(visibilityChange){document.addEventListener(visibilityChange,function(){var visible=!document[hidden];if(visible!==_this.visible_){_this.visible_=visible;_this.trigger('visible',visible);}},false);}return _this;}VisibilityMonitor.getInstance=function(){return new VisibilityMonitor();};/**
     * @param {!string} eventType
     * @return {Array.<boolean>}
     */VisibilityMonitor.prototype.getInitialEvent=function(eventType){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(eventType==='visible','Unknown event type: '+eventType);return[this.visible_];};return VisibilityMonitor;}(EventEmitter);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Monitors online state (as reported by window.online/offline events).
 *
 * The expectation is that this could have many false positives (thinks we are online
 * when we're not), but no false negatives.  So we can safely use it to determine when
 * we definitely cannot reach the internet.
 *
 * @extends {EventEmitter}
 */var OnlineMonitor=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(OnlineMonitor,_super);function OnlineMonitor(){var _this=_super.call(this,['online'])||this;_this.online_=true;// We've had repeated complaints that Cordova apps can get stuck "offline", e.g.
// https://forum.ionicframework.com/t/firebase-connection-is-lost-and-never-come-back/43810
// It would seem that the 'online' event does not always fire consistently. So we disable it
// for Cordova.
if(typeof window!=='undefined'&&typeof window.addEventListener!=='undefined'&&!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["x" /* isMobileCordova */])()){window.addEventListener('online',function(){if(!_this.online_){_this.online_=true;_this.trigger('online',true);}},false);window.addEventListener('offline',function(){if(_this.online_){_this.online_=false;_this.trigger('online',false);}},false);}return _this;}OnlineMonitor.getInstance=function(){return new OnlineMonitor();};/**
     * @param {!string} eventType
     * @return {Array.<boolean>}
     */OnlineMonitor.prototype.getInitialEvent=function(eventType){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(eventType==='online','Unknown event type: '+eventType);return[this.online_];};/**
     * @return {boolean}
     */OnlineMonitor.prototype.currentlyOnline=function(){return this.online_;};return OnlineMonitor;}(EventEmitter);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * This class ensures the packets from the server arrive in order
 * This class takes data from the server and ensures it gets passed into the callbacks in order.
 * @constructor
 */var PacketReceiver=/** @class */function(){/**
     * @param onMessage_
     */function PacketReceiver(onMessage_){this.onMessage_=onMessage_;this.pendingResponses=[];this.currentResponseNum=0;this.closeAfterResponse=-1;this.onClose=null;}PacketReceiver.prototype.closeAfter=function(responseNum,callback){this.closeAfterResponse=responseNum;this.onClose=callback;if(this.closeAfterResponse<this.currentResponseNum){this.onClose();this.onClose=null;}};/**
     * Each message from the server comes with a response number, and an array of data. The responseNumber
     * allows us to ensure that we process them in the right order, since we can't be guaranteed that all
     * browsers will respond in the same order as the requests we sent
     * @param {number} requestNum
     * @param {Array} data
     */PacketReceiver.prototype.handleResponse=function(requestNum,data){var _this=this;this.pendingResponses[requestNum]=data;var _loop_1=function _loop_1(){var toProcess=this_1.pendingResponses[this_1.currentResponseNum];delete this_1.pendingResponses[this_1.currentResponseNum];var _loop_2=function _loop_2(i){if(toProcess[i]){exceptionGuard(function(){_this.onMessage_(toProcess[i]);});}};for(var i=0;i<toProcess.length;++i){_loop_2(i);}if(this_1.currentResponseNum===this_1.closeAfterResponse){if(this_1.onClose){this_1.onClose();this_1.onClose=null;}return"break";}this_1.currentResponseNum++;};var this_1=this;while(this.pendingResponses[this.currentResponseNum]){var state_1=_loop_1();if(state_1==="break")break;}};return PacketReceiver;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// URL query parameters associated with longpolling
var FIREBASE_LONGPOLL_START_PARAM='start';var FIREBASE_LONGPOLL_CLOSE_COMMAND='close';var FIREBASE_LONGPOLL_COMMAND_CB_NAME='pLPCommand';var FIREBASE_LONGPOLL_DATA_CB_NAME='pRTLPCB';var FIREBASE_LONGPOLL_ID_PARAM='id';var FIREBASE_LONGPOLL_PW_PARAM='pw';var FIREBASE_LONGPOLL_SERIAL_PARAM='ser';var FIREBASE_LONGPOLL_CALLBACK_ID_PARAM='cb';var FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM='seg';var FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET='ts';var FIREBASE_LONGPOLL_DATA_PARAM='d';var FIREBASE_LONGPOLL_DISCONN_FRAME_PARAM='disconn';var FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM='dframe';//Data size constants.
//TODO: Perf: the maximum length actually differs from browser to browser.
// We should check what browser we're on and set accordingly.
var MAX_URL_DATA_SIZE=1870;var SEG_HEADER_SIZE=30;//ie: &seg=8299234&ts=982389123&d=
var MAX_PAYLOAD_SIZE=MAX_URL_DATA_SIZE-SEG_HEADER_SIZE;/**
 * Keepalive period
 * send a fresh request at minimum every 25 seconds. Opera has a maximum request
 * length of 30 seconds that we can't exceed.
 * @const
 * @type {number}
 */var KEEPALIVE_REQUEST_INTERVAL=25000;/**
 * How long to wait before aborting a long-polling connection attempt.
 * @const
 * @type {number}
 */var LP_CONNECT_TIMEOUT=30000;/**
 * This class manages a single long-polling connection.
 *
 * @constructor
 * @implements {Transport}
 */var BrowserPollConnection=/** @class */function(){/**
     * @param {string} connId An identifier for this connection, used for logging
     * @param {RepoInfo} repoInfo The info for the endpoint to send data to.
     * @param {string=} transportSessionId Optional transportSessionid if we are reconnecting for an existing
     *                                         transport session
     * @param {string=}  lastSessionId Optional lastSessionId if the PersistentConnection has already created a
     *                                     connection previously
     */function BrowserPollConnection(connId,repoInfo,transportSessionId,lastSessionId){this.connId=connId;this.repoInfo=repoInfo;this.transportSessionId=transportSessionId;this.lastSessionId=lastSessionId;this.bytesSent=0;this.bytesReceived=0;this.everConnected_=false;this.log_=logWrapper(connId);this.stats_=StatsManager.getCollection(repoInfo);this.urlFn=function(params){return repoInfo.connectionURL(LONG_POLLING,params);};}/**
     *
     * @param {function(Object)} onMessage Callback when messages arrive
     * @param {function()} onDisconnect Callback with connection lost.
     */BrowserPollConnection.prototype.open=function(onMessage,onDisconnect){var _this=this;this.curSegmentNum=0;this.onDisconnect_=onDisconnect;this.myPacketOrderer=new PacketReceiver(onMessage);this.isClosed_=false;this.connectTimeoutTimer_=setTimeout(function(){_this.log_('Timed out trying to connect.');// Make sure we clear the host cache
_this.onClosed_();_this.connectTimeoutTimer_=null;},Math.floor(LP_CONNECT_TIMEOUT));// Ensure we delay the creation of the iframe until the DOM is loaded.
executeWhenDOMReady(function(){if(_this.isClosed_)return;//Set up a callback that gets triggered once a connection is set up.
_this.scriptTagHolder=new FirebaseIFrameScriptHolder(function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i]=arguments[_i];}var command=args[0],arg1=args[1],arg2=args[2];_this.incrementIncomingBytes_(args);if(!_this.scriptTagHolder)return;// we closed the connection.
if(_this.connectTimeoutTimer_){clearTimeout(_this.connectTimeoutTimer_);_this.connectTimeoutTimer_=null;}_this.everConnected_=true;if(command==FIREBASE_LONGPOLL_START_PARAM){_this.id=arg1;_this.password=arg2;}else if(command===FIREBASE_LONGPOLL_CLOSE_COMMAND){// Don't clear the host cache. We got a response from the server, so we know it's reachable
if(arg1){// We aren't expecting any more data (other than what the server's already in the process of sending us
// through our already open polls), so don't send any more.
_this.scriptTagHolder.sendNewPolls=false;// arg1 in this case is the last response number sent by the server. We should try to receive
// all of the responses up to this one before closing
_this.myPacketOrderer.closeAfter(arg1,function(){_this.onClosed_();});}else{_this.onClosed_();}}else{throw new Error('Unrecognized command received: '+command);}},function(){var args=[];for(var _i=0;_i<arguments.length;_i++){args[_i]=arguments[_i];}var pN=args[0],data=args[1];_this.incrementIncomingBytes_(args);_this.myPacketOrderer.handleResponse(pN,data);},function(){_this.onClosed_();},_this.urlFn);//Send the initial request to connect. The serial number is simply to keep the browser from pulling previous results
//from cache.
var urlParams={};urlParams[FIREBASE_LONGPOLL_START_PARAM]='t';urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM]=Math.floor(Math.random()*100000000);if(_this.scriptTagHolder.uniqueCallbackIdentifier)urlParams[FIREBASE_LONGPOLL_CALLBACK_ID_PARAM]=_this.scriptTagHolder.uniqueCallbackIdentifier;urlParams[VERSION_PARAM]=PROTOCOL_VERSION;if(_this.transportSessionId){urlParams[TRANSPORT_SESSION_PARAM]=_this.transportSessionId;}if(_this.lastSessionId){urlParams[LAST_SESSION_PARAM]=_this.lastSessionId;}if(!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()&&typeof location!=='undefined'&&location.href&&location.href.indexOf(FORGE_DOMAIN)!==-1){urlParams[REFERER_PARAM]=FORGE_REF;}var connectURL=_this.urlFn(urlParams);_this.log_('Connecting via long-poll to '+connectURL);_this.scriptTagHolder.addTag(connectURL,function(){/* do nothing */});});};/**
     * Call this when a handshake has completed successfully and we want to consider the connection established
     */BrowserPollConnection.prototype.start=function(){this.scriptTagHolder.startLongPoll(this.id,this.password);this.addDisconnectPingFrame(this.id,this.password);};/**
     * Forces long polling to be considered as a potential transport
     */BrowserPollConnection.forceAllow=function(){BrowserPollConnection.forceAllow_=true;};/**
     * Forces longpolling to not be considered as a potential transport
     */BrowserPollConnection.forceDisallow=function(){BrowserPollConnection.forceDisallow_=true;};// Static method, use string literal so it can be accessed in a generic way
BrowserPollConnection.isAvailable=function(){// NOTE: In React-Native there's normally no 'document', but if you debug a React-Native app in
// the Chrome debugger, 'document' is defined, but document.createElement is null (2015/06/08).
return BrowserPollConnection.forceAllow_||!BrowserPollConnection.forceDisallow_&&typeof document!=='undefined'&&document.createElement!=null&&!isChromeExtensionContentScript()&&!isWindowsStoreApp()&&!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])();};/**
     * No-op for polling
     */BrowserPollConnection.prototype.markConnectionHealthy=function(){};/**
     * Stops polling and cleans up the iframe
     * @private
     */BrowserPollConnection.prototype.shutdown_=function(){this.isClosed_=true;if(this.scriptTagHolder){this.scriptTagHolder.close();this.scriptTagHolder=null;}//remove the disconnect frame, which will trigger an XHR call to the server to tell it we're leaving.
if(this.myDisconnFrame){document.body.removeChild(this.myDisconnFrame);this.myDisconnFrame=null;}if(this.connectTimeoutTimer_){clearTimeout(this.connectTimeoutTimer_);this.connectTimeoutTimer_=null;}};/**
     * Triggered when this transport is closed
     * @private
     */BrowserPollConnection.prototype.onClosed_=function(){if(!this.isClosed_){this.log_('Longpoll is closing itself');this.shutdown_();if(this.onDisconnect_){this.onDisconnect_(this.everConnected_);this.onDisconnect_=null;}}};/**
     * External-facing close handler. RealTime has requested we shut down. Kill our connection and tell the server
     * that we've left.
     */BrowserPollConnection.prototype.close=function(){if(!this.isClosed_){this.log_('Longpoll is being closed.');this.shutdown_();}};/**
     * Send the JSON object down to the server. It will need to be stringified, base64 encoded, and then
     * broken into chunks (since URLs have a small maximum length).
     * @param {!Object} data The JSON data to transmit.
     */BrowserPollConnection.prototype.send=function(data){var dataStr=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(data);this.bytesSent+=dataStr.length;this.stats_.incrementCounter('bytes_sent',dataStr.length);//first, lets get the base64-encoded data
var base64data=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["h" /* base64Encode */])(dataStr);//We can only fit a certain amount in each URL, so we need to split this request
//up into multiple pieces if it doesn't fit in one request.
var dataSegs=splitStringBySize(base64data,MAX_PAYLOAD_SIZE);//Enqueue each segment for transmission. We assign each chunk a sequential ID and a total number
//of segments so that we can reassemble the packet on the server.
for(var i=0;i<dataSegs.length;i++){this.scriptTagHolder.enqueueSegment(this.curSegmentNum,dataSegs.length,dataSegs[i]);this.curSegmentNum++;}};/**
     * This is how we notify the server that we're leaving.
     * We aren't able to send requests with DHTML on a window close event, but we can
     * trigger XHR requests in some browsers (everything but Opera basically).
     * @param {!string} id
     * @param {!string} pw
     */BrowserPollConnection.prototype.addDisconnectPingFrame=function(id,pw){if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])())return;this.myDisconnFrame=document.createElement('iframe');var urlParams={};urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_REQUEST_PARAM]='t';urlParams[FIREBASE_LONGPOLL_ID_PARAM]=id;urlParams[FIREBASE_LONGPOLL_PW_PARAM]=pw;this.myDisconnFrame.src=this.urlFn(urlParams);this.myDisconnFrame.style.display='none';document.body.appendChild(this.myDisconnFrame);};/**
     * Used to track the bytes received by this client
     * @param {*} args
     * @private
     */BrowserPollConnection.prototype.incrementIncomingBytes_=function(args){// TODO: This is an annoying perf hit just to track the number of incoming bytes.  Maybe it should be opt-in.
var bytesReceived=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(args).length;this.bytesReceived+=bytesReceived;this.stats_.incrementCounter('bytes_received',bytesReceived);};return BrowserPollConnection;}();/*********************************************************************************************
 * A wrapper around an iframe that is used as a long-polling script holder.
 * @constructor
 *********************************************************************************************/var FirebaseIFrameScriptHolder=/** @class */function(){/**
     * @param commandCB - The callback to be called when control commands are recevied from the server.
     * @param onMessageCB - The callback to be triggered when responses arrive from the server.
     * @param onDisconnect - The callback to be triggered when this tag holder is closed
     * @param urlFn - A function that provides the URL of the endpoint to send data to.
     */function FirebaseIFrameScriptHolder(commandCB,onMessageCB,onDisconnect,urlFn){this.onDisconnect=onDisconnect;this.urlFn=urlFn;//We maintain a count of all of the outstanding requests, because if we have too many active at once it can cause
//problems in some browsers.
/**
         * @type {CountedSet.<number, number>}
         */this.outstandingRequests=new CountedSet();//A queue of the pending segments waiting for transmission to the server.
this.pendingSegs=[];//A serial number. We use this for two things:
// 1) A way to ensure the browser doesn't cache responses to polls
// 2) A way to make the server aware when long-polls arrive in a different order than we started them. The
//    server needs to release both polls in this case or it will cause problems in Opera since Opera can only execute
//    JSONP code in the order it was added to the iframe.
this.currentSerial=Math.floor(Math.random()*100000000);// This gets set to false when we're "closing down" the connection (e.g. we're switching transports but there's still
// incoming data from the server that we're waiting for).
this.sendNewPolls=true;if(!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()){//Each script holder registers a couple of uniquely named callbacks with the window. These are called from the
//iframes where we put the long-polling script tags. We have two callbacks:
//   1) Command Callback - Triggered for control issues, like starting a connection.
//   2) Message Callback - Triggered when new data arrives.
this.uniqueCallbackIdentifier=LUIDGenerator();window[FIREBASE_LONGPOLL_COMMAND_CB_NAME+this.uniqueCallbackIdentifier]=commandCB;window[FIREBASE_LONGPOLL_DATA_CB_NAME+this.uniqueCallbackIdentifier]=onMessageCB;//Create an iframe for us to add script tags to.
this.myIFrame=FirebaseIFrameScriptHolder.createIFrame_();// Set the iframe's contents.
var script='';// if we set a javascript url, it's IE and we need to set the document domain. The javascript url is sufficient
// for ie9, but ie8 needs to do it again in the document itself.
if(this.myIFrame.src&&this.myIFrame.src.substr(0,'javascript:'.length)==='javascript:'){var currentDomain=document.domain;script='<script>document.domain="'+currentDomain+'";</script>';}var iframeContents='<html><body>'+script+'</body></html>';try{this.myIFrame.doc.open();this.myIFrame.doc.write(iframeContents);this.myIFrame.doc.close();}catch(e){log('frame writing exception');if(e.stack){log(e.stack);}log(e);}}else{this.commandCB=commandCB;this.onMessageCB=onMessageCB;}}/**
     * Each browser has its own funny way to handle iframes. Here we mush them all together into one object that I can
     * actually use.
     * @private
     * @return {Element}
     */FirebaseIFrameScriptHolder.createIFrame_=function(){var iframe=document.createElement('iframe');iframe.style.display='none';// This is necessary in order to initialize the document inside the iframe
if(document.body){document.body.appendChild(iframe);try{// If document.domain has been modified in IE, this will throw an error, and we need to set the
// domain of the iframe's document manually. We can do this via a javascript: url as the src attribute
// Also note that we must do this *after* the iframe has been appended to the page. Otherwise it doesn't work.
var a=iframe.contentWindow.document;if(!a){// Apologies for the log-spam, I need to do something to keep closure from optimizing out the assignment above.
log('No IE domain setting required');}}catch(e){var domain=document.domain;iframe.src="javascript:void((function(){document.open();document.domain='"+domain+"';document.close();})())";}}else{// LongPollConnection attempts to delay initialization until the document is ready, so hopefully this
// never gets hit.
throw'Document body has not initialized. Wait to initialize Firebase until after the document is ready.';}// Get the document of the iframe in a browser-specific way.
if(iframe.contentDocument){iframe.doc=iframe.contentDocument;// Firefox, Opera, Safari
}else if(iframe.contentWindow){iframe.doc=iframe.contentWindow.document;// Internet Explorer
}else if(iframe.document){iframe.doc=iframe.document;//others?
}return iframe;};/**
     * Cancel all outstanding queries and remove the frame.
     */FirebaseIFrameScriptHolder.prototype.close=function(){var _this=this;//Mark this iframe as dead, so no new requests are sent.
this.alive=false;if(this.myIFrame){//We have to actually remove all of the html inside this iframe before removing it from the
//window, or IE will continue loading and executing the script tags we've already added, which
//can lead to some errors being thrown. Setting innerHTML seems to be the easiest way to do this.
this.myIFrame.doc.body.innerHTML='';setTimeout(function(){if(_this.myIFrame!==null){document.body.removeChild(_this.myIFrame);_this.myIFrame=null;}},Math.floor(0));}if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()&&this.myID){var urlParams={};urlParams[FIREBASE_LONGPOLL_DISCONN_FRAME_PARAM]='t';urlParams[FIREBASE_LONGPOLL_ID_PARAM]=this.myID;urlParams[FIREBASE_LONGPOLL_PW_PARAM]=this.myPW;var theURL=this.urlFn(urlParams);FirebaseIFrameScriptHolder.nodeRestRequest(theURL);}// Protect from being called recursively.
var onDisconnect=this.onDisconnect;if(onDisconnect){this.onDisconnect=null;onDisconnect();}};/**
     * Actually start the long-polling session by adding the first script tag(s) to the iframe.
     * @param {!string} id - The ID of this connection
     * @param {!string} pw - The password for this connection
     */FirebaseIFrameScriptHolder.prototype.startLongPoll=function(id,pw){this.myID=id;this.myPW=pw;this.alive=true;//send the initial request. If there are requests queued, make sure that we transmit as many as we are currently able to.
while(this.newRequest_()){}};/**
     * This is called any time someone might want a script tag to be added. It adds a script tag when there aren't
     * too many outstanding requests and we are still alive.
     *
     * If there are outstanding packet segments to send, it sends one. If there aren't, it sends a long-poll anyways if
     * needed.
     */FirebaseIFrameScriptHolder.prototype.newRequest_=function(){// We keep one outstanding request open all the time to receive data, but if we need to send data
// (pendingSegs.length > 0) then we create a new request to send the data.  The server will automatically
// close the old request.
if(this.alive&&this.sendNewPolls&&this.outstandingRequests.count()<(this.pendingSegs.length>0?2:1)){//construct our url
this.currentSerial++;var urlParams={};urlParams[FIREBASE_LONGPOLL_ID_PARAM]=this.myID;urlParams[FIREBASE_LONGPOLL_PW_PARAM]=this.myPW;urlParams[FIREBASE_LONGPOLL_SERIAL_PARAM]=this.currentSerial;var theURL=this.urlFn(urlParams);//Now add as much data as we can.
var curDataString='';var i=0;while(this.pendingSegs.length>0){//first, lets see if the next segment will fit.
var nextSeg=this.pendingSegs[0];if(nextSeg.d.length+SEG_HEADER_SIZE+curDataString.length<=MAX_URL_DATA_SIZE){//great, the segment will fit. Lets append it.
var theSeg=this.pendingSegs.shift();curDataString=curDataString+'&'+FIREBASE_LONGPOLL_SEGMENT_NUM_PARAM+i+'='+theSeg.seg+'&'+FIREBASE_LONGPOLL_SEGMENTS_IN_PACKET+i+'='+theSeg.ts+'&'+FIREBASE_LONGPOLL_DATA_PARAM+i+'='+theSeg.d;i++;}else{break;}}theURL=theURL+curDataString;this.addLongPollTag_(theURL,this.currentSerial);return true;}else{return false;}};/**
     * Queue a packet for transmission to the server.
     * @param segnum - A sequential id for this packet segment used for reassembly
     * @param totalsegs - The total number of segments in this packet
     * @param data - The data for this segment.
     */FirebaseIFrameScriptHolder.prototype.enqueueSegment=function(segnum,totalsegs,data){//add this to the queue of segments to send.
this.pendingSegs.push({seg:segnum,ts:totalsegs,d:data});//send the data immediately if there isn't already data being transmitted, unless
//startLongPoll hasn't been called yet.
if(this.alive){this.newRequest_();}};/**
     * Add a script tag for a regular long-poll request.
     * @param {!string} url - The URL of the script tag.
     * @param {!number} serial - The serial number of the request.
     * @private
     */FirebaseIFrameScriptHolder.prototype.addLongPollTag_=function(url,serial){var _this=this;//remember that we sent this request.
this.outstandingRequests.add(serial,1);var doNewRequest=function doNewRequest(){_this.outstandingRequests.remove(serial);_this.newRequest_();};// If this request doesn't return on its own accord (by the server sending us some data), we'll
// create a new one after the KEEPALIVE interval to make sure we always keep a fresh request open.
var keepaliveTimeout=setTimeout(doNewRequest,Math.floor(KEEPALIVE_REQUEST_INTERVAL));var readyStateCB=function readyStateCB(){// Request completed.  Cancel the keepalive.
clearTimeout(keepaliveTimeout);// Trigger a new request so we can continue receiving data.
doNewRequest();};this.addTag(url,readyStateCB);};/**
     * Add an arbitrary script tag to the iframe.
     * @param {!string} url - The URL for the script tag source.
     * @param {!function()} loadCB - A callback to be triggered once the script has loaded.
     */FirebaseIFrameScriptHolder.prototype.addTag=function(url,loadCB){var _this=this;if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()){this.doNodeLongPoll(url,loadCB);}else{setTimeout(function(){try{// if we're already closed, don't add this poll
if(!_this.sendNewPolls)return;var newScript_1=_this.myIFrame.doc.createElement('script');newScript_1.type='text/javascript';newScript_1.async=true;newScript_1.src=url;newScript_1.onload=newScript_1.onreadystatechange=function(){var rstate=newScript_1.readyState;if(!rstate||rstate==='loaded'||rstate==='complete'){newScript_1.onload=newScript_1.onreadystatechange=null;if(newScript_1.parentNode){newScript_1.parentNode.removeChild(newScript_1);}loadCB();}};newScript_1.onerror=function(){log('Long-poll script failed to load: '+url);_this.sendNewPolls=false;_this.close();};_this.myIFrame.doc.body.appendChild(newScript_1);}catch(e){// TODO: we should make this error visible somehow
}},Math.floor(1));}};return FirebaseIFrameScriptHolder;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var WEBSOCKET_MAX_FRAME_SIZE=16384;var WEBSOCKET_KEEPALIVE_INTERVAL=45000;var WebSocketImpl=null;if(typeof MozWebSocket!=='undefined'){WebSocketImpl=MozWebSocket;}else if(typeof WebSocket!=='undefined'){WebSocketImpl=WebSocket;}/**
 * Create a new websocket connection with the given callbacks.
 * @constructor
 * @implements {Transport}
 */var WebSocketConnection=/** @class */function(){/**
     * @param {string} connId identifier for this transport
     * @param {RepoInfo} repoInfo The info for the websocket endpoint.
     * @param {string=} transportSessionId Optional transportSessionId if this is connecting to an existing transport
     *                                         session
     * @param {string=} lastSessionId Optional lastSessionId if there was a previous connection
     */function WebSocketConnection(connId,repoInfo,transportSessionId,lastSessionId){this.connId=connId;this.keepaliveTimer=null;this.frames=null;this.totalFrames=0;this.bytesSent=0;this.bytesReceived=0;this.log_=logWrapper(this.connId);this.stats_=StatsManager.getCollection(repoInfo);this.connURL=WebSocketConnection.connectionURL_(repoInfo,transportSessionId,lastSessionId);}/**
     * @param {RepoInfo} repoInfo The info for the websocket endpoint.
     * @param {string=} transportSessionId Optional transportSessionId if this is connecting to an existing transport
     *                                         session
     * @param {string=} lastSessionId Optional lastSessionId if there was a previous connection
     * @return {string} connection url
     * @private
     */WebSocketConnection.connectionURL_=function(repoInfo,transportSessionId,lastSessionId){var urlParams={};urlParams[VERSION_PARAM]=PROTOCOL_VERSION;if(!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()&&typeof location!=='undefined'&&location.href&&location.href.indexOf(FORGE_DOMAIN)!==-1){urlParams[REFERER_PARAM]=FORGE_REF;}if(transportSessionId){urlParams[TRANSPORT_SESSION_PARAM]=transportSessionId;}if(lastSessionId){urlParams[LAST_SESSION_PARAM]=lastSessionId;}return repoInfo.connectionURL(WEBSOCKET,urlParams);};/**
     *
     * @param onMessage Callback when messages arrive
     * @param onDisconnect Callback with connection lost.
     */WebSocketConnection.prototype.open=function(onMessage,onDisconnect){var _this=this;this.onDisconnect=onDisconnect;this.onMessage=onMessage;this.log_('Websocket connecting to '+this.connURL);this.everConnected_=false;// Assume failure until proven otherwise.
PersistentStorage.set('previous_websocket_failure',true);try{if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()){var device=__WEBPACK_IMPORTED_MODULE_0__firebase_util__["a" /* CONSTANTS */].NODE_ADMIN?'AdminNode':'Node';// UA Format: Firebase/<wire_protocol>/<sdk_version>/<platform>/<device>
var options={headers:{'User-Agent':"Firebase/"+PROTOCOL_VERSION+"/"+__WEBPACK_IMPORTED_MODULE_3__firebase_app__["default"].SDK_VERSION+"/"+process.platform+"/"+device}};// Plumb appropriate http_proxy environment variable into faye-websocket if it exists.
var env=process['env'];var proxy=this.connURL.indexOf('wss://')==0?env['HTTPS_PROXY']||env['https_proxy']:env['HTTP_PROXY']||env['http_proxy'];if(proxy){options['proxy']={origin:proxy};}this.mySock=new WebSocketImpl(this.connURL,[],options);}else{this.mySock=new WebSocketImpl(this.connURL);}}catch(e){this.log_('Error instantiating WebSocket.');var error$$1=e.message||e.data;if(error$$1){this.log_(error$$1);}this.onClosed_();return;}this.mySock.onopen=function(){_this.log_('Websocket connected.');_this.everConnected_=true;};this.mySock.onclose=function(){_this.log_('Websocket connection was disconnected.');_this.mySock=null;_this.onClosed_();};this.mySock.onmessage=function(m){_this.handleIncomingFrame(m);};this.mySock.onerror=function(e){_this.log_('WebSocket error.  Closing connection.');var error$$1=e.message||e.data;if(error$$1){_this.log_(error$$1);}_this.onClosed_();};};/**
     * No-op for websockets, we don't need to do anything once the connection is confirmed as open
     */WebSocketConnection.prototype.start=function(){};WebSocketConnection.forceDisallow=function(){WebSocketConnection.forceDisallow_=true;};WebSocketConnection.isAvailable=function(){var isOldAndroid=false;if(typeof navigator!=='undefined'&&navigator.userAgent){var oldAndroidRegex=/Android ([0-9]{0,}\.[0-9]{0,})/;var oldAndroidMatch=navigator.userAgent.match(oldAndroidRegex);if(oldAndroidMatch&&oldAndroidMatch.length>1){if(parseFloat(oldAndroidMatch[1])<4.4){isOldAndroid=true;}}}return!isOldAndroid&&WebSocketImpl!==null&&!WebSocketConnection.forceDisallow_;};/**
     * Returns true if we previously failed to connect with this transport.
     * @return {boolean}
     */WebSocketConnection.previouslyFailed=function(){// If our persistent storage is actually only in-memory storage,
// we default to assuming that it previously failed to be safe.
return PersistentStorage.isInMemoryStorage||PersistentStorage.get('previous_websocket_failure')===true;};WebSocketConnection.prototype.markConnectionHealthy=function(){PersistentStorage.remove('previous_websocket_failure');};WebSocketConnection.prototype.appendFrame_=function(data){this.frames.push(data);if(this.frames.length==this.totalFrames){var fullMess=this.frames.join('');this.frames=null;var jsonMess=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["B" /* jsonEval */])(fullMess);//handle the message
this.onMessage(jsonMess);}};/**
     * @param {number} frameCount The number of frames we are expecting from the server
     * @private
     */WebSocketConnection.prototype.handleNewFrameCount_=function(frameCount){this.totalFrames=frameCount;this.frames=[];};/**
     * Attempts to parse a frame count out of some text. If it can't, assumes a value of 1
     * @param {!String} data
     * @return {?String} Any remaining data to be process, or null if there is none
     * @private
     */WebSocketConnection.prototype.extractFrameCount_=function(data){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.frames===null,'We already have a frame buffer');// TODO: The server is only supposed to send up to 9999 frames (i.e. length <= 4), but that isn't being enforced
// currently.  So allowing larger frame counts (length <= 6).  See https://app.asana.com/0/search/8688598998380/8237608042508
if(data.length<=6){var frameCount=Number(data);if(!isNaN(frameCount)){this.handleNewFrameCount_(frameCount);return null;}}this.handleNewFrameCount_(1);return data;};/**
     * Process a websocket frame that has arrived from the server.
     * @param mess The frame data
     */WebSocketConnection.prototype.handleIncomingFrame=function(mess){if(this.mySock===null)return;// Chrome apparently delivers incoming packets even after we .close() the connection sometimes.
var data=mess['data'];this.bytesReceived+=data.length;this.stats_.incrementCounter('bytes_received',data.length);this.resetKeepAlive();if(this.frames!==null){// we're buffering
this.appendFrame_(data);}else{// try to parse out a frame count, otherwise, assume 1 and process it
var remainingData=this.extractFrameCount_(data);if(remainingData!==null){this.appendFrame_(remainingData);}}};/**
     * Send a message to the server
     * @param {Object} data The JSON object to transmit
     */WebSocketConnection.prototype.send=function(data){this.resetKeepAlive();var dataStr=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(data);this.bytesSent+=dataStr.length;this.stats_.incrementCounter('bytes_sent',dataStr.length);//We can only fit a certain amount in each websocket frame, so we need to split this request
//up into multiple pieces if it doesn't fit in one request.
var dataSegs=splitStringBySize(dataStr,WEBSOCKET_MAX_FRAME_SIZE);//Send the length header
if(dataSegs.length>1){this.sendString_(String(dataSegs.length));}//Send the actual data in segments.
for(var i=0;i<dataSegs.length;i++){this.sendString_(dataSegs[i]);}};WebSocketConnection.prototype.shutdown_=function(){this.isClosed_=true;if(this.keepaliveTimer){clearInterval(this.keepaliveTimer);this.keepaliveTimer=null;}if(this.mySock){this.mySock.close();this.mySock=null;}};WebSocketConnection.prototype.onClosed_=function(){if(!this.isClosed_){this.log_('WebSocket is closing itself');this.shutdown_();// since this is an internal close, trigger the close listener
if(this.onDisconnect){this.onDisconnect(this.everConnected_);this.onDisconnect=null;}}};/**
     * External-facing close handler.
     * Close the websocket and kill the connection.
     */WebSocketConnection.prototype.close=function(){if(!this.isClosed_){this.log_('WebSocket is being closed');this.shutdown_();}};/**
     * Kill the current keepalive timer and start a new one, to ensure that it always fires N seconds after
     * the last activity.
     */WebSocketConnection.prototype.resetKeepAlive=function(){var _this=this;clearInterval(this.keepaliveTimer);this.keepaliveTimer=setInterval(function(){//If there has been no websocket activity for a while, send a no-op
if(_this.mySock){_this.sendString_('0');}_this.resetKeepAlive();},Math.floor(WEBSOCKET_KEEPALIVE_INTERVAL));};/**
     * Send a string over the websocket.
     *
     * @param {string} str String to send.
     * @private
     */WebSocketConnection.prototype.sendString_=function(str){// Firefox seems to sometimes throw exceptions (NS_ERROR_UNEXPECTED) from websocket .send()
// calls for some unknown reason.  We treat these as an error and disconnect.
// See https://app.asana.com/0/58926111402292/68021340250410
try{this.mySock.send(str);}catch(e){this.log_('Exception thrown from WebSocket.send():',e.message||e.data,'Closing connection.');setTimeout(this.onClosed_.bind(this),0);}};/**
     * Number of response before we consider the connection "healthy."
     * @type {number}
     */WebSocketConnection.responsesRequiredToBeHealthy=2;/**
     * Time to wait for the connection te become healthy before giving up.
     * @type {number}
     */WebSocketConnection.healthyTimeout=30000;return WebSocketConnection;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Currently simplistic, this class manages what transport a Connection should use at various stages of its
 * lifecycle.
 *
 * It starts with longpolling in a browser, and httppolling on node. It then upgrades to websockets if
 * they are available.
 * @constructor
 */var TransportManager=/** @class */function(){/**
     * @param {!RepoInfo} repoInfo Metadata around the namespace we're connecting to
     */function TransportManager(repoInfo){this.initTransports_(repoInfo);}Object.defineProperty(TransportManager,"ALL_TRANSPORTS",{/**
         * @const
         * @type {!Array.<function(new:Transport, string, RepoInfo, string=)>}
         */get:function get(){return[BrowserPollConnection,WebSocketConnection];},enumerable:true,configurable:true});/**
     * @param {!RepoInfo} repoInfo
     * @private
     */TransportManager.prototype.initTransports_=function(repoInfo){var isWebSocketsAvailable=WebSocketConnection&&WebSocketConnection['isAvailable']();var isSkipPollConnection=isWebSocketsAvailable&&!WebSocketConnection.previouslyFailed();if(repoInfo.webSocketOnly){if(!isWebSocketsAvailable)warn("wss:// URL used, but browser isn't known to support websockets.  Trying anyway.");isSkipPollConnection=true;}if(isSkipPollConnection){this.transports_=[WebSocketConnection];}else{var transports_1=this.transports_=[];each(TransportManager.ALL_TRANSPORTS,function(i,transport){if(transport&&transport['isAvailable']()){transports_1.push(transport);}});}};/**
     * @return {function(new:Transport, !string, !RepoInfo, string=, string=)} The constructor for the
     * initial transport to use
     */TransportManager.prototype.initialTransport=function(){if(this.transports_.length>0){return this.transports_[0];}else{throw new Error('No transports available');}};/**
     * @return {?function(new:Transport, function(),function(), string=)} The constructor for the next
     * transport, or null
     */TransportManager.prototype.upgradeTransport=function(){if(this.transports_.length>1){return this.transports_[1];}else{return null;}};return TransportManager;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// Abort upgrade attempt if it takes longer than 60s.
var UPGRADE_TIMEOUT=60000;// For some transports (WebSockets), we need to "validate" the transport by exchanging a few requests and responses.
// If we haven't sent enough requests within 5s, we'll start sending noop ping requests.
var DELAY_BEFORE_SENDING_EXTRA_REQUESTS=5000;// If the initial data sent triggers a lot of bandwidth (i.e. it's a large put or a listen for a large amount of data)
// then we may not be able to exchange our ping/pong requests within the healthy timeout.  So if we reach the timeout
// but we've sent/received enough bytes, we don't cancel the connection.
var BYTES_SENT_HEALTHY_OVERRIDE=10*1024;var BYTES_RECEIVED_HEALTHY_OVERRIDE=100*1024;var MESSAGE_TYPE='t';var MESSAGE_DATA='d';var CONTROL_SHUTDOWN='s';var CONTROL_RESET='r';var CONTROL_ERROR='e';var CONTROL_PONG='o';var SWITCH_ACK='a';var END_TRANSMISSION='n';var PING='p';var SERVER_HELLO='h';/**
 * Creates a new real-time connection to the server using whichever method works
 * best in the current browser.
 *
 * @constructor
 */var Connection=/** @class */function(){/**
     * @param {!string} id - an id for this connection
     * @param {!RepoInfo} repoInfo_ - the info for the endpoint to connect to
     * @param {function(Object)} onMessage_ - the callback to be triggered when a server-push message arrives
     * @param {function(number, string)} onReady_ - the callback to be triggered when this connection is ready to send messages.
     * @param {function()} onDisconnect_ - the callback to be triggered when a connection was lost
     * @param {function(string)} onKill_ - the callback to be triggered when this connection has permanently shut down.
     * @param {string=} lastSessionId - last session id in persistent connection. is used to clean up old session in real-time server
     */function Connection(id,repoInfo_,onMessage_,onReady_,onDisconnect_,onKill_,lastSessionId){this.id=id;this.repoInfo_=repoInfo_;this.onMessage_=onMessage_;this.onReady_=onReady_;this.onDisconnect_=onDisconnect_;this.onKill_=onKill_;this.lastSessionId=lastSessionId;this.connectionCount=0;this.pendingDataMessages=[];this.state_=0/* CONNECTING */;this.log_=logWrapper('c:'+this.id+':');this.transportManager_=new TransportManager(repoInfo_);this.log_('Connection created');this.start_();}/**
     * Starts a connection attempt
     * @private
     */Connection.prototype.start_=function(){var _this=this;var conn=this.transportManager_.initialTransport();this.conn_=new conn(this.nextTransportId_(),this.repoInfo_,undefined,this.lastSessionId);// For certain transports (WebSockets), we need to send and receive several messages back and forth before we
// can consider the transport healthy.
this.primaryResponsesRequired_=conn['responsesRequiredToBeHealthy']||0;var onMessageReceived=this.connReceiver_(this.conn_);var onConnectionLost=this.disconnReceiver_(this.conn_);this.tx_=this.conn_;this.rx_=this.conn_;this.secondaryConn_=null;this.isHealthy_=false;/*
         * Firefox doesn't like when code from one iframe tries to create another iframe by way of the parent frame.
         * This can occur in the case of a redirect, i.e. we guessed wrong on what server to connect to and received a reset.
         * Somehow, setTimeout seems to make this ok. That doesn't make sense from a security perspective, since you should
         * still have the context of your originating frame.
         */setTimeout(function(){// this.conn_ gets set to null in some of the tests. Check to make sure it still exists before using it
_this.conn_&&_this.conn_.open(onMessageReceived,onConnectionLost);},Math.floor(0));var healthyTimeout_ms=conn['healthyTimeout']||0;if(healthyTimeout_ms>0){this.healthyTimeout_=setTimeoutNonBlocking(function(){_this.healthyTimeout_=null;if(!_this.isHealthy_){if(_this.conn_&&_this.conn_.bytesReceived>BYTES_RECEIVED_HEALTHY_OVERRIDE){_this.log_('Connection exceeded healthy timeout but has received '+_this.conn_.bytesReceived+' bytes.  Marking connection healthy.');_this.isHealthy_=true;_this.conn_.markConnectionHealthy();}else if(_this.conn_&&_this.conn_.bytesSent>BYTES_SENT_HEALTHY_OVERRIDE){_this.log_('Connection exceeded healthy timeout but has sent '+_this.conn_.bytesSent+' bytes.  Leaving connection alive.');// NOTE: We don't want to mark it healthy, since we have no guarantee that the bytes have made it to
// the server.
}else{_this.log_('Closing unhealthy connection after timeout.');_this.close();}}},Math.floor(healthyTimeout_ms));}};/**
     * @return {!string}
     * @private
     */Connection.prototype.nextTransportId_=function(){return'c:'+this.id+':'+this.connectionCount++;};Connection.prototype.disconnReceiver_=function(conn){var _this=this;return function(everConnected){if(conn===_this.conn_){_this.onConnectionLost_(everConnected);}else if(conn===_this.secondaryConn_){_this.log_('Secondary connection lost.');_this.onSecondaryConnectionLost_();}else{_this.log_('closing an old connection');}};};Connection.prototype.connReceiver_=function(conn){var _this=this;return function(message){if(_this.state_!=2/* DISCONNECTED */){if(conn===_this.rx_){_this.onPrimaryMessageReceived_(message);}else if(conn===_this.secondaryConn_){_this.onSecondaryMessageReceived_(message);}else{_this.log_('message on old connection');}}};};/**
     *
     * @param {Object} dataMsg An arbitrary data message to be sent to the server
     */Connection.prototype.sendRequest=function(dataMsg){// wrap in a data message envelope and send it on
var msg={t:'d',d:dataMsg};this.sendData_(msg);};Connection.prototype.tryCleanupConnection=function(){if(this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_){this.log_('cleaning up and promoting a connection: '+this.secondaryConn_.connId);this.conn_=this.secondaryConn_;this.secondaryConn_=null;// the server will shutdown the old connection
}};Connection.prototype.onSecondaryControl_=function(controlData){if(MESSAGE_TYPE in controlData){var cmd=controlData[MESSAGE_TYPE];if(cmd===SWITCH_ACK){this.upgradeIfSecondaryHealthy_();}else if(cmd===CONTROL_RESET){// Most likely the session wasn't valid. Abandon the switch attempt
this.log_('Got a reset on secondary, closing it');this.secondaryConn_.close();// If we were already using this connection for something, than we need to fully close
if(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_){this.close();}}else if(cmd===CONTROL_PONG){this.log_('got pong on secondary.');this.secondaryResponsesRequired_--;this.upgradeIfSecondaryHealthy_();}}};Connection.prototype.onSecondaryMessageReceived_=function(parsedData){var layer=requireKey('t',parsedData);var data=requireKey('d',parsedData);if(layer=='c'){this.onSecondaryControl_(data);}else if(layer=='d'){// got a data message, but we're still second connection. Need to buffer it up
this.pendingDataMessages.push(data);}else{throw new Error('Unknown protocol layer: '+layer);}};Connection.prototype.upgradeIfSecondaryHealthy_=function(){if(this.secondaryResponsesRequired_<=0){this.log_('Secondary connection is healthy.');this.isHealthy_=true;this.secondaryConn_.markConnectionHealthy();this.proceedWithUpgrade_();}else{// Send a ping to make sure the connection is healthy.
this.log_('sending ping on secondary.');this.secondaryConn_.send({t:'c',d:{t:PING,d:{}}});}};Connection.prototype.proceedWithUpgrade_=function(){// tell this connection to consider itself open
this.secondaryConn_.start();// send ack
this.log_('sending client ack on secondary');this.secondaryConn_.send({t:'c',d:{t:SWITCH_ACK,d:{}}});// send end packet on primary transport, switch to sending on this one
// can receive on this one, buffer responses until end received on primary transport
this.log_('Ending transmission on primary');this.conn_.send({t:'c',d:{t:END_TRANSMISSION,d:{}}});this.tx_=this.secondaryConn_;this.tryCleanupConnection();};Connection.prototype.onPrimaryMessageReceived_=function(parsedData){// Must refer to parsedData properties in quotes, so closure doesn't touch them.
var layer=requireKey('t',parsedData);var data=requireKey('d',parsedData);if(layer=='c'){this.onControl_(data);}else if(layer=='d'){this.onDataMessage_(data);}};Connection.prototype.onDataMessage_=function(message){this.onPrimaryResponse_();// We don't do anything with data messages, just kick them up a level
this.onMessage_(message);};Connection.prototype.onPrimaryResponse_=function(){if(!this.isHealthy_){this.primaryResponsesRequired_--;if(this.primaryResponsesRequired_<=0){this.log_('Primary connection is healthy.');this.isHealthy_=true;this.conn_.markConnectionHealthy();}}};Connection.prototype.onControl_=function(controlData){var cmd=requireKey(MESSAGE_TYPE,controlData);if(MESSAGE_DATA in controlData){var payload=controlData[MESSAGE_DATA];if(cmd===SERVER_HELLO){this.onHandshake_(payload);}else if(cmd===END_TRANSMISSION){this.log_('recvd end transmission on primary');this.rx_=this.secondaryConn_;for(var i=0;i<this.pendingDataMessages.length;++i){this.onDataMessage_(this.pendingDataMessages[i]);}this.pendingDataMessages=[];this.tryCleanupConnection();}else if(cmd===CONTROL_SHUTDOWN){// This was previously the 'onKill' callback passed to the lower-level connection
// payload in this case is the reason for the shutdown. Generally a human-readable error
this.onConnectionShutdown_(payload);}else if(cmd===CONTROL_RESET){// payload in this case is the host we should contact
this.onReset_(payload);}else if(cmd===CONTROL_ERROR){error('Server Error: '+payload);}else if(cmd===CONTROL_PONG){this.log_('got pong on primary.');this.onPrimaryResponse_();this.sendPingOnPrimaryIfNecessary_();}else{error('Unknown control packet command: '+cmd);}}};/**
     *
     * @param {Object} handshake The handshake data returned from the server
     * @private
     */Connection.prototype.onHandshake_=function(handshake){var timestamp=handshake.ts;var version=handshake.v;var host=handshake.h;this.sessionId=handshake.s;this.repoInfo_.updateHost(host);// if we've already closed the connection, then don't bother trying to progress further
if(this.state_==0/* CONNECTING */){this.conn_.start();this.onConnectionEstablished_(this.conn_,timestamp);if(PROTOCOL_VERSION!==version){warn('Protocol version mismatch detected');}// TODO: do we want to upgrade? when? maybe a delay?
this.tryStartUpgrade_();}};Connection.prototype.tryStartUpgrade_=function(){var conn=this.transportManager_.upgradeTransport();if(conn){this.startUpgrade_(conn);}};Connection.prototype.startUpgrade_=function(conn){var _this=this;this.secondaryConn_=new conn(this.nextTransportId_(),this.repoInfo_,this.sessionId);// For certain transports (WebSockets), we need to send and receive several messages back and forth before we
// can consider the transport healthy.
this.secondaryResponsesRequired_=conn['responsesRequiredToBeHealthy']||0;var onMessage=this.connReceiver_(this.secondaryConn_);var onDisconnect=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(onMessage,onDisconnect);// If we haven't successfully upgraded after UPGRADE_TIMEOUT, give up and kill the secondary.
setTimeoutNonBlocking(function(){if(_this.secondaryConn_){_this.log_('Timed out trying to upgrade.');_this.secondaryConn_.close();}},Math.floor(UPGRADE_TIMEOUT));};Connection.prototype.onReset_=function(host){this.log_('Reset packet received.  New host: '+host);this.repoInfo_.updateHost(host);// TODO: if we're already "connected", we need to trigger a disconnect at the next layer up.
// We don't currently support resets after the connection has already been established
if(this.state_===1/* CONNECTED */){this.close();}else{// Close whatever connections we have open and start again.
this.closeConnections_();this.start_();}};Connection.prototype.onConnectionEstablished_=function(conn,timestamp){var _this=this;this.log_('Realtime connection established.');this.conn_=conn;this.state_=1/* CONNECTED */;if(this.onReady_){this.onReady_(timestamp,this.sessionId);this.onReady_=null;}// If after 5 seconds we haven't sent enough requests to the server to get the connection healthy,
// send some pings.
if(this.primaryResponsesRequired_===0){this.log_('Primary connection is healthy.');this.isHealthy_=true;}else{setTimeoutNonBlocking(function(){_this.sendPingOnPrimaryIfNecessary_();},Math.floor(DELAY_BEFORE_SENDING_EXTRA_REQUESTS));}};Connection.prototype.sendPingOnPrimaryIfNecessary_=function(){// If the connection isn't considered healthy yet, we'll send a noop ping packet request.
if(!this.isHealthy_&&this.state_===1/* CONNECTED */){this.log_('sending ping on primary.');this.sendData_({t:'c',d:{t:PING,d:{}}});}};Connection.prototype.onSecondaryConnectionLost_=function(){var conn=this.secondaryConn_;this.secondaryConn_=null;if(this.tx_===conn||this.rx_===conn){// we are relying on this connection already in some capacity. Therefore, a failure is real
this.close();}};/**
     *
     * @param {boolean} everConnected Whether or not the connection ever reached a server. Used to determine if
     * we should flush the host cache
     * @private
     */Connection.prototype.onConnectionLost_=function(everConnected){this.conn_=null;// NOTE: IF you're seeing a Firefox error for this line, I think it might be because it's getting
// called on window close and RealtimeState.CONNECTING is no longer defined.  Just a guess.
if(!everConnected&&this.state_===0/* CONNECTING */){this.log_('Realtime connection failed.');// Since we failed to connect at all, clear any cached entry for this namespace in case the machine went away
if(this.repoInfo_.isCacheableHost()){PersistentStorage.remove('host:'+this.repoInfo_.host);// reset the internal host to what we would show the user, i.e. <ns>.firebaseio.com
this.repoInfo_.internalHost=this.repoInfo_.host;}}else if(this.state_===1/* CONNECTED */){this.log_('Realtime connection lost.');}this.close();};/**
     *
     * @param {string} reason
     * @private
     */Connection.prototype.onConnectionShutdown_=function(reason){this.log_('Connection shutdown command received. Shutting down...');if(this.onKill_){this.onKill_(reason);this.onKill_=null;}// We intentionally don't want to fire onDisconnect (kill is a different case),
// so clear the callback.
this.onDisconnect_=null;this.close();};Connection.prototype.sendData_=function(data){if(this.state_!==1/* CONNECTED */){throw'Connection is not connected';}else{this.tx_.send(data);}};/**
     * Cleans up this connection, calling the appropriate callbacks
     */Connection.prototype.close=function(){if(this.state_!==2/* DISCONNECTED */){this.log_('Closing realtime connection.');this.state_=2/* DISCONNECTED */;this.closeConnections_();if(this.onDisconnect_){this.onDisconnect_();this.onDisconnect_=null;}}};/**
     *
     * @private
     */Connection.prototype.closeConnections_=function(){this.log_('Shutting down all connections');if(this.conn_){this.conn_.close();this.conn_=null;}if(this.secondaryConn_){this.secondaryConn_.close();this.secondaryConn_=null;}if(this.healthyTimeout_){clearTimeout(this.healthyTimeout_);this.healthyTimeout_=null;}};return Connection;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Interface defining the set of actions that can be performed against the Firebase server
 * (basically corresponds to our wire protocol).
 *
 * @interface
 */var ServerActions=/** @class */function(){function ServerActions(){}/**
     * @param {string} pathString
     * @param {*} data
     * @param {function(string, string)=} onComplete
     * @param {string=} hash
     */ServerActions.prototype.put=function(pathString,data,onComplete,hash){};/**
     * @param {string} pathString
     * @param {*} data
     * @param {function(string, ?string)} onComplete
     * @param {string=} hash
     */ServerActions.prototype.merge=function(pathString,data,onComplete,hash){};/**
     * Refreshes the auth token for the current connection.
     * @param {string} token The authentication token
     */ServerActions.prototype.refreshAuthToken=function(token){};/**
     * @param {string} pathString
     * @param {*} data
     * @param {function(string, string)=} onComplete
     */ServerActions.prototype.onDisconnectPut=function(pathString,data,onComplete){};/**
     * @param {string} pathString
     * @param {*} data
     * @param {function(string, string)=} onComplete
     */ServerActions.prototype.onDisconnectMerge=function(pathString,data,onComplete){};/**
     * @param {string} pathString
     * @param {function(string, string)=} onComplete
     */ServerActions.prototype.onDisconnectCancel=function(pathString,onComplete){};/**
     * @param {Object.<string, *>} stats
     */ServerActions.prototype.reportStats=function(stats){};return ServerActions;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var RECONNECT_MIN_DELAY=1000;var RECONNECT_MAX_DELAY_DEFAULT=60*5*1000;// 5 minutes in milliseconds (Case: 1858)
var RECONNECT_MAX_DELAY_FOR_ADMINS=30*1000;// 30 seconds for admin clients (likely to be a backend server)
var RECONNECT_DELAY_MULTIPLIER=1.3;var RECONNECT_DELAY_RESET_TIMEOUT=30000;// Reset delay back to MIN_DELAY after being connected for 30sec.
var SERVER_KILL_INTERRUPT_REASON='server_kill';// If auth fails repeatedly, we'll assume something is wrong and log a warning / back off.
var INVALID_AUTH_TOKEN_THRESHOLD=3;/**
 * Firebase connection.  Abstracts wire protocol and handles reconnecting.
 *
 * NOTE: All JSON objects sent to the realtime connection must have property names enclosed
 * in quotes to make sure the closure compiler does not minify them.
 */var PersistentConnection=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(PersistentConnection,_super);/**
     * @implements {ServerActions}
     * @param {!RepoInfo} repoInfo_ Data about the namespace we are connecting to
     * @param {function(string, *, boolean, ?number)} onDataUpdate_ A callback for new data from the server
     * @param onConnectStatus_
     * @param onServerInfoUpdate_
     * @param authTokenProvider_
     * @param authOverride_
     */function PersistentConnection(repoInfo_,onDataUpdate_,onConnectStatus_,onServerInfoUpdate_,authTokenProvider_,authOverride_){var _this=_super.call(this)||this;_this.repoInfo_=repoInfo_;_this.onDataUpdate_=onDataUpdate_;_this.onConnectStatus_=onConnectStatus_;_this.onServerInfoUpdate_=onServerInfoUpdate_;_this.authTokenProvider_=authTokenProvider_;_this.authOverride_=authOverride_;// Used for diagnostic logging.
_this.id=PersistentConnection.nextPersistentConnectionId_++;_this.log_=logWrapper('p:'+_this.id+':');/** @private {Object} */_this.interruptReasons_={};_this.listens_={};_this.outstandingPuts_=[];_this.outstandingPutCount_=0;_this.onDisconnectRequestQueue_=[];_this.connected_=false;_this.reconnectDelay_=RECONNECT_MIN_DELAY;_this.maxReconnectDelay_=RECONNECT_MAX_DELAY_DEFAULT;_this.securityDebugCallback_=null;_this.lastSessionId=null;/** @private {number|null} */_this.establishConnectionTimer_=null;/** @private {boolean} */_this.visible_=false;// Before we get connected, we keep a queue of pending messages to send.
_this.requestCBHash_={};_this.requestNumber_=0;/** @private {?{
         *   sendRequest(Object),
         *   close()
         * }} */_this.realtime_=null;/** @private {string|null} */_this.authToken_=null;_this.forceTokenRefresh_=false;_this.invalidAuthTokenCount_=0;_this.firstConnection_=true;_this.lastConnectionAttemptTime_=null;_this.lastConnectionEstablishedTime_=null;if(authOverride_&&!Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()){throw new Error('Auth override specified in options, but not supported on non Node.js platforms');}_this.scheduleConnect_(0);VisibilityMonitor.getInstance().on('visible',_this.onVisible_,_this);if(repoInfo_.host.indexOf('fblocal')===-1){OnlineMonitor.getInstance().on('online',_this.onOnline_,_this);}return _this;}/**
     * @param {!string} action
     * @param {*} body
     * @param {function(*)=} onResponse
     * @protected
     */PersistentConnection.prototype.sendRequest=function(action,body,onResponse){var curReqNum=++this.requestNumber_;var msg={r:curReqNum,a:action,b:body};this.log_(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(msg));Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.connected_,"sendRequest call when we're not connected not allowed.");this.realtime_.sendRequest(msg);if(onResponse){this.requestCBHash_[curReqNum]=onResponse;}};/**
     * @inheritDoc
     */PersistentConnection.prototype.listen=function(query,currentHashFn,tag,onComplete){var queryId=query.queryIdentifier();var pathString=query.path.toString();this.log_('Listen called for '+pathString+' '+queryId);this.listens_[pathString]=this.listens_[pathString]||{};Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(query.getQueryParams().isDefault()||!query.getQueryParams().loadsAllData(),'listen() called for non-default but complete query');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!this.listens_[pathString][queryId],'listen() called twice for same path/queryId.');var listenSpec={onComplete:onComplete,hashFn:currentHashFn,query:query,tag:tag};this.listens_[pathString][queryId]=listenSpec;if(this.connected_){this.sendListen_(listenSpec);}};/**
     * @param {!{onComplete(),
     *           hashFn():!string,
     *           query: !Query,
     *           tag: ?number}} listenSpec
     * @private
     */PersistentConnection.prototype.sendListen_=function(listenSpec){var _this=this;var query=listenSpec.query;var pathString=query.path.toString();var queryId=query.queryIdentifier();this.log_('Listen on '+pathString+' for '+queryId);var req={/*path*/p:pathString};var action='q';// Only bother to send query if it's non-default.
if(listenSpec.tag){req['q']=query.queryObject();req['t']=listenSpec.tag;}req[/*hash*/'h']=listenSpec.hashFn();this.sendRequest(action,req,function(message){var payload=message[/*data*/'d'];var status=message[/*status*/'s'];// print warnings in any case...
PersistentConnection.warnOnListenWarnings_(payload,query);var currentListenSpec=_this.listens_[pathString]&&_this.listens_[pathString][queryId];// only trigger actions if the listen hasn't been removed and readded
if(currentListenSpec===listenSpec){_this.log_('listen response',message);if(status!=='ok'){_this.removeListen_(pathString,queryId);}if(listenSpec.onComplete){listenSpec.onComplete(status,payload);}}});};/**
     * @param {*} payload
     * @param {!Query} query
     * @private
     */PersistentConnection.warnOnListenWarnings_=function(payload,query){if(payload&&typeof payload==='object'&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(payload,'w')){var warnings=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(payload,'w');if(Array.isArray(warnings)&&~warnings.indexOf('no_index')){var indexSpec='".indexOn": "'+query.getQueryParams().getIndex().toString()+'"';var indexPath=query.path.toString();warn("Using an unspecified index. Your data will be downloaded and "+("filtered on the client. Consider adding "+indexSpec+" at ")+(indexPath+" to your security rules for better performance."));}}};/**
     * @inheritDoc
     */PersistentConnection.prototype.refreshAuthToken=function(token){this.authToken_=token;this.log_('Auth token refreshed');if(this.authToken_){this.tryAuth();}else{//If we're connected we want to let the server know to unauthenticate us. If we're not connected, simply delete
//the credential so we dont become authenticated next time we connect.
if(this.connected_){this.sendRequest('unauth',{},function(){});}}this.reduceReconnectDelayIfAdminCredential_(token);};/**
     * @param {!string} credential
     * @private
     */PersistentConnection.prototype.reduceReconnectDelayIfAdminCredential_=function(credential){// NOTE: This isn't intended to be bulletproof (a malicious developer can always just modify the client).
// Additionally, we don't bother resetting the max delay back to the default if auth fails / expires.
var isFirebaseSecret=credential&&credential.length===40;if(isFirebaseSecret||Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["v" /* isAdmin */])(credential)){this.log_('Admin auth credential detected.  Reducing max reconnect time.');this.maxReconnectDelay_=RECONNECT_MAX_DELAY_FOR_ADMINS;}};/**
     * Attempts to authenticate with the given credentials. If the authentication attempt fails, it's triggered like
     * a auth revoked (the connection is closed).
     */PersistentConnection.prototype.tryAuth=function(){var _this=this;if(this.connected_&&this.authToken_){var token_1=this.authToken_;var authMethod=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["A" /* isValidFormat */])(token_1)?'auth':'gauth';var requestData={cred:token_1};if(this.authOverride_===null){requestData['noauth']=true;}else if(typeof this.authOverride_==='object'){requestData['authvar']=this.authOverride_;}this.sendRequest(authMethod,requestData,function(res){var status=res[/*status*/'s'];var data=res[/*data*/'d']||'error';if(_this.authToken_===token_1){if(status==='ok'){_this.invalidAuthTokenCount_=0;}else{// Triggers reconnect and force refresh for auth token
_this.onAuthRevoked_(status,data);}}});}};/**
     * @inheritDoc
     */PersistentConnection.prototype.unlisten=function(query,tag){var pathString=query.path.toString();var queryId=query.queryIdentifier();this.log_('Unlisten called for '+pathString+' '+queryId);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(query.getQueryParams().isDefault()||!query.getQueryParams().loadsAllData(),'unlisten() called for non-default but complete query');var listen=this.removeListen_(pathString,queryId);if(listen&&this.connected_){this.sendUnlisten_(pathString,queryId,query.queryObject(),tag);}};PersistentConnection.prototype.sendUnlisten_=function(pathString,queryId,queryObj,tag){this.log_('Unlisten on '+pathString+' for '+queryId);var req={/*path*/p:pathString};var action='n';// Only bother sending queryId if it's non-default.
if(tag){req['q']=queryObj;req['t']=tag;}this.sendRequest(action,req);};/**
     * @inheritDoc
     */PersistentConnection.prototype.onDisconnectPut=function(pathString,data,onComplete){if(this.connected_){this.sendOnDisconnect_('o',pathString,data,onComplete);}else{this.onDisconnectRequestQueue_.push({pathString:pathString,action:'o',data:data,onComplete:onComplete});}};/**
     * @inheritDoc
     */PersistentConnection.prototype.onDisconnectMerge=function(pathString,data,onComplete){if(this.connected_){this.sendOnDisconnect_('om',pathString,data,onComplete);}else{this.onDisconnectRequestQueue_.push({pathString:pathString,action:'om',data:data,onComplete:onComplete});}};/**
     * @inheritDoc
     */PersistentConnection.prototype.onDisconnectCancel=function(pathString,onComplete){if(this.connected_){this.sendOnDisconnect_('oc',pathString,null,onComplete);}else{this.onDisconnectRequestQueue_.push({pathString:pathString,action:'oc',data:null,onComplete:onComplete});}};PersistentConnection.prototype.sendOnDisconnect_=function(action,pathString,data,onComplete){var request={/*path*/p:pathString,/*data*/d:data};this.log_('onDisconnect '+action,request);this.sendRequest(action,request,function(response){if(onComplete){setTimeout(function(){onComplete(response[/*status*/'s'],response[/* data */'d']);},Math.floor(0));}});};/**
     * @inheritDoc
     */PersistentConnection.prototype.put=function(pathString,data,onComplete,hash){this.putInternal('p',pathString,data,onComplete,hash);};/**
     * @inheritDoc
     */PersistentConnection.prototype.merge=function(pathString,data,onComplete,hash){this.putInternal('m',pathString,data,onComplete,hash);};PersistentConnection.prototype.putInternal=function(action,pathString,data,onComplete,hash){var request={/*path*/p:pathString,/*data*/d:data};if(hash!==undefined)request[/*hash*/'h']=hash;// TODO: Only keep track of the most recent put for a given path?
this.outstandingPuts_.push({action:action,request:request,onComplete:onComplete});this.outstandingPutCount_++;var index=this.outstandingPuts_.length-1;if(this.connected_){this.sendPut_(index);}else{this.log_('Buffering put: '+pathString);}};PersistentConnection.prototype.sendPut_=function(index){var _this=this;var action=this.outstandingPuts_[index].action;var request=this.outstandingPuts_[index].request;var onComplete=this.outstandingPuts_[index].onComplete;this.outstandingPuts_[index].queued=this.connected_;this.sendRequest(action,request,function(message){_this.log_(action+' response',message);delete _this.outstandingPuts_[index];_this.outstandingPutCount_--;// Clean up array occasionally.
if(_this.outstandingPutCount_===0){_this.outstandingPuts_=[];}if(onComplete)onComplete(message[/*status*/'s'],message[/* data */'d']);});};/**
     * @inheritDoc
     */PersistentConnection.prototype.reportStats=function(stats){var _this=this;// If we're not connected, we just drop the stats.
if(this.connected_){var request={/*counters*/c:stats};this.log_('reportStats',request);this.sendRequest(/*stats*/'s',request,function(result){var status=result[/*status*/'s'];if(status!=='ok'){var errorReason=result[/* data */'d'];_this.log_('reportStats','Error sending stats: '+errorReason);}});}};/**
     * @param {*} message
     * @private
     */PersistentConnection.prototype.onDataMessage_=function(message){if('r'in message){// this is a response
this.log_('from server: '+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(message));var reqNum=message['r'];var onResponse=this.requestCBHash_[reqNum];if(onResponse){delete this.requestCBHash_[reqNum];onResponse(message[/*body*/'b']);}}else if('error'in message){throw'A server-side error has occurred: '+message['error'];}else if('a'in message){// a and b are action and body, respectively
this.onDataPush_(message['a'],message['b']);}};PersistentConnection.prototype.onDataPush_=function(action,body){this.log_('handleServerMessage',action,body);if(action==='d')this.onDataUpdate_(body[/*path*/'p'],body[/*data*/'d'],/*isMerge*/false,body['t']);else if(action==='m')this.onDataUpdate_(body[/*path*/'p'],body[/*data*/'d'],/*isMerge=*/true,body['t']);else if(action==='c')this.onListenRevoked_(body[/*path*/'p'],body[/*query*/'q']);else if(action==='ac')this.onAuthRevoked_(body[/*status code*/'s'],body[/* explanation */'d']);else if(action==='sd')this.onSecurityDebugPacket_(body);else error('Unrecognized action received from server: '+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(action)+'\nAre you using the latest client?');};PersistentConnection.prototype.onReady_=function(timestamp,sessionId){this.log_('connection ready');this.connected_=true;this.lastConnectionEstablishedTime_=new Date().getTime();this.handleTimestamp_(timestamp);this.lastSessionId=sessionId;if(this.firstConnection_){this.sendConnectStats_();}this.restoreState_();this.firstConnection_=false;this.onConnectStatus_(true);};PersistentConnection.prototype.scheduleConnect_=function(timeout){var _this=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(!this.realtime_,"Scheduling a connect when we're already connected/ing?");if(this.establishConnectionTimer_){clearTimeout(this.establishConnectionTimer_);}// NOTE: Even when timeout is 0, it's important to do a setTimeout to work around an infuriating "Security Error" in
// Firefox when trying to write to our long-polling iframe in some scenarios (e.g. Forge or our unit tests).
this.establishConnectionTimer_=setTimeout(function(){_this.establishConnectionTimer_=null;_this.establishConnection_();},Math.floor(timeout));};/**
     * @param {boolean} visible
     * @private
     */PersistentConnection.prototype.onVisible_=function(visible){// NOTE: Tabbing away and back to a window will defeat our reconnect backoff, but I think that's fine.
if(visible&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_){this.log_('Window became visible.  Reducing delay.');this.reconnectDelay_=RECONNECT_MIN_DELAY;if(!this.realtime_){this.scheduleConnect_(0);}}this.visible_=visible;};PersistentConnection.prototype.onOnline_=function(online){if(online){this.log_('Browser went online.');this.reconnectDelay_=RECONNECT_MIN_DELAY;if(!this.realtime_){this.scheduleConnect_(0);}}else{this.log_('Browser went offline.  Killing connection.');if(this.realtime_){this.realtime_.close();}}};PersistentConnection.prototype.onRealtimeDisconnect_=function(){this.log_('data client disconnected');this.connected_=false;this.realtime_=null;// Since we don't know if our sent transactions succeeded or not, we need to cancel them.
this.cancelSentTransactions_();// Clear out the pending requests.
this.requestCBHash_={};if(this.shouldReconnect_()){if(!this.visible_){this.log_("Window isn't visible.  Delaying reconnect.");this.reconnectDelay_=this.maxReconnectDelay_;this.lastConnectionAttemptTime_=new Date().getTime();}else if(this.lastConnectionEstablishedTime_){// If we've been connected long enough, reset reconnect delay to minimum.
var timeSinceLastConnectSucceeded=new Date().getTime()-this.lastConnectionEstablishedTime_;if(timeSinceLastConnectSucceeded>RECONNECT_DELAY_RESET_TIMEOUT)this.reconnectDelay_=RECONNECT_MIN_DELAY;this.lastConnectionEstablishedTime_=null;}var timeSinceLastConnectAttempt=new Date().getTime()-this.lastConnectionAttemptTime_;var reconnectDelay=Math.max(0,this.reconnectDelay_-timeSinceLastConnectAttempt);reconnectDelay=Math.random()*reconnectDelay;this.log_('Trying to reconnect in '+reconnectDelay+'ms');this.scheduleConnect_(reconnectDelay);// Adjust reconnect delay for next time.
this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*RECONNECT_DELAY_MULTIPLIER);}this.onConnectStatus_(false);};PersistentConnection.prototype.establishConnection_=function(){if(this.shouldReconnect_()){this.log_('Making a connection attempt');this.lastConnectionAttemptTime_=new Date().getTime();this.lastConnectionEstablishedTime_=null;var onDataMessage_1=this.onDataMessage_.bind(this);var onReady_1=this.onReady_.bind(this);var onDisconnect_1=this.onRealtimeDisconnect_.bind(this);var connId_1=this.id+':'+PersistentConnection.nextConnectionId_++;var self_1=this;var lastSessionId_1=this.lastSessionId;var canceled_1=false;var connection_1=null;var closeFn_1=function closeFn_1(){if(connection_1){connection_1.close();}else{canceled_1=true;onDisconnect_1();}};var sendRequestFn=function sendRequestFn(msg){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(connection_1,"sendRequest call when we're not connected not allowed.");connection_1.sendRequest(msg);};this.realtime_={close:closeFn_1,sendRequest:sendRequestFn};var forceRefresh=this.forceTokenRefresh_;this.forceTokenRefresh_=false;// First fetch auth token, and establish connection after fetching the token was successful
this.authTokenProvider_.getToken(forceRefresh).then(function(result){if(!canceled_1){log('getToken() completed. Creating connection.');self_1.authToken_=result&&result.accessToken;connection_1=new Connection(connId_1,self_1.repoInfo_,onDataMessage_1,onReady_1,onDisconnect_1,/* onKill= */function(reason){warn(reason+' ('+self_1.repoInfo_.toString()+')');self_1.interrupt(SERVER_KILL_INTERRUPT_REASON);},lastSessionId_1);}else{log('getToken() completed but was canceled');}}).then(null,function(error$$1){self_1.log_('Failed to get token: '+error$$1);if(!canceled_1){if(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["a" /* CONSTANTS */].NODE_ADMIN){// This may be a critical error for the Admin Node.js SDK, so log a warning.
// But getToken() may also just have temporarily failed, so we still want to
// continue retrying.
warn(error$$1);}closeFn_1();}});}};/**
     * @param {string} reason
     */PersistentConnection.prototype.interrupt=function(reason){log('Interrupting connection for reason: '+reason);this.interruptReasons_[reason]=true;if(this.realtime_){this.realtime_.close();}else{if(this.establishConnectionTimer_){clearTimeout(this.establishConnectionTimer_);this.establishConnectionTimer_=null;}if(this.connected_){this.onRealtimeDisconnect_();}}};/**
     * @param {string} reason
     */PersistentConnection.prototype.resume=function(reason){log('Resuming connection for reason: '+reason);delete this.interruptReasons_[reason];if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["w" /* isEmpty */])(this.interruptReasons_)){this.reconnectDelay_=RECONNECT_MIN_DELAY;if(!this.realtime_){this.scheduleConnect_(0);}}};PersistentConnection.prototype.handleTimestamp_=function(timestamp){var delta=timestamp-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:delta});};PersistentConnection.prototype.cancelSentTransactions_=function(){for(var i=0;i<this.outstandingPuts_.length;i++){var put=this.outstandingPuts_[i];if(put&&/*hash*/'h'in put.request&&put.queued){if(put.onComplete)put.onComplete('disconnect');delete this.outstandingPuts_[i];this.outstandingPutCount_--;}}// Clean up array occasionally.
if(this.outstandingPutCount_===0)this.outstandingPuts_=[];};/**
     * @param {!string} pathString
     * @param {Array.<*>=} query
     * @private
     */PersistentConnection.prototype.onListenRevoked_=function(pathString,query){// Remove the listen and manufacture a "permission_denied" error for the failed listen.
var queryId;if(!query){queryId='default';}else{queryId=query.map(function(q){return ObjectToUniqueKey(q);}).join('$');}var listen=this.removeListen_(pathString,queryId);if(listen&&listen.onComplete)listen.onComplete('permission_denied');};/**
     * @param {!string} pathString
     * @param {!string} queryId
     * @return {{queries:Array.<Query>, onComplete:function(string)}}
     * @private
     */PersistentConnection.prototype.removeListen_=function(pathString,queryId){var normalizedPathString=new Path(pathString).toString();// normalize path.
var listen;if(this.listens_[normalizedPathString]!==undefined){listen=this.listens_[normalizedPathString][queryId];delete this.listens_[normalizedPathString][queryId];if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["t" /* getCount */])(this.listens_[normalizedPathString])===0){delete this.listens_[normalizedPathString];}}else{// all listens for this path has already been removed
listen=undefined;}return listen;};PersistentConnection.prototype.onAuthRevoked_=function(statusCode,explanation){log('Auth token revoked: '+statusCode+'/'+explanation);this.authToken_=null;this.forceTokenRefresh_=true;this.realtime_.close();if(statusCode==='invalid_token'||statusCode==='permission_denied'){// We'll wait a couple times before logging the warning / increasing the
// retry period since oauth tokens will report as "invalid" if they're
// just expired. Plus there may be transient issues that resolve themselves.
this.invalidAuthTokenCount_++;if(this.invalidAuthTokenCount_>=INVALID_AUTH_TOKEN_THRESHOLD){// Set a long reconnect delay because recovery is unlikely
this.reconnectDelay_=RECONNECT_MAX_DELAY_FOR_ADMINS;// Notify the auth token provider that the token is invalid, which will log
// a warning
this.authTokenProvider_.notifyForInvalidToken();}}};PersistentConnection.prototype.onSecurityDebugPacket_=function(body){if(this.securityDebugCallback_){this.securityDebugCallback_(body);}else{if('msg'in body){console.log('FIREBASE: '+body['msg'].replace('\n','\nFIREBASE: '));}}};PersistentConnection.prototype.restoreState_=function(){var _this=this;//Re-authenticate ourselves if we have a credential stored.
this.tryAuth();// Puts depend on having received the corresponding data update from the server before they complete, so we must
// make sure to send listens before puts.
Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.listens_,function(pathString,queries){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(queries,function(key,listenSpec){_this.sendListen_(listenSpec);});});for(var i=0;i<this.outstandingPuts_.length;i++){if(this.outstandingPuts_[i])this.sendPut_(i);}while(this.onDisconnectRequestQueue_.length){var request=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(request.action,request.pathString,request.data,request.onComplete);}};/**
     * Sends client stats for first connection
     * @private
     */PersistentConnection.prototype.sendConnectStats_=function(){var stats={};var clientName='js';if(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["a" /* CONSTANTS */].NODE_ADMIN){clientName='admin_node';}else if(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["a" /* CONSTANTS */].NODE_CLIENT){clientName='node';}stats['sdk.'+clientName+'.'+__WEBPACK_IMPORTED_MODULE_3__firebase_app__["default"].SDK_VERSION.replace(/\./g,'-')]=1;if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["x" /* isMobileCordova */])()){stats['framework.cordova']=1;}else if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["z" /* isReactNative */])()){stats['framework.reactnative']=1;}this.reportStats(stats);};/**
     * @return {boolean}
     * @private
     */PersistentConnection.prototype.shouldReconnect_=function(){var online=OnlineMonitor.getInstance().currentlyOnline();return Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["w" /* isEmpty */])(this.interruptReasons_)&&online;};/**
     * @private
     */PersistentConnection.nextPersistentConnectionId_=0;/**
     * Counter for number of connections created. Mainly used for tagging in the logs
     * @type {number}
     * @private
     */PersistentConnection.nextConnectionId_=0;return PersistentConnection;}(ServerActions);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * An implementation of ServerActions that communicates with the server via REST requests.
 * This is mostly useful for compatibility with crawlers, where we don't want to spin up a full
 * persistent connection (using WebSockets or long-polling)
 */var ReadonlyRestClient=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(ReadonlyRestClient,_super);/**
     * @param {!RepoInfo} repoInfo_ Data about the namespace we are connecting to
     * @param {function(string, *, boolean, ?number)} onDataUpdate_ A callback for new data from the server
     * @param {AuthTokenProvider} authTokenProvider_
     * @implements {ServerActions}
     */function ReadonlyRestClient(repoInfo_,onDataUpdate_,authTokenProvider_){var _this=_super.call(this)||this;_this.repoInfo_=repoInfo_;_this.onDataUpdate_=onDataUpdate_;_this.authTokenProvider_=authTokenProvider_;/** @private {function(...[*])} */_this.log_=logWrapper('p:rest:');/**
         * We don't actually need to track listens, except to prevent us calling an onComplete for a listen
         * that's been removed. :-/
         *
         * @private {!Object.<string, !Object>}
         */_this.listens_={};return _this;}ReadonlyRestClient.prototype.reportStats=function(stats){throw new Error('Method not implemented.');};/**
     * @param {!Query} query
     * @param {?number=} tag
     * @return {string}
     * @private
     */ReadonlyRestClient.getListenId_=function(query,tag){if(tag!==undefined){return'tag$'+tag;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(query.getQueryParams().isDefault(),"should have a tag if it's not a default query.");return query.path.toString();}};/** @inheritDoc */ReadonlyRestClient.prototype.listen=function(query,currentHashFn,tag,onComplete){var _this=this;var pathString=query.path.toString();this.log_('Listen called for '+pathString+' '+query.queryIdentifier());// Mark this listener so we can tell if it's removed.
var listenId=ReadonlyRestClient.getListenId_(query,tag);var thisListen={};this.listens_[listenId]=thisListen;var queryStringParamaters=query.getQueryParams().toRestQueryStringParameters();this.restRequest_(pathString+'.json',queryStringParamaters,function(error$$1,result){var data=result;if(error$$1===404){data=null;error$$1=null;}if(error$$1===null){_this.onDataUpdate_(pathString,data,/*isMerge=*/false,tag);}if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(_this.listens_,listenId)===thisListen){var status_1;if(!error$$1){status_1='ok';}else if(error$$1==401){status_1='permission_denied';}else{status_1='rest_error:'+error$$1;}onComplete(status_1,null);}});};/** @inheritDoc */ReadonlyRestClient.prototype.unlisten=function(query,tag){var listenId=ReadonlyRestClient.getListenId_(query,tag);delete this.listens_[listenId];};/** @inheritDoc */ReadonlyRestClient.prototype.refreshAuthToken=function(token){// no-op since we just always call getToken.
};/**
     * Performs a REST request to the given path, with the provided query string parameters,
     * and any auth credentials we have.
     *
     * @param {!string} pathString
     * @param {!Object.<string, *>} queryStringParameters
     * @param {?function(?number, *=)} callback
     * @private
     */ReadonlyRestClient.prototype.restRequest_=function(pathString,queryStringParameters,callback){var _this=this;if(queryStringParameters===void 0){queryStringParameters={};}queryStringParameters['format']='export';this.authTokenProvider_.getToken(/*forceRefresh=*/false).then(function(authTokenData){var authToken=authTokenData&&authTokenData.accessToken;if(authToken){queryStringParameters['auth']=authToken;}var url=(_this.repoInfo_.secure?'https://':'http://')+_this.repoInfo_.host+pathString+'?'+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["E" /* querystring */])(queryStringParameters);_this.log_('Sending REST request for '+url);var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(){if(callback&&xhr.readyState===4){_this.log_('REST Response for '+url+' received. status:',xhr.status,'response:',xhr.responseText);var res=null;if(xhr.status>=200&&xhr.status<300){try{res=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["B" /* jsonEval */])(xhr.responseText);}catch(e){warn('Failed to parse JSON response for '+url+': '+xhr.responseText);}callback(null,res);}else{// 401 and 404 are expected.
if(xhr.status!==401&&xhr.status!==404){warn('Got unsuccessful REST response for '+url+' Status: '+xhr.status);}callback(xhr.status);}callback=null;}};xhr.open('GET',url,/*asynchronous=*/true);xhr.send();});};return ReadonlyRestClient;}(ServerActions);/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var INTERRUPT_REASON='repo_interrupt';/**
 * A connection to a single data repository.
 */var Repo=/** @class */function(){/**
     * @param {!RepoInfo} repoInfo_
     * @param {boolean} forceRestClient
     * @param {!FirebaseApp} app
     */function Repo(repoInfo_,forceRestClient,app){var _this=this;this.repoInfo_=repoInfo_;this.app=app;this.dataUpdateCount=0;this.statsListener_=null;this.eventQueue_=new EventQueue();this.nextWriteId_=1;this.interceptServerDataCallback_=null;// A list of data pieces and paths to be set when this client disconnects.
this.onDisconnect_=new SparseSnapshotTree();/**
         * TODO: This should be @private but it's used by test_access.js and internal.js
         * @type {?PersistentConnection}
         */this.persistentConnection_=null;/** @type {!AuthTokenProvider} */var authTokenProvider=new AuthTokenProvider(app);this.stats_=StatsManager.getCollection(repoInfo_);if(forceRestClient||beingCrawled()){this.server_=new ReadonlyRestClient(this.repoInfo_,this.onDataUpdate_.bind(this),authTokenProvider);// Minor hack: Fire onConnect immediately, since there's no actual connection.
setTimeout(this.onConnectStatus_.bind(this,true),0);}else{var authOverride=app.options['databaseAuthVariableOverride'];// Validate authOverride
if(typeof authOverride!=='undefined'&&authOverride!==null){if(typeof authOverride!=='object'){throw new Error('Only objects are supported for option databaseAuthVariableOverride');}try{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(authOverride);}catch(e){throw new Error('Invalid authOverride provided: '+e);}}this.persistentConnection_=new PersistentConnection(this.repoInfo_,this.onDataUpdate_.bind(this),this.onConnectStatus_.bind(this),this.onServerInfoUpdate_.bind(this),authTokenProvider,authOverride);this.server_=this.persistentConnection_;}authTokenProvider.addTokenChangeListener(function(token){_this.server_.refreshAuthToken(token);});// In the case of multiple Repos for the same repoInfo (i.e. there are multiple Firebase.Contexts being used),
// we only want to create one StatsReporter.  As such, we'll report stats over the first Repo created.
this.statsReporter_=StatsManager.getOrCreateReporter(repoInfo_,function(){return new StatsReporter(_this.stats_,_this.server_);});this.transactions_init_();// Used for .info.
this.infoData_=new SnapshotHolder();this.infoSyncTree_=new SyncTree({startListening:function startListening(query,tag,currentHashFn,onComplete){var infoEvents=[];var node=_this.infoData_.getNode(query.path);// This is possibly a hack, but we have different semantics for .info endpoints. We don't raise null events
// on initial data...
if(!node.isEmpty()){infoEvents=_this.infoSyncTree_.applyServerOverwrite(query.path,node);setTimeout(function(){onComplete('ok');},0);}return infoEvents;},stopListening:function stopListening(){}});this.updateInfo_('connected',false);this.serverSyncTree_=new SyncTree({startListening:function startListening(query,tag,currentHashFn,onComplete){_this.server_.listen(query,currentHashFn,tag,function(status,data){var events=onComplete(status,data);_this.eventQueue_.raiseEventsForChangedPath(query.path,events);});// No synchronous events for network-backed sync trees
return[];},stopListening:function stopListening(query,tag){_this.server_.unlisten(query,tag);}});}/**
     * @return {string}  The URL corresponding to the root of this Firebase.
     */Repo.prototype.toString=function(){return(this.repoInfo_.secure?'https://':'http://')+this.repoInfo_.host;};/**
     * @return {!string} The namespace represented by the repo.
     */Repo.prototype.name=function(){return this.repoInfo_.namespace;};/**
     * @return {!number} The time in milliseconds, taking the server offset into account if we have one.
     */Repo.prototype.serverTime=function(){var offsetNode=this.infoData_.getNode(new Path('.info/serverTimeOffset'));var offset=offsetNode.val()||0;return new Date().getTime()+offset;};/**
     * Generate ServerValues using some variables from the repo object.
     * @return {!Object}
     */Repo.prototype.generateServerValues=function(){return generateWithValues({timestamp:this.serverTime()});};/**
     * Called by realtime when we get new messages from the server.
     *
     * @private
     * @param {string} pathString
     * @param {*} data
     * @param {boolean} isMerge
     * @param {?number} tag
     */Repo.prototype.onDataUpdate_=function(pathString,data,isMerge,tag){// For testing.
this.dataUpdateCount++;var path=new Path(pathString);data=this.interceptServerDataCallback_?this.interceptServerDataCallback_(pathString,data):data;var events=[];if(tag){if(isMerge){var taggedChildren=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["C" /* map */])(data,function(raw){return nodeFromJSON$1(raw);});events=this.serverSyncTree_.applyTaggedQueryMerge(path,taggedChildren,tag);}else{var taggedSnap=nodeFromJSON$1(data);events=this.serverSyncTree_.applyTaggedQueryOverwrite(path,taggedSnap,tag);}}else if(isMerge){var changedChildren=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["C" /* map */])(data,function(raw){return nodeFromJSON$1(raw);});events=this.serverSyncTree_.applyServerMerge(path,changedChildren);}else{var snap=nodeFromJSON$1(data);events=this.serverSyncTree_.applyServerOverwrite(path,snap);}var affectedPath=path;if(events.length>0){// Since we have a listener outstanding for each transaction, receiving any events
// is a proxy for some change having occurred.
affectedPath=this.rerunTransactions_(path);}this.eventQueue_.raiseEventsForChangedPath(affectedPath,events);};/**
     * TODO: This should be @private but it's used by test_access.js and internal.js
     * @param {?function(!string, *):*} callback
     * @private
     */Repo.prototype.interceptServerData_=function(callback){this.interceptServerDataCallback_=callback;};/**
     * @param {!boolean} connectStatus
     * @private
     */Repo.prototype.onConnectStatus_=function(connectStatus){this.updateInfo_('connected',connectStatus);if(connectStatus===false){this.runOnDisconnectEvents_();}};/**
     * @param {!Object} updates
     * @private
     */Repo.prototype.onServerInfoUpdate_=function(updates){var _this=this;each(updates,function(value,key){_this.updateInfo_(key,value);});};/**
     *
     * @param {!string} pathString
     * @param {*} value
     * @private
     */Repo.prototype.updateInfo_=function(pathString,value){var path=new Path('/.info/'+pathString);var newNode=nodeFromJSON$1(value);this.infoData_.updateSnapshot(path,newNode);var events=this.infoSyncTree_.applyServerOverwrite(path,newNode);this.eventQueue_.raiseEventsForChangedPath(path,events);};/**
     * @return {!number}
     * @private
     */Repo.prototype.getNextWriteId_=function(){return this.nextWriteId_++;};/**
     * @param {!Path} path
     * @param {*} newVal
     * @param {number|string|null} newPriority
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.setWithPriority=function(path,newVal,newPriority,onComplete){var _this=this;this.log_('set',{path:path.toString(),value:newVal,priority:newPriority});// TODO: Optimize this behavior to either (a) store flag to skip resolving where possible and / or
// (b) store unresolved paths on JSON parse
var serverValues=this.generateServerValues();var newNodeUnresolved=nodeFromJSON$1(newVal,newPriority);var newNode=resolveDeferredValueSnapshot(newNodeUnresolved,serverValues);var writeId=this.getNextWriteId_();var events=this.serverSyncTree_.applyUserOverwrite(path,newNode,writeId,true);this.eventQueue_.queueEvents(events);this.server_.put(path.toString(),newNodeUnresolved.val(/*export=*/true),function(status,errorReason){var success=status==='ok';if(!success){warn('set at '+path+' failed: '+status);}var clearEvents=_this.serverSyncTree_.ackUserWrite(writeId,!success);_this.eventQueue_.raiseEventsForChangedPath(path,clearEvents);_this.callOnCompleteCallback(onComplete,status,errorReason);});var affectedPath=this.abortTransactions_(path);this.rerunTransactions_(affectedPath);// We queued the events above, so just flush the queue here
this.eventQueue_.raiseEventsForChangedPath(affectedPath,[]);};/**
     * @param {!Path} path
     * @param {!Object} childrenToMerge
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.update=function(path,childrenToMerge,onComplete){var _this=this;this.log_('update',{path:path.toString(),value:childrenToMerge});// Start with our existing data and merge each child into it.
var empty=true;var serverValues=this.generateServerValues();var changedChildren={};Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(childrenToMerge,function(changedKey,changedValue){empty=false;var newNodeUnresolved=nodeFromJSON$1(changedValue);changedChildren[changedKey]=resolveDeferredValueSnapshot(newNodeUnresolved,serverValues);});if(!empty){var writeId_1=this.getNextWriteId_();var events=this.serverSyncTree_.applyUserMerge(path,changedChildren,writeId_1);this.eventQueue_.queueEvents(events);this.server_.merge(path.toString(),childrenToMerge,function(status,errorReason){var success=status==='ok';if(!success){warn('update at '+path+' failed: '+status);}var clearEvents=_this.serverSyncTree_.ackUserWrite(writeId_1,!success);var affectedPath=clearEvents.length>0?_this.rerunTransactions_(path):path;_this.eventQueue_.raiseEventsForChangedPath(affectedPath,clearEvents);_this.callOnCompleteCallback(onComplete,status,errorReason);});Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(childrenToMerge,function(changedPath){var affectedPath=_this.abortTransactions_(path.child(changedPath));_this.rerunTransactions_(affectedPath);});// We queued the events above, so just flush the queue here
this.eventQueue_.raiseEventsForChangedPath(path,[]);}else{log("update() called with empty data.  Don't do anything.");this.callOnCompleteCallback(onComplete,'ok');}};/**
     * Applies all of the changes stored up in the onDisconnect_ tree.
     * @private
     */Repo.prototype.runOnDisconnectEvents_=function(){var _this=this;this.log_('onDisconnectEvents');var serverValues=this.generateServerValues();var resolvedOnDisconnectTree=resolveDeferredValueTree(this.onDisconnect_,serverValues);var events=[];resolvedOnDisconnectTree.forEachTree(Path.Empty,function(path,snap){events=events.concat(_this.serverSyncTree_.applyServerOverwrite(path,snap));var affectedPath=_this.abortTransactions_(path);_this.rerunTransactions_(affectedPath);});this.onDisconnect_=new SparseSnapshotTree();this.eventQueue_.raiseEventsForChangedPath(Path.Empty,events);};/**
     * @param {!Path} path
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.onDisconnectCancel=function(path,onComplete){var _this=this;this.server_.onDisconnectCancel(path.toString(),function(status,errorReason){if(status==='ok'){_this.onDisconnect_.forget(path);}_this.callOnCompleteCallback(onComplete,status,errorReason);});};/**
     * @param {!Path} path
     * @param {*} value
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.onDisconnectSet=function(path,value,onComplete){var _this=this;var newNode=nodeFromJSON$1(value);this.server_.onDisconnectPut(path.toString(),newNode.val(/*export=*/true),function(status,errorReason){if(status==='ok'){_this.onDisconnect_.remember(path,newNode);}_this.callOnCompleteCallback(onComplete,status,errorReason);});};/**
     * @param {!Path} path
     * @param {*} value
     * @param {*} priority
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.onDisconnectSetWithPriority=function(path,value,priority,onComplete){var _this=this;var newNode=nodeFromJSON$1(value,priority);this.server_.onDisconnectPut(path.toString(),newNode.val(/*export=*/true),function(status,errorReason){if(status==='ok'){_this.onDisconnect_.remember(path,newNode);}_this.callOnCompleteCallback(onComplete,status,errorReason);});};/**
     * @param {!Path} path
     * @param {*} childrenToMerge
     * @param {?function(?Error, *=)} onComplete
     */Repo.prototype.onDisconnectUpdate=function(path,childrenToMerge,onComplete){var _this=this;if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["w" /* isEmpty */])(childrenToMerge)){log("onDisconnect().update() called with empty data.  Don't do anything.");this.callOnCompleteCallback(onComplete,'ok');return;}this.server_.onDisconnectMerge(path.toString(),childrenToMerge,function(status,errorReason){if(status==='ok'){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(childrenToMerge,function(childName,childNode){var newChildNode=nodeFromJSON$1(childNode);_this.onDisconnect_.remember(path.child(childName),newChildNode);});}_this.callOnCompleteCallback(onComplete,status,errorReason);});};/**
     * @param {!Query} query
     * @param {!EventRegistration} eventRegistration
     */Repo.prototype.addEventCallbackForQuery=function(query,eventRegistration){var events;if(query.path.getFront()==='.info'){events=this.infoSyncTree_.addEventRegistration(query,eventRegistration);}else{events=this.serverSyncTree_.addEventRegistration(query,eventRegistration);}this.eventQueue_.raiseEventsAtPath(query.path,events);};/**
     * @param {!Query} query
     * @param {?EventRegistration} eventRegistration
     */Repo.prototype.removeEventCallbackForQuery=function(query,eventRegistration){// These are guaranteed not to raise events, since we're not passing in a cancelError. However, we can future-proof
// a little bit by handling the return values anyways.
var events;if(query.path.getFront()==='.info'){events=this.infoSyncTree_.removeEventRegistration(query,eventRegistration);}else{events=this.serverSyncTree_.removeEventRegistration(query,eventRegistration);}this.eventQueue_.raiseEventsAtPath(query.path,events);};Repo.prototype.interrupt=function(){if(this.persistentConnection_){this.persistentConnection_.interrupt(INTERRUPT_REASON);}};Repo.prototype.resume=function(){if(this.persistentConnection_){this.persistentConnection_.resume(INTERRUPT_REASON);}};Repo.prototype.stats=function(showDelta){if(showDelta===void 0){showDelta=false;}if(typeof console==='undefined')return;var stats;if(showDelta){if(!this.statsListener_)this.statsListener_=new StatsListener(this.stats_);stats=this.statsListener_.get();}else{stats=this.stats_.get();}var longestName=Object.keys(stats).reduce(function(previousValue,currentValue){return Math.max(currentValue.length,previousValue);},0);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(stats,function(stat,value){// pad stat names to be the same length (plus 2 extra spaces).
for(var i=stat.length;i<longestName+2;i++){stat+=' ';}console.log(stat+value);});};Repo.prototype.statsIncrementCounter=function(metric){this.stats_.incrementCounter(metric);this.statsReporter_.includeStat(metric);};/**
     * @param {...*} var_args
     * @private
     */Repo.prototype.log_=function(){var var_args=[];for(var _i=0;_i<arguments.length;_i++){var_args[_i]=arguments[_i];}var prefix='';if(this.persistentConnection_){prefix=this.persistentConnection_.id+':';}log.apply(void 0,[prefix].concat(var_args));};/**
     * @param {?function(?Error, *=)} callback
     * @param {!string} status
     * @param {?string=} errorReason
     */Repo.prototype.callOnCompleteCallback=function(callback,status,errorReason){if(callback){exceptionGuard(function(){if(status=='ok'){callback(null);}else{var code=(status||'error').toUpperCase();var message=code;if(errorReason)message+=': '+errorReason;var error$$1=new Error(message);error$$1.code=code;callback(error$$1);}});}};Object.defineProperty(Repo.prototype,"database",{get:function get(){return this.__database||(this.__database=new Database(this));},enumerable:true,configurable:true});return Repo;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Filters nodes by range and uses an IndexFilter to track any changes after filtering the node
 *
 * @constructor
 * @implements {NodeFilter}
 */var RangedFilter=/** @class */function(){/**
     * @param {!QueryParams} params
     */function RangedFilter(params){this.indexedFilter_=new IndexedFilter(params.getIndex());this.index_=params.getIndex();this.startPost_=RangedFilter.getStartPost_(params);this.endPost_=RangedFilter.getEndPost_(params);}/**
     * @return {!NamedNode}
     */RangedFilter.prototype.getStartPost=function(){return this.startPost_;};/**
     * @return {!NamedNode}
     */RangedFilter.prototype.getEndPost=function(){return this.endPost_;};/**
     * @param {!NamedNode} node
     * @return {boolean}
     */RangedFilter.prototype.matches=function(node){return this.index_.compare(this.getStartPost(),node)<=0&&this.index_.compare(node,this.getEndPost())<=0;};/**
     * @inheritDoc
     */RangedFilter.prototype.updateChild=function(snap,key,newChild,affectedPath,source,optChangeAccumulator){if(!this.matches(new NamedNode(key,newChild))){newChild=ChildrenNode.EMPTY_NODE;}return this.indexedFilter_.updateChild(snap,key,newChild,affectedPath,source,optChangeAccumulator);};/**
     * @inheritDoc
     */RangedFilter.prototype.updateFullNode=function(oldSnap,newSnap,optChangeAccumulator){if(newSnap.isLeafNode()){// Make sure we have a children node with the correct index, not a leaf node;
newSnap=ChildrenNode.EMPTY_NODE;}var filtered=newSnap.withIndex(this.index_);// Don't support priorities on queries
filtered=filtered.updatePriority(ChildrenNode.EMPTY_NODE);var self=this;newSnap.forEachChild(PRIORITY_INDEX,function(key,childNode){if(!self.matches(new NamedNode(key,childNode))){filtered=filtered.updateImmediateChild(key,ChildrenNode.EMPTY_NODE);}});return this.indexedFilter_.updateFullNode(oldSnap,filtered,optChangeAccumulator);};/**
     * @inheritDoc
     */RangedFilter.prototype.updatePriority=function(oldSnap,newPriority){// Don't support priorities on queries
return oldSnap;};/**
     * @inheritDoc
     */RangedFilter.prototype.filtersNodes=function(){return true;};/**
     * @inheritDoc
     */RangedFilter.prototype.getIndexedFilter=function(){return this.indexedFilter_;};/**
     * @inheritDoc
     */RangedFilter.prototype.getIndex=function(){return this.index_;};/**
     * @param {!QueryParams} params
     * @return {!NamedNode}
     * @private
     */RangedFilter.getStartPost_=function(params){if(params.hasStart()){var startName=params.getIndexStartName();return params.getIndex().makePost(params.getIndexStartValue(),startName);}else{return params.getIndex().minPost();}};/**
     * @param {!QueryParams} params
     * @return {!NamedNode}
     * @private
     */RangedFilter.getEndPost_=function(params){if(params.hasEnd()){var endName=params.getIndexEndName();return params.getIndex().makePost(params.getIndexEndValue(),endName);}else{return params.getIndex().maxPost();}};return RangedFilter;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Applies a limit and a range to a node and uses RangedFilter to do the heavy lifting where possible
 *
 * @constructor
 * @implements {NodeFilter}
 */var LimitedFilter=/** @class */function(){/**
     * @param {!QueryParams} params
     */function LimitedFilter(params){this.rangedFilter_=new RangedFilter(params);this.index_=params.getIndex();this.limit_=params.getLimit();this.reverse_=!params.isViewFromLeft();}/**
     * @inheritDoc
     */LimitedFilter.prototype.updateChild=function(snap,key,newChild,affectedPath,source,optChangeAccumulator){if(!this.rangedFilter_.matches(new NamedNode(key,newChild))){newChild=ChildrenNode.EMPTY_NODE;}if(snap.getImmediateChild(key).equals(newChild)){// No change
return snap;}else if(snap.numChildren()<this.limit_){return this.rangedFilter_.getIndexedFilter().updateChild(snap,key,newChild,affectedPath,source,optChangeAccumulator);}else{return this.fullLimitUpdateChild_(snap,key,newChild,source,optChangeAccumulator);}};/**
     * @inheritDoc
     */LimitedFilter.prototype.updateFullNode=function(oldSnap,newSnap,optChangeAccumulator){var filtered;if(newSnap.isLeafNode()||newSnap.isEmpty()){// Make sure we have a children node with the correct index, not a leaf node;
filtered=ChildrenNode.EMPTY_NODE.withIndex(this.index_);}else{if(this.limit_*2<newSnap.numChildren()&&newSnap.isIndexed(this.index_)){// Easier to build up a snapshot, since what we're given has more than twice the elements we want
filtered=ChildrenNode.EMPTY_NODE.withIndex(this.index_);// anchor to the startPost, endPost, or last element as appropriate
var iterator=void 0;if(this.reverse_){iterator=newSnap.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_);}else{iterator=newSnap.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);}var count=0;while(iterator.hasNext()&&count<this.limit_){var next=iterator.getNext();var inRange=void 0;if(this.reverse_){inRange=this.index_.compare(this.rangedFilter_.getStartPost(),next)<=0;}else{inRange=this.index_.compare(next,this.rangedFilter_.getEndPost())<=0;}if(inRange){filtered=filtered.updateImmediateChild(next.name,next.node);count++;}else{// if we have reached the end post, we cannot keep adding elemments
break;}}}else{// The snap contains less than twice the limit. Faster to delete from the snap than build up a new one
filtered=newSnap.withIndex(this.index_);// Don't support priorities on queries
filtered=filtered.updatePriority(ChildrenNode.EMPTY_NODE);var startPost=void 0;var endPost=void 0;var cmp=void 0;var iterator=void 0;if(this.reverse_){iterator=filtered.getReverseIterator(this.index_);startPost=this.rangedFilter_.getEndPost();endPost=this.rangedFilter_.getStartPost();var indexCompare_1=this.index_.getCompare();cmp=function cmp(a,b){return indexCompare_1(b,a);};}else{iterator=filtered.getIterator(this.index_);startPost=this.rangedFilter_.getStartPost();endPost=this.rangedFilter_.getEndPost();cmp=this.index_.getCompare();}var count=0;var foundStartPost=false;while(iterator.hasNext()){var next=iterator.getNext();if(!foundStartPost&&cmp(startPost,next)<=0){// start adding
foundStartPost=true;}var inRange=foundStartPost&&count<this.limit_&&cmp(next,endPost)<=0;if(inRange){count++;}else{filtered=filtered.updateImmediateChild(next.name,ChildrenNode.EMPTY_NODE);}}}}return this.rangedFilter_.getIndexedFilter().updateFullNode(oldSnap,filtered,optChangeAccumulator);};/**
     * @inheritDoc
     */LimitedFilter.prototype.updatePriority=function(oldSnap,newPriority){// Don't support priorities on queries
return oldSnap;};/**
     * @inheritDoc
     */LimitedFilter.prototype.filtersNodes=function(){return true;};/**
     * @inheritDoc
     */LimitedFilter.prototype.getIndexedFilter=function(){return this.rangedFilter_.getIndexedFilter();};/**
     * @inheritDoc
     */LimitedFilter.prototype.getIndex=function(){return this.index_;};/**
     * @param {!Node} snap
     * @param {string} childKey
     * @param {!Node} childSnap
     * @param {!CompleteChildSource} source
     * @param {?ChildChangeAccumulator} changeAccumulator
     * @return {!Node}
     * @private
     */LimitedFilter.prototype.fullLimitUpdateChild_=function(snap,childKey,childSnap,source,changeAccumulator){// TODO: rename all cache stuff etc to general snap terminology
var cmp;if(this.reverse_){var indexCmp_1=this.index_.getCompare();cmp=function cmp(a,b){return indexCmp_1(b,a);};}else{cmp=this.index_.getCompare();}var oldEventCache=snap;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(oldEventCache.numChildren()==this.limit_,'');var newChildNamedNode=new NamedNode(childKey,childSnap);var windowBoundary=this.reverse_?oldEventCache.getFirstChild(this.index_):oldEventCache.getLastChild(this.index_);var inRange=this.rangedFilter_.matches(newChildNamedNode);if(oldEventCache.hasChild(childKey)){var oldChildSnap=oldEventCache.getImmediateChild(childKey);var nextChild=source.getChildAfterChild(this.index_,windowBoundary,this.reverse_);while(nextChild!=null&&(nextChild.name==childKey||oldEventCache.hasChild(nextChild.name))){// There is a weird edge case where a node is updated as part of a merge in the write tree, but hasn't
// been applied to the limited filter yet. Ignore this next child which will be updated later in
// the limited filter...
nextChild=source.getChildAfterChild(this.index_,nextChild,this.reverse_);}var compareNext=nextChild==null?1:cmp(nextChild,newChildNamedNode);var remainsInWindow=inRange&&!childSnap.isEmpty()&&compareNext>=0;if(remainsInWindow){if(changeAccumulator!=null){changeAccumulator.trackChildChange(Change.childChangedChange(childKey,childSnap,oldChildSnap));}return oldEventCache.updateImmediateChild(childKey,childSnap);}else{if(changeAccumulator!=null){changeAccumulator.trackChildChange(Change.childRemovedChange(childKey,oldChildSnap));}var newEventCache=oldEventCache.updateImmediateChild(childKey,ChildrenNode.EMPTY_NODE);var nextChildInRange=nextChild!=null&&this.rangedFilter_.matches(nextChild);if(nextChildInRange){if(changeAccumulator!=null){changeAccumulator.trackChildChange(Change.childAddedChange(nextChild.name,nextChild.node));}return newEventCache.updateImmediateChild(nextChild.name,nextChild.node);}else{return newEventCache;}}}else if(childSnap.isEmpty()){// we're deleting a node, but it was not in the window, so ignore it
return snap;}else if(inRange){if(cmp(windowBoundary,newChildNamedNode)>=0){if(changeAccumulator!=null){changeAccumulator.trackChildChange(Change.childRemovedChange(windowBoundary.name,windowBoundary.node));changeAccumulator.trackChildChange(Change.childAddedChange(childKey,childSnap));}return oldEventCache.updateImmediateChild(childKey,childSnap).updateImmediateChild(windowBoundary.name,ChildrenNode.EMPTY_NODE);}else{return snap;}}else{return snap;}};return LimitedFilter;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * This class is an immutable-from-the-public-api struct containing a set of query parameters defining a
 * range to be returned for a particular location. It is assumed that validation of parameters is done at the
 * user-facing API level, so it is not done here.
 * @constructor
 */var QueryParams=/** @class */function(){function QueryParams(){this.limitSet_=false;this.startSet_=false;this.startNameSet_=false;this.endSet_=false;this.endNameSet_=false;this.limit_=0;this.viewFrom_='';this.indexStartValue_=null;this.indexStartName_='';this.indexEndValue_=null;this.indexEndName_='';this.index_=PRIORITY_INDEX;}/**
     * @return {boolean}
     */QueryParams.prototype.hasStart=function(){return this.startSet_;};/**
     * @return {boolean} True if it would return from left.
     */QueryParams.prototype.isViewFromLeft=function(){if(this.viewFrom_===''){// limit(), rather than limitToFirst or limitToLast was called.
// This means that only one of startSet_ and endSet_ is true. Use them
// to calculate which side of the view to anchor to. If neither is set,
// anchor to the end.
return this.startSet_;}else{return this.viewFrom_===QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT;}};/**
     * Only valid to call if hasStart() returns true
     * @return {*}
     */QueryParams.prototype.getIndexStartValue=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.startSet_,'Only valid if start has been set');return this.indexStartValue_;};/**
     * Only valid to call if hasStart() returns true.
     * Returns the starting key name for the range defined by these query parameters
     * @return {!string}
     */QueryParams.prototype.getIndexStartName=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.startSet_,'Only valid if start has been set');if(this.startNameSet_){return this.indexStartName_;}else{return MIN_NAME;}};/**
     * @return {boolean}
     */QueryParams.prototype.hasEnd=function(){return this.endSet_;};/**
     * Only valid to call if hasEnd() returns true.
     * @return {*}
     */QueryParams.prototype.getIndexEndValue=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.endSet_,'Only valid if end has been set');return this.indexEndValue_;};/**
     * Only valid to call if hasEnd() returns true.
     * Returns the end key name for the range defined by these query parameters
     * @return {!string}
     */QueryParams.prototype.getIndexEndName=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.endSet_,'Only valid if end has been set');if(this.endNameSet_){return this.indexEndName_;}else{return MAX_NAME;}};/**
     * @return {boolean}
     */QueryParams.prototype.hasLimit=function(){return this.limitSet_;};/**
     * @return {boolean} True if a limit has been set and it has been explicitly anchored
     */QueryParams.prototype.hasAnchoredLimit=function(){return this.limitSet_&&this.viewFrom_!=='';};/**
     * Only valid to call if hasLimit() returns true
     * @return {!number}
     */QueryParams.prototype.getLimit=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.limitSet_,'Only valid if limit has been set');return this.limit_;};/**
     * @return {!Index}
     */QueryParams.prototype.getIndex=function(){return this.index_;};/**
     * @return {!QueryParams}
     * @private
     */QueryParams.prototype.copy_=function(){var copy=new QueryParams();copy.limitSet_=this.limitSet_;copy.limit_=this.limit_;copy.startSet_=this.startSet_;copy.indexStartValue_=this.indexStartValue_;copy.startNameSet_=this.startNameSet_;copy.indexStartName_=this.indexStartName_;copy.endSet_=this.endSet_;copy.indexEndValue_=this.indexEndValue_;copy.endNameSet_=this.endNameSet_;copy.indexEndName_=this.indexEndName_;copy.index_=this.index_;copy.viewFrom_=this.viewFrom_;return copy;};/**
     * @param {!number} newLimit
     * @return {!QueryParams}
     */QueryParams.prototype.limit=function(newLimit){var newParams=this.copy_();newParams.limitSet_=true;newParams.limit_=newLimit;newParams.viewFrom_='';return newParams;};/**
     * @param {!number} newLimit
     * @return {!QueryParams}
     */QueryParams.prototype.limitToFirst=function(newLimit){var newParams=this.copy_();newParams.limitSet_=true;newParams.limit_=newLimit;newParams.viewFrom_=QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT;return newParams;};/**
     * @param {!number} newLimit
     * @return {!QueryParams}
     */QueryParams.prototype.limitToLast=function(newLimit){var newParams=this.copy_();newParams.limitSet_=true;newParams.limit_=newLimit;newParams.viewFrom_=QueryParams.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_RIGHT;return newParams;};/**
     * @param {*} indexValue
     * @param {?string=} key
     * @return {!QueryParams}
     */QueryParams.prototype.startAt=function(indexValue,key){var newParams=this.copy_();newParams.startSet_=true;if(!(indexValue!==undefined)){indexValue=null;}newParams.indexStartValue_=indexValue;if(key!=null){newParams.startNameSet_=true;newParams.indexStartName_=key;}else{newParams.startNameSet_=false;newParams.indexStartName_='';}return newParams;};/**
     * @param {*} indexValue
     * @param {?string=} key
     * @return {!QueryParams}
     */QueryParams.prototype.endAt=function(indexValue,key){var newParams=this.copy_();newParams.endSet_=true;if(!(indexValue!==undefined)){indexValue=null;}newParams.indexEndValue_=indexValue;if(key!==undefined){newParams.endNameSet_=true;newParams.indexEndName_=key;}else{newParams.endNameSet_=false;newParams.indexEndName_='';}return newParams;};/**
     * @param {!Index} index
     * @return {!QueryParams}
     */QueryParams.prototype.orderBy=function(index){var newParams=this.copy_();newParams.index_=index;return newParams;};/**
     * @return {!Object}
     */QueryParams.prototype.getQueryObject=function(){var WIRE_PROTOCOL_CONSTANTS=QueryParams.WIRE_PROTOCOL_CONSTANTS_;var obj={};if(this.startSet_){obj[WIRE_PROTOCOL_CONSTANTS.INDEX_START_VALUE]=this.indexStartValue_;if(this.startNameSet_){obj[WIRE_PROTOCOL_CONSTANTS.INDEX_START_NAME]=this.indexStartName_;}}if(this.endSet_){obj[WIRE_PROTOCOL_CONSTANTS.INDEX_END_VALUE]=this.indexEndValue_;if(this.endNameSet_){obj[WIRE_PROTOCOL_CONSTANTS.INDEX_END_NAME]=this.indexEndName_;}}if(this.limitSet_){obj[WIRE_PROTOCOL_CONSTANTS.LIMIT]=this.limit_;var viewFrom=this.viewFrom_;if(viewFrom===''){if(this.isViewFromLeft()){viewFrom=WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_LEFT;}else{viewFrom=WIRE_PROTOCOL_CONSTANTS.VIEW_FROM_RIGHT;}}obj[WIRE_PROTOCOL_CONSTANTS.VIEW_FROM]=viewFrom;}// For now, priority index is the default, so we only specify if it's some other index
if(this.index_!==PRIORITY_INDEX){obj[WIRE_PROTOCOL_CONSTANTS.INDEX]=this.index_.toString();}return obj;};/**
     * @return {boolean}
     */QueryParams.prototype.loadsAllData=function(){return!(this.startSet_||this.endSet_||this.limitSet_);};/**
     * @return {boolean}
     */QueryParams.prototype.isDefault=function(){return this.loadsAllData()&&this.index_==PRIORITY_INDEX;};/**
     * @return {!NodeFilter}
     */QueryParams.prototype.getNodeFilter=function(){if(this.loadsAllData()){return new IndexedFilter(this.getIndex());}else if(this.hasLimit()){return new LimitedFilter(this);}else{return new RangedFilter(this);}};/**
     * Returns a set of REST query string parameters representing this query.
     *
     * @return {!Object.<string,*>} query string parameters
     */QueryParams.prototype.toRestQueryStringParameters=function(){var REST_CONSTANTS=QueryParams.REST_QUERY_CONSTANTS_;var qs={};if(this.isDefault()){return qs;}var orderBy;if(this.index_===PRIORITY_INDEX){orderBy=REST_CONSTANTS.PRIORITY_INDEX;}else if(this.index_===VALUE_INDEX){orderBy=REST_CONSTANTS.VALUE_INDEX;}else if(this.index_===KEY_INDEX){orderBy=REST_CONSTANTS.KEY_INDEX;}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(this.index_ instanceof PathIndex,'Unrecognized index type!');orderBy=this.index_.toString();}qs[REST_CONSTANTS.ORDER_BY]=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(orderBy);if(this.startSet_){qs[REST_CONSTANTS.START_AT]=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(this.indexStartValue_);if(this.startNameSet_){qs[REST_CONSTANTS.START_AT]+=','+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(this.indexStartName_);}}if(this.endSet_){qs[REST_CONSTANTS.END_AT]=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(this.indexEndValue_);if(this.endNameSet_){qs[REST_CONSTANTS.END_AT]+=','+Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["I" /* stringify */])(this.indexEndName_);}}if(this.limitSet_){if(this.isViewFromLeft()){qs[REST_CONSTANTS.LIMIT_TO_FIRST]=this.limit_;}else{qs[REST_CONSTANTS.LIMIT_TO_LAST]=this.limit_;}}return qs;};/**
     * Wire Protocol Constants
     * @const
     * @enum {string}
     * @private
     */QueryParams.WIRE_PROTOCOL_CONSTANTS_={INDEX_START_VALUE:'sp',INDEX_START_NAME:'sn',INDEX_END_VALUE:'ep',INDEX_END_NAME:'en',LIMIT:'l',VIEW_FROM:'vf',VIEW_FROM_LEFT:'l',VIEW_FROM_RIGHT:'r',INDEX:'i'};/**
     * REST Query Constants
     * @const
     * @enum {string}
     * @private
     */QueryParams.REST_QUERY_CONSTANTS_={ORDER_BY:'orderBy',PRIORITY_INDEX:'$priority',VALUE_INDEX:'$value',KEY_INDEX:'$key',START_AT:'startAt',END_AT:'endAt',LIMIT_TO_FIRST:'limitToFirst',LIMIT_TO_LAST:'limitToLast'};/**
     * Default, empty query parameters
     * @type {!QueryParams}
     * @const
     */QueryParams.DEFAULT=new QueryParams();return QueryParams;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Reference=/** @class */function(_super){Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["b" /* __extends */])(Reference,_super);/**
     * Call options:
     *   new Reference(Repo, Path) or
     *   new Reference(url: string, string|RepoManager)
     *
     * Externally - this is the firebase.database.Reference type.
     *
     * @param {!Repo} repo
     * @param {(!Path)} path
     * @extends {Query}
     */function Reference(repo,path){var _this=this;if(!(repo instanceof Repo)){throw new Error('new Reference() no longer supported - use app.database().');}// call Query's constructor, passing in the repo and path.
_this=_super.call(this,repo,path,QueryParams.DEFAULT,false)||this;return _this;}/** @return {?string} */Reference.prototype.getKey=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.key',0,0,arguments.length);if(this.path.isEmpty())return null;else return this.path.getBack();};/**
     * @param {!(string|Path)} pathString
     * @return {!Reference}
     */Reference.prototype.child=function(pathString){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.child',1,1,arguments.length);if(typeof pathString==='number'){pathString=String(pathString);}else if(!(pathString instanceof Path)){if(this.path.getFront()===null)validateRootPathString('Reference.child',1,pathString,false);else validatePathString('Reference.child',1,pathString,false);}return new Reference(this.repo,this.path.child(pathString));};/** @return {?Reference} */Reference.prototype.getParent=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.parent',0,0,arguments.length);var parentPath=this.path.parent();return parentPath===null?null:new Reference(this.repo,parentPath);};/** @return {!Reference} */Reference.prototype.getRoot=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.root',0,0,arguments.length);var ref=this;while(ref.getParent()!==null){ref=ref.getParent();}return ref;};/** @return {!Database} */Reference.prototype.databaseProp=function(){return this.repo.database;};/**
     * @param {*} newVal
     * @param {function(?Error)=} onComplete
     * @return {!Promise}
     */Reference.prototype.set=function(newVal,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.set',1,2,arguments.length);validateWritablePath('Reference.set',this.path);validateFirebaseDataArg('Reference.set',1,newVal,this.path,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.set',2,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo.setWithPriority(this.path,newVal,/*priority=*/null,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {!Object} objectToMerge
     * @param {function(?Error)=} onComplete
     * @return {!Promise}
     */Reference.prototype.update=function(objectToMerge,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.update',1,2,arguments.length);validateWritablePath('Reference.update',this.path);if(Array.isArray(objectToMerge)){var newObjectToMerge={};for(var i=0;i<objectToMerge.length;++i){newObjectToMerge[''+i]=objectToMerge[i];}objectToMerge=newObjectToMerge;warn('Passing an Array to Firebase.update() is deprecated. '+'Use set() if you want to overwrite the existing data, or '+'an Object with integer keys if you really do want to '+'only update some of the children.');}validateFirebaseMergeDataArg('Reference.update',1,objectToMerge,this.path,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.update',2,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo.update(this.path,objectToMerge,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {*} newVal
     * @param {string|number|null} newPriority
     * @param {function(?Error)=} onComplete
     * @return {!Promise}
     */Reference.prototype.setWithPriority=function(newVal,newPriority,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.setWithPriority',2,3,arguments.length);validateWritablePath('Reference.setWithPriority',this.path);validateFirebaseDataArg('Reference.setWithPriority',1,newVal,this.path,false);validatePriority('Reference.setWithPriority',2,newPriority,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.setWithPriority',3,onComplete,true);if(this.getKey()==='.length'||this.getKey()==='.keys')throw'Reference.setWithPriority failed: '+this.getKey()+' is a read-only object.';var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo.setWithPriority(this.path,newVal,newPriority,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {function(?Error)=} onComplete
     * @return {!Promise}
     */Reference.prototype.remove=function(onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.remove',0,1,arguments.length);validateWritablePath('Reference.remove',this.path);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.remove',1,onComplete,true);return this.set(null,onComplete);};/**
     * @param {function(*):*} transactionUpdate
     * @param {(function(?Error, boolean, ?DataSnapshot))=} onComplete
     * @param {boolean=} applyLocally
     * @return {!Promise}
     */Reference.prototype.transaction=function(transactionUpdate,onComplete,applyLocally){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.transaction',1,3,arguments.length);validateWritablePath('Reference.transaction',this.path);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.transaction',1,transactionUpdate,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.transaction',2,onComplete,true);// NOTE: applyLocally is an internal-only option for now.  We need to decide if we want to keep it and how
// to expose it.
validateBoolean('Reference.transaction',3,applyLocally,true);if(this.getKey()==='.length'||this.getKey()==='.keys')throw'Reference.transaction failed: '+this.getKey()+' is a read-only object.';if(applyLocally===undefined)applyLocally=true;var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();if(typeof onComplete==='function'){deferred.promise.catch(function(){});}var promiseComplete=function promiseComplete(error$$1,committed,snapshot){if(error$$1){deferred.reject(error$$1);}else{deferred.resolve(new TransactionResult(committed,snapshot));}if(typeof onComplete==='function'){onComplete(error$$1,committed,snapshot);}};this.repo.startTransaction(this.path,transactionUpdate,promiseComplete,applyLocally);return deferred.promise;};/**
     * @param {string|number|null} priority
     * @param {function(?Error)=} onComplete
     * @return {!Promise}
     */Reference.prototype.setPriority=function(priority,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.setPriority',1,2,arguments.length);validateWritablePath('Reference.setPriority',this.path);validatePriority('Reference.setPriority',1,priority,false);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.setPriority',2,onComplete,true);var deferred=new __WEBPACK_IMPORTED_MODULE_0__firebase_util__["b" /* Deferred */]();this.repo.setWithPriority(this.path.child('.priority'),priority,null,deferred.wrapCallback(onComplete));return deferred.promise;};/**
     * @param {*=} value
     * @param {function(?Error)=} onComplete
     * @return {!Reference}
     */Reference.prototype.push=function(value,onComplete){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('Reference.push',0,2,arguments.length);validateWritablePath('Reference.push',this.path);validateFirebaseDataArg('Reference.push',1,value,this.path,true);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["K" /* validateCallback */])('Reference.push',2,onComplete,true);var now=this.repo.serverTime();var name=nextPushId(now);// push() returns a ThennableReference whose promise is fulfilled with a regular Reference.
// We use child() to create handles to two different references. The first is turned into a
// ThennableReference below by adding then() and catch() methods and is used as the
// return value of push(). The second remains a regular Reference and is used as the fulfilled
// value of the first ThennableReference.
var thennablePushRef=this.child(name);var pushRef=this.child(name);var promise;if(value!=null){promise=thennablePushRef.set(value,onComplete).then(function(){return pushRef;});}else{promise=Promise.resolve(pushRef);}thennablePushRef.then=promise.then.bind(promise);thennablePushRef.catch=promise.then.bind(promise,undefined);if(typeof onComplete==='function'){promise.catch(function(){});}return thennablePushRef;};/**
     * @return {!OnDisconnect}
     */Reference.prototype.onDisconnect=function(){validateWritablePath('Reference.onDisconnect',this.path);return new OnDisconnect(this.repo,this.path);};Object.defineProperty(Reference.prototype,"database",{get:function get(){return this.databaseProp();},enumerable:true,configurable:true});Object.defineProperty(Reference.prototype,"key",{get:function get(){return this.getKey();},enumerable:true,configurable:true});Object.defineProperty(Reference.prototype,"parent",{get:function get(){return this.getParent();},enumerable:true,configurable:true});Object.defineProperty(Reference.prototype,"root",{get:function get(){return this.getRoot();},enumerable:true,configurable:true});return Reference;}(Query);/**
 * Define reference constructor in various modules
 *
 * We are doing this here to avoid several circular
 * dependency issues
 */Query.__referenceConstructor=Reference;SyncPoint.__referenceConstructor=Reference;/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Node in a Tree.
 */var TreeNode=/** @class */function(){function TreeNode(){// TODO: Consider making accessors that create children and value lazily or
// separate Internal / Leaf 'types'.
this.children={};this.childCount=0;this.value=null;}return TreeNode;}();/**
 * A light-weight tree, traversable by path.  Nodes can have both values and children.
 * Nodes are not enumerated (by forEachChild) unless they have a value or non-empty
 * children.
 */var Tree=/** @class */function(){/**
     * @template T
     * @param {string=} name_ Optional name of the node.
     * @param {Tree=} parent_ Optional parent node.
     * @param {TreeNode=} node_ Optional node to wrap.
     */function Tree(name_,parent_,node_){if(name_===void 0){name_='';}if(parent_===void 0){parent_=null;}if(node_===void 0){node_=new TreeNode();}this.name_=name_;this.parent_=parent_;this.node_=node_;}/**
     * Returns a sub-Tree for the given path.
     *
     * @param {!(string|Path)} pathObj Path to look up.
     * @return {!Tree.<T>} Tree for path.
     */Tree.prototype.subTree=function(pathObj){// TODO: Require pathObj to be Path?
var path=pathObj instanceof Path?pathObj:new Path(pathObj);var child=this,next;while((next=path.getFront())!==null){var childNode=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(child.node_.children,next)||new TreeNode();child=new Tree(next,child,childNode);path=path.popFront();}return child;};/**
     * Returns the data associated with this tree node.
     *
     * @return {?T} The data or null if no data exists.
     */Tree.prototype.getValue=function(){return this.node_.value;};/**
     * Sets data to this tree node.
     *
     * @param {!T} value Value to set.
     */Tree.prototype.setValue=function(value){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(typeof value!=='undefined','Cannot set value to undefined');this.node_.value=value;this.updateParents_();};/**
     * Clears the contents of the tree node (its value and all children).
     */Tree.prototype.clear=function(){this.node_.value=null;this.node_.children={};this.node_.childCount=0;this.updateParents_();};/**
     * @return {boolean} Whether the tree has any children.
     */Tree.prototype.hasChildren=function(){return this.node_.childCount>0;};/**
     * @return {boolean} Whether the tree is empty (no value or children).
     */Tree.prototype.isEmpty=function(){return this.getValue()===null&&!this.hasChildren();};/**
     * Calls action for each child of this tree node.
     *
     * @param {function(!Tree.<T>)} action Action to be called for each child.
     */Tree.prototype.forEachChild=function(action){var _this=this;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["r" /* forEach */])(this.node_.children,function(child,childTree){action(new Tree(child,_this,childTree));});};/**
     * Does a depth-first traversal of this node's descendants, calling action for each one.
     *
     * @param {function(!Tree.<T>)} action Action to be called for each child.
     * @param {boolean=} includeSelf Whether to call action on this node as well. Defaults to
     *   false.
     * @param {boolean=} childrenFirst Whether to call action on children before calling it on
     *   parent.
     */Tree.prototype.forEachDescendant=function(action,includeSelf,childrenFirst){if(includeSelf&&!childrenFirst)action(this);this.forEachChild(function(child){child.forEachDescendant(action,/*includeSelf=*/true,childrenFirst);});if(includeSelf&&childrenFirst)action(this);};/**
     * Calls action on each ancestor node.
     *
     * @param {function(!Tree.<T>)} action Action to be called on each parent; return
     *   true to abort.
     * @param {boolean=} includeSelf Whether to call action on this node as well.
     * @return {boolean} true if the action callback returned true.
     */Tree.prototype.forEachAncestor=function(action,includeSelf){var node=includeSelf?this:this.parent();while(node!==null){if(action(node)){return true;}node=node.parent();}return false;};/**
     * Does a depth-first traversal of this node's descendants.  When a descendant with a value
     * is found, action is called on it and traversal does not continue inside the node.
     * Action is *not* called on this node.
     *
     * @param {function(!Tree.<T>)} action Action to be called for each child.
     */Tree.prototype.forEachImmediateDescendantWithValue=function(action){this.forEachChild(function(child){if(child.getValue()!==null)action(child);else child.forEachImmediateDescendantWithValue(action);});};/**
     * @return {!Path} The path of this tree node, as a Path.
     */Tree.prototype.path=function(){return new Path(this.parent_===null?this.name_:this.parent_.path()+'/'+this.name_);};/**
     * @return {string} The name of the tree node.
     */Tree.prototype.name=function(){return this.name_;};/**
     * @return {?Tree} The parent tree node, or null if this is the root of the tree.
     */Tree.prototype.parent=function(){return this.parent_;};/**
     * Adds or removes this child from its parent based on whether it's empty or not.
     *
     * @private
     */Tree.prototype.updateParents_=function(){if(this.parent_!==null)this.parent_.updateChild_(this.name_,this);};/**
     * Adds or removes the passed child to this tree node, depending on whether it's empty.
     *
     * @param {string} childName The name of the child to update.
     * @param {!Tree.<T>} child The child to update.
     * @private
     */Tree.prototype.updateChild_=function(childName,child){var childEmpty=child.isEmpty();var childExists=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(this.node_.children,childName);if(childEmpty&&childExists){delete this.node_.children[childName];this.node_.childCount--;this.updateParents_();}else if(!childEmpty&&!childExists){this.node_.children[childName]=child.node_;this.node_.childCount++;this.updateParents_();}};return Tree;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// TODO: This is pretty messy.  Ideally, a lot of this would move into FirebaseData, or a transaction-specific
// component used by FirebaseData, but it has ties to user callbacks (transaction update and onComplete) as well
// as the realtime connection (to send transactions to the server).  So that all needs to be decoupled first.
// For now it's part of Repo, but in its own file.
/**
 * @enum {number}
 */var TransactionStatus;(function(TransactionStatus){// We've run the transaction and updated transactionResultData_ with the result, but it isn't currently sent to the
// server. A transaction will go from RUN -> SENT -> RUN if it comes back from the server as rejected due to
// mismatched hash.
TransactionStatus[TransactionStatus["RUN"]=0]="RUN";// We've run the transaction and sent it to the server and it's currently outstanding (hasn't come back as accepted
// or rejected yet).
TransactionStatus[TransactionStatus["SENT"]=1]="SENT";// Temporary state used to mark completed transactions (whether successful or aborted).  The transaction will be
// removed when we get a chance to prune completed ones.
TransactionStatus[TransactionStatus["COMPLETED"]=2]="COMPLETED";// Used when an already-sent transaction needs to be aborted (e.g. due to a conflicting set() call that was made).
// If it comes back as unsuccessful, we'll abort it.
TransactionStatus[TransactionStatus["SENT_NEEDS_ABORT"]=3]="SENT_NEEDS_ABORT";// Temporary state used to mark transactions that need to be aborted.
TransactionStatus[TransactionStatus["NEEDS_ABORT"]=4]="NEEDS_ABORT";})(TransactionStatus||(TransactionStatus={}));/**
 * If a transaction does not succeed after 25 retries, we abort it.  Among other things this ensure that if there's
 * ever a bug causing a mismatch between client / server hashes for some data, we won't retry indefinitely.
 * @type {number}
 * @const
 * @private
 */Repo.MAX_TRANSACTION_RETRIES_=25;/**
 * Setup the transaction data structures
 * @private
 */Repo.prototype.transactions_init_=function(){/**
     * Stores queues of outstanding transactions for Firebase locations.
     *
     * @type {!Tree.<Array.<!Transaction>>}
     * @private
     */this.transactionQueueTree_=new Tree();};/**
 * Creates a new transaction, adds it to the transactions we're tracking, and sends it to the server if possible.
 *
 * @param {!Path} path Path at which to do transaction.
 * @param {function(*):*} transactionUpdate Update callback.
 * @param {?function(?Error, boolean, ?DataSnapshot)} onComplete Completion callback.
 * @param {boolean} applyLocally Whether or not to make intermediate results visible
 */Repo.prototype.startTransaction=function(path,transactionUpdate,onComplete,applyLocally){this.log_('transaction on '+path);// Add a watch to make sure we get server updates.
var valueCallback=function valueCallback(){};var watchRef=new Reference(this,path);watchRef.on('value',valueCallback);var unwatcher=function unwatcher(){watchRef.off('value',valueCallback);};// Initialize transaction.
var transaction={path:path,update:transactionUpdate,onComplete:onComplete,// One of TransactionStatus enums.
status:null,// Used when combining transactions at different locations to figure out which one goes first.
order:LUIDGenerator(),// Whether to raise local events for this transaction.
applyLocally:applyLocally,// Count of how many times we've retried the transaction.
retryCount:0,// Function to call to clean up our .on() listener.
unwatcher:unwatcher,// Stores why a transaction was aborted.
abortReason:null,currentWriteId:null,currentInputSnapshot:null,currentOutputSnapshotRaw:null,currentOutputSnapshotResolved:null};// Run transaction initially.
var currentState=this.getLatestState_(path);transaction.currentInputSnapshot=currentState;var newVal=transaction.update(currentState.val());if(newVal===undefined){// Abort transaction.
transaction.unwatcher();transaction.currentOutputSnapshotRaw=null;transaction.currentOutputSnapshotResolved=null;if(transaction.onComplete){// We just set the input snapshot, so this cast should be safe
var snapshot=new DataSnapshot(transaction.currentInputSnapshot,new Reference(this,transaction.path),PRIORITY_INDEX);transaction.onComplete(null,false,snapshot);}}else{validateFirebaseData('transaction failed: Data returned ',newVal,transaction.path);// Mark as run and add to our queue.
transaction.status=TransactionStatus.RUN;var queueNode=this.transactionQueueTree_.subTree(path);var nodeQueue=queueNode.getValue()||[];nodeQueue.push(transaction);queueNode.setValue(nodeQueue);// Update visibleData and raise events
// Note: We intentionally raise events after updating all of our transaction state, since the user could
// start new transactions from the event callbacks.
var priorityForNode=void 0;if(typeof newVal==='object'&&newVal!==null&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(newVal,'.priority')){priorityForNode=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(newVal,'.priority');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(isValidPriority(priorityForNode),'Invalid priority returned by transaction. '+'Priority must be a valid string, finite number, server value, or null.');}else{var currentNode=this.serverSyncTree_.calcCompleteEventCache(path)||ChildrenNode.EMPTY_NODE;priorityForNode=currentNode.getPriority().val();}priorityForNode/** @type {null|number|string} */=priorityForNode;var serverValues=this.generateServerValues();var newNodeUnresolved=nodeFromJSON$1(newVal,priorityForNode);var newNode=resolveDeferredValueSnapshot(newNodeUnresolved,serverValues);transaction.currentOutputSnapshotRaw=newNodeUnresolved;transaction.currentOutputSnapshotResolved=newNode;transaction.currentWriteId=this.getNextWriteId_();var events=this.serverSyncTree_.applyUserOverwrite(path,newNode,transaction.currentWriteId,transaction.applyLocally);this.eventQueue_.raiseEventsForChangedPath(path,events);this.sendReadyTransactions_();}};/**
 * @param {!Path} path
 * @param {Array.<number>=} excludeSets A specific set to exclude
 * @return {Node}
 * @private
 */Repo.prototype.getLatestState_=function(path,excludeSets){return this.serverSyncTree_.calcCompleteEventCache(path,excludeSets)||ChildrenNode.EMPTY_NODE;};/**
 * Sends any already-run transactions that aren't waiting for outstanding transactions to
 * complete.
 *
 * Externally it's called with no arguments, but it calls itself recursively with a particular
 * transactionQueueTree node to recurse through the tree.
 *
 * @param {Tree.<Array.<Transaction>>=} node  transactionQueueTree node to start at.
 * @private
 */Repo.prototype.sendReadyTransactions_=function(node){var _this=this;if(node===void 0){node=this.transactionQueueTree_;}// Before recursing, make sure any completed transactions are removed.
if(!node){this.pruneCompletedTransactionsBelowNode_(node);}if(node.getValue()!==null){var queue=this.buildTransactionQueue_(node);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(queue.length>0,'Sending zero length transaction queue');var allRun=queue.every(function(transaction){return transaction.status===TransactionStatus.RUN;});// If they're all run (and not sent), we can send them.  Else, we must wait.
if(allRun){this.sendTransactionQueue_(node.path(),queue);}}else if(node.hasChildren()){node.forEachChild(function(childNode){_this.sendReadyTransactions_(childNode);});}};/**
 * Given a list of run transactions, send them to the server and then handle the result (success or failure).
 *
 * @param {!Path} path The location of the queue.
 * @param {!Array.<Transaction>} queue Queue of transactions under the specified location.
 * @private
 */Repo.prototype.sendTransactionQueue_=function(path,queue){var _this=this;// Mark transactions as sent and increment retry count!
var setsToIgnore=queue.map(function(txn){return txn.currentWriteId;});var latestState=this.getLatestState_(path,setsToIgnore);var snapToSend=latestState;var latestHash=latestState.hash();for(var i=0;i<queue.length;i++){var txn=queue[i];Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(txn.status===TransactionStatus.RUN,'tryToSendTransactionQueue_: items in queue should all be run.');txn.status=TransactionStatus.SENT;txn.retryCount++;var relativePath=Path.relativePath(path,txn.path);// If we've gotten to this point, the output snapshot must be defined.
snapToSend=snapToSend.updateChild(relativePath/**@type {!Node} */,txn.currentOutputSnapshotRaw);}var dataToSend=snapToSend.val(true);var pathToSend=path;// Send the put.
this.server_.put(pathToSend.toString(),dataToSend,function(status){_this.log_('transaction put response',{path:pathToSend.toString(),status:status});var events=[];if(status==='ok'){// Queue up the callbacks and fire them after cleaning up all of our transaction state, since
// the callback could trigger more transactions or sets.
var callbacks=[];for(var i=0;i<queue.length;i++){queue[i].status=TransactionStatus.COMPLETED;events=events.concat(_this.serverSyncTree_.ackUserWrite(queue[i].currentWriteId));if(queue[i].onComplete){// We never unset the output snapshot, and given that this transaction is complete, it should be set
var node=queue[i].currentOutputSnapshotResolved;var ref=new Reference(_this,queue[i].path);var snapshot=new DataSnapshot(node,ref,PRIORITY_INDEX);callbacks.push(queue[i].onComplete.bind(null,null,true,snapshot));}queue[i].unwatcher();}// Now remove the completed transactions.
_this.pruneCompletedTransactionsBelowNode_(_this.transactionQueueTree_.subTree(path));// There may be pending transactions that we can now send.
_this.sendReadyTransactions_();_this.eventQueue_.raiseEventsForChangedPath(path,events);// Finally, trigger onComplete callbacks.
for(var i=0;i<callbacks.length;i++){exceptionGuard(callbacks[i]);}}else{// transactions are no longer sent.  Update their status appropriately.
if(status==='datastale'){for(var i=0;i<queue.length;i++){if(queue[i].status===TransactionStatus.SENT_NEEDS_ABORT)queue[i].status=TransactionStatus.NEEDS_ABORT;else queue[i].status=TransactionStatus.RUN;}}else{warn('transaction at '+pathToSend.toString()+' failed: '+status);for(var i=0;i<queue.length;i++){queue[i].status=TransactionStatus.NEEDS_ABORT;queue[i].abortReason=status;}}_this.rerunTransactions_(path);}},latestHash);};/**
 * Finds all transactions dependent on the data at changedPath and reruns them.
 *
 * Should be called any time cached data changes.
 *
 * Return the highest path that was affected by rerunning transactions.  This is the path at which events need to
 * be raised for.
 *
 * @param {!Path} changedPath The path in mergedData that changed.
 * @return {!Path} The rootmost path that was affected by rerunning transactions.
 * @private
 */Repo.prototype.rerunTransactions_=function(changedPath){var rootMostTransactionNode=this.getAncestorTransactionNode_(changedPath);var path=rootMostTransactionNode.path();var queue=this.buildTransactionQueue_(rootMostTransactionNode);this.rerunTransactionQueue_(queue,path);return path;};/**
 * Does all the work of rerunning transactions (as well as cleans up aborted transactions and whatnot).
 *
 * @param {Array.<Transaction>} queue The queue of transactions to run.
 * @param {!Path} path The path the queue is for.
 * @private
 */Repo.prototype.rerunTransactionQueue_=function(queue,path){if(queue.length===0){return;// Nothing to do!
}// Queue up the callbacks and fire them after cleaning up all of our transaction state, since
// the callback could trigger more transactions or sets.
var callbacks=[];var events=[];// Ignore all of the sets we're going to re-run.
var txnsToRerun=queue.filter(function(q){return q.status===TransactionStatus.RUN;});var setsToIgnore=txnsToRerun.map(function(q){return q.currentWriteId;});for(var i=0;i<queue.length;i++){var transaction=queue[i];var relativePath=Path.relativePath(path,transaction.path);var abortTransaction=false,abortReason=void 0;Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(relativePath!==null,'rerunTransactionsUnderNode_: relativePath should not be null.');if(transaction.status===TransactionStatus.NEEDS_ABORT){abortTransaction=true;abortReason=transaction.abortReason;events=events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId,true));}else if(transaction.status===TransactionStatus.RUN){if(transaction.retryCount>=Repo.MAX_TRANSACTION_RETRIES_){abortTransaction=true;abortReason='maxretry';events=events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId,true));}else{// This code reruns a transaction
var currentNode=this.getLatestState_(transaction.path,setsToIgnore);transaction.currentInputSnapshot=currentNode;var newData=queue[i].update(currentNode.val());if(newData!==undefined){validateFirebaseData('transaction failed: Data returned ',newData,transaction.path);var newDataNode=nodeFromJSON$1(newData);var hasExplicitPriority=typeof newData==='object'&&newData!=null&&Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["j" /* contains */])(newData,'.priority');if(!hasExplicitPriority){// Keep the old priority if there wasn't a priority explicitly specified.
newDataNode=newDataNode.updatePriority(currentNode.getPriority());}var oldWriteId=transaction.currentWriteId;var serverValues=this.generateServerValues();var newNodeResolved=resolveDeferredValueSnapshot(newDataNode,serverValues);transaction.currentOutputSnapshotRaw=newDataNode;transaction.currentOutputSnapshotResolved=newNodeResolved;transaction.currentWriteId=this.getNextWriteId_();// Mutates setsToIgnore in place
setsToIgnore.splice(setsToIgnore.indexOf(oldWriteId),1);events=events.concat(this.serverSyncTree_.applyUserOverwrite(transaction.path,newNodeResolved,transaction.currentWriteId,transaction.applyLocally));events=events.concat(this.serverSyncTree_.ackUserWrite(oldWriteId,true));}else{abortTransaction=true;abortReason='nodata';events=events.concat(this.serverSyncTree_.ackUserWrite(transaction.currentWriteId,true));}}}this.eventQueue_.raiseEventsForChangedPath(path,events);events=[];if(abortTransaction){// Abort.
queue[i].status=TransactionStatus.COMPLETED;// Removing a listener can trigger pruning which can muck with mergedData/visibleData (as it prunes data).
// So defer the unwatcher until we're done.
(function(unwatcher){setTimeout(unwatcher,Math.floor(0));})(queue[i].unwatcher);if(queue[i].onComplete){if(abortReason==='nodata'){var ref=new Reference(this,queue[i].path);// We set this field immediately, so it's safe to cast to an actual snapshot
var lastInput/** @type {!Node} */=queue[i].currentInputSnapshot;var snapshot=new DataSnapshot(lastInput,ref,PRIORITY_INDEX);callbacks.push(queue[i].onComplete.bind(null,null,false,snapshot));}else{callbacks.push(queue[i].onComplete.bind(null,new Error(abortReason),false,null));}}}}// Clean up completed transactions.
this.pruneCompletedTransactionsBelowNode_(this.transactionQueueTree_);// Now fire callbacks, now that we're in a good, known state.
for(var i=0;i<callbacks.length;i++){exceptionGuard(callbacks[i]);}// Try to send the transaction result to the server.
this.sendReadyTransactions_();};/**
 * Returns the rootmost ancestor node of the specified path that has a pending transaction on it, or just returns
 * the node for the given path if there are no pending transactions on any ancestor.
 *
 * @param {!Path} path The location to start at.
 * @return {!Tree.<Array.<!Transaction>>} The rootmost node with a transaction.
 * @private
 */Repo.prototype.getAncestorTransactionNode_=function(path){var front;// Start at the root and walk deeper into the tree towards path until we find a node with pending transactions.
var transactionNode=this.transactionQueueTree_;while((front=path.getFront())!==null&&transactionNode.getValue()===null){transactionNode=transactionNode.subTree(front);path=path.popFront();}return transactionNode;};/**
 * Builds the queue of all transactions at or below the specified transactionNode.
 *
 * @param {!Tree.<Array.<Transaction>>} transactionNode
 * @return {Array.<Transaction>} The generated queue.
 * @private
 */Repo.prototype.buildTransactionQueue_=function(transactionNode){// Walk any child transaction queues and aggregate them into a single queue.
var transactionQueue=[];this.aggregateTransactionQueuesForNode_(transactionNode,transactionQueue);// Sort them by the order the transactions were created.
transactionQueue.sort(function(a,b){return a.order-b.order;});return transactionQueue;};/**
 * @param {!Tree.<Array.<Transaction>>} node
 * @param {Array.<Transaction>} queue
 * @private
 */Repo.prototype.aggregateTransactionQueuesForNode_=function(node,queue){var _this=this;var nodeQueue=node.getValue();if(nodeQueue!==null){for(var i=0;i<nodeQueue.length;i++){queue.push(nodeQueue[i]);}}node.forEachChild(function(child){_this.aggregateTransactionQueuesForNode_(child,queue);});};/**
 * Remove COMPLETED transactions at or below this node in the transactionQueueTree_.
 *
 * @param {!Tree.<Array.<!Transaction>>} node
 * @private
 */Repo.prototype.pruneCompletedTransactionsBelowNode_=function(node){var _this=this;var queue=node.getValue();if(queue){var to=0;for(var from=0;from<queue.length;from++){if(queue[from].status!==TransactionStatus.COMPLETED){queue[to]=queue[from];to++;}}queue.length=to;node.setValue(queue.length>0?queue:null);}node.forEachChild(function(childNode){_this.pruneCompletedTransactionsBelowNode_(childNode);});};/**
 * Aborts all transactions on ancestors or descendants of the specified path.  Called when doing a set() or update()
 * since we consider them incompatible with transactions.
 *
 * @param {!Path} path Path for which we want to abort related transactions.
 * @return {!Path}
 * @private
 */Repo.prototype.abortTransactions_=function(path){var _this=this;var affectedPath=this.getAncestorTransactionNode_(path).path();var transactionNode=this.transactionQueueTree_.subTree(path);transactionNode.forEachAncestor(function(node){_this.abortTransactionsOnNode_(node);});this.abortTransactionsOnNode_(transactionNode);transactionNode.forEachDescendant(function(node){_this.abortTransactionsOnNode_(node);});return affectedPath;};/**
 * Abort transactions stored in this transaction queue node.
 *
 * @param {!Tree.<Array.<Transaction>>} node Node to abort transactions for.
 * @private
 */Repo.prototype.abortTransactionsOnNode_=function(node){var queue=node.getValue();if(queue!==null){// Queue up the callbacks and fire them after cleaning up all of our transaction state, since
// the callback could trigger more transactions or sets.
var callbacks=[];// Go through queue.  Any already-sent transactions must be marked for abort, while the unsent ones
// can be immediately aborted and removed.
var events=[];var lastSent=-1;for(var i=0;i<queue.length;i++){if(queue[i].status===TransactionStatus.SENT_NEEDS_ABORT){// Already marked.  No action needed.
}else if(queue[i].status===TransactionStatus.SENT){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(lastSent===i-1,'All SENT items should be at beginning of queue.');lastSent=i;// Mark transaction for abort when it comes back.
queue[i].status=TransactionStatus.SENT_NEEDS_ABORT;queue[i].abortReason='set';}else{Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["e" /* assert */])(queue[i].status===TransactionStatus.RUN,'Unexpected transaction status in abort');// We can abort it immediately.
queue[i].unwatcher();events=events.concat(this.serverSyncTree_.ackUserWrite(queue[i].currentWriteId,true));if(queue[i].onComplete){var snapshot=null;callbacks.push(queue[i].onComplete.bind(null,new Error('set'),false,snapshot));}}}if(lastSent===-1){// We're not waiting for any sent transactions.  We can clear the queue.
node.setValue(null);}else{// Remove the transactions we aborted.
queue.length=lastSent+1;}// Now fire the callbacks.
this.eventQueue_.raiseEventsForChangedPath(node.path(),events);for(var i=0;i<callbacks.length;i++){exceptionGuard(callbacks[i]);}}};/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//** @const {string} */var DATABASE_URL_OPTION='databaseURL';var _staticInstance;/**
 * Creates and caches Repo instances.
 */var RepoManager=/** @class */function(){function RepoManager(){/**
         * @private {!Object.<string, Object<string, !fb.core.Repo>>}
         */this.repos_={};/**
         * If true, new Repos will be created to use ReadonlyRestClient (for testing purposes).
         * @private {boolean}
         */this.useRestClient_=false;}RepoManager.getInstance=function(){if(!_staticInstance){_staticInstance=new RepoManager();}return _staticInstance;};// TODO(koss): Remove these functions unless used in tests?
RepoManager.prototype.interrupt=function(){for(var appName in this.repos_){for(var dbUrl in this.repos_[appName]){this.repos_[appName][dbUrl].interrupt();}}};RepoManager.prototype.resume=function(){for(var appName in this.repos_){for(var dbUrl in this.repos_[appName]){this.repos_[appName][dbUrl].resume();}}};/**
     * This function should only ever be called to CREATE a new database instance.
     *
     * @param {!FirebaseApp} app
     * @return {!Database}
     */RepoManager.prototype.databaseFromApp=function(app,url){var dbUrl=url||app.options[DATABASE_URL_OPTION];if(dbUrl===undefined){fatal("Can't determine Firebase Database URL.  Be sure to include "+DATABASE_URL_OPTION+' option when calling firebase.initializeApp().');}var parsedUrl=parseRepoInfo(dbUrl);var repoInfo=parsedUrl.repoInfo;validateUrl('Invalid Firebase Database URL',1,parsedUrl);if(!parsedUrl.path.isEmpty()){fatal('Database URL must point to the root of a Firebase Database '+'(not including a child path).');}var repo=this.createRepo(repoInfo,app);return repo.database;};/**
     * Remove the repo and make sure it is disconnected.
     *
     * @param {!Repo} repo
     */RepoManager.prototype.deleteRepo=function(repo){var appRepos=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.repos_,repo.app.name);// This should never happen...
if(!appRepos||Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(appRepos,repo.repoInfo_.toURLString())!==repo){fatal("Database "+repo.app.name+"("+repo.repoInfo_+") has already been deleted.");}repo.interrupt();delete appRepos[repo.repoInfo_.toURLString()];};/**
     * Ensures a repo doesn't already exist and then creates one using the
     * provided app.
     *
     * @param {!RepoInfo} repoInfo The metadata about the Repo
     * @param {!FirebaseApp} app
     * @return {!Repo} The Repo object for the specified server / repoName.
     */RepoManager.prototype.createRepo=function(repoInfo,app){var appRepos=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(this.repos_,app.name);if(!appRepos){appRepos={};this.repos_[app.name]=appRepos;}var repo=Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["F" /* safeGet */])(appRepos,repoInfo.toURLString());if(repo){fatal('Database initialized multiple times. Please make sure the format of the database URL matches with each database() call.');}repo=new Repo(repoInfo,this.useRestClient_,app);appRepos[repoInfo.toURLString()]=repo;return repo;};/**
     * Forces us to use ReadonlyRestClient instead of PersistentConnection for new Repos.
     * @param {boolean} forceRestClient
     */RepoManager.prototype.forceRestClient=function(forceRestClient){this.useRestClient_=forceRestClient;};return RepoManager;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * Class representing a firebase database.
 * @implements {FirebaseService}
 */var Database=/** @class */function(){/**
     * The constructor should not be called by users of our public API.
     * @param {!Repo} repo_
     */function Database(repo_){this.repo_=repo_;if(!(repo_ instanceof Repo)){fatal("Don't call new Database() directly - please use firebase.database().");}/** @type {Reference} */this.root_=new Reference(repo_,Path.Empty);this.INTERNAL=new DatabaseInternals(this);}Object.defineProperty(Database.prototype,"app",{get:function get(){return this.repo_.app;},enumerable:true,configurable:true});Database.prototype.ref=function(path){this.checkDeleted_('ref');Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('database.ref',0,1,arguments.length);if(path instanceof Reference){return this.refFromURL(path.toString());}return path!==undefined?this.root_.child(path):this.root_;};/**
     * Returns a reference to the root or the path specified in url.
     * We throw a exception if the url is not in the same domain as the
     * current repo.
     * @param {string} url
     * @return {!Reference} Firebase reference.
     */Database.prototype.refFromURL=function(url){/** @const {string} */var apiName='database.refFromURL';this.checkDeleted_(apiName);Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])(apiName,1,1,arguments.length);var parsedURL=parseRepoInfo(url);validateUrl(apiName,1,parsedURL);var repoInfo=parsedURL.repoInfo;if(repoInfo.host!==this.repo_.repoInfo_.host){fatal(apiName+': Host name does not match the current database: '+'(found '+repoInfo.host+' but expected '+this.repo_.repoInfo_.host+')');}return this.ref(parsedURL.path.toString());};/**
     * @param {string} apiName
     */Database.prototype.checkDeleted_=function(apiName){if(this.repo_===null){fatal('Cannot call '+apiName+' on a deleted database.');}};// Make individual repo go offline.
Database.prototype.goOffline=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('database.goOffline',0,0,arguments.length);this.checkDeleted_('goOffline');this.repo_.interrupt();};Database.prototype.goOnline=function(){Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["J" /* validateArgCount */])('database.goOnline',0,0,arguments.length);this.checkDeleted_('goOnline');this.repo_.resume();};Database.ServerValue={TIMESTAMP:{'.sv':'timestamp'}};return Database;}();var DatabaseInternals=/** @class */function(){/** @param {!Database} database */function DatabaseInternals(database){this.database=database;}/** @return {Promise<void>} */DatabaseInternals.prototype.delete=function(){return Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["a" /* __awaiter */])(this,void 0,void 0,function(){return Object(__WEBPACK_IMPORTED_MODULE_2_tslib__["c" /* __generator */])(this,function(_a){this.database.checkDeleted_('delete');RepoManager.getInstance().deleteRepo(this.database.repo_);this.database.repo_=null;this.database.root_=null;this.database.INTERNAL=null;this.database=null;return[2/*return*/];});});};return DatabaseInternals;}();/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * INTERNAL methods for internal-use only (tests, etc.).
 *
 * Customers shouldn't use these or else should be aware that they could break at any time.
 *
 * @const
 */var forceLongPolling=function forceLongPolling(){WebSocketConnection.forceDisallow();BrowserPollConnection.forceAllow();};var forceWebSockets=function forceWebSockets(){BrowserPollConnection.forceDisallow();};/* Used by App Manager */var isWebSocketsAvailable=function isWebSocketsAvailable(){return WebSocketConnection['isAvailable']();};var setSecurityDebugCallback=function setSecurityDebugCallback(ref,callback){ref.repo.persistentConnection_.securityDebugCallback_=callback;};var stats=function stats(ref,showDelta){ref.repo.stats(showDelta);};var statsIncrementCounter=function statsIncrementCounter(ref,metric){ref.repo.statsIncrementCounter(metric);};var dataUpdateCount=function dataUpdateCount(ref){return ref.repo.dataUpdateCount;};var interceptServerData=function interceptServerData(ref,callback){return ref.repo.interceptServerData_(callback);};var INTERNAL=/*#__PURE__*/Object.freeze({forceLongPolling:forceLongPolling,forceWebSockets:forceWebSockets,isWebSocketsAvailable:isWebSocketsAvailable,setSecurityDebugCallback:setSecurityDebugCallback,stats:stats,statsIncrementCounter:statsIncrementCounter,dataUpdateCount:dataUpdateCount,interceptServerData:interceptServerData});/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var DataConnection=PersistentConnection;/**
 * @param {!string} pathString
 * @param {function(*)} onComplete
 */PersistentConnection.prototype.simpleListen=function(pathString,onComplete){this.sendRequest('q',{p:pathString},onComplete);};/**
 * @param {*} data
 * @param {function(*)} onEcho
 */PersistentConnection.prototype.echo=function(data,onEcho){this.sendRequest('echo',{d:data},onEcho);};// RealTimeConnection properties that we use in tests.
var RealTimeConnection=Connection;/**
 * @param {function(): string} newHash
 * @return {function()}
 */var hijackHash=function hijackHash(newHash){var oldPut=PersistentConnection.prototype.put;PersistentConnection.prototype.put=function(pathString,data,opt_onComplete,opt_hash){if(opt_hash!==undefined){opt_hash=newHash();}oldPut.call(this,pathString,data,opt_onComplete,opt_hash);};return function(){PersistentConnection.prototype.put=oldPut;};};/**
 * @type {function(new:RepoInfo, !string, boolean, !string, boolean): undefined}
 */var ConnectionTarget=RepoInfo;/**
 * @param {!Query} query
 * @return {!string}
 */var queryIdentifier=function queryIdentifier(query){return query.queryIdentifier();};/**
 * @param {!Query} firebaseRef
 * @return {!Object}
 */var listens=function listens(firebaseRef){return firebaseRef.repo.persistentConnection_.listens_;};/**
 * Forces the RepoManager to create Repos that use ReadonlyRestClient instead of PersistentConnection.
 *
 * @param {boolean} forceRestClient
 */var forceRestClient=function forceRestClient(_forceRestClient){RepoManager.getInstance().forceRestClient(_forceRestClient);};var TEST_ACCESS=/*#__PURE__*/Object.freeze({DataConnection:DataConnection,RealTimeConnection:RealTimeConnection,hijackHash:hijackHash,ConnectionTarget:ConnectionTarget,queryIdentifier:queryIdentifier,listens:listens,forceRestClient:forceRestClient});/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ServerValue=Database.ServerValue;function registerDatabase(instance){// Register the Database Service with the 'firebase' namespace.
var namespace=instance.INTERNAL.registerService('database',function(app,unused,url){return RepoManager.getInstance().databaseFromApp(app,url);},// firebase.database namespace properties
{Reference:Reference,Query:Query,Database:Database,enableLogging:enableLogging,INTERNAL:INTERNAL,ServerValue:ServerValue,TEST_ACCESS:TEST_ACCESS},null,true);if(Object(__WEBPACK_IMPORTED_MODULE_0__firebase_util__["y" /* isNodeSdk */])()){module.exports=namespace;}}registerDatabase(__WEBPACK_IMPORTED_MODULE_3__firebase_app__["default"]);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("f1Eh")(module)))

/***/ }),

/***/ "a90S":
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "f1Eh":
/***/ (function(module, exports) {

module.exports = function (originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function get() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function get() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};

/***/ }),

/***/ "fjI4":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export setLogLevel */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Logger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogLevel; });
/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A container for all of the Logger instances
 */
var instances = [];
/**
 * The JS SDK supports 5 log levels and also allows a user the ability to
 * silence the logs altogether.
 *
 * The order is a follows:
 * DEBUG < VERBOSE < INFO < WARN < ERROR
 *
 * All of the log types above the current log level will be captured (i.e. if
 * you set the log level to `INFO`, errors will still be logged, but `DEBUG` and
 * `VERBOSE` logs will not)
 */
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["VERBOSE"] = 1] = "VERBOSE";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 5] = "SILENT";
})(LogLevel || (LogLevel = {}));
/**
 * The default log level
 */
var defaultLogLevel = LogLevel.INFO;
/**
 * The default log handler will forward DEBUG, VERBOSE, INFO, WARN, and ERROR
 * messages on to their corresponding console counterparts (if the log method
 * is supported by the current log level)
 */
var defaultLogHandler = function defaultLogHandler(instance, logType) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (logType < instance.logLevel) return;
    var now = new Date().toISOString();
    switch (logType) {
        /**
         * By default, `console.debug` is not displayed in the developer console (in
         * chrome). To avoid forcing users to have to opt-in to these logs twice
         * (i.e. once for firebase, and once in the console), we are sending `DEBUG`
         * logs to the `console.log` function.
         */
        case LogLevel.DEBUG:
            console.log.apply(console, ["[" + now + "]  " + instance.name + ":"].concat(args));
            break;
        case LogLevel.VERBOSE:
            console.log.apply(console, ["[" + now + "]  " + instance.name + ":"].concat(args));
            break;
        case LogLevel.INFO:
            console.info.apply(console, ["[" + now + "]  " + instance.name + ":"].concat(args));
            break;
        case LogLevel.WARN:
            console.warn.apply(console, ["[" + now + "]  " + instance.name + ":"].concat(args));
            break;
        case LogLevel.ERROR:
            console.error.apply(console, ["[" + now + "]  " + instance.name + ":"].concat(args));
            break;
        default:
            throw new Error("Attempted to log a message with an invalid logType (value: " + logType + ")");
    }
};
var Logger = /** @class */function () {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    function Logger(name) {
        this.name = name;
        /**
         * The log level of the given Logger instance.
         */
        this._logLevel = defaultLogLevel;
        /**
         * The log handler for the Logger instance.
         */
        this._logHandler = defaultLogHandler;
        /**
         * Capture the current instance for later use
         */
        instances.push(this);
    }
    Object.defineProperty(Logger.prototype, "logLevel", {
        get: function get() {
            return this._logLevel;
        },
        set: function set(val) {
            if (!(val in LogLevel)) {
                throw new TypeError('Invalid value assigned to `logLevel`');
            }
            this._logLevel = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "logHandler", {
        get: function get() {
            return this._logHandler;
        },
        set: function set(val) {
            if (typeof val !== 'function') {
                throw new TypeError('Value assigned to `logHandler` must be a function');
            }
            this._logHandler = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The functions below are all based on the `console` interface
     */
    Logger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._logHandler.apply(this, [this, LogLevel.DEBUG].concat(args));
    };
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._logHandler.apply(this, [this, LogLevel.VERBOSE].concat(args));
    };
    Logger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._logHandler.apply(this, [this, LogLevel.INFO].concat(args));
    };
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._logHandler.apply(this, [this, LogLevel.WARN].concat(args));
    };
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._logHandler.apply(this, [this, LogLevel.ERROR].concat(args));
    };
    return Logger;
}();

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function setLogLevel(level) {
    instances.forEach(function (inst) {
        inst.logLevel = level;
    });
}



/***/ }),

/***/ "gBMY":
/***/ (function(module, exports, __webpack_require__) {

// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

// also, there is no persistence
// TODO persist
(function () {
  "use strict";

  var fs = __webpack_require__("vHs2");

  function Storage(path, opts) {
    opts = opts || {};
    var db;

    Object.defineProperty(this, '___priv_bk___', {
      value: {
        path: path
      },
      writable: false,
      enumerable: false
    });

    Object.defineProperty(this, '___priv_strict___', {
      value: !!opts.strict,
      writable: false,
      enumerable: false
    });

    Object.defineProperty(this, '___priv_ws___', {
      value: opts.ws || '  ',
      writable: false,
      enumerable: false
    });

    try {
      db = JSON.parse(fs.readFileSync(path));
    } catch (e) {
      db = {};
    }

    Object.keys(db).forEach(function (key) {
      this[key] = db[key];
    }, this);
  }

  Storage.prototype.getItem = function (key) {
    if (this.hasOwnProperty(key)) {
      if (this.___priv_strict___) {
        return String(this[key]);
      } else {
        return this[key];
      }
    }
    return null;
  };

  Storage.prototype.setItem = function (key, val) {
    if (val === undefined) {
      this[key] = null;
    } else if (this.___priv_strict___) {
      this[key] = String(val);
    } else {
      this[key] = val;
    }
    this.___save___();
  };

  Storage.prototype.removeItem = function (key) {
    delete this[key];
    this.___save___();
  };

  Storage.prototype.clear = function () {
    var self = this;
    // filters out prototype keys
    Object.keys(self).forEach(function (key) {
      self[key] = undefined;
      delete self[key];
    });
  };

  Storage.prototype.key = function (i) {
    i = i || 0;
    return Object.keys(this)[i];
  };

  Object.defineProperty(Storage.prototype, 'length', {
    get: function get() {
      return Object.keys(this).length;
    }
  });

  Storage.prototype.___save___ = function () {
    var self = this;

    if (!this.___priv_bk___.path) {
      return;
    }

    if (this.___priv_bk___.lock) {
      this.___priv_bk___.wait = true;
      return;
    }

    this.___priv_bk___.lock = true;
    fs.writeFile(this.___priv_bk___.path, JSON.stringify(this, null, this.___priv_ws___), 'utf8', function (e) {
      self.___priv_bk___.lock = false;
      if (e) {
        console.error('Could not write to database', self.___priv_bk___.path);
        console.error(e);
        return;
      }
      if (self.___priv_bk___.wait) {
        self.___priv_bk___.wait = false;
        self.___save___();
      }
    });
  };

  Object.defineProperty(Storage, 'create', {
    value: function value(path, opts) {
      return new Storage(path, opts);
    },
    writable: false,
    enumerable: false
  });

  module.exports = Storage;
})();

/***/ }),

/***/ "gHkb":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "l1Vk":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
 *
 * This can be used with JS designed for browsers to improve reuse of code and
 * allow the use of existing libraries.
 *
 * Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
 *
 * @author Dan DeFelippi <dan@driverdan.com>
 * @contributor David Ellis <d.f.ellis@ieee.org>
 * @license MIT
 */

var Url = __webpack_require__("Vy1O");
var spawn = __webpack_require__("a90S").spawn;
var fs = __webpack_require__("vHs2");

exports.XMLHttpRequest = function () {
  "use strict";

  /**
   * Private variables
   */

  var self = this;
  var http = __webpack_require__("gHkb");
  var https = __webpack_require__("XgVs");

  // Holds http.js objects
  var request;
  var response;

  // Request settings
  var settings = {};

  // Disable header blacklist.
  // Not part of XHR specs.
  var disableHeaderCheck = false;

  // Set some default headers
  var defaultHeaders = {
    "User-Agent": "node-XMLHttpRequest",
    "Accept": "*/*"
  };

  var headers = {};
  var headersCase = {};

  // These headers are not user setable.
  // The following are allowed but banned in the spec:
  // * user-agent
  var forbiddenRequestHeaders = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "content-transfer-encoding", "cookie", "cookie2", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via"];

  // These request methods are not allowed
  var forbiddenRequestMethods = ["TRACE", "TRACK", "CONNECT"];

  // Send flag
  var sendFlag = false;
  // Error flag, used when errors occur or abort is called
  var errorFlag = false;

  // Event listeners
  var listeners = {};

  /**
   * Constants
   */

  this.UNSENT = 0;
  this.OPENED = 1;
  this.HEADERS_RECEIVED = 2;
  this.LOADING = 3;
  this.DONE = 4;

  /**
   * Public vars
   */

  // Current state
  this.readyState = this.UNSENT;

  // default ready state change handler in case one is not set or is set late
  this.onreadystatechange = null;

  // Result & response
  this.responseText = "";
  this.responseXML = "";
  this.status = null;
  this.statusText = null;

  // Whether cross-site Access-Control requests should be made using
  // credentials such as cookies or authorization headers
  this.withCredentials = false;

  /**
   * Private methods
   */

  /**
   * Check if the specified header is allowed.
   *
   * @param string header Header to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpHeader = function isAllowedHttpHeader(header) {
    return disableHeaderCheck || header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1;
  };

  /**
   * Check if the specified method is allowed.
   *
   * @param string method Request method to validate
   * @return boolean False if not allowed, otherwise true
   */
  var isAllowedHttpMethod = function isAllowedHttpMethod(method) {
    return method && forbiddenRequestMethods.indexOf(method) === -1;
  };

  /**
   * Public methods
   */

  /**
   * Open the connection. Currently supports local server requests.
   *
   * @param string method Connection method (eg GET, POST)
   * @param string url URL for the connection.
   * @param boolean async Asynchronous connection. Default is true.
   * @param string user Username for basic authentication (optional)
   * @param string password Password for basic authentication (optional)
   */
  this.open = function (method, url, async, user, password) {
    this.abort();
    errorFlag = false;

    // Check for valid request method
    if (!isAllowedHttpMethod(method)) {
      throw new Error("SecurityError: Request method not allowed");
    }

    settings = {
      "method": method,
      "url": url.toString(),
      "async": typeof async !== "boolean" ? true : async,
      "user": user || null,
      "password": password || null
    };

    setState(this.OPENED);
  };

  /**
   * Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
   * This does not conform to the W3C spec.
   *
   * @param boolean state Enable or disable header checking.
   */
  this.setDisableHeaderCheck = function (state) {
    disableHeaderCheck = state;
  };

  /**
   * Sets a header for the request or appends the value if one is already set.
   *
   * @param string header Header name
   * @param string value Header value
   */
  this.setRequestHeader = function (header, value) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
    }
    if (!isAllowedHttpHeader(header)) {
      console.warn("Refused to set unsafe header \"" + header + "\"");
      return;
    }
    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send flag is true");
    }
    header = headersCase[header.toLowerCase()] || header;
    headersCase[header.toLowerCase()] = header;
    headers[header] = headers[header] ? headers[header] + ', ' + value : value;
  };

  /**
   * Gets a header from the server response.
   *
   * @param string header Name of header to get.
   * @return string Text of the header or null if it doesn't exist.
   */
  this.getResponseHeader = function (header) {
    if (typeof header === "string" && this.readyState > this.OPENED && response && response.headers && response.headers[header.toLowerCase()] && !errorFlag) {
      return response.headers[header.toLowerCase()];
    }

    return null;
  };

  /**
   * Gets all the response headers.
   *
   * @return string A string with all response headers separated by CR+LF
   */
  this.getAllResponseHeaders = function () {
    if (this.readyState < this.HEADERS_RECEIVED || errorFlag) {
      return "";
    }
    var result = "";

    for (var i in response.headers) {
      // Cookie headers are excluded
      if (i !== "set-cookie" && i !== "set-cookie2") {
        result += i + ": " + response.headers[i] + "\r\n";
      }
    }
    return result.substr(0, result.length - 2);
  };

  /**
   * Gets a request header
   *
   * @param string name Name of header to get
   * @return string Returns the request header or empty string if not set
   */
  this.getRequestHeader = function (name) {
    if (typeof name === "string" && headersCase[name.toLowerCase()]) {
      return headers[headersCase[name.toLowerCase()]];
    }

    return "";
  };

  /**
   * Sends the request to the server.
   *
   * @param string data Optional data to send as request body.
   */
  this.send = function (data) {
    if (this.readyState !== this.OPENED) {
      throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
    }

    if (sendFlag) {
      throw new Error("INVALID_STATE_ERR: send has already been called");
    }

    var ssl = false,
        local = false;
    var url = Url.parse(settings.url);
    var host;
    // Determine the server
    switch (url.protocol) {
      case "https:":
        ssl = true;
      // SSL & non-SSL both need host, no break here.
      case "http:":
        host = url.hostname;
        break;

      case "file:":
        local = true;
        break;

      case undefined:
      case null:
      case "":
        host = "localhost";
        break;

      default:
        throw new Error("Protocol not supported.");
    }

    // Load files off the local filesystem (file://)
    if (local) {
      if (settings.method !== "GET") {
        throw new Error("XMLHttpRequest: Only GET method is supported");
      }

      if (settings.async) {
        fs.readFile(url.pathname, "utf8", function (error, data) {
          if (error) {
            self.handleError(error);
          } else {
            self.status = 200;
            self.responseText = data;
            setState(self.DONE);
          }
        });
      } else {
        try {
          this.responseText = fs.readFileSync(url.pathname, "utf8");
          this.status = 200;
          setState(self.DONE);
        } catch (e) {
          this.handleError(e);
        }
      }

      return;
    }

    // Default to port 80. If accessing localhost on another port be sure
    // to use http://localhost:port/path
    var port = url.port || (ssl ? 443 : 80);
    // Add query string if one is used
    var uri = url.pathname + (url.search ? url.search : "");

    // Set the defaults if they haven't been set
    for (var name in defaultHeaders) {
      if (!headersCase[name.toLowerCase()]) {
        headers[name] = defaultHeaders[name];
      }
    }

    // Set the Host header or the server may reject the request
    headers.Host = host;
    if (!(ssl && port === 443 || port === 80)) {
      headers.Host += ":" + url.port;
    }

    // Set Basic Auth if necessary
    if (settings.user) {
      if (typeof settings.password === "undefined") {
        settings.password = "";
      }
      var authBuf = new Buffer(settings.user + ":" + settings.password);
      headers.Authorization = "Basic " + authBuf.toString("base64");
    }

    // Set content length header
    if (settings.method === "GET" || settings.method === "HEAD") {
      data = null;
    } else if (data) {
      headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);

      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    } else if (settings.method === "POST") {
      // For a post with no data set Content-Length: 0.
      // This is required by buggy servers that don't meet the specs.
      headers["Content-Length"] = 0;
    }

    var options = {
      host: host,
      port: port,
      path: uri,
      method: settings.method,
      headers: headers,
      agent: false,
      withCredentials: self.withCredentials
    };

    // Reset error flag
    errorFlag = false;

    // Handle async requests
    if (settings.async) {
      // Use the proper protocol
      var doRequest = ssl ? https.request : http.request;

      // Request is being sent, set send flag
      sendFlag = true;

      // As per spec, this is called here for historical reasons.
      self.dispatchEvent("readystatechange");

      // Handler for the response
      var responseHandler = function responseHandler(resp) {
        // Set response var to the response we got back
        // This is so it remains accessable outside this scope
        response = resp;
        // Check for redirect
        // @TODO Prevent looped redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
          // Change URL to the redirect location
          settings.url = response.headers.location;
          var url = Url.parse(settings.url);
          // Set host var in case it's used later
          host = url.hostname;
          // Options for the new request
          var newOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: response.statusCode === 303 ? "GET" : settings.method,
            headers: headers,
            withCredentials: self.withCredentials
          };

          // Issue the new request
          request = doRequest(newOptions, responseHandler).on("error", errorHandler);
          request.end();
          // @TODO Check if an XHR event needs to be fired here
          return;
        }

        response.setEncoding("utf8");

        setState(self.HEADERS_RECEIVED);
        self.status = response.statusCode;

        response.on("data", function (chunk) {
          // Make sure there's some data
          if (chunk) {
            self.responseText += chunk;
          }
          // Don't emit state changes if the connection has been aborted.
          if (sendFlag) {
            setState(self.LOADING);
          }
        });

        response.on("end", function () {
          if (sendFlag) {
            // Discard the end event if the connection has been aborted
            setState(self.DONE);
            sendFlag = false;
          }
        });

        response.on("error", function (error) {
          self.handleError(error);
        });
      };

      // Error handler for the request
      var errorHandler = function errorHandler(error) {
        self.handleError(error);
      };

      // Create the request
      request = doRequest(options, responseHandler).on("error", errorHandler);

      // Node 0.4 and later won't accept empty data. Make sure it's needed.
      if (data) {
        request.write(data);
      }

      request.end();

      self.dispatchEvent("loadstart");
    } else {
      // Synchronous
      // Create a temporary file for communication with the other Node process
      var contentFile = ".node-xmlhttprequest-content-" + process.pid;
      var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
      fs.writeFileSync(syncFile, "", "utf8");
      // The async request the other Node process executes
      var execString = "var http = require('http'), https = require('https'), fs = require('fs');" + "var doRequest = http" + (ssl ? "s" : "") + ".request;" + "var options = " + JSON.stringify(options) + ";" + "var responseText = '';" + "var req = doRequest(options, function(response) {" + "response.setEncoding('utf8');" + "response.on('data', function(chunk) {" + "  responseText += chunk;" + "});" + "response.on('end', function() {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText}}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "response.on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + "}).on('error', function(error) {" + "fs.writeFileSync('" + contentFile + "', JSON.stringify({err: error}), 'utf8');" + "fs.unlinkSync('" + syncFile + "');" + "});" + (data ? "req.write('" + JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();";
      // Start the other Node Process, executing this string
      var syncProc = spawn(process.argv[0], ["-e", execString]);
      while (fs.existsSync(syncFile)) {
        // Wait while the sync file is empty
      }
      var resp = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
      // Kill the child process once the file has data
      syncProc.stdin.end();
      // Remove the temporary file
      fs.unlinkSync(contentFile);

      if (resp.err) {
        self.handleError(resp.err);
      } else {
        response = resp.data;
        self.status = resp.data.statusCode;
        self.responseText = resp.data.text;
        setState(self.DONE);
      }
    }
  };

  /**
   * Called when an error is encountered to deal with it.
   */
  this.handleError = function (error) {
    this.status = 0;
    this.statusText = error;
    this.responseText = error.stack;
    errorFlag = true;
    setState(this.DONE);
    this.dispatchEvent('error');
  };

  /**
   * Aborts a request.
   */
  this.abort = function () {
    if (request) {
      request.abort();
      request = null;
    }

    headers = defaultHeaders;
    this.status = 0;
    this.responseText = "";
    this.responseXML = "";

    errorFlag = true;

    if (this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || sendFlag) && this.readyState !== this.DONE) {
      sendFlag = false;
      setState(this.DONE);
    }
    this.readyState = this.UNSENT;
    this.dispatchEvent('abort');
  };

  /**
   * Adds an event listener. Preferred method of binding to events.
   */
  this.addEventListener = function (event, callback) {
    if (!(event in listeners)) {
      listeners[event] = [];
    }
    // Currently allows duplicate callbacks. Should it?
    listeners[event].push(callback);
  };

  /**
   * Remove an event callback that has already been bound.
   * Only works on the matching funciton, cannot be a copy.
   */
  this.removeEventListener = function (event, callback) {
    if (event in listeners) {
      // Filter will return a new array with the callback removed
      listeners[event] = listeners[event].filter(function (ev) {
        return ev !== callback;
      });
    }
  };

  /**
   * Dispatch any events, including both "on" methods and events attached using addEventListener.
   */
  this.dispatchEvent = function (event) {
    if (typeof self["on" + event] === "function") {
      self["on" + event]();
    }
    if (event in listeners) {
      for (var i = 0, len = listeners[event].length; i < len; i++) {
        listeners[event][i].call(self);
      }
    }
  };

  /**
   * Changes readyState and calls onreadystatechange.
   *
   * @param int state New state
   */
  var setState = function setState(state) {
    if (state == self.LOADING || self.readyState !== state) {
      self.readyState = state;

      if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) {
        self.dispatchEvent("readystatechange");
      }

      if (self.readyState === self.DONE && !errorFlag) {
        self.dispatchEvent("load");
        // @TODO figure out InspectorInstrumentation::didLoadXHR(cookie)
        self.dispatchEvent("loadend");
      }
    }
  };
};

/***/ }),

/***/ "rplX":
/***/ (function(module, exports) {

(function (self) {
  'use strict';

  if (self.fetch) {
    return;
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && function () {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    }(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

    var isDataView = function isDataView(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj);
    };

    var isArrayBufferView = ArrayBuffer.isView || function (obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name');
    }
    return name.toLowerCase();
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value;
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function next() {
        var value = items.shift();
        return { done: value === undefined, value: value };
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function () {
        return iterator;
      };
    }

    return iterator;
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function (header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function (name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function (name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ',' + value : value;
  };

  Headers.prototype['delete'] = function (name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function (name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null;
  };

  Headers.prototype.has = function (name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function (name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function (callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push(name);
    });
    return iteratorFor(items);
  };

  Headers.prototype.values = function () {
    var items = [];
    this.forEach(function (value) {
      items.push(value);
    });
    return iteratorFor(items);
  };

  Headers.prototype.entries = function () {
    var items = [];
    this.forEach(function (value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items);
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function (resolve, reject) {
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise;
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise;
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('');
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0);
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer;
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function (body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type');
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function () {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function () {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
        } else {
          return this.blob().then(readBlobAsArrayBuffer);
        }
      };
    }

    this.text = function () {
      var rejected = consumed(this);
      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text');
      } else {
        return Promise.resolve(this._bodyText);
      }
    };

    if (support.formData) {
      this.formData = function () {
        return this.text().then(decode);
      };
    }

    this.json = function () {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read');
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests');
    }
    this._initBody(body);
  }

  Request.prototype.clone = function () {
    return new Request(this, { body: this._bodyInit });
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function (bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    });
  };

  Response.error = function () {
    var response = new Response(null, { status: 0, statusText: '' });
    response.type = 'error';
    return response;
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function (url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code');
    }

    return new Response(null, { status: status, headers: { location: url } });
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function () {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : this);

/***/ }),

/***/ "vHs2":
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "xaOn":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return assert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return assertionError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return base64; });
/* unused harmony export base64Decode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return base64Encode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CONSTANTS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return deepCopy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return deepExtend; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return patchProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Deferred; });
/* unused harmony export getUA */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return isMobileCordova; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return isNodeSdk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return isReactNative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ErrorFactory; });
/* unused harmony export FirebaseError */
/* unused harmony export patchCapture */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return jsonEval; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return stringify; });
/* unused harmony export decode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return isAdmin; });
/* unused harmony export issuedAtTime */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return isValidFormat; });
/* unused harmony export isValidTimestamp */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return clone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return contains; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return every; });
/* unused harmony export extend */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return findKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return findValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return forEach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return getAnyKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return getCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return getValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return isEmpty; });
/* unused harmony export isNonNullObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return safeGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return querystring; });
/* unused harmony export querystringDecode */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return Sha1; });
/* unused harmony export async */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return createSubscribe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return errorPrefix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return validateArgCount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "K", function() { return validateCallback; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return validateContextObject; });
/* unused harmony export validateNamespace */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return stringLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return stringToByteArray$1; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__("TToO");


/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview Firebase constants.  Some of these (@defines) can be overridden at compile-time.
 */
var CONSTANTS = {
    /**
     * @define {boolean} Whether this is the client Node.js SDK.
     */
    NODE_CLIENT: false,
    /**
     * @define {boolean} Whether this is the Admin Node.js SDK.
     */
    NODE_ADMIN: false,
    /**
     * Firebase SDK Version
     */
    SDK_VERSION: '${JSCORE_VERSION}'
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Throws an error if the provided assertion is falsy
 * @param {*} assertion The assertion to be tested for falsiness
 * @param {!string} message The message to display if the check fails
 */
var assert = function assert(assertion, message) {
    if (!assertion) {
        throw assertionError(message);
    }
};
/**
 * Returns an Error object suitable for throwing.
 * @param {string} message
 * @return {!Error}
 */
var assertionError = function assertionError(message) {
    return new Error('Firebase Database (' + CONSTANTS.SDK_VERSION + ') INTERNAL ASSERT FAILED: ' + message);
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var stringToByteArray = function stringToByteArray(str) {
    // TODO(user): Use native implementations if/when available
    var out = [],
        p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
        } else if ((c & 0xfc00) == 0xd800 && i + 1 < str.length && (str.charCodeAt(i + 1) & 0xfc00) == 0xdc00) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03ff) << 10) + (str.charCodeAt(++i) & 0x03ff);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
        } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
        }
    }
    return out;
};
/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param {Array<number>} bytes Array of numbers representing characters.
 * @return {string} Stringification of the array.
 */
var byteArrayToString = function byteArrayToString(bytes) {
    // TODO(user): Use native implementations if/when available
    var out = [],
        pos = 0,
        c = 0;
    while (pos < bytes.length) {
        var c1 = bytes[pos++];
        if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
        } else if (c1 > 191 && c1 < 224) {
            var c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
            // Surrogate Pair
            var c2 = bytes[pos++];
            var c3 = bytes[pos++];
            var c4 = bytes[pos++];
            var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
            out[c++] = String.fromCharCode(0xd800 + (u >> 10));
            out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
        } else {
            var c2 = bytes[pos++];
            var c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
    }
    return out.join('');
};
// Static lookup maps, lazily populated by init_()
var base64 = {
    /**
     * Maps bytes to characters.
     * @type {Object}
     * @private
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     * @type {Object}
     * @private
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @type {Object}
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @type {Object}
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     * @type {string}
     */
    ENCODED_VALS_BASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789',
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     * @type {string}
     */
    get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + '+/=';
    },
    /**
     * Our websafe alphabet.
     * @type {string}
     */
    get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + '-_.';
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     * @type {boolean}
     */
    HAS_NATIVE_SUPPORT: typeof atob === 'function',
    /**
     * Base64-encode an array of bytes.
     *
     * @param {Array<number>|Uint8Array} input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param {boolean=} opt_webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return {string} The base64 encoded string.
     */
    encodeByteArray: function encodeByteArray(input, opt_webSafe) {
        if (!Array.isArray(input)) {
            throw Error('encodeByteArray takes an array as a parameter');
        }
        this.init_();
        var byteToCharMap = opt_webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
        var output = [];
        for (var i = 0; i < input.length; i += 3) {
            var byte1 = input[i];
            var haveByte2 = i + 1 < input.length;
            var byte2 = haveByte2 ? input[i + 1] : 0;
            var haveByte3 = i + 2 < input.length;
            var byte3 = haveByte3 ? input[i + 2] : 0;
            var outByte1 = byte1 >> 2;
            var outByte2 = (byte1 & 0x03) << 4 | byte2 >> 4;
            var outByte3 = (byte2 & 0x0f) << 2 | byte3 >> 6;
            var outByte4 = byte3 & 0x3f;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join('');
    },
    /**
     * Base64-encode a string.
     *
     * @param {string} input A string to encode.
     * @param {boolean=} opt_webSafe If true, we should use the
     *     alternative alphabet.
     * @return {string} The base64 encoded string.
     */
    encodeString: function encodeString(input, opt_webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !opt_webSafe) {
            return btoa(input);
        }
        return this.encodeByteArray(stringToByteArray(input), opt_webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param {string} input to decode.
     * @param {boolean=} opt_webSafe True if we should use the
     *     alternative alphabet.
     * @return {string} string representing the decoded value.
     */
    decodeString: function decodeString(input, opt_webSafe) {
        // Shortcut for Mozilla browsers that implement
        // a native base64 encoder in the form of "btoa/atob"
        if (this.HAS_NATIVE_SUPPORT && !opt_webSafe) {
            return atob(input);
        }
        return byteArrayToString(this.decodeStringToByteArray(input, opt_webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param {string} input Input to decode.
     * @param {boolean=} opt_webSafe True if we should use the web-safe alphabet.
     * @return {!Array<number>} bytes representing the decoded value.
     */
    decodeStringToByteArray: function decodeStringToByteArray(input, opt_webSafe) {
        this.init_();
        var charToByteMap = opt_webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
        var output = [];
        for (var i = 0; i < input.length;) {
            var byte1 = charToByteMap[input.charAt(i++)];
            var haveByte2 = i < input.length;
            var byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            var haveByte3 = i < input.length;
            var byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            var haveByte4 = i < input.length;
            var byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
                throw Error();
            }
            var outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 != 64) {
                var outByte2 = byte2 << 4 & 0xf0 | byte3 >> 2;
                output.push(outByte2);
                if (byte4 != 64) {
                    var outByte3 = byte3 << 6 & 0xc0 | byte4;
                    output.push(outByte3);
                }
            }
        }
        return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_: function init_() {
        if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            // We want quick mappings back and forth, so we precompute two maps.
            for (var i = 0; i < this.ENCODED_VALS.length; i++) {
                this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
                this.charToByteMap_[this.byteToCharMap_[i]] = i;
                this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
                this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
                // Be forgiving when decoding and correctly decode both encodings.
                if (i >= this.ENCODED_VALS_BASE.length) {
                    this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                    this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
                }
            }
        }
    }
};
/**
 * URL-safe base64 encoding
 * @param {!string} str
 * @return {!string}
 */
var base64Encode = function base64Encode(str) {
    var utf8Bytes = stringToByteArray(str);
    return base64.encodeByteArray(utf8Bytes, true);
};
/**
 * URL-safe base64 decoding
 *
 * NOTE: DO NOT use the global atob() function - it does NOT support the
 * base64Url variant encoding.
 *
 * @param {string} str To be decoded
 * @return {?string} Decoded result, if possible
 */
var base64Decode = function base64Decode(str) {
    try {
        return base64.decodeString(str, true);
    } catch (e) {
        console.error('base64Decode failed: ', e);
    }
    return null;
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Do a deep-copy of basic JavaScript Objects or Arrays.
 */
function deepCopy(value) {
    return deepExtend(undefined, value);
}
/**
 * Copy properties from source to target (recursively allows extension
 * of Objects and Arrays).  Scalar values in the target are over-written.
 * If target is undefined, an object of the appropriate type will be created
 * (and returned).
 *
 * We recursively copy all child properties of plain Objects in the source- so
 * that namespace- like dictionaries are merged.
 *
 * Note that the target can be a function, in which case the properties in
 * the source Object are copied onto it as static properties of the Function.
 */
function deepExtend(target, source) {
    if (!(source instanceof Object)) {
        return source;
    }
    switch (source.constructor) {
        case Date:
            // Treat Dates like scalars; if the target date object had any child
            // properties - they will be lost!
            var dateValue = source;
            return new Date(dateValue.getTime());
        case Object:
            if (target === undefined) {
                target = {};
            }
            break;
        case Array:
            // Always copy the array source and overwrite the target.
            target = [];
            break;
        default:
            // Not a plain Object - treat it as a scalar.
            return source;
    }
    for (var prop in source) {
        if (!source.hasOwnProperty(prop)) {
            continue;
        }
        target[prop] = deepExtend(target[prop], source[prop]);
    }
    return target;
}
// TODO: Really needed (for JSCompiler type checking)?
function patchProperty(obj, prop, value) {
    obj[prop] = value;
}

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Deferred = /** @class */function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    /**
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     * @param {((?function(?(Error)): (?|undefined))| (?function(?(Error),?=): (?|undefined)))=} callback
     * @return {!function(?(Error), ?=)}
     */
    Deferred.prototype.wrapCallback = function (callback) {
        var _this = this;
        return function (error, value) {
            if (error) {
                _this.reject(error);
            } else {
                _this.resolve(value);
            }
            if (typeof callback === 'function') {
                // Attaching noop handler just in case developer wasn't expecting
                // promises
                _this.promise.catch(function () {});
                // Some of our callbacks don't expect a value and our own tests
                // assert that the parameter length is 1
                if (callback.length === 1) {
                    callback(error);
                } else {
                    callback(error, value);
                }
            }
        };
    };
    return Deferred;
}();

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns navigator.userAgent string or '' if it's not defined.
 * @return {string} user agent string
 */
var getUA = function getUA() {
    if (typeof navigator !== 'undefined' && typeof navigator['userAgent'] === 'string') {
        return navigator['userAgent'];
    } else {
        return '';
    }
};
/**
 * Detect Cordova / PhoneGap / Ionic frameworks on a mobile device.
 *
 * Deliberately does not rely on checking `file://` URLs (as this fails PhoneGap in the Ripple emulator) nor
 * Cordova `onDeviceReady`, which would normally wait for a callback.
 *
 * @return {boolean} isMobileCordova
 */
var isMobileCordova = function isMobileCordova() {
    return typeof window !== 'undefined' && !!(window['cordova'] || window['phonegap'] || window['PhoneGap']) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
};
/**
 * Detect React Native.
 *
 * @return {boolean} True if ReactNative environment is detected.
 */
var isReactNative = function isReactNative() {
    return typeof navigator === 'object' && navigator['product'] === 'ReactNative';
};
/**
 * Detect Node.js.
 *
 * @return {boolean} True if Node.js environment is detected.
 */
var isNodeSdk = function isNodeSdk() {
    return CONSTANTS.NODE_CLIENT === true || CONSTANTS.NODE_ADMIN === true;
};

var ERROR_NAME = 'FirebaseError';
var captureStackTrace = Error.captureStackTrace;
// Export for faking in tests
function patchCapture(captureFake) {
    var result = captureStackTrace;
    captureStackTrace = captureFake;
    return result;
}
var FirebaseError = /** @class */function () {
    function FirebaseError(code, message) {
        this.code = code;
        this.message = message;
        // We want the stack value, if implemented by Error
        if (captureStackTrace) {
            // Patches this.stack, omitted calls above ErrorFactory#create
            captureStackTrace(this, ErrorFactory.prototype.create);
        } else {
            var err_1 = Error.apply(this, arguments);
            this.name = ERROR_NAME;
            // Make non-enumerable getter for the property.
            Object.defineProperty(this, 'stack', {
                get: function get() {
                    return err_1.stack;
                }
            });
        }
    }
    return FirebaseError;
}();
// Back-door inheritance
FirebaseError.prototype = Object.create(Error.prototype);
FirebaseError.prototype.constructor = FirebaseError;
FirebaseError.prototype.name = ERROR_NAME;
var ErrorFactory = /** @class */function () {
    function ErrorFactory(service, serviceName, errors) {
        this.service = service;
        this.serviceName = serviceName;
        this.errors = errors;
        // Matches {$name}, by default.
        this.pattern = /\{\$([^}]+)}/g;
        // empty
    }
    ErrorFactory.prototype.create = function (code, data) {
        if (data === undefined) {
            data = {};
        }
        var template = this.errors[code];
        var fullCode = this.service + '/' + code;
        var message;
        if (template === undefined) {
            message = 'Error';
        } else {
            message = template.replace(this.pattern, function (match, key) {
                var value = data[key];
                return value !== undefined ? value.toString() : '<' + key + '?>';
            });
        }
        // Service: Error message (service/code).
        message = this.serviceName + ': ' + message + ' (' + fullCode + ').';
        var err = new FirebaseError(fullCode, message);
        // Populate the Error object with message parts for programmatic
        // accesses (e.g., e.file).
        for (var prop in data) {
            if (!data.hasOwnProperty(prop) || prop.slice(-1) === '_') {
                continue;
            }
            err[prop] = data[prop];
        }
        return err;
    };
    return ErrorFactory;
}();

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Evaluates a JSON string into a javascript object.
 *
 * @param {string} str A string containing JSON.
 * @return {*} The javascript object representing the specified JSON.
 */
function jsonEval(str) {
    return JSON.parse(str);
}
/**
 * Returns JSON representing a javascript object.
 * @param {*} data Javascript object to be stringified.
 * @return {string} The JSON contents of the object.
 */
function stringify(data) {
    return JSON.stringify(data);
}

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Decodes a Firebase auth. token into constituent parts.
 *
 * Notes:
 * - May return with invalid / incomplete claims if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 *
 * @param {?string} token
 * @return {{header: *, claims: *, data: *, signature: string}}
 */
var decode = function decode(token) {
    var header = {},
        claims = {},
        data = {},
        signature = '';
    try {
        var parts = token.split('.');
        header = jsonEval(base64Decode(parts[0]) || '');
        claims = jsonEval(base64Decode(parts[1]) || '');
        signature = parts[2];
        data = claims['d'] || {};
        delete claims['d'];
    } catch (e) {}
    return {
        header: header,
        claims: claims,
        data: data,
        signature: signature
    };
};
/**
 * Decodes a Firebase auth. token and checks the validity of its time-based claims. Will return true if the
 * token is within the time window authorized by the 'nbf' (not-before) and 'iat' (issued-at) claims.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 *
 * @param {?string} token
 * @return {boolean}
 */
var isValidTimestamp = function isValidTimestamp(token) {
    var claims = decode(token).claims,
        now = Math.floor(new Date().getTime() / 1000),
        validSince,
        validUntil;
    if (typeof claims === 'object') {
        if (claims.hasOwnProperty('nbf')) {
            validSince = claims['nbf'];
        } else if (claims.hasOwnProperty('iat')) {
            validSince = claims['iat'];
        }
        if (claims.hasOwnProperty('exp')) {
            validUntil = claims['exp'];
        } else {
            // token will expire after 24h by default
            validUntil = validSince + 86400;
        }
    }
    return now && validSince && validUntil && now >= validSince && now <= validUntil;
};
/**
 * Decodes a Firebase auth. token and returns its issued at time if valid, null otherwise.
 *
 * Notes:
 * - May return null if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 *
 * @param {?string} token
 * @return {?number}
 */
var issuedAtTime = function issuedAtTime(token) {
    var claims = decode(token).claims;
    if (typeof claims === 'object' && claims.hasOwnProperty('iat')) {
        return claims['iat'];
    }
    return null;
};
/**
 * Decodes a Firebase auth. token and checks the validity of its format. Expects a valid issued-at time and non-empty
 * signature.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 *
 * @param {?string} token
 * @return {boolean}
 */
var isValidFormat = function isValidFormat(token) {
    var decoded = decode(token),
        claims = decoded.claims;
    return !!decoded.signature && !!claims && typeof claims === 'object' && claims.hasOwnProperty('iat');
};
/**
 * Attempts to peer into an auth token and determine if it's an admin auth token by looking at the claims portion.
 *
 * Notes:
 * - May return a false negative if there's no native base64 decoding support.
 * - Doesn't check if the token is actually valid.
 *
 * @param {?string} token
 * @return {boolean}
 */
var isAdmin = function isAdmin(token) {
    var claims = decode(token).claims;
    return typeof claims === 'object' && claims['admin'] === true;
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// See http://www.devthought.com/2012/01/18/an-object-is-not-a-hash/
var contains = function contains(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
var safeGet = function safeGet(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
    // else return undefined.
};
/**
 * Enumerates the keys/values in an object, excluding keys defined on the prototype.
 *
 * @param {?Object.<K,V>} obj Object to enumerate.
 * @param {!function(K, V)} fn Function to call for each key and value.
 * @template K,V
 */
var forEach = function forEach(obj, fn) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn(key, obj[key]);
        }
    }
};
/**
 * Copies all the (own) properties from one object to another.
 * @param {!Object} objTo
 * @param {!Object} objFrom
 * @return {!Object} objTo
 */
var extend = function extend(objTo, objFrom) {
    forEach(objFrom, function (key, value) {
        objTo[key] = value;
    });
    return objTo;
};
/**
 * Returns a clone of the specified object.
 * @param {!Object} obj
 * @return {!Object} cloned obj.
 */
var clone = function clone(obj) {
    return extend({}, obj);
};
/**
 * Returns true if obj has typeof "object" and is not null.  Unlike goog.isObject(), does not return true
 * for functions.
 *
 * @param obj {*} A potential object.
 * @returns {boolean} True if it's an object.
 */
var isNonNullObject = function isNonNullObject(obj) {
    return typeof obj === 'object' && obj !== null;
};
var isEmpty = function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
};
var getCount = function getCount(obj) {
    var rv = 0;
    for (var key in obj) {
        rv++;
    }
    return rv;
};
var map = function map(obj, f, opt_obj) {
    var res = {};
    for (var key in obj) {
        res[key] = f.call(opt_obj, obj[key], key, obj);
    }
    return res;
};
var findKey = function findKey(obj, fn, opt_this) {
    for (var key in obj) {
        if (fn.call(opt_this, obj[key], key, obj)) {
            return key;
        }
    }
    return undefined;
};
var findValue = function findValue(obj, fn, opt_this) {
    var key = findKey(obj, fn, opt_this);
    return key && obj[key];
};
var getAnyKey = function getAnyKey(obj) {
    for (var key in obj) {
        return key;
    }
};
var getValues = function getValues(obj) {
    var res = [];
    var i = 0;
    for (var key in obj) {
        res[i++] = obj[key];
    }
    return res;
};
/**
 * Tests whether every key/value pair in an object pass the test implemented
 * by the provided function
 *
 * @param {?Object.<K,V>} obj Object to test.
 * @param {!function(K, V)} fn Function to call for each key and value.
 * @template K,V
 */
var every = function every(obj, fn) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!fn(key, obj[key])) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns a querystring-formatted string (e.g. &arg=val&arg2=val2) from a params
 * object (e.g. {arg: 'val', arg2: 'val2'})
 * Note: You must prepend it with ? when adding it to a URL.
 *
 * @param {!Object} querystringParams
 * @return {string}
 */
var querystring = function querystring(querystringParams) {
    var params = [];
    forEach(querystringParams, function (key, value) {
        if (Array.isArray(value)) {
            value.forEach(function (arrayVal) {
                params.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrayVal));
            });
        } else {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
    });
    return params.length ? '&' + params.join('&') : '';
};
/**
 * Decodes a querystring (e.g. ?arg=val&arg2=val2) into a params object (e.g. {arg: 'val', arg2: 'val2'})
 *
 * @param {string} querystring
 * @return {!Object}
 */
var querystringDecode = function querystringDecode(querystring) {
    var obj = {};
    var tokens = querystring.replace(/^\?/, '').split('&');
    tokens.forEach(function (token) {
        if (token) {
            var key = token.split('=');
            obj[key[0]] = key[1];
        }
    });
    return obj;
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Abstract cryptographic hash interface.
 *
 * See Sha1 and Md5 for sample implementations.
 *
 */
/**
 * Create a cryptographic hash instance.
 *
 * @constructor
 * @struct
 */
var Hash = /** @class */function () {
    function Hash() {
        /**
         * The block size for the hasher.
         * @type {number}
         */
        this.blockSize = -1;
    }
    return Hash;
}();

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview SHA-1 cryptographic hash.
 * Variable names follow the notation in FIPS PUB 180-3:
 * http://csrc.nist.gov/publications/fips/fips180-3/fips180-3_final.pdf.
 *
 * Usage:
 *   var sha1 = new sha1();
 *   sha1.update(bytes);
 *   var hash = sha1.digest();
 *
 * Performance:
 *   Chrome 23:   ~400 Mbit/s
 *   Firefox 16:  ~250 Mbit/s
 *
 */
/**
 * SHA-1 cryptographic hash constructor.
 *
 * The properties declared here are discussed in the above algorithm document.
 * @constructor
 * @extends {Hash}
 * @final
 * @struct
 */
var Sha1 = /** @class */function (_super) {
    Object(__WEBPACK_IMPORTED_MODULE_0_tslib__["b" /* __extends */])(Sha1, _super);
    function Sha1() {
        var _this = _super.call(this) || this;
        /**
         * Holds the previous values of accumulated variables a-e in the compress_
         * function.
         * @type {!Array<number>}
         * @private
         */
        _this.chain_ = [];
        /**
         * A buffer holding the partially computed hash result.
         * @type {!Array<number>}
         * @private
         */
        _this.buf_ = [];
        /**
         * An array of 80 bytes, each a part of the message to be hashed.  Referred to
         * as the message schedule in the docs.
         * @type {!Array<number>}
         * @private
         */
        _this.W_ = [];
        /**
         * Contains data needed to pad messages less than 64 bytes.
         * @type {!Array<number>}
         * @private
         */
        _this.pad_ = [];
        /**
         * @private {number}
         */
        _this.inbuf_ = 0;
        /**
         * @private {number}
         */
        _this.total_ = 0;
        _this.blockSize = 512 / 8;
        _this.pad_[0] = 128;
        for (var i = 1; i < _this.blockSize; ++i) {
            _this.pad_[i] = 0;
        }
        _this.reset();
        return _this;
    }
    Sha1.prototype.reset = function () {
        this.chain_[0] = 0x67452301;
        this.chain_[1] = 0xefcdab89;
        this.chain_[2] = 0x98badcfe;
        this.chain_[3] = 0x10325476;
        this.chain_[4] = 0xc3d2e1f0;
        this.inbuf_ = 0;
        this.total_ = 0;
    };
    /**
     * Internal compress helper function.
     * @param {!Array<number>|!Uint8Array|string} buf Block to compress.
     * @param {number=} opt_offset Offset of the block in the buffer.
     * @private
     */
    Sha1.prototype.compress_ = function (buf, opt_offset) {
        if (!opt_offset) {
            opt_offset = 0;
        }
        var W = this.W_;
        // get 16 big endian words
        if (typeof buf === 'string') {
            for (var i = 0; i < 16; i++) {
                // TODO(user): [bug 8140122] Recent versions of Safari for Mac OS and iOS
                // have a bug that turns the post-increment ++ operator into pre-increment
                // during JIT compilation.  We have code that depends heavily on SHA-1 for
                // correctness and which is affected by this bug, so I've removed all uses
                // of post-increment ++ in which the result value is used.  We can revert
                // this change once the Safari bug
                // (https://bugs.webkit.org/show_bug.cgi?id=109036) has been fixed and
                // most clients have been updated.
                W[i] = buf.charCodeAt(opt_offset) << 24 | buf.charCodeAt(opt_offset + 1) << 16 | buf.charCodeAt(opt_offset + 2) << 8 | buf.charCodeAt(opt_offset + 3);
                opt_offset += 4;
            }
        } else {
            for (var i = 0; i < 16; i++) {
                W[i] = buf[opt_offset] << 24 | buf[opt_offset + 1] << 16 | buf[opt_offset + 2] << 8 | buf[opt_offset + 3];
                opt_offset += 4;
            }
        }
        // expand to 80 words
        for (var i = 16; i < 80; i++) {
            var t = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
            W[i] = (t << 1 | t >>> 31) & 0xffffffff;
        }
        var a = this.chain_[0];
        var b = this.chain_[1];
        var c = this.chain_[2];
        var d = this.chain_[3];
        var e = this.chain_[4];
        var f, k;
        // TODO(user): Try to unroll this loop to speed up the computation.
        for (var i = 0; i < 80; i++) {
            if (i < 40) {
                if (i < 20) {
                    f = d ^ b & (c ^ d);
                    k = 0x5a827999;
                } else {
                    f = b ^ c ^ d;
                    k = 0x6ed9eba1;
                }
            } else {
                if (i < 60) {
                    f = b & c | d & (b | c);
                    k = 0x8f1bbcdc;
                } else {
                    f = b ^ c ^ d;
                    k = 0xca62c1d6;
                }
            }
            var t = (a << 5 | a >>> 27) + f + e + k + W[i] & 0xffffffff;
            e = d;
            d = c;
            c = (b << 30 | b >>> 2) & 0xffffffff;
            b = a;
            a = t;
        }
        this.chain_[0] = this.chain_[0] + a & 0xffffffff;
        this.chain_[1] = this.chain_[1] + b & 0xffffffff;
        this.chain_[2] = this.chain_[2] + c & 0xffffffff;
        this.chain_[3] = this.chain_[3] + d & 0xffffffff;
        this.chain_[4] = this.chain_[4] + e & 0xffffffff;
    };
    Sha1.prototype.update = function (bytes, opt_length) {
        // TODO(johnlenz): tighten the function signature and remove this check
        if (bytes == null) {
            return;
        }
        if (opt_length === undefined) {
            opt_length = bytes.length;
        }
        var lengthMinusBlock = opt_length - this.blockSize;
        var n = 0;
        // Using local instead of member variables gives ~5% speedup on Firefox 16.
        var buf = this.buf_;
        var inbuf = this.inbuf_;
        // The outer while loop should execute at most twice.
        while (n < opt_length) {
            // When we have no data in the block to top up, we can directly process the
            // input buffer (assuming it contains sufficient data). This gives ~25%
            // speedup on Chrome 23 and ~15% speedup on Firefox 16, but requires that
            // the data is provided in large chunks (or in multiples of 64 bytes).
            if (inbuf == 0) {
                while (n <= lengthMinusBlock) {
                    this.compress_(bytes, n);
                    n += this.blockSize;
                }
            }
            if (typeof bytes === 'string') {
                while (n < opt_length) {
                    buf[inbuf] = bytes.charCodeAt(n);
                    ++inbuf;
                    ++n;
                    if (inbuf == this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            } else {
                while (n < opt_length) {
                    buf[inbuf] = bytes[n];
                    ++inbuf;
                    ++n;
                    if (inbuf == this.blockSize) {
                        this.compress_(buf);
                        inbuf = 0;
                        // Jump to the outer loop so we use the full-block optimization.
                        break;
                    }
                }
            }
        }
        this.inbuf_ = inbuf;
        this.total_ += opt_length;
    };
    /** @override */
    Sha1.prototype.digest = function () {
        var digest = [];
        var totalBits = this.total_ * 8;
        // Add pad 0x80 0x00*.
        if (this.inbuf_ < 56) {
            this.update(this.pad_, 56 - this.inbuf_);
        } else {
            this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
        }
        // Add # bits.
        for (var i = this.blockSize - 1; i >= 56; i--) {
            this.buf_[i] = totalBits & 255;
            totalBits /= 256; // Don't use bit-shifting here!
        }
        this.compress_(this.buf_);
        var n = 0;
        for (var i = 0; i < 5; i++) {
            for (var j = 24; j >= 0; j -= 8) {
                digest[n] = this.chain_[i] >> j & 255;
                ++n;
            }
        }
        return digest;
    };
    return Sha1;
}(Hash);

/**
 * Helper to make a Subscribe function (just like Promise helps make a
 * Thenable).
 *
 * @param executor Function which can make calls to a single Observer
 *     as a proxy.
 * @param onNoObservers Callback when count of Observers goes to zero.
 */
function createSubscribe(executor, onNoObservers) {
    var proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
}
/**
 * Implement fan-out for any number of Observers attached via a subscribe
 * function.
 */
var ObserverProxy = /** @class */function () {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    function ObserverProxy(executor, onNoObservers) {
        var _this = this;
        this.observers = [];
        this.unsubscribes = [];
        this.observerCount = 0;
        // Micro-task scheduling by calling task.then().
        this.task = Promise.resolve();
        this.finalized = false;
        this.onNoObservers = onNoObservers;
        // Call the executor asynchronously so subscribers that are called
        // synchronously after the creation of the subscribe function
        // can still receive the very first value generated in the executor.
        this.task.then(function () {
            executor(_this);
        }).catch(function (e) {
            _this.error(e);
        });
    }
    ObserverProxy.prototype.next = function (value) {
        this.forEachObserver(function (observer) {
            observer.next(value);
        });
    };
    ObserverProxy.prototype.error = function (error) {
        this.forEachObserver(function (observer) {
            observer.error(error);
        });
        this.close(error);
    };
    ObserverProxy.prototype.complete = function () {
        this.forEachObserver(function (observer) {
            observer.complete();
        });
        this.close();
    };
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber sychronously to their
     *   call to subscribe().
     */
    ObserverProxy.prototype.subscribe = function (nextOrObserver, error, complete) {
        var _this = this;
        var observer;
        if (nextOrObserver === undefined && error === undefined && complete === undefined) {
            throw new Error('Missing Observer.');
        }
        // Assemble an Observer object when passed as callback functions.
        if (implementsAnyMethods(nextOrObserver, ['next', 'error', 'complete'])) {
            observer = nextOrObserver;
        } else {
            observer = {
                next: nextOrObserver,
                error: error,
                complete: complete
            };
        }
        if (observer.next === undefined) {
            observer.next = noop;
        }
        if (observer.error === undefined) {
            observer.error = noop;
        }
        if (observer.complete === undefined) {
            observer.complete = noop;
        }
        var unsub = this.unsubscribeOne.bind(this, this.observers.length);
        // Attempt to subscribe to a terminated Observable - we
        // just respond to the Observer with the final error or complete
        // event.
        if (this.finalized) {
            this.task.then(function () {
                try {
                    if (_this.finalError) {
                        observer.error(_this.finalError);
                    } else {
                        observer.complete();
                    }
                } catch (e) {
                    // nothing
                }
                return;
            });
        }
        this.observers.push(observer);
        return unsub;
    };
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    ObserverProxy.prototype.unsubscribeOne = function (i) {
        if (this.observers === undefined || this.observers[i] === undefined) {
            return;
        }
        delete this.observers[i];
        this.observerCount -= 1;
        if (this.observerCount === 0 && this.onNoObservers !== undefined) {
            this.onNoObservers(this);
        }
    };
    ObserverProxy.prototype.forEachObserver = function (fn) {
        if (this.finalized) {
            // Already closed by previous event....just eat the additional values.
            return;
        }
        // Since sendOne calls asynchronously - there is no chance that
        // this.observers will become undefined.
        for (var i = 0; i < this.observers.length; i++) {
            this.sendOne(i, fn);
        }
    };
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    ObserverProxy.prototype.sendOne = function (i, fn) {
        var _this = this;
        // Execute the callback asynchronously
        this.task.then(function () {
            if (_this.observers !== undefined && _this.observers[i] !== undefined) {
                try {
                    fn(_this.observers[i]);
                } catch (e) {
                    // Ignore exceptions raised in Observers or missing methods of an
                    // Observer.
                    // Log error to console. b/31404806
                    if (typeof console !== 'undefined' && console.error) {
                        console.error(e);
                    }
                }
            }
        });
    };
    ObserverProxy.prototype.close = function (err) {
        var _this = this;
        if (this.finalized) {
            return;
        }
        this.finalized = true;
        if (err !== undefined) {
            this.finalError = err;
        }
        // Proxy is no longer needed - garbage collect references
        this.task.then(function () {
            _this.observers = undefined;
            _this.onNoObservers = undefined;
        });
    };
    return ObserverProxy;
}();
/** Turn synchronous function into one called asynchronously. */
function async(fn, onError) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        Promise.resolve(true).then(function () {
            fn.apply(void 0, args);
        }).catch(function (error) {
            if (onError) {
                onError(error);
            }
        });
    };
}
/**
 * Return true if the object passed in implements any of the named methods.
 */
function implementsAnyMethods(obj, methods) {
    if (typeof obj !== 'object' || obj === null) {
        return false;
    }
    for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
        var method = methods_1[_i];
        if (method in obj && typeof obj[method] === 'function') {
            return true;
        }
    }
    return false;
}
function noop() {}
// do nothing


/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Check to make sure the appropriate number of arguments are provided for a public function.
 * Throws an error if it fails.
 *
 * @param {!string} fnName The function name
 * @param {!number} minCount The minimum number of arguments to allow for the function call
 * @param {!number} maxCount The maximum number of argument to allow for the function call
 * @param {!number} argCount The actual number of arguments provided.
 */
var validateArgCount = function validateArgCount(fnName, minCount, maxCount, argCount) {
    var argError;
    if (argCount < minCount) {
        argError = 'at least ' + minCount;
    } else if (argCount > maxCount) {
        argError = maxCount === 0 ? 'none' : 'no more than ' + maxCount;
    }
    if (argError) {
        var error = fnName + ' failed: Was called with ' + argCount + (argCount === 1 ? ' argument.' : ' arguments.') + ' Expects ' + argError + '.';
        throw new Error(error);
    }
};
/**
 * Generates a string to prefix an error message about failed argument validation
 *
 * @param {!string} fnName The function name
 * @param {!number} argumentNumber The index of the argument
 * @param {boolean} optional Whether or not the argument is optional
 * @return {!string} The prefix to add to the error thrown for validation.
 */
function errorPrefix(fnName, argumentNumber, optional) {
    var argName = '';
    switch (argumentNumber) {
        case 1:
            argName = optional ? 'first' : 'First';
            break;
        case 2:
            argName = optional ? 'second' : 'Second';
            break;
        case 3:
            argName = optional ? 'third' : 'Third';
            break;
        case 4:
            argName = optional ? 'fourth' : 'Fourth';
            break;
        default:
            throw new Error('errorPrefix called with argumentNumber > 4.  Need to update it?');
    }
    var error = fnName + ' failed: ';
    error += argName + ' argument ';
    return error;
}
/**
 * @param {!string} fnName
 * @param {!number} argumentNumber
 * @param {!string} namespace
 * @param {boolean} optional
 */
function validateNamespace(fnName, argumentNumber, namespace, optional) {
    if (optional && !namespace) return;
    if (typeof namespace !== 'string') {
        //TODO: I should do more validation here. We only allow certain chars in namespaces.
        throw new Error(errorPrefix(fnName, argumentNumber, optional) + 'must be a valid firebase namespace.');
    }
}
function validateCallback(fnName, argumentNumber, callback, optional) {
    if (optional && !callback) return;
    if (typeof callback !== 'function') throw new Error(errorPrefix(fnName, argumentNumber, optional) + 'must be a valid function.');
}
function validateContextObject(fnName, argumentNumber, context, optional) {
    if (optional && !context) return;
    if (typeof context !== 'object' || context === null) throw new Error(errorPrefix(fnName, argumentNumber, optional) + 'must be a valid context object.');
}

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Code originally came from goog.crypt.stringToUtf8ByteArray, but for some reason they
// automatically replaced '\r\n' with '\n', and they didn't handle surrogate pairs,
// so it's been modified.
// Note that not all Unicode characters appear as single characters in JavaScript strings.
// fromCharCode returns the UTF-16 encoding of a character - so some Unicode characters
// use 2 characters in Javascript.  All 4-byte UTF-8 characters begin with a first
// character in the range 0xD800 - 0xDBFF (the first character of a so-called surrogate
// pair).
// See http://www.ecma-international.org/ecma-262/5.1/#sec-15.1.3
/**
 * @param {string} str
 * @return {Array}
 */
var stringToByteArray$1 = function stringToByteArray$1(str) {
    var out = [],
        p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        // Is this the lead surrogate in a surrogate pair?
        if (c >= 0xd800 && c <= 0xdbff) {
            var high = c - 0xd800; // the high 10 bits.
            i++;
            assert(i < str.length, 'Surrogate pair missing trail surrogate.');
            var low = str.charCodeAt(i) - 0xdc00; // the low 10 bits.
            c = 0x10000 + (high << 10) + low;
        }
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
        } else if (c < 65536) {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
        } else {
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
        }
    }
    return out;
};
/**
 * Calculate length without actually converting; useful for doing cheaper validation.
 * @param {string} str
 * @return {number}
 */
var stringLength = function stringLength(str) {
    var p = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) {
            p++;
        } else if (c < 2048) {
            p += 2;
        } else if (c >= 0xd800 && c <= 0xdbff) {
            // Lead surrogate of a surrogate pair.  The pair together will take 4 bytes to represent.
            p += 4;
            i++; // skip trail surrogate.
        } else {
            p += 3;
        }
    }
    return p;
};

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



/***/ })

/******/ });
//# sourceMappingURL=ssr-bundle.js.map