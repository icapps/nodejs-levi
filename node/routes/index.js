var keystone = require('keystone'),
    _ = require('lodash'),
    importRoutes = keystone.importer(__dirname),
    express = require('express'),
    User = keystone.list('User'),
    pkg = require('../../package.json'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path');

// Import Route Controllers
var routes = {
    api: importRoutes('./api')
};

// Cors
keystone.pre('routes', function (req, res, next) {
    var origin = '*'; // TODO
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

exports = module.exports = function (app) {

    var angularAppDirectory = process.env.NODE_ENV === 'production' ? path.join(__dirname, '/../../build/app') : path.join(__dirname, '/../../app');

    // Set static directory
    app.use(express.static(angularAppDirectory, {index: false}));

    // Set the Angular app
    app.get('/', function (req, res) {
        var html = fs.readFileSync(angularAppDirectory + '/index.html', 'utf8'),
            cheerioSelector = cheerio.load(html),
            spObject = '<script>window.levi = ' + JSON.stringify({
                    baseUrl: process.env.BASE_URL,
                    version: pkg.version
                }) + '</script>';

        cheerioSelector('head').append(spObject);
        res.send(cheerioSelector.html());
    });
};