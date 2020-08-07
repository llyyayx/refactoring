/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

export default {

  /**
  * 设置地图中心点
  * @param { Object } map 地图对象
  * @param { Number } lat 纬度
  * @param { Number } lng 经度
  */
  setCenter(map, lat, lng) {
    map.setCenter(lat, lng)
  },

  /**
  * 设置点
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
  },

  /**
   * 地图标点点击事件
   * @param { mapSpot } mapSpot 地图标点实例化对象
   * @param { Function } callback 事件回调函数
   */
  marKerClickEvent(mapSpot, callback) {
    google.maps.event.addListener(mapSpot, 'click', callback)
  },

  /**
   * 地图上绘制多边形
   * @param { Object } map 地图实例化对象
   * @param { Array } kml 区域经纬度数组-二维数组
   * @param { String } color 区域颜色
   */
  mapPolygon(map, kml, color) {
    // eslint-disable-next-line no-eval
    const areaKml = eval(kml)
    areaKml.forEach((item) => {
      const child = item
      const array = []
      child.forEach((el, index) => {
        array.push({
          lng: parseFloat(el.lng),
          lat: parseFloat(el.lat)
        })
      })
      const bermudaTriangle = new google.maps.Polygon({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        paths: array
      })
      bermudaTriangle.setMap(map)
    })
  },

  /**
   * 地图右上角添加选项按钮
   * @param { Object } map 地图对象
   * @param { String } name 按钮名称
   * @param { String } icon 按钮图标
   * @param { Function } callback 按钮点击事件回调函数
   */
  mapRgTop(map, name, icon, callback) {
    var centerControlDiv = document.createElement('div')
    var controlUI = document.createElement('div')
    controlUI.style.width = '40px'
    controlUI.style.height = '40px'
    controlUI.style.margin = '10px'
    controlUI.style.backgroundColor = '#fff'
    controlUI.style.borderRadius = '2px'
    controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px'
    controlUI.style.cursor = 'pointer'
    controlUI.style.position = 'relative'
    controlUI.title = '打开' + name
    centerControlDiv.appendChild(controlUI)
    controlUI.classList.add('call')
    // 添加图片
    var controlText = document.createElement('img')
    controlText.src = icon
    controlText.style.width = '65%'
    controlText.style.display = 'block'
    controlText.style.position = 'absolute'
    controlText.style.left = '50%'
    controlText.style.top = '50%'
    controlText.style.transform = 'translate(-50%,-50%)'
    controlUI.appendChild(controlText)
    var chicago = { lat: 41.85, lng: -87.65 }
    // 绑定事件
    controlUI.addEventListener('click', function() {
      callback && callback()
    })
    centerControlDiv.index = 1
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv)
  },

  infowindow(map, mapSpot, attr, serialno) {
    if (Object.prototype.toString.call(attr) === '[object Array]' && attr.length > 0) {
      let content = ''
      attr.forEach((el) => {
        content += '<div style="display: flex; align-items: center;"><p style="margin: 0; font-weight:600;">' + el.nameKey +
        ':</p><p style="margin: 0 0 0 5px; font-weight:600;">' + el.val + el.unit + '</p></div>'
      })
      const window = new google.maps.InfoWindow({
        disableAutoPan: true,
        content: '<div class="' + serialno + '">' + content + '</div>'
      })
      window.open(map, mapSpot)
      return window
    }
  }

}

