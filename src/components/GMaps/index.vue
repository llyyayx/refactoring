<template>
  <div id="Gmaps">
    <remote-js :js-url="url" :js-load-call-back="loadRongJs" />
  </div>
</template>
<script>
import RemoteJs from './components/remote'
import mapFun from '@/utils/mapFun'
export default {
  components: { RemoteJs },
  props: {
    mapData: {
      type: Object,
      required: false,
      default: () => {
        return {
          lat: 38.123456,
          lng: 118.123456,
          zoom: 15
        }
      }
    }
  },
  data() {
    return {
      url: 'http://img.intelirri.com/Fqsb1fHmFpzhWpEvrB9IAhGH6QL3',
      map: {}
    }
  },
  methods: {
    // 初始化地图，并触发{父组件load事件(地图实例化完毕事件)：传递new map函数(地图实例化对象)}
    loadRongJs() {
      var options = {
        zoom: this.mapData.zoom,
        center: { lat: this.mapData.lat, lng: this.mapData.lng },
        mapTypeId: 'hybrid',
        gestureHandling: 'greedy',
        fullscreenControl: false
      }
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(document.getElementById('Gmaps'), options)
      this.map = map
      this.$emit('load', map)
    },

    /**
     * 设置地图中心点
     * @param { String } lat 纬度
     * @param { String } lng 经度
     */
    setCenter(lat, lng) {
      var mapLat = parseFloat(lat)
      var mapLng = parseFloat(lng)
      this.map.setCenter({ lat: mapLat, lng: mapLng })
    },

    ...mapFun

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #Gmaps {
    width: 100%;
    height: 100%;
  }
</style>
