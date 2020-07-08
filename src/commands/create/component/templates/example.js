
import React, { Component } from 'react'
import Example from '../../src/'

export default class extends Component {
  render () {
    return <div>
        默认调式示例（default），在examples文件夹下添加新的文件夹可创建新的示例
        <Example />
    </div>
  }
}
