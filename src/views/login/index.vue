<!--登录页面-->
<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">尚品甄选后台管理系统</h1>
      <el-form-item prop="userName">
        <el-input
          class="text"
          v-model="model.userName"
          prefix-icon="User"
          clearable
          :placeholder="$t('login.username')"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="text"
          v-model="model.password"
          prefix-icon="Lock"
          show-password
          clearable
          :placeholder="$t('login.password')"
        />
      </el-form-item>

      <el-form-item prop="captcha">
        <div class="captcha">
          <el-input class="text" v-model="model.captcha" prefix-icon="Picture" placeholder="请输入验证码"></el-input>
          <img :src="captchaSrc" @click="refreshCaptcha" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" class="btn" size="large" @click="submit">
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="change-lang">
      <change-lang />
    </div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, ref, computed, onMounted, watch } from "vue";
import { Login, GetValidateCode } from "@/api/login";
import { useRouter, useRoute } from "vue-router";
import ChangeLang from "@/layout/components/Topbar/ChangeLang.vue";
import useLang from "@/i18n/useLang";
import { useApp } from "@/pinia/modules/app";

export default defineComponent({
  components: { ChangeLang },
  name: "login",
  setup() {
    const { proxy: ctx } = getCurrentInstance(); // 可以把ctx当成vue2中的this
    const router = useRouter();
    const route = useRoute();
    const { lang } = useLang();
    watch(lang, () => {
      state.rules = getRules();
    });
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t("login.rules-username"),
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t("login.rules-password"),
          trigger: "blur",
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t("login.rules-regpassword"),
          trigger: "blur",
        },
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t("login.rules-validate-code"),
          trigger: "blur",
        },
      ],
    });

    // onMounted钩子函数
    onMounted(() => {
      state.refreshCaptcha();
    });

    const state = reactive({
      model: {
        userName: "admin",
        password: "111111",
        captcha: "", // 用户输入的验证码
        codeKey: "", // 后端返回的验证码key
      },
      rules: getRules(),
      loading: false,
      captchaSrc: "",
      refreshCaptcha: async () => {
        const { data } = await GetValidateCode();
        state.model.codeKey = data.codeKey;
        state.captchaSrc = data.codeValue;
      },
      btnText: computed(() => (state.loading ? ctx.$t("login.logining") : ctx.$t("login.login"))),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return;
        }
        state.loginForm.validate(async (valid) => {
          if (valid) {
            state.loading = true;
            const { code, data, message } = await Login(state.model);
            if (+code === 200) {
              ctx.$message.success({
                message: ctx.$t("login.loginsuccess"),
                duration: 1000,
              });

              const targetPath = decodeURIComponent(route.query.redirect);
              if (targetPath.startsWith("http")) {
                // 如果是一个url地址
                window.location.href = targetPath;
              } else if (targetPath.startsWith("/")) {
                // 如果是内部路由地址
                router.push(targetPath);
              } else {
                router.push("/"); // 请求成功以后，进入到首页
              }
              useApp().initToken(data);
            } else {
              ctx.$message.error(message);
            }
            state.loading = false;
          }
        });
      },
    });

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;
  transition: transform 1s;
  transform: scale(1);

  .form {
    box-sizing: border-box;
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    margin: 160px auto 0;

    :deep {
      .el-input-wrapper {
        background: rgb(0 0 0 / 10%);
        box-shadow: 0 0 0 1px rgb(255 255 255 / 10%) inset;
      }

      .el-input-group-append > .el-input-wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .el-input-group-prepend > .el-input-wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .title {
      margin: 0 0 24px;
      font-size: 24px;
      color: #fff;
      text-align: center;
    }

    .text {
      font-size: 16px;

      :deep(.el-input-inner) {
        height: 48px;
        line-height: 48px;
        color: #fff;

        &::placeholder {
          color: rgb(255 255 255 / 20%);
        }
      }
    }

    .btn {
      width: 100%;
    }
  }
}

.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  margin-left: 20px;
  cursor: pointer;
}

.change-lang {
  position: fixed;
  top: 20px;
  right: 20px;

  :deep {
    .change-lang {
      height: 24px;

      &:hover {
        background: none;
      }

      .icon {
        color: #fff;
      }
    }
  }
}
</style>
