<template>
  <div class="form">
    <MForm :model="userInfo" :rules="rules" ref="loginForm">
      <!-- 用户名 -->
      <MFormItem label="用户名" prop="username">
        <MInput v-model="userInfo.username" placeholder="请输入用户名" />
      </MFormItem>
      <!-- 密码 -->
      <MFormItem label="密码" prop="password">
        <MInput
          v-model="userInfo.password"
          type="password"
          placeholder="请输入密码"
        />
      </MFormItem>
      <!-- 提交按钮 -->
      <MFormItem>
        <button @click="login">登录</button>
      </MFormItem>
    </MForm>
    <p @click="$store.commit('addCount', 2)">count: {{ $store.state.count }}</p>
    <p @click="$store.dispatch('add', 2)">
      async count: {{ $store.state.count }}
    </p>
    <p>double count: {{ $store.getters.getDoubleCount}}</p>
    <router-view></router-view>
  </div>
</template>
<script>
import MForm from "@/components/form/MForm";
import MFormItem from "@/components/form/MFormItem";
import MInput from "@/components/form/MInput";
// import Notice from "@/components/Notice.vue";
export default {
  components: {
    MInput,
    MFormItem,
    MForm,
    // Notice,
  },
  // created() {
  //   this.$store.state = {}
  // },
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入用户名" }],
        password: [{ required: true, message: "请输入密码" }],
      },
    };
  },
  methods: {
    login() {
      this.$refs["loginForm"].validate((valid) => {
        const notice = this.$notice({
          title: "温馨提示",
          message: valid ? "请求登录!" : "校验失败!",
          duration: 2000,
        });
        notice.show();
      });
    },
  },
  asyncData({ store, route }) {
    // 约定预取逻辑编写在预取钩子asyncData中
    // 触发 action 后，返回 Promise 以便确定请求结果
    return store.dispatch("getCount");
  },
};
</script>
