import { Injectable } from '@nestjs/common';
var cp = require('child_process');

@Injectable()
export class AppService {
  getHello(): string {
    var child = cp.spawn('D:\\INB\\ntu-hospital-ngs\\test.sh');
    child.stdout.on('data', function(data) {
      console.log(data);
    });
    cp.exec('sh D:\\INB\\ntu-hospital-ngs\\test.sh', function(err, stdout, stderr) {
      
      console.log(stdout);
      console.log(stdout);
    });
    return 'Hello World!';
  }
}
