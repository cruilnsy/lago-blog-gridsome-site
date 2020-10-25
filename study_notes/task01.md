# 任务一：搭建自己的 SSR

## 简单搭建Vue-SSR

```jsx
> mkdir vue-ssr
> cd vue-ssr
> npm init -y
> npm i vue vue-server-render

> npm i vue-meta

// 1. server.js

```

## 构建配置

### webpack 配置文件

```jsx
(1) 安装生产依赖
$ npm i vue vue-server-renderer express cross-env

(2) 安装开发依赖
$ npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url-loader file-loader rimraf vue-loader vue-template-compiler friendly-errors-webpack-plugin

(3) 配置文件及打包命令
build/
	|---- webpack.base.config.js
  |---- webpack.client.config.js
  |---- webpack.server.config.js

// webpack.base.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

module.exports= {
	mode: isProd ? 'production' : 'development',
	output: {
		path: resolve('../dist/'),
		publicPath: '/dist/',
		filename: '[name].[chunkhash].js'  
	},
	resolve: {
		alias: {
			// 路径别名，@ 指向 src
			'@': resolve('../src/')    
		},
		// 可以省略的扩展名
		// 当省略扩展名的时候，按照从前往后的顺序依次解析
		extensions: ['.js', '.vue', '.json']  
	},
	devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
	module: {
		rules: [
			// 处理图片资源      
			{
				test: /\.(png|jpg|gif)$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192,
						},          
					},
				],
			},
			// 处理字体资源
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader',
				],
			},
			// 处理 .vue 资源
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			// 处理 CSS 资源
			// 它会应用到普通的 `.css` 文件
			// 以及 `.vue` 文件中的 `<style>` 块      
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			},
			// CSS 预处理器，参考：https://vue-loader.vuejs.org/zh/guide/pre-processors.html
			// 例如处理 Less 资源
			// {
			//   test: /\.less$/,
			//   use: [
			//     'vue-style-loader',
			//     'css-loader',
			//     'less-loader'
			//   ]
			// },
		]
	},
	plugins: [
		newVueLoaderPlugin(),
		newFriendlyErrorsWebpackPlugin()
	]
}

// webpack.client.js
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
	entry: {
		app: './src/entry-client.js'  
	},
	module: {
		rules: [
			// ES6 转 ES5      
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						cacheDirectory: true,
						plugins: ['@babel/plugin-transform-runtime']
					}
				}
			},
		]
	},

	// 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
	// 以便可以在之后正确注入异步 chunk。
	optimization: {
		splitChunks: {
			name: "manifest",
			minChunks: Infinity
		}
	},

	plugins: [
		// 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
		newVueSSRClientPlugin()
	]
})

// webpack.server.config.js
const { merge } = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports=merge(baseConfig, {
	// 将 entry 指向应用程序的 server entry 文件
	entry: './src/entry-server.js',

	// 这允许 webpack 以 Node 适用方式处理模块加载
	// 并且还会在编译 Vue 组件时，
	// 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
	target: 'node',

	output: {
		filename: 'server-bundle.js',
		// 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
		libraryTarget: 'commonjs2'  
	},
	
	// 不打包 node_modules 第三方包，而是保留 require 方式直接加载
	externals: [
		nodeExternals({
			// 白名单中的资源依然正常打包
			allowlist: [/\.css$/]
		})],

		plugins: [
			// 这是将服务器的整个输出构建为单个 JSON 文件的插件。
			// 默认文件名为 `vue-ssr-server-bundle.json
			newVueSSRServerPlugin()
	]
})
```

### 构建命令

```jsx
// package.json
	"scripts": {
    "build:client": "cross-env NODE_ENV=production webpack --config build/webpack.client.config.js",
    "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js",
    "build": "rimraf dist && npm run build:client && npm run build:server"
  },

$ npm run build:client
$ npm run build:server
$ npm run build
```

### 启动应用

```jsx
$ nodemon server.js

