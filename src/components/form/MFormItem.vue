<template>
  <div>
    <!-- label -->
    <label v-if="label">{{ label }}</label>
    <slot></slot>
    <!-- 校验信息显示 -->
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
//Async-validator  element-ui校验的规则描述
import Schema from "async-validator";
export default {
  inject: ["form"],
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      error: "", //error为空说明校验通过
    };
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      //规则  this.form.rules[this.prop]
      const rules = this.form.rules[this.prop];
      //值  this.form.model[this.prop]
      const value = this.form.model[this.prop];

      //校验描述对象
      const desc = { [this.prop]: rules };

      //创建Schema实例
      const schema = new Schema(desc);
      return schema.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          this.error = errors[0].message;
        } else {
          //校验通过
          this.error = "";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>