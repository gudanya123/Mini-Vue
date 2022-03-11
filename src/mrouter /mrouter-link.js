export default {
    props: {
        to: {
            type: String,
            required: true
        },
    },
    render(h) {
        //<a href="#/about">about</a>
        //h(tag,data,children)

        return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)

        //可以使用jsx  但是脱离了vue-cli环境不能执行
        // return <a href={'#' + this.to}>{this.$slots.default}</a>
    }
}