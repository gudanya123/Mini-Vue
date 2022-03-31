//保存构造函数引用,避免import
let Vue;

class Store {
    constructor(options) {
        this._mutations = options.mutations;
        //保存用户编写的actions选项
        this._actions = options.actions;

        this._wrappedGetters = options.getters;

        //响应化处理state
        // this.state = new Vue({
        //     data: options.state
        // })

        //定义computed选项
        const computed = {}
        this.getters = {}

        const store = this;

        Object.keys(this._wrappedGetters).forEach(key => {
            //获取用户定义的getter
            const fn = store._wrappedGetters[key];
            //转换为computed可以使用无参数形式
            computed[key] = function () {
                return fn(store.state)
            }

            //为getters定义只读属性
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        })

        this._vm = new Vue({
            data: {
                //加两个$,Vue不做代理
                $$state: options.state
            },
            computed
        })

        //绑定commit、dispatch的上下文为store实例
        //this.commit = this.commit.bind(this);
        //this.dispatch = this.dispatch.bind(this);

        // 绑定commit上下文否则action中调用commit时可能出问题!!
        // 同时也把action绑了，因为action可以互调
        const { commit, action } = store
        this.commit = function boundCommit(type, payload) {
            commit.call(store, type, payload)
        }
        this.action = function boundAction(type, payload) {
            return action.call(store, type, payload)
        }

    }

    //存取器, store.state
    get state() {
        return this._vm._data.$$state
    }

    set state(v) {
        console.error('不允许直接修改state值,必须通过commit')

    }



    //store.commit('add',1)
    //type: mutation的类型
    //payload: 载荷, 是参数
    commit(type, payload) {
        const entry = this._mutations[type]
        if (!entry) {
            console.error(`unknown mutation type: ${type}`)
            return
        }
        //指定上下文为Store实例
        //传递state给mutation
        entry(this.state, payload)
    }

    dispatch(type, payload) {
        const entry = this._actions[type]
        if (!entry) {
            console.error(`unknown  type: ${type}`)
            return
        }
        //指定上下文为Store实例
        entry(this, payload)

    }
}

function install(_Vue) {
    Vue = _Vue;

    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store
            }
        }
    })

}


//Vuex
export default {
    Store,
    install
}