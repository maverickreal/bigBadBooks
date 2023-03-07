const rateLimit = require('express-rate-limit');

const userRateLimit = rateLimit({
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: process.env.RATELIMITWINDOWSIZE,
  max: process.env.RATELIMITREQUESTLIMIT,
  keyGenerator: function (req) {
    return req.user.userId;
  }
});

const ipRateLimit = rateLimit({
  message: 'You have exceeded the 100 requests in 24 hrs limit!', 
  standardHeaders: true,
  legacyHeaders: false,
  windowMs: process.env.RATELIMITWINDOWSIZE,
  max: process.env.RATELIMITREQUESTLIMIT,
});

module.exports = { userRateLimit, ipRateLimit };