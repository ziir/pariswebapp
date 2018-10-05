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
    {
      source: 'redux-:id',
      destination: 'redux-:id/build/index.html',
    },
    {
      source: 'redux-:id/static/js/:file',
      destination: 'redux-:id/build/static/js/:file',
    },
    {
      source: 'redux-:id/static/css/:file',
      destination: 'redux-:id/build/static/css/:file',
    },
    {
      source: 'redux-:id/static/media/:file',
      destination: 'redux-:id/build/static/media/:file',
    },
    {
      source: 'redux-:id/:file',
      destination: 'redux-:id/build/:file',
    },
    {
      source: '/',
      destination: 'public/index.html',
    },
    {
      source: '/fonts/:font',
      destination: 'public/fonts/:font',
    },
    {
      source: '/:asset',
      destination: 'public/:asset',
    },
  ],
};

if (env === 'production') {
  options.directoryListing = false;
}

const server = http.createServer((req, res) => {
  logger(req, res, () => serve(req, res, options));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.info(`parisweb.app ${env} HTTP Server now listening on port ${port}`);
});
