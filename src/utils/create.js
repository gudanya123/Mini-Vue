import Vue from 'vue';

import Notice from '@/components/Notice.vue'

// function create(Component, props) {
//     //组件构造函数如何获取
//     //1.Vue.extend()
//     //2.render
//     const vm = new Vue({
//         //h是createElement, 返回Vnode 是虚拟DOM
//         //需要挂载才能变成真实DOM
//         render: h => h(Component, { props })
//     }).$mount()  //不指定宿主元素,则会创建真实DOM,但是不会追加操作

//     //获取真实DOM vm.$el
//     document.body.appendChild(vm.$el)

//     const comp = vm.$children[0]

//     //删除
//     comp.remove = function () {
//         document.body.removeChild(vm.$el)
//         vm.$destroy()
//     }

//     return comp
// }


function create(Component, props) {
    //组件构造函数如何获取
    //1.Vue.extend()
    //2.render
    const Ctor = Vue.extend(Component)
    const comp = new Ctor({ propsData: props })
    comp.$mount();
    document.body.appendChild(comp.$el)
    comp.remove = () => {
        // 移除dom 
        document.body.removeChild(comp.$el)
        // 销毁组件
        comp.$destroy();
    }

    return comp
}

// export default create

//使用插件进一步封装
export default {
    install(Vue) {
        Vue.prototype.$notice = (options) => {
            return create(Notice, options)
        }
    }
}
