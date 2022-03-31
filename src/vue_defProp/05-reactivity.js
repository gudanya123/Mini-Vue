function isObject(obj) {
    if (typeof obj == 'object' && obj != null) {
        return true
    }
    return false

}

const toProxy = new WeakMap()  //{obj: observed}
const toRaw = new WeakMap()   //{observed: obj}

function reactive(obj) {
    if (!isObject(obj)) {
        return obj
    }

    //查找缓存
    if (toProxy.has(obj)) {
        return toProxy.get(obj)
    }

    if (toRaw.has(obj)) {
        return obj
    }

    //Proxy外层拦截
    const observed = new Proxy(obj, {
        //target代理目标
        get(target, key, receiver) {
            //Reflect是把Object上面的方法移到这里了
            //更健壮,避免一些异常
            const res = Reflect.get(target, key, receiver)
            console.log('获取' + key + ':' + res)
            //收集依赖
            track(target, key)
            return isObject(res) ? reactive(res) : res;

        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver)
            console.log('设置' + key + ':' + value)
            trigger(target, key)
            return res;


        },
        deleteProperty(target, key) {
            const res = Reflect.deleteProperty(target, key)
            console.log('删除' + key)
            return res;

        }
    })

    //缓存
    toProxy.set(obj, observed)

    toRaw.set(observed, obj)

    return observed
}

//保存响应函数
const effectStack = []
function effect(fn) {
    const rxEffect = function () {
        try {
            effectStack.push(rxEffect)
            //执行函数触发getter -> track
            return fn()
        } finally {
            effectStack.pop()
        }
    }
    rxEffect()
    return rxEffect
}

let targetMap = new WeakMap()
//建立target/key和cb之间的映射关系
function track(target, key) {
    //取出响应函数
    const effect = effectStack[effectStack.length - 1]
    if (effect) {
        //获取依赖表
        let depsMap = targetMap.get(target)

        if (!depsMap) {
            //初始化时不存在,需要创建一个新的空的Map
            depsMap = new Map()
            targetMap.set(target, depsMap)
        }

        //获取key对应的函数集合
        let deps = depsMap.get(key)

        if (!deps) {
            deps = new Set()
            depsMap.set(key, deps)
        }

        //把当前effect加入deps中
        if (!deps.has(effect)) {
            deps.add(effect)
        }
    }

}

function trigger(target, key) {
    //获取依赖的set
    const depsMap = targetMap.get(target)

    if (!depsMap) {
        const deps = depsMap.get(key)
        deps && deps.array.forEach(effect => effect());
    }

}

const obj = {
    age: 15,
    num: {
        a: 1
    },
    arr: [1, 2, 3]
}

const res = reactive(obj)

effect(() => {
    console.log('effect:' + res.age)
})

effect(() => {
    console.log('effect2:' + res.age)
})

res.age = 20

// res.num.a = 2

// res.sex = 'male'

// delete res.sex

// res.arr[0] = 10

// res.arr



// console.log(reactive(res) === res)


