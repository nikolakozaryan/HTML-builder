const fs = require('fs'),
      path = require('path');

const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

input.on('data', chunk => {
    process.stdout.write(chunk);
})