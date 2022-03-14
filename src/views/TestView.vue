<template>
  <div>
    <div @click="change()">{{ msg }}</div>
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
          this.msg = 'ssr test'
          
      }
  },
};
</script>

<style lang="scss" scoped>
</style>