<template>
  <panel :sub-class="'sensor-container'" :child-class="'sensor-box'" :show="show" @close="closeSensor" @full="full">
    <div slot="main">
      <div v-show="soil.length > 0" class="sensor__title">墒情站</div>
      <el-row :gutter="20" type="flex" class="sensor__list">
        <el-col v-for="(item, index) in soil" :key="index" :span="8" class="sensor__block">
          <div class="sensor__block--img">
            <img :src="item.icon">
            <div class="sensor__block--name">{{ item.dname }}</div>
          </div>
          <div class="sensor__block--item">
            <div v-for="(item2, index2) in item.attr" :key="index2" class="sensor__block--attr">
              <div class="sensor__block--namekey">{{ item2.name }}：</div>
              <div class="sensor__block--val">{{ item2.val }}{{ item2.unit }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </panel>
</template>

<script>
import panel from '@/components/Panel'
export default {
  components: {
    panel
  },
  computed: {
    // 滴灌面板的显示隐藏
    show() {
      return this.$store.state.control.sensorShow
    },
    soil() {
      return this.$store.state.device.soil
    }
  },
  watch: {
    soil() {
      console.log(this.soil)
    }
  },
  methods: {

    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      return
    },

    // 关闭面板的回调事件
    closeSensor() {
      this.$store.dispatch('control/sensorShow', false)
    }

  }
}
</script>

<style lang="scss" scoped>

.sensor__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px 0px 10px 10px;
  box-sizing: border-box;
}

.sensor__list {
  margin: 10px 0;
  flex-wrap: wrap;
  & .sensor__block {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    & .sensor__block--img {
      padding-right: 16px;
      & img{
        width: 36px;
        display: block;
        margin: 0 auto;
      }
      & .sensor__block--name {
        text-align: center;
        font-size: 14px;
        color: #333;
      }
    }
    & .sensor__block--attr {
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
      align-items: flex-start;
      margin-bottom: 4px;
      & .sensor__block--namekey {
        font-size: 14px;
        color: #666;
        padding-right: 2px;
      }
      & .sensor__block--val {
        font-size: 14px;
        color: #333;
        font-weight: 600;
      }
    }
  }
}

</style>
