import { Control, icon, marker, popup, polygon } from 'leaflet'

export default {

  /**
  * 设置地图中心点
  * @param { Object } map 地图对象
  * @param { Number } lat 纬度
  * @param { Number } lng 经度
  */
  setCenter(map, lat, lng) {
    map.panTo({ lat: lat, lng: lng })
  },

  /**
  * 设置点
  * @param { Object } map 地图对象
  * @param { Object } obj 点对象
  * @param { String } obj.lng 点经度
  * @param { String } obj.lat 点纬度
  * @param { String } obj.dname 点名称
  * @param { String } obj.icon 点图标资源路径
  * @return { Object } 点对象
  */
  setMarker(map, obj) {
    var myIcon = icon({
      iconUrl: obj.icon,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    })
    var point = marker({ lat: obj.lat, lng: obj.lng }, { icon: myIcon, title: obj.dname }).addTo(map)
    return point
  },

  /**
   * 构造一个图标
   * @param { String } url 图标链接
   */
  getIcon(url) {
    return icon({
      iconUrl: url,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    })
  },

  /**
   * 地图标点点击事件
   * @param { mapSpot } mapSpot 地图标点实例化对象
   * @param { Function } callback 事件回调函数
   */
  marKerClickEvent(mapSpot, callback) {
    mapSpot.on('click', function() {
      callback && callback()
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
    // 绑定事件
    controlUI.addEventListener('click', function() {
      callback && callback()
    })
    // 实例化类
    var LControl = Control.extend({
      options: {
        position: 'topright'
      },
      onAdd: function() {
        return centerControlDiv
      }
    })
    new LControl().addTo(map)
  },

  /**
   * 创建信息窗口
   * @param { Object } map 地图对象
   * @param { Object } mapSpot 坐标点对象
   * @param { Array } attr 属性
   * @param { String } serialno 设备标识
   */
  infowindow(map, mapSpot, attr, serialno) {
    if (Object.prototype.toString.call(attr) === '[object Array]' && attr.length > 0) {
      let content = ''
      attr.forEach((el) => {
        content += '<div style="display: flex; align-items: center;"><p style="margin: 0; font-weight:600;">' + el.nameKey +
        ':</p><p style="margin: 0 0 0 5px; font-weight:600;">' + el.val + el.unit + '</p></div>'
      })
      const layer = popup({ autoClose: false, closeOnClick: false }).setContent('<div class="' + serialno + '">' + content + '</div>')
      mapSpot.bindPopup(layer)
      return layer
    }
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
      polygon(array, { color: '#FF0000', fillColor: color, weight: 1 }).addTo(map)
    })
  },

  /**
   * 点击地图查看位置
   * @param { Object } map 地图对象
   */
  lookAddr(map) {
    map.on('click', function(e) {
      console.log(e.latlng)
    })
  }

}
