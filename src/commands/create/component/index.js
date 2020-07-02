import fs from 'fs'
import Generator from 'yeoman-generator'
import request from 'request-promise'
import execa from 'execa'

export default class extends Generator {

  async prompting() {

    return this.prompt([
      {
        'type': 'input',
        'name': 'projectName',
        'message': '项目名称（Gitlab项目名称）：',
        'validate': value => {
          if (!value.match(/^[a-zA-Z\-\d]+?$/)) {
            return '项目名式不正确, 只能包含大小写字母、数字、中划线'
          }
          return true;
        }
      },
      {
        'type': 'input',
        'name': 'moduleName',
        'message': '组件名 (package.json 中的 name)：',
        'validate': value => {
          if (!value.match(/^[@\/a-z\-\d]+?$/)) {
            return '组件名称格式不正确, 只能包含小写英文、数字、中划线'
          }
          return true;
        }
      },
      {
        'type': 'confirm',
        'name': 'useTypescript',
        'message': '是否使用 typescript：',
        'default': true
      },
      {
        'type': 'list',
        'name': 'cssLanguage',
        'message': '使用的 CSS 语言：',
        'choices': ['css', 'sass', 'less', 'style-components']
      },
    ]).then(promptes => {

      let {
        projectName, moduleName,
        useTypescript, cssLanguage
      } = promptes

      this.promptes = promptes;

      if (!projectName) {
        projectName = moduleName
      }

      this.promptes.projectName = projectName
      this.promptes.useTypescript = useTypescript
      this.promptes.cssLanguage = cssLanguage
    })
  }

  async writing() {
    let { projectName } = this.promptes

    // 创建目录
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName)
    } else {
      // 文件夹中有文件，提示错误
      let files = fs.readdirSync(projectName).filter(filename => filename !== '.git')
      if (files.length) {
        return console.log(`fatal: destination path '${projectName}' already exists and is not an empty directory.\n`)
      }
    }
    // 创建、安装
    this._copyTemplateFiles()
  }

  install() {
    process.chdir(`${this.promptes.projectName}`)
    this.npmInstall()
  }

  /*
  * 封装copy（API），减少代码量
  * 28原则：百分之20%的代码解决80%的功能
  * 函数名前面添加下滑线，告知Yeoman不自定执行改函数
  */
  async _copyTemplateFiles() {
    let copies = [
      ['gitignore', '.gitignore'], // npm publish，会忽略 .gitignore 文件
      ['index.js', 'src/index.js'],
      [`package-react.json`, 'package.json'], // 根据不同的 React 版本选择 package.json
      ['npmignore', '.npmignore'],
      ['README.md']
    ]

    this._private_copies(copies)
  }

  _private_copies(copyJobs = []) {
    copyJobs.forEach(([tplFilePath, destFilePath]) => {
      if (!destFilePath) {
        destFilePath = tplFilePath
      }
      if (!tplFilePath) throw new Error('tplFilePath is none')
      if (!destFilePath) throw new Error('destFilePath is none')

      // 改变路径为项目目录下
      // if (this.promptes.isSyncGitlab) {
      destFilePath = `${this.promptes.projectName}/${destFilePath}`
      // }
      this.fs.copyTpl(
        this.templatePath(tplFilePath),
        this.destinationPath(`${this.options.contextRoot}/${destFilePath}`),
        this.promptes
      )
    })
  }
}
