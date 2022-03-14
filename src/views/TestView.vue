<template>
  <div>
    <div @click="change()">{{ msg }}</div>
    <h2 @click="$store.commit('add')">{{ $store.state.count }}</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello ssr",
    };
  },
  methods: {
    change() {
      this.msg = "ssr test";
    },
  },
  asyncData({ store, route }) {
    // 约定预取逻辑编写在预取钩子asyncData中
    // 触发 action 后，返回 Promise 以便确定请求结果
    return store.dispatch("getCount");
  },
};
</script>

<style lang="scss" scoped>
</style>