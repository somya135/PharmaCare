var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Update the connection code to use openUri() method
var connection = mongoose.connect('mongodb://127.0.0.1:27017/mean_db', { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = connection;
