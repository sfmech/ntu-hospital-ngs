"use strict";

const shell = require("shelljs");

//shell.cd('../frontend');
//shell.exec('npm run build');
//shell.cd('../backend');
shell.exec('cross-env NODE_ENV=production nest start');