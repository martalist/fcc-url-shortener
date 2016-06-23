const express = require('express')
    , router = express.Router();

router.get('/', (req, res) => {
  app.render('index', (err) => {
    if (err) throw err;
  });
});

router.get('/:shortURL', (req, res, next) => {
  const { shortURL } = req.params;
  // fetch url from db
    // if it doesn't exist, return an error as json
    // eg. { error: "This url is not on the database." }
  // redirect
  // res.redirect();
  res.end(shortURL); // remove this line after implementing above
});

module.exports = router;
