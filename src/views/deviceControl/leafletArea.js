/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
import { latLng, latLngBounds, imageOverlay } from 'leaflet'
export default {

  region(obj) {
    /* 初始化设置 */
    this.swSpot = obj.swSpot // 地块西南角经纬度(西南坐标是圆形区域左半圆切线与下半圆切线的交点){lat:'',lng:''}
    this.neSpot = obj.neSpot // 地块东北角经纬度(东北坐标是圆形区域右半圆切线与上半圆切线的交点)
    this.mapId = obj.mapId // 地图容器(div)的ID
    this.mapZoom = obj.mapZoom // 地图缩放大小(0-18)
    this.mapCenter = obj.mapCenter // 地图中心点坐标{lat:'',lng:''}
    this.mapAdd = obj.mapAdd // 是否需要添加地图
    this.mapObj = obj.mapObj // 地图对象
    this.mapHorizontalSpacing = obj.mapHorizontalSpacing || 0 // 地图与浏览器横向间隔(左)
    this.mapVerticalSpacing = obj.mapVerticalSpacing || 0 // 地图与浏览器纵向间隔(上)

    this.canvasId = obj.canvasId // canvas画板(标签)的ID
    this.gps = obj.gps || 90 // gps起始方位与canvas起始方位的差度(逆时针正,顺时针负)
    this.allArea = obj.allArea || [] // 绘制喷灌区域的数据
    this.arm = obj.arm || 150 // 喷灌机臂长
    this.lineWidth = obj.lineWidth || 1 // 分区之间的线条宽度
    this.pgAngle = obj.pgAngle || 0 // 喷灌机所在角度(位置)
    this.pgWidth = obj.pgWidth || 3 // 喷灌机臂杆宽度
    this.pgColor = obj.pgColor || 'rgba(132,209,73,1)' // 喷灌机臂杆颜色(rgba)
    this.coreColor = obj.coreColor || 'rgba(211,211,211,1)' // 中心支轴点颜色
    this.coreRadii = obj.coreRadii // 中心支轴的半径
    this.complete = obj.complete || { start: 0, end: 0 } // 已经灌溉完成的区域
    this.textShow = obj.textShow // 是否显示区域编号
    this.textColor = obj.textColor || '#FFF' // 编号字体颜色
    this.textSize = obj.textSize || 10 // 字体大小
    this.displayDirection = obj.displayDirection // 是否显示行进方向
    this.direction = obj.direction // 行进方向
    this.directionColor = obj.directionColor || '#77be43' // 方向标识颜色
    this.times = new Date().valueOf() // 当前时间戳，保证唯一id(地图插入图片时)

    this.sensor = obj.sensor || [] // 悬臂传感器
    this.allNozzle = obj.allNozzle || 0 // 喷头总数

    this.swX = 0 // 西南点,X坐标值
    this.swY = 0 // 西南点,Y坐标值
    this.neX = 0 // 东北点,X坐标值
    this.neY = 0 // 东北点,Y坐标值
    this.cetX = 0 // 中心点,X坐标值
    this.cetY = 0 // 中心点,Y坐标值
    this.select = {}
    var _this = this

    /* 构建地图 */
    if (this.mapAdd) {
      var vessel = document.getElementById(this.mapId)
      var mapOptions = {
        zoom: this.mapZoom,
        center: this.mapCenter,
        mapTypeId: google.maps.MapTypeId.SATELLITE
      }
      this.mapObj = new google.maps.Map(vessel, mapOptions)
    }

    var view = {}
    // new地图叠加对象(OverlayView方法)
    view.onAdd = function() {
      var swBound = latLng(_this.swSpot)
      var neBound = latLng(_this.neSpot)
      var bounds = latLngBounds(swBound, neBound)
      var view = imageOverlay('', bounds, { className: 'setimg' + _this.times })
      view.addTo(_this.mapObj)
      view.on('error', function() {
        _this.build()
      })
    }
    view.draw = function() {
      var now = _this.mapObj.getZoom()
      _this.mapObj.setZoom(now - 1)
      _this.mapObj.setZoom(now)
    }
    view.onRemove = function() {
      view.remove()
    }
    view.onAdd()
    view.draw()
    // 把设置好的OverlayView(自定义添加的div图层)添加到地图(map)上
    this.view = view

    // 获取像素点
    function getXy() {
      var swBound = latLng(_this.swSpot)
      var neBound = latLng(_this.neSpot)
      var bounds = latLngBounds(swBound, neBound)
      var pointSw = _this.mapObj.latLngToContainerPoint(bounds.getSouthWest())
      _this.swX = parseInt(pointSw.x) + _this.mapHorizontalSpacing
      _this.swY = parseInt(pointSw.y) + _this.mapVerticalSpacing
      var pointNe = _this.mapObj.latLngToContainerPoint(bounds.getNorthEast())
      _this.neX = parseInt(pointNe.x) + _this.mapHorizontalSpacing
      _this.neY = parseInt(pointNe.y) + _this.mapVerticalSpacing
      var pointCt = _this.mapObj.latLngToContainerPoint(bounds.getCenter())
      _this.cetX = parseInt(pointCt.x) + _this.mapHorizontalSpacing
      _this.cetY = parseInt(pointCt.y) + _this.mapVerticalSpacing
    }
    _this.mapObj.on('zoomend', function() {
      getXy()
    })
    _this.mapObj.on('moveend', function() {
      getXy()
    })

    /* 绘制canvas喷灌区域 */
    this.build = function() {
      // 初始化画布
      var btx = document.getElementById(this.canvasId)
      var ctx = btx.getContext('2d')
      ctx.clearRect(0, 0, 300, 300)
      ctx.save()
      ctx.translate(150, 150)

      // 整区绘制
      for (var i = 0; i < this.allArea.length; i++) {
        // 大分区
        var startAng = (this.allArea[i].lfAng - this.gps) * Math.PI / 180
        var endAng = (this.allArea[i].rgAng - this.gps) * Math.PI / 180
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, 150, startAng, endAng, false)
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = '#000'
        ctx.fillStyle = colorRgba(this.allArea[i].bigColor, 0.2)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()

        var small = this.allArea[i].smallArea
        // 大分区编号
        if (small.length === 0) {
          var start = this.allArea[i].lfAng - this.gps
          var end = this.allArea[i].rgAng - this.gps
          if (start > 0 && end < 0) { // 处理跨越360
            end += 360
          }
          var long = 75
          drawNum(btx, ctx, this, start, end, long, this.allArea[i].num)
        }

        // 与之对应的小分区
        for (var j = small.length - 1; j >= 0; j--) {
          var rgrad = arms(small[j].rgrad, this.arm)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.arc(0, 0, rgrad, startAng, endAng)
          ctx.lineWidth = this.lineWidth
          ctx.strokeStyle = '#000'
          ctx.fillStyle = colorRgba(small[j].smallColor, 0.2)
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
          // 编号
          var start = this.allArea[i].lfAng - this.gps
          var end = this.allArea[i].rgAng - this.gps
          if (start > 0 && end < 0) { // 处理跨越360
            end += 360
          }
          var long = (rgrad - rgrad / 7)
          drawNum(btx, ctx, this, start, end, long, small[j].num)
        }
      }

      // 灌溉完成区域
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.strokeStyle = 'transparent'
      ctx.arc(0, 0, 150, (this.complete.start - this.gps) * Math.PI / 180, (this.complete.end - this.gps) * Math.PI / 180, false)
      ctx.fillStyle = 'rgba(132,209,73, .5)'
      ctx.fill()
      ctx.closePath()
      ctx.stroke()

      // 绘制喷灌机臂杆
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, 150, (this.pgAngle - this.gps) * Math.PI / 180, (this.pgAngle - this.gps) * Math.PI / 180)
      ctx.lineWidth = this.pgWidth
      ctx.strokeStyle = this.pgColor
      ctx.fill()
      ctx.closePath()
      ctx.stroke()

      ctx.restore()

      // 绘制中心支轴
      ctx.beginPath()
      ctx.moveTo(150, 150)
      ctx.arc(150, 150, this.coreRadii, 0, 2 * Math.PI, false)
      ctx.closePath()
      ctx.fillStyle = this.coreColor
      ctx.fill()

      // 绘制方向
      if (this.displayDirection) {
        var centerAngle = 0
        var startAngle = 0
        if (this.direction) {
          centerAngle = 50
          startAngle = 0
        } else {
          centerAngle = 30
          startAngle = 90
        }
        ctx.beginPath()
        ctx.arc(150, 150, 170, 30 * Math.PI / 180, 50 * Math.PI / 180, false)
        ctx.strokeStyle = this.directionColor
        var sjCenter = coordinates(150, 150, 170, centerAngle)
        var sjStart = coordinates(sjCenter.x, sjCenter.y, 20, startAngle)
        ctx.moveTo(sjCenter.x, sjCenter.y)
        ctx.lineTo(sjStart.x, sjStart.y)
        ctx.stroke()
      }

      // 绘制冠层采集站
      var sensor = this.sensor
      if (sensor.length > 0) {
        var allNozzle = this.allNozzle
        var _this = this
        sensor.forEach(function(e) {
          var sprinkler = new Image()
          sprinkler.src = e.icon
          var r = e.nozzle / allNozzle * 140
          var point = coordinates(150, 150, r, _this.pgAngle - _this.gps)
          var x = Math.floor(point.x) - Math.floor(e.size / 2)
          var y = Math.floor(point.y) - Math.floor(e.size / 2)
          ctx.drawImage(sprinkler, x, y, e.size, e.size)
          drawBubble(ctx, x, y - e.size, 40, 20, 5, 8)
        })
      }

      // canvas保存到overlayView中的Image
      var getImg = document.getElementsByClassName('setimg' + this.times)[0]
      getImg.src = ''
      getImg.src = btx.toDataURL('image/png')
      getImg.style.display = 'block'
      getImg.style.width = '100%'
    }

    /* 方法:求数组N项和 */
    // eslint-disable-next-line no-unused-vars
    function sumArray(arryName, n) {
      var sum = 0
      for (var j = 0; j <= n; j++) {
        sum += arryName[j]
      }
      return sum
    }

    /* 方法：根据圆心坐标和半径以及圆上一点到圆心连线与x轴的夹角，求该点的坐标 */
    function coordinates(x0, y0, r, angle) {
      var x = x0 + r * Math.cos(angle * Math.PI / 180)
      var y = y0 + r * Math.sin(angle * Math.PI / 180)
      return { x: x, y: y }
    }

    // 绘制编号
    function drawNum(btx, ctx, _this, start, end, long, text) {
      if (_this.textShow) {
        var textAngle = (start + end) / 2
        var zb_x = long * Math.cos(textAngle * Math.PI / 180)
        var zb_y = long * Math.sin(textAngle * Math.PI / 180)

        ctx.save() // 绘制文字
        ctx.translate(zb_x, zb_y)

        ctx.beginPath()
        ctx.font = _this.textSize + ' Arial'
        var gradient = ctx.createLinearGradient(0, 0, btx.width, 0)
        gradient.addColorStop('1.0', _this.textColor)
        ctx.fillStyle = gradient

        ctx.textAlign = 'center' // 水平居中
        ctx.textBaseline = 'middle' // 垂直居中

        ctx.fillText(text, 0, 0)
        ctx.closePath()
        ctx.stroke()
        ctx.restore() // 文字摆正后复原
      }
    }

    // 臂长转换(把小分区距离范围转化成150范围的)
    function arms(val, arm) {
      return 150 * (val / arm)
    }

    // 封装一个画对话气泡的函数
    function drawBubble(ctx, x, y, minW, minH, r, e) {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.save()
      ctx.strokeStyle = '#fff'
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + minW, y, x + minW, y + minH, r)
      ctx.arcTo(x + minW, y + minH, x, y + minH, r)

      // 三角开始
      ctx.lineTo(x + minW / 2 - e, y + minH)
      ctx.lineTo(x + minW / 2, y + minH + e)
      ctx.lineTo(x + minW / 2 + e, y + minH)
      // 三角结束

      ctx.arcTo(x, y + minH, x, y, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x, y, x + minW, y, r)
      ctx.clip()
      ctx.fillStyle = '#FFF'
      ctx.fillRect(0, 0, 300, 300)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
      // 开始设置值
      ctx.fillStyle = '#000'
      ctx.textBaseline = 'middle' // 垂直居中
      ctx.font = _this.textSize + ' Arial'
      ctx.fillText('14.1℃', x + 1, y + minH / 2)
    }

    // 使用时只需传入十六进制字符串，“n”表示透明度  16进制颜色转rgba
    function colorRgba(str, n) {
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      var sColor = str.toLowerCase()
      // 十六进制颜色转换为RGB格式
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#'
          for (var i = 1; i < 4; i += 1) { // 例如：#eee,#fff等
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 处理六位颜色值
        var sColorChange = []
        for (var i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        return 'rgba(' + sColorChange.join(',') + ',' + n + ')'
      } else {
        return sColor
      }
    }
  }

}

