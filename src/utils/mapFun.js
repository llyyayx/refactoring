/* eslint-disable no-undef */

export default {

  /**
  *
  * @param { Object } map 地图对象
  * @param { Object } obj 点对象
  * @param { String } obj.lng 点经度
  * @param { String } obj.lat 点纬度
  * @param { String } obj.icon 点图标资源路径
  * @return { Object } 点对象
  */
  setMarker(map, obj) {
    return new google.maps.Marker({
      position: {
        lng: parseFloat(obj.lng),
        lat: parseFloat(obj.lat)
      },
      icon: {
        url: obj.icon,
        size: new google.maps.Size(50, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(25, 25)
      },
      map: map
    })
  }

}

