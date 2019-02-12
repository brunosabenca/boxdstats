var client = require('../client');
var fetch = require('node-fetch');

exports.id_get = function (req, res, next) {
  let userName = req.params['userName'];

  fetch(`http://letterboxd.com/${userName}/`,{
    method: "GET",
  }).then(res => {
    return res.headers.get('x-letterboxd-identifier');
  }).then(id => {
    res.json({
      'username': userName,
      'id': id
    });
  }).catch(err => console.log(err));
}

const getAvatar = (userId) => {
    return client.get(`/member/${userId}`)
        .then((response) => {
           return response.data.avatar.sizes[0].url;
        })
        .catch(function (error) {
            console.log(error)
        })
}

exports.avatar_get = async function (req, res, next) {
  try {
    let userId = req.params['userId'];
    const avatar =  await getAvatar(userId);
    res.json(avatar);
  } catch (e) {
    console.log(e);
    next(e) 
  }
}