#!/usr/bin/env node
const params = require('commander')
const { promisify } = require('util')
const asyncFiglet = promisify(require('figlet'))
const chalk = require('chalk')
const inquirer = require('inquirer')
const init = require('./init')
const figlet = require('figlet')

// 打印日志
const log = (content) => {
  console.log(chalk.green(content))
}

// 版本
params.version('1.0.0')
// name参数
params.option('-n, --name <name>', 'output name')

params.on('--help', function () {
  console.log(
    '\r\n' +
      figlet.textSync('xmllein-cli', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 120,
        whitespaceBreak: true,
      })
  )
})

// 打印logo
const printLogo = async () => {
  let data = await asyncFiglet('xmllein-cli')
  log(data)
}

// 创建项目命令
params
  .command('create <projectName>')
  .description('创建项目')
  .action(async (projectName) => {
    // 打印logo
    await printLogo()
    log('准备创建项目....')
    // 命令行交互
    let answer = await inquirer.prompt([
      {
        name: 'language',
        type: 'list',
        message: '请选择开发语言',
        choices: ['JavaScript', 'TypeScript'],
      },
    ])

    if (answer.language === 'JavaScript') {
      log('创建JavaScript项目')
      init(projectName)
    } else {
      log('创建TypeScript项目')
    }
  })

// 解析参数
params.parse(process.argv)
