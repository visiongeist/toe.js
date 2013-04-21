var http = require('http'),
  fs = require('fs');

http.createServer(function (req, res) {
	var url = req.url;
	if (url.indexOf('toe.js') > 0) {
	  res.writeHead(200, {'Content-Type': 'test/javascript'});
	  res.end(fs.readFileSync('../dist/toe.js'));
  } else {
	  res.writeHead(200, {'Content-Type': 'text/html'});
	  res.end(fs.readFileSync('demo.html'));
  }
}).listen(8888);
