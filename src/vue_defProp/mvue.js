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

    //创建Observer实例
    new observer(obj)

}

//代理函数,方便用户直接访问$data中的数据
function proxy(vm,sourceKey){
    Object.keys(vm[sourceKey]).forEach(key=>{
        //将$data中的key代理到vm属性中
        Object.defineProperty(vm,key,{
            get(){
                return vm[sourceKey][key]
            },
            set(newVal){
                vm[sourceKey][key] = newVal
            }
        })
    })
}

//根据对象类型决定如何做响应化
class observer {
    constructor(value) {
        this.value = value

        //判断其类型
        if (typeof value === 'object') {
            this.walk(value)
        }
    }

    //对象数据响应化
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }

    //数组数据响应化, 待补充

}





//创建MVue构造函数
class MVue {
    constructor(options) {
        //保存选项
        this.$option = options;
        this.$data = options.data;


        //响应化处理
        observe(this.$data)

        //代理
        proxy(this,'$data')
    }
}