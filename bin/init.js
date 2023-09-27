#!/usr/bin/env node
const { promisify } = require('util')
const ora = require('ora')
const download = promisify(require('download-git-repo'))
const chalk = require('chalk')
const shell = require('shelljs')
const inquirer = require('inquirer')

/**
 *  封装下载的方法
 * @param {string} path
 * @param {string} name
 */
function downloadRepositorie(path, name) {
  return new Promise((resolve, reject) => {
    const spinner = ora('下载模板中....')
    spinner.start()
    download(path, name, { clone: true }, (err) => {
      if (err) {
        // 下载完成
        spinner.fail('下载失败')
        reject(err)
      }

      // 下载完成
      spinner.succeed('下载完成')
      resolve()
    })
  })
}
// 打印日志
const log = (content) => {
  console.log(chalk.green(content))
}

module.exports = async (projectName) => {
  log(`创建项目：${projectName}`)

  // 如果目录存在，提示用户是否覆盖
  if (shell.test('-d', projectName)) {
    let answer = await inquirer.prompt([
      {
        name: 'cover',
        type: 'confirm',
        message: '目录已存在，是否覆盖？',
      },
    ])

    if (answer.cover) {
      // 删除目录
      shell.rm('-rf', projectName)
    } else {
      return
    }
  }
  // 下载模板
  await downloadRepositorie(
    'direct:http://github.com/xmllein/react18.x_mobile_template#main',
    projectName
  )

  // 安装依赖
  log(`
   下载完成，请执行下面命令启动任务：
   =================================
   cd ${projectName}
   yarn install or npm install
   yarn dev or npm run dev
   `)
}
