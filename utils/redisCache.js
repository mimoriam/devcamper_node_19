const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect().then();

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = async function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');

    return this;
}

mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    // Assign how you want to cache based on Queries (User ID/ req.params.id or whatever)

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // This query uses req.params.id:
    // const key = JSON.stringify(Object.assign({}, this.getQuery()));

    // console.log(key);
    // First, check to see if we have any cached data related to the query:
    const cacheValue = await client.hGet(this.hashKey, key);

    // If we do have it, return it:
    if (cacheValue) {
        const doc = JSON.parse(cacheValue);
        console.log(doc);

        return Array.isArray(doc)
            ? doc.map(d => new this.model(d))
            : new this.model(doc);
    }

    // Otherwise use the original MongoDB query and store the result in Redis after:
    const result = await exec.apply(this, arguments);

    // 1 day (in seconds) cache expiry:
    client.hSet(this.hashKey, key, JSON.stringify(result), 'EX', 86400);

    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}