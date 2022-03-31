function defineReactive(obj, key, val) {
    // 递归
    observe(val)

    // 创建一个Dep和当前key一一对应
    const dep = new Dep()

    // 对传入obj进行访问拦截
    Object.defineProperty(obj, key, {
        get() {
            console.log('get ' + key);
            // 依赖收集在这里
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal !== val) {
                console.log('set ' + key + ':' + newVal);
                // 如果传入的newVal依然是obj，需要做响应化处理
                observe(newVal)
                val = newVal

                // 通知更新
                // watchers.forEach(w => w.update())
                dep.notify()
            }
        }
    })
}

function observe(obj) {
    if (typeof obj !== 'object' || obj == null) {
        // 希望传入的是obj
        return
    }

    // 创建Observer实例
    new Observer(obj)
}

// 代理函数，方便用户直接访问$data中的数据
function proxy(vm, sourceKey) {
    // vm[sourceKey]就是vm[$data]
    Object.keys(vm[sourceKey]).forEach(key => {
        // 将$data中的key代理到vm属性中
        Object.defineProperty(vm, key, {
            get() {
                return vm[sourceKey][key]
            },
            set(newVal) {
                vm[sourceKey][key] = newVal
            }
        })
    })
}

// 创建KVue构造函数
class MVue {
    constructor(options) {
        // 保存选项
        this.$options = options;
        this.$data = options.data;

        // 响应化处理
        observe(this.$data)

        // 代理
        proxy(this, '$data')

        // 创建编译器
        new Compiler(options.el, this)
    }
}

// 根据对象类型决定如何做响应化
class Observer {
    constructor(value) {
        this.value = value
        //判断传入value类型
        if (Array.isArray(value)) {
            this.walkArray(value)
        } else {
            //遍历做响应式处理
            this.walk(value)
        }
    }

    // 对象数据响应化
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }

    // 数组数据响应化
    walkArray(obj) {
        //数组响应式
        //替换数组原型中7个方法
        const orginalProto = Array.prototype;
        //备份一份,修改备份
        const arrayProto = Object.create(orginalProto);
        ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'].forEach(method => {
            arrayProto[method] = function () {
                //原始操作
                orginalProto[method].apply(this, arguments)
                //覆盖操作: 通知更新
                console.log('数组执行' + method)
            }
        })
        //覆盖原型,替换7个变更操作
        obj.__proto__ = arrayProto
        //对数组内部元素执行响应化
        for (let i = 0; i < obj.length; i++) {
            observe(obj[i])
        }
    }
}

// 观察者:保存更新函数，值发生变化调用更新函数
// const watchers = []
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm

        this.key = key

        this.updateFn = updateFn

        // watchers.push(this)

        // Dep.target静态属性上设置为当前watcher实例
        Dep.target = this
        this.vm[this.key] // 读取触发了getter
        Dep.target = null // 收集完就置空
    }

    update() {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}

// Dep：依赖，管理某个key相关所有Watcher实例
class Dep {
    constructor() {
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}