// 改变 server.js
const express = require('express')
const Vue = require('vue')
const VueServerRender = require('vue-server-renderer')
const fs = require('fs')

const server = express()

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = VueServerRender.createBundleRenderer(serverBundle, {
    template,
    clientManifest
})

// const createApp = () => {
//     const app = new Vue({
//         template: `
//             <div id="app">
//                 <h1>Hello {{ message }}</h1>
//                 <input v-model="message">
//             </div>
//         `,
//         data: {
//             message: 'World'
//         }
//     })
//     return app
// }

server.use('/dist', express.static('./dist'))

server.get('/', async (req, res) => {
    // try {
    //     const app = createApp()
    //     const ret = await renderer.renderToString(app, {
    //         title: 'customized title',
    //         meta: `
    //             <meta name="description" content="hello world">
    //         `
    //     })
    //     res.end(ret)
    // } catch (err) {
    //     res.status(500).end('Internal Server Error.')
    // }
    renderer.renderToString({
        title: 'Lagou Education',
        meta: `
            <meta name="description" content="Lagou Education">
        `
    }, (err, html) => {
        if (err) {
            return res.status(500).end('Internal Server Error.')
        }
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    })
})

server.listen(3000, () => {
    console.log('running at port 3000.')
})
```

## 构建配置开发模式

```jsx
修改 server.js
创建 setup-dev-server.js

安装包：
// fs.watch, fs.watchFile 不太好用，推荐使用一个 chokidar 的包
$ npm i chokidar
// 将 dist/vue-ssr-server-bundle.json 保存在内存中，加快loading速度，不会生成物理文件dist/...
$ npm i webpack-dev-middleware --save-dev
// 热更新
$ npm i webpack-hot-middleware --save-dev
```

server.js

```jsx
// server.js
const express = require('express')
const Vue = require('vue')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')

const server = express()

const isProd = process.env.NODE_ENV === 'production'
let renderer
let onReady

if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
} else {
    // 开发模式 -> 监视打包构建 -> 重新生成 renderer 渲染器
    onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
    })
}

// const createApp = () => {
//     const app = new Vue({
//         template: `
//             <div id="app">
//                 <h1>Hello {{ message }}</h1>
//                 <input v-model="message">
//             </div>
//         `,
//         data: {
//             message: 'World'
//         }
//     })
//     return app
// }

server.use('/dist', express.static('./dist'))

const render = (req, res) => {
    renderer.renderToString({
        title: 'Lagou Part 3 Module 4',
        meta: `
            <meta name="description" content="Lagou Education">
        `
    }, (err, html) => {
        if (err) {
            return res.status(500).end('Internal Server Error.')
        }
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    })
}

server.get('/', isProd 
    ? render
    : async (req, res) => {
        await onReady
        render(req, res)
    })

server.listen(3000, () => {
    console.log('running at port 3000.')
})

```

setup-dev-server.js

```jsx
// setup-dev-server.js
const path = require('path')
const fs = require('fs')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = file => path.resolve(__dirname, file)

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    // 监视构建 -> 更新 Renderer
    let template
    let serverBundle
    let clientManifest

    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    // 监视构建 template -> 调用 update -> 更新 Renderer 渲染器
    const templatePath = resolve('../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
    // fs.watch, fs.watchFile 不太好用，推荐使用一个 chokidar 的包
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })

    // 监视构建 serverBundle -> 调用 update -> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent'  // 关闭日志输出，哟偶偶 FriendlyErrorsWebpackPlugin 处理
    })
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(
            serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
        )
        update()
    })
    // serverCompiler.watch({}, (err, stats) => {
    //     if (err) throw err
    //     if (stats.hasErrors()) return
    //     serverBundle = JSON.parse(
    //         fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
    //     )
    //     update()
    // })

    // 监视构建 clientManifest -> 调用 update -> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry.app = [
        'webpack-hot-middleware/client?quiet=true&reload=true',    // 和服务端交互处理热更新一个客户端脚本
        clientConfig.entry.app
    ]
    clientConfig.output.filename = '[name].js'  // 热更新模式下确保一直的 hash
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent'  // 关闭日志输出，哟偶偶 FriendlyErrorsWebpackPlugin 处理
    })
    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )
        update()
    })
    server.use(hotMiddleware(clientCompiler, {
        log: false  // 关闭它本身的日志输出
    }))

    // 重要！！！ 将 clientDevMiddleware 挂载到 express 服务中，提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)

    return onReady
}
```

## 编写通用代码

[https://ssr.vuejs.org/zh/guide/universal.html](https://ssr.vuejs.org/zh/guide/universal.html)

## 路由处理

[https://ssr.vuejs.org/zh/guide/routing.html](https://ssr.vuejs.org/zh/guide/routing.html)

```jsx
$ npm i vue-router

