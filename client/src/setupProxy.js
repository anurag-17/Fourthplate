// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:5000', // Change this to the URL of your backend API
      target: "http://34.242.24.155:5000",
      changeOrigin: true,
    })
  );
};
