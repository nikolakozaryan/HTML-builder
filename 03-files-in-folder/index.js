const { stat } = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const secretFolderPath = path.join(__dirname, "secret-folder");

(async function () {
  const files = (await readdir(secretFolderPath, { withFileTypes: true })).filter(item => !item.isDirectory());

  files.forEach((file) => {
    const pathToFile = path.join(secretFolderPath, file.name);

    stat(pathToFile, (err, stats) => {
      if (err) console.log(err.message);
      console.log(`${path.parse(pathToFile).name} - ${path.parse(pathToFile).ext.slice(1)} - ${(stats.size/1024).toFixed(2)}kb`);
    });    
  });
})();
