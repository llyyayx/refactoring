<template>
  <div v-loading="loading" class="device-container">
    <Gmps ref="gmps" @load="load" />
    <quick />
    <Spray />
    <Drops />
    <Toolkit />
    <sprayPlan />
    <canvas id="myCan" width="300" height="300" style="display:none;" />
  </div>
</template>

<script>
import Gmps from '@/components/GMaps'
import Spray from './components/spray'
import Drops from './components/drops'
import Toolkit from './components/toolkit'
import sprayPlan from './components/sprayPlan'
import quick from './components/quick'
import mapFun from '@/utils/mapFun'
import { getDevice } from '@/api/deviceControl'
import { drops, pump, fertilizer, soil, weather, spray, ndvi, height, canopy } from './parsing'
export default {
  name: 'DeviceControl',
  components: {
    Gmps,
    Spray,
    Drops,
    Toolkit,
    sprayPlan,
    quick
  },
  data() {
    return {
      loading: true,
      map: {}
    }
  },
  watch: {

  },
  methods: {

    async getContent() {
      const response = await getDevice(1)
      const { lat, lng, devices } = response[0]
      this.setMap(lat, lng)
      const config = this.$config
      const self = this
      devices.forEach((item, index) => {
        switch (item.dclass) {
          case config.DROPS_CLASS: drops(item, self); break
          case config.PUMP_CLASS: pump(item); break
          case config.FERTILIZER_CLASS: fertilizer(item); break
          case config.SOIL_CLASS: soil(item, self); break
          case config.WEATHER_CLASS: weather(item); break
          case config.SPRAY_CLASS: spray(item, self); break
          case config.NDVI_CLASS: ndvi(item); break
          case config.HEIGHT_CLASS: height(item); break
          case config.CANOPY_CLASS: canopy(item); break
        }
      })
      this.loading = false
      /* console.log(this.$store.state.device.drops)
      console.log(this.$store.state.device.dropsCell)
      console.log(this.$store.state.device.dropsValve)
      console.log(this.$store.state.device.pump)
      console.log(this.$store.state.device.fertilizer)
      console.log(this.$store.state.device.soil)
      console.log(this.$store.state.device.weather)
      console.log(this.$store.state.device.spray)
      console.log(this.$store.state.device.sprayValve)
      console.log(this.$store.state.device.ndvi)
      console.log(this.$store.state.device.height)
      console.log(this.$store.state.device.canopy) */
    },

    /**
     * 地图组件实例化完成触发事件
     * @param { Object } map 地图实例化对象
     */
    load(map) {
      this.map = map
      this.$store.dispatch('map/setMap', map)
      this.getContent()
      this.mapRgTop()
    },

    /**
     * 设置地图中心点
     * @param { String } lat 纬度
     * @param { String } lng 经度
     */
    setMap(lat, lng) {
      this.$refs.gmps.setCenter(lat, lng)
    },

    mapRgTop() {
      mapFun.mapRgTop(this.map, '工具箱', require('@/icons/device/tool.png'), () => {
        this.$store.dispatch('control/toolShow', true)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
.device {
  &-container{
    position: relative;
    height: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
