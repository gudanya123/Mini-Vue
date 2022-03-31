<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  componentName: "MForm",
  name: "MForm",
  provide() {
    return {
      form: this,
    };
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
    },
  },
  created() {
    this.fields = [];
    this.$on("my.form.addField", (item) => {
      this.fields.push(item);
    });
  },
  methods: {
    validate(cb) {
      //获取所有孩子MFormItem
      //[resultPromise]
      // const tasks = this.$children
      //   .filter((item) => item.prop) //过滤掉没有prop属性的item
      //   .map((item) => item.validate());

      const tasks = this.fields.map((item) => item.validate());

      //统一处理所有的Promise结果
      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>