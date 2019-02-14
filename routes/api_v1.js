var express = require('express');
var router = express.Router();
var cache = require('express-redis-cache')();

var user_controller = require('../controllers/userController');
var activity_controller = require('../controllers/activityController');

router.get('/user/:userId', user_controller.user_get);
router.get('/user/:userId/log-entries/:year?/monthly-counts', user_controller.log_entries_monthly_counts_get);
router.get('/user/:userId/log-entries/:year?/:month?/:day?', user_controller.log_entries_get);
router.get('/user/by-username/:userName', user_controller.user_by_username_get);
router.get('/user/by-username/:userName/id', cache.route(), user_controller.id_by_username_get);

router.get('/user/:userId/activity', activity_controller.activity_get);

module.exports = router;