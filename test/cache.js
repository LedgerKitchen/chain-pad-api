const CacheService = require('../modules/repo/lib/Cache');
const Cache = new CacheService(60 * 60);
const key = 'test-key' + Math.random();

Cache.add(key, {
    field: '1',
    field2: '2',
});

Cache.get(key).then(r => {
    console.log(r);
});
