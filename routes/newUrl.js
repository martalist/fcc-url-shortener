const express = require('express')
    , router = express.Router()
    , URLRegExp = require('url-regexp');

router.get('/', (req, res) => {
  res.end('You need to add a proper url');
});

router.get(/.*/i, (req, res) => {
  const original_url = req.url.slice(1);

  // Is it a valid url?
  if ( URLRegExp.validate(original_url) ) {
    // add to db
    // return json { "original_url":"http://foo.com:80", "short_url":"https://little-url.herokuapp.com/8170" }
    res.json({
      original_url,
      valid_url: true
    });
  }
  else {
    res.end('"' + original_url + '" is not a valid url');
  }
  // else
});

module.exports = router;
