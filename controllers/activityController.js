var client = require('../client');

const getDiaryEntries = (userId) => {
    return client.get(`/member/${userId}/activity`)
        .then((response) => {
            var entries = response.data.items
            var diaryEntries = entries.filter(entry => entry.type == "DiaryEntryActivity")
            
            return diaryEntries;
        })
        .catch(function (error) {
            console.log(error)
        })
}

exports.activity_get = async function (req, res, next) {
  try {
    let userId = req.params['userId'];
    const entries =  await getDiaryEntries(userId);
    res.json(entries);
  } catch (e) {
    console.log(e);
    next(e) 
  }
}