const express = require('express')
    , app = express();

// Routes
const routes = require('./routes/root.js');
const newUrl = require('./routes/newUrl');

app.set('port', (process.env.PORT || 5000));

// Templates
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');

// Static files
app.use(express.static(__dirname + '/public'));

app.use('/new', newUrl);
app.use('/', routes);

// Listen
app.listen(app.get('port'), () => {
  console.log('Listening on port ' + app.get('port'));
});
