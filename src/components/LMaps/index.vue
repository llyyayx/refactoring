<template>
  <l-map id="Lmaps" :zoom="mapData.zoom" :center="mapData.center" @ready="ready">
    <l-tile-layer :url="url" />
  </l-map>
</template>
<script>
import { LMap, LTileLayer } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  components: { LMap, LTileLayer },
  props: {
    mapData: {
      type: Object,
      required: false,
      default: () => {
        return {
          center: [38.123456, 118.123456],
          zoom: 20
        }
      }
    }
  },
  data() {
    return {
      // 地图瓦片地址
      url: 'https://mt1.google.cn/maps/vt?lyrs=y&gl=cn&x={x}&y={y}&z={z}',
      // 地图实例化对象
      map: {}
    }
  },
  methods: {
    ready(map) {
      console.log(map)
      this.map = map
      this.$emit('load', map)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    #Lmaps {
        z-index: 0;
    }
</style>
