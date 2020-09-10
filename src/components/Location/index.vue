<template>
  <div v-loading="loading" class="maps-container">
    <div class="place">{{ tag }}</div>
    <div class="serach">
      <el-input v-model="input" placeholder="请输入详细地址" />
      <el-button type="primary" @click="serach">搜索</el-button>
    </div>
    <LMaps ref="gmps" :map-data="mapData" @load="load" />
  </div>
</template>

<script>
import { marker, icon, latLng } from 'leaflet'
import LMaps from '@/components/LMaps'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
export default {
  components: {
    LMaps
  },
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
  data: function() {
    return {
      // 地图对象
      maps: {},
      // 点击标点集合
      markers: [],
      // 选择点的经纬度
      location: {},
      // 位置提示文字
      tag: `当前位置: ${this.mapData.center[1]}，${this.mapData.center[0]}`,
      // 输入地址转地理编码
      input: '',
      // 加载
      loading: false
    }
  },
  watch: {
    mapData: {
      handler(newValue, oldValue) {
        this.addMarker(latLng({ lat: newValue.center[0], lng: newValue.center[1] }))
      },
      deep: true,
      immediate: false
    }
  },
  methods: {
    /**
     * 地图组件加载完成回调事件
     * @param { Object } map 地图对象，组件返回
     */
    load(map) {
      this.maps = map
      const self = this
      self.addMarker(latLng({ lat: this.mapData.center[0], lng: this.mapData.center[1] }))
      map.on('click', function(event) {
        self.addMarker(event.latlng)
      })
    },

    /**
     * 地理编码：将地址转为经纬度坐标，并定位至此
     */
    serach() {
      const self = this
      const address = this.input
      const provider = new OpenStreetMapProvider()
      this.loading = true
      provider.search({ query: address }).then((e) => {
        if (e.length > 0) {
          const lat = e[0].y
          const lng = e[0].x
          self.addMarker(latLng({ lat: lat, lng: lng }))
          self.maps.panTo({ lat: lat, lng: lng })
        } else {
          self.$message({
            type: 'error',
            message: '未查询到结果'
          })
        }
        self.loading = false
      })
    },

    /**
     * 添加地图点
     * @param { Object } location
     * location.lng: 点经度
     * location.lat: 点纬度
     */
    addMarker(location) {
      let markers = this.markers
      // 清空上一次的点
      for (let i = 0; i < markers.length; i++) {
        markers[i].remove()
      }
      markers = []
      this.location = {
        lng: location.lng,
        lat: location.lat
      }
      const text = '当前位置: [' + location.lng.toPrecision(9) + '，' + location.lat.toPrecision(9) + ']'
      this.tag = text
      const myIcon = icon({
        iconUrl: require('@/icons/device/marker.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
      const point = marker({ lat: location.lat, lng: location.lng }, { icon: myIcon }).addTo(this.maps)
      this.markers.push(point)
    },

    /**
     * 父组件通过该方法获得选定的经纬度
     */
    getLocation() {
      return this.location
    }
  }
}
</script>

<style lang="scss" scoped>
  .maps-container{
    height: 300px;
    position: relative;
    & .place{
        padding: 10px 20px;
        border-radius: 5px;
        position: absolute;
        bottom: 15px;
        background-color: #FFF;
        width: 280px;
        border-width: 0;
        box-sizing: border-box;
        right: 80px;
        z-index: 2;
        box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    }
    & .serach{
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        display: flex;
        align-items: stretch;
        & >>> .el-input__inner{
            border-radius: 4px 0 0 4px;
        }
        & >>> .el-button--medium{
            border-radius: 0 4px 4px 0;
        }
    }
  }
</style>
