(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.hashRouter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _state = require('./state');

var _state2 = _interopRequireWildcard(_state);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireWildcard(_helpers);

var router = {
    VERSION: '0.0.1',

    _state: _state2['default'],

    _helpers: _helpers2['default'],

    start: function start() {
        window.addEventListener('hashchange', router._handleHashChange, false);
        _state2['default'].running = true;
        router._handleHashChange();
    },

    stop: function stop() {
        window.removeEventListener('hashchange', router._handleHashChange, false);
        _state2['default'].running = false;
    },

    reset: function reset() {
        _state2['default'].matches = [];
        _state2['default'].subscribers = [];
    },

    _getHash: function _getHash() {
        return window.location.hash.slice(1);
    },

    _handleHashChange: function _handleHashChange() {
        var hash = router._getHash();
        var _helpers$getArgsAndParams = _helpers2['default'].getArgsAndParams(hash, _state2['default'].matches);

        var arg = _helpers$getArgsAndParams.arg;
        var params = _helpers$getArgsAndParams.params;

        if (arg === undefined) {
            router.emit('not-found', hash);
        } else {
            router.emit(arg, params);
        }
    },

    addRoutes: function addRoutes(array) {
        return array.forEach(function (route) {
            return Object.keys(route).forEach(function (key) {
                return _state2['default'].matches.push({
                    match: key,
                    arg: route[key]
                });
            });
        });
    },

    register: function register(fn) {
        if (_state2['default'].subscribers.indexOf(fn) === -1) {
            _state2['default'].subscribers.push(fn);
        }
    },

    emit: function emit() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _state2['default'].subscribers.forEach(function (fn) {
            return fn.apply(null, args);
        });
    }
};

exports['default'] = router;
module.exports = exports['default'];

},{"./helpers":2,"./state":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var pathToArray = function pathToArray(path) {
    return path.split('/').filter(function (x) {
        return !!x;
    });
};

var isParam = function isParam(str) {
    return str.charAt(0) === ':';
};

var hashMatch = function hashMatch(match, hash) {
    var matchArray = pathToArray(match),
        hashArray = pathToArray(hash),
        params = {};

    var found = true,
        i = -1,
        h = undefined,
        m = undefined;

    if (matchArray.length !== hashArray.length) {
        return false;
    }

    while (++i < matchArray.length) {
        h = hashArray[i];
        m = matchArray[i];

        if (isParam(m)) {
            params[m.slice(1)] = h;
        } else if (m !== h) {
            found = false;
            break;
        }
    }

    return found ? params : false;
};

var helpers = {
    pathToArray: pathToArray,
    hashMatch: hashMatch,
    isParam: isParam,

    getArgsAndParams: function getArgsAndParams(hash, matches) {
        var i = -1,
            item = undefined,
            params = undefined;

        while (++i < matches.length) {
            item = matches[i];
            params = hashMatch(item.match, hash);

            if (params) {
                return {
                    arg: item.arg,
                    params: params
                };
            }
        }

        return false;
    }
};

exports['default'] = helpers;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var state = {
    running: false,
    matches: [],
    subscribers: []
};

exports["default"] = state;
module.exports = exports["default"];

},{}]},{},[1])(1)
});