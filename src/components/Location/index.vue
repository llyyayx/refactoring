<template>
  <div class="maps-container">
    <div class="place">{{ tag }}</div>
    <div class="serach">
      <el-input v-model="input" placeholder="请输入详细地址" />
      <el-button type="primary" @click="serach">搜索</el-button>
    </div>
    <Gmps ref="gmps" @load="load" />
  </div>
</template>

<script>
import Gmps from '@/components/GMaps'
export default {
  components: {
    Gmps
  },
  data: function() {
    return {
      // 地图对象
      maps: {},
      // 点击标点集合
      markers: [],
      // 经纬度
      location: {},
      // 位置提示文字
      tag: '当前位置: 0.0,0.0',
      // 输入地址转地理编码
      input: ''
    }
  },
  methods: {
    /**
     * 地图组件加载完成回调事件
     * @param { Object } map 地图对象，组件返回
     */
    load(map) {
      this.maps = map
      const _this = this
      map.addListener('click', function(event) {
        let markers = _this.markers
        // 清空上一次的点
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap()
        }
        markers = []
        const location = event.latLng
        _this.location = {
          lng: location.lng(),
          lat: location.lat()
        }
        const text = '当前位置: [' + location.lng().toPrecision(9) + ',' + location.lat().toPrecision(9) + ']'
        _this.tag = text
        // eslint-disable-next-line no-undef
        const marker = new google.maps.Marker({
          position: location,
          map: map
        })
        _this.markers.push(marker)
      })
    },
    /**
     * 地理编码：将地址转为经纬度坐标，并定位至此
     */
    serach() {
      const _this = this
      const address = this.input
      // eslint-disable-next-line no-undef
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
          _this.maps.setCenter(results[0].geometry.location)
          // eslint-disable-next-line no-undef
          const marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: _this.maps
          })
          _this.markers.push(marker)
          _this.location = {
            lng: results[0].geometry.location.lng(),
            lat: results[0].geometry.location.lat()
          }
          const text = '当前位置: [' + _this.location.lng.toPrecision(9) + ',' + _this.location.lat.toPrecision(9) + ']'
          _this.tag = text
        } else {
          _this.$message({
            type: 'error',
            message: '未查询到结果'
          })
        }
      })
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
