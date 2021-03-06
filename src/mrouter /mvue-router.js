import View from './mrouter-view'
import Link from './mrouter-link'
import router from './index';
let Vue;



//1.实现一个插件:挂载$router

class MVueRouter {
    constructor(options) {
        this.$options = options;

        //需要创建响应式的current属性
        //利用Vue提供的defineReactive做响应化
        //这样将来current变化的时候,依赖的组件会重新render
        // Vue.util.defineReactive(this, 'current', '/')

        this.current = window.location.hash.slice(1) || '/'
        Vue.util.defineReactive(this, 'matched', [])
        //match方法可以递归遍历路由表,获得匹配关系数组
        this.match()

        //这样也可以实现响应式数据
        // this.app = new Vue({
        //     data() {
        //         return {
        //             current: '/'
        //         }
        //     }
        // })

        //监控url变化
        window.addEventListener('hashchange', this.onHashChange.bind(this))

        window.addEventListener('load', this.onHashChange.bind(this))

        //创建一个路由映射表
        // this.routeMap = {}
        // options.routes.forEach(route => {
        //     this.routeMap[route.path] = route
        // })
    }

    onHashChange() {
        this.current = window.location.hash.slice(1)

        this.matched = []
        this.match()
    }

    match(routes) {
        routes = routes || this.$options.routes

        //递归遍历
        for (const route of routes) {
            if (route.path === '/' && this.current === '/') {
                this.matched.push(route)
                return
            }

            // /about/info
            if(route.path !== '/' && this.current.indexOf(route.path) !== -1){
                this.matched.push(route)
                if(route.children){
                    this.match(route.children)
                }
                return
            }

        }
    }



}

MVueRouter.install = function (_Vue) {
    //保存构造函数,在MVueRouter里面使用
    Vue = _Vue;

    //挂载$router
    //怎么获取根实例中的router选项
    Vue.mixin({
        beforeCreate() {
            //确保根实例的时候才执行
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }
        }
    })

    //任务2: 实现两个全局组件router-link和router-view
    Vue.component('router-link', Link)

    Vue.component('router-view', View)


}


export default MVueRouter
