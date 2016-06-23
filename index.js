const express = require('express')
    , app = express()
    // , mongo = require('mongodb').MongoClient;

app.set('port', (process.env.PORT || 5000));

// Static files
app.use(express.static(__dirname + '/public'));

// Routes
const routes = require('./routes/root.js')
    , newUrl = require('./routes/newUrl');
app.use('/new', newUrl);
app.use('/', routes);

// Listen
app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});
