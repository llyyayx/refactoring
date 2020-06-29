<template>
  <div class="sensor-container">
    <transition name="el-fade-in">
      <div v-show="show" ref="drops" class="sensor-box">
        <!-- 顶部按钮 -->
        <el-row class="sensor__top">
          <el-col :span="2" :offset="22" class="sensor__icon">
            <el-tooltip content="全屏">
              <svg-icon icon-class="fullscreen" @click="full" />
            </el-tooltip>
            <el-tooltip content="关闭">
              <svg-icon icon-class="close" class="sensor__icon--close" @click="closeDrops" />
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.sensor-box {
    background-color: rgba($color: #FFFFFF, $alpha: 0.9);
    width: 600px;
    max-height: 85%;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 12px;
    position: absolute;
    top: 60px;
    right: 10px;
    padding: 10px;
    box-sizing: border-box;
    & .sensor__top {
      width: 100%;
      top: 0;
      & .sensor__icon {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;
        color: #666;
        cursor: pointer;
        & .sensor__icon--close{
            font-size:23px;
            margin-left: 10px;
        }
      }
    }
}
</style>
