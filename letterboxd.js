const client = new(require('./client'))();

module.exports = {

    member(userId) {
        return client.get(`/member/${userId}`);
    },

    statistics(userId) {
        return client.get(`/member/${userId}/statistics`);
    },

    watchlist(userId) {
        return client.get(`/member/${userId}/watchlist`);
    },

    activity(userId) {
        return client.get(`/member/${userId}/activity`);
    },

    logEntries(params) {
        return client.get(`/log-entries`, {
            params: params
        });
    }
}