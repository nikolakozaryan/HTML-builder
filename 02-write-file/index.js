const path = require("path");
const { readdir, appendFile, writeFile } = require("fs");
const { stdin: input, stdout: output, exit } = process;

const resultPath = path.join(__dirname, "result.txt");

output.write("Hello, your input will be saved in result.txt.\n");
output.write("To stop the process input 'exit' or press ctrl+c.\n");

readdir(__dirname, (err, files) => {
  if (err) console.log(err.message);
  if (!files.includes("result.txt")) {
    writeFile(resultPath, "", (err) => {
      if (err) console.log(err.message);
    });
  }
});

input.on("data", (data) => {
  if (data.toString().trim() === "exit") exit();
  appendFile(resultPath, data, (err) => {
    if (err) console.log(err.message);
  });
});

process.on("SIGINT", exit);
process.on("exit", () => console.log("Goodbye!"));