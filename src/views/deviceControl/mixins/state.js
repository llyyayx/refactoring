import { real } from '@/api/deviceControl'
export default {
  methods: {
    /**
     * http接口解析阀门状态(滴灌喷灌)
     * @param { Object } res 状态接口返回值
     * @param { Object } controller 阀控器下属阀门
     */
    httpJxValve(res, controller) {
      controller.forEach((valve) => {
        if (res.status === 2 || !res.regs) {
          const breake = require('@/icons/device/break/fm.png')
          valve.icon && (valve.icon = breake)
          valve.mapSpot && valve.mapSpot.setIcon(breake)
        } else {
          const port = (valve.rtuPort || valve.port) - 1
          if (res.regs['DO.' + port.toString()]) {
            const run = require('@/icons/device/run/fm.png')
            valve.icon && (valve.icon = run)
            valve.mapSpot && valve.mapSpot.setIcon(run)
          } else {
            const close = require('@/icons/device/close/fm.png')
            valve.icon && (valve.icon = close)
            valve.mapSpot && valve.mapSpot.setIcon(close)
          }
        }
      })
    },

    /**
     * matt订阅解析全设备状态
     * @param { Object } res mqtt返回值
     * @param { Object } device 设备对象
     */
    mqttJxState(res, device) {
      const attr = device.attr
      if (Object.prototype.toString.call(attr) !== '[object Array]') return
      attr.forEach((el) => {
        let result
        if (Object.prototype.toString.call(el.rules) === '[object Function]') {
          result = el.rules(res, device)
        } else {
          const val = res.regs[el.nameKey]
          if (val !== undefined) {
            result = el.dataFun(val, device)
          }
        }
        if (result !== undefined) el.val = result
        // 属性回调事件
        if (el.callback && result !== undefined) {
          el.callback.forEach((fun) => {
            fun(result, device)
          })
        }
      })
    },

    // 查询滴灌阀门状态
    dropValveState() {
      const _this = this
      const dropsValve = this.$store.state.device.dropsValve
      dropsValve.forEach((item) => {
        // 将滴灌下边的阀门按照阀控器分组
        const controller = _this.group(item, 'rtuSerialno')
        controller.forEach((el) => {
          real(el[0].rtuSerialno).then((res) => { this.httpJxValve(res, el) })
        })
      })
    },

    // 查询喷灌喷头状态
    sprayValveState() {
      const _this = this
      const sprayValve = this.$store.state.device.sprayValve
      sprayValve.forEach((item) => {
        // 将喷灌下边的喷头按照阀控器分组
        const controller = _this.group(item, 'rtuSerialno')
        controller.forEach((el) => {
          real(el[0].rtuSerialno).then((res) => { this.httpJxValve(res, el) })
        })
      })
    },

    /**
     * 方法：数组对象按属性分组
     * @param { Array } array 数组里边是对象
     * @param { String } attr 属性名称
     * @return { Array } 分好组的数组，格式: [[{}],[{}]]
     */
    group(array, attr) {
      // 存放现有循环的阀控
      const existing = []
      // 按喷头分组的存放
      const group = []
      array.forEach((el) => {
        const index = existing.indexOf(el[attr])
        if (index < 0) {
          existing.push(el[attr])
          group.push([el])
        } else {
          group[index].push(el)
        }
      })
      return group
    }

  }
}
