var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController');
var activity_controller = require('../controllers/activityController');

router.get('/user/:userId/activity', activity_controller.activity_get);

router.get('/user/:userId/avatar', user_controller.avatar_get);

router.get('/username/:userName/id', user_controller.id_get);

module.exports = router;