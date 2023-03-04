require('dotenv').config();

const express = require('express'),
	  helmet = require('helmet'),
      morgan = require('morgan'),
      cors = require('cors'),
      httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({}),
	  app = express(),
	  limit = process.env.LIMIT,
	  base = process.env.BASE;

const direct = (req, res)=>{
	try{
		const offset = Math.floor(Math.random()*limit),
			  url = `http://${process.env.INSTANCEHOST}:${+base + +offset}`;
		console.log(url);

		proxy.web(req, res, { target: url });
	}
	catch(err){
		console.log('main error', err);
		res.status(500).send({status:'error'});
	}
}

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(direct);

if(process.env.ENV==='test'){
	module.exports = app;
}
else{
	app.listen(process.env.PORT, ()=>console.log(`Started main server at ${process.env.PORT}.`));
}