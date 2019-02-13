const client = new (require('./client'))();

module.exports = {

    member(userId) {
        return client.get(`/member/${userId}`);
    },

    statistics(userId) {
        return client.get(`/member/${userId}/statistics`);
    },

    watchlist(userId) {
        return client.get(`/member/${userId}/watchlist`);
    }

}