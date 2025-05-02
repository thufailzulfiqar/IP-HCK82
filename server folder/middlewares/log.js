function logMiddleware(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    console.log('Request Mehod:', req.method);
    
    next()
}

module.exports = logMiddleware