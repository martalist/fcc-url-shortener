const express = require('express')
    , mongo = require('mongodb').MongoClient
    , URLRegExp = require('url-regexp');

const router = express.Router()
    , url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url_shortener';

router.get('/', (req, res) => {
  res.redirect('/');
});

router.get(/.*/i, (req, res) => {
  const originalUrl = req.url.slice(1);

  if ( URLRegExp.validate(originalUrl) ) {
    mongo.connect(url, (err, db) => {
      if (err) {
        console.error('There was a problem connecting to the db', err);
      }
      getShortUrlAndInsert(db, res, originalUrl);
    });
  } else {
    res.json({error: '"' + originalUrl + '" is not a valid url'});
  }
});


function getShortUrlAndInsert(db, res, originalUrl) {
  // fetch counter
  db.collection('counter').findOneAndUpdate({}
    , {$inc: {count:1}}
    , {
      returnOriginal: false,
      upsert: true
    }
    , (err, doc) => {
      if (err) console.error(err);
      insertUrl(db, res, doc.value.count, originalUrl);
    }
  );
}

function insertUrl(db, res, shortUrl, originalUrl) {
  // insert into db
  db.collection('urls').insert({
    shortUrl,
    originalUrl
  }, (err, doc) => {
    if (err) console.error(err);
    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
    db.close();
  });
}

module.exports = router;
