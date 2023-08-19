const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { execSync } = require('child_process');

async function run() {
  try {
    const branchName = process.env.INPUT_BRANCH_NAME || 'obfuscated-code';
    const inputFilePath = process.env.INPUT_INPUT_FILE || 'index.js';
    const outputFilePath = process.env.INPUT_OUTPUT_FILE || 'obfuscated.js';

    // Read the JavaScript code from the input file
    const originalCode = fs.readFileSync(inputFilePath, 'utf8');

    // Obfuscate the JavaScript code
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(originalCode, {
      // Obfuscation options (add your desired options here)
    }).getObfuscatedCode();

    // Write the obfuscated code to the output file
    fs.writeFileSync(outputFilePath, obfuscatedCode, 'utf8');

    // Configure Git user identity locally
    execSync('git config user.email "Ajay o s"');
    execSync('git config user.name "actions@github.com"');

    // Create a new branch
    const baseRef = process.env.GITHUB_REF.split('/')[2];
    const ref = `refs/heads/${branchName}`;
    execSync(`git checkout -b ${branchName}`);

    // Commit and push the obfuscated code to the new branch
    execSync(`git add ${outputFilePath}`);
    execSync(`git commit -m "Obfuscated JavaScript code"`);
    execSync(`git push origin ${branchName}`);

    console.log('Obfuscation complete.');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

run();