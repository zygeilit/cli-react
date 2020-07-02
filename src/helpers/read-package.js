
import fs from 'fs'

export default class ReadPackage {

  constructor(contextRoot) {
    this.contextRoot = contextRoot || process.cwd()
    this.packInfo = this.getPackageInfo()
  }

  get(key) {
    return this.packInfo[key]
  }

  toJSON() {
    return this.packInfo
  }

  toString() {
    return JSON.stringify(this.packInfo)
  }

  getSafeName() {
    return (this.packInfo.name || '').replace(/@/ig, '').replace(/\//ig, '-')
  }

  getPackageInfo() {
    return fs.existsSync(`${this.contextRoot}/package.json`) && require(`${this.contextRoot}/package.json`) || {}
  }
}
