<!--
 * @Author: your name
 * @Date: 2021-05-07 19:21:25
 * @LastEditTime: 2021-05-07 19:38:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/README.md
-->

## vue 初始化流程

1. 入口 platforms/web/entry-runtime-with-compiler.js

   - 扩展默认$mount 方法：处理 template 或 el 选项

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
