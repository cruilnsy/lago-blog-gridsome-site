# 任务三：封装 Vue.js 组件库

# 组件化开发

## 组件开发介绍

代码重用

**开源组件库**

- Element-UI
- iView

组件优先开发

**CDD (Component-Driven Development)**

- 自下而上
- 从组件级别开始，到页面级别结束（先隔离开发组件，再开发页面）

CDD 好处

- 组件再最大程度被重用
- 并行开发（不同团队间共享任务，任务就是开发相对隔离的组件）
- 可视化测试

## 处理组件的边界情况

处理组件的边界情况

- $root (根实例中写入数据。小型应用中，存储数据，共享状态。)
- $parent / $children ($parent，操作父组件成员，替换props使用。 不推荐使用$parent，一旦更改父组件中成员，出现问题，很难找到更改的位置。用的少。) — 获取父组件用$parent，获取所有子组件用$children
- $refs(访问子组件，表单验证使用) — 获取特定组件

    ```jsx
    this.$refs[formName].validate((valid) => {
    	if (valid) {
    		alert('submit')
    	} else {
    		console.log('error submit!!')
    		return false;
    	}
    });
    ```

- 依赖注入 provide / inject(成员不是响应式的，父组件提供成员，子组件注入成员。组件之间的耦合变高，子组件依赖父组件，重构变得困难。开发自定义组件时，可以考虑使用这种组件) — 在嵌套比较多的情况下，想要获取父组件，使用依赖注入的方式获得最外层成员

### $attrs / $listeners

开发自定义组件

$attrs 把父组件中非 prop 属性绑定到内部组件

$listeners 把父组件中的 DOM 对象的原生事件绑定到内部组件

## 快速原型开发

### 定义

VueCli 提供了一个插件可以进行原型快速开发

需要先额外安装一个全局的扩展

```jsx
// 前提全局安装vue-cli，开发少量组件很方便
// npm install -g @vue/cli
$ npm install -g @vue/cli-service-global
// 之后有其他工具可以替换
```

使用 vue serve 快速查看组件的运行效果

vue serve 如果不指定参数默认会再当前目录找以下的入口文件：main.js, index.js, App.vue, app.vue

可以指定要加载的组件：vue serve ./src/login.vue

### 快速原型开发 — Element-UI

```jsx
// 初始化 package.json
$ npm init -y
// 安装 ElementUI(安装babel,所依赖的插件，生产相关配置在 package.json)
$ vue add element
// 加载 ElementUI，使用 Vue.use() 安装插件、
```

### 实现简单的登录页面

```jsx
// 在mac 上安装失败，并且 vue serve src/steps.vue 报错 Command Not Found: vue
$ npm install -g @vue-cli @vue/cli-service-global

// 用 yarn 安装
$ yarn add global @vue-cli @vue/cli-service-global
// 运行
$ yarn vue serve src/steps.vue
```

## 组件开发

### 组件分类

第三方组件（ElementUI, iView等）— 用户样式不高

基础组件（文本框，按钮，表单等）— 用户样式

业务组件（几个特定行业的特定组件）— 行业如财务，餐饮等

### 开发步骤条组件

![./task03-01.png]
(./task03-01.png)

## Storybook

## Monorepo

## 基于模板生成包的结构

## Lerna + yarn workspaces

## 组件测试

## Rollup 打包