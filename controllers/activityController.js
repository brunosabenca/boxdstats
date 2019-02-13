var client = require('../letterboxd');

exports.activity_get = async function (req, res, next) {
  let userId = req.params['userId'];
  try {
    activityEntries = await client.activity(userId);
    res.json(activityEntries.data);
  } catch (e) {
    console.log(e);
    next(e);
  }
}