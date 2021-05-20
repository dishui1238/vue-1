/*
 * @Author: your name
 * @Date: 2021-05-19 07:00:13
 * @LastEditTime: 2021-05-19 10:07:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Github/vue-1/examples/test/vue2.js
 */

// 对 obj 中所有的数据做响应式处理
function observe(obj) {
  if (obj === null && typeof obj !== "object") {
    return;
  }
  // 每遇到一个对象，就创建一个Observer实例
  // 创建一个Observer实例去做拦截操作
  new Observer(obj);
}

// 代理 vm 实例中的 data 数据
function proxy(vm, key) {
  Object.keys(vm[key]).forEach((k) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm[key][k];
      },
      set(val) {
        vm[key][k] = val;
      },
    });
  });
}

/**
 * @description: 定义响应式 - get 时收集依赖，set 时触发视图更新
 * @param {*} obj 数据对象
 * @param {*} key 键
 * @param {*} val 值
 */
function defineReactive(obj, key, val) {
  // 递归数据
  observe(obj);

  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        // 保证如果newVal是对象，再次做响应式处理
        observe(newVal);
        val = newVal; // 闭包数据
        // 通知更新
      }
    },
  });
}

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data || {};

    // data 响应式处理
    observe(this.$data);

    // 代理 可以使 data 直接访问
    proxy(this, "$data");
  }
}

// 根据传入value类型做不同操作
class Observer {
  constructor(option) {
    this.option = option;

    // 如果是数组，则覆盖数组的七个方法，替换原型
    if (Array.isArray(option)) {
    } else {
      // 否则 递归遍历
      this.walk(option);
    }
  }

  walk(obj) {
    Object.keys().forEach((key) => {
      // 响应式处理
      defineReactive(obj, key, obj[key]);
    });
  }
}

// 依赖收集
class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(dep) {
    this.deps.push(dep);
  }
  notify() {
    // 所有的依赖更新
    this.deps.forEach((dep) => dep.update());
  }
}
