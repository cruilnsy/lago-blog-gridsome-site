# 任务二：静态站点生成

# Gridsome

## Gridsome 介绍

### 什么是静态网站生成器

- 静态网站生成器是使用一系列配置、模板及数据，生成静态HTML文件及相关资源的工具。
- 这个功能也叫预渲染
- 生成的网站不需要类似PHP这样的服务器
- 只需要放到支持静态资源的WEB Server 或 CDN 上即可运行

### 静态网站的好处

- 省钱：不需要专业的服务器，只要能托管静态文件的空间即可
- 快速：不经过后端服务器的处理，只传输内容
- 安全：没有后端程序的执行，自然会更安全

### 常见的静态网站生成器

- Jekyll (Ruby)
- Hexo (Node)
- Hugo (Golang)
- Gatsby (Node/React)
- Gridsome (Node/Vue)
- 另外，Next.js, Nuxt.js 也能生成静态网站，但是它们更多被认为是 SSR （服务端渲染）框架。

### Gridsome 是什么

一个免费、开源、基于 Vue.js 技术栈的静态网站生成器

GitHub 仓库：https://github.com/gridsome/gridsome

官网：https://gridsome.org/

- Gridsome 是由Vue.js驱动的Jamstack框架，用于构建默认情况下快速生成的静态生成的网站和应用。
- Gridsome是Vue提供支持的静态站点生成器，用于为任何无头CMS，本地文件或API构建可用于CDN的网站
- 使用Vue.js，webpack和Node.js等现代工具构建网站。通过npm进行热重载并访问任何软件包，并使用自动前缀在您喜欢的预处理器（如Sass或Less）中编写CSS。
- 基于 Vue.js 的 Jamstack 框架
- Gridsome 使开发人员可以轻松构建默认情况下快速生成的静态生成的网站和应用程序
- Gridsome允许在内容里面引用任何CMS或数据源。

从WordPress，Contentful或任何其他无头CMS或API中提取数据，并在组件和页面中使用GraphQL访问它。

### 什么是 Jamstack

