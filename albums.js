var express = require("express"),
    fs = require("fs"),
    helpers = require("helpers"),
    path = require("path"),
    pages = require("pages");
    app = express();

var APATH = "album/";

app.listen(8080, function () {
    console.log("Server avviato");
});



function handle_lists_album(req, res){
    fs.readdir(APATH, function(err, files){
        if(err){
            helpers.send_failure(404, 'no_such_album', helpers.no_such_album());
            return;
        }

        var list = [];

        (function iterator(index){

            if(index == files.length) {
                helpers.send_success(res, list);
                return;
            }
            fs.stat(APATH + files[index], function(err, stat){
                if(err) {
                    helpers.send_failure(err.statusCode, err.status, err);
                    return;
                }
                if(stat.isDirectory()) list.push({name : files[index]});
                iterator(++index);
            });
        })(0);

    });
}

function handle_load_album(req, res){
    var nome_album = req.params.nome_album,
        page = req.params.pag||0,
        view = req.params.view||-1,
        fpath = APATH + nome_album +'/';
    fs.readdir(fpath, function(err, files){
        if(err){
            helpers.send_failure(404,'no_such_album', err);
            return;
        }
        var list = [];
        (function iterator(index){
            if(index === files.length){
                if(view === -1) {
                    helpers.send_success(res, list);
                    return;
                }
                else {
                    helpers.send_success(res, list.splice(page * view, page * view + view));
                    return;
                }
            }// if index
            var file = files[index];
            console.log(file);
            fs.stat(fpath + file, function(err, stat){
                if(err){
                    helpers.send_failure(res, err.statusCode, err);
                    return;
                }
                if(stat.isFile()) {
                    console.log(path.extname(file));
                    switch (path.extname(file)) {
                        case ".jpg": case ".png": case ".jpeg":case ".gif": case ".tiff":
                        list.
                            push({
                                name: files[index],
                                ext: path.extname(files[index]),
                                url: fpath + '/' + files[index]
                            });
                        break;
                        default: break;
                    }
                }
            });//fs.stat
            iterator(++index);

        })(0);
    });
}

app.get('/album[s]?.json', handle_lists_album);
app.get(['/album[s]?/:nome_album.json', '/album[s]?/:nome_album.json?pag=:pag','/album[s]?/:nome_album.json?pag=:pag&view=:view'], handle_load_album);
