const express = require('express'),
	  http = require('http'),
	  app = express(),
	  limit = process.env.MHSL,
	  bp = process.env.BASEPORT;

const direct = (req, res)=>{
	try{
		const method = req.method.toLowerCase(),
			  offset = Math.floor(Math.random()*limit),
			  url = `127.0.0.1:${bp+offset}/${req.path}`;
		(http[method])(url, ret => res.send(ret));
	}
	catch(err){
		console.log('main error', err);
		res.status(500).send({status:'error'});
	}
}

app.use(direct);

app.listen(process.env.MHSP);