Gridsome是一个Jamstack框架。 Jamstack使您可以通过预渲染文件并直接从CDN直接提供文件来构建快速安全的站点和应用程序，而无需管理或运行Web服务器。[Learn more about the Jamstack](https://gridsome.org/docs/jamstack).

- 这类静态网站生成器还有个漂亮的名字叫 JAMStack
- JAMStack 的 JAM 是 JavaScript, API 和 Markup 的首字母组合
- 本质上是一种胖前端，通过调用各种 API 来实现更多的功能
- 其实也是一种前后端的模式，只不过离得比较开，甚至前后端来自多个不同的厂商

![Image of task01-01]
(./task01-01.png)

### 静态应用的使用场景

不适合有大量路由页面的应用

不适合有大量动态内容的应用

### Gridsome学习建议

需要有一定的Vue 基础。如有基础，看过文档，只会觉得它比 Vue 本身更简单一些。

## 创建 Gridsome 项目

安装过程中，会有安装个包叫 lovell/sharp，此包用来处理压缩图片等。sharp 包含一些 C++文件，所以安装时要编译（国内需要淘宝镜像）。其中包含依赖包 libvips 比较大。sharp 的编译环境是 node-gyp ([https://github.com/nodejs/node-gyp](https://github.com/nodejs/node-gyp))。

```jsx
// https://gridsome.org/docs/#how-to-install
// npm 不太好用
$ npm install --global @gridsome/cli
// 使用 yarn
$ yarn global add @gridsome/cli
$ gridsome create my-gridsome-site
$ cd my-gridsome-site

$ npm gridsome develop
$ npm run develop

// build
$ gridsome build
// 产生 dist/

// 部署: 可以把构建结果 `dist` 放到任何 Web 服务器中进行部署。
$ npm i -g serve
$ serve dist

// Gridsome 会把每个路由文件构建为独立的 HTML 页面。
// 部署: 或者可以部署到其它第三方托管平台：https://gridsome.org/docs/deployment/。
// 部署: 或是自己的服务器，都可以！

// 另外 fix npm global
$ npm config get prefix
// 默认是 /usr/local，如果不是这个路径，重新指回这个路径
$ npm config set prefix /usr/local
```

## 项目配置

[https://gridsome.org/docs/config/](https://gridsome.org/docs/config/)

开发过程中修改配置需要重启服务

### Pages  页面

[https://gridsome.org/docs/pages/](https://gridsome.org/docs/pages/)

页面负责在URL上显示您的数据。每个页面将静态生成，并具有自己的带有标记的index.html文件。

在Gridsome中创建页面有两种选择：

- 基于 pages/ 文件组件
- 使用 Pages API 以编程方式创建页面 （gridsome.server.js）

动态路由 [https://gridsome.org/docs/dynamic-routing/](https://gridsome.org/docs/dynamic-routing/)

- 基于 pages/ 文件组件 (/user/[id].vue)
- 使用 Pages API 以编程方式创建页面 （gridsome.server.js）

```jsx
module.exports = function (api) {
  api.createPages(({ createPage }) => {
    createPage({
      path: '/my-page',
      component: './src/templates/MyPage.vue'
    }),
		createPage({
      path: '/my-user/:id(\\d+)',
      component: './src/templates/MyUser.vue'
    })
  })
}
```

Page meta info

```jsx
<script>
export default {
    name: 'FooPage',
    meta: [
      { name: 'author', content: 'John Doe' }
    ]
}
</script>
```

## 添加集合 Collection

接口数据或者动态数据也能预渲染到页面中，生成静态页，就 会用到 collection。

```jsx
// gridsome.server.js
const axios = require('axios')

module.exports = function (api) {
  api.loadSource(async actions => {
    const collection = actions.addCollection('Post')

    const { data } = await axios.get('https://api.example.com/posts')

    for (const item of data) {
      collection.addNode({
        id: item.id,
        title: item.title,
        content: item.content
      })
    }
  })
}
```

查询数据 GraphQL

[http://localhost:8080/___explore](http://localhost:8080/___explore)

[https://gridsome.org/docs/querying-data/](https://gridsome.org/docs/querying-data/)

```jsx
<template>
  <div>
    <div v-for="edge in $page.posts.edges" :key="edge.node.id">
      <h2>{{ edge.node.title }}</h2>
    </div>
  </div>
</template>

<page-query>
query {
  posts: allWordPressPost {
    edges {
      node {
        id
        title
      }
    }
  }
}
</page-query>
```

Template for Collection

[https://gridsome.org/docs/templates/](https://gridsome.org/docs/templates/)

## Gridsome 案例

使用模板

[https://github.com/StartBootstrap/startbootstrap-clean-blog](https://github.com/StartBootstrap/startbootstrap-clean-blog)

```jsx
$ git clone https://github.com/cruilnsy/startbootstrap-clean-blog.git --depth=1

// 我们需要的
$ npm i bootstrap
$ npm i @fortawesome/fontawesome-free
```

导入数据

可以使用各种数据format

[https://gridsome.org/docs/fetching-data/](https://gridsome.org/docs/fetching-data/)

使用本地md文件（Markdown）—> gridsome plugins ([https://gridsome.org/plugins/@gridsome/source-filesystem](https://gridsome.org/plugins/@gridsome/source-filesystem))

同时需要安装Markdown的转换器：[https://gridsome.org/plugins/@gridsome/transformer-remark](https://gridsome.org/plugins/@gridsome/transformer-remark)

```jsx
$ npm install @gridsome/source-filesystem
$ npm install @gridsome/transformer-remark

//gridsome.config.js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/**/*.md',
        typeName: 'Post',
      },
    },
  ],
};
```

### Strapi

如果有后台管理会更好

gridsome 结合模板，预渲染模板，不提供后台管理。

Strapi 是有效的后台管理

[https://strapi.io/documentation/v3.x/getting-started/introduction.html](https://strapi.io/documentation/v3.x/getting-started/introduction.html)

```jsx
$ npx create-strapi-app my-project --quickstart
```

**Restful API: CRUD 与权限**

[https://strapi.io/documentation/v3.x/content-api/api-endpoints.html](https://strapi.io/documentation/v3.x/content-api/api-endpoints.html)

权限role: Authenticated 和 Public 用户设置CRUD

[https://strapi.io/documentation/v3.x/plugins/users-permissions.html#login](https://strapi.io/documentation/v3.x/plugins/users-permissions.html#login)

**通过 GraphQL 访问 Strapi**

[https://strapi.io/documentation/v3.x/plugins/graphql.html#usage](https://strapi.io/documentation/v3.x/plugins/graphql.html#usage)

```jsx
// 在 strapi project 文件夹下安装 e.g. my-strapi-project/
// 安装plugin
$ npm run strapi install graphql
$ npm run develop

// http://localhost:1337/graphql

// strapi 下 graphql 查询
# query {
#   posts {
#     id
#     title
#     content
#   }
# }
query  {
  post (id: 1) {
    title
  }
}
```

**Gridsome  有插件可以提取 Strapi 数据（预取）**

[https://gridsome.org/plugins/@gridsome/source-strapi](https://gridsome.org/plugins/@gridsome/source-strapi)

```jsx
// 在 gridsome project 文件夹下安装 e.g. blog-with-gridsome/
$ npm install @gridsome/source-strapi
$ npm run develop

// gridsome.config.js
	plugins: [
    {
      use: '@gridsome/source-strapi',
      options: {
        apiURL: 'http://localhost:1337',
        queryLimit: 1000, // Defaults to 100
        contentTypes: ['post'], // StrapiPost,
        // typeName: 'Strapi',
        singleTypes: ['general'],   // 单个种类，比如博客首页的标题“我的blog”
        // Possibility to login with a Strapi user,
        // when content types are not publicly available (optional).
        // loginData: {
        //   identifier: '',
        //   password: ''
        // }
      }
    }
  ]

// 重启
$ npm run develop

// http://localhost:8080/___explore
// gridsome 下的 strapi 查询format
query {
  allStrapiPost {
    edges {
      node {
        id
        title
        content
      }
    }
  }
}

query {
  strapiPost (id: 2) {
    id
    title
  }
}

// Strapi 加入 singleTypes
// gridsome 不建议使用 id query查询，因为 ID 可能会变
# query {
#   strapiGeneral (id: 1) {
#     title
#   }
# }
// 推荐还是使用多数据查询
query {
  allStrapiGeneral {
    edges {
      node {
        id
        title
        cover {
          url
        }
      }
    }
  }
}
```

**文章列表分页**

[https://gridsome.org/docs/pagination/](https://gridsome.org/docs/pagination/)

```jsx
// directive: @paginate

query ($page: Int) {
  allBlogPost(perPage: 10, page: $page) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        path
      }
    }
  }
}
```

处理 Markdown 格式文件

安装 markdown-it

[https://github.com/markdown-it/markdown-it](https://github.com/markdown-it/markdown-it)

```jsx
$ npm install markdown-it --save
```

## 部署

### Strapi 部署

需要部署的server上有node 和 mysql（任何数据库）。

比如，Amazon EC2 上可以用 Amazon Linux AMI 2018.03.0 (HVM), SSD Volume Type，上面已经有了 MySQL package。

安装 MySQL

```jsx
// Access Amazon EC2 on Terminal
// 到有 .pem key 目录下
$ chmod 400 gridsome-strapi-key.pem
$ ssh -i "gridsome-strapi-key.pem" ec2-user@ec2-54-193-231-43.us-west-1.compute.amazonaws.com
$ sudo su    // change privileges to root user (default user: ec2-user)
$ yum update -y    // package update

// 安装 Mysql
$ yum install mysql-server
// is this OK? Y

$ chkconfig mysqld on   // optional
$ service mysqld start   // reboot

$ mysqladmin -u root password [your_new_pwd]   // update password on your local Mysql server if you want
$ mysql -u root -p   // asscess mysql from root user

// 另外（在 root下access MySQL操作数据库）
$ mysql
mysql> show databases;
mysql> create database blog;
mysql> quit

mysql> UPDATE mysql.user SET Password=PASSWORD('123456') WHERE User='root';
mysql> FLUSH PRIVILEGES;
mysql> select host, user, password from mysql.user;
```

安装 Node

```jsx
// Install node version manager (nvm)
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
$ . ~/.nvm/nvm.sh   // active nvm
$ nvm install node
// test if Node.js is running
$ node -e "console.log('Running Node.js ' + process.version)"
```

安装 git

```jsx
$ sudo yum install git -y
```

安装 Strapi

设置好server环境后，开始装 Strapi。

[https://strapi.io/documentation/v3.x/concepts/configurations.html#database](https://strapi.io/documentation/v3.x/concepts/configurations.html#database)

```jsx
// ./config/database.js
// for MySQL
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'blog'),
        username: env('DATABASE_USERNAME', 'root'),
        password: env('DATABASE_PASSWORD', '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9'),
      },
      options: {},
    },
  },
});

// 上传strapi的代码到github
$ git remote add origin https://github.com/cruilnsy/blog-backend.git
$ git push -u origin main

// 在远程server上，下载 GitHub 上的代码
$ git clone https://github.com/cruilnsy/blog-backend.git
$ npm i

// 注意可能有 node-gyp错误，可以 全局安装 node-gyp
$ npm i -g node-gyp

// 一起准备就绪！
$ npm run build
$ npm run start

// 可以用 pm2
$ npm i -g pm2
$ pm2 start npm -- run start --name blog-backend

```