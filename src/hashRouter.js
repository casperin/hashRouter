import state from './state';
import helpers from './helpers';

const router = {
    VERSION: '0.0.1',

    _state: state,

    _helpers: helpers,

    start: () => {
        window.addEventListener('hashchange', router._handleHashChange, false);
        state.running = true;
        router._handleHashChange();
    },

    stop: () => {
        window.removeEventListener('hashchange', router._handleHashChange, false);
        state.running = false;
    },

    reset: () => {
        state.matches = [];
        state.subscribers = [];
    },

    _getHash: () => window.location.hash.slice(1),

    _handleHashChange: () => {
        const hash = router._getHash(),
              {arg, params} = helpers.getArgsAndParams(hash, state.matches);

        if (arg === undefined) {
            router.emit('not-found', hash);
        } else {
            router.emit(arg, params);
        }
    },

    addRoutes: array =>
        array.forEach(route =>
            Object.keys(route).forEach(key =>
                state.matches.push({
                    match: key,
                    arg: route[key]
                })
            )
        ),

    register: fn => {
        if (state.subscribers.indexOf(fn) === -1) {
            state.subscribers.push(fn);
        }
    },

    emit: (...args) =>
        state.subscribers.forEach(fn => fn.apply(null, args))
};

export default router;
