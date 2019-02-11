var express = require('express');
const fetch = require("node-fetch");
var router = express.Router();

router.get('/:userName', function(req, res, next) {
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
});

module.exports = router;
