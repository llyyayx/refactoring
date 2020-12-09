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
          <div class="too_content--item" @click="partition">
            <div class="tool__img">
              <svg-icon icon-class="zoon" class="icon--zoon" />
            </div>
            <div class="tool__title">喷灌分区</div>
          </div>
          <div class="too_content--item" @click="natural">
            <div class="tool__img">
              <svg-icon icon-class="natural" class="icon--natural" />
            </div>
            <div class="tool__title">土质分布计算</div>
          </div>
          <div class="too_content--item" @click="irrigation">
            <div class="tool__img">
              <svg-icon icon-class="irrigation" class="icon--irrigation" />
            </div>
            <div class="tool__title">喷灌机水量计算</div>
          </div>
          <div class="too_content--item" @click="fert">
            <div class="tool__img">
              <svg-icon icon-class="fert" class="icon--fert" />
            </div>
            <div class="tool__title">变量施肥计算</div>
          </div>
          <div class="too_content--item" @click="setFer">
            <div class="tool__img">
              <svg-icon icon-class="setting" class="icon--setting" />
            </div>
            <div class="tool__title">变量施肥设置</div>
          </div>
          <!-- <div class="too_content--item" @click="natHistroy">
            <div class="tool__img">
              <svg-icon icon-class="histroy" class="icon--histroy" />
            </div>
            <div class="tool__title">土质计算历史</div>
          </div> -->
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
    },

    // 自定义分区
    partition() {
      this.closeTool()
      this.$store.dispatch('control/partitionShow', true)
    },

    // 土质分布计算
    natural() {
      this.closeTool()
      this.$store.dispatch('control/naturalShow', true)
    },

    // 土质计算历史
    natHistroy() {
      this.closeTool()
      this.$store.dispatch('control/natHistroyShow', true)
    },

    // 喷灌机灌水量计算
    irrigation() {
      this.closeTool()
      this.$store.dispatch('control/irrigationShow', true)
    },

    // 喷灌分区施肥计算
    fert() {
      this.closeTool()
      this.$store.dispatch('control/fertilizationShow', true)
    },

    // 施肥计算设置
    setFer() {
      this.closeTool()
      this.$store.dispatch('control/setFerShow', true)
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
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
      & .too_content--item{
        width: 25%;
        margin: 0 0 10px 0;
        cursor: pointer;
        & .tool__img{
          margin: 0 auto 4px;
          text-align: center;
          & img{
            display: block;
            width: 100%;
          }
          & .icon--plan, .icon--zoon, .icon--natural, .icon--histroy, .icon--irrigation, .icon--fert,
          .icon--setting {
            font-size: 56px;
          }
        }
        & .tool__title{
          font-size: 14px;
          text-align: center;
        }
      }
    }
  }
</style>
