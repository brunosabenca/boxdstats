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

    logEntries(userId, year=null, month=null, day=null, cursor=null) {
        let params = {
            member: userId,
        };

        if (cursor != null) {
            params['cursor'] = cursor;
        } 

        if (year != null) {
            params['year'] = year;
        }

        if (month != null) {
            params['month'] = month;
        }

        if (day != null) {
            params['day'] = day;
        }

        return client.get(`/log-entries`, { params: params }); 
    }
}