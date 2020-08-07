export default {
  /**
  * 设置地图中心点
  * @param { Object } map 地图对象
  * @param { Number } lat 纬度
  * @param { Number } lng 经度
  */
  setCenter(map, lat, lng) {
    map.panTo({ lat: lat, lng: lng })
  }
}
