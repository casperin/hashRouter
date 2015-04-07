const pathToArray = path =>
    path.split('/').filter(x => !!x);

const isParam = str =>
    str.charAt(0) === ':';

const hashMatch = (match, hash) => {
    const matchArray = pathToArray(match),
          hashArray = pathToArray(hash),
          params = {};

    let found = true,
        i = -1,
        h, m;

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


const helpers = {
    pathToArray,
    hashMatch,
    isParam,

    getArgsAndParams: (hash, matches) => {
        let i = -1,
            item,
            params;

        while (++i < matches.length) {
            item = matches[i];
            params = hashMatch(item.match, hash);

            if (params) {
                return {
                    arg: item.arg,
                    params
                };
            }
        }

        return false;
    }
};

export default helpers;
