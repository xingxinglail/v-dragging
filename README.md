<h1 align="center">v-dragging</h1>

<div align="center">

<p>一个 vue 拖放排序组件。</p>

[![Build Status](https://user-gold-cdn.xitu.io/2019/11/30/16ebcd9537099269?w=90&h=20&f=svg&s=724)](https://www.travis-ci.org/xingxinglail/v-dragging)
[![codecov](https://user-gold-cdn.xitu.io/2019/11/30/16ebcd9527eb4559?w=60&h=60&f=svg&s=2274)](https://codecov.io/gh/xingxinglail/v-dragging)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

</div>

<div align="center">

![效果图](https://github.com/xingxinglail/v-dragging/blob/master/gif.gif)

</div>

> [WxP UI 小程序插件](https://github.com/singletouch/wx-plugin) Drag 组件的 Vue 版本。

[在线例子](https://xingxinglail.github.io/v-dragging/example/)

## ✨ 特性

- 没有依赖关系
- 可以拖拽排序
- 支持 PC、移动端
- 可定义句柄控制是否可以被拖拽

## 🖥 支持环境

- 现代浏览器和 IE9 及以上。
- 支持服务端渲染。


## 📦 安装

```bash
npm install v-dragging
```

```bash
yarn add v-dragging
```

## 🔨 示例

```js
import Drag from 'v-dragging';
Vue.component('Drag', Drag)
```

```vue
<drag
    handle="draggable"
    :value="list"
    :columns="columns"
    @choose="choose"
    @un-choose="unChoose"
    @start="start"
    @end="end"
    @update="update">
    <div class="item"
         v-for="item in list"
         :class="item.disabled ? 'disabled' : 'draggable'"
         :key="item.name">
        <div class="inner">
            <img :src="item.img" width="100%">
        </div>
    </div>
</drag>
```

## ⌨️ 本地开发

```bash
$ git clone git@github.com:xingxinglail/v-dragging.git
$ cd v-dragging
$ yarn install
$ yarn run docs:dev
```
