const express = require('express')
    , mongo = require('mongodb').MongoClient
    , URLRegExp = require('url-regexp');

const router = express.Router()
    , url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url_shortener';

router.get('/', (req, res) => {
  res.redirect('/');
});

router.get(/.*/i, (req, res) => {
  const originalUrl = req.url.slice(1)
      , { protocol, headers: { host }} = req
      , domain = protocol + '://' + host;

  if ( URLRegExp.validate(originalUrl) ) {
    mongo.connect(url, (err, db) => {
      if (err) {
        console.error('There was a problem connecting to the db', err);
      }
      // fetch counter
      db.collection('counter').findOneAndUpdate({}
        , {$inc: {count:1}}
        , {
          returnOriginal: false,
          upsert: true
        }
        , (err, counter) => {
          if (err) console.error(err);
          const shortUrl = counter.value.count;

          // insert into db
          db.collection('urls').insert({shortUrl, originalUrl}, (err, doc) => {
            if (err) console.error(err);
            res.json({
              original_url: originalUrl,
              short_url: domain + '/' + shortUrl,
            });
            db.close();
          });
        }
      );
    });
  } else {
    res.json({error: '"' + originalUrl + '" is not a valid url'});
  }
});

module.exports = router;
