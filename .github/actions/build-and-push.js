const fs = require("fs");
const path = require("path");
const axios = require("axios");
const core = require("@actions/core");
const github = require("@actions/github");
const { execSync } = require("child_process");
const JavaScriptObfuscator = require("javascript-obfuscator");


class RUN {
  constructor() {
    this.branchName = process.env.INPUT_BRANCH_NAME || "gh-pages";
    this.accessToken = process.env.GITHUB_TOCKEN || undefined;
    this.owner = process.env.OWNER || "Ajayos";
    this.repo = process.env.REPO || "keerthana-plugins";
    
  }

  async obfuscateFilesInFolder(folderPath) {
    const items = await fs.promises.readdir(folderPath);

    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = await fs.promises.stat(itemPath);

      if (stats.isDirectory()) {
        await this.obfuscateFilesInFolder(itemPath);
      } else if (stats.isFile() && path.extname(itemPath) === ".js") {
        await this.obfuscateAndSaveFile(itemPath);
      }
    }
  }

  async obfuscateAndSaveFile(filePath) {
    try {
      const originalCode = fs.readFileSync(filePath, "utf8");

      const obfuscatedCode = JavaScriptObfuscator.obfuscate(
        originalCode,
        {}
      ).getObfuscatedCode();

      const ajayComment = "// Code by Ajay o s\n";
      const updatedCode = ajayComment + obfuscatedCode;

      fs.writeFileSync(filePath, updatedCode, "utf8");

      console.log(`Obfuscated and updated: ${filePath}`);
    } catch (error) {
      console.error(`Error obfuscating ${filePath}:`, error.message);
    }
  }

  async generateIndexHTML(directoryPath, items) {
    const formattedItems = await Promise.all(
      items.map(async (item) => {
        const formattedDate = await this.getFormattedDate(item.date);
        const formattedSize =
          item.ext === "dir" ? "" : this.formatBytes(item.size);
        const icon =
          item.ext !== "dir" ? (item.ext === "js" ? "js" : "file") : "dir";
        return {
          ...item,
          formattedDate,
          formattedSize,
          icon,
        };
      })
    );

    const htmlContent = `
  <!DOCTYPE html>
  <html>
  
  <head>
  <title>Index of ~/${directoryPath}</title>
  <link rel="icon" href="https://github.com/Keerthana-bot.png">
      <link rel="stylesheet" href="https://ajay-o-s.github.io/.github/CSS/Plugin.css">
  </head>
        
  <body>

  <h1>Index of ~/${directoryPath}</h1>

  <table>
      <thead>
          <tr>
              <th>Name</th>
              <th></th>
              <th>Size</th>
              <th></th>
              <th>Date</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <td><a id="parentDirLink" class="icon up"></a><a href="..">..</a></td>
              <td> - </td>
              <td></td>
              <td> - </td>
              <td></td>
          </tr>
          ${formattedItems
            .filter(
              (item) =>
                item.ext !== "html" &&
                item.ext !== "htm" &&
                item.ext !== "md" &&
                !item.name.startsWith(".")
            )
            .sort((a, b) => (a.ext === "dir" ? -1 : 1))
            .map(
              (item) =>
                `
            <tr>
                <td><a id="parentDirLink" class="icon ${item.icon}"></a><a href="${item.name}">${item.name}</a></td>
                <td> - </td>
                <td>${item.formattedSize}</td>
                <td> - </td>
                <td>${item.formattedDate}</td>
            </tr>
            `
            )
            .join("\n")}
            </tbody>
            </table>
        </body>
        </html>
  `;
    return htmlContent;
  }

  async formatBytes(bytes) {
    const gbThreshold = 1024 * 1024 * 1024; // 1 GB
    const mbThreshold = 1024 * 1024; // 1 MB
    const kbThreshold = 1024; // 1 KB

    if (bytes >= gbThreshold) {
      return (bytes / gbThreshold).toFixed(2) + " GB";
    } else if (bytes >= mbThreshold) {
      return (bytes / mbThreshold).toFixed(2) + " MB";
    } else if (bytes >= kbThreshold) {
      return (bytes / kbThreshold).toFixed(2) + " KB";
    } else {
      return bytes + " bytes";
    }
  }

  async getFormattedDate(timestamp) {
    const date = new Date(timestamp);

    const month = date.toLocaleString("en-US", { month: "numeric" });
    const day = date.toLocaleString("en-US", { day: "numeric" });
    const year = date.toLocaleString("en-US", { year: "2-digit" });

    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });

    return `${month}/${day}/${year}, ${time}`;
  }

  async getItemInfo(itemPath) {
    const stats = await fs.promises.stat(itemPath);
    const itemInfo = {
      name: path.basename(itemPath),
      size: stats.isFile() ? stats.size : "", // Set size to empty string for directories
      date: stats.birthtime,
    };

    if (stats.isFile()) {
      itemInfo.ext = path.extname(itemPath).slice(1);

      try {
        const response = await axios.get(
          `https://api.github.com/repos/${this.owner}/${this.repo}/commits`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            params: {
              path: path.relative(__dirname, itemPath),
            },
          }
        );

        if (response.data.length > 0) {
          const commitDate = new Date(response.data[0].commit.committer.date);
          itemInfo.date = commitDate;
        } else {
          // console.log(`No commits found for ${itemPath}`);
        }
      } catch (error) {
        throw error;
      }
    } else {
      itemInfo.ext = "dir";
    }

    return itemInfo;
  }

  async createIndexFile(directoryPath) {
    const items = await fs.promises.readdir(directoryPath);
    const itemObjects = [];
    var path_ = directoryPath;

    for (const item of items) {
      if (item !== "node_modules" && item !== ".git") {
        const itemPath = path.join(directoryPath, item);
        const itemInfo = await this.getItemInfo(itemPath);

        itemObjects.push(itemInfo);

        if (fs.statSync(itemPath).isDirectory()) {
          await this.createIndexFile(itemPath);
        }
      }
    }

    if (directoryPath === "./") {
      path_ = "";
    } else {
      path_ = directoryPath.replace(/\\/g, "/");
    }

    const htmlContent = await this.generateIndexHTML(path_, itemObjects);
    const indexPath = path.join(directoryPath, "index.html");
    await fs.promises.writeFile(indexPath, htmlContent, "utf8");
    console.log(`Index file created: ${indexPath}`);
  }

  async push() {
    try {
      // Configure Git user identity locally
      execSync('git config user.email "actions@github.com"');
      execSync('git config user.name "GitHub Actions"');

      execSync(`git checkout -b ${this.branchName}`);

      // Commit and push the obfuscated code to the new branch
      execSync(`git add Public/`);
      execSync(`git commit -m "UPDATE code"`);
      execSync(`git push origin ${this.branchName}`);
      console.log("complete.");
    } catch (error) {
      console.error(error.message);
    //   process.exit(1);
    }
  }
}


const runfunction = new RUN();
runfunction.obfuscateFilesInFolder("./")
runfunction.createIndexFile("./")
// runfunction.push()
