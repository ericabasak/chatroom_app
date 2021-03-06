// variable declarations serving static http files
var http = require('http');

var fs = require('fs');

var path = require('path');

var mime = require('path');

var cache = {};

// helper function
function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

// helper function serving file data
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"content-type": mime.getType(path.basename(filePath))}
    );
    response.end(fileContents);
}

// helper function serving static files
function serveStatic(response, cache, absPath) {
    if(cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists){
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

// create http server
var server = http.createServer(function(request, response){
    var filePath = false;

    if(request.url == './'){
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

// start the server

server.listen(3000, function(){
    console.log("server listening on port 3000.");
})

var chatServer = require('.lib/chat_server');
chatServer.listen(server);