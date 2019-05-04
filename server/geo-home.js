'use strict';

/**
 * @route /
 *
 * A request for the geo vis.
 *
 * ROUTE CONTRACT
 * ==============
 *
 *
 */
var route = function( req, res ) {

    var self = this;

    self.logger.log('info', 'server' );

    res.render( 'geo', {});

};

module.exports = route;
