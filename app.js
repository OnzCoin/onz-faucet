const fs = require('fs');
var express = require('express'),
    config = require('./config.json').configuration,
    development = config.development,
    production = config.production,
    redis = require('redis'),
    client = redis.createClient(
        config.redis.port,
        config.redis.host
    ),
    async = require('async'),
    _ = require('underscore'),
    path = require('path'),
    api = require('./api'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override');

var app = express();

client.debug_mode = true;

app.set('strict routing', true);
app.set("onz address", "http://" + config.onz.host + ":" + config.onz.port);

if (config.onz.port == 11000) {
    app.set("onz network", 'mainnet');
} else {
    app.set("onz network", 'testnet');
}

app.locals.host = config.onz.host;
app.locals.port = config.onz.port;
app.locals.nethash = config.onz.nethash;
app.locals.broadhash = config.onz.broadhash;
app.locals.onzVersion = config.onz.version;
app.locals.onzMinVersion = config.onz.minVersion;
app.locals.passphrase = config.onz.passphrase;
app.locals.address = config.onz.address;
app.locals.amountToSend = config.amount;
app.locals.cacheTTL = config.cacheTTL;

app.use(function (req, res, next) {
    req.onz = app.get("onz address");
    return next();
});

app.use(function (req, res, next) {
    req.fixedPoint = config.fixedPoint;
    next();
});

app.use(function (req, res, next) {
    req.redis = client;
    return next();
});


app.use(express.logger());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.compress());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

if (app.get('env') === 'development') {
    app.set("host", development.host);
    app.set("port", development.port);
    app.locals.captcha = development.captcha;
}

if (app.get('env') === 'production') {
    app.set("host", production.host);
    app.set("port", production.port);
    app.locals.captcha = production.captcha;
}

api(app);
app.listen(app.get('port'), app.get('host'), function (err) {
    if (err) {
        console.log(err);
    } else {
        if (config.ssl.enable) {
            const privateKey = fs.readFileSync(config.ssl.sslkey);
            const certificate = fs.readFileSync(config.ssl.sslcert);
            const https = require('https').createServer({
                key: privateKey,
                cert: certificate,
                ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:' + 'ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:' + '!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
            }, app);

            https.listen(config.ssl.sslport, config.ssl.sslhost, error => {
                if (!err) {
                    console.log("Server (SSL) started at " + config.ssl.sslhost + ":" + config.ssl.sslport);
                } else {
                    console.log("Server (SSL) start error");
                }
            });
        }
    }
});
