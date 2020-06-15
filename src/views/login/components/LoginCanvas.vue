<template>
  <canvas id="canvas" />
</template>
<script>
export default {
  data() {
    return {
      WIDTH: 0,
      HEIGHT: 0,
      POINT: 0,
      canvas: {},
      context: {},
      circleArr: []
    }
  },
  mounted() {
    var _this = this
    _this.WIDTH = window.innerWidth
    _this.HEIGHT = window.innerHeight
    _this.POINT = 35
    _this.canvas = document.getElementById('canvas')
    _this.canvas.width = _this.WIDTH
    _this.canvas.height = _this.HEIGHT
    _this.context = _this.canvas.getContext('2d')
    _this.context.strokeStyle = 'rgba(255,255,255,0.1)'
    _this.context.strokeWidth = 1
    _this.context.fillStyle = 'rgba(255,255,255,0.2)'
    _this.circleArr = []
    _this.init()
    setInterval(function() {
      for (var i = 0; i < _this.POINT; i++) {
        var cir = _this.circleArr[i]
        cir.x += cir.moveX
        cir.y += cir.moveY
        if (cir.x > _this.WIDTH) cir.x = 0
        else if (cir.x < 0) cir.x = _this.WIDTH
        if (cir.y > _this.HEIGHT) cir.y = 0
        else if (cir.y < 0) cir.y = _this.HEIGHT
      }
      _this.draw()
    }, 16)
  },
  methods: {
    Line(x, y, _x, _y, o) {
      this.beginX = x
      this.beginY = y
      this.closeX = _x
      this.closeY = _y
      this.o = o
    },
    Circle(x, y, r, moveX, moveY) {
      this.x = x
      this.y = y
      this.r = r
      this.moveX = moveX
      this.moveY = moveY
    },
    num(max, _min) {
      var min = arguments[1] || 0
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    drawCricle(cxt, x, y, r, moveX, moveY) {
      var circle = new this.Circle(x, y, r, moveX, moveY)
      cxt.beginPath()
      cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
      cxt.closePath()
      cxt.fill()
      return circle
    },
    drawLine(cxt, x, y, _x, _y, o) {
      var line = new this.Line(x, y, _x, _y, o)
      cxt.beginPath()
      cxt.strokeStyle = 'rgba(255,255,255,' + o + ')'
      cxt.moveTo(line.beginX, line.beginY)
      cxt.lineTo(line.closeX, line.closeY)
      cxt.closePath()
      cxt.stroke()
    },
    init() {
      this.circleArr = []
      for (var i = 0; i < this.POINT; i++) {
        this.circleArr.push(this.drawCricle(this.context, this.num(this.WIDTH), this.num(this.HEIGHT), this.num(15, 2), this.num(10, -10) / 40, this.num(10, -10) / 40))
      }
      this.draw()
    },
    draw() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      for (var i = 0; i < this.POINT; i++) {
        this.drawCricle(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i].r)
      }
      for (i = 0; i < this.POINT; i++) {
        for (var j = 0; j < this.POINT; j++) {
          if (i + j < this.POINT) {
            var A = Math.abs(this.circleArr[i + j].x - this.circleArr[i].x)
            var B = Math.abs(this.circleArr[i + j].y - this.circleArr[i].y)
            var lineLength = Math.sqrt(A * A + B * B)
            var C = 1 / lineLength * 7 - 0.009
            var lineOpacity = C > 0.03 ? 0.03 : C
            if (lineOpacity > 0) {
              this.drawLine(this.context, this.circleArr[i].x, this.circleArr[i].y, this.circleArr[i + j].x, this.circleArr[i + j].y, lineOpacity)
            }
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
    #canvas{
        position: fixed;
        top: 0;
        left: 0;
    }
</style>
