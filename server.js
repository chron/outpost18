const ParcelProxyServer = require('parcel-proxy-server');

const server = new ParcelProxyServer({
  entryPoint: 'src/index.html',
  parcelOptions: {
    https: false,
  },
  proxies: {
    '/.netlify/functions/': {
      target: 'http://localhost:9000/',
    }
  }
});

server.bundler.on('buildEnd', () => {
  console.log('Build completed!');
});

// start up the server
server.listen(1234, () => {
  console.log('Parcel proxy server has started');
});
