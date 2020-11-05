<template>
  <div class="retrieve-container">
    <div class="banner">
      <div class="header-wrap">
        <div class="header-img">
          <img src="@/icons/device/logo.png">
        </div>
        <div class="header-title">重置密码</div>
      </div>
    </div>
    <div class="retrieve-box">
      <!-- 步骤条 -->
      <el-steps :active="active" class="steps">
        <el-step title="确认账号" />
        <el-step title="重置密码" />
        <el-step title="重置成功" />
      </el-steps>
      <!-- 内容 -->
      <el-carousel ref="carousel" indicator-position="none" :loop="false" :autoplay="false" arrow="never" height="350px" class="carousel">
        <el-carousel-item>
          <el-input v-model="account" placeholder="请输入绑定的手机号" class="put" />
          <el-button type="primary" class="btn" @click="testing">确认</el-button>
        </el-carousel-item>
        <el-carousel-item>
          <div class="demo-input-suffix">
            <span>新密码：</span>
            <el-input v-model="password" placeholder="请输入新的密码" type="password" class="put put2" />
          </div>
          <div class="demo-input-suffix">
            <span>确认密码：</span>
            <el-input v-model="confirmPassword" placeholder="请输入确认密码" type="password" class="put put2" />
          </div>
          <div class="demo-input-suffix">
            <span>手机号：</span>
            <el-input v-model="account" disabled class="put" />
            <p class="update" @click="() => {this.$refs.carousel.prev()}">修改</p>
          </div>
          <div class="demo-input-suffix2">
            <span>验证码：</span>
            <el-input v-model="code" placeholder="请输入验证码" class="put put2" />
            <el-button class="btn" type="primary" :disabled="codeBtn" @click="getCode">{{ codeText }}</el-button>
          </div>
          <el-button type="primary" class="btn" @click="putUp">重置密码</el-button>
        </el-carousel-item>
        <el-carousel-item>
          <div class="tip">恭喜您密码重置成功, 3秒后跳转......</div>
          <el-button type="primary" class="btn" @click="toLink">立即跳转</el-button>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="copyright">Copyright © 2020 中农智冠(北京)科技有限公司 保留所有权利</div>
  </div>
</template>
<script>
import { debounce } from '@/utils'
export default {
  name: 'Retrieve',
  data() {
    return {
      active: 0,
      account: '',
      password: '',
      confirmPassword: '',
      codeText: '获取验证码',
      codeBtn: false,
      code: ''
    }
  },
  methods: {

    // 验证手机号
    testing: debounce(function() {
      const reg = new RegExp(/^[^\D]{11}$/)
      if (reg.test(this.account)) {
        this.$refs.carousel.next()
        this.active = 1
      } else {
        this.$message.error('请输入正确的手机号')
      }
    }, 500, false),

    // 获取验证码
    getCode() {
      const _this = this
      let i = 60
      this.codeText = i + 'S'
      var time = setInterval(function() {
        i--
        _this.codeText = i + 'S'
        if (i === 0) {
          clearInterval(time)
          _this.codeText = '获取验证码'
          _this.codeBtn = false
        }
      }, 1000)
      this.codeBtn = true
    },

    // 重置
    putUp() {
      this.$refs.carousel.next()
      this.active = 2
      setTimeout(() => {
        this.toLink()
      }, 3000)
    },

    // 跳转到登陆页面
    toLink() {
      this.$router.push({ path: '/login' })
    }

  }
}
</script>
<style lang="scss" scoped>
.retrieve-container {
     position: relative;
     height: 100%;
     & .banner {
      width: 100%;
      display: inline-block;
      background-color: #107bf8
    }
    & .header-wrap {
      width: 60%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 10px 0;
      & .header-img {
        width: 120px;
        & img {
          display: block;
          width: 100%;
        }
      }
      & .header-title {
        margin-left: 15px;
        padding-left: 15px;
        border-left: 1px solid #6594f6;
        color: #fff;
        font-size: 16px;
      }
    }
    & .copyright {
      background-color: #ececec;
      text-align: center;
      font-size: 14px;
      color: #999;
      padding: 16px 0;
      position: fixed;
      bottom: 0;
      width: 100%;
    }
    & .retrieve-box {
        width: 980px;
        margin: 160px auto;
        & .steps {
            width: 510px;
            margin: 0 auto;
        }
        & .carousel {
            width: 510px;
            margin: 0 auto;
            padding: 30px 0;
            text-align: center;
            & .put {
                width: 80%;
                font-size: 14px;
                & >>> .el-input__inner {
                    height: 40px;
                    line-height: 40px;
                }
            }
            & .btn {
               width: 80%;
               margin: 20px auto 0;
            }
            & .demo-input-suffix {
                width: 80%;
                margin: 30px auto 0;
                display: flex;
                align-items: center;
                & span {
                    display: inline-block;
                    width: 80px;
                    flex-shrink: 0;
                    text-align: right;
                    font-size: 14px;
                }
                & .put2 {
                    width: 100%;
                    flex-grow: 1;
                    flex-shrink: 1;
                }
                & .update {
                  width: auto;
                  margin-left: 20px;
                  color: #409EFF;
                  font-size: 14px;
                  flex-shrink: 0;
                  cursor: pointer;
                }
            }
            & .demo-input-suffix2 {
                width: 80%;
                margin: 30px auto 0;
                display: flex;
                align-items: center;
                & span {
                    display: inline-block;
                    width: 80px;
                    flex-shrink: 0;
                    text-align: right;
                    font-size: 14px;
                }
                & .put2 {
                    width: 100%;
                    flex-shrink: 1;
                    flex-grow: 1;
                }
                & .btn {
                    text-align: center;
                    margin-left: 20px;
                    margin-top: 0;
                    width: 100px;
                }
            }
            & .tip {
              font-size: 20px;
              font-weight: bold;
              margin-top: 20px;
            }
        }
    }
}
</style>
