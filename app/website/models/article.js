// var http = require('http');
var edge = require('edge');

var params = {
    connectionString: "Data Source=173.192.85.206;Initial Catalog=node-test;user id=asp_user;password=zenttre",
    source: "EXEC SEL_PRUEBA_SP"
};

var getTopUsers = edge.func('sql', params);

var Article = function(conf){
	conf = conf || {};
}

Article.prototype.save = function(data,callback){
/*    this.model.findOneAndUpdate({
        title:data.title,
        slug:data.slug
    },data,{upsert:true}).exec(function(err,doc){
        callback(doc);
    });*/
}

Article.prototype.get = function(query,callback){

	/*res.writeHead(200, { 'Content-Type': 'text/html' });*/
 
    getTopUsers(null, function (error, result) {
    	callback(error, result)

       /* if (error) { logError(error, res); return; }
        if (result) {
            res.write(result);
            res.write("<ul>");
            result.forEach(function(user) {
                res.write("<li>" + user.FirstName + " " + user.LastName + ": " + user.Email + "</li>");
            });
            res.end("</ul>");
        }
        else {
        }*/
    });

/*	this.model.find(query).exec(function(err,doc){
		callback(doc)
	})*/
}

module.exports = Article; 