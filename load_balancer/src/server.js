const http = require('http'),
	  httpProxy = require('http-proxy');

require('dotenv').config();

const limit = process.env.LIMIT,
	  base = process.env.BASE;

const proxy = httpProxy.createProxyServer({}),
	  server = http.createServer(function(req, res) {
	  	const offset = Math.floor(Math.random()*limit),
	  		  toHost = process.env.INSTANCEHOST + (+offset + 1), // -> x000(n) == server(n+1)
	  		  toPort = +base + +offset,
	  		  target = `http://${toHost}:${toPort}`;
	  	console.log(`Redirecting to ${target}.`);
	  	proxy.web(req, res, { target });
	  });
 
if(process.env.ENV==='test'){
	module.exports = server;
}
else{
	server.listen(process.env.PORT, ()=>console.log(`Main server started at ${process.env.PORT}.`));
}