<template>
  <transition name="el-zoom-in-center">
    <div v-show="show" class="tool-container">
      <div class="tool-box">
        <div class="tool__header">
          <div class="tool__header--text">工具箱</div>
          <svg-icon icon-class="close" class="icon--close" @click="closeTool" />
        </div>
        <div class="tool__content">
          <div class="too_content--item" @click="sprayPlan">
            <div class="tool__img">
              <svg-icon icon-class="pgplan" class="icon--plan" />
            </div>
            <div class="tool__title">喷灌计划</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    show() {
      return this.$store.state.control.toolShow
    }
  },
  methods: {

    // 关闭工具箱
    closeTool() {
      this.$store.dispatch('control/toolShow', false)
    },

    // 打开喷灌计划面板
    sprayPlan() {
      this.closeTool()
      this.$store.dispatch('control/pgPlanShow', true)
    }
  }
}
</script>

<style lang="scss" scoped>
    .tool-container{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
    }
    .tool-box{
        width: 600px;
        background-color: #FFFFFF;
        position: absolute;
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        overflow: hidden;
        & .tool__header{
          background-color: #DCDFE6;
          padding: 10px 20px;
          position: relative;
          & .tool__header--text{
              font-size: 16px;
              color: #333;
          }
          & .icon--close{
            color: #666;
            font-size:23px;
            margin-left: 10px;
            cursor: pointer;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        & .tool__content{
            padding: 20px;
            box-sizing: border-box;
            & .too_content--item{
                width: 10%;
                margin: 0 10px 10px 10px;
                & .tool__img{
                    margin: 0 auto 4px;
                    cursor: pointer;
                    text-align: center;
                    & img{
                        display: block;
                        width: 100%;
                    }
                    & .icon--plan{
                        font-size: 56px;
                    }
                }
                & .tool__title{
                    font-size: 14px;
                }
            }
        }
    }
</style>
