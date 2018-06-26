'use strict';

const NodeCache = require('node-cache');

class Cache {

    constructor(ttlSeconds) {
        this.cache = new NodeCache({stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false});
    }

    store(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }

        return storeFunction().then((result) => {

            this.cache.set(key, result);
            return result;
        });
    }

    storeStatic(key, data) {
        const value = this.cache.get(key);
        if (value) {
            return value;
        }

        this.cache.set(key, data);
        return data;
    }

    add(key, data) {
        return this.cache.set(key, data);
    }

    get(key, asPromise) {
        const value = this.cache.get(key);
        if (value) {
            return (asPromise === true || typeof asPromise === 'undefined') ? Promise.resolve(value) : value;
        }

        return null;
    }

    delete(keys) {
        this.cache.del(keys);
    }

    deleteByStartStrKey(startStrKey = '') {
        if (!startStrKey) {
            return;
        }

        const allCacheKeys = this.cache.keys();
        for (const key of allCacheKeys) {
            if (key.indexOf(startStrKey) === 0) {
                this.delete(key);
            }
        }
    }

    flush() {
        this.cache.flushAll();
    }
}


module.exports = Cache;