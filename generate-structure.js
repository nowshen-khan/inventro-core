import fs from "fs";
import path from "path";

const IGNORE = [
  "node_modules",
  ".git",
  "dist",
  "build",
  ".turbo",
];

function generateTree(dir, prefix = "") {
  const files = fs
    .readdirSync(dir)
    .filter((file) => !IGNORE.includes(file));

  return files
    .map((file, index) => {
      const fullPath = path.join(dir, file);

      const isLast = index === files.length - 1;

      const connector = isLast ? "└── " : "├── ";

      let result = `${prefix}${connector}${file}\n`;

      if (fs.statSync(fullPath).isDirectory()) {
        result += generateTree(
          fullPath,
          prefix + (isLast ? "    " : "│   "),
        );
      }

      return result;
    })
    .join("");
}

const structure = generateTree("./");

fs.writeFileSync(
  "PROJECT_STRUCTURE.txt",
  structure,
);

console.log(
  "Project structure generated successfully!",
);
