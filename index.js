const http = require('http');
const morgan = require('morgan');
const serve = require('serve-handler');

const env = process.env.NODE_ENV || 'development';

const logger = morgan(env === 'development' ? 'dev' : 'tiny');

const options = {
  trailingSlash: true,
  rewrites: [
    {
      source: 'react-:id',
      destination: 'react-:id/build/index.html',
    },
    {
      source: 'react-:id/static/js/:file',
      destination: 'react-:id/build/static/js/:file',
    },
    {
      source: 'react-:id/static/css/:file',
      destination: 'react-:id/build/static/css/:file',
    },
    {
      source: 'react-:id/static/media/:file',
      destination: 'react-:id/build/static/media/:file',
    },
    {
      source: 'react-:id/:file',
      destination: 'react-:id/build/:file',
    },
  ],
};

if (env === 'production') {
  options.directoryListing = false;
  options.redirects = [
    { source: '/', type: 302, destination: 'https://www.paris-web.fr/' },
  ];
}

const server = http.createServer((req, res) => {
  logger(req, res, () => serve(req, res, options));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.info(`parisweb.app ${env} HTTP Server now listening on port ${port}`);
});