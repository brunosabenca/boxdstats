const axios = require('axios');
const client = require('../letterboxd');

exports.id_get = async function (req, res, next) {
  let userName = req.params['userName'];
  try {
    let response = await axios(`http://letterboxd.com/${userName}`);
    let userId = response.headers['x-letterboxd-identifier'];
    res.json({'username': userName, 'id': userId});
  } catch (e) {
    console.log(e);
    next(e);
  }
}

exports.avatar_get = async function (req, res, next) {
  try {
    let userId = req.params['userId'];
    let response = await client.member(userId);
    const avatar = response.data.avatar.sizes[0].url;
    res.json(avatar);
  } catch (e) {
    console.log(e);
    next(e);
  }
}