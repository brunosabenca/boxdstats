const axios = require('axios');
const client = require('../letterboxd');

exports.user_get = async function (req, res, next) {
  let userId = req.params['userId'];
  try {
    let userData = await fetchUserData(userId)
    res.json(userData);
  } catch (e) {
    console.log(e);
  }
}

exports.id_by_username_get = async function (req, res, next) {
  let userName = req.params['userName'];
  try {
    let userId = await fetchId(userName);
    res.json({
      'id': userId
    });
  } catch (e) {
    console.log(e);
  }
}

exports.user_by_username_get = async function (req, res, next) {
  let userName = req.params['userName'];
  try {
    let userId = await fetchId(userName);
    let userData = await fetchUserData(userId)
    res.json(userData);
  } catch (e) {
    console.log(e);
  }
}

async function fetchId(userName) {
  try {
    let response = await axios(`http://letterboxd.com/${userName}`);
    let userId = response.headers['x-letterboxd-identifier'];
    return userId;
  } catch (e) {
    console.log(e);
  }
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