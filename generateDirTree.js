const fs = require("fs");
const path = require("path");

// Directories to exclude
const excludeDirs = ["node_modules", ".git", "build"]; // Add any directories to exclude

/**
 * Recursively generates a directory tree as a string
 * @param {string} dirPath - The root directory to start
 * @param {string} indent - Indentation for the tree structure
 * @returns {string} - Tree structure as a string
 */
function generateTree(dirPath, indent = "") {
  let tree = "";

  try {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);
      const isDirectory = fs.lstatSync(fullPath).isDirectory();

      if (excludeDirs.includes(item)) {
        return; // Skip excluded directories
      }

      tree += `${indent}${isDirectory ? "📁" : "📄"} ${item}\n`;

      if (isDirectory) {
        tree += generateTree(fullPath, `${indent}  `); // Recurse into subdirectories
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }

  return tree;
}

// Start from the current working directory or specify a root
const rootDir = process.cwd(); // Change this to a specific path if needed
const directoryTree = generateTree(rootDir);

// Write the output to a file or print to console
const outputPath = path.join(rootDir, "directoryTree.txt");
fs.writeFileSync(outputPath, directoryTree);

console.log(`Directory tree generated and saved to: ${outputPath}`);
