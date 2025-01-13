<h1 align="center">hexo-custom-rss </h1>
<p>
  <a href="https://www.npmjs.com/package/hexo-custom-rss" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/hexo-custom-rss.svg">
  </a>
  <a href="https://www.npmjs.com/package/hexo-custom-rss" target="_blank">
    <img alt="npm downloads" src="https://img.shields.io/npm/dt/hexo-custom-rss?label=npm%20downloads&color=yellow">
  </a>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/hexo-custom-rss.svg" />
  <a href="https://github.com/CaoMeiYouRen/hexo-custom-rss/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/hexo-custom-rss/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/node/v/hexo-custom-rss" />
  <a href="https://github.com/CaoMeiYouRen/hexo-custom-rss#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/hexo-custom-rss/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/hexo-custom-rss/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/CaoMeiYouRen/hexo-custom-rss?color=yellow" />
  </a>
</p>


> 通过 tag、category 过滤生成的 rss，可自定义路径
>
> Filter the generated RSS through tags and categories, and customize the path

## 🏠 主页

[https://github.com/CaoMeiYouRen/hexo-custom-rss#readme](https://github.com/CaoMeiYouRen/hexo-custom-rss#readme)


## 📦 依赖要求


- node >=18

## 🚀 安装

```sh
npm install hexo-custom-rss
```

## 👨‍💻 使用

**配置**
在 Hexo 配置文件 _config.yml 中添加或修改以下配置：

```yaml
customRss:
  enable: true
  feeds:
    - title: 我的博客 # 标题，默认为博客标题，可在此处修改默认值
      description: 这是我的博客 # 描述，默认为博客描述，可在此处修改默认值
      tags: # 要包含的标签
        - 技术
        - 生活
      categories: # 要包含的分类
        - 编程
      path: rss # rss 文件的路径，必填
      formats: # 要生成的格式。默认值为 ["rss2"]。假设 path 为 rss，则生成的文件为 public/rss.xml、public/rss.atom 和 public/rss.json
        - rss2
        - atom
        - json
      limit: 10 # 要生成的文章数量，默认为 10
      content: true # 是否包含文章内容，默认为 true
      follow_challenge: # 认证 Follow 订阅源，可选，参考 https://follow.is/ 文档
        feedId: your_feed_id
        userId: your_user_id
```

配置完成后，运行 Hexo 生成器：
```sh
hexo generate
```
生成的 RSS 文件将位于 public/rss.xml、public/rss.atom 和 public/rss.json。

**支持的格式**
- RSS 2.0
- Atom
- JSON Feed

## 🛠️ 开发

```sh
npm run dev
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```

## 💾 Commit

```sh
npm run commit
```


## 👤 作者


**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/hexo-custom-rss/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/hexo-custom-rss/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

<a href="https://afdian.com/@CaoMeiYouRen">
  <img src="https://oss.cmyr.dev/images/202306192324870.png" width="312px" height="78px" alt="在爱发电支持我">
</a>


## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/hexo-custom-rss&type=Date)](https://star-history.com/#CaoMeiYouRen/hexo-custom-rss&Date)

## 📝 License

Copyright © 2025 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/hexo-custom-rss/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
