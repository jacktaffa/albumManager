var helpers = require("helpers"),
    fs = require("fs");
exports.version = "0.1.0";
exports.generate = function(req,res){
    var page = req.params.nome_pagina;
    fs.readFile(
        'basic.html',
        function(err, contents){
            if(err){
                send_failure(res, 500, err);
                return;
            }
            contents = contents.toString('utf8');
            //modifica il nome della pagina quindi lo mosta in output
            contents = contents.replace('{{NOME_PAGINA}}', page);
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(contents);
        }
    );
}