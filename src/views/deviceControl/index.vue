<template>
  <div v-loading="loading" class="device-container">
    <Gmps ref="gmps" @load="load" />
    <Spray />
  </div>
</template>

<script>
import Gmps from '@/components/GMaps'
import Spray from './components/spray'
import { getDevice } from '@/api/deviceControl'
import { drops, pump, fertilizer, soil, weather, spray, ndvi, height, canopy } from './parsing'
export default {
  name: 'DeviceControl',
  components: {
    Gmps,
    Spray
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
          case config.DROPS_CLASS: drops(item); break
          case config.PUMP_CLASS: pump(item); break
          case config.FERTILIZER_CLASS: fertilizer(item); break
          case config.SOIL_CLASS: soil(item, self); break
          case config.WEATHER_CLASS: weather(item); break
          case config.SPRAY_CLASS: spray(item); break
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
    load(map) {
      this.map = map
      this.$store.dispatch('map/setMap', map)
      this.getContent()
    },
    setMap(lat, lng) {
      this.$refs.gmps.setCenter(lat, lng)
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
