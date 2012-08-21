var fs = require('fs');
var path = require('path');
var url = require("url");
var http = require('http');
var mime = require('mime');

http.createServer(function(req, res){
    var uri = url.parse(req.url).pathname;
    var filename = path.join('./', uri);
    path.exists(filename, function(exists){
        if (!exists){
            res.writeHead(404, {
                "Content-Type": "text/plain"
            });
            res.write("404 Not Found\n");
            res.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()){
            filename += "index.html";
        }

        fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    res.write(err + "\n");
                    res.end();
                    return;
                }

                var type = mime.lookup(filename);
                res.writeHead(200, {
                    "Content-Type": type
                });
                res.write(file, "binary");
                res.end();
            });
        });
    }).listen(8273);
