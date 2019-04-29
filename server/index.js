'use strict';

require('express-namespace');
require('twig');

const path = require('path');
const express = require('express');


const Logger = require('./logger.js');

const homeUIRoute = require('./ui-home.js');

function Server( config ) {
    if ( !(this instanceof Server) ) { return new Server( config ); }
    var self = this;

    self.config     = config;
    self.app        = express();
    self.logger     = new Logger();

    self.app.set('views', path.join(__dirname, 'templates') );
    self.app.set('view engine', 'twig');
    self.app.set('twig_options', { strict_variables: false });

    self.app.use('/static', express.static( path.join(__dirname, 'static') ) );

    // NOTE: UI Routes here.
    self.app.get('/', homeUIRoute.bind( self ) );


}

/**
 * Start the server!
 */
Server.prototype.start = function() {
    var self = this;

    self.app.listen( self.config.port, function() {

        self.logger.log( 'info', 'server', `started on ${ self.config.port }.` );

    });

};


module.exports = Server;
