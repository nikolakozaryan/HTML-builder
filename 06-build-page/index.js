const fs = require("fs");
const path = require("path");
const { mkdir, readdir, readFile, copyFile, rm, writeFile } = require("fs/promises");

const corePath = path.join(__dirname, "project-dist"),
  assetsSrcPath = path.join(__dirname, "assets"),
  assetsDstPath = path.join(corePath, "assets"),
  styleSrcPath = path.join(__dirname, "styles"),
  styleDstPath = path.join(corePath, "style.css"),
  templateSrcPath = path.join(__dirname, "template.html"),
  htmlDstPath = path.join(corePath, "index.html"),
  componentsSrcPath = path.join(__dirname, "components");

async function createDir(dst) {
  await mkdir(dst, { recursive: true }, (err) => {
    if (err) console.log(err.message);
  });

  const dstFiles = await readdir(dst, (err) => {
    if (err) throw err;
  });

  for (let file of dstFiles) {
    await rm(path.join(dst, file), { recursive: true });
  }
}

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

async function createStyleBundle(src, dst) {
  const output = fs.createWriteStream(dst, (err) => {
    if (err) console.log(err.message);
  });

  const files = await readdir(src, { withFileTypes: true }, (err) => {
    if (err) throw err;
  });

  for (let file of files) {
    const pathToFile = path.join(src, file.name);
    if (file.isFile() && path.parse(pathToFile).ext === ".css") {
      const fileData = fs.createReadStream(pathToFile, "utf-8");
      fileData.pipe(output);
    }
  }
}

async function createMarkup(templateSrc, componentsSrc, dst) {
  let markup = await readFile(templateSrc, "utf-8");
  let components = await readdir(componentsSrc, { withFileTypes: true });

  components = components.filter(
    (component) =>
      path.parse(path.join(componentsSrc, `${component.name}`)).ext === ".html"
  );

  for (let component of components) {
    const pathToComponent = path.join(componentsSrc, `${component.name}`);
    const regExp = new RegExp(`{{${path.parse(pathToComponent).name}}}`, "g");
    const componentContent = await readFile(pathToComponent, "utf-8");

    markup = markup.replace(regExp, componentContent);
  }

  writeFile(dst, markup);
}

async function createBundle() {
  await createDir(corePath);
  await copyDir(assetsSrcPath, assetsDstPath);
  await createStyleBundle(styleSrcPath, styleDstPath);
  await createMarkup(templateSrcPath, componentsSrcPath, htmlDstPath);
}

createBundle();
