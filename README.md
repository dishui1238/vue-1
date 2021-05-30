<!--
 * @Author: your name
 * @Date: 2021-05-07 19:21:25
 * @LastEditTime: 2021-05-30 10:14:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/README.md
-->

## vue 初始化流程

测试代码 ./examples/test/01-init.html

### 环境配置

- 安装依赖 `npm i` 或 `yarn install`

- 在 package.json 文件 的 dev 脚本下， 开启 sourcemap ，`"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web- full-dev"`

- 运行开发命令 `yarn dev`

### 入口

dev 脚本中 -c scripts/config.js 指明配置文件所在位置，参数 TARGET:web-full-dev 指明输出文件配置项

1. 入口 platforms/web/entry-runtime-with-compiler.js

   - 扩展默认$mount 方法：处理 template 或 el 选项, mount.call(this, el)

```
Function.call(thisobj, args...)

call()将指定的函数 function 作为对象 thisobj 的方法来调用，并传入参数列表中 thisobj 之后的参数。返回的是调用 function 的返回值。在函数体内，关键字 this 指代 thisobj 对象，如果 thisobj 位 null，则使用全局对象。
```

2. platforms/web/runtime/index.js

   - 安装 web 平台特有指令和组件
   - 定义**patch**：补丁函数，执行 patching 算法进行更新
   - 定义$mount：挂载 vue 实例到指定宿主元素（获得 dom 并替换宿主元素）

3. core/index.js

   - 初始化全局 API

   ```js
   Vue.set = set;
   Vue.delete = del;
   Vue.nextTick = nextTick;
   initUse(Vue); // 实现 Vue.use 函数
   initMixin(Vue); // 实现 Vue.mixin 函数
   initExtend(Vue); // 实现 Vue.extend 函数
   initAssetRegisters(Vue); // 注册实现 Vue.component/directive/filter
   ```

4. core/instance/index.js
   Vue 构造函数定义，定义 Vue 实例 API

   ```js
   function Vue(options) {
     // 构造函数仅执行了_init
     this._init(options);
   }
   initMixin(Vue); // 实现init函数
   stateMixin(Vue); // 状态相关api $data,$props,$set,$delete,$watch
   eventsMixin(Vue); // 事件相关api $on,$once,$off,$emit
   lifecycleMixin(Vue); // 生命周期api _update,$forceUpdate,$destroy
   renderMixin(Vue); // 渲染api _render,$nextTick
   ```

5. core/instance/init.js

创建组件实例，初始化其数据、属性、事件等

```js
vm._self = vm;
initLifecycle(vm); // $parent,$root,$children,$refs
initEvents(vm); // 处理父组件传递的事件和回调
initRender(vm); // $slots,$scopedSlots,_c,$createElement
callHook(vm, "beforeCreate");
initInjections(vm); // 获取注入数据
initState(vm); // 初始化props，methods，data，computed，watch
initProvide(vm); // 提供数据注入 callHook(vm, 'created')
```

- **$mount**

  - mountComponent 执行挂载，获取 vdom 并转换为 dom
  - new Watcher() 创建组件渲染 watcher， 一个组件一个 watcher
  - updateComponent() 执行初始化或更新
  - _render() 渲染组件，获取 vdom
  - _update() 初始化或更新，将传入 vdom 转换为 dom，初始化时执行的是 dom 创建操作