创建
// pages/Home.vue
// pages/About.vue
// pages/404.vue

// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'

Vue.use(VueRouter)

export const createRouter = () => {
    const router = new VueRouter({
        mode: 'history',    // 兼容前后端
        routes: [
            {
                path: '/',
                name: 'home',
                component: Home
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/pages/About')
            },
            {
                path: '*',
                name: 'error404',
                component: () => import('@/pages/404')
            }
        ]
    })

    return router
}

修改
// server.js
const render = async (req, res) => {
    try {
        const html = await renderer.renderToString({
            title: 'Lagou Part 3 Module 4',
            meta: `
                <meta name="description" content="Lagou Education">
            `,
            url: req.url
        })
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    } catch (err) {
        return res.status(500).end('Internal Server Error.')
    }  
}

// 服务端路由设置为 *，意味着所有的路由都会进入这里
server.get('*', isProd 
    ? render
    : async (req, res) => {
        await onReady
        render(req, res)
    })

// entry-server.js
import { createApp } from './app'

export default async context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router))

    return app
}

// entry-client.js
import { createApp } from './app'

const { app, router } = createApp()

router.onReady(() => {
    app.$mount('#app')
})

// app.js
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router/'

export function createApp() {
    const router = createRouter()
    const app = new Vue({
        router, // 把路由挂载到 Vue 根实例中
        render: h => h(App)     // 根实例简单的渲染应用组件
    })
    return { app, router }
}

// App.vue
<template>
  <div id="app">
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>
      <router-view/>
  </div>
</template>
```

解析一个问题

```jsx
<link rel="preload" href="/dist/app.js" as="script">
<link rel="prefetch" href="/dist/0.js">
<link rel="prefetch" href="/dist/1.js">

<body>
	<div id="app">...</div>
	<script src="/dist/app.js" defer=""></script>
</body>
```

preload, prefetch 都是预加载资源。只是下载对应的资源，不会执行代码，不影响当前网页的渲染。其中，preload 加载当前页面一定会用到的资源。prefetch 加载的是下一页可能会用到的资源，只会在浏览器空闲的时候才会加载，不保证一定会加载。

body里面，最后加载的 script 才是真正当前页面加载的代码。

## 管理页面 Head

第三方库 vue-meta

```jsx
$ npm i vue-meta
```

## 数据预取和状态管理

普通方法：

```jsx
// pages/Posts.vue
<template>
  <div>
      <h1>Post List</h1>
      <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }}</li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'PostsPage',
    metaInfo: {
        title: 'Posts'
    },
    data () {
        return {
            posts: []
        }
    },
    // 服务端渲染
    //      只支持 beforeCreate 和 created
    //      不会等待 beforeCreate 和 created 中的异步操作
    //      不支持响应式数据
    // 所有这种做法在服务端渲染中是不会工作的！
    async created () {
        console.log('Posts Created Start')
        const { data } = await axios({
            method: 'GET',
            url: 'https://cnodejs.org/api/v1/topics'
        })

        this.posts = data.data
        console.log('Posts created End')
    }
}
</script>

<style>

</style>
```

状态管理，解决方法，在服务器端渲染的数据，存储到外部容器中，避免了客户端重新渲染。使用 Vuex。

```jsx
$ npm i vuex
```