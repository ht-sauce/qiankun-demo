<template>
  <div class="login">
    <div class="content">
      <!--图片区域-->
      <div class="img">
        <img src="~@/assets/images/logo.png" alt="logo" />
      </div>
      <!--表单区域-->
      <div class="login-in">
        <span class="title">硅语微前端框架</span>
        <el-form class="form-in" :model="formData" :rules="rules" ref="ruleForm">
          <el-form-item class="form-li" prop="username">
            <el-input
              @keydown.enter="submitForm"
              v-model.trim="formData.username"
              placeholder="请输入您的用户账号"
            >
              <template #prefix>
                <i class="icon-username"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-li" prop="password">
            <el-input
              @keydown.enter="submitForm"
              v-model.trim="formData.password"
              placeholder="请输入您的密码"
              type="password"
            >
              <template #prefix>
                <i class="icon-password"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="form-li" prop="verify">
            <div class="verify-in">
              <el-input
                class="verify-input"
                @keydown.enter="submitForm"
                v-model.trim="formData.verify"
                placeholder="请输入验证码"
              >
                <template #prefix>
                  <i class="icon-checkCode"></i>
                </template>
              </el-input>
              <div class="verify-img">
                <img @click="getPictureVerify" :src="verifySrc" alt="verify" />
              </div>
            </div>
          </el-form-item>
        </el-form>
        <el-button
          :loading="loging"
          class="login-button"
          @click="submitForm"
          type="primary"
          size="medium"
          >登 录</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ElForm, ElFormItem, ElButton, ElInput, ElMessageBox, ElMessage } from 'element-plus'
import { ElMessageBoxOptions } from 'element-plus/lib/el-message-box/src/message-box.type'
import { reactive, toRefs, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services'
import { encode } from 'js-base64'
import { getUUID } from '@/Tool'
import vuex from '@/store'
import { ElFormType } from '@/Types/ElementTypes'
export default {
  emits: ['click'],
  components: { ElForm, ElFormItem, ElButton, ElInput },
  setup() {
    const router = useRouter()
    const data = reactive({
      formData: {
        username: '',
        password: '',
        verify: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入您的用户账号',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入您的密码',
            trigger: 'blur',
          },
        ],
        verify: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur',
          },
        ],
      },
      loging: false,
      verifySrc: '',
    })

    const ruleForm = ref<string | ElFormType>('ruleForm') // 获取表单组件
    let sessionId: string // 登陆唯一id
    // 获取图片验证码
    const getPictureVerify = async () => {
      sessionId = getUUID()
      data.verifySrc = api.UserApi.login.pictureVerify(sessionId)
    }
    getPictureVerify()
    // 登陆函数
    const login = async (isForce = 0) => {
      try {
        const result = await api.UserApi.login.in(
          {
            data: {
              ...data.formData,
              isForce: isForce, //1强制登录 0普通登录
              password: encode(data.formData.password),
            },
            error: false,
          },
          sessionId,
        )
        return Promise.resolve(result)
      } catch (e) {
        return Promise.reject(e)
      }
    }
    // 登陆验证
    const submitForm = () => {
      data.loging = true
      const elform = ruleForm.value as ElFormType
      elform.validate((valid: boolean) => {
        if (!valid) {
          data.loging = false
          return null
        }
        loginHandle()
      })
    }

    async function loginHandle(isForce = 0) {
      try {
        const res = await login(isForce)
        const { token, user } = res.data ?? {}

        vuex.commit('set_data', {
          user: {
            token: token,
            info: user,
            orgid: user.organizationId,
          },
        })
        // console.log(vuex.state)
        router.replace('/')

        //console.log(data)
        data.loging = false
      } catch (e) {
        data.loging = false
        const code = e.data?.code
        if (code && code === 50111) {
          loginHandleTwo()
          return e
        }
        ElMessage({
          message: '密码或验证码错误',
          type: 'error',
        })
        getPictureVerify()
      }
    }
    // 登陆二次验证
    async function loginHandleTwo() {
      try {
        await ElMessageBox.confirm('当前账号已在其它地方登录，是否继续登录？', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
        } as ElMessageBoxOptions)
        loginHandle(1) // 强制登陆
      } catch (e) {
        ElMessage({
          message: '密码或验证码错误',
          type: 'error',
        })
        getPictureVerify()
      }
    }

    return {
      ...toRefs(data),
      ruleForm,
      submitForm,
      getPictureVerify,
    }
  },
}
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(~@/assets/images/login-bg.png) no-repeat;
  // input输入框样式重置
  ::v-deep(.el-input__inner) {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid #dcdfe6;
  }
}
.content {
  height: 550px;
  display: flex;
  box-shadow: var(--box-shadow);
  background: var(--white);
}
.img {
  width: 450px;
  height: 100%;
  > img {
    width: 100%;
    height: 100%;
  }
}
// 登陆模块
.login-in {
  width: 500px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  background: var(--white);
  .title {
    color: var(--main-color);
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 50px;
  }
}
.form-in {
  width: 350px;
  .icon-username {
    display: inline-block;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    width: 16px;
    height: 14px;
    position: relative;
    top: 7px;
    background-image: url(~@/assets/images/login-username.png);
  }
  .icon-password {
    @extend .icon-username;
    background-image: url(~@/assets/images/login-password.png);
  }
  .icon-checkCode {
    @extend .icon-username;
    background-image: url(~@/assets/images/login-checkCode.png);
    height: 16px;
  }
  .form-li {
    margin-bottom: 30px !important;
  }
  .verify-in {
    display: flex;
    .verify-input {
      width: 190px;
    }
    .verify-img {
      margin-left: auto;
      width: 120px;
      height: 35px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.login-button {
  width: 350px;
  background: var(--main-color);
  font-size: 16px;
}
</style>
