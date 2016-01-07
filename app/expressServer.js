var env = process.env.NODE_ENV || 'production',
    express = require('express'),
    swig = require('swig'),
    bodyParser = require('body-parser'),
    middlewares = require('./middlewares/admin'),
    router = require('./website/router'),
    multer  = require('multer');
    var path = require('path');
    var storage = multer.diskStorage({
                      destination: function (req, file, cb) {
                        cb(null, __dirname + '/uploads')
                      },
                      filename: function (req, file, cb) {
                        cb(null, file.originalname)
                      }
                    });

    var upload = multer({ storage: storage })

    
    //Alta de opciones
    var done=false;


var ExpressServer = function(config){
    this.config = config || {};

    this.expressServer = express();

    // middlewares
    this.expressServer.use(bodyParser.urlencoded({extended: true}))
    for (var middleware in middlewares){
        this.expressServer.use(middlewares[middleware]);
    }

    this.expressServer.engine('html', swig.renderFile);
    this.expressServer.set('view engine', 'html');
    this.expressServer.set('views', __dirname + '/website/views/templates');
    swig.setDefaults({varControls:['[[',']]']});

    //////////////////////////////////////////////////////////////

    if(env == 'development'){
        console.log('OK NO HAY CACHE');
        this.expressServer.set('view cache', false);
        swig.setDefaults({cache: false, varControls:['[[',']]']});
    }

    for (var controller in router){
        for (var funcionalidad in router[controller].prototype){
            var method = funcionalidad.split('_')[0];
            var entorno = funcionalidad.split('_')[1];
            var data = funcionalidad.split('_')[2];
            data = (method == 'get' && data !== undefined) ? ':data' : '';
            var url = '/api/' + controller + '/' + entorno + '/' + data;
            this.router(controller,funcionalidad,method,url);
        }
    } 

    //Servimos el archivo angular
    this.expressServer.get('/upload', function(req, res){
        res.write('Hola, Mundo!');
        res.end();
    });

    // //Configuracion de MULTER

    this.expressServer.get('/uploader',function(req,res){
         res.sendfile('app/static/uploader.htm');
    });

  this.expressServer.get('/success',function(req,res){
         res.sendfile('app/static/success.htm');
    });

    // this.expressServer.post('/api/photo',function(req,res){
    //     upload(req,res,function(err) {
    //         if(err) {
    //             return res.end("Error uploading file.");
    //         }
    //         res.end("File is uploaded");
    //     });
    // });

    this.expressServer.post('/profile', upload.single('avatar'), function (req, res, next) {
      // req.file is the `avatar` file 
      // req.body will hold the text fields, if there were any 
      var x = req.file;
      res.writeHead(301,{Location: '/success'});
      res.end();
    })

    //Servimos el archivo angular
    this.expressServer.get('*', function(req, res){
        res.sendfile('app/static/index.htm');
    });
};

ExpressServer.prototype.router = function(controller,funcionalidad,method,url){
    console.log(url);
    var cnn = this.config.connection;

    this.expressServer[method](url, function(req,res,next){
       var conf = {
           'funcionalidad':funcionalidad,
           'req': req,
           'res': res,
           'next': next,
           'connection' : cnn
       } 
       var Controller = new router[controller](conf);
       Controller.response();
    });
}
module.exports = ExpressServer;