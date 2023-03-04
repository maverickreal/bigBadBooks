require('dotenv').config();

const express = require('express'),
	  axios = require('axios'),
	  helmet = require('helmet'),
      morgan = require('morgan'),
      cors = require('cors');

const app = express(),
	  limit = process.env.MHSL,
	  bp = process.env.BASEPORT;

const getConfig = req => {
	const offset = Math.floor(Math.random()*limit);
	const config = {
		method : req.method.toLowerCase(),
		url : `http://127.0.0.1:${+bp + +offset}${req.path}`,
		headers: req.headers,
		data: req.body
	}
	//console.log(config.method, config.url, config.data);
	return config;
}

const direct = async (req, res)=>{
	try{
		const config = getConfig(req),
			  ret = await axios(config);
		//console.log(ret.data);
		res.status(ret.statusCode).send(ret.data);
	}
	catch(err){
		//console.log('main error', err);
		res.status(500).send({status:'error'});
	}
}

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(direct);

if (process.env.ENV === 'test') {
    module.exports = app;
}
else {
	app.listen(process.env.MHSP, ()=>console.log('Started the main server.'));
}