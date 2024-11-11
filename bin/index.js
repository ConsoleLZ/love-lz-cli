#!/usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const gitClone = require("git-clone");
const ora = require("ora");
// 项目列表
const projectList = require("./config.ts")
const choices = []
for(let key in projectList){
  choices.push({
    name: key,
    value: key
  })
}
// 首行提示
program.name("lz-cli").usage("<command> [options]");

console.log(chalk.black.bgWhite.bold('🎉🎉 欢迎使用小哲的个人脚手架'));

// 添加命令
program
  .command("create <app-name>")
  .description("创建一个项目")
  .action(async appName => {
    const targetPath = path.join(process.cwd(), appName);
    if (fs.existsSync(targetPath)) {
      const answer = await inquirer.prompt([
        {
          message: "项目已存在，是否覆盖？",
          type: "confirm",
          name: "isOver",
          default: "false",
        },
      ]);
      if (answer.isOver) {
        fs.remove(targetPath);
        console.log(chalk.blue("移除成功"));
      } else {
        return;
      }
    }
    // 新建项目
    const result = await inquirer.prompt([
      {
        type: "list",
        message: "选择要创建的项目",
        default: "vueRouter",
        name: "framework",
        choices
      }
    ]);
    const key = result.framework
    const gitUrl = projectList[key];
    const spinner = ora("正在下载模板...").start();
    gitClone(gitUrl, appName, { checkout: "main" }, () => {
      spinner.succeed(chalk.blue.bold("项目创建成功"));
      console.log("");
      console.log(chalk.blue.bold(figlet.textSync("lz-cli", {})));
      console.log(chalk.blue("感谢您的使用!"));
    });
  });

// 版本号
program.version(`${require("../package.json").version}`);

// 监听 --help
program.on("--help", () => {
  console.log(chalk.green.bold(figlet.textSync("lz-cli", {})));
});

program.parse(program.argv);

