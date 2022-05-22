const path = require("path");
const fsPromises = require("fs/promises");
const fs = require("fs");

const [src, dst] = [
  path.join(__dirname, "styles"),
  path.join(__dirname, "project-dist", "bundle.css"),
];

async function createBundle(src, dst) {
  const output = fs.createWriteStream(dst, (err) => {
    if (err) console.log(err.message);
  });

  const files = await fsPromises.readdir(
    src,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    }
  );

  for (let file of files) {
    const pathToFile = path.join(src, file.name);
    if (file.isFile() && path.parse(pathToFile).ext === ".css") {
      const fileData = fs.createReadStream(pathToFile, "utf-8");
      fileData.pipe(output);
    }
  }
}

createBundle(src, dst);
