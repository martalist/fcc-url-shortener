const express = require('express')
    , mongo = require('mongodb').MongoClient;

const router = express.Router()
    , url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url_shortener';

router.get('/', (req, res) => {
  const { protocol, headers: { host }} = req
      , domain = protocol + '://' + host;
  res.render('index', { domain });
});

router.get('/:shortUrl', (req, res, next) => {
  const { shortUrl } = req.params;
  mongo.connect(url, (err, db) => {
    if (err) {
      console.error('There was a problem connecting to the db', err);
    }
    db.collection('urls').find({shortUrl: +shortUrl}).next((err, result) => {
      if (err) console.error(err);
      if (!result) {
        res.json({error: shortUrl + " is not in the database."});
      } else {
        res.redirect(result.originalUrl);
      }
      db.close();
    });
  });
});

module.exports = router;
