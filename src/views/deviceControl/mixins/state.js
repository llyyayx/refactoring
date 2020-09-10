import { real, action } from '@/api/deviceControl'
import mapFun from '@/utils/lmapFun'
export default {
  methods: {

    /**
     * 方法：matt订阅解析全设备状态
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

    /**
     * 方法：http接口解析阀门状态(滴灌喷灌)
     * @param { Object } res 状态接口返回值
     * @param { Object } controller 阀控器下属阀门
     */
    httpJxValve(res, controller) {
      controller.forEach((valve) => {
        if (res.status === 2 || !res.regs) {
          const breake = require('@/icons/device/break/fm.png')
          valve.icon && (valve.icon = breake)
          valve.mapSpot && valve.mapSpot.setIcon(mapFun.getIcon(breake))
        } else {
          const port = (valve.rtuPort || valve.port) - 1
          if (res.regs['DO.' + port.toString()]) {
            const run = require('@/icons/device/run/fm.png')
            valve.icon && (valve.icon = run)
            valve.mapSpot && valve.mapSpot.setIcon(mapFun.getIcon(run))
          } else {
            const close = require('@/icons/device/close/fm.png')
            valve.icon && (valve.icon = close)
            valve.mapSpot && valve.mapSpot.setIcon(mapFun.getIcon(close))
          }
        }
      })
    },

    /**
     * 方法: 采集设备主动拉取状态函数封装
     * @param { Object } device 设备列表
     * @param { String } breakIcon 掉线图标
     */
    packaging(device, breakIcon) {
      const _this = this
      device.forEach((el) => {
        real(el.serialno).then((res) => {
          if (res.status === 2 || !res.regs) {
            el.icon && (el.icon = breakIcon)
            el.mapSpot && el.mapSpot.setIcon(mapFun.getIcon(breakIcon))
          } else {
            _this.mqttJxState(res, el)
          }
        })
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

    // 召回喷灌机喷头pwm状态
    sprayValvePwm() {
      const _this = this
      const sprayValve = this.$store.state.device.sprayValve
      sprayValve.forEach((item) => {
        // 将喷灌下边的喷头按照阀控器分组
        const controller = _this.group(item, 'rtuSerialno')
        controller.forEach((el) => {
          const nameKey = el[0].command.refPwm.nameKey
          const params = el[0].command.refPwm.params()
          const data = []
          nameKey.forEach((item) => {
            data.push({
              namekey: item,
              params: params
            })
          })
          action({
            serialno: el[0].rtuSerialno,
            actions: data
          })
        })
      })
    },

    // 查询墒情站状态
    soilState() {
      this.packaging(this.$store.state.device.soil, require('@/icons/device/break/sqz.png'))
    },

    // 查询冠层站状态
    canopyState() {
      this.packaging(this.$store.state.device.canopy, require('@/icons/device/break/canopy.png'))
    },

    // 查询NDVI状态
    ndviState() {
      this.packaging(this.$store.state.device.ndvi, require('@/icons/device/break/ndvi.png'))
    },

    // 查询高度状态
    heightState() {
      this.packaging(this.$store.state.device.height, require('@/icons/device/break/height.png'))
    },

    // 查询喷灌机状态
    sprayState() {
      this.packaging(this.$store.state.device.spray, require('@/icons/device/break/pg.png'))
    },

    // 查询水泵状态
    pumpState() {
      this.packaging(this.$store.state.device.pump, require('@/icons/device/break/sb.png'))
    },

    // 查询施肥机状态
    sfState() {
      this.packaging(this.$store.state.device.fertilizer, require('@/icons/device/break/sf.png'))
    },

    // 查询气象站状态
    weatherState() {
      this.packaging(this.$store.state.device.weather, require('@/icons/device/break/qxz.png'))
    },

    // 查询全部设备状态
    stateAll() {
      this.dropValveState()
      this.sprayValveState()
      // this.sprayValvePwm()
      this.soilState()
      this.canopyState()
      this.ndviState()
      this.heightState()
      this.sprayState()
      this.pumpState()
      this.sfState()
      this.weatherState()
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
