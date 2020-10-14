const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/mock', {
            target: 'http://112.74.41.227:7300',
            changeOrigin: true
        })
    )
}
