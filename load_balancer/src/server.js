const http = require('http'),
	  httpProxy = require('http-proxy');

require('dotenv').config();

const limit = process.env.LIMIT,
	  base = process.env.BASE;

const proxy = httpProxy.createProxyServer({}),
	  server = http.createServer(function(req, res) {
	  	const offset = Math.floor(Math.random()*limit),
	  		  target = `http://${process.env.INSTANCEHOST}:${+base + +offset}`;
	  	proxy.web(req, res, { target });
	  });
 
if(process.env.ENV==='test'){
	module.exports = server;
}
else{
	server.listen(process.env.PORT, ()=>console.log(`Main server started at ${process.env.PORT}.`));
}