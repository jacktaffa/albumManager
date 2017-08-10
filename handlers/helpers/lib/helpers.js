exports.version="0.1.0";
exports.make_error = function(err, msg){
     var e = new Error(msg);
     e.code = err;
     return e;
};

exports.send_success = function(res, data){
    res.writeHead(200, {"Content-Type": "application/json"});
    var out = {error: null, data: data};
    res.end(JSON.stringify(out) + "\n");
};
exports.send_failure = function (res, code, err) {
    res.writeHead(code, {"Content-Type": "application/json"});
    res.end(JSON.stringify({error: err.code, message:err.message}) + "\n");
};
exports.invalid_resource = function(){
    return exports.make_error("invalid_resource","La risorsa richiesta non esiste");
}
exports.no_such_album = function(){
    return exports.make_error("no_such_album", "L'album richiesto non esiste");
}