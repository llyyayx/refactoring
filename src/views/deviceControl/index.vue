<template>
  <div class="device-container">
    <Gmps :map-data="mapData" />
  </div>
</template>

<script>
import Gmps from '@/components/GMaps'
import { getDevice } from '@/api/deviceControl'
import { drops, pump, fertilizer, soil, weather, spray, ndvi, height, canopy } from './parsing'
export default {
  name: 'DeviceControl',
  components: {
    Gmps
  },
  data() {
    return {
      mapData: {
        lat: 38.123456,
        lng: 118.123456,
        zoom: 15,
        marginTop: 30
      }
    }
  },
  watch: {

  },
  mounted() {
    this.getContent()
  },
  methods: {
    async getContent() {
      const response = await getDevice(1)
      const { devices } = response[0]
      const config = this.$config
      devices.forEach((item, index) => {
        switch (item.dclass) {
          case config.DROPS_CLASS: drops(item); break
          case config.PUMP_CLASS: pump(item); break
          case config.FERTILIZER_CLASS: fertilizer(item); break
          case config.SOIL_CLASS: soil(item); break
          case config.WEATHER_CLASS: weather(item); break
          case config.SPRAY_CLASS: spray(item); break
          case config.NDVI_CLASS: ndvi(item); break
          case config.HEIGHT_CLASS: height(item); break
          case config.CANOPY_CLASS: canopy(item); break
        }
      })
      console.log(this.$store.state.device.drops)
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
      console.log(this.$store.state.device.canopy)
    }
  }
}
</script>

<style lang="scss" scoped>
.device {
  &-container{
    height: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
