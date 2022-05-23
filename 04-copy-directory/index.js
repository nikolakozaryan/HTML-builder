const { mkdir, readdir, copyFile, rm } = require("fs/promises");
const path = require("path");

const src = path.join(__dirname, "files");
const dst = path.join(__dirname, "files-copy");

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true }, (err) => {
    if (err) console.log(err.message);
  });

  const [dstFiles, srcFiles] = [
    await readdir(dst, (err) => {
      if (err) throw err;
    }),
    await readdir(src, { withFileTypes: true }, (err) => {
      if (err) throw err;
    }),
  ];

  for (let file of dstFiles) {
    await rm(path.join(dst, file), { recursive: true });
  }

  for (let file of srcFiles) {
    const paths = [path.join(src, file.name), path.join(dst, file.name)];
    file.isDirectory() ? await copyDir(...paths) : await copyFile(...paths);
  }
}

copyDir(src, dst);
