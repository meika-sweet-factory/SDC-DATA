const async = require('async');

// an example using an object instead of an array
async.parallel({
    one: function(callback) {
	setTimeout(function() {
	    callback(null, 1);
	}, 200);
    },
    two: function(callback) {
	setTimeout(function() {
	    callback(null, 2);
	}, 100);
    }
}, function(err, results) {
    // results is now equals to: {one: 1, two: 2}
    console.log(results);
});
