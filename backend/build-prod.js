"use strict";

const shell = require("shelljs");

//shell.cd('../frontend');
//shell.exec('npm run build');
shell.exec('ln -s /home/pindel/Data/ /home/pindel/ntu-hospital-ngs/frontend/build/file');
shell.cd('../backend');
shell.exec('cross-env NODE_ENV=production nest start');
