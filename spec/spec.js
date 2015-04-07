/* globals describe, it, expect, afterEach */
var router = require('../hashRouter');

// We need to spoof router._getHash()
var hash = '';

router._getHash = function () {
    return hash;
};

// helper
function str (obj) {
    return JSON.stringify(obj);
}

function noop () {}

afterEach(function() {
    router.reset();
});

describe('router core', function () {
    it('is not running', function () {
        expect(router._state.running).toBe(false);
    });

    it('is possible to add matches', function () {
        router.addRoutes([
            {one: 'two'},
            {three: 'four'}
        ]);

        expect(router._state.matches[1].match).toBe('three');

        router.addRoutes([{five: 'six'}]);

        expect(router._state.matches[2].arg).toBe('six');
    });

    it('can add register listeners', function () {
        router.register(noop);

        expect(router._state.subscribers[0]).toBe(noop);
    });

    it('can emit changes via .emit() and passes arguments with it', function () {
        var e = {
            x: false,
            y: false,
            z: false
        };

        router.register(function (x, y, z) {
            e.x = x;
            e.y = y;
            e.z = z;
        });

        router.emit(true, true, true);

        expect(e.x && e.y && e.z).toBe(true);
    });
});

describe('internals', function () {
    it('simple hash match 1', function () {
        var params = router._helpers.hashMatch('one/two', 'one/three');

        expect(params).toBe(false);
    });

    it('simple hash match 1', function () {
        var params = router._helpers.hashMatch('one/two', 'one/two');

        expect(typeof params).toBe('object');
    });

    it('hash length', function () {
        var params = router._helpers.hashMatch('one/two/three', 'one/two');
        expect(params).toBe(false);

        var params2 = router._helpers.hashMatch('one/two', 'one/two/three');
        expect(params2).toBe(false);
    });

    it('handles beginning/ending slashes correctly', function () {
        var params = router._helpers.hashMatch('/one', 'one/');

        expect(typeof params).toBe('object');
    });

    it('can extract parameter correctly', function () {
        var params = router._helpers.hashMatch('one/:foo/three', 'one/bar/three');

        expect(params.foo).toBe('bar');
    });

    it('can extract multiple parameter correctly', function () {
        var params = router._helpers.hashMatch('one/:a/three/:b', 'one/foo/three/bar');

        expect(params.a).toBe('foo');
        expect(params.b).toBe('bar');
    });
});

describe('Everything is wired up', function () {
    it('As close to full test as we can get', function () {
        var page = '',
            params = {};

        hash = 'one/bar/three';

        router.register(function (_page, _params) {
            page = _page;
            params = _params;
        });

        router.addRoutes([{
            'one/:foo/three': 'page'
        }]);

        router._handleHashChange();

        expect(page).toBe('page');
        expect(params.foo).toBe('bar');

        hash = 'missing/page';

        router._handleHashChange();

        expect(page).toBe('not-found');
        expect(params).toBe('missing/page');
    });
});
