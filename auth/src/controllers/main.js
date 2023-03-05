const router = require('express').Router(),
	  handler = require('../handlers/main.js');

router.post('/authorise', handler.authorise);

router.put('/unauthorise', handler.unauthorise);

router.get('/verify', handler.verify);

module.exports = router;