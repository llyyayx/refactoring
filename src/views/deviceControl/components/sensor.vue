<template>
  <panel :sub-class="'sensor-container'" :child-class="'sensor-box'" :show="show" @close="closeSensor" @full="full">
    <div slot="main">
      <div v-show="soil.length > 0" class="mian-list">
        <div v-show="soil.length > 0" class="sensor__title">墒情站</div>
        <el-row :gutter="20" type="flex" class="sensor__list">
          <el-col v-for="(item, index) in soil" :key="index" :span="column" class="sensor__block">
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
        <el-divider class="sensor__divider" />
      </div>

      <div v-show="ndvi.length > 0" class="mian-list">
        <div class="sensor__title">NDVI</div>
        <el-row :gutter="20" type="flex" class="sensor__list">
          <el-col v-for="(item, index) in ndvi" :key="index" :span="column" class="sensor__block">
            <div class="sensor__block--img">
              <img :src="item.icon">
              <div class="sensor__block--name">{{ item.dname }}</div>
            </div>
            <div class="sensor__block--item">
              <div v-for="(item2, index2) in item.attr" :key="index2" class="sensor__block--attr">
                <div class="sensor__block--namekey minlimit">{{ item2.name }}：</div>
                <div class="sensor__block--val">{{ item2.val }}{{ item2.unit }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-divider class="sensor__divider" />
      </div>

      <div v-show="canopy.length > 0" class="mian-list">
        <div class="sensor__title">冠层站</div>
        <el-row :gutter="20" type="flex" class="sensor__list">
          <el-col v-for="(item, index) in canopy" :key="index" :span="column" class="sensor__block">
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
        <el-divider class="sensor__divider" />
      </div>

      <div v-show="height.length > 0" class="mian-list">
        <div class="sensor__title">高度</div>
        <el-row :gutter="20" type="flex" class="sensor__list">
          <el-col v-for="(item, index) in height" :key="index" :span="column" class="sensor__block">
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
        <el-divider class="sensor__divider" />
      </div>

    </div>
  </panel>
</template>

<script>
import panel from '@/components/Panel'
export default {
  components: {
    panel
  },
  data() {
    return {
      column: 8
    }
  },
  computed: {
    // 滴灌面板的显示隐藏
    show() {
      return this.$store.state.control.sensorShow
    },
    soil() {
      return this.$store.state.device.soil
    },
    ndvi() {
      return this.$store.state.device.ndvi
    },
    canopy() {
      return this.$store.state.device.canopy
    },
    height() {
      return this.$store.state.device.height
    },
    spray() {
      return this.$store.state.device.spray
    }
  },
  watch: {
    canopy(e) {
      // 刷新canvas臂上冠层采集器数据
      let device = []
      const self = this
      e.forEach((el) => {
        if (el.mounted) {
          if (el.pserialno) {
            self.spray.forEach((item) => {
              if (item.serialno === el.pserialno) {
                device.push(item)
              }
            })
          } else {
            device.push(self.spray[0])
          }
        }
      })
      device.forEach((el) => {
        el.canvas.view.onRemove()
        el.canvas.view.onAdd()
        el.canvas.view.draw()
      })
      device = []
    }
  },
  methods: {

    /**
     * 全屏展示组件回调事件
     * @param { Boolean } fullScreen 全屏true 非全屏false
     */
    full(fullScreen) {
      if (fullScreen) {
        this.column = 6
      } else {
        this.column = 8
      }
    },

    // 关闭面板的回调事件
    closeSensor() {
      this.$store.dispatch('control/sensorShow', false)
    }

  }
}
</script>

<style lang="scss" scoped>
.sensor-container {
  & >>> .sensor-box {
    width: 700px;
  }
}

.sensor__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding: 10px 0px 10px 10px;
  box-sizing: border-box;
}

.sensor__list {
  margin: 10px 0;
  padding: 0 10px;
  box-sizing: border-box;
  flex-wrap: wrap;
  & .sensor__block {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    & .sensor__block--img {
      width: 80px;
      padding-right: 10px;
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
      & .minlimit {
        min-width: 78px;
      }
      & .sensor__block--val {
        font-size: 14px;
        color: #333;
        font-weight: 600;
      }
    }
  }
}

.sensor__divider {
  margin: 0 auto 10px;
}

</style>
