/*
Node.js iEdon-WebTesseract.js
@Desc: A web front server for Captcha OCR. Powered By: Tesseract.js, Tesseract-OCR
@Author: iEdon(iedon.com)
*/

// initialize
var http = require('http');
var server = new http.Server();
server.listen(8123);
var Tesseract = require('tesseract.js');
	Tesseract.create({
		langPath: './',
	});

// related functions
function removeAllSpace(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '').replace(/\s+/g,"");;
}
function getQueryString(querystring, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = querystring.match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function dataURItoBuffer(dataURI) {
	return new Buffer(dataURI.split(",")[1], 'base64');
}

// handle requests
server.on('request', function(request, response) {
	var url = require('url').parse(request.url);
	var responseData = '';
	request.on('data', function (chunk) {
		responseData += chunk;
	});
	request.on('end', function () {
		if(responseData.length <= 4) {
			response.writeHead(500, {'Content-type':'text/plain; charset=utf-8'});
			response.write('Error: 500 POST size error.');
			response.end();
			return;
		}
		switch(url.pathname) {
		  case '/':
					try {
						var pic = dataURItoBuffer(responseData);
					} catch (e) {
						response.writeHead(500, {'Content-type':'text/plain; charset=utf-8'});
						response.write('Error: 500 Image converting error.\r\n' + e);
						response.end();
						return;
					}
					try{
						Tesseract.recognize(pic,{
							lang: 'eng',
							classify_bln_numeric_mode: 1
						}).then(function(result){
							response.writeHead(200, {'Content-type':'text/plain; charset=utf-8', 'Expires':'-1', 'Cache-Control':'no-cache', 'Pragma':'no-cache','X-Powered-By':'iEdon-WebTesseract.js','Access-Control-Allow-Origin':'*'});
							var captcha = removeAllSpace(result.text);
							response.write(captcha);
						}).catch(function(err){
							response.writeHead(500, {'Content-type':'text/plain; charset=utf-8'});
							response.write('Error: 500 Image recognizing error.\r\n' + err);
						}).finally(function(resultOrError){
							//console.log(resultOrError);
							response.end();
						});
					} catch (e) {
						response.writeHead(500, {'Content-type':'text/plain; charset=utf-8'});
						response.write('Error: 500 Recognizing functional error.\r\n' + e);
						response.end();
						return;
					}  
			  break;
		  default:
			  response.writeHead(404, {'Content-type':'text/plain; charset=utf-8'});
			  response.write('Error: 404 Not Found.');
			  response.end();
			  break;
		}
	});
});
console.log("[WebTesseract.js] Server starting running...");