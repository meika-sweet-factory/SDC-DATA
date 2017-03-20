const google = require('google')

module.exports = {
    query: (search, callback) => {
	google.resultsPerPage = 1
	google.lang = 'fr'
	google.tld = 'fr'
	google.nextText = 'fr'
	var arr = []
	google(search, (err, res) => {
	    if (!err) {
		for (var i = 0; i < res.links.length; i++) {
		    var link = res.links[i]
		    if (link.href) {
			arr.push(link.href)
		    }
		}
		callback(arr[0])
	    }
	})
    }
}
