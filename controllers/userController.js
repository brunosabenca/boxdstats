const axios = require('axios');
const client = require('../letterboxd');

exports.user_get = async function (req, res, next) {
  let userId = req.params['userId'];
  try {
    let userData = await fetchUserData(userId)
    res.json(userData);
  } catch (e) {
    next(e);
  }
}

exports.id_by_username_get = async function (req, res, next) {
  let userName = req.params['userName'];
  try {
    let userId = await fetchId(userName);

    if (userId !== 'invalid') {
      res.json({
        'id': userId
      });
    } else{
      res.status(404).json({ error: { status: 404, message: "Couldn't find a user with that username."}});
    }
  } catch (e) {
    next(e);
  }
}

exports.user_by_username_get = async function (req, res, next) {
  let userName = req.params['userName'];
  try {
    let userId = await fetchId(userName);
    if (userId !== 'invalid') {
      let userData = await fetchUserData(userId)
      res.json(userData);
    } else{
      res.status(404).json({ error: { status: 404, message: "Couldn't find a user with that username."}});
    }
  } catch (e) {
    next(e);
  }
}

exports.log_entries_monthly_counts_get = async function (req, res, next) {
  let userId = req.params['userId'];
  let year = req.params['year'];

  let logEntries = [];
  let monthlyLogEntryCount = {};

  const now = new Date();
  let currentYear = now.getFullYear();
  let end = currentYear == year ? now.getMonth() + 1 : 12;

  try {
    for (month = 1; month <= end; month++) {
      logEntries = await fetchLogEntries({
        member: userId,
        year: year,
        month: month
      });
      monthlyLogEntryCount[month] = logEntries.length || 0;
    }
    res.json(monthlyLogEntryCount);
  } catch (e) {
    next(e);
  }
}


exports.log_entries_highest_rated_get = async function (req, res, next) {
  let userId = req.params['userId'];
  let year = req.params['year'];

  const params = {
    member: userId,
    year: year,
    sort: 'MemberRatingHighToLow',
    minRating: 0.5,
    maxRating: 5,
    perPage: 5
  };

  const options = {
    fetchSinglePage: true,
  };

  try {
    let logEntries = await fetchLogEntries(params, options);
    const arr = Object.keys(logEntries)
      .map((key, index) => ({
        "name": logEntries[key].film.name,
        "link": logEntries[key].film.links[0].url,
        "rating": logEntries[key].rating,
        "year": logEntries[key].film.releaseYear,
        "like": logEntries[key].like,
        "poster": logEntries[key].film.poster.sizes[3],
      }));
    res.json(arr);
  } catch (e) {
    next(e);
  }
}

exports.log_entries_get = async function (req, res, next) {
  let userId = req.params['userId'];
  let year = req.params['year'];
  let month = req.params['month'];
  let day = req.params['day'];

  const params = {
    member: userId,
    perPage: 100
  };

  if (year != null) {
    params['year'] = year;
  }

  if (month != null) {
    params['month'] = month;
  }

  if (day != null) {
    params['day'] = day;
  }

  try {
    let logEntries = await fetchLogEntries(params);
    res.json(logEntries);
  } catch (e) {
    next(e);
  }
}

async function fetchLogEntries(params, options) {
  try {
    let response = await client.logEntries(params);
    let logEntries = response.items.map(item => item);

    let fetchSinglePage = false;
    if (arguments.length === 2  && options.hasOwnProperty('fetchSinglePage')) {
      fetchSinglePage = options['fetchSinglePage'];
    }

    if (fetchSinglePage == false) {
      while (response.next) {
        params['cursor'] = response.next;
        response = await client.logEntries(params);
        let moreLogEntries = response.items.map(item => item);
        logEntries = [...logEntries, ...moreLogEntries];
      }
    }

    return logEntries;
  } catch (e) {
    console.log(e);
  }

}

function fetchId(userName) {
    return axios(`http://letterboxd.com/${userName}`).then((res) => {
      return res.headers['x-letterboxd-identifier'];
    }).catch((e) => {
      return 'invalid';
    })
}

async function fetchUserData(userId) {
  try {
    let member = await client.member(userId);
    let stats = await client.statistics(userId);

    const user = {
      'id': member.id,
      'username': member.username,
      'name': member.givenName,
      'avatar': member.avatar.sizes[0].url,
      'bio': member.bio,
      'location': member.location,
      'filmsInDiaryThisYear': stats.counts.filmsInDiaryThisYear,
      'filmLikes': stats.counts.filmLikes,
      'ratings': stats.counts.ratings,
      'watches': stats.counts.watches,
      'watchlist': stats.counts.watchlist,
      'followers': stats.counts.followers,
      'following': stats.counts.following,
    }

    return user;
  } catch (e) {
    console.log(e);
  }
}