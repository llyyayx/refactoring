<template>
  <div :class="[subClass, 'panelCount-container']">
    <transition name="el-fade-in">
      <div v-show="show" ref="panel" :class="[childClass, 'full', 'panelCount-box']">
        <!-- 顶部按钮go -->
        <el-row class="panel__top">
          <el-col :span="2" :offset="22" class="panel__icon">
            <el-tooltip content="全屏">
              <svg-icon icon-class="fullscreen" @click="full" />
            </el-tooltip>
            <el-tooltip content="关闭">
              <svg-icon icon-class="close" class="panel__icon--close" @click="closePanel" />
            </el-tooltip>
          </el-col>
        </el-row>
        <!-- 顶部按钮end -->
        <slot name="main" />
      </div>
    </transition>
    <slot name="dialog" />
  </div>
</template>

<script>
import Draggabilly from 'draggabilly'
export default {
  props: {
    subClass: { type: String, default: '' },
    childClass: { type: String, default: '' },
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      // 是否全屏显示面板
      fullScreen: true
    }
  },
  mounted() {
    // 拖动
    new Draggabilly('.' + this.childClass, {
      containment: '.device-container'
    })
  },
  methods: {
    /**
     * 全屏展示该组件
     */
    full() {
      const deom = this.$refs.panel
      if (!this.fullScreen) {
        deom.classList.add('animation')
        deom.classList.remove('zoom')
        deom.classList.add('full')
        this.fullScreen = true
      } else {
        deom.classList.remove('full')
        deom.classList.add('zoom')
        const time = setTimeout(() => {
          deom.classList.remove('animation')
          clearTimeout(time)
        }, 300)
        this.fullScreen = false
      }
      this.$emit('full', this.fullScreen)
    },
    closePanel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.animation {
  transition: all .3s linear;
}
.panelCount-container{
  & .panelCount-box {
      background-color: rgba($color: #FFFFFF, $alpha: 1);
      overflow-y: auto;
      overflow-x: hidden;
      position: absolute;
      padding: 10px;
      box-sizing: border-box;
      cursor: grab;
      & .panel__top {
        width: 100%;
        top: 0;
        & .panel__icon {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          text-align: right;
          color: #666;
          cursor: pointer;
          & .panel__icon--close{
              font-size:23px;
              margin-left: 10px;
          }
        }
      }
  }
  & .full {
    top: 0 !important;
    left: 0 !important;
    width: 100%;
    max-height: 100%;
    height: 100%;
    border-radius: 0;
    z-index: 10;
  }
  & .zoom {
    width: 720px;
    max-height: 85%;
    top: 60px;
    left: 10px;
    border-radius: 12px;
  }
}
/* 重置滚动条 */
::scrollbar{width:8px; height:8px; border-radius:5px;}
::scrollbar-button{display:none;}
::scrollbar-track  {display:none;}
::scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::scrollbar-corner{display:none;}

::-webkit-scrollbar{width:8px; height: 8px; border-radius:5px;}
::-webkit-scrollbar-button{display:none;}
::-webkit-scrollbar-track  {display:none;}
::-webkit-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-webkit-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-webkit-scrollbar-corner{display:none;}

::-moz-scrollbar{width:8px; height:8px; border-radius:5px;}
::-moz-scrollbar-button{display:none;}
::-moz-scrollbar-track  {display:none;}
::-moz-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-moz-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-moz-scrollbar-corner{display:none;}

::-o-scrollbar{width:8px; height:8px; border-radius:5px;}
::-o-scrollbar-button{display:none;}
::-o-scrollbar-track  {display:none;}
::-o-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-o-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-o-scrollbar-corner{display:none;}

::-ms-scrollbar{width:8px; height:8px; border-radius:5px;}
::-ms-scrollbar-button{display:none;}
::-ms-scrollbar-track  {display:none;}
::-ms-scrollbar-track-piece {background-color: transparent; margin: 12px 0;}
::-ms-scrollbar-thumb {background-color:#e3e3e3; border-radius:15px;}
::-ms-scrollbar-corner{display:none;}
</style>
