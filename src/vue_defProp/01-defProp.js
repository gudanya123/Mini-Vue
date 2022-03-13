//响应式  Object.defineProperty    Proxy
// Object.defineProperty  对数组无效
//分析:改变数组方法只有7个
//解决方案: 替换数组实例的原型方法,让他们在修改数组的同时还可以通知更新

//数组响应式
//替换数组原型中7个方法
const orginalProto = Array.prototype;
//备份一份,修改备份
const arrayProto = Object.create(orginalProto);
['push','pop','shift','unshift'].forEach(method=>{
    arrayProto[method] = function(){
        //原始操作
        orginalProto[method].apply(this,arguments)
        //覆盖操作: 通知更新
        console.log('数组执行' + method + '操作');
    }
})


//对象响应式
function defineReactive(obj, key, val) {
    //递归
    observe(val)

    //对传入obj进行访问拦截
    Object.defineProperty(obj, key, {
        get() {
            console.log('get' + val)
            return val;
        },
        set(newVal) {
            //如果传入的newVal依然是obj,需要做响应化处理
            observe(newVal)
            if (newVal !== val) {
                console.log('set' + newVal)
                val = newVal
            }

        }
    })
}


function observe(obj) {
    //希望传入的是obj
    if (typeof obj !== 'object' || obj === null) {
        return
    }

    //判断传入obj类型
    if(Array.isArray(obj)){
        //覆盖原型,替换7个变更操作
        obj.__proto__=arrayProto
        //对数组内部元素执行响应化
        for (let i = 0; i < obj.length; i++) {
            observe(obj[i])
        }
    }else{
    //遍历做响应式处理
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
    }
}

function set(obj, key, val) {
    defineReactive(obj, key, val)
}

const obj = { age: 20, num: { a: 1 }, arr: [1, 2, 3] }
observe(obj);

// obj.age = 28

// obj.num.count =2

// obj.num = { a: 100 }
// obj.num = 9999

// set(obj,'zzz',123)

// obj.zzz


//Object.defineProperty()对数组无效
//分析:改变数组方法只有7个
//解决方案:替换数组实例的原型方法,让他们在修改数组的同时还可以通知更新
obj.arr.push(4)

for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const ele = obj[key];
      console.log(ele)
      
    }
  }
  



