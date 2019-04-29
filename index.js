"use strict";

var config = require("./package.json");

const Server = require('./server');

const server = new Server( config );

server.start();
