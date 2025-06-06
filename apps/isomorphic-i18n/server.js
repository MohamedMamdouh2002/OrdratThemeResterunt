const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// const dev = true; // on production comment it
const dev = false // on production uncomment it
const hostname = 'localhost';
const port = 3001;

// when using middleware hostname and port must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	createServer(async (req, res) => {
		try {
			// Be sure to pass true as the second argument to url.parse.
			// This tells it to parse the query portion of the URL.
			const parsedUrl = parse(req.url, true);
			const { pathname, query } = parsedUrl;

			// Set Cache-Control headers
			// res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

			if (pathname === '/a') {
				await app.render(req, res, '/a', query);
			} else if (pathname === '/b') {
				await app.render(req, res, '/b', query);
			} else {
				await handle(req, res, parsedUrl);
			}
		} catch (err) {
			console.error('Error occurred handling', req.url, err);
			res.statusCode = 500;
			res.end('internal server error');
		}
	}).listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});