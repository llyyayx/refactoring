<template>
  <div class="device-container">
    <Gmps :map-data="mapData" />
  </div>
</template>

<script>
import Gmps from '@/components/GMaps'
import { getDevice } from '@/api/deviceControl'
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
    getDevice(1).then(response => {
      console.log(response)
    }).catch(() => {
      console.log('error')
    })
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
