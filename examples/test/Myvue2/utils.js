import Dep from "./dep";
import { Observer } from "./vue2";

// 代理 vm 中的 data 数据
export function proxy(vm, key) {
  // 将 data 对象遍历
  Object.keys(vm[key]).forEach((k) => {
    // 依次放到 this (vue 实例)上
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k];
      },
      set(val) {
        vm[key][k] = val;
      },
    });
  });
}

// 将 obj 中所有数据进行响应式处理
export function observe(obj) {
  if (!obj || typeof obj !== "object") {
    return;
  }
  new Observer(obj);
}

// 定义响应式函数
export function defineReactive(obj, key, val) {
  // 递归遍历
  observe(val);

  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖
      Dep.target && dep.addDep(Dep.target);
      return obj[key];
    },
    set(newVal) {
      if (newVal !== val) {
        // 保证如果newVal是对象，再次做响应式处理
        observe(newVal);
        val = newVal;
        // 触发更新
        dep.notify();
      }
    },
  });
